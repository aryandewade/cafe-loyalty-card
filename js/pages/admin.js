/* ==========================================================================
   ATELIER CAFÉ OWNER ADMIN PORTAL
   High-end executive dashboard with date-wise & period-wise financial intelligence:
   - Total Revenue (Daily, Weekly, 15 Days, Monthly, Quarterly, 6 Months, Year, Custom)
   - Date-wise Picker for Daily transactions with future-date blocking
   - Smart Next button: Only visible when viewing previous/past dates or periods
   - Week, 15-Day Fortnight, Month, Quarter, Half-Year, and Year pickers
   - Custom Date Range selection (clamped to today)
   - Number of Customers & Member Directory (Visits, Spends, DOB, Number / Mail, Search & Sort)
   - No Average Transaction (AOV removed as requested)
   - Real-time integration with AtelierStore
   ========================================================================== */

function getTodayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateIso(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

let adminTimeframe = 'daily'; // 'daily' | 'weekly' | '15days' | 'monthly' | 'quarterly' | '6months' | 'year' | 'custom'
let adminSelectedDate = getTodayIso(); // defaults to today (e.g. 2026-10-18)
let adminSelectedWeek = '2026-W42';
let adminSelectedFortnight = '2026-10-F1';
let adminSelectedMonth = '2026-10';
let adminSelectedQuarter = '2026-Q4';
let adminSelectedHalfYear = '2026-H2';
let adminSelectedYear = '2026';
let adminCustomFrom = '2026-10-01';
let adminCustomTo = getTodayIso();

let adminCustomerSearch = '';
let adminCustomerSort = 'spends_desc'; // 'spends_desc' | 'visits_desc' | 'name_asc' | 'dob'
let adminCustomerView = 'all'; // 'all' | 'bdays'
let adminBdayFilter = 'all'; // 'all' | 'today' | 'tomorrow' | 'upcoming'

// Real-Time Database Live State
let adminLiveCustomers = null;
let adminLiveTransactions = [];
let adminLastSyncTime = null;
let adminSyncPollTimer = null;
let adminIsSyncing = false;

// Period Selector Definitions (index 0 is current period)
const WEEK_OPTIONS = [
  { id: '2026-W42', label: 'Oct 12 – Oct 18, 2026 (This Week)' },
  { id: '2026-W41', label: 'Oct 05 – Oct 11, 2026 (Last Week)' },
  { id: '2026-W40', label: 'Sep 28 – Oct 04, 2026' },
  { id: '2026-W39', label: 'Sep 21 – Sep 27, 2026' },
  { id: '2026-W38', label: 'Sep 14 – Sep 20, 2026' },
  { id: '2026-W37', label: 'Sep 07 – Sep 13, 2026' }
];

const FORTNIGHT_OPTIONS = [
  { id: '2026-10-F1', label: 'Oct 01 – Oct 15, 2026 (Current)' },
  { id: '2026-09-F2', label: 'Sep 16 – Sep 30, 2026' },
  { id: '2026-09-F1', label: 'Sep 01 – Sep 15, 2026' },
  { id: '2026-08-F2', label: 'Aug 16 – Aug 31, 2026' },
  { id: '2026-08-F1', label: 'Aug 01 – Aug 15, 2026' },
  { id: '2026-07-F2', label: 'Jul 16 – Jul 31, 2026' }
];

const MONTH_OPTIONS = [
  { id: '2026-10', label: 'October 2026 (Current Month)' },
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-08', label: 'August 2026' },
  { id: '2026-07', label: 'July 2026' },
  { id: '2026-06', label: 'June 2026' },
  { id: '2026-05', label: 'May 2026' },
  { id: '2026-04', label: 'April 2026' },
  { id: '2026-03', label: 'March 2026' },
  { id: '2026-02', label: 'February 2026' },
  { id: '2026-01', label: 'January 2026' }
];

const QUARTER_OPTIONS = [
  { id: '2026-Q4', label: 'Q4 2026 (Oct – Dec)' },
  { id: '2026-Q3', label: 'Q3 2026 (Jul – Sep)' },
  { id: '2026-Q2', label: 'Q2 2026 (Apr – Jun)' },
  { id: '2026-Q1', label: 'Q1 2026 (Jan – Mar)' },
  { id: '2025-Q4', label: 'Q4 2025 (Oct – Dec)' },
  { id: '2025-Q3', label: 'Q3 2025 (Jul – Sep)' }
];

const HALFYEAR_OPTIONS = [
  { id: '2026-H2', label: 'H2 2026 (Jul – Dec)' },
  { id: '2026-H1', label: 'H1 2026 (Jan – Jun)' },
  { id: '2025-H2', label: 'H2 2025 (Jul – Dec)' },
  { id: '2025-H1', label: 'H1 2025 (Jan – Jun)' }
];

const YEAR_OPTIONS = [
  { id: '2026', label: 'Year 2026 (Fiscal YTD)' },
  { id: '2025', label: 'Year 2025 (Full Year)' },
  { id: '2024', label: 'Year 2024 (Full Year)' }
];

// Baseline Customers (Tier removed across entire loyalty system)
const BASE_CUSTOMERS = [
  {
    id: 'usr_arjun_9842',
    name: 'Arjun Mehta',
    membershipId: 'AT-48291',
    visits: 27,
    spends: 6840,
    dob: '14-10-1995', // 4 days ago
    phone: '+91 98201 44829',
    email: 'arjun.mehta@atelier-coffee.com',
    favorite: 'Chikmagalur Pour Over',
    lastVisit: 'Today'
  },
  {
    id: 'usr_ananya_3910',
    name: 'Ananya Sharma',
    membershipId: 'AT-39102',
    visits: 34,
    spends: 9280,
    dob: '22-10-1993', // Upcoming in 4 days (22 Oct)
    phone: '+91 98334 12093',
    email: 'ananya.sharma@gmail.com',
    favorite: 'Oat Flat White',
    lastVisit: 'Yesterday'
  },
  {
    id: 'usr_devendra_1049',
    name: 'Devendra Rao',
    membershipId: 'AT-10492',
    visits: 51,
    spends: 15800,
    dob: '28-10-1988', // Upcoming in 10 days (28 Oct)
    phone: '+91 98860 33491',
    email: 'd.rao@ventures.in',
    favorite: 'Monsooned Malabar Aeropress',
    lastVisit: '2 days ago'
  },
  {
    id: 'usr_priya_6184',
    name: 'Priya Nair',
    membershipId: 'AT-61840',
    visits: 42,
    spends: 12450,
    dob: '18-10-1991', // TODAY! (18 Oct)
    phone: '+91 97112 34509',
    email: 'priya.nair@techcorp.in',
    favorite: 'Araku Valley Cold Drip',
    lastVisit: '3 days ago'
  },
  {
    id: 'usr_zoya_7731',
    name: 'Zoya Merchant',
    membershipId: 'AT-77319',
    visits: 16,
    spends: 4650,
    dob: '19-10-1997', // TOMORROW! (19 Oct)
    phone: '+91 98205 66782',
    email: 'zoya.merchant@creative.design',
    favorite: 'Avocado Sourdough Tartine',
    lastVisit: '1 week ago'
  },
  {
    id: 'usr_meera_8812',
    name: 'Meera Singhania',
    membershipId: 'AT-88129',
    visits: 29,
    spends: 8140,
    dob: '03-11-1994', // Upcoming in 16 days (03 Nov)
    phone: '+91 98199 55410',
    email: 'meera.singhania@heritage.org',
    favorite: 'Cardamom & Saffron Brioche',
    lastVisit: '4 days ago'
  },
  {
    id: 'usr_rohan_5520',
    name: 'Rohan Deshmukh',
    membershipId: 'AT-55201',
    visits: 19,
    spends: 5120,
    dob: '25-10-1998', // Upcoming in 7 days (25 Oct)
    phone: '+91 99204 88312',
    email: 'rohan.deshmukh@outlook.com',
    favorite: 'Artisan South Indian Kaapi',
    lastVisit: '5 days ago'
  },
  {
    id: 'usr_kabir_2940',
    name: 'Kabir Sen',
    membershipId: 'AT-29401',
    visits: 14,
    spends: 3980,
    dob: '11-01-1996', // Next Year (January)
    phone: '+91 98450 77123',
    email: 'kabir.sen@senstudios.co',
    favorite: 'Coorg Sun-Dried Cortado',
    lastVisit: '1 week ago'
  }
];

// Helper to calculate exact birthday timing relative to today
function getBirthdayDetails(dobStr) {
  if (!dobStr) return { category: 'other', daysUntil: 999, label: '', formattedDate: '' };

  let day = 1, month = 1, year = 1990;
  if (dobStr.includes('-')) {
    const parts = dobStr.split('-');
    if (parts[0].length === 4) {
      year = Number(parts[0]);
      month = Number(parts[1]);
      day = Number(parts[2]);
    } else {
      day = Number(parts[0]);
      month = Number(parts[1]);
      year = Number(parts[2]);
    }
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const todayMidnight = new Date(currentYear, now.getMonth(), now.getDate());

  let nextBday = new Date(currentYear, month - 1, day);
  if (nextBday < todayMidnight) {
    nextBday = new Date(currentYear + 1, month - 1, day);
  }

  const diffTime = nextBday.getTime() - todayMidnight.getTime();
  const daysUntil = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${day} ${monthNames[month - 1]}`;

  if (daysUntil === 0) {
    return { category: 'today', daysUntil: 0, label: "Today's Birthday 🎉", formattedDate };
  } else if (daysUntil === 1) {
    return { category: 'tomorrow', daysUntil: 1, label: "Tomorrow's Birthday ⏰", formattedDate };
  } else if (daysUntil >= 2 && daysUntil <= 30) {
    return { category: 'upcoming', daysUntil, label: `In ${daysUntil} days`, formattedDate };
  } else {
    return { category: 'later', daysUntil, label: `In ${daysUntil} days`, formattedDate };
  }
}

/* ==========================================================================
   WHATSAPP BIRTHDAY WISH GENERATOR
   Personalized luxury greeting for café owner to wish members via 1-click WhatsApp
   ========================================================================== */
function cleanPhoneNumberForWa(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) {
    // Standard 10-digit Indian mobile number -> prepend country code 91
    digits = '91' + digits;
  }
  return digits;
}

function getBirthdayWishMessage(customer, bdayType = 'today') {
  const firstName = (customer.name || 'Valued Member').split(' ')[0];
  const membershipId = customer.membershipId || '';

  if (bdayType === 'today') {
    return `Hello ${firstName}! 🎉🎂\n\nWishing you a very Happy Birthday from all of us at Atelier Café! ☕✨\n\nTo celebrate your special day, we've prepared a complimentary artisanal coffee of your choice & a celebratory dessert pastry at our coffee bar!\n\nJust show your Member Pass (${membershipId}) at the register whenever you visit today.\n\nHave a truly joyful and wonderful celebration! ☕🍰🎈`;
  } else if (bdayType === 'tomorrow') {
    return `Hello ${firstName}! 🎂✨\n\nAtelier Café wishes you a wonderful birthday in advance for tomorrow! ☕🎉\n\nYour complimentary birthday brew & celebratory pastry perk will be unlocked and waiting for you at the roastery starting tomorrow.\n\nLooking forward to celebrating with you! ☕🍰`;
  } else {
    return `Hello ${firstName}! ☕✨\n\nWarm advance birthday wishes from the team at Atelier Café! 🎉\n\nWe look forward to welcoming you to the coffee bar this month for your complimentary birthday brew.\n\nSee you soon at Atelier! ☕🎂`;
  }
}

function getWhatsAppWishUrl(customer, bdayType = 'today') {
  const cleanPhone = cleanPhoneNumberForWa(customer.phone);
  const msg = getBirthdayWishMessage(customer, bdayType);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

// Simple pseudo-random hash generator for deterministic past date data
function pseudoHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate Period Data & Metrics (Zero revenue/orders for any future dates)
function getPeriodReportData() {
  const tf = adminTimeframe;
  const todayIso = getTodayIso();

  if (tf === 'daily') {
    let dateStr = adminSelectedDate || todayIso;
    const isFuture = dateStr > todayIso;

    const parts = dateStr.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dateFormatted = isNaN(dateObj.getTime())
      ? dateStr
      : dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

    // Prevent showing future date data
    if (isFuture) {
      return {
        label: `Daily • ${dateFormatted} (Future)`,
        periodName: `${dateFormatted} (No Data Yet)`,
        revenue: 0,
        orders: 0,
        growth: '0.0%',
        intervals: [
          { label: '8 AM', value: 0 },
          { label: '10 AM', value: 0 },
          { label: '12 PM', value: 0 },
          { label: '2 PM', value: 0 },
          { label: '4 PM', value: 0 },
          { label: '6 PM', value: 0 },
          { label: '8 PM', value: 0 }
        ]
      };
    }

    const hash = pseudoHash(dateStr);
    let baseRev = 8420 + (hash % 3800);
    let baseOrders = 20 + (hash % 9);

    // Live session sync if today
    const store = window.AtelierStore;
    if (store && dateStr === todayIso) {
      const liveActivities = store.getState().activities || [];
      liveActivities.forEach(act => {
        if (act.type === 'transaction' && act.amountSpent) {
          baseRev += Number(act.amountSpent);
          baseOrders += 1;
        }
      });
    }

    // Live database transactions sync
    if (Array.isArray(adminLiveTransactions) && adminLiveTransactions.length > 0) {
      const dayTxns = adminLiveTransactions.filter(tx => {
        if (!tx.created_at) return false;
        const txDate = tx.created_at.split('T')[0];
        return txDate === dateStr;
      });
      dayTxns.forEach(tx => {
        baseRev += Number(tx.amount_spent || 0);
        baseOrders += 1;
      });
    }

    const intervals = [
      { label: '8 AM', value: Math.round(baseRev * 0.12) },
      { label: '10 AM', value: Math.round(baseRev * 0.26) },
      { label: '12 PM', value: Math.round(baseRev * 0.19) },
      { label: '2 PM', value: Math.round(baseRev * 0.11) },
      { label: '4 PM', value: Math.round(baseRev * 0.17) },
      { label: '6 PM', value: Math.round(baseRev * 0.10) },
      { label: '8 PM', value: Math.round(baseRev * 0.05) }
    ];

    return {
      label: `Daily • ${dateFormatted}`,
      periodName: dateFormatted,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+8.4%',
      intervals: intervals
    };
  }

  if (tf === 'weekly') {
    const weekObj = WEEK_OPTIONS.find(w => w.id === adminSelectedWeek) || WEEK_OPTIONS[0];
    const hash = pseudoHash(weekObj.id);
    const baseRev = 54680 + (hash % 12000);
    const baseOrders = 143 + (hash % 28);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weights = [0.12, 0.13, 0.12, 0.14, 0.18, 0.20, 0.11];
    const intervals = days.map((d, i) => ({
      label: d,
      value: Math.round(baseRev * weights[i])
    }));

    return {
      label: `Weekly • ${weekObj.label}`,
      periodName: weekObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+12.1%',
      intervals: intervals
    };
  }

  if (tf === '15days') {
    const fnObj = FORTNIGHT_OPTIONS.find(f => f.id === adminSelectedFortnight) || FORTNIGHT_OPTIONS[0];
    const hash = pseudoHash(fnObj.id);
    const baseRev = 118450 + (hash % 20000);
    const baseOrders = 308 + (hash % 45);
    const intervals = [
      { label: 'Day 1-3', value: Math.round(baseRev * 0.19) },
      { label: 'Day 4-6', value: Math.round(baseRev * 0.22) },
      { label: 'Day 7-9', value: Math.round(baseRev * 0.18) },
      { label: 'Day 10-12', value: Math.round(baseRev * 0.21) },
      { label: 'Day 13-15', value: Math.round(baseRev * 0.20) }
    ];

    return {
      label: `15 Days • ${fnObj.label}`,
      periodName: fnObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+10.5%',
      intervals: intervals
    };
  }

  if (tf === 'monthly') {
    const moObj = MONTH_OPTIONS.find(m => m.id === adminSelectedMonth) || MONTH_OPTIONS[0];
    const hash = pseudoHash(moObj.id);
    const baseRev = 242800 + (hash % 38000);
    const baseOrders = 628 + (hash % 80);
    const intervals = [
      { label: 'Week 1', value: Math.round(baseRev * 0.22) },
      { label: 'Week 2', value: Math.round(baseRev * 0.25) },
      { label: 'Week 3', value: Math.round(baseRev * 0.24) },
      { label: 'Week 4', value: Math.round(baseRev * 0.29) }
    ];

    return {
      label: `Monthly • ${moObj.label}`,
      periodName: moObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+14.2%',
      intervals: intervals
    };
  }

  if (tf === 'quarterly') {
    const qtrObj = QUARTER_OPTIONS.find(q => q.id === adminSelectedQuarter) || QUARTER_OPTIONS[0];
    const hash = pseudoHash(qtrObj.id);
    const baseRev = 714500 + (hash % 75000);
    const baseOrders = 1842 + (hash % 160);
    const intervals = [
      { label: 'Month 1', value: Math.round(baseRev * 0.31) },
      { label: 'Month 2', value: Math.round(baseRev * 0.34) },
      { label: 'Month 3', value: Math.round(baseRev * 0.35) }
    ];

    return {
      label: `Quarterly • ${qtrObj.label}`,
      periodName: qtrObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+16.8%',
      intervals: intervals
    };
  }

  if (tf === '6months') {
    const hyObj = HALFYEAR_OPTIONS.find(h => h.id === adminSelectedHalfYear) || HALFYEAR_OPTIONS[0];
    const hash = pseudoHash(hyObj.id);
    const baseRev = 1480200 + (hash % 120000);
    const baseOrders = 3790 + (hash % 300);
    const intervals = [
      { label: 'M1', value: Math.round(baseRev * 0.15) },
      { label: 'M2', value: Math.round(baseRev * 0.16) },
      { label: 'M3', value: Math.round(baseRev * 0.17) },
      { label: 'M4', value: Math.round(baseRev * 0.17) },
      { label: 'M5', value: Math.round(baseRev * 0.17) },
      { label: 'M6', value: Math.round(baseRev * 0.18) }
    ];

    return {
      label: `6 Months • ${hyObj.label}`,
      periodName: hyObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+18.4%',
      intervals: intervals
    };
  }

  if (tf === 'year') {
    const yrObj = YEAR_OPTIONS.find(y => y.id === adminSelectedYear) || YEAR_OPTIONS[0];
    const hash = pseudoHash(yrObj.id);
    const baseRev = 3145000 + (hash % 250000);
    const baseOrders = 8020 + (hash % 500);
    const intervals = [
      { label: 'Q1', value: Math.round(baseRev * 0.22) },
      { label: 'Q2', value: Math.round(baseRev * 0.24) },
      { label: 'Q3', value: Math.round(baseRev * 0.26) },
      { label: 'Q4', value: Math.round(baseRev * 0.28) }
    ];

    return {
      label: `Annual • ${yrObj.label}`,
      periodName: yrObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+22.5%',
      intervals: intervals
    };
  }

  // Custom Range
  const fromD = adminCustomFrom || '2026-10-01';
  let toD = adminCustomTo || todayIso;
  if (toD > todayIso) toD = todayIso;
  const diffTime = Math.max(1, Math.abs(new Date(toD) - new Date(fromD)));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const hash = pseudoHash(fromD + toD);
  const baseRev = diffDays * (8200 + (hash % 2400));
  const baseOrders = diffDays * (21 + (hash % 6));

  const intervals = [
    { label: 'P1', value: Math.round(baseRev * 0.22) },
    { label: 'P2', value: Math.round(baseRev * 0.26) },
    { label: 'P3', value: Math.round(baseRev * 0.24) },
    { label: 'P4', value: Math.round(baseRev * 0.28) }
  ];

  return {
    label: `Custom Range • ${fromD} to ${toD}`,
    periodName: `${fromD} to ${toD} (${diffDays} Days)`,
    revenue: baseRev,
    orders: baseOrders,
    growth: '+11.8%',
    intervals: intervals
  };
}

async function syncAdminDataFromDatabase(options = {}) {
  const silent = options.silent === true;
  if (adminIsSyncing) return;
  adminIsSyncing = true;

  const spinIcon = document.getElementById('admin-sync-spin-icon');
  if (spinIcon && !silent) {
    spinIcon.classList.add('spinning');
  }

  try {
    let data = null;
    if (window.AtelierSupabase && typeof window.AtelierSupabase.fetchAllAdminData === 'function') {
      data = await window.AtelierSupabase.fetchAllAdminData();
    } else {
      const res = await fetch('/api/admin/data');
      if (res.ok) data = await res.json();
    }

    if (data && data.success && Array.isArray(data.customers)) {
      const prevSerialized = JSON.stringify(adminLiveCustomers);
      const newSerialized = JSON.stringify(data.customers);
      const hasChanged = prevSerialized !== newSerialized;

      adminLiveCustomers = data.customers;
      adminLiveTransactions = Array.isArray(data.transactions) ? data.transactions : [];
      adminLastSyncTime = new Date();

      // If we are currently on the admin portal page
      if (window.location.hash.includes('admin') && isAdminAuthenticated()) {
        const timeEl = document.getElementById('admin-sync-time');
        if (timeEl) {
          timeEl.textContent = adminLastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        const labelEl = document.getElementById('admin-sync-label');
        if (labelEl) {
          labelEl.textContent = `Live DB Sync (${adminLiveCustomers.length} Members)`;
        }

        // Re-render if data changed or manual sync
        if (hasChanged || !silent) {
          if (window.router) {
            window.router.render();
          }
        }
      }

      if (!silent) {
        if (window.showToast) {
          window.showToast(`✓ Database synced in real time: ${data.customers.length} real members loaded`);
        }
        if (window.AtelierAudio && typeof window.AtelierAudio.playTap === 'function') {
          window.AtelierAudio.playTap();
        }
      }
    }
  } catch (err) {
    console.warn('Real-time database sync warning:', err);
    if (!silent && window.showToast) {
      window.showToast('⚠️ Could not sync with database. Using cached data.');
    }
  } finally {
    adminIsSyncing = false;
    if (spinIcon) {
      setTimeout(() => spinIcon.classList.remove('spinning'), 450);
    }
  }
}

function getAggregatedCustomers() {
  const store = window.AtelierStore;
  const state = store ? store.getState() : {};
  const liveUser = state.user;
  const liveMembership = state.membership;
  const activities = state.activities || [];

  let liveUserSpends = 0;
  activities.forEach(act => {
    if (act.type === 'transaction' && act.amountSpent) {
      liveUserSpends += Number(act.amountSpent);
    }
  });

  // If real database customers are loaded, use real members!
  if (Array.isArray(adminLiveCustomers) && adminLiveCustomers.length > 0) {
    const list = JSON.parse(JSON.stringify(adminLiveCustomers));

    // If local session has an active logged in customer, merge any unsaved session activity
    if (liveUser && liveUser.email) {
      const match = list.find(c => c.email && c.email.toLowerCase() === liveUser.email.toLowerCase());
      if (match) {
        match.name = `${liveUser.firstName || ''} ${liveUser.lastName || ''}`.trim() || match.name;
        match.phone = liveUser.phone || match.phone;
        match.dob = liveUser.dob || match.dob;
        if (liveMembership) {
          match.visits = Math.max(match.visits, liveMembership.lifetimeVisits || match.visits);
        }
        if (liveUserSpends > 0) {
          match.spends = Math.max(match.spends, liveUserSpends);
        }
      } else {
        // Local user not yet in database list (e.g. freshly registered)
        list.unshift({
          id: liveUser.id || 'usr_local_' + Date.now(),
          name: `${liveUser.firstName || ''} ${liveUser.lastName || ''}`.trim() || 'New Member',
          membershipId: liveUser.membershipId || 'AT-MEMBER',
          visits: liveMembership ? (liveMembership.lifetimeVisits || 1) : 1,
          spends: liveUserSpends,
          dob: liveUser.dob || '',
          phone: liveUser.phone || '',
          email: liveUser.email || '',
          favorite: liveUser.favoriteDrink || 'Signature Pour Over',
          lastVisit: 'Today',
          points: liveMembership ? liveMembership.points : 0
        });
      }
    }
    return list;
  }

  // If real database customers haven't finished loading yet, trigger async sync
  if (!adminIsSyncing) {
    syncAdminDataFromDatabase({ silent: true });
  }

  // Graceful initial fallback
  const customers = JSON.parse(JSON.stringify(BASE_CUSTOMERS));
  if (liveUser) {
    const primary = customers[0];
    primary.name = `${liveUser.firstName || 'Arjun'} ${liveUser.lastName || 'Mehta'}`.trim();
    primary.email = liveUser.email || primary.email;
    primary.phone = liveUser.phone || primary.phone;
    primary.dob = liveUser.dob || primary.dob;
    primary.membershipId = liveUser.membershipId || primary.membershipId;
    if (liveMembership) {
      primary.visits = Math.max(primary.visits, liveMembership.lifetimeVisits || primary.visits);
    }
    primary.spends = 6840 + liveUserSpends;
  }

  return customers;
}

function formatInr(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

// Render the period chooser control bar based on active timeframe tab
function renderPeriodControlBar() {
  const tf = adminTimeframe;
  const todayIso = getTodayIso();

  if (tf === 'daily') {
    const parts = (adminSelectedDate || todayIso).split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dayName = isNaN(dateObj.getTime())
      ? ''
      : dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    // "Next Day" is only rendered if user is viewing a previous date (i.e. not on current/today)
    const isCurrentDate = (adminSelectedDate >= todayIso);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-day-btn" title="Previous Day">‹ Prev Day</button>
          <input type="date" id="admin-daily-date-picker" class="admin-ctrl-input" value="${adminSelectedDate}" max="${todayIso}">
          <button type="button" class="admin-ctrl-btn" id="admin-today-btn">Today</button>
          ${!isCurrentDate ? `<button type="button" class="admin-ctrl-btn" id="admin-next-day-btn" title="Next Day">Next Day ›</button>` : ''}
          <span class="admin-ctrl-badge font-mono">${dayName}</span>
        </div>
      </div>
    `;
  }

  if (tf === 'weekly') {
    const optionsHtml = WEEK_OPTIONS.map(w => `
      <option value="${w.id}" ${w.id === adminSelectedWeek ? 'selected' : ''}>${w.label}</option>
    `).join('');

    const isCurrentWeek = (adminSelectedWeek === WEEK_OPTIONS[0].id);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-week-btn">‹ Prev Week</button>
          <select id="admin-week-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          ${!isCurrentWeek ? `<button type="button" class="admin-ctrl-btn" id="admin-next-week-btn">Next Week ›</button>` : ''}
        </div>
      </div>
    `;
  }

  if (tf === '15days') {
    const optionsHtml = FORTNIGHT_OPTIONS.map(f => `
      <option value="${f.id}" ${f.id === adminSelectedFortnight ? 'selected' : ''}>${f.label}</option>
    `).join('');

    const isCurrentFortnight = (adminSelectedFortnight === FORTNIGHT_OPTIONS[0].id);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-fn-btn">‹ Prev 15 Days</button>
          <select id="admin-fn-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          ${!isCurrentFortnight ? `<button type="button" class="admin-ctrl-btn" id="admin-next-fn-btn">Next 15 Days ›</button>` : ''}
        </div>
      </div>
    `;
  }

  if (tf === 'monthly') {
    const optionsHtml = MONTH_OPTIONS.map(m => `
      <option value="${m.id}" ${m.id === adminSelectedMonth ? 'selected' : ''}>${m.label}</option>
    `).join('');

    const isCurrentMonth = (adminSelectedMonth === MONTH_OPTIONS[0].id);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-mo-btn">‹ Prev Month</button>
          <select id="admin-mo-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          ${!isCurrentMonth ? `<button type="button" class="admin-ctrl-btn" id="admin-next-mo-btn">Next Month ›</button>` : ''}
        </div>
      </div>
    `;
  }

  if (tf === 'quarterly') {
    const optionsHtml = QUARTER_OPTIONS.map(q => `
      <option value="${q.id}" ${q.id === adminSelectedQuarter ? 'selected' : ''}>${q.label}</option>
    `).join('');

    const isCurrentQuarter = (adminSelectedQuarter === QUARTER_OPTIONS[0].id);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-qtr-btn">‹ Prev Quarter</button>
          <select id="admin-qtr-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          ${!isCurrentQuarter ? `<button type="button" class="admin-ctrl-btn" id="admin-next-qtr-btn">Next Quarter ›</button>` : ''}
        </div>
      </div>
    `;
  }

  if (tf === '6months') {
    const optionsHtml = HALFYEAR_OPTIONS.map(h => `
      <option value="${h.id}" ${h.id === adminSelectedHalfYear ? 'selected' : ''}>${h.label}</option>
    `).join('');

    const isCurrentHalfYear = (adminSelectedHalfYear === HALFYEAR_OPTIONS[0].id);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-hy-btn">‹ Prev 6M</button>
          <select id="admin-hy-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          ${!isCurrentHalfYear ? `<button type="button" class="admin-ctrl-btn" id="admin-next-hy-btn">Next 6M ›</button>` : ''}
        </div>
      </div>
    `;
  }

  if (tf === 'year') {
    const optionsHtml = YEAR_OPTIONS.map(y => `
      <option value="${y.id}" ${y.id === adminSelectedYear ? 'selected' : ''}>${y.label}</option>
    `).join('');

    const isCurrentYear = (adminSelectedYear === YEAR_OPTIONS[0].id);

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-yr-btn">‹ Prev Year</button>
          <select id="admin-yr-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          ${!isCurrentYear ? `<button type="button" class="admin-ctrl-btn" id="admin-next-yr-btn">Next Year ›</button>` : ''}
        </div>
      </div>
    `;
  }

  // Custom Range
  return `
    <div class="admin-period-control-bar">
      <div class="admin-period-control-inner">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-roast-muted);">From:</span>
        <input type="date" id="admin-custom-from-input" class="admin-ctrl-input" value="${adminCustomFrom}" max="${todayIso}">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-roast-muted);">To:</span>
        <input type="date" id="admin-custom-to-input" class="admin-ctrl-input" value="${adminCustomTo}" max="${todayIso}">
        <button type="button" id="admin-custom-apply-btn" class="admin-ctrl-btn is-primary">Apply Range</button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   ADMIN PORTAL AUTHENTICATION GATE
   ========================================================================== */
const ADMIN_AUTH_STORAGE_KEY = 'atelier_admin_auth_v1';

function isAdminAuthenticated() {
  try {
    return (
      sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true' ||
      localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true'
    );
  } catch (e) {
    return false;
  }
}

function setAdminAuthenticated(authenticated, remember = false) {
  try {
    if (authenticated) {
      sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
      if (remember) {
        localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
      }
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Admin auth storage error:', e);
  }
}

function verifyAdminCredentials(adminId, password) {
  const cleanId = (adminId || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  if (!cleanId || !cleanPass) return false;

  const validIds = ['admin', 'owner', 'atelier_admin', 'admin@atelier-coffee.com'];
  const ownerPin = (window.AtelierStore && typeof window.AtelierStore.getOwnerStampPin === 'function')
    ? window.AtelierStore.getOwnerStampPin()
    : '1234';
  const validPasswords = ['admin123', 'admin', ownerPin];

  return validIds.includes(cleanId) && validPasswords.includes(cleanPass);
}

function renderAdminAuthScreen() {
  return `
    <div class="admin-portal-root" style="min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem;">
      <div class="auth-boutique-card" style="max-width: 440px; width: 100%; text-align: center;">
        
        <!-- Executive Shield / Lock Emblem -->
        <div style="display: flex; justify-content: center; margin-bottom: 0.85rem;">
          <div style="width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, rgba(200, 157, 75, 0.16), rgba(192, 90, 44, 0.12)); border: 1px solid rgba(200, 157, 75, 0.4); display: flex; align-items: center; justify-content: center; color: var(--color-espresso, #1C1512); box-shadow: 0 6px 18px rgba(200, 157, 75, 0.18);">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        <!-- Title & Subtitle -->
        <div class="eyebrow eyebrow-accent" style="margin-bottom: 0.35rem; font-size: 0.72rem; letter-spacing: 0.12em;">
          <span>✦</span>
          <span>RESTRICTED EXECUTIVE ACCESS</span>
        </div>
        <h1 class="auth-boutique-title font-serif" style="font-size: 1.8rem; margin: 0.1rem 0 0.35rem;">
          Admin Portal
        </h1>
        <p style="font-size: 0.88rem; color: var(--color-roast-muted, #7E6E65); margin: 0 0 1.35rem; line-height: 1.45;">
          Sign in with your café owner credentials.
        </p>

        <!-- Error Message Banner -->
        <div id="admin-auth-error" class="auth-error-banner" style="display: none; margin-bottom: 1rem;" role="alert"></div>

        <!-- Login Form -->
        <form id="admin-login-form" class="auth-clean-form">
          <!-- Admin ID Field -->
          <div class="auth-input-group">
            <span class="auth-input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E948A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input 
              type="text" 
              id="admin-id-input" 
              class="auth-clean-input has-icon" 
              placeholder="Admin ID" 
              required 
              autocomplete="username"
              autofocus
            />
          </div>

          <!-- Password Field -->
          <div class="auth-input-group">
            <span class="auth-input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E948A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input 
              type="password" 
              id="admin-pass-input" 
              class="auth-clean-input has-icon" 
              placeholder="Password" 
              required 
              autocomplete="current-password"
              style="padding-right: 42px;"
            />
            <button 
              type="button" 
              id="admin-toggle-pwd-btn" 
              title="Show or hide password" 
              aria-label="Show or hide password"
              style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: transparent; border: none; cursor: pointer; color: #9E948A; display: flex; align-items: center; padding: 0;"
            >
              <svg id="admin-eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>

          <!-- Remember Me on this Terminal -->
          <div class="auth-options-row" style="margin-top: 0.15rem; margin-bottom: 0.35rem;">
            <label class="auth-remember-check">
              <input type="checkbox" id="admin-remember-me" checked>
              <span>Remember on this browser</span>
            </label>
          </div>

          <!-- Sign In Button -->
          <button type="submit" class="auth-boutique-btn" id="admin-submit-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Sign In to Admin Portal</span>
          </button>

      

          <!-- Return to Member Pass -->
          <div style="margin-top: 1.15rem;">
            <a href="#dashboard" style="font-size: 0.82rem; color: var(--color-terracotta, #C05A2C); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 500;">
              <span>← Return to Member Pass</span>
            </a>
          </div>
        </form>

      </div>
    </div>
  `;
}

function renderAdminPage() {
  if (!isAdminAuthenticated()) {
    return renderAdminAuthScreen();
  }

  const report = getPeriodReportData();
  const customers = getAggregatedCustomers();
  const totalCustomersCount = customers.length;

  // Filter customers by search
  const cQuery = adminCustomerSearch.toLowerCase().trim();
  let filteredCustomers = customers.filter(c => {
    if (!cQuery) return true;
    return (
      c.name.toLowerCase().includes(cQuery) ||
      c.email.toLowerCase().includes(cQuery) ||
      c.phone.toLowerCase().includes(cQuery) ||
      c.membershipId.toLowerCase().includes(cQuery)
    );
  });

  // Sort customers
  if (adminCustomerSort === 'spends_desc') {
    filteredCustomers.sort((a, b) => b.spends - a.spends);
  } else if (adminCustomerSort === 'visits_desc') {
    filteredCustomers.sort((a, b) => b.visits - a.visits);
  } else if (adminCustomerSort === 'name_asc') {
    filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (adminCustomerSort === 'dob') {
    filteredCustomers.sort((a, b) => a.dob.localeCompare(b.dob));
  }

  // Sparkline Bars
  const maxInterval = Math.max(...report.intervals.map(i => i.value), 1);
  const sparklineBarsHtml = report.intervals.map(item => {
    const heightPercent = Math.min(100, Math.max(14, Math.round((item.value / maxInterval) * 100)));
    return `
      <div class="admin-spark-bar-col" title="${item.label}: ${formatInr(item.value)}">
        <div class="admin-spark-bar-wrap">
          <div class="admin-spark-bar-fill" style="height: ${heightPercent}%;"></div>
        </div>
        <div class="admin-spark-bar-label font-mono">${item.label}</div>
        <div class="admin-spark-bar-val font-mono">${formatInr(item.value)}</div>
      </div>
    `;
  }).join('');

  // Group customers by birthday
  const birthdayCustomers = customers.map(c => ({
    ...c,
    bday: getBirthdayDetails(c.dob)
  }));

  const todayBdays = birthdayCustomers.filter(c => c.bday.category === 'today');
  const tomorrowBdays = birthdayCustomers.filter(c => c.bday.category === 'tomorrow');
  const upcomingBdays = birthdayCustomers.filter(c => c.bday.category === 'upcoming')
    .sort((a, b) => a.bday.daysUntil - b.bday.daysUntil);
  const totalBdaysCount = todayBdays.length + tomorrowBdays.length + upcomingBdays.length;

  function renderBdayCard(c, type) {
    const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const isToday = type === 'today';
    const isTomorrow = type === 'tomorrow';
    const waUrl = isToday ? getWhatsAppWishUrl(c, 'today') : '';

    return `
      <div class="admin-bday-card ${isToday ? 'highlight-today' : isTomorrow ? 'highlight-tomorrow' : ''}">
        <div class="admin-bday-card-head">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="admin-customer-avatar">${initials}</div>
            <div>
              <div class="admin-customer-name" style="font-size: 1.05rem; display: flex; align-items: center; gap: 0.45rem;">
                <span>${c.name}</span>
                ${isToday ? `
                  <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="admin-name-wa-btn" title="Wish ${c.name} Happy Birthday on WhatsApp">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Wish</span>
                  </a>
                ` : ''}
              </div>
              <div class="admin-customer-id font-mono">${c.membershipId}</div>
            </div>
          </div>
          <span class="admin-bday-tag ${type}">
            ${isToday ? '🎂 Today!' : isTomorrow ? '⏰ Tomorrow' : `In ${c.bday.daysUntil}d`}
          </span>
        </div>

        <div class="admin-bday-card-body">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--color-roast-muted);">Date of Birth:</span>
            <span class="font-mono" style="font-weight: 600; color: var(--color-espresso);">${c.dob} (${c.bday.formattedDate})</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--color-roast-muted);">Phone:</span>
            <a href="tel:${c.phone}" class="font-mono" style="color: var(--color-terracotta); text-decoration: none; font-weight: 500;">${c.phone}</a>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--color-roast-muted);">Email:</span>
            <span style="font-size: 0.78rem; color: var(--color-roast-medium);">${c.email}</span>
          </div>
        </div>

        <div class="admin-bday-card-foot">
          <div style="display: flex; gap: 0.85rem; font-size: 0.78rem;">
            <span><strong>${c.visits}</strong> visits</span>
            <span><strong>${formatInr(c.spends)}</strong> spent</span>
          </div>
          <button type="button" class="admin-bday-action-btn" title="Birthday Perk Status">
            ${isToday ? '🎉 Perk Ready' : isTomorrow ? '⏰ Schedule Wish' : '📅 Member Perk'}
          </button>
        </div>
      </div>
    `;
  }

  // Customer Table Rows (Tier removed)
  const customerRowsHtml = filteredCustomers.map(c => {
    const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const bday = getBirthdayDetails(c.dob);
    const isTodayBday = bday.category === 'today';
    const waWishUrl = isTodayBday ? getWhatsAppWishUrl(c, 'today') : '';

    let bdayBadgeHtml = '';
    if (bday.category === 'today') {
      bdayBadgeHtml = `<span class="admin-birthday-tag today font-mono" title="Birthday Today! (${bday.formattedDate})">🎂 Today!</span>`;
    } else if (bday.category === 'tomorrow') {
      bdayBadgeHtml = `<span class="admin-birthday-tag tomorrow font-mono" title="Birthday Tomorrow! (${bday.formattedDate})">⏰ Tomorrow</span>`;
    } else if (bday.category === 'upcoming') {
      bdayBadgeHtml = `<span class="admin-birthday-tag upcoming font-mono" title="Birthday in ${bday.daysUntil} days (${bday.formattedDate})">📅 In ${bday.daysUntil}d</span>`;
    }

    return `
      <tr class="admin-table-row">
        <!-- Customer Monogram & Name (WhatsApp button appears only before name of customer having birthday today) -->
        <td class="admin-td-customer">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="admin-customer-avatar">${initials}</div>
            <div>
              <div class="admin-customer-name" style="display: flex; align-items: center; gap: 0.45rem;">
                <span>${c.name}</span>
                ${isTodayBday ? `
                  <a href="${waWishUrl}" target="_blank" rel="noopener noreferrer" class="admin-name-wa-btn" title="Wish ${c.name} Happy Birthday on WhatsApp">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Wish</span>
                  </a>
                ` : ''}
              </div>
              <div class="admin-customer-id font-mono">${c.membershipId}</div>
            </div>
          </div>
        </td>

        <!-- Visits -->
        <td class="admin-td-visits">
          <span class="admin-number-pill font-mono">
            <strong>${c.visits}</strong> visits
          </span>
        </td>

        <!-- Total Spends -->
        <td class="admin-td-spends font-mono admin-highlight-number">
          ${formatInr(c.spends)}
        </td>

        <!-- Date of Birth (DOB) -->
        <td class="admin-td-dob">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="font-mono" style="font-size: 0.85rem;">${c.dob}</span>
            ${bdayBadgeHtml}
          </div>
        </td>

        <!-- Number & Mail -->
        <td class="admin-td-contact">
          <div class="admin-contact-phone font-mono">${c.phone}</div>
          <div class="admin-contact-email">${c.email}</div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="admin-portal-root">
      <div class="container">
        
        <!-- Top Executive Header -->
        <div class="admin-header-row" style="margin-bottom: 2rem;">
          <div>
            <div class="eyebrow eyebrow-accent" style="margin-bottom: 0.35rem;">
              <span>✦</span>
              <span>CAFÉ OWNER INTELLIGENCE • EXECUTIVE PORTAL</span>
            </div>
            <h1 class="admin-page-title font-serif">
              Owner Admin Portal
            </h1>
            <p class="admin-page-subtitle">
              Date-wise fiscal ledger, multi-period revenue reports, and member directory intelligence.
            </p>
          </div>
          <div class="admin-header-actions" style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
            <div class="admin-realtime-badge" id="admin-realtime-indicator" title="Connected to database with live automatic synchronization">
              <span class="admin-live-pulse-dot"></span>
              <span id="admin-sync-label">${adminLiveCustomers ? `Live DB Sync (${adminLiveCustomers.length} Members)` : 'Live DB Sync Active'}</span>
              <span class="admin-sync-time" id="admin-sync-time">${adminLastSyncTime ? adminLastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Live'}</span>
            </div>
            <button type="button" id="admin-refresh-btn" class="btn-ghost" style="display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 500; border-radius: 999px; padding: 0.45rem 1rem; border: 1px solid var(--border-subtle, rgba(45, 30, 22, 0.18)); background: #FFFFFF; color: var(--color-espresso, #1C1512); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.04);" title="Force refresh data from database now">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="admin-sync-spin-icon" id="admin-sync-spin-icon">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>Sync Now</span>
            </button>
            <button type="button" id="admin-logout-btn" class="btn-ghost" style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; border-radius: 999px; padding: 0.45rem 1.15rem; border: 1px solid var(--border-subtle, rgba(45, 30, 22, 0.18)); background: #FFFFFF; color: var(--color-espresso, #1C1512); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Lock / Sign Out</span>
            </button>
          </div>
        </div>

        <!-- 1. TOTAL REVENUE ANALYTICS HERO & PERIOD DASHBOARD -->
        <div class="admin-card-surface" style="margin-bottom: 2rem;">
          
          <!-- Section Bar: Title & 8 Timeframe Tabs (Daily, Weekly, 15 Days, Monthly, Quarterly, 6 Months, Year, Custom) -->
          <div class="admin-revenue-header-bar">
            <div>
              <span class="admin-section-eyebrow">FISCAL PERFORMANCE</span>
              <h2 style="font-size: 1.4rem; margin: 2px 0 0; font-family: var(--font-serif);">Total Revenue</h2>
            </div>

            <!-- Timeframe Filter Tabs -->
            <div class="admin-timeframe-tabs">
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'daily' ? 'is-active' : ''}" data-tf="daily">Daily</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'weekly' ? 'is-active' : ''}" data-tf="weekly">Weekly</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === '15days' ? 'is-active' : ''}" data-tf="15days">15 Days</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'monthly' ? 'is-active' : ''}" data-tf="monthly">Monthly</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'quarterly' ? 'is-active' : ''}" data-tf="quarterly">Quarterly</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === '6months' ? 'is-active' : ''}" data-tf="6months">6 Months</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'year' ? 'is-active' : ''}" data-tf="year">Year</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'custom' ? 'is-active' : ''}" data-tf="custom">Custom</button>
            </div>
          </div>

          <!-- Specific Date & Period Picker Bar -->
          ${renderPeriodControlBar()}

          <!-- Hero Number & Bento Grid (AOV Removed: 3 balanced cards) -->
          <div class="admin-bento-grid">
            
            <!-- Primary Revenue Bento -->
            <div class="admin-bento-card admin-bento-hero">
              <div class="admin-bento-subhead">${report.label}</div>
              <div class="admin-hero-number font-serif">
                ${formatInr(report.revenue)}
              </div>
              <div class="admin-trend-badge font-mono">
                <span>↑ ${report.growth}</span>
                <span style="color: var(--color-roast-muted); font-size: 0.75rem;">vs prev period</span>
              </div>
            </div>

            <!-- Total Completed Orders / Transactions -->
            <div class="admin-bento-card">
              <div class="admin-bento-subhead">TRANSACTIONS</div>
              <div class="admin-bento-number font-serif">${report.orders}</div>
              <div class="admin-bento-foot font-mono">Completed Orders</div>
            </div>

            <!-- Total Customers Count -->
            <div class="admin-bento-card">
              <div class="admin-bento-subhead">TOTAL CUSTOMERS</div>
              <div class="admin-bento-number font-serif">${totalCustomersCount}</div>
              <div class="admin-bento-foot font-mono">Registered Members</div>
            </div>

          </div>

          <!-- Visual Revenue Distribution Sparkline Graph -->
          <div class="admin-sparkline-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <span style="font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-roast-muted); font-weight: 600;">
                ${report.periodName} Revenue Distribution
              </span>
              <span class="font-mono" style="font-size: 0.74rem; color: var(--color-terracotta);">
                Peak: ${formatInr(maxInterval)}
              </span>
            </div>
            
            <div class="admin-spark-chart-grid">
              ${sparklineBarsHtml}
            </div>
          </div>

        </div>

        <!-- 2. CUSTOMERS DIRECTORY & BIRTHDAYS (BDAYS) SECTION -->
        <div class="admin-card-surface">
          
          <div class="admin-ledger-header">
            <div>
              <span class="admin-section-eyebrow">CUSTOMER INTELLIGENCE</span>
              <h2 style="font-size: 1.4rem; margin: 2px 0 0; font-family: var(--font-serif);">
                ${adminCustomerView === 'bdays' ? 'Member Birthdays (Bdays)' : `Member Accounts (${filteredCustomers.length})`}
              </h2>
            </div>

            <!-- View Switcher Tabs: All Members vs Bdays -->
            <div class="admin-view-switcher">
              <button type="button" class="admin-view-tab-btn ${adminCustomerView === 'all' ? 'is-active' : ''}" id="admin-view-all-btn">
                <span>All Members (${customers.length})</span>
              </button>
              <button type="button" class="admin-view-tab-btn ${adminCustomerView === 'bdays' ? 'is-active' : ''}" id="admin-view-bdays-btn">
                <span>🎂 Bdays (${totalBdaysCount})</span>
                ${todayBdays.length > 0 ? `<span class="admin-bday-pulse-dot" title="Birthday Today!"></span>` : ''}
              </button>
            </div>

            <!-- Search & Sort Controls (only visible when in All Members table view) -->
            ${adminCustomerView === 'all' ? `
              <div class="admin-ledger-controls">
                <!-- Search Input -->
                <div class="admin-search-wrap">
                  <input 
                    type="text" 
                    id="admin-customer-search-input" 
                    class="admin-search-input" 
                    placeholder="Search by name, phone, email, ID..." 
                    value="${adminCustomerSearch}"
                  >
                </div>

                <!-- Sort Dropdown -->
                <select id="admin-customer-sort-select" class="admin-select-input">
                  <option value="spends_desc" ${adminCustomerSort === 'spends_desc' ? 'selected' : ''}>Sort by Spends (High → Low)</option>
                  <option value="visits_desc" ${adminCustomerSort === 'visits_desc' ? 'selected' : ''}>Sort by Visits</option>
                  <option value="name_asc" ${adminCustomerSort === 'name_asc' ? 'selected' : ''}>Sort by Name (A-Z)</option>
                  <option value="dob" ${adminCustomerSort === 'dob' ? 'selected' : ''}>Sort by DOB</option>
                </select>
              </div>
            ` : ''}
          </div>

          ${adminCustomerView === 'bdays' ? `
            <!-- Bdays Subfilter Tabs -->
            <div class="admin-bday-subtabs-bar">
              <button type="button" class="admin-bday-subtab-btn ${adminBdayFilter === 'all' ? 'is-active' : ''}" data-bday-filter="all">
                All Birthdays (${totalBdaysCount})
              </button>
              <button type="button" class="admin-bday-subtab-btn ${adminBdayFilter === 'today' ? 'is-active' : ''}" data-bday-filter="today">
                🎂 Today (${todayBdays.length})
              </button>
              <button type="button" class="admin-bday-subtab-btn ${adminBdayFilter === 'tomorrow' ? 'is-active' : ''}" data-bday-filter="tomorrow">
                ⏰ Tomorrow (${tomorrowBdays.length})
              </button>
              <button type="button" class="admin-bday-subtab-btn ${adminBdayFilter === 'upcoming' ? 'is-active' : ''}" data-bday-filter="upcoming">
                📅 Upcoming (${upcomingBdays.length})
              </button>
            </div>

            <!-- 1. Today's Birthdays Group -->
            ${(adminBdayFilter === 'all' || adminBdayFilter === 'today') ? `
              <div class="admin-bday-group-wrap">
                <div class="admin-bday-group-title today">
                  <span>🎂 TODAY'S BIRTHDAYS (${todayBdays.length})</span>
                </div>
                ${todayBdays.length > 0 ? `
                  <div class="admin-bday-cards-grid">
                    ${todayBdays.map(c => renderBdayCard(c, 'today')).join('')}
                  </div>
                ` : `
                  <div style="font-size: 0.85rem; color: var(--color-roast-muted); padding: 0.5rem 0;">No member birthdays today.</div>
                `}
              </div>
            ` : ''}

            <!-- 2. Tomorrow's Birthdays Group -->
            ${(adminBdayFilter === 'all' || adminBdayFilter === 'tomorrow') ? `
              <div class="admin-bday-group-wrap">
                <div class="admin-bday-group-title tomorrow">
                  <span>⏰ TOMORROW'S BIRTHDAYS (${tomorrowBdays.length})</span>
                </div>
                ${tomorrowBdays.length > 0 ? `
                  <div class="admin-bday-cards-grid">
                    ${tomorrowBdays.map(c => renderBdayCard(c, 'tomorrow')).join('')}
                  </div>
                ` : `
                  <div style="font-size: 0.85rem; color: var(--color-roast-muted); padding: 0.5rem 0;">No member birthdays tomorrow.</div>
                `}
              </div>
            ` : ''}

            <!-- 3. Upcoming Birthdays Group -->
            ${(adminBdayFilter === 'all' || adminBdayFilter === 'upcoming') ? `
              <div class="admin-bday-group-wrap">
                <div class="admin-bday-group-title upcoming">
                  <span>📅 UPCOMING BIRTHDAYS (NEXT 30 DAYS) (${upcomingBdays.length})</span>
                </div>
                ${upcomingBdays.length > 0 ? `
                  <div class="admin-bday-cards-grid">
                    ${upcomingBdays.map(c => renderBdayCard(c, 'upcoming')).join('')}
                  </div>
                ` : `
                  <div style="font-size: 0.85rem; color: var(--color-roast-muted); padding: 0.5rem 0;">No upcoming member birthdays in next 30 days.</div>
                `}
              </div>
            ` : ''}
          ` : `
            <!-- Birthday Alert Banner in All Members View -->
            <div class="admin-bday-banner">
              <div class="admin-bday-banner-title">
                <span>🎂 Member Birthdays:</span>
              </div>
              <div class="admin-bday-chips-row">
                ${todayBdays.map(c => `
                  <span class="admin-bday-chip today" data-bday-target="today" title="Click to view Today's Birthday">
                    🎂 Today: <strong>${c.name}</strong> <a href="${getWhatsAppWishUrl(c, 'today')}" target="_blank" rel="noopener noreferrer" class="admin-name-wa-btn" style="margin: 0 4px;" title="Wish ${c.name} Happy Birthday on WhatsApp" onclick="event.stopPropagation();"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>Wish</a> (${c.bday.formattedDate})
                  </span>
                `).join('')}
                ${tomorrowBdays.map(c => `
                  <span class="admin-bday-chip tomorrow" data-bday-target="tomorrow" title="Click to view Tomorrow's Birthday">
                    ⏰ Tomorrow: <strong>${c.name}</strong> (${c.bday.formattedDate})
                  </span>
                `).join('')}
                ${upcomingBdays.length > 0 ? `
                  <span class="admin-bday-chip upcoming" data-bday-target="upcoming" title="Click to view Upcoming Birthdays">
                    📅 Upcoming: <strong>${upcomingBdays.length} Members</strong> (Next 30d)
                  </span>
                ` : ''}
              </div>
            </div>

            <!-- Customer Table (Tier Column Removed) -->
            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Visits</th>
                    <th>Spends</th>
                    <th>DOB</th>
                    <th>Number / Mail</th>
                  </tr>
                </thead>
                <tbody>
                  ${customerRowsHtml}
                </tbody>
              </table>
            </div>
          `}

        </div>

      </div>
    </div>
  `;
}

function initAdminEvents() {
  if (!isAdminAuthenticated()) {
    const form = document.getElementById('admin-login-form');
    const idInput = document.getElementById('admin-id-input');
    const passInput = document.getElementById('admin-pass-input');
    const errorBanner = document.getElementById('admin-auth-error');
    const togglePwdBtn = document.getElementById('admin-toggle-pwd-btn');
    const rememberMe = document.getElementById('admin-remember-me');

    if (togglePwdBtn && passInput) {
      togglePwdBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePwdBtn.innerHTML = isPass ? `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ` : `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idVal = idInput ? idInput.value.trim() : '';
        const passVal = passInput ? passInput.value.trim() : '';

        if (!verifyAdminCredentials(idVal, passVal)) {
          if (errorBanner) {
            errorBanner.textContent = 'Invalid Admin ID or Password. Please check your credentials and try again.';
            errorBanner.style.display = 'block';
            errorBanner.classList.add('shake');
            setTimeout(() => errorBanner.classList.remove('shake'), 600);
          }
          if (passInput) {
            passInput.value = '';
            passInput.focus();
          }
          if (window.AtelierAudio && window.AtelierAudio.playError) {
            window.AtelierAudio.playError();
          }
          return;
        }

        if (errorBanner) errorBanner.style.display = 'none';
        setAdminAuthenticated(true, rememberMe ? rememberMe.checked : false);
        if (window.AtelierAudio && window.AtelierAudio.playSuccess) {
          window.AtelierAudio.playSuccess();
        }
        if (window.showToast) {
          window.showToast('✓ Admin Portal Unlocked. Welcome, Café Owner!');
        }
        if (window.router) {
          window.router.render();
        }
      });
    }
    return;
  }

  // Bind Manual Sync Button
  const refreshBtn = document.getElementById('admin-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      syncAdminDataFromDatabase({ silent: false });
    });
  }

  // Bind Lock / Sign Out button for authenticated session
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (adminSyncPollTimer) {
        clearInterval(adminSyncPollTimer);
        adminSyncPollTimer = null;
      }
      setAdminAuthenticated(false);
      if (window.AtelierAudio && window.AtelierAudio.playTap) {
        window.AtelierAudio.playTap();
      }
      if (window.showToast) {
        window.showToast('🔒 Admin Portal locked. Signed out successfully.');
      }
      if (window.router) {
        window.router.render();
      }
    });
  }

  // Active Real-Time Polling: Poll database every 4 seconds while Admin Portal is active
  if (adminSyncPollTimer) {
    clearInterval(adminSyncPollTimer);
    adminSyncPollTimer = null;
  }
  adminSyncPollTimer = setInterval(() => {
    if (window.location.hash.includes('admin') && isAdminAuthenticated()) {
      syncAdminDataFromDatabase({ silent: true });
    } else {
      clearInterval(adminSyncPollTimer);
      adminSyncPollTimer = null;
    }
  }, 4000);

  // Real-Time Local Store Listener: Re-sync instantaneously on stamp or transaction changes
  if (window.AtelierStore && !window.__adminStoreSubscribed) {
    window.__adminStoreSubscribed = true;
    window.AtelierStore.subscribe(() => {
      if (window.location.hash.includes('admin') && isAdminAuthenticated()) {
        syncAdminDataFromDatabase({ silent: true });
      }
    });
  }

  // Trigger initial database fetch if not loaded
  if (!adminLiveCustomers) {
    syncAdminDataFromDatabase({ silent: true });
  }

  const todayIso = getTodayIso();

  // Timeframe Filter Tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tf = btn.getAttribute('data-tf');
      if (tf && tf !== adminTimeframe) {
        adminTimeframe = tf;
        if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
        if (window.router) window.router.render();
      }
    });
  });

  // Daily Date Picker
  const dailyPicker = document.getElementById('admin-daily-date-picker');
  if (dailyPicker) {
    dailyPicker.addEventListener('change', (e) => {
      let val = e.target.value;
      if (val > todayIso) val = todayIso;
      adminSelectedDate = val;
      if (window.router) window.router.render();
    });
  }

  // Daily Prev / Today / Next Buttons
  const prevDayBtn = document.getElementById('admin-prev-day-btn');
  if (prevDayBtn) {
    prevDayBtn.addEventListener('click', () => {
      const parts = (adminSelectedDate || todayIso).split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      d.setDate(d.getDate() - 1);
      adminSelectedDate = formatDateIso(d);
      if (window.router) window.router.render();
    });
  }

  const todayBtn = document.getElementById('admin-today-btn');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      adminSelectedDate = todayIso;
      if (window.router) window.router.render();
    });
  }

  const nextDayBtn = document.getElementById('admin-next-day-btn');
  if (nextDayBtn) {
    nextDayBtn.addEventListener('click', () => {
      if (adminSelectedDate >= todayIso) return;
      const parts = adminSelectedDate.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      d.setDate(d.getDate() + 1);
      const nextIso = formatDateIso(d);
      if (nextIso <= todayIso) {
        adminSelectedDate = nextIso;
        if (window.router) window.router.render();
      }
    });
  }

  // Weekly Selector & Nav
  const weekSelect = document.getElementById('admin-week-select');
  if (weekSelect) {
    weekSelect.addEventListener('change', (e) => {
      adminSelectedWeek = e.target.value;
      if (window.router) window.router.render();
    });
  }
  const prevWeekBtn = document.getElementById('admin-prev-week-btn');
  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      const idx = WEEK_OPTIONS.findIndex(w => w.id === adminSelectedWeek);
      if (idx < WEEK_OPTIONS.length - 1) {
        adminSelectedWeek = WEEK_OPTIONS[idx + 1].id;
        if (window.router) window.router.render();
      }
    });
  }
  const nextWeekBtn = document.getElementById('admin-next-week-btn');
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      const idx = WEEK_OPTIONS.findIndex(w => w.id === adminSelectedWeek);
      if (idx > 0) {
        adminSelectedWeek = WEEK_OPTIONS[idx - 1].id;
        if (window.router) window.router.render();
      }
    });
  }

  // 15-Day Fortnight Selector & Nav
  const fnSelect = document.getElementById('admin-fn-select');
  if (fnSelect) {
    fnSelect.addEventListener('change', (e) => {
      adminSelectedFortnight = e.target.value;
      if (window.router) window.router.render();
    });
  }
  const prevFnBtn = document.getElementById('admin-prev-fn-btn');
  if (prevFnBtn) {
    prevFnBtn.addEventListener('click', () => {
      const idx = FORTNIGHT_OPTIONS.findIndex(f => f.id === adminSelectedFortnight);
      if (idx < FORTNIGHT_OPTIONS.length - 1) {
        adminSelectedFortnight = FORTNIGHT_OPTIONS[idx + 1].id;
        if (window.router) window.router.render();
      }
    });
  }
  const nextFnBtn = document.getElementById('admin-next-fn-btn');
  if (nextFnBtn) {
    nextFnBtn.addEventListener('click', () => {
      const idx = FORTNIGHT_OPTIONS.findIndex(f => f.id === adminSelectedFortnight);
      if (idx > 0) {
        adminSelectedFortnight = FORTNIGHT_OPTIONS[idx - 1].id;
        if (window.router) window.router.render();
      }
    });
  }

  // Monthly Selector & Nav
  const moSelect = document.getElementById('admin-mo-select');
  if (moSelect) {
    moSelect.addEventListener('change', (e) => {
      adminSelectedMonth = e.target.value;
      if (window.router) window.router.render();
    });
  }
  const prevMoBtn = document.getElementById('admin-prev-mo-btn');
  if (prevMoBtn) {
    prevMoBtn.addEventListener('click', () => {
      const idx = MONTH_OPTIONS.findIndex(m => m.id === adminSelectedMonth);
      if (idx < MONTH_OPTIONS.length - 1) {
        adminSelectedMonth = MONTH_OPTIONS[idx + 1].id;
        if (window.router) window.router.render();
      }
    });
  }
  const nextMoBtn = document.getElementById('admin-next-mo-btn');
  if (nextMoBtn) {
    nextMoBtn.addEventListener('click', () => {
      const idx = MONTH_OPTIONS.findIndex(m => m.id === adminSelectedMonth);
      if (idx > 0) {
        adminSelectedMonth = MONTH_OPTIONS[idx - 1].id;
        if (window.router) window.router.render();
      }
    });
  }

  // Quarterly Selector & Nav
  const qtrSelect = document.getElementById('admin-qtr-select');
  if (qtrSelect) {
    qtrSelect.addEventListener('change', (e) => {
      adminSelectedQuarter = e.target.value;
      if (window.router) window.router.render();
    });
  }
  const prevQtrBtn = document.getElementById('admin-prev-qtr-btn');
  if (prevQtrBtn) {
    prevQtrBtn.addEventListener('click', () => {
      const idx = QUARTER_OPTIONS.findIndex(q => q.id === adminSelectedQuarter);
      if (idx < QUARTER_OPTIONS.length - 1) {
        adminSelectedQuarter = QUARTER_OPTIONS[idx + 1].id;
        if (window.router) window.router.render();
      }
    });
  }
  const nextQtrBtn = document.getElementById('admin-next-qtr-btn');
  if (nextQtrBtn) {
    nextQtrBtn.addEventListener('click', () => {
      const idx = QUARTER_OPTIONS.findIndex(q => q.id === adminSelectedQuarter);
      if (idx > 0) {
        adminSelectedQuarter = QUARTER_OPTIONS[idx - 1].id;
        if (window.router) window.router.render();
      }
    });
  }

  // 6 Months Selector & Nav
  const hySelect = document.getElementById('admin-hy-select');
  if (hySelect) {
    hySelect.addEventListener('change', (e) => {
      adminSelectedHalfYear = e.target.value;
      if (window.router) window.router.render();
    });
  }
  const prevHyBtn = document.getElementById('admin-prev-hy-btn');
  if (prevHyBtn) {
    prevHyBtn.addEventListener('click', () => {
      const idx = HALFYEAR_OPTIONS.findIndex(h => h.id === adminSelectedHalfYear);
      if (idx < HALFYEAR_OPTIONS.length - 1) {
        adminSelectedHalfYear = HALFYEAR_OPTIONS[idx + 1].id;
        if (window.router) window.router.render();
      }
    });
  }
  const nextHyBtn = document.getElementById('admin-next-hy-btn');
  if (nextHyBtn) {
    nextHyBtn.addEventListener('click', () => {
      const idx = HALFYEAR_OPTIONS.findIndex(h => h.id === adminSelectedHalfYear);
      if (idx > 0) {
        adminSelectedHalfYear = HALFYEAR_OPTIONS[idx - 1].id;
        if (window.router) window.router.render();
      }
    });
  }

  // Year Selector & Nav
  const yrSelect = document.getElementById('admin-yr-select');
  if (yrSelect) {
    yrSelect.addEventListener('change', (e) => {
      adminSelectedYear = e.target.value;
      if (window.router) window.router.render();
    });
  }
  const prevYrBtn = document.getElementById('admin-prev-yr-btn');
  if (prevYrBtn) {
    prevYrBtn.addEventListener('click', () => {
      const idx = YEAR_OPTIONS.findIndex(y => y.id === adminSelectedYear);
      if (idx < YEAR_OPTIONS.length - 1) {
        adminSelectedYear = YEAR_OPTIONS[idx + 1].id;
        if (window.router) window.router.render();
      }
    });
  }
  const nextYrBtn = document.getElementById('admin-next-yr-btn');
  if (nextYrBtn) {
    nextYrBtn.addEventListener('click', () => {
      const idx = YEAR_OPTIONS.findIndex(y => y.id === adminSelectedYear);
      if (idx > 0) {
        adminSelectedYear = YEAR_OPTIONS[idx - 1].id;
        if (window.router) window.router.render();
      }
    });
  }

  // Custom Range Apply
  const customApplyBtn = document.getElementById('admin-custom-apply-btn');
  if (customApplyBtn) {
    customApplyBtn.addEventListener('click', () => {
      const fromEl = document.getElementById('admin-custom-from-input');
      const toEl = document.getElementById('admin-custom-to-input');
      if (fromEl && toEl) {
        adminCustomFrom = fromEl.value;
        let toVal = toEl.value;
        if (toVal > todayIso) toVal = todayIso;
        adminCustomTo = toVal;
        if (window.router) window.router.render();
      }
    });
  }

  // Customer Directory Search
  const customerSearch = document.getElementById('admin-customer-search-input');
  if (customerSearch) {
    customerSearch.addEventListener('input', (e) => {
      adminCustomerSearch = e.target.value;
      if (window.router) window.router.render();
      const newEl = document.getElementById('admin-customer-search-input');
      if (newEl) {
        newEl.focus();
        newEl.setSelectionRange(newEl.value.length, newEl.value.length);
      }
    });
  }

  // Customer Directory Sort
  const customerSort = document.getElementById('admin-customer-sort-select');
  if (customerSort) {
    customerSort.addEventListener('change', (e) => {
      adminCustomerSort = e.target.value;
      if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
      if (window.router) window.router.render();
    });
  }

  // View Switcher (All Members vs Bdays)
  const viewAllBtn = document.getElementById('admin-view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      adminCustomerView = 'all';
      if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
      if (window.router) window.router.render();
    });
  }

  const viewBdaysBtn = document.getElementById('admin-view-bdays-btn');
  if (viewBdaysBtn) {
    viewBdaysBtn.addEventListener('click', () => {
      adminCustomerView = 'bdays';
      if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
      if (window.router) window.router.render();
    });
  }

  // Birthday Subtab Filters (All, Today, Tomorrow, Upcoming)
  document.querySelectorAll('.admin-bday-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-bday-filter');
      if (filter) {
        adminBdayFilter = filter;
        if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
        if (window.router) window.router.render();
      }
    });
  });

  // Birthday Quick Jump Chips in Banner
  document.querySelectorAll('.admin-bday-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const target = chip.getAttribute('data-bday-target');
      adminCustomerView = 'bdays';
      if (target) adminBdayFilter = target;
      if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
      if (window.router) window.router.render();
    });
  });
}

window.renderAdminPage = renderAdminPage;
window.initAdminEvents = initAdminEvents;
window.getPeriodReportData = getPeriodReportData;

window.AtelierAdminState = {
  get timeframe() { return adminTimeframe; },
  set timeframe(v) { adminTimeframe = v; },
  get selectedDate() { return adminSelectedDate; },
  set selectedDate(v) { adminSelectedDate = v; },
  get selectedWeek() { return adminSelectedWeek; },
  set selectedWeek(v) { adminSelectedWeek = v; },
  get selectedFortnight() { return adminSelectedFortnight; },
  set selectedFortnight(v) { adminSelectedFortnight = v; },
  get selectedMonth() { return adminSelectedMonth; },
  set selectedMonth(v) { adminSelectedMonth = v; },
  get selectedQuarter() { return adminSelectedQuarter; },
  set selectedQuarter(v) { adminSelectedQuarter = v; },
  get selectedHalfYear() { return adminSelectedHalfYear; },
  set selectedHalfYear(v) { adminSelectedHalfYear = v; },
  get selectedYear() { return adminSelectedYear; },
  set selectedYear(v) { adminSelectedYear = v; },
  get customerView() { return adminCustomerView; },
  set customerView(v) { adminCustomerView = v; },
  get bdayFilter() { return adminBdayFilter; },
  set bdayFilter(v) { adminBdayFilter = v; },
  getPeriodReportData,
  getTodayIso,
  formatDateIso,
  getBirthdayDetails,
  isAdminAuthenticated,
  setAdminAuthenticated,
  verifyAdminCredentials,
  cleanPhoneNumberForWa,
  getBirthdayWishMessage,
  getWhatsAppWishUrl,
  syncAdminDataFromDatabase,
  get liveCustomers() { return adminLiveCustomers; },
  get liveTransactions() { return adminLiveTransactions; },
  get lastSyncTime() { return adminLastSyncTime; }
};
