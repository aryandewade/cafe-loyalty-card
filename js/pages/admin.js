/* ==========================================================================
   ATELIER CAFÉ OWNER ADMIN PORTAL
   High-end executive dashboard with date-wise & period-wise financial intelligence:
   - Total Revenue (Daily, Weekly, 15 Days, Monthly, Quarterly, 6 Months, Year, Custom)
   - Date-wise Picker for Daily transactions
   - Week, 15-Day Fortnight, Month, Quarter, Half-Year, and Year pickers
   - Custom Date Range selection
   - Period-specific Transactions Ledger (Receipt #, Customer, Items, Method, Amount, Status)
   - Number of Customers & Member Directory (Visits, Spends, DOB, Number / Mail, Search & Sort)
   - No Average Transaction (AOV removed as requested)
   - Real-time integration with AtelierStore
   ========================================================================== */

let adminTimeframe = 'daily'; // 'daily' | 'weekly' | '15days' | 'monthly' | 'quarterly' | '6months' | 'year' | 'custom'
let adminSelectedDate = '2026-10-17'; // YYYY-MM-DD
let adminSelectedWeek = '2026-W42';
let adminSelectedFortnight = '2026-10-F1';
let adminSelectedMonth = '2026-10';
let adminSelectedQuarter = '2026-Q4';
let adminSelectedHalfYear = '2026-H2';
let adminSelectedYear = '2026';
let adminCustomFrom = '2026-10-01';
let adminCustomTo = '2026-10-17';

let adminTxSearch = '';
let adminTxMethod = 'all'; // 'all' | 'UPI' | 'Card' | 'Cash'
let adminCustomerSearch = '';
let adminCustomerSort = 'spends_desc'; // 'spends_desc' | 'visits_desc' | 'name_asc' | 'dob'

// Period Selector Definitions
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

// Baseline Customers
const BASE_CUSTOMERS = [
  {
    id: 'usr_arjun_9842',
    name: 'Arjun Mehta',
    membershipId: 'AT-48291',
    tier: 'Gold Member',
    visits: 27,
    spends: 6840,
    dob: '14-10-1995',
    phone: '+91 98201 44829',
    email: 'arjun.mehta@atelier-coffee.com',
    favorite: 'Chikmagalur Pour Over',
    lastVisit: 'Today'
  },
  {
    id: 'usr_ananya_3910',
    name: 'Ananya Sharma',
    membershipId: 'AT-39102',
    tier: 'Gold Member',
    visits: 34,
    spends: 9280,
    dob: '22-03-1993',
    phone: '+91 98334 12093',
    email: 'ananya.sharma@gmail.com',
    favorite: 'Oat Flat White',
    lastVisit: 'Yesterday'
  },
  {
    id: 'usr_devendra_1049',
    name: 'Devendra Rao',
    membershipId: 'AT-10492',
    tier: 'Reserve VIP',
    visits: 51,
    spends: 15800,
    dob: '02-02-1988',
    phone: '+91 98860 33491',
    email: 'd.rao@ventures.in',
    favorite: 'Monsooned Malabar Aeropress',
    lastVisit: '2 days ago'
  },
  {
    id: 'usr_priya_6184',
    name: 'Priya Nair',
    membershipId: 'AT-61840',
    tier: 'Reserve VIP',
    visits: 42,
    spends: 12450,
    dob: '18-10-1991',
    phone: '+91 97112 34509',
    email: 'priya.nair@techcorp.in',
    favorite: 'Araku Valley Cold Drip',
    lastVisit: '3 days ago'
  },
  {
    id: 'usr_meera_8812',
    name: 'Meera Singhania',
    membershipId: 'AT-88129',
    tier: 'Gold Member',
    visits: 29,
    spends: 8140,
    dob: '30-07-1994',
    phone: '+91 98199 55410',
    email: 'meera.singhania@heritage.org',
    favorite: 'Cardamom & Saffron Brioche',
    lastVisit: '4 days ago'
  },
  {
    id: 'usr_rohan_5520',
    name: 'Rohan Deshmukh',
    membershipId: 'AT-55201',
    tier: 'Silver Member',
    visits: 19,
    spends: 5120,
    dob: '05-11-1998',
    phone: '+91 99204 88312',
    email: 'rohan.deshmukh@outlook.com',
    favorite: 'Artisan South Indian Kaapi',
    lastVisit: '5 days ago'
  },
  {
    id: 'usr_kabir_2940',
    name: 'Kabir Sen',
    membershipId: 'AT-29401',
    tier: 'Silver Member',
    visits: 14,
    spends: 3980,
    dob: '11-01-1996',
    phone: '+91 98450 77123',
    email: 'kabir.sen@senstudios.co',
    favorite: 'Coorg Sun-Dried Cortado',
    lastVisit: '1 week ago'
  },
  {
    id: 'usr_zoya_7731',
    name: 'Zoya Merchant',
    membershipId: 'AT-77319',
    tier: 'Silver Member',
    visits: 16,
    spends: 4650,
    dob: '19-12-1997',
    phone: '+91 98205 66782',
    email: 'zoya.merchant@creative.design',
    favorite: 'Avocado Sourdough Tartine',
    lastVisit: '1 week ago'
  }
];

