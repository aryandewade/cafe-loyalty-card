/* ==========================================================================
   ATELIER MODALS ENGINE
   Redemption Pass, Welcome Unboxing Ceremony, Receipt Details, Forgot Password
   ========================================================================== */

let activeTimerInterval = null;

// 1. Digital Reward Redemption Pass Modal
function openRedemptionPassModal(pass) {
  closeAllModals();

  const container = document.getElementById('modal-root');
  if (!container) return;

  const qrSvg = window.generateAtelierQR ? window.generateAtelierQR(pass.code + '-ATELIER-VERIFIED', 150) : '';

  let secondsLeft = pass.expiresInMinutes * 60;
  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="redemption-pass-backdrop">
      <div class="modal-card" style="max-width: 420px;">
        <div class="ticket-pass">
          <div class="ticket-notch-left"></div>
          <div class="ticket-notch-right"></div>

          <!-- Pass Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
            <div style="text-align: left;">
              <span style="font-family: var(--font-serif); font-size: 1.15rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.08em; display: block;">Atelier Café</span>
              <span style="font-size: 0.68rem; color: var(--color-gold-foil); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;">Reward Redemption Pass</span>
            </div>
            <button class="btn-text" id="close-pass-btn" style="padding: 0.2rem; font-size: 1.2rem; color: var(--color-roast-muted);">✕</button>
          </div>

          <div style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 600; color: var(--color-espresso); margin: 0.6rem 0 0.2rem;">
            ${pass.rewardTitle}
          </div>
          <div style="font-size: 0.8rem; color: var(--color-roast-medium);">
            Member: <strong>${pass.customerName}</strong> (${pass.membershipId})
          </div>

          <!-- Center QR Matrix -->
          <div class="ticket-qr-container">
            ${qrSvg}
          </div>

          <!-- Redemption Code & Timer -->
          <div class="ticket-code">${pass.code}</div>
          <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;">
            Show this pass to staff at the counter
          </div>

          <div class="ticket-dashed-divider"></div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="ticket-timer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span id="pass-countdown-text">Valid: ${formatTime(secondsLeft)}</span>
            </div>

            <!-- Barista Verification Simulator -->
            <button id="barista-verify-pass-btn" class="btn-secondary" style="padding: 0.35rem 0.85rem; font-size: 0.75rem; border-color: var(--color-forest-roast); color: var(--color-forest-roast);">
              <span>Staff: Mark Verified ✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Start countdown
  if (activeTimerInterval) clearInterval(activeTimerInterval);
  activeTimerInterval = setInterval(() => {
    secondsLeft--;
    const timerEl = document.getElementById('pass-countdown-text');
    if (timerEl) {
      if (secondsLeft > 0) {
        timerEl.textContent = `Valid: ${formatTime(secondsLeft)}`;
      } else {
        timerEl.textContent = 'Expired';
        clearInterval(activeTimerInterval);
      }
    }
  }, 1000);

  // Close Listener
  document.getElementById('close-pass-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('redemption-pass-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'redemption-pass-backdrop') closeAllModals();
  });

  // Verify Listener
  document.getElementById('barista-verify-pass-btn')?.addEventListener('click', () => {
    window.AtelierStore.confirmPassVerification();
    closeAllModals();
    window.showToast(`Reward pass #${pass.code} verified by barista! Enjoy your treat! ☕`);
  });
}

