/* ==========================================================================
   ATELIER CAFÉ OWNER ADMIN PORTAL
   High-end minimalist executive dashboard focusing on numbers:
   - Total Revenue (Daily, Weekly, 15 Days, Monthly, Quarterly, 6 Months, Year)
   - Number of Customers
   - Customer Directory (Visits, Spends, DOB, Phone Number, Email)
   - Dynamic real-time integration with AtelierStore
   ========================================================================== */

let adminTimeframe = 'monthly'; // 'daily' | 'weekly' | '15days' | 'monthly' | 'quarterly' | '6months' | 'year'
let adminSearchQuery = '';
let adminSortBy = 'spends_desc'; // 'spends_desc' | 'visits_desc' | 'name_asc' | 'dob'

// Baseline realistic café data synthesized with live session store
const BASE_REVENUE_METRICS = {
  daily: {
    label: 'Today (Daily)',
    periodName: 'Today',
    revenue: 8420,
    orders: 22,
    aov: 382.7,
    growth: '+8.4%',
    intervals: [
      { label: '8 AM', value: 920 },
      { label: '10 AM', value: 2150 },
      { label: '12 PM', value: 1640 },
      { label: '2 PM', value: 980 },
      { label: '4 PM', value: 1450 },
      { label: '6 PM', value: 890 },
      { label: '8 PM', value: 390 }
    ]
  },
  weekly: {
    label: 'Last 7 Days (Weekly)',
    periodName: 'This Week',
    revenue: 54680,
    orders: 143,
    aov: 382.4,
    growth: '+12.1%',
    intervals: [
      { label: 'Mon', value: 6840 },
      { label: 'Tue', value: 7210 },
      { label: 'Wed', value: 6950 },
      { label: 'Thu', value: 7890 },
      { label: 'Fri', value: 9420 },
      { label: 'Sat', value: 10450 },
      { label: 'Sun', value: 5920 }
    ]
  },
  '15days': {
    label: 'Last 15 Days',
    periodName: 'Past 15 Days',
    revenue: 118450,
    orders: 308,
    aov: 384.5,
    growth: '+10.5%',
    intervals: [
      { label: 'Day 1-3', value: 22100 },
      { label: 'Day 4-6', value: 24800 },
      { label: 'Day 7-9', value: 21900 },
      { label: 'Day 10-12', value: 25400 },
      { label: 'Day 13-15', value: 24250 }
    ]
  },
  monthly: {
    label: 'Last 30 Days (Monthly)',
    periodName: 'This Month',
    revenue: 242800,
    orders: 628,
    aov: 386.6,
    growth: '+14.2%',
    intervals: [
      { label: 'Week 1', value: 54200 },
      { label: 'Week 2', value: 61800 },
      { label: 'Week 3', value: 59400 },
      { label: 'Week 4', value: 67400 }
    ]
  },
  quarterly: {
    label: 'Quarterly (3 Months)',
    periodName: 'Q3 - Past 90 Days',
    revenue: 714500,
    orders: 1842,
    aov: 387.9,
    growth: '+16.8%',
    intervals: [
      { label: 'Month 1', value: 228000 },
      { label: 'Month 2', value: 243700 },
      { label: 'Month 3', value: 242800 }
    ]
  },
  '6months': {
    label: 'Past 6 Months',
    periodName: 'H2 (6 Months)',
    revenue: 1480200,
    orders: 3790,
    aov: 390.5,
    growth: '+18.4%',
    intervals: [
      { label: 'M1', value: 232000 },
      { label: 'M2', value: 241000 },
      { label: 'M3', value: 248000 },
      { label: 'M4', value: 254000 },
      { label: 'M5', value: 249000 },
      { label: 'M6', value: 256200 }
    ]
  },
  year: {
    label: 'Full Year (12 Months)',
    periodName: 'Annual 2026',
    revenue: 3145000,
    orders: 8020,
    aov: 392.1,
    growth: '+22.5%',
    intervals: [
      { label: 'Q1', value: 685000 },
      { label: 'Q2', value: 745000 },
      { label: 'Q3', value: 815000 },
      { label: 'Q4', value: 900000 }
    ]
  }
};

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