// Master order templates to generate realistic transactions
const SAMPLE_PRODUCTS = [
  'Chikmagalur Pour Over + Saffron Brioche',
  'Monsooned Malabar Aeropress x2 + Tartine',
  'Oat Flat White & Cinnamon Twist',
  'Artisanal South Indian Kaapi',
  'Araku Valley Cold Drip Beans (250g)',
  'Avocado Zaatar Sourdough Tartine',
  'Coorg Sun-Dried Cortado',
  'Double Espresso + Morning Brioche',
  'Cardamom & Saffron Brioche x2',
  'Pour Over Tasting Flight (3 Cups)'
];

const SAMPLE_CUSTOMERS = [
  { name: 'Arjun Mehta', id: 'AT-48291' },
  { name: 'Ananya Sharma', id: 'AT-39102' },
  { name: 'Devendra Rao', id: 'AT-10492' },
  { name: 'Priya Nair', id: 'AT-61840' },
  { name: 'Meera Singhania', id: 'AT-88129' },
  { name: 'Rohan Deshmukh', id: 'AT-55201' },
  { name: 'Kabir Sen', id: 'AT-29401' },
  { name: 'Zoya Merchant', id: 'AT-77319' },
  { name: 'Walk-in Guest', id: '' },
  { name: 'Walk-in Guest', id: '' }
];

const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'UPI', 'Card'];