// 2. Welcome Ceremony Unboxing Modal (Post-Registration)
function openWelcomeCeremonyModal(user) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  if (window.AtelierAudio) window.AtelierAudio.playRewardUnlock();
  if (window.launchAtelierCelebration) window.launchAtelierCelebration();

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="welcome-modal-backdrop">
      <div class="modal-card" style="max-width: 480px; text-align: center; padding: 2rem 1.5rem;">
        <div class="eyebrow eyebrow-accent">Welcome to the Club</div>
        
        <h2 style="font-size: 2.2rem; margin-bottom: 0.6rem;">
          Welcome, ${user.firstName}.
        </h2>
        <p style="color: var(--color-roast-medium); font-size: 0.95rem; margin-bottom: 1.8rem; line-height: 1.6;">
          Your digital membership card has been crafted. We’ve added your first complimentary welcome stamp and 100 points to start your journey.
        </p>

        <!-- Preview Card -->
        <div style="margin-bottom: 2rem;">
          ${window.renderLoyaltyCard({ interactive: false })}
        </div>

        <button id="welcome-enter-dashboard-btn" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
          <span>Enter My Tasting Room</span>
          <div class="btn-icon-wrapper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </button>
      </div>
    </div>
  `;

  document.getElementById('welcome-enter-dashboard-btn')?.addEventListener('click', () => {
    closeAllModals();
    window.location.hash = '#dashboard';
  });
}

// 3. Activity Receipt Breakdown Modal
function openReceiptModal(activity) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const currentRate = store ? store.getRupeesPerPoint() : 10;
  const amount = activity.amountSpent !== undefined ? activity.amountSpent : 180;
  const rate = activity.conversionRate || currentRate;
  const points = activity.pointsEarned !== undefined ? activity.pointsEarned : Math.floor(amount / rate);
  const newBal = activity.newBalance !== undefined ? activity.newBalance : (store ? store.getState().membership.points : 438);
  const prevBal = activity.previousBalance !== undefined ? activity.previousBalance : Math.max(0, newBal - points);

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="receipt-modal-backdrop">
      <div class="modal-card" style="max-width: 420px; padding: 1.8rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
          <div>
            <span style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 600; text-transform: uppercase;">Atelier Till Receipt</span>
            <div style="font-size: 0.75rem; color: var(--color-roast-muted);">${activity.location || 'Bandra West Flagship, Mumbai'} • ${activity.date || 'Today'}</div>
          </div>
          <button class="btn-text" id="close-receipt-btn" style="font-size: 1.2rem;">✕</button>
        </div>

        <!-- Receipt Code & Status -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; font-family: var(--font-mono); font-size: 0.76rem; color: var(--color-roast-medium);">
          <span>Receipt #${activity.receiptNumber || 'RCP-88421'}</span>
          <span style="color: var(--color-forest-roast); font-weight: 600;">✓ Settled & Credited</span>
        </div>

        <div style="padding: 1.1rem; background: var(--bg-canvas-subtle); border-radius: 14px; margin-bottom: 1.2rem; border: 1px solid var(--color-cream-border);">
          <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1.05rem; margin-bottom: 0.3rem;">
            <span>${activity.productName || activity.subtitle}</span>
            <span style="font-family: var(--font-mono);">₹${amount}</span>
          </div>
          <div style="font-size: 0.76rem; color: var(--color-roast-medium); line-height: 1.4;">
            ${activity.baristaNotes || 'Barista Till #02 • Specialty Batch Preparation'}
          </div>
        </div>

        <!-- Loyalty & Points Breakdown Table -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; border-top: 1px dashed var(--color-cream-border); padding-top: 0.8rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-roast-medium);">Amount Spent</span>
            <span style="font-family: var(--font-mono); font-weight: 600;">₹${amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-roast-medium);">Conversion Rule Applied</span>
            <span style="font-family: var(--font-mono); color: var(--color-roast-medium);">₹${rate} spent = 1 pt</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--color-cream-border-subtle); padding-top: 0.4rem;">
            <span style="font-weight: 600;">Points Earned</span>
            <span style="color: var(--color-terracotta); font-weight: 700; font-family: var(--font-mono);">+${points} Points</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-roast-muted); font-size: 0.8rem;">Previous Balance</span>
            <span style="font-family: var(--font-mono); font-size: 0.8rem;">${prevBal} pts</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: rgba(200, 157, 75, 0.12); padding: 0.45rem 0.65rem; border-radius: 8px; border: 1px solid rgba(200, 157, 75, 0.25);">
            <span style="font-weight: 600; color: var(--color-espresso);">New Balance</span>
            <span style="font-family: var(--font-mono); font-weight: 700; color: #8A641A;">${newBal} Points</span>
          </div>
        </div>

        <button id="close-receipt-btn-2" class="btn-secondary" style="width: 100%; justify-content: center; margin-top: 0.5rem;">
          Close Details
        </button>
      </div>
    </div>
  `;

  document.getElementById('close-receipt-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('close-receipt-btn-2')?.addEventListener('click', closeAllModals);
  document.getElementById('receipt-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'receipt-modal-backdrop') closeAllModals();
  });
}

