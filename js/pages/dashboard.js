/* ==========================================================================
   ATELIER CUSTOMER DASHBOARD
   Hero digital card, visual loyalty progress, next reward spotlight, activity timeline
   ========================================================================== */

function renderDashboardPage() {
  const store = window.AtelierStore;
  const state = store.getState();
  const { user, membership, activities } = state;
  const stamps = membership.currentStamps;
  const maxStamps = membership.maxStamps;
  const visitsLeft = Math.max(0, maxStamps - stamps);
  const progressPercent = Math.min(100, Math.round((stamps / maxStamps) * 100));

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
        <span class="timeline-time">${act.date} • ${act.time}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="dashboard-page-root" style="padding: 2rem 0 5rem;">
      <div class="container container-narrow">
        
        <!-- 1. HEADER GREETING -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="eyebrow eyebrow-accent" style="margin-bottom: 0.6rem;">
              <span>✦</span>
              <span>${user.tier} • Member #${user.membershipId}</span>
            </div>
            <h1 style="font-size: clamp(2rem, 4vw, 2.8rem);">
              Welcome back, ${user.firstName}.
            </h1>
            <p style="color: var(--color-roast-medium); font-size: 0.95rem; margin-top: 4px;">
              ${visitsLeft === 0 ? 'Your card is full! Claim your complimentary reward below.' : `${visitsLeft} more ${visitsLeft === 1 ? 'visit' : 'visits'} until your next seasonal reward.`}
            </p>
          </div>

          <!-- Quick Actions -->
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <a href="#staff" class="btn-secondary" style="padding: 0.55rem 1rem; font-size: 0.85rem;">
              <span style="color: var(--color-gold-foil);">☕</span>
              <span>Barista Till (₹${state.settings.rupeesPerPoint || 10}=1pt)</span>
            </a>
            <a href="#rewards" class="btn-secondary" style="padding: 0.55rem 1rem; font-size: 0.85rem;">
              <span>Rewards (${state.rewards.filter(r => r.status === 'ready').length} Ready)</span>
            </a>
          </div>
        </div>

        <!-- 2. PROMINENT DIGITAL LOYALTY CARD -->
        <div class="double-bezel" style="margin-bottom: 2.2rem; background: var(--bg-canvas-subtle);">
          <div class="double-bezel-inner" style="padding: 2.2rem 1.8rem; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 100%; max-width: 440px;">
              ${window.renderLoyaltyCard({ interactive: true })}
            </div>

            <!-- Card Bottom Bar Controls -->
            <div style="width: 100%; max-width: 440px; margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span class="font-mono" style="font-size: 0.85rem; font-weight: 600; color: var(--color-espresso);">
                  ${stamps} / ${maxStamps} Visits
                </span>
                <span style="font-size: 0.75rem; color: var(--color-roast-muted);">(${visitsLeft} to go)</span>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button id="dash-quick-stamp-btn" class="btn-primary" style="padding: 0.45rem 0.55rem 0.45rem 1rem; font-size: 0.82rem;">
                  <span>Collect Stamp</span>
                  <div class="btn-icon-wrapper" style="width: 1.6rem; height: 1.6rem;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CAFÉ MENU POINTS & CONVERSION RATE SPOTLIGHT -->
        <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); border-radius: 20px; padding: 1.4rem 1.6rem; margin-bottom: 2.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.2rem;">
          <div>
            <div class="eyebrow" style="background: rgba(200, 157, 75, 0.12); color: #8A641A; border-color: rgba(200, 157, 75, 0.3); margin-bottom: 0.3rem;">
              <span>✦</span>
              <span>Points Rule: ₹${state.settings.rupeesPerPoint || 10} spent = 1 Point</span>
            </div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.2rem; font-family: var(--font-serif);">Every product earns points for your account</h3>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <span class="step-chip">☕ Cappuccino ₹180 (<strong>+${store.calculatePoints(180)} pts</strong>)</span>
              <span class="step-chip">🏺 Artisan Kaapi ₹280 (<strong>+${store.calculatePoints(280)} pts</strong>)</span>
              <span class="step-chip">🧪 V60 ₹360 (<strong>+${store.calculatePoints(360)} pts</strong>)</span>
            </div>
          </div>

          <a href="#staff" class="btn-secondary" style="padding: 0.55rem 1rem; font-size: 0.82rem;">
            <span>Order at Counter (Till) →</span>
          </a>
        </div>

        <!-- 3. VISUAL PROGRESS BAR & QUICK STATS -->
        <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); border-radius: 20px; padding: 1.8rem; margin-bottom: 2.2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
            <div>
              <span style="font-weight: 600; font-size: 0.95rem;">Card Progress</span>
              <span style="font-size: 0.8rem; color: var(--color-roast-muted); margin-left: 0.5rem;">Cycle 3</span>
            </div>
            <span class="font-mono" style="font-weight: 600; color: var(--color-terracotta);">${progressPercent}%</span>
          </div>

          <div class="reward-progress-track" style="height: 9px; margin-bottom: 1.4rem;">
            <div class="reward-progress-fill ${progressPercent === 100 ? 'full' : ''}" style="width: ${progressPercent}%;"></div>
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; border-top: 1px solid var(--color-cream-border-subtle); padding-top: 1.2rem;">
            <div>
              <div class="font-serif" style="font-size: 1.6rem; font-weight: 600; color: var(--color-espresso);">${membership.points}</div>
              <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Points Balance</div>
            </div>
            <div>
              <div class="font-serif" style="font-size: 1.6rem; font-weight: 600; color: var(--color-forest-roast);">${membership.lifetimeVisits}</div>
              <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Lifetime Visits</div>
            </div>
            <div>
              <div class="font-serif" style="font-size: 1.6rem; font-weight: 600; color: var(--color-gold-foil);">${membership.rewardsRedeemedCount}</div>
              <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Privileges Enjoyed</div>
            </div>
          </div>
        </div>

        <!-- 4. YOUR NEXT REWARD SPOTLIGHT -->
        <div class="double-bezel" style="margin-bottom: 2.5rem;">
          <div class="double-bezel-inner" style="padding: 1.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div class="reward-icon-box" style="margin-bottom: 0; width: 3.6rem; height: 3.6rem; font-size: 1.6rem;">☕</div>
              <div>
                <span class="reward-badge ready" style="margin-bottom: 0.4rem; display: inline-block;">Ready to Redeem</span>
                <h3 style="font-size: 1.35rem; margin-bottom: 2px;">Chikmagalur Single-Estate Pour Over</h3>
                <p style="font-size: 0.85rem; color: var(--color-roast-medium);">5 visits threshold reached. Savor a Baba Budangiri & Attikan Estate V60.</p>
              </div>
            </div>

            <div style="display: flex; gap: 0.8rem; align-items: center;">
              <button id="dash-redeem-now-btn" class="btn-primary btn-terracotta" style="padding: 0.6rem 1.25rem;">
                <span>Redeem Pass</span>
              </button>
              <a href="#rewards" class="btn-secondary" style="padding: 0.6rem 1rem;">View All</a>
            </div>
          </div>
        </div>

        <!-- 5. RECENT ACTIVITY TIMELINE -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
            <div>
              <h2 style="font-size: 1.6rem;">Recent Visits</h2>
              <p style="font-size: 0.82rem; color: var(--color-roast-muted);">Tap any item to inspect brewing lot details & receipt</p>
            </div>
            <a href="#activity" class="btn-text" style="font-size: 0.85rem;">View Full Ledger ↗</a>
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

  // Quick Collect Stamp Button -> Requires Café Owner Password / PIN
  document.getElementById('dash-quick-stamp-btn')?.addEventListener('click', () => {
    if (window.openOwnerStampModal) {
      window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
    } else {
      const res = window.AtelierStore.addStamp('Chikmagalur Single-Estate Pour Over');
      window.showToast(`Stamp #${res.newVisits} stamped! +25 Points ☕`);
    }
  });

  // Tapping next target slot on loyalty card also prompts for Café Owner verification
  document.querySelectorAll('.stamp-slot.next-target').forEach(slot => {
    slot.style.cursor = 'pointer';
    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.openOwnerStampModal) {
        window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
      }
    });
  });

  // Redeem Now from Dashboard
  document.getElementById('dash-redeem-now-btn')?.addEventListener('click', () => {
    const pass = window.AtelierStore.redeemReward('rew_pourover');
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