// Simple pseudo-random hash generator for deterministic date data
function pseudoHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Generate realistic transactions for a specific date
function generateDailyTransactions(dateStr) {
  const hash = pseudoHash(dateStr);
  const count = 18 + (hash % 9); // 18 to 26 transactions per day
  const txList = [];
  const times = [
    '08:15 AM', '08:40 AM', '09:05 AM', '09:30 AM', '09:55 AM',
    '10:20 AM', '10:45 AM', '11:15 AM', '11:50 AM', '12:25 PM',
    '01:10 PM', '01:45 PM', '02:30 PM', '03:15 PM', '03:50 PM',
    '04:30 PM', '05:10 PM', '05:45 PM', '06:20 PM', '07:05 PM',
    '07:45 PM', '08:15 PM', '08:40 PM', '09:10 PM', '09:30 PM'
  ];

  let totalRev = 0;

  for (let i = 0; i < count; i++) {
    const itemIdx = (hash + i * 3) % SAMPLE_PRODUCTS.length;
    const custIdx = (hash + i * 7) % SAMPLE_CUSTOMERS.length;
    const methodIdx = (hash + i * 2) % PAYMENT_METHODS.length;
    const cust = SAMPLE_CUSTOMERS[custIdx];
    const receiptNum = `RCP-${10400 + ((hash + i * 37) % 8900)}`;
    const baseAmounts = [280, 340, 380, 420, 520, 570, 650, 780, 940, 1080];
    const amount = baseAmounts[(hash + i * 5) % baseAmounts.length];
    totalRev += amount;

    txList.push({
      id: `tx_${dateStr}_${i}`,
      date: dateStr,
      time: times[i] || '08:00 PM',
      receiptNumber: receiptNum,
      customerName: cust.name,
      customerId: cust.id,
      items: SAMPLE_PRODUCTS[itemIdx],
      method: PAYMENT_METHODS[methodIdx],
      amount: amount,
      status: 'Settled'
    });
  }

  // Prepend live session activities from AtelierStore if viewing today
  const store = window.AtelierStore;
  const todayIso = new Date().toISOString().slice(0, 10);
  if (store && dateStr === todayIso) {
    const liveActivities = store.getState().activities || [];
    liveActivities.forEach((act, idx) => {
      if (act.type === 'transaction' && act.amountSpent) {
        txList.unshift({
          id: act.id || `live_tx_${idx}`,
          date: dateStr,
          time: act.time || 'Live Session',
          receiptNumber: act.receiptNumber || `RCP-LIVE-${idx + 1}`,
          customerName: store.getState().user?.firstName || 'Current Member',
          customerId: store.getState().user?.membershipId || 'AT-MEMBER',
          items: act.productName || act.subtitle || 'Café Order',
          method: 'UPI',
          amount: Number(act.amountSpent),
          status: 'Settled'
        });
        totalRev += Number(act.amountSpent);
      }
    });
  }

  return { transactions: txList, revenue: totalRev };
}

