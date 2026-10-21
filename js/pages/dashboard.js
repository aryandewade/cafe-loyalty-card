/* ==========================================================================
   ATELIER CUSTOMER DASHBOARD
   Hero digital card, visual loyalty progress, next reward spotlight, activity timeline
   ========================================================================== */

let dashboardViewMode = 'card'; // 'card' | 'candy'

function renderDashboardPage() {
  const store = window.AtelierStore;
  const state = store.getState();
  const { user, membership, activities } = state;
  const stamps = membership.currentStamps;
  const maxStamps = membership.maxStamps;
  const visitsLeft = Math.max(0, maxStamps - stamps);
  const progressPercent = Math.min(100, Math.round((stamps / maxStamps) * 100));

  const currentLevelNum = window.candyEngine ? window.candyEngine.calculateCurrentLevel(membership) : 1;
  const currentLevelObj = window.candyEngine ? window.candyEngine.levels.find(l => l.level === currentLevelNum) : null;
  const levelProgress = window.candyEngine ? window.candyEngine.getLevelProgress(membership) : { pointsInCurrentLevel: membership.points || 0, pointsLeftForNextLevel: 80 };
  const starsTotal = window.candyEngine ? window.candyEngine.calculateTotalStars(membership) : 4;

  // Next Reward & Active Pass State
  const rewards = state.rewards || [];
  const activePass = state.activeRedemptionPass;
  const readyReward = rewards.find(r => r.status === 'ready');
  const inProgressReward = rewards.find(r => r.status === 'in-progress');
  const nextReward = readyReward || inProgressReward || rewards.find(r => r.status !== 'redeemed') || rewards[0];

  let rewardSectionHtml = '';
  if (activePass && activePass.status === 'active') {
    rewardSectionHtml = `
      <div class="double-bezel" style="margin-bottom: 1.8rem; border-color: rgba(200, 157, 75, 0.45);">
        <div class="double-bezel-inner" style="padding: 1.15rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.9rem; background: linear-gradient(135deg, rgba(200, 157, 75, 0.08), rgba(188, 90, 43, 0.05));">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div class="reward-icon-box" style="margin-bottom: 0; width: 2.9rem; height: 2.9rem; font-size: 1.3rem; background: rgba(200, 157, 75, 0.15); border: 1px solid var(--color-gold-foil);">☕</div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.2rem;">
                <span class="reward-badge ready" style="background: var(--color-forest-roast); color: #FFF; font-size: 0.65rem; padding: 2px 7px;">Pass Active</span>
                <span style="font-size: 0.72rem; color: var(--color-roast-muted);">Show code to counter staff</span>
              </div>
              <h3 style="font-size: 1.05rem; margin-bottom: 2px;">${activePass.rewardTitle}</h3>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 3px;">
                <span style="font-size: 0.75rem; color: var(--color-roast-medium);">Code:</span>
                <span class="font-mono" style="font-size: 1.05rem; font-weight: 800; color: var(--color-espresso); letter-spacing: 0.06em; background: rgba(0,0,0,0.06); padding: 1px 7px; border-radius: 6px;">${activePass.code}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button id="dash-copy-pass-code-btn" class="btn-primary btn-terracotta" data-code="${activePass.code}" style="padding: 0.44rem 0.95rem; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span id="dash-copy-label">Copy Code</span>
            </button>
            <button id="dash-open-active-pass-btn" class="btn-secondary" style="padding: 0.44rem 0.75rem; font-size: 0.78rem;">
              <span>View Pass</span>
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (readyReward) {
    rewardSectionHtml = `
      <div class="double-bezel" style="margin-bottom: 1.8rem;">
        <div class="double-bezel-inner" style="padding: 1.1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.9rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div class="reward-icon-box" style="margin-bottom: 0; width: 2.8rem; height: 2.8rem; font-size: 1.25rem;">${readyReward.icon || '☕'}</div>
            <div>
              <span class="reward-badge ready" style="margin-bottom: 0.2rem; display: inline-block; font-size: 0.65rem; padding: 2px 7px;">Ready</span>
              <h3 style="font-size: 1.1rem; margin-bottom: 1px;">${readyReward.title}</h3>
              <p style="font-size: 0.76rem; color: var(--color-roast-medium); margin: 0;">Complimentary Perk Unlocked</p>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="dash-redeem-now-btn" data-reward-id="${readyReward.id}" class="btn-primary btn-terracotta" style="padding: 0.44rem 0.95rem; font-size: 0.78rem;">
              <span>Redeem</span>
            </button>
            <a href="#rewards" class="btn-secondary" style="padding: 0.44rem 0.75rem; font-size: 0.78rem;">All</a>
          </div>
        </div>
      </div>
    `;
  } else {
    rewardSectionHtml = `
      <div class="double-bezel" style="margin-bottom: 1.8rem;">
        <div class="double-bezel-inner" style="padding: 1.1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.9rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div class="reward-icon-box" style="margin-bottom: 0; width: 2.8rem; height: 2.8rem; font-size: 1.25rem;">${nextReward?.icon || '🥐'}</div>
            <div>
              <span class="reward-badge" style="margin-bottom: 0.2rem; display: inline-block; font-size: 0.65rem; padding: 2px 7px; background: rgba(0, 184, 148, 0.12); color: #00B894; border: 1px solid rgba(0, 184, 148, 0.25);">
                ${nextReward?.status === 'redeemed' ? 'Claimed ✓' : 'Next Perk'}
              </span>
              <h3 style="font-size: 1.05rem; margin-bottom: 1px;">${nextReward ? nextReward.title : 'All Rewards Unlocked'}</h3>
              <p style="font-size: 0.76rem; color: var(--color-roast-medium); margin: 0;">
                ${nextReward && nextReward.status !== 'redeemed'
                  ? `${Math.max(0, nextReward.requiredVisits - stamps)} more ${Math.max(0, nextReward.requiredVisits - stamps) === 1 ? 'visit' : 'visits'} needed`
                  : 'Reward claimed! Visit café to unlock next perk.'}
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <a href="#rewards" class="btn-secondary" style="padding: 0.44rem 0.85rem; font-size: 0.78rem;">View Perks ➔</a>
          </div>
        </div>
      </div>
    `;
  }

  // Recent 4 activities
  const recentActivities = activities.slice(0, 4);
  let timelineHtml = recentActivities.map(act => `
    <div class="timeline-item" data-act-id="${act.id}">
      <div class="timeline-left">
        <div class="timeline-icon-disc">
          ${act.type === 'stamp' ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            </svg>
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          `}
        </div>
        <div>
          <div class="timeline-title">${act.title}</div>
          <div class="timeline-subtitle">${act.subtitle}</div>
        </div>
      </div>

      <div class="timeline-right">
        <span class="timeline-stamp-badge font-mono">${act.pointsEarned > 0 ? `+${act.pointsEarned} Pts` : 'Redeemed'}</span>
        <span class="timeline-time">${act.date}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="dashboard-page-root">
      <div class="container container-narrow">
        
        <!-- 1. GREETING -->
        <div class="dash-greeting-wrap">
          <div>
            <div class="eyebrow eyebrow-accent" style="margin-bottom: 0.3rem;">
              <span>✦</span>
              <span>${user.tier} • #${user.membershipId}</span>
            </div>
            <h1 style="font-size: clamp(1.75rem, 4vw, 2.3rem); margin-bottom: 0.2rem;">
              Welcome, ${user.firstName}.
            </h1>
            <p style="color: var(--color-roast-medium); font-size: 0.88rem; margin: 0;">
              ${visitsLeft === 0 ? 'Card complete • Ready to claim reward' : `${visitsLeft} ${visitsLeft === 1 ? 'visit' : 'visits'} to next reward`}
            </p>
          </div>
        </div>

        <!-- VIEW SELECTOR TABS -->
        <div class="dash-view-selector-tabs">
          <button id="dash-tab-card" class="dash-view-tab-btn ${dashboardViewMode === 'card' ? 'active' : ''}">
            <span>💳 Card</span>
          </button>
          <button id="dash-tab-candy" class="dash-view-tab-btn ${dashboardViewMode === 'candy' ? 'active' : ''}">
            <span>🗺️ Saga Road</span>
            <span class="candy-mini-badge">Lvl ${currentLevelNum}</span>
          </button>
        </div>

        <!-- 2. MAIN DISPLAY: SAGA ROAD OR LOYALTY CARD -->
        ${dashboardViewMode === 'candy' ? `
          <div style="margin-bottom: 1.8rem;">
            ${window.candyEngine ? window.candyEngine.renderSagaMap({ compact: false }) : ''}
          </div>
        ` : `
          <!-- DIGITAL LOYALTY CARD -->
          <div class="double-bezel dash-card-bezel" style="margin-bottom: 1.2rem; background: var(--bg-canvas-subtle);">
            <div class="double-bezel-inner dash-card-bezel-inner" style="display: flex; flex-direction: column; align-items: center;">
              <!-- Card Action Bar: Visits Counter & Primary Collect Stamp Button -->
              <div class="card-action-bar">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="font-mono" style="font-size: 0.88rem; font-weight: 700; color: var(--color-espresso);">
                    ${stamps} / ${maxStamps} Visits
                  </span>
                  <span style="font-size: 0.74rem; color: var(--color-roast-muted);">(${visitsLeft === 0 ? 'Full' : `${visitsLeft} left`})</span>
                </div>

                <button id="dash-quick-stamp-btn" class="btn-primary" style="padding: 0.42rem 0.65rem 0.42rem 1rem; font-size: 0.82rem;">
                  <span>Collect Stamp</span>
                  <div class="btn-icon-wrapper" style="width: 1.5rem; height: 1.5rem;">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </button>
              </div>

              <!-- The Digital Loyalty Card -->
              <div style="width: 100%; max-width: 440px;">
                ${window.renderLoyaltyCard({ interactive: true })}
              </div>
            </div>
          </div>

          <!-- SAGA PROGRESSION TEASER BANNER (MINIMAL) -->
          <div class="candy-dash-teaser-card" id="dash-open-candy-map-btn" style="margin-bottom: 1.4rem; cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="candy-teaser-avatar-bounce" style="font-size: 1.25rem;">☕</div>
              <div>
                <div style="font-size: 0.68rem; color: var(--color-gold-foil); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                  LEVEL ${currentLevelNum} • ${membership.points || 0} POINTS
                </div>
                <div style="font-size: 0.95rem; font-weight: 600; color: var(--color-espresso); font-family: var(--font-serif); margin-top: 1px;">
                  ${currentLevelObj ? currentLevelObj.title : 'Roastery Regular'}
                </div>
                <div style="font-size: 0.74rem; color: var(--color-roast-medium); margin-top: 2px;">
                  ${levelProgress.pointsInCurrentLevel}/500 Pts in Level • ${levelProgress.pointsLeftForNextLevel} pts to Level ${currentLevelNum + 1}
                </div>
              </div>
            </div>
            <button class="btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.76rem; pointer-events: none;">
              <span>Road ➔</span>
            </button>
          </div>
        `}


        <!-- 3. PROGRESS & STATS (MINIMAL) -->
        <div class="dash-stats-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <span style="font-weight: 600; font-size: 0.88rem;">Card Progress</span>
            <span class="font-mono" style="font-weight: 600; font-size: 0.88rem; color: var(--color-terracotta);">${progressPercent}%</span>
          </div>

          <div class="reward-progress-track" style="height: 7px; margin-bottom: 1rem;">
            <div class="reward-progress-fill ${progressPercent === 100 ? 'full' : ''}" style="width: ${progressPercent}%;"></div>
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; text-align: center; border-top: 1px solid var(--color-cream-border-subtle); padding-top: 0.9rem;">
            <div>
              <div class="font-serif" style="font-size: 1.45rem; font-weight: 600; color: var(--color-espresso);">${membership.points}</div>
              <div style="font-size: 0.68rem; color: var(--color-roast-muted); text-transform: uppercase;">Points</div>
            </div>
            <div>
              <div class="font-serif" style="font-size: 1.45rem; font-weight: 600; color: var(--color-forest-roast);">${membership.lifetimeVisits}</div>
              <div style="font-size: 0.68rem; color: var(--color-roast-muted); text-transform: uppercase;">Visits</div>
            </div>
            <div>
              <div class="font-serif" style="font-size: 1.45rem; font-weight: 600; color: var(--color-gold-foil);">${membership.rewardsRedeemedCount}</div>
              <div style="font-size: 0.68rem; color: var(--color-roast-muted); text-transform: uppercase;">Perks</div>
            </div>
          </div>
        </div>

        <!-- 4. NEXT REWARD / ACTIVE PASS SPOTLIGHT -->
        ${rewardSectionHtml}

        <!-- 5. RECENT VISITS (MINIMAL) -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;">
            <h2 style="font-size: 1.35rem; margin: 0;">Recent Visits</h2>
            <a href="#activity" class="btn-text" style="font-size: 0.8rem;">All ↗</a>
          </div>

          <div class="timeline-list">
            ${timelineHtml}
          </div>
        </div>

      </div>
    </div>
  `;
}

function initDashboardEvents() {
  window.initLoyaltyCardInteractions();

  // Tab switchers
  document.getElementById('dash-tab-card')?.addEventListener('click', () => {
    dashboardViewMode = 'card';
    if (window.router) window.router.render();
  });

  document.getElementById('dash-tab-candy')?.addEventListener('click', () => {
    dashboardViewMode = 'candy';
    if (window.router) window.router.render();
    if (window.initCandyLevelsEvents) window.initCandyLevelsEvents();
  });

  // Teaser banner click -> switch to Candy view
  document.getElementById('dash-open-candy-map-btn')?.addEventListener('click', () => {
    dashboardViewMode = 'candy';
    if (window.router) window.router.render();
    if (window.initCandyLevelsEvents) window.initCandyLevelsEvents();
  });

  // Quick Collect Stamp Button -> Opens Collect Stamp & Saga Level Animation Flow
  document.getElementById('dash-quick-stamp-btn')?.addEventListener('click', () => {
    if (window.openCollectStampModal) {
      window.openCollectStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over', amountSpent: 200 });
    } else if (window.openOwnerStampModal) {
      window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over', amountSpent: 200 });
    }
  });

  // Tapping next target slot on loyalty card also prompts for Collect Stamp flow
  document.querySelectorAll('.stamp-slot.next-target').forEach(slot => {
    slot.style.cursor = 'pointer';
    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.openCollectStampModal) {
        window.openCollectStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over', amountSpent: 200 });
      } else if (window.openOwnerStampModal) {
        window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over', amountSpent: 200 });
      }
    });
  });

  // Redeem Now from Dashboard
  document.getElementById('dash-redeem-now-btn')?.addEventListener('click', (e) => {
    const rewId = e.currentTarget.getAttribute('data-reward-id') || 'rew_pourover';
    const pass = window.AtelierStore.redeemReward(rewId);
    if (pass) {
      window.openRedemptionPassModal(pass);
      if (window.router) window.router.render();
    }
  });

  // Copy Pass Code from Dashboard
  document.getElementById('dash-copy-pass-code-btn')?.addEventListener('click', (e) => {
    const code = e.currentTarget.getAttribute('data-code');
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        const lbl = document.getElementById('dash-copy-label');
        if (lbl) lbl.textContent = 'Copied! ✓';
        if (window.showToast) window.showToast(`Code ${code} copied to clipboard! 📋`);
        if (window.AtelierAudio?.playTap) window.AtelierAudio.playTap();
        setTimeout(() => { if (lbl) lbl.textContent = 'Copy Code'; }, 2500);
      }).catch(() => {
        if (window.showToast) window.showToast(`Pass Code: ${code}`);
      });
    }
  });

  // Open Active Pass Modal from Dashboard
  document.getElementById('dash-open-active-pass-btn')?.addEventListener('click', () => {
    const pass = window.AtelierStore.getState().activeRedemptionPass;
    if (pass) {
      window.openRedemptionPassModal(pass);
    }
  });

  // Click activity item to open receipt
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

window.renderDashboardPage = renderDashboardPage;
window.initDashboardEvents = initDashboardEvents;
