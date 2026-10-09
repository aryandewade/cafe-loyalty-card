/* ==========================================================================
   ATELIER REWARDS CATALOG & REDEMPTION SYSTEM
   Tier requirements, progress bars, unlock states, redemption modal flow
   ========================================================================== */

let activeFilter = 'all';

function renderRewardsPage() {
  const store = window.AtelierStore;
  const state = store.getState();
  const { membership, rewards } = state;
  const visits = membership.currentStamps;

  // Filter rewards
  const filteredRewards = rewards.filter(r => {
    if (activeFilter === 'ready') return r.status === 'ready';
    if (activeFilter === 'progress') return r.status === 'in-progress';
    if (activeFilter === 'redeemed') return r.status === 'redeemed';
    return true;
  });

  const cardsHtml = filteredRewards.map(reward => {
    const isReady = reward.status === 'ready';
    const isRedeemed = reward.status === 'redeemed';
    const isProgress = reward.status === 'in-progress';
    const percent = Math.min(100, Math.round((visits / reward.requiredVisits) * 100));
    const visitsNeeded = Math.max(0, reward.requiredVisits - visits);

    let badgeClass = 'locked';
    let badgeText = `${reward.requiredVisits} Visits`;
    if (isReady) {
      badgeClass = 'ready';
      badgeText = 'Ready to Claim';
    } else if (isRedeemed) {
      badgeClass = 'locked';
      badgeText = 'Claimed';
    } else if (isProgress) {
      badgeClass = 'progress';
      badgeText = `${visitsNeeded} to go`;
    }

    return `
      <div class="double-bezel">
        <div class="reward-card">
          <div class="reward-card-header">
            <div class="reward-icon-box">${reward.icon}</div>
            <span class="reward-badge ${badgeClass}">${badgeText}</span>
          </div>

          <h3 class="reward-title">${reward.title}</h3>
          <p class="reward-description">${reward.description}</p>

          <!-- Progress Bar -->
          <div class="reward-progress-track">
            <div class="reward-progress-fill ${percent === 100 ? 'full' : ''}" style="width: ${percent}%;"></div>
          </div>

          <div class="reward-meta-row">
            <span>${visits} / ${reward.requiredVisits} Visits</span>
            <span>${percent}% Complete</span>
          </div>

          <!-- Action Button -->
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--color-cream-border-subtle);">
            ${isReady ? `
              <button class="btn-primary btn-terracotta redeem-action-btn" data-reward-id="${reward.id}" style="width: 100%; justify-content: center; padding: 0.65rem 1rem;">
                <span>Redeem Reward</span>
                <div class="btn-icon-wrapper" style="width: 1.7rem; height: 1.7rem;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </button>
            ` : isRedeemed ? `
              <button class="btn-secondary" disabled style="width: 100%; justify-content: center; opacity: 0.6; cursor: not-allowed;">
                <span>Redeemed on Sep 28</span>
              </button>
            ` : `
              <button class="btn-secondary" style="width: 100%; justify-content: center; opacity: 0.75; cursor: default;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.4rem;">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>${visitsNeeded} more visits needed</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="rewards-page-root" style="padding: 2.5rem 0 5rem;">
      <div class="container">
        
        <!-- Header -->
        <div style="max-width: 680px; margin-bottom: 2.5rem;">
          <div class="eyebrow eyebrow-accent">The Reserve Catalog</div>
          <h1 style="margin-bottom: 0.6rem;">Member Privileges</h1>
          <p style="color: var(--color-roast-medium); font-size: 1.05rem; line-height: 1.6;">
            Every visit unlocks tangible rewards, from our signature single-origin extractions to private sensory cuppings with our master roaster.
          </p>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 0.6rem; margin-bottom: 2.2rem; flex-wrap: wrap;">
          <button class="btn-secondary filter-tab-btn ${activeFilter === 'all' ? 'btn-terracotta' : ''}" data-filter="all" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
            All Privileges (${rewards.length})
          </button>
          <button class="btn-secondary filter-tab-btn ${activeFilter === 'ready' ? 'btn-terracotta' : ''}" data-filter="ready" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
            Ready to Redeem (${rewards.filter(r => r.status === 'ready').length})
          </button>
          <button class="btn-secondary filter-tab-btn ${activeFilter === 'progress' ? 'btn-terracotta' : ''}" data-filter="progress" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
            In Progress (${rewards.filter(r => r.status === 'in-progress').length})
          </button>
        </div>

        <!-- Rewards Grid -->
        <div class="rewards-grid">
          ${cardsHtml}
        </div>

      </div>
    </div>
  `;
}

function initRewardsEvents() {
  // Filter tabs
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter');
      window.router.render();
    });
  });

  // Redeem Button Click -> In-App Confirmation Modal -> Digital Pass
  document.querySelectorAll('.redeem-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rewId = btn.getAttribute('data-reward-id');
      const reward = window.AtelierStore.getState().rewards.find(r => r.id === rewId);
      if (!reward) return;

      if (window.openRedeemConfirmModal) {
        window.openRedeemConfirmModal(reward);
      } else {
        const pass = window.AtelierStore.redeemReward(rewId);
        if (pass && window.openRedemptionPassModal) {
          window.openRedemptionPassModal(pass);
        }
      }
    });
  });
}

window.renderRewardsPage = renderRewardsPage;
window.initRewardsEvents = initRewardsEvents;