// Generate Period Data & Metrics
function getPeriodReportData() {
  const tf = adminTimeframe;

  if (tf === 'daily') {
    const dateStr = adminSelectedDate || '2026-10-17';
    const { transactions, revenue } = generateDailyTransactions(dateStr);
    const dateObj = new Date(dateStr);
    const dateFormatted = isNaN(dateObj.getTime())
      ? dateStr
      : dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

    // Hourly intervals calculation
    const intervals = [
      { label: '8 AM', value: Math.round(revenue * 0.12) },
      { label: '10 AM', value: Math.round(revenue * 0.26) },
      { label: '12 PM', value: Math.round(revenue * 0.19) },
      { label: '2 PM', value: Math.round(revenue * 0.11) },
      { label: '4 PM', value: Math.round(revenue * 0.17) },
      { label: '6 PM', value: Math.round(revenue * 0.10) },
      { label: '8 PM', value: Math.round(revenue * 0.05) }
    ];

    return {
      label: `Daily • ${dateFormatted}`,
      periodName: dateFormatted,
      revenue: revenue,
      orders: transactions.length,
      growth: '+8.4%',
      intervals: intervals,
      transactions: transactions
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

    // Representative transactions across the week
    const { transactions } = generateDailyTransactions('2026-10-16');
    const { transactions: tx2 } = generateDailyTransactions('2026-10-17');
    const combinedTx = tx2.slice(0, 15).concat(transactions.slice(0, 15));

    return {
      label: `Weekly • ${weekObj.label}`,
      periodName: weekObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+12.1%',
      intervals: intervals,
      transactions: combinedTx
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
    const { transactions } = generateDailyTransactions('2026-10-14');
    const { transactions: tx2 } = generateDailyTransactions('2026-10-15');

    return {
      label: `15 Days • ${fnObj.label}`,
      periodName: fnObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+10.5%',
      intervals: intervals,
      transactions: tx2.concat(transactions).slice(0, 28)
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
    const { transactions } = generateDailyTransactions('2026-10-12');
    const { transactions: tx2 } = generateDailyTransactions('2026-10-17');

    return {
      label: `Monthly • ${moObj.label}`,
      periodName: moObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+14.2%',
      intervals: intervals,
      transactions: tx2.concat(transactions).slice(0, 30)
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
    const { transactions } = generateDailyTransactions('2026-09-15');
    const { transactions: tx2 } = generateDailyTransactions('2026-10-17');

    return {
      label: `Quarterly • ${qtrObj.label}`,
      periodName: qtrObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+16.8%',
      intervals: intervals,
      transactions: tx2.concat(transactions).slice(0, 30)
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
    const { transactions } = generateDailyTransactions('2026-08-20');
    const { transactions: tx2 } = generateDailyTransactions('2026-10-17');

    return {
      label: `6 Months • ${hyObj.label}`,
      periodName: hyObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+18.4%',
      intervals: intervals,
      transactions: tx2.concat(transactions).slice(0, 30)
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
    const { transactions } = generateDailyTransactions('2026-07-10');
    const { transactions: tx2 } = generateDailyTransactions('2026-10-17');

    return {
      label: `Annual • ${yrObj.label}`,
      periodName: yrObj.label,
      revenue: baseRev,
      orders: baseOrders,
      growth: '+22.5%',
      intervals: intervals,
      transactions: tx2.concat(transactions).slice(0, 30)
    };
  }

  // Custom Range
  const fromD = adminCustomFrom || '2026-10-01';
  const toD = adminCustomTo || '2026-10-17';
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

  const { transactions } = generateDailyTransactions(fromD);
  const { transactions: tx2 } = generateDailyTransactions(toD);

  return {
    label: `Custom Range • ${fromD} to ${toD}`,
    periodName: `${fromD} to ${toD} (${diffDays} Days)`,
    revenue: baseRev,
    orders: baseOrders,
    growth: '+11.8%',
    intervals: intervals,
    transactions: tx2.concat(transactions).slice(0, 30)
  };
}

function getAggregatedCustomers() {
  const store = window.AtelierStore;
  const state = store ? store.getState() : {};
  const liveUser = state.user;
  const liveMembership = state.membership;
  const activities = state.activities || [];

  let liveUserSpends = 6840;
  activities.forEach(act => {
    if (act.type === 'transaction' && act.amountSpent) {
      liveUserSpends += Number(act.amountSpent);
    }
  });

  const customers = JSON.parse(JSON.stringify(BASE_CUSTOMERS));

  if (liveUser) {
    const primary = customers[0];
    primary.name = `${liveUser.firstName || 'Arjun'} ${liveUser.lastName || 'Mehta'}`.trim();
    primary.email = liveUser.email || primary.email;
    primary.phone = liveUser.phone || primary.phone;
    primary.dob = liveUser.dob || primary.dob;
    primary.membershipId = liveUser.membershipId || primary.membershipId;
    primary.tier = liveUser.tier || primary.tier;
    if (liveMembership) {
      primary.visits = Math.max(primary.visits, liveMembership.lifetimeVisits || primary.visits);
    }
    primary.spends = liveUserSpends;
  }

  return customers;
}

function formatInr(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

// Render the period chooser control bar based on active timeframe tab
function renderPeriodControlBar() {
  const tf = adminTimeframe;

  if (tf === 'daily') {
    const dateObj = new Date(adminSelectedDate);
    const dayName = isNaN(dateObj.getTime())
      ? ''
      : dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-day-btn" title="Previous Day">‹ Prev Day</button>
          <input type="date" id="admin-daily-date-picker" class="admin-ctrl-input" value="${adminSelectedDate}">
          <button type="button" class="admin-ctrl-btn" id="admin-today-btn">Today</button>
          <button type="button" class="admin-ctrl-btn" id="admin-next-day-btn" title="Next Day">Next Day ›</button>
          <span class="admin-ctrl-badge font-mono">${dayName}</span>
        </div>
      </div>
    `;
  }

  if (tf === 'weekly') {
    const optionsHtml = WEEK_OPTIONS.map(w => `
      <option value="${w.id}" ${w.id === adminSelectedWeek ? 'selected' : ''}>${w.label}</option>
    `).join('');

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-week-btn">‹ Prev Week</button>
          <select id="admin-week-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          <button type="button" class="admin-ctrl-btn" id="admin-next-week-btn">Next Week ›</button>
        </div>
      </div>
    `;
  }

  if (tf === '15days') {
    const optionsHtml = FORTNIGHT_OPTIONS.map(f => `
      <option value="${f.id}" ${f.id === adminSelectedFortnight ? 'selected' : ''}>${f.label}</option>
    `).join('');

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-fn-btn">‹ Prev 15 Days</button>
          <select id="admin-fn-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          <button type="button" class="admin-ctrl-btn" id="admin-next-fn-btn">Next 15 Days ›</button>
        </div>
      </div>
    `;
  }

  if (tf === 'monthly') {
    const optionsHtml = MONTH_OPTIONS.map(m => `
      <option value="${m.id}" ${m.id === adminSelectedMonth ? 'selected' : ''}>${m.label}</option>
    `).join('');

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-mo-btn">‹ Prev Month</button>
          <select id="admin-mo-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          <button type="button" class="admin-ctrl-btn" id="admin-next-mo-btn">Next Month ›</button>
        </div>
      </div>
    `;
  }

  if (tf === 'quarterly') {
    const optionsHtml = QUARTER_OPTIONS.map(q => `
      <option value="${q.id}" ${q.id === adminSelectedQuarter ? 'selected' : ''}>${q.label}</option>
    `).join('');

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-qtr-btn">‹ Prev Quarter</button>
          <select id="admin-qtr-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          <button type="button" class="admin-ctrl-btn" id="admin-next-qtr-btn">Next Quarter ›</button>
        </div>
      </div>
    `;
  }

  if (tf === '6months') {
    const optionsHtml = HALFYEAR_OPTIONS.map(h => `
      <option value="${h.id}" ${h.id === adminSelectedHalfYear ? 'selected' : ''}>${h.label}</option>
    `).join('');

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-hy-btn">‹ Prev 6M</button>
          <select id="admin-hy-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          <button type="button" class="admin-ctrl-btn" id="admin-next-hy-btn">Next 6M ›</button>
        </div>
      </div>
    `;
  }

  if (tf === 'year') {
    const optionsHtml = YEAR_OPTIONS.map(y => `
      <option value="${y.id}" ${y.id === adminSelectedYear ? 'selected' : ''}>${y.label}</option>
    `).join('');

    return `
      <div class="admin-period-control-bar">
        <div class="admin-period-control-inner">
          <button type="button" class="admin-ctrl-btn" id="admin-prev-yr-btn">‹ Prev Year</button>
          <select id="admin-yr-select" class="admin-ctrl-select">
            ${optionsHtml}
          </select>
          <button type="button" class="admin-ctrl-btn" id="admin-next-yr-btn">Next Year ›</button>
        </div>
      </div>
    `;
  }

  // Custom Range
  return `
    <div class="admin-period-control-bar">
      <div class="admin-period-control-inner">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-roast-muted);">From:</span>
        <input type="date" id="admin-custom-from-input" class="admin-ctrl-input" value="${adminCustomFrom}">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-roast-muted);">To:</span>
        <input type="date" id="admin-custom-to-input" class="admin-ctrl-input" value="${adminCustomTo}">
        <button type="button" id="admin-custom-apply-btn" class="admin-ctrl-btn is-primary">Apply Range</button>
      </div>
    </div>
  `;
}

function renderAdminPage() {
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

  // Filter Transactions by search and payment method
  const tQuery = adminTxSearch.toLowerCase().trim();
  let filteredTx = (report.transactions || []).filter(tx => {
    if (adminTxMethod !== 'all' && tx.method !== adminTxMethod) return false;
    if (!tQuery) return true;
    return (
      tx.receiptNumber.toLowerCase().includes(tQuery) ||
      tx.customerName.toLowerCase().includes(tQuery) ||
      (tx.customerId && tx.customerId.toLowerCase().includes(tQuery)) ||
      tx.items.toLowerCase().includes(tQuery)
    );
  });

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

  // Transactions Table Rows
  const transactionRowsHtml = filteredTx.length === 0
    ? `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--color-roast-muted);">No transactions match this period and filter.</td></tr>`
    : filteredTx.map(tx => `
        <tr class="admin-table-row">
          <td class="font-mono" style="font-size: 0.82rem; color: var(--color-espresso); white-space: nowrap;">
            ${tx.time}
          </td>
          <td class="font-mono" style="font-weight: 600; font-size: 0.82rem; color: var(--color-roast-muted); white-space: nowrap;">
            ${tx.receiptNumber}
          </td>
          <td style="white-space: nowrap;">
            <div style="font-weight: 600; font-size: 0.86rem; color: var(--color-espresso);">${tx.customerName}</div>
            ${tx.customerId ? `<div class="font-mono" style="font-size: 0.72rem; color: var(--color-roast-muted);">${tx.customerId}</div>` : ''}
          </td>
          <td style="font-size: 0.84rem; color: var(--color-espresso); max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${tx.items}
          </td>
          <td style="white-space: nowrap;">
            <span class="admin-tx-method-badge font-mono ${tx.method.toLowerCase()}">${tx.method}</span>
          </td>
          <td class="font-mono admin-highlight-number" style="white-space: nowrap;">
            ${formatInr(tx.amount)}
          </td>
          <td style="white-space: nowrap;">
            <span class="admin-tx-pill admin-tx-settled">✓ ${tx.status}</span>
          </td>
        </tr>
      `).join('');

  // Customer Table Rows
  const customerRowsHtml = filteredCustomers.map(c => {
    const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const isBirthdayMonth = c.dob && (c.dob.includes('-10-') || c.dob.toLowerCase().includes('oct'));

    return `
      <tr class="admin-table-row">
        <!-- Customer Monogram & Name -->
        <td class="admin-td-customer">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="admin-customer-avatar">${initials}</div>
            <div>
              <div class="admin-customer-name">${c.name}</div>
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
            ${isBirthdayMonth ? `<span class="admin-birthday-tag" title="Birthday Perk Active this month!">🎂 Active</span>` : ''}
          </div>
        </td>

        <!-- Number & Mail -->
        <td class="admin-td-contact">
          <div class="admin-contact-phone font-mono">${c.phone}</div>
          <div class="admin-contact-email">${c.email}</div>
        </td>

        <!-- Tier / Status Badge -->
        <td class="admin-td-tier">
          <span class="admin-tier-badge ${c.tier.toLowerCase().includes('vip') ? 'vip' : 'gold'}">
            ${c.tier}
          </span>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="admin-portal-root">
      <div class="container">
        
        <!-- Top Executive Header -->
        <div class="admin-header-row">
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

          <div class="admin-header-actions">
            <a href="#staff" class="btn-secondary" style="font-size: 0.82rem; padding: 0.45rem 0.9rem;">
              <span>Till Register ↗</span>
            </a>
            <a href="#dashboard" class="btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
              <span>Customer View</span>
            </a>
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

          <!-- Hero Number & Bento Grid (AOV Removed as requested: 3 balanced cards) -->
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

        <!-- 2. DATE-WISE TRANSACTIONS LEDGER SECTION FOR CHOSEN DATE/PERIOD -->
        <div class="admin-card-surface" style="margin-bottom: 2rem;">
          
          <div class="admin-ledger-header">
            <div>
              <span class="admin-section-eyebrow">TRANSACTIONS LEDGER</span>
              <h2 style="font-size: 1.4rem; margin: 2px 0 0; font-family: var(--font-serif);">
                Orders for ${report.periodName} (${filteredTx.length})
              </h2>
            </div>

            <!-- Search & Payment Filter Controls -->
            <div class="admin-ledger-controls">
              <!-- Search Input -->
              <div class="admin-search-wrap">
                <input 
                  type="text" 
                  id="admin-tx-search-input" 
                  class="admin-search-input" 
                  placeholder="Search receipt, customer, item..." 
                  value="${adminTxSearch}"
                >
              </div>

              <!-- Payment Method Filter -->
              <select id="admin-tx-payment-select" class="admin-select-input">
                <option value="all" ${adminTxMethod === 'all' ? 'selected' : ''}>All Methods</option>
                <option value="UPI" ${adminTxMethod === 'UPI' ? 'selected' : ''}>UPI</option>
                <option value="Card" ${adminTxMethod === 'Card' ? 'selected' : ''}>Card</option>
                <option value="Cash" ${adminTxMethod === 'Cash' ? 'selected' : ''}>Cash</option>
              </select>
            </div>
          </div>

          <!-- Transactions Table -->
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Time / Date</th>
                  <th>Receipt #</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${transactionRowsHtml}
              </tbody>
            </table>
          </div>

        </div>

        <!-- 3. CUSTOMERS DIRECTORY SECTION -->
        <div class="admin-card-surface">
          
          <div class="admin-ledger-header">
            <div>
              <span class="admin-section-eyebrow">CUSTOMER DIRECTORY</span>
              <h2 style="font-size: 1.4rem; margin: 2px 0 0; font-family: var(--font-serif);">
                Member Accounts (${filteredCustomers.length})
              </h2>
            </div>

            <!-- Search & Sort Controls -->
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
          </div>

          <!-- Customer Table -->
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Visits</th>
                  <th>Spends</th>
                  <th>DOB</th>
                  <th>Number / Mail</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                ${customerRowsHtml}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  `;
}

function initAdminEvents() {
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
      adminSelectedDate = e.target.value;
      if (window.router) window.router.render();
    });
  }

  // Daily Prev / Today / Next Buttons
  const prevDayBtn = document.getElementById('admin-prev-day-btn');
  if (prevDayBtn) {
    prevDayBtn.addEventListener('click', () => {
      const d = new Date(adminSelectedDate);
      d.setDate(d.getDate() - 1);
      adminSelectedDate = d.toISOString().slice(0, 10);
      if (window.router) window.router.render();
    });
  }

  const todayBtn = document.getElementById('admin-today-btn');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      adminSelectedDate = new Date().toISOString().slice(0, 10);
      if (window.router) window.router.render();
    });
  }

  const nextDayBtn = document.getElementById('admin-next-day-btn');
  if (nextDayBtn) {
    nextDayBtn.addEventListener('click', () => {
      const d = new Date(adminSelectedDate);
      d.setDate(d.getDate() + 1);
      adminSelectedDate = d.toISOString().slice(0, 10);
      if (window.router) window.router.render();
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
        adminCustomTo = toEl.value;
        if (window.router) window.router.render();
      }
    });
  }

  // Transactions Search
  const txSearch = document.getElementById('admin-tx-search-input');
  if (txSearch) {
    txSearch.addEventListener('input', (e) => {
      adminTxSearch = e.target.value;
      if (window.router) window.router.render();
      const newEl = document.getElementById('admin-tx-search-input');
      if (newEl) {
        newEl.focus();
        newEl.setSelectionRange(newEl.value.length, newEl.value.length);
      }
    });
  }

  // Transactions Payment Filter
  const txFilter = document.getElementById('admin-tx-payment-select');
  if (txFilter) {
    txFilter.addEventListener('change', (e) => {
      adminTxMethod = e.target.value;
      if (window.router) window.router.render();
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
}

window.renderAdminPage = renderAdminPage;
window.initAdminEvents = initAdminEvents;