function getAggregatedCustomers() {
  const store = window.AtelierStore;
  const state = store ? store.getState() : {};
  const liveUser = state.user;
  const liveMembership = state.membership;
  const activities = state.activities || [];

  // Calculate live user spends from recorded activities
  let liveUserSpends = 6840;
  activities.forEach(act => {
    if (act.type === 'transaction' && act.amountSpent) {
      liveUserSpends += Number(act.amountSpent);
    }
  });

  const customers = JSON.parse(JSON.stringify(BASE_CUSTOMERS));

  // Sync current user state if logged in
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

function getRevenueData(timeframe) {
  const data = BASE_REVENUE_METRICS[timeframe] || BASE_REVENUE_METRICS.monthly;
  const store = window.AtelierStore;
  const activities = store ? store.getState().activities || [] : [];

  // Add any new session transactions to current period
  let extraSpend = 0;
  let extraOrders = 0;
  activities.forEach(act => {
    if (act.type === 'transaction' && act.amountSpent) {
      extraSpend += Number(act.amountSpent);
      extraOrders += 1;
    }
  });

  const totalRev = data.revenue + extraSpend;
  const totalOrders = data.orders + extraOrders;
  const calculatedAov = totalOrders > 0 ? (totalRev / totalOrders).toFixed(1) : data.aov;

  return {
    ...data,
    revenue: totalRev,
    orders: totalOrders,
    aov: calculatedAov
  };
}

function formatInr(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

function renderAdminPage() {
  const rev = getRevenueData(adminTimeframe);
  const customers = getAggregatedCustomers();
  const totalCustomersCount = customers.length;

  // Filter customers by search
  const query = adminSearchQuery.toLowerCase().trim();
  let filtered = customers.filter(c => {
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.membershipId.toLowerCase().includes(query)
    );
  });

  // Sort customers
  if (adminSortBy === 'spends_desc') {
    filtered.sort((a, b) => b.spends - a.spends);
  } else if (adminSortBy === 'visits_desc') {
    filtered.sort((a, b) => b.visits - a.visits);
  } else if (adminSortBy === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (adminSortBy === 'dob') {
    filtered.sort((a, b) => a.dob.localeCompare(b.dob));
  }

  // Calculate highest revenue interval for sparkline height normalization
  const maxInterval = Math.max(...rev.intervals.map(i => i.value), 1);

  // Sparkline Bars
  const sparklineBarsHtml = rev.intervals.map(item => {
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

  // Customer Table Rows
  const customerRowsHtml = filtered.map((c, idx) => {
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
              Real-time revenue metrics, multi-period fiscal ledger, and member intelligence.
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

        <!-- 1. TOTAL REVENUE ANALYTICS HERO -->
        <div class="admin-card-surface" style="margin-bottom: 2rem;">
          
          <!-- Section Bar: Title & 7 Timeframe Tabs -->
          <div class="admin-revenue-header-bar">
            <div>
              <span class="admin-section-eyebrow">FISCAL PERFORMANCE</span>
              <h2 style="font-size: 1.4rem; margin: 2px 0 0; font-family: var(--font-serif);">Total Revenue</h2>
            </div>

            <!-- Timeframe Filter Tabs: Daily / Weekly / 15 Days / Monthly / Quarterly / 6 Months / Year -->
            <div class="admin-timeframe-tabs">
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'daily' ? 'is-active' : ''}" data-tf="daily">Daily</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'weekly' ? 'is-active' : ''}" data-tf="weekly">Weekly</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === '15days' ? 'is-active' : ''}" data-tf="15days">15 Days</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'monthly' ? 'is-active' : ''}" data-tf="monthly">Monthly</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'quarterly' ? 'is-active' : ''}" data-tf="quarterly">Quarterly</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === '6months' ? 'is-active' : ''}" data-tf="6months">6 Months</button>
              <button type="button" class="admin-tab-btn ${adminTimeframe === 'year' ? 'is-active' : ''}" data-tf="year">Year</button>
            </div>
          </div>

          <!-- Hero Number & Bento Grid -->
          <div class="admin-bento-grid">
            
            <!-- Primary Revenue Bento -->
            <div class="admin-bento-card admin-bento-hero">
              <div class="admin-bento-subhead">${rev.label}</div>
              <div class="admin-hero-number font-serif">
                ${formatInr(rev.revenue)}
              </div>
              <div class="admin-trend-badge font-mono">
                <span>↑ ${rev.growth}</span>
                <span style="color: var(--color-roast-muted); font-size: 0.75rem;">vs prev period</span>
              </div>
            </div>

            <!-- Total Orders / Transactions -->
            <div class="admin-bento-card">
              <div class="admin-bento-subhead">TRANSACTIONS</div>
              <div class="admin-bento-number font-serif">${rev.orders}</div>
              <div class="admin-bento-foot font-mono">Completed Orders</div>
            </div>

            <!-- Average Order Value (AOV) -->
            <div class="admin-bento-card">
              <div class="admin-bento-subhead">AVG ORDER VALUE</div>
              <div class="admin-bento-number font-serif">₹${rev.aov}</div>
              <div class="admin-bento-foot font-mono">Per Transaction</div>
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
                ${rev.periodName} Revenue Distribution
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

        <!-- 2. CUSTOMERS LEDGER SECTION -->
        <div class="admin-card-surface">
          
          <!-- Ledger Controls Header -->
          <div class="admin-ledger-header">
            <div>
              <span class="admin-section-eyebrow">CUSTOMER DIRECTORY</span>
              <h2 style="font-size: 1.4rem; margin: 2px 0 0; font-family: var(--font-serif);">
                Member Accounts (${filtered.length})
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
                  value="${adminSearchQuery}"
                >
              </div>

              <!-- Sort Dropdown -->
              <select id="admin-customer-sort-select" class="admin-select-input">
                <option value="spends_desc" ${adminSortBy === 'spends_desc' ? 'selected' : ''}>Sort by Spends (High → Low)</option>
                <option value="visits_desc" ${adminSortBy === 'visits_desc' ? 'selected' : ''}>Sort by Visits</option>
                <option value="name_asc" ${adminSortBy === 'name_asc' ? 'selected' : ''}>Sort by Name (A-Z)</option>
                <option value="dob" ${adminSortBy === 'dob' ? 'selected' : ''}>Sort by DOB</option>
              </select>
            </div>
          </div>

          <!-- Table Container -->
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
  // Timeframe Filter Buttons
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

  // Search Input Filter
  const searchInput = document.getElementById('admin-customer-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      adminSearchQuery = e.target.value;
      if (window.router) window.router.render();
      // Keep focus in input
      const newInput = document.getElementById('admin-customer-search-input');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    });
  }

  // Sort Selector
  const sortSelect = document.getElementById('admin-customer-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      adminSortBy = e.target.value;
      if (window.AtelierAudio && window.AtelierAudio.playTap) window.AtelierAudio.playTap();
      if (window.router) window.router.render();
    });
  }
}

window.renderAdminPage = renderAdminPage;
window.initAdminEvents = initAdminEvents;
