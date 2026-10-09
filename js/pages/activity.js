/* ==========================================================================
   ATELIER ACTIVITY & VISIT LEDGER
   Comprehensive timeline of stamps collected, points credited, and redemptions
   ========================================================================== */

function renderActivityPage() {
  const store = window.AtelierStore;
  const state = store.getState();
  const { activities, membership } = state;

  const itemsHtml = activities.map(act => `
    <div class="timeline-item" data-act-id="${act.id}">
      <div class="timeline-left">
        <div class="timeline-icon-disc">
          ${act.type === 'stamp' ? `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            </svg>
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          `}
        </div>
        <div>
          <div class="timeline-title">${act.title}</div>
          <div class="timeline-subtitle">${act.subtitle}</div>
          <div style="font-size: 0.72rem; color: var(--color-roast-muted); margin-top: 2px;">
            ${act.location}
          </div>
        </div>
      </div>

      <div class="timeline-right">
        <span class="timeline-stamp-badge font-mono" style="${act.type === 'redemption' ? 'color: var(--color-terracotta);' : ''}">
          ${act.type === 'redemption' ? 'Pass Redeemed' : `+${act.pointsEarned} Pts`}
        </span>
        <span class="timeline-time">${act.date} • ${act.time}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="activity-page-root" style="padding: 2.5rem 0 5rem;">
      <div class="container container-narrow">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="eyebrow eyebrow-accent">The Ledger</div>
            <h1 style="margin-bottom: 0.5rem;">Visit & Stamp History</h1>
            <p style="color: var(--color-roast-medium); font-size: 0.95rem;">
              Complete record of your coffee orders and privilege redemptions.
            </p>
          </div>

          <!-- Total Balance Pill -->
          <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); padding: 0.6rem 1.2rem; border-radius: 16px; text-align: right;">
            <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Current Balance</div>
            <div class="font-serif" style="font-size: 1.4rem; font-weight: 600; color: var(--color-espresso);">${membership.points} Points</div>
          </div>
        </div>

        <!-- Ledger List -->
        <div class="timeline-list">
          ${itemsHtml}
        </div>

      </div>
    </div>
  `;
}

function initActivityEvents() {
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {
      const actId = item.getAttribute('data-act-id');
      const act = window.AtelierStore.getState().activities.find(a => a.id === actId);
      if (act) {
        window.openReceiptModal(act);
      }
    });
  });
}

window.renderActivityPage = renderActivityPage;
window.initActivityEvents = initActivityEvents;