// 3b. Add Product Modal (Café Owner Tool)
function openAddProductModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const rate = store ? store.getRupeesPerPoint() : 10;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="add-product-modal-backdrop">
      <div class="modal-card" style="max-width: 440px; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
          <div>
            <h3 style="font-size: 1.4rem; font-family: var(--font-serif);">Add New Café Product</h3>
            <p style="font-size: 0.82rem; color: var(--color-roast-medium); margin-top: 2px;">
              Points will be calculated automatically based on the current conversion rate (₹${rate} = 1 pt).
            </p>
          </div>
          <button class="btn-text" id="close-add-prod-btn" style="font-size: 1.2rem;">✕</button>
        </div>

        <form id="new-product-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--color-roast-muted); display: block; margin-bottom: 0.3rem;">Product Name</label>
            <input type="text" id="new-prod-name" required placeholder="e.g. Vanilla Bean Flat White" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.9rem;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
            <div>
              <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--color-roast-muted); display: block; margin-bottom: 0.3rem;">Price (₹)</label>
              <input type="number" id="new-prod-price" required min="10" step="5" placeholder="180" value="220" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-family: var(--font-mono); font-size: 0.95rem; font-weight: 600;">
            </div>

            <div>
              <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--color-roast-muted); display: block; margin-bottom: 0.3rem;">Category</label>
              <select id="new-prod-category" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.85rem; background: white;">
                <option value="Coffee">Coffee</option>
                <option value="Specialty Kaapi">Specialty Kaapi</option>
                <option value="Brew Bar">Brew Bar</option>
                <option value="Bakery">Bakery</option>
                <option value="Provisions">Provisions</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--color-roast-muted); display: block; margin-bottom: 0.3rem;">Description</label>
            <input type="text" id="new-prod-desc" placeholder="Notes & provenance..." style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.85rem;">
          </div>

          <!-- Dynamic Points Preview -->
          <div style="background: var(--bg-canvas-subtle); padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.82rem; display: flex; justify-content: space-between; align-items: center;">
            <span>Calculated Points Value:</span>
            <span id="new-prod-points-preview" style="font-family: var(--font-mono); font-weight: 700; color: var(--color-terracotta);">+22 Points</span>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem; margin-top: 0.4rem;">
            <span>Add Product to Menu ✓</span>
          </button>
        </form>
      </div>
    </div>
  `;

  const priceInput = document.getElementById('new-prod-price');
  const previewEl = document.getElementById('new-prod-points-preview');
  if (priceInput && previewEl) {
    priceInput.addEventListener('input', () => {
      const val = Number(priceInput.value) || 0;
      const pts = store ? store.calculatePoints(val) : Math.floor(val / 10);
      previewEl.textContent = `+${pts} Points`;
    });
  }

  document.getElementById('close-add-prod-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('add-product-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'add-product-modal-backdrop') closeAllModals();
  });

  document.getElementById('new-product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-prod-name')?.value;
    const price = document.getElementById('new-prod-price')?.value;
    const category = document.getElementById('new-prod-category')?.value;
    const desc = document.getElementById('new-prod-desc')?.value;

    if (name && price) {
      store.addProduct({ name, price, category, description: desc });
      closeAllModals();
      window.showToast(`✓ Added "${name}" (₹${price}) with ${store.calculatePoints(price)} points!`);
      window.router.render();
    }
  });
}

// 4. Forgot Password Modal
function openForgotPasswordModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="forgot-password-backdrop">
      <div class="modal-card" style="max-width: 420px; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
          <div>
            <h3 style="font-size: 1.4rem; font-family: var(--font-serif);">Reset Your Key</h3>
            <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-top: 3px;">
              Enter your email to receive a password reset link.
            </p>
          </div>
          <button class="btn-text" id="close-forgot-btn" style="font-size: 1.2rem;">✕</button>
        </div>

        <form id="forgot-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">Email Address</label>
            <input type="email" id="forgot-email" required placeholder="arjun@atelier-coffee.com" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.9rem;" value="arjun@atelier-coffee.com">
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem;">
            <span>Send Instructions</span>
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('close-forgot-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('forgot-password-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'forgot-password-backdrop') closeAllModals();
  });

  document.getElementById('forgot-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email')?.value;
    closeAllModals();
    window.showToast(`Password reset link sent to ${email} (Demo simulated)`);
  });
}

// 5. Redemption Confirmation Modal (Editorial In-App Dialog)
function openRedeemConfirmModal(reward) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="confirm-redeem-backdrop">
      <div class="modal-card" style="max-width: 440px; padding: 2.2rem 2rem; text-align: center;">
        <div class="eyebrow eyebrow-accent" style="margin-bottom: 0.8rem;">Privilege Redemption</div>
        <div class="reward-icon-box" style="margin: 0 auto 1.2rem; width: 4rem; height: 4rem; font-size: 1.8rem;">${reward.icon}</div>

        <h3 style="font-size: 1.8rem; margin-bottom: 0.6rem;">Redeem your ${reward.title}?</h3>
        <p style="color: var(--color-roast-medium); font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.8rem;">
          ${reward.description}
        </p>

        <div style="background: var(--bg-canvas-subtle); padding: 0.9rem; border-radius: 14px; font-size: 0.8rem; color: var(--color-roast-deep); margin-bottom: 1.8rem; border: 1px solid var(--color-cream-border);">
          ✦ This will generate an active 15-minute digital pass with QR code to present to your barista at the register.
        </div>

        <div style="display: flex; gap: 0.8rem;">
          <button id="cancel-confirm-redeem-btn" class="btn-secondary" style="flex: 1; justify-content: center; padding: 0.75rem;">
            Cancel
          </button>
          <button id="execute-confirm-redeem-btn" class="btn-primary btn-terracotta" style="flex: 1.2; justify-content: center; padding: 0.75rem;">
            <span>Confirm & Generate</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('cancel-confirm-redeem-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('confirm-redeem-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'confirm-redeem-backdrop') closeAllModals();
  });

  document.getElementById('execute-confirm-redeem-btn')?.addEventListener('click', () => {
    const pass = window.AtelierStore.redeemReward(reward.id);
    if (pass) {
      openRedemptionPassModal(pass);
    }
  });
}

// 6. Gen Z Caffeine Wrapped (9:16 Instagram Story Export Modal)
function openCaffeineWrappedModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const state = store.getState();
  const { user, membership } = state;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="wrapped-modal-backdrop">
      <div class="modal-card" style="max-width: 400px; padding: 1.2rem; background: transparent; box-shadow: none; border: none;">
        
        <!-- 9:16 Vertical Story Card -->
        <div class="wrapped-story-card" id="wrapped-story-card-element">
          <div class="grain-layer"></div>

          <!-- Top Brand Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 2;">
            <div>
              <span style="font-family: var(--font-serif); font-size: 1.2rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; display: block;">
                Atelier Café
              </span>
              <span style="font-size: 0.65rem; color: #D4B06A; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600;">
                Monthly Caffeine Wrapped • 2026
              </span>
            </div>
            <button class="btn-text" id="close-wrapped-btn" style="color: rgba(255,255,255,0.7); font-size: 1.4rem; padding: 0.2rem;">✕</button>
          </div>

          <!-- Center Content & Stats -->
          <div style="z-index: 2; margin: 1.2rem 0;">
            <div style="font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 0.3rem;">
              Ritual dossier for <strong>${user.firstName} ${user.lastName}</strong>
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 2.2rem; line-height: 1.1; margin-bottom: 1.2rem; color: #FFF;">
              A season of shade-grown rituals.
            </h2>

            <!-- Aura Box -->
            <div class="wrapped-aura-box">
              <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: #E8C17A; font-weight: 600;">
                ✦ Primary Coffee Aura
              </div>
              <div style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 600; color: #FFF; margin: 2px 0;">
                Bergamot & Wild Honey Cold Drip
              </div>
              <div style="font-size: 0.72rem; color: rgba(255,255,255,0.75);">
                Top 2% early-morning pour-over purist in Mumbai
              </div>
            </div>

            <!-- Stats 2x2 Grid -->
            <div class="wrapped-stat-grid">
              <div class="wrapped-stat-box">
                <div class="wrapped-stat-num">${membership.lifetimeVisits || 27}</div>
                <div class="wrapped-stat-label">Reserve Cups Brewed</div>
              </div>
              <div class="wrapped-stat-box">
                <div class="wrapped-stat-num">🔥 ${membership.currentStreak || 4}d</div>
                <div class="wrapped-stat-label">Daily Ritual Streak</div>
              </div>
              <div class="wrapped-stat-box">
                <div class="wrapped-stat-num">${membership.points}</div>
                <div class="wrapped-stat-label">Loyalty Points Balance</div>
              </div>
              <div class="wrapped-stat-box">
                <div class="wrapped-stat-num">🌱 14</div>
                <div class="wrapped-stat-label">Cups Saved (Zero-Waste)</div>
              </div>
            </div>
          </div>

          <!-- Footer Bar -->
          <div style="z-index: 2; border-top: 1px dashed rgba(200, 157, 75, 0.3); padding-top: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 600; color: #E8C17A;">
                ${user.membershipId}
              </div>
              <div style="font-size: 0.65rem; color: rgba(255,255,255,0.6);">
                ${user.tier} • Atelier Club
              </div>
            </div>
            <div style="font-size: 0.7rem; color: rgba(255,255,255,0.7); text-align: right;">
              Share to Story ⚡
            </div>
          </div>
        </div>

        <!-- Action Row -->
        <div style="display: flex; gap: 0.6rem; justify-content: center; margin-top: 1rem;">
          <button id="wrapped-download-btn" class="btn-primary" style="padding: 0.65rem 1.2rem; font-size: 0.82rem; background: var(--color-espresso);">
            <span>📸 Download Story Image (9:16)</span>
          </button>
          <button id="wrapped-copy-btn" class="btn-secondary" style="padding: 0.65rem 1rem; font-size: 0.82rem; background: rgba(255,255,255,0.9);">
            <span>Copy Stats Link</span>
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('close-wrapped-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('wrapped-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'wrapped-modal-backdrop') closeAllModals();
  });

  document.getElementById('wrapped-download-btn')?.addEventListener('click', () => {
    window.showToast('✨ 9:16 Story Graphic generated! Ready to post on Instagram / TikTok Stories.');
  });

  document.getElementById('wrapped-copy-btn')?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`My Atelier Café Wrapped: 🔥 ${membership.currentStreak || 4}d Streak • ${membership.points} Points • Aura: Bergamot & Honey V60`);
    }
    window.showToast('📋 Story stats copied to clipboard!');
  });
}

// 7. Café Owner Stamp Authorization PIN Keypad Modal
function openOwnerStampModal(options = {}) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const drinkName = options.drinkName || 'Specialty Coffee Order';
  let enteredPin = '';
  let isChecking = false;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="owner-stamp-backdrop">
      <div class="modal-card" style="max-width: 360px; padding: 2rem 1.6rem; text-align: center;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: -0.5rem;">
          <button class="btn-text" id="close-owner-stamp-btn" style="font-size: 1.3rem; color: var(--color-roast-muted);">✕</button>
        </div>

        <div style="width: 3.4rem; height: 3.4rem; border-radius: 50%; background: var(--bg-canvas-subtle); border: 1.5px solid var(--color-gold-foil); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.8rem; font-size: 1.4rem;">
          🔐
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.55rem; margin-bottom: 0.3rem;">
          Owner Stamp Authorization
        </h3>
        <p id="owner-pin-status-text" style="font-size: 0.82rem; color: var(--color-roast-medium); line-height: 1.4; margin-bottom: 0.5rem;">
          Please hand your device to the barista or café owner to enter the stamp code.
        </p>

        <!-- 4 PIN Dots -->
        <div class="pin-display-dots" id="pin-dots-container">
          <div class="pin-dot" id="pindot-0"></div>
          <div class="pin-dot" id="pindot-1"></div>
          <div class="pin-dot" id="pindot-2"></div>
          <div class="pin-dot" id="pindot-3"></div>
        </div>

        <!-- Tactile 3x4 Keypad -->
        <div class="pin-keypad" id="pin-keypad-box">
          <button class="pin-key-btn" data-key="1">1</button>
          <button class="pin-key-btn" data-key="2">2</button>
          <button class="pin-key-btn" data-key="3">3</button>
          <button class="pin-key-btn" data-key="4">4</button>
          <button class="pin-key-btn" data-key="5">5</button>
          <button class="pin-key-btn" data-key="6">6</button>
          <button class="pin-key-btn" data-key="7">7</button>
          <button class="pin-key-btn" data-key="8">8</button>
          <button class="pin-key-btn" data-key="9">9</button>
          <button class="pin-key-btn action-btn" data-key="clear">Clear</button>
          <button class="pin-key-btn" data-key="0">0</button>
          <button class="pin-key-btn action-btn" data-key="back">⌫</button>
        </div>

        <!-- Demo Hint -->
        <div style="margin-top: 1.2rem; font-size: 0.72rem; color: var(--color-roast-muted); border-top: 1px dashed var(--color-cream-border); padding-top: 0.8rem;">
          ✦ Café Owner Password / PIN: <strong style="color: var(--color-gold-foil); font-family: var(--font-mono); font-size: 0.85rem;">${store.getOwnerStampPin()}</strong>
        </div>

      </div>
    </div>
  `;

  function updateDots() {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`pindot-${i}`);
      if (dot) {
        if (i < enteredPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      }
    }
  }

  function handleDigit(d) {
    if (isChecking || enteredPin.length >= 4) return;
    enteredPin += d;
    updateDots();

    if (window.AtelierAudio && window.AtelierAudio.playTap) {
      window.AtelierAudio.playTap();
    }

    if (enteredPin.length === 4) {
      validatePin();
    }
  }

  function handleBackspace() {
    if (isChecking || enteredPin.length === 0) return;
    enteredPin = enteredPin.slice(0, -1);
    updateDots();
    if (window.AtelierAudio && window.AtelierAudio.playTap) {
      window.AtelierAudio.playTap();
    }
  }

  function handleClear() {
    if (isChecking) return;
    enteredPin = '';
    updateDots();
  }

  async function validatePin() {
    isChecking = true;
    const statusText = document.getElementById('owner-pin-status-text');
    const keypadBox = document.getElementById('pin-keypad-box');
    const dotsContainer = document.getElementById('pin-dots-container');

    const result = await store.verifyOwnerPin(enteredPin);
    const isValid = result === true || (result && result.success === true);

    if (isValid) {
      // Success state!
      for (let i = 0; i < 4; i++) {
        document.getElementById(`pindot-${i}`)?.classList.add('success');
      }
      if (statusText) {
        statusText.innerHTML = '<span style="color: var(--color-forest-roast); font-weight: 600;">✓ PIN Verified (Cryptographically Secured)! Stamping card...</span>';
      }

      // Ink stamp sound
      if (window.AtelierAudio && window.AtelierAudio.playStampSound) {
        window.AtelierAudio.playStampSound();
      }

      setTimeout(() => {
        closeAllModals();

        if (options.onSuccess) {
          options.onSuccess();
        } else {
          const res = store.addStamp(drinkName);
          window.showToast(`✓ Café Owner verified! Stamp #${res.newVisits}/10 collected for ${drinkName}.`);
        }

        window.router.render();
      }, 550);
    } else {
      // Error state!
      for (let i = 0; i < 4; i++) {
        document.getElementById(`pindot-${i}`)?.classList.add('error');
      }
      if (keypadBox) keypadBox.classList.add('shake-animation');
      if (dotsContainer) dotsContainer.classList.add('shake-animation');

      if (statusText) {
        if (result && result.locked) {
          statusText.innerHTML = `<span style="color: #D32F2F; font-weight: 700;">⛔ Security Lockout: 5 failed attempts.<br>Locked for ${result.remainingSeconds}s.</span>`;
        } else if (result && result.remainingAttempts !== undefined) {
          statusText.innerHTML = `<span style="color: #D32F2F; font-weight: 600;">✕ Incorrect Owner PIN (${result.remainingAttempts} attempts left before 5m lockout).</span>`;
        } else {
          statusText.innerHTML = '<span style="color: #D32F2F; font-weight: 600;">✕ Incorrect Owner PIN. Please try again.</span>';
        }
      }

      if (window.AtelierAudio && window.AtelierAudio.playTap) {
        window.AtelierAudio.playTap();
      }

      setTimeout(() => {
        enteredPin = '';
        updateDots();
        for (let i = 0; i < 4; i++) {
          document.getElementById(`pindot-${i}`)?.classList.remove('error');
        }
        if (keypadBox) keypadBox.classList.remove('shake-animation');
        if (dotsContainer) dotsContainer.classList.remove('shake-animation');
        if (statusText && (!result || !result.locked)) {
          statusText.innerHTML = 'Please hand your device to the barista or café owner to enter the stamp code.';
        }
        isChecking = false;
      }, 850);
    }
  }

  // Keypad click listeners
  container.querySelectorAll('.pin-key-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (key === 'clear') {
        handleClear();
      } else if (key === 'back') {
        handleBackspace();
      } else if (key) {
        handleDigit(key);
      }
    });
  });

  // Physical keyboard listener
  const keydownHandler = (e) => {
    if (e.key >= '0' && e.key <= '9') {
      handleDigit(e.key);
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape') {
      closeAllModals();
    }
  };
  window.addEventListener('keydown', keydownHandler);

  // Close handlers
  document.getElementById('close-owner-stamp-btn')?.addEventListener('click', () => {
    window.removeEventListener('keydown', keydownHandler);
    closeAllModals();
  });
  document.getElementById('owner-stamp-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'owner-stamp-backdrop') {
      window.removeEventListener('keydown', keydownHandler);
      closeAllModals();
    }
  });
}

function closeAllModals() {
  if (activeTimerInterval) {
    clearInterval(activeTimerInterval);
    activeTimerInterval = null;
  }
  const container = document.getElementById('modal-root');
  if (container) container.innerHTML = '';
}

window.openRedemptionPassModal = openRedemptionPassModal;
window.openRedeemConfirmModal = openRedeemConfirmModal;
window.openWelcomeCeremonyModal = openWelcomeCeremonyModal;
window.openReceiptModal = openReceiptModal;
window.openAddProductModal = openAddProductModal;
window.openCaffeineWrappedModal = openCaffeineWrappedModal;
window.openOwnerStampModal = openOwnerStampModal;
window.openForgotPasswordModal = openForgotPasswordModal;
window.closeAllModals = closeAllModals;
