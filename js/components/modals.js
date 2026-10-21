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

          <div style="font-family: var(--font-serif); font-size: 1.55rem; font-weight: 600; color: var(--color-espresso); margin: 0.6rem 0 0.2rem;">
            ${pass.rewardTitle}
          </div>
          <div style="font-size: 0.8rem; color: var(--color-roast-medium);">
            Member: <strong>${pass.customerName}</strong> (${pass.membershipId})
          </div>

          <!-- Redemption Code Display Card with Copy Button (No QR Code) -->
          <div class="ticket-code-card" style="margin: 1.2rem 0; padding: 1.3rem 1rem; background: var(--bg-canvas-subtle); border: 1.5px dashed var(--color-gold-foil); border-radius: 16px; text-align: center;">
            <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.35rem; font-weight: 700;">
              REDEMPTION PASS CODE
            </div>
            <div id="pass-code-display" class="ticket-code font-mono" style="font-size: 2.15rem; font-weight: 800; letter-spacing: 0.12em; color: var(--color-espresso); margin-bottom: 0.85rem; line-height: 1.1;">
              ${pass.code}
            </div>
            <button id="copy-pass-code-btn" class="btn-primary" style="margin: 0 auto; padding: 0.55rem 1.4rem; font-size: 0.85rem; font-weight: 600; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 4px 14px rgba(188, 90, 43, 0.3);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span id="copy-btn-label">Copy Code</span>
            </button>
            <div style="font-size: 0.74rem; color: var(--color-roast-muted); margin-top: 0.65rem;">
              Present this code at the café counter to claim your reward
            </div>
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

            <!-- Staff Counter Pass Verification -->
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

  // Copy Code Listener
  document.getElementById('copy-pass-code-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(pass.code).then(() => {
      const label = document.getElementById('copy-btn-label');
      if (label) label.textContent = 'Copied! ✓';
      if (window.showToast) window.showToast(`Code ${pass.code} copied to clipboard! 📋`);
      if (window.AtelierAudio?.playTap) window.AtelierAudio.playTap();
      setTimeout(() => {
        if (label) label.textContent = 'Copy Code';
      }, 2500);
    }).catch(() => {
      const label = document.getElementById('copy-btn-label');
      if (label) label.textContent = 'Copied! ✓';
      if (window.showToast) window.showToast(`Pass Code: ${pass.code}`);
    });
  });

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
          Welcome, ${user?.first_name || user?.firstName || 'Member'}.
        </h2>
        <p style="color: var(--color-roast-medium); font-size: 0.95rem; margin-bottom: 1.8rem; line-height: 1.5;">
          Your digital membership card is ready with 100 bonus points.
        </p>

        <!-- Preview Card -->
        <div style="margin-bottom: 2rem;">
          ${window.renderLoyaltyCard({ interactive: false })}
        </div>

        <button id="welcome-enter-dashboard-btn" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem;">
          <span>Go to Dashboard</span>
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
  const currentRate = store ? store.getRupeesPerPoint() : 1;
  const amount = activity.amountSpent !== undefined ? activity.amountSpent : 180;
  const rate = activity.conversionRate || currentRate;
  const points = activity.pointsEarned !== undefined ? activity.pointsEarned : Math.floor(amount / rate);
  const newBal = activity.newBalance !== undefined ? activity.newBalance : (store ? (store.getState().membership?.points || 0) : 0);
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
  const rate = store ? store.getRupeesPerPoint() : 1;

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
// 4. Forgot Password & Password Recovery Modal
function openForgotPasswordModal(prefilledEmail = '') {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const currentEmail = prefilledEmail || window.AtelierStore?.getState()?.user?.email || '';

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="forgot-password-backdrop">
      <div class="modal-card" style="max-width: 440px; padding: 2.2rem; border-radius: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
          <div>
            <h3 style="font-size: 1.4rem; font-family: var(--font-serif); color: var(--color-espresso);">Password Recovery</h3>
            <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-top: 4px;" id="forgot-modal-desc">
              Enter your registered email to receive a recovery code and reset link.
            </p>
          </div>
          <button class="btn-text" id="close-forgot-btn" style="font-size: 1.2rem; color: var(--color-roast-medium);">✕</button>
        </div>

        <div id="forgot-error-banner" style="display: none; background: rgba(184, 51, 42, 0.08); border: 1px solid rgba(184, 51, 42, 0.25); color: #B8332A; padding: 0.65rem 0.9rem; border-radius: 10px; font-size: 0.85rem; margin-bottom: 1rem;"></div>

        <!-- Step 1: Request Code -->
        <form id="forgot-step1-form" style="display: flex; flex-direction: column; gap: 1.1rem;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem; color: var(--color-espresso);">Email Address</label>
            <input type="email" id="forgot-email" required placeholder="name@example.com" class="auth-input" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.92rem; background: var(--bg-surface); color: var(--color-espresso); box-sizing: border-box;" value="${currentEmail}">
          </div>

          <button type="submit" id="forgot-send-btn" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; margin-top: 0.2rem;">
            <span class="btn-label">Send Recovery Code</span>
          </button>
        </form>

        <!-- Step 2: Enter Code & Change Password (Hidden initially) -->
        <form id="forgot-step2-form" style="display: none; flex-direction: column; gap: 1rem;">
          <div style="background: rgba(200, 157, 75, 0.08); border: 1px dashed #C89D4B; border-radius: 12px; padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--color-roast-deep);">
            ✉️ Recovery instructions sent to <strong id="step2-email-display"></strong>.
            <div id="dev-otp-helper" style="display: none; margin-top: 6px; font-size: 0.8rem; color: #C89D4B; cursor: pointer; text-decoration: underline;"></div>
          </div>

          <div>
            <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem; color: var(--color-espresso);">6-Digit Code / Reset Token</label>
            <input type="text" id="reset-code-input" required placeholder="e.g. 849201" maxlength="64" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: monospace; font-size: 1.1rem; letter-spacing: 0.15em; text-align: center; background: var(--bg-surface); color: var(--color-espresso); box-sizing: border-box;">
          </div>

          <div>
            <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem; color: var(--color-espresso);">New Password</label>
            <input type="password" id="reset-new-password" required minlength="6" placeholder="At least 6 characters" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.92rem; background: var(--bg-surface); color: var(--color-espresso); box-sizing: border-box;">
          </div>

          <div>
            <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem; color: var(--color-espresso);">Confirm New Password</label>
            <input type="password" id="reset-confirm-password" required minlength="6" placeholder="Repeat new password" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.92rem; background: var(--bg-surface); color: var(--color-espresso); box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 0.8rem; margin-top: 0.5rem;">
            <button type="button" id="back-to-step1-btn" class="btn-secondary" style="flex: 1; justify-content: center; padding: 0.75rem;">
              Back
            </button>
            <button type="submit" id="reset-save-btn" class="btn-primary" style="flex: 2; justify-content: center; padding: 0.75rem;">
              <span class="btn-label">Change Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('close-forgot-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('forgot-password-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'forgot-password-backdrop') closeAllModals();
  });

  const step1Form = document.getElementById('forgot-step1-form');
  const step2Form = document.getElementById('forgot-step2-form');
  const errorBanner = document.getElementById('forgot-error-banner');
  const sendBtn = document.getElementById('forgot-send-btn');
  const labelSpan = sendBtn?.querySelector('.btn-label');

  let activeEmail = currentEmail;

  step1Form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email')?.value?.trim() || '';
    if (!email) return;

    activeEmail = email;
    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }
    if (sendBtn) sendBtn.disabled = true;
    if (labelSpan) labelSpan.textContent = 'Sending email...';

    try {
      // 1. Instant check in Supabase if user exists
      if (window.AtelierSupabase) {
        try {
          const existing = await window.AtelierSupabase.select('users', {
            email: `eq.${email.toLowerCase()}`,
            select: 'id,email'
          });
          if (!existing || existing.length === 0) {
            throw new Error('No account found with this email address. Please check your spelling or sign up.');
          }
        } catch (checkErr) {
          if (checkErr.message && checkErr.message.includes('No account found')) {
            throw checkErr;
          }
        }
      }

      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Unable to send recovery email. Please verify that your email is registered or try again later.');
      }

      // Switch to Step 2
      step1Form.style.display = 'none';
      step2Form.style.display = 'flex';
      const emailDisplay = document.getElementById('step2-email-display');
      if (emailDisplay) emailDisplay.textContent = email;

      const desc = document.getElementById('forgot-modal-desc');
      if (desc) desc.textContent = 'Check your email for the 6-digit code to choose a new password.';

      // Dev helper if SMTP is running locally
      if (data.devOtp) {
        const helper = document.getElementById('dev-otp-helper');
        if (helper) {
          helper.style.display = 'block';
          helper.textContent = `💡 Dev Mode Code: ${data.devOtp} (Click to auto-fill)`;
          helper.onclick = () => {
            const input = document.getElementById('reset-code-input');
            if (input) input.value = data.devOtp;
          };
        }
      }

      window.showToast(`Recovery instructions sent to ${email} ✉️`);
    } catch (err) {
      if (errorBanner) {
        errorBanner.textContent = err.message || 'Could not send recovery email. Please check network.';
        errorBanner.style.display = 'block';
      }
      window.showToast(err.message || 'Error sending recovery email');
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      if (labelSpan) labelSpan.textContent = 'Send Recovery Code';
    }
  });

  document.getElementById('back-to-step1-btn')?.addEventListener('click', () => {
    step2Form.style.display = 'none';
    step1Form.style.display = 'flex';
    if (errorBanner) errorBanner.style.display = 'none';
  });

  step2Form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tokenOrOtp = document.getElementById('reset-code-input')?.value?.trim();
    const newPassword = document.getElementById('reset-new-password')?.value || '';
    const confirmPassword = document.getElementById('reset-confirm-password')?.value || '';
    const resetBtn = document.getElementById('reset-save-btn');
    const resetLabel = resetBtn?.querySelector('.btn-label');

    if (!tokenOrOtp || !newPassword) {
      if (errorBanner) {
        errorBanner.textContent = 'Please enter both your code and new password.';
        errorBanner.style.display = 'block';
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (errorBanner) {
        errorBanner.textContent = 'Passwords do not match. Please re-enter.';
        errorBanner.style.display = 'block';
      }
      return;
    }

    if (newPassword.length < 6) {
      if (errorBanner) {
        errorBanner.textContent = 'Password must be at least 6 characters.';
        errorBanner.style.display = 'block';
      }
      return;
    }

    if (errorBanner) errorBanner.style.display = 'none';
    if (resetBtn) resetBtn.disabled = true;
    if (resetLabel) resetLabel.textContent = 'Updating password...';

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: activeEmail,
          token: tokenOrOtp,
          newPassword
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password. Please check your code.');
      }

      closeAllModals();
      window.showToast('Password updated successfully! Please sign in with your new password. 🎉');

      // Pre-fill email on auth page and focus password
      if (window.location.hash !== '#auth') {
        window.location.hash = '#auth';
      }
      setTimeout(() => {
        const loginEmailInput = document.getElementById('login-email');
        if (loginEmailInput) loginEmailInput.value = activeEmail;
        const loginPassInput = document.getElementById('login-password');
        if (loginPassInput) loginPassInput.focus();
      }, 150);
    } catch (err) {
      if (errorBanner) {
        errorBanner.textContent = err.message || 'Failed to update password.';
        errorBanner.style.display = 'block';
      }
      window.showToast(err.message || 'Failed to update password');
    } finally {
      if (resetBtn) resetBtn.disabled = false;
      if (resetLabel) resetLabel.textContent = 'Change Password';
    }
  });
}

// Direct Reset Password Modal (invoked when visiting #reset-password?token=...&email=...)
function openResetPasswordModal({ email = '', token = '' } = {}) {
  openForgotPasswordModal(email);
  // Auto-advance to Step 2 if token is provided
  if (token) {
    setTimeout(() => {
      const step1 = document.getElementById('forgot-step1-form');
      const step2 = document.getElementById('forgot-step2-form');
      const codeInput = document.getElementById('reset-code-input');
      const emailDisplay = document.getElementById('step2-email-display');
      if (step1 && step2) {
        step1.style.display = 'none';
        step2.style.display = 'flex';
        if (emailDisplay) emailDisplay.textContent = email;
        if (codeInput) codeInput.value = token;
      }
    }, 50);
  }
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

// Helper: Functional HTML5 Canvas Export for Wrapped Story Image
function downloadWrappedCanvasImage(user, membership) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  const bg = ctx.createRadialGradient(800, 200, 100, 540, 720, 950);
  bg.addColorStop(0, '#2D1F1A');
  bg.addColorStop(0.5, '#16100E');
  bg.addColorStop(1, '#0C0807');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1440);

  // Micro-pattern texture dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let x = 0; x < 1080; x += 30) {
    for (let y = 0; y < 1440; y += 30) {
      if ((x + y) % 60 === 0) ctx.fillRect(x, y, 2, 2);
    }
  }

  // Double Gold Border
  ctx.strokeStyle = 'rgba(200, 157, 75, 0.45)';
  ctx.lineWidth = 4;
  ctx.strokeRect(45, 45, 990, 1350);
  ctx.strokeStyle = 'rgba(200, 157, 75, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(65, 65, 950, 1310);

  // Header Brand
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 48px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('ATELIER CAFÉ', 110, 150);

  ctx.fillStyle = '#D4B06A';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MONTHLY CAFFEINE WRAPPED • 2026', 110, 195);

  // Member dossier
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Ritual dossier for ${user.firstName || 'Member'} ${user.lastName || ''}`, 110, 280);

  // Headline
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 68px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('A season of', 110, 375);
  ctx.fillText('shade-grown rituals.', 110, 455);

  // Coffee Aura Box
  const auraY = 525;
  ctx.fillStyle = 'rgba(200, 157, 75, 0.14)';
  ctx.strokeStyle = 'rgba(200, 157, 75, 0.45)';
  ctx.lineWidth = 2;
  roundRect(ctx, 110, auraY, 860, 200, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E8C17A';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('✦ PRIMARY COFFEE AURA', 150, auraY + 52);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 44px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Bergamot & Wild Honey Cold Drip', 150, auraY + 112);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Top 2% early-morning pour-over purist in Mumbai', 150, auraY + 158);

  // 2x2 Stats Grid
  const stats = [
    { num: `${membership.lifetimeVisits || 27}`, label: 'Reserve Cups Brewed' },
    { num: `🔥 ${membership.currentStreak || 4}d`, label: 'Daily Ritual Streak' },
    { num: `${membership.points || 0}`, label: 'Loyalty Points Balance' },
    { num: '🌱 14', label: 'Cups Saved (Zero-Waste)' }
  ];

  const gridY = 765;
  const colW = 415;
  const rowH = 165;
  stats.forEach((st, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 110 + col * (colW + 30);
    const y = gridY + row * (rowH + 25);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, colW, rowH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#E8C17A';
    ctx.font = '700 46px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(st.num, x + colW / 2, y + 72);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(st.label, x + colW / 2, y + 120);
  });

  // Footer Divider & Details
  const footerY = 1200;
  ctx.strokeStyle = 'rgba(200, 157, 75, 0.3)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(110, footerY);
  ctx.lineTo(970, footerY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E8C17A';
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.fillText(user.membershipId || 'AT-MEMBER', 110, footerY + 55);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Atelier Specialty Club Member', 110, footerY + 95);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#D4B06A';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Atelier Roasters Mumbai', 970, footerY + 55);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('y-card.vercel.app', 970, footerY + 95);

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Atelier-Wrapped-${(user.firstName || 'Member').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.showToast('📸 Wrapped story image downloaded to your device!');
    if (window.AtelierAudio && typeof window.AtelierAudio.playCashRegister === 'function') {
      window.AtelierAudio.playCashRegister();
    }
  } catch (err) {
    console.error('Image export failed:', err);
    window.showToast('📸 Image generated! Tap and hold to save on mobile.');
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 5. Interactive Google Review Modal (Post-Stamping & Saga Progression)
function openGoogleReviewModal({ location = 'Bandra West Flagship, Mumbai', drinkName = 'Café Order' } = {}) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  let currentRating = 5;

  // Resolve specific Google Review search query or direct review link for that café
  function resolveGoogleReviewUrl(loc) {
    const custom = store?.getState()?.settings?.googleReviewUrl;
    if (custom && typeof custom === 'string' && custom.startsWith('http')) return custom;

    const lower = (loc || '').toLowerCase();
    if (lower.includes('bengaluru') || lower.includes('indiranagar')) {
      return 'https://www.google.com/search?q=Atelier+Coffee+Indiranagar+Bengaluru+reviews';
    } else if (lower.includes('delhi') || lower.includes('khan market')) {
      return 'https://www.google.com/search?q=Atelier+Coffee+Khan+Market+New+Delhi+reviews';
    } else if (lower.includes('pune') || lower.includes('koregaon')) {
      return 'https://www.google.com/search?q=Atelier+Coffee+Koregaon+Park+Pune+reviews';
    }
    return 'https://www.google.com/search?q=Atelier+Coffee+Bandra+West+Mumbai+reviews';
  }

  const reviewUrl = resolveGoogleReviewUrl(location);
  const cleanLocationName = (location || 'Bandra West, Mumbai')
    .replace('Flagship,', '')
    .replace('Roastery,', '')
    .replace('Tasting Room,', '')
    .trim();

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="google-review-backdrop">
      <div class="modal-card google-review-modal-card">
        
        <!-- Top Bar: Brand Eyebrow & Sleek Close Button -->
        <div class="gr-modal-top-bar">
          <div class="gr-brand-eyebrow">
            <span>✦</span>
            <span>ATELIER SPECIALTY ROASTERS</span>
          </div>
          <button class="gr-close-btn" id="close-google-review-btn" aria-label="Close review modal">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Hero Badge: Artisan Roastery Cup + Official Google Badge -->
        <div class="gr-hero-badge-wrap">
          <div class="gr-coffee-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div class="gr-google-badge" title="Google Verified Reviews">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.9H1.28v3.15C3.3 21.36 7.37 24 12 24z"/>
              <path fill="#FBBC05" d="M5.32 14.3c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3V6.55H1.28C.46 8.18 0 10.03 0 12c0 1.97.46 3.82 1.28 5.45l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.55l4.04 3.15c.94-2.81 3.58-4.9 6.68-4.9z"/>
            </svg>
          </div>
        </div>

        <!-- Editorial Title -->
        <h3 class="gr-modal-title">How was your coffee today?</h3>

        <!-- Location Pill -->
        <div class="google-review-location-pill">
          <span class="gr-loc-dot"></span>
          <span>Atelier Café • ${cleanLocationName}</span>
        </div>

        <!-- 5-Star Row with vector star icons -->
        <div class="review-star-row" id="google-review-stars">
          <button type="button" class="review-star-btn is-active" data-val="1" aria-label="1 star">
            <svg class="gr-star-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
          <button type="button" class="review-star-btn is-active" data-val="2" aria-label="2 stars">
            <svg class="gr-star-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
          <button type="button" class="review-star-btn is-active" data-val="3" aria-label="3 stars">
            <svg class="gr-star-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
          <button type="button" class="review-star-btn is-active" data-val="4" aria-label="4 stars">
            <svg class="gr-star-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
          <button type="button" class="review-star-btn is-active" data-val="5" aria-label="5 stars">
            <svg class="gr-star-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </button>
        </div>
        <div id="google-review-label" class="gr-rating-label">
          5 Stars • Exceptional Roast & Service!
        </div>

        <!-- Quick Compliments Tag Chips -->
        <div class="gr-tag-chips-row">
          <button type="button" class="gr-tag-chip is-selected" data-tag="Perfect Pour Over">☕ Perfect Pour Over</button>
          <button type="button" class="gr-tag-chip is-selected" data-tag="Lovely Vibe">✨ Lovely Vibe</button>
          <button type="button" class="gr-tag-chip" data-tag="Warm Hospitality">🤍 Warm Hospitality</button>
          <button type="button" class="gr-tag-chip" data-tag="Fresh Pastry">🥐 Fresh Pastry</button>
        </div>

        <!-- Loyalty Points Incentive Ribbon (Replaces old dashed box) -->
        <div class="google-review-bonus-callout">
          <div class="gr-reward-token font-mono">
            <span>+25</span>
            <span class="gr-pts-label">PTS</span>
          </div>
          <div class="gr-reward-copy">
            <div class="gr-reward-title">Google Review Reward</div>
            <div class="gr-reward-subtitle">25 bonus loyalty points unlocked upon review</div>
          </div>
        </div>

        <!-- Primary CTA: Bespoke Google Verified Action Button -->
        <button type="button" id="open-google-review-link-btn" class="google-review-btn">
          <div class="gr-google-btn-badge">
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.9H1.28v3.15C3.3 21.36 7.37 24 12 24z"/>
              <path fill="#FBBC05" d="M5.32 14.3c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3V6.55H1.28C.46 8.18 0 10.03 0 12c0 1.97.46 3.82 1.28 5.45l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.55l4.04 3.15c.94-2.81 3.58-4.9 6.68-4.9z"/>
            </svg>
          </div>
          <span>Write a Google Review</span>
          <span class="gr-btn-arrow">↗</span>
        </button>

        <!-- Secondary Dismiss -->
        <div>
          <button type="button" id="google-review-skip-btn" class="gr-skip-btn">
            Maybe next time
          </button>
        </div>

      </div>
    </div>
  `;

  // Prevent background scroll
  document.body.style.overflow = 'hidden';

  // Interactive Stars
  const starBtns = container.querySelectorAll('.review-star-btn');
  const labelEl = container.querySelector('#google-review-label');
  const starLabels = [
    '',
    '1 Star • Needs improvement',
    '2 Stars • Fair cup',
    '3 Stars • Good coffee',
    '4 Stars • Great brew & hospitality',
    '5 Stars • Exceptional Roast & Service!'
  ];

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      currentRating = val;
      starBtns.forEach((b, idx) => {
        if (idx < val) {
          b.classList.add('is-active');
        } else {
          b.classList.remove('is-active');
        }
      });
      if (labelEl) labelEl.textContent = starLabels[val] || `${val} Stars`;
      if (window.AtelierAudio && typeof window.AtelierAudio.playStarSlam === 'function') {
        window.AtelierAudio.playStarSlam(Math.min(3, Math.max(1, Math.floor(val / 2))));
      }
    });
  });

  // Interactive Quick Compliment Chips
  container.querySelectorAll('.gr-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-selected');
      if (window.AtelierAudio && typeof window.AtelierAudio.playTap === 'function') {
        window.AtelierAudio.playTap();
      }
    });
  });

  const handleDismiss = () => {
    closeAllModals();
    if (window.router) window.router.render();
  };

  container.querySelector('#close-google-review-btn')?.addEventListener('click', handleDismiss);
  container.querySelector('#google-review-skip-btn')?.addEventListener('click', handleDismiss);
  container.querySelector('#google-review-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'google-review-backdrop') handleDismiss();
  });

  // Action on Clicking Google Review Button:
  container.querySelector('#open-google-review-link-btn')?.addEventListener('click', () => {
    // Open Google Review in new tab
    window.open(reviewUrl, '_blank', 'noopener,noreferrer');

    // Award bonus loyalty points
    if (store && typeof store.awardPoints === 'function') {
      store.awardPoints(25);
    }

    // Audio & Confetti
    if (window.AtelierAudio && typeof window.AtelierAudio.playCandyFanfare === 'function') {
      window.AtelierAudio.playCandyFanfare();
    }
    if (window.fireAtelierConfetti) {
      window.fireAtelierConfetti();
    }

    closeAllModals();
    if (window.router) window.router.render();
    if (typeof window.showToast === 'function') {
      window.showToast('⭐ Thank you for reviewing us on Google! +25 Points added.');
    }
  });
}

function openReviewModal(options = {}) {
  openGoogleReviewModal(options);
}

// 6. Caffeine Wrapped Story Export Modal
function openCaffeineWrappedModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const state = (store && typeof store.getState === 'function') ? store.getState() : {};
  const user = state.user || { firstName: 'Valued', lastName: 'Member', tier: 'Gold Member', membershipId: 'AT-CLUB' };
  const membership = state.membership || { lifetimeVisits: 27, points: 420, currentStreak: 4, rewardsRedeemedCount: 3 };

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="wrapped-modal-backdrop">
      <div class="modal-card" style="max-width: 390px; padding: 0.5rem; background: transparent; box-shadow: none; border: none;">
        
        <!-- Vertical Story Card -->
        <div class="wrapped-story-card" id="wrapped-story-card-element">
          <div class="grain-layer"></div>

          <!-- Top Brand Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; z-index: 2;">
            <div>
              <span style="font-family: var(--font-serif); font-size: 1.2rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; display: block;">
                Atelier Café
              </span>
              <span style="font-size: 0.62rem; color: #D4B06A; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;">
                Monthly Caffeine Wrapped • 2026
              </span>
            </div>
            <button class="btn-text" id="close-wrapped-btn" style="color: rgba(255,255,255,0.7); font-size: 1.35rem; padding: 0.2rem; line-height: 1;">✕</button>
          </div>

          <!-- Center Content & Stats -->
          <div style="z-index: 2; margin: 0.9rem 0;">
            <div style="font-size: 0.82rem; color: rgba(255,255,255,0.8); margin-bottom: 0.25rem;">
              Ritual dossier for <strong>${user.firstName} ${user.lastName}</strong>
            </div>
            <h2 style="font-family: var(--font-serif); font-size: clamp(1.4rem, 4.8vw, 1.95rem); line-height: 1.15; margin-bottom: 0.9rem; color: #FFF;">
              A season of shade-grown rituals.
            </h2>

            <!-- Aura Box -->
            <div class="wrapped-aura-box">
              <div style="font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.12em; color: #E8C17A; font-weight: 600;">
                ✦ Primary Coffee Aura
              </div>
              <div style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 600; color: #FFF; margin: 2px 0;">
                Bergamot & Wild Honey Cold Drip
              </div>
              <div style="font-size: 0.7rem; color: rgba(255,255,255,0.75);">
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
          <div style="z-index: 2; border-top: 1px dashed rgba(200, 157, 75, 0.3); padding-top: 0.65rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; color: #E8C17A;">
                ${user.membershipId}
              </div>
              <div style="font-size: 0.62rem; color: rgba(255,255,255,0.6);">
                Atelier Club Member
              </div>
            </div>
            <div style="font-size: 0.68rem; color: rgba(255,255,255,0.7); text-align: right;">
              Share to Story ⚡
            </div>
          </div>
        </div>

        <!-- Action Grid: Download, Share Link & Review Experience -->
        <div class="wrapped-action-grid">
          <button id="wrapped-download-btn" class="btn-primary" style="padding: 0.7rem 0.85rem; font-size: 0.82rem; background: var(--color-espresso); border: 1px solid rgba(200, 157, 75, 0.4); justify-content: center; gap: 0.35rem;">
            <span>📸 Download Story Image</span>
          </button>
          <button id="wrapped-copy-btn" class="btn-secondary" style="padding: 0.7rem 0.85rem; font-size: 0.82rem; background: rgba(255,255,255,0.95); justify-content: center; gap: 0.35rem;">
            <span>🔗 Share Stats Link</span>
          </button>
          <button id="wrapped-review-btn" class="btn-primary btn-terracotta" style="grid-column: 1 / -1; padding: 0.75rem 1rem; font-size: 0.84rem; justify-content: center; gap: 0.4rem;">
            <span>⭐ Review Tasting Experience (+25 Pts)</span>
          </button>
        </div>

      </div>
    </div>
  `;

  // Hide dock and prevent scroll
  document.body.style.overflow = 'hidden';
  const dock = document.getElementById('mobile-app-dock');
  if (dock) {
    dock.style.opacity = '0';
    dock.style.pointerEvents = 'none';
  }

  document.getElementById('close-wrapped-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('wrapped-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'wrapped-modal-backdrop') closeAllModals();
  });

  // Functional Image Download via HTML5 Canvas
  document.getElementById('wrapped-download-btn')?.addEventListener('click', () => {
    downloadWrappedCanvasImage(user, membership);
  });

  // Functional Stats & Link Sharing
  document.getElementById('wrapped-copy-btn')?.addEventListener('click', async () => {
    const shareUrl = window.location.href.split('#')[0] + '#dashboard';
    const shareText = `☕ Atelier Café Wrapped — ${user.firstName} ${user.lastName}\n🔥 Streak: ${membership.currentStreak || 4}d | Points: ${membership.points} pts\n✦ Aura: Bergamot & Wild Honey Cold Drip\n${shareUrl}`;

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `${user.firstName}'s Atelier Café Wrapped`,
          text: shareText,
          url: shareUrl
        });
        window.showToast('✨ Shared successfully!');
        return;
      } catch (err) {
        // Fallback to clipboard if share cancelled
      }
    }

    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        copied = true;
      } catch (e) {
        copied = false;
      }
    }

    if (!copied) {
      const ta = document.createElement('textarea');
      ta.value = shareText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        copied = true;
      } catch (e) { }
      document.body.removeChild(ta);
    }

    window.showToast('📋 Stats & pass link copied to clipboard!');
    if (window.AtelierAudio && typeof window.AtelierAudio.playTap === 'function') {
      window.AtelierAudio.playTap();
    }
  });

  // Review Experience Button Handler
  document.getElementById('wrapped-review-btn')?.addEventListener('click', () => {
    openReviewModal();
  });
}

// 7. Café Owner Stamp Authorization PIN Keypad Modal
function openOwnerStampModal(options = {}) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const drinkName = options.drinkName || 'Specialty Coffee Order';
  const initialBillAmount = options.amountSpent !== undefined && options.amountSpent !== null
    ? Number(options.amountSpent)
    : 200;
  const rate = store.getRupeesPerPoint();
  let billAmount = initialBillAmount;
  let enteredPin = '';
  let isChecking = false;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="owner-stamp-backdrop">
      <div class="modal-card" style="max-width: 385px; padding: 1.8rem 1.5rem; text-align: center;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: -0.5rem;">
          <button class="btn-text" id="close-owner-stamp-btn" style="font-size: 1.3rem; color: var(--color-roast-muted);">✕</button>
        </div>

        <div style="width: 3.2rem; height: 3.2rem; border-radius: 50%; background: var(--bg-canvas-subtle); border: 1.5px solid var(--color-gold-foil); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.6rem; font-size: 1.35rem;">
          🔐
        </div>

        <p id="owner-pin-status-text" style="font-size: 0.8rem; color: var(--color-roast-medium); line-height: 1.35; margin-bottom: 0.75rem;">
          Enter the customer's bill amount and 4-digit PIN to issue stamp & points.
        </p>

        <!-- Bill Amount Entry & Dynamic Points Conversion -->
        <div class="owner-bill-box">
          <label class="owner-bill-label">Customer Café Bill Amount</label>
          <div class="owner-bill-input-wrap">
            <span class="owner-bill-currency">₹</span>
            <input type="number" id="owner-bill-amount-input" class="owner-bill-input" value="${billAmount}" min="0" step="10" placeholder="200">
          </div>
          <div class="owner-bill-chips">
            <button type="button" class="owner-bill-chip-btn ${billAmount === 200 ? 'active' : ''}" data-amt="200">₹200</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 500 ? 'active' : ''}" data-amt="500">₹500</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 1000 ? 'active' : ''}" data-amt="1000">₹1,000</button>
          </div>
          
        </div>

        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-roast-muted); font-weight: 700; margin-bottom: 0.4rem;">
          Enter 4-Digit Owner PIN
        </div>

        <!-- 4 PIN Dots -->
        <div class="pin-display-dots" id="pin-dots-container" style="margin-bottom: 0.8rem;">
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

      </div>
    </div>
  `;

  // Hide dock and prevent background scroll
  document.body.style.overflow = 'hidden';
  const dock = document.getElementById('mobile-app-dock');
  if (dock) {
    dock.style.opacity = '0';
    dock.style.pointerEvents = 'none';
  }

  // Dynamic bill amount and points calculation listeners
  const billInput = document.getElementById('owner-bill-amount-input');
  const ptsBadge = document.getElementById('owner-converted-pts');
  const chipBtns = container.querySelectorAll('.owner-bill-chip-btn');

  function updatePointsPreview(amt) {
    billAmount = Math.max(0, Number(amt) || 0);
    const pts = store.calculatePoints(billAmount);
    if (ptsBadge) {
      ptsBadge.textContent = `+${pts} Loyalty Points`;
    }
    chipBtns.forEach(btn => {
      const btnAmt = Number(btn.getAttribute('data-amt'));
      btn.classList.toggle('active', btnAmt === billAmount);
    });
  }

  billInput?.addEventListener('input', (e) => {
    updatePointsPreview(e.target.value);
  });

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = Number(btn.getAttribute('data-amt'));
      if (billInput) {
        billInput.value = amt;
      }
      updatePointsPreview(amt);
      if (window.AtelierAudio && window.AtelierAudio.playTap) {
        window.AtelierAudio.playTap();
      }
    });
  });

  function updateDots() {
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`pindot-${i}`);
      if (dot) {
        dot.classList.toggle('filled', i < enteredPin.length);
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
    const currentBill = Math.max(0, parseFloat(document.getElementById('owner-bill-amount-input')?.value || billAmount) || 0);
    const convertedPoints = store.calculatePoints(currentBill);
    const statusText = document.getElementById('owner-pin-status-text');
    const keypadBox = document.getElementById('pin-keypad-box');
    const dotsContainer = document.getElementById('pin-dots-container');

    const result = await store.verifyOwnerPin(enteredPin, {
      amountSpent: currentBill,
      productName: drinkName
    });
    const isValid = result === true || (result && result.success === true);

    if (isValid) {
      // Success state!
      for (let i = 0; i < 4; i++) {
        document.getElementById(`pindot-${i}`)?.classList.add('success');
      }
      if (statusText) {
        statusText.innerHTML = `<span style="color: var(--color-forest-roast); font-weight: 600;">✓ Verified! Converting ₹${currentBill} bill into +${convertedPoints} points...</span>`;
      }

      // Ink stamp sound
      if (window.AtelierAudio && window.AtelierAudio.playStampSound) {
        window.AtelierAudio.playStampSound();
      }

      const oldPoints = store.getState().membership.points || 0;
      const currentStamps = store.getState().membership.currentStamps || 0;
      const targetSlotIndex = currentStamps < 10 ? currentStamps + 1 : 1;

      setTimeout(() => {
        closeAllModals();

        if (typeof dashboardViewMode !== 'undefined' && dashboardViewMode !== 'card') {
          dashboardViewMode = 'card';
          if (window.router) window.router.render();
        }

        if (window.playStampToolAnimation) {
          window.playStampToolAnimation({
            slotIndex: targetSlotIndex,
            drinkName: drinkName,
            onComplete: () => {
              const res = store.addStamp(drinkName, currentBill);
              const newPoints = store.getState().membership.points || 0;

              if (options.onSuccess) {
                options.onSuccess(res);
              } else {
                if (typeof window.showToast === 'function') {
                  window.showToast(`✓ Café Owner verified! ₹${currentBill} bill converted into +${res.pointsEarned} points. Stamp #${res.newVisits}/10 collected.`);
                }
                if (res.cardCompleted && window.launchAtelierCelebration) {
                  window.launchAtelierCelebration();
                  if (window.AtelierAudio && window.AtelierAudio.playRewardUnlock) {
                    window.AtelierAudio.playRewardUnlock();
                  }
                }
              }

              // Open Saga Level Road progress modal with animated character walk!
              setTimeout(() => {
                if (typeof openSagaLevelAdvanceModal === 'function') {
                  openSagaLevelAdvanceModal({
                    oldPoints,
                    newPoints,
                    pointsEarned: res.pointsEarned,
                    newVisits: res.newVisits,
                    drinkName
                  });
                } else if (typeof window.openSagaLevelAdvanceModal === 'function') {
                  window.openSagaLevelAdvanceModal({
                    oldPoints,
                    newPoints,
                    pointsEarned: res.pointsEarned,
                    newVisits: res.newVisits,
                    drinkName
                  });
                } else if (window.router) {
                  window.router.render();
                }
              }, 120);
            }
          });
        } else {
          const res = store.addStamp(drinkName, currentBill);
          const newPoints = store.getState().membership.points || 0;

          if (options.onSuccess) {
            options.onSuccess(res);
          } else {
            if (typeof window.showToast === 'function') {
              window.showToast(`✓ Café Owner verified! ₹${currentBill} bill converted into +${res.pointsEarned} points. Stamp #${res.newVisits}/10 collected.`);
            }
            if (res.cardCompleted && window.launchAtelierCelebration) {
              window.launchAtelierCelebration();
              if (window.AtelierAudio && window.AtelierAudio.playRewardUnlock) {
                window.AtelierAudio.playRewardUnlock();
              }
            }
          }

          setTimeout(() => {
            if (typeof openSagaLevelAdvanceModal === 'function') {
              openSagaLevelAdvanceModal({
                oldPoints,
                newPoints,
                pointsEarned: res.pointsEarned,
                newVisits: res.newVisits,
                drinkName
              });
            } else if (typeof window.openSagaLevelAdvanceModal === 'function') {
              window.openSagaLevelAdvanceModal({
                oldPoints,
                newPoints,
                pointsEarned: res.pointsEarned,
                newVisits: res.newVisits,
                drinkName
              });
            } else if (window.router) {
              window.router.render();
            }
          }, 120);
        }
      }, 450);
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
          statusText.innerHTML = 'Enter the customer\'s bill amount and 4-digit PIN to issue stamp & points.';
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
    if (e.target && e.target.id === 'owner-bill-amount-input') return;

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
  const handleClose = () => {
    window.removeEventListener('keydown', keydownHandler);
    closeAllModals();
  };
  document.getElementById('close-owner-stamp-btn')?.addEventListener('click', handleClose);
  document.getElementById('owner-stamp-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'owner-stamp-backdrop') handleClose();
  });
}

// 8. Saga Level Progress Popup & Animated Road Character March
function openSagaLevelAdvanceModal({ oldPoints = 0, newPoints = 0, pointsEarned = 0, newVisits = 1, drinkName = 'Café Order', location = 'Bandra West Flagship, Mumbai' } = {}) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;
  document.body.style.overflow = 'hidden';

  const store = window.AtelierStore;
  const rawUser = store ? store.getState().user || {} : {};
  const user = { firstName: rawUser.first_name || rawUser.firstName || 'Explorer', ...rawUser };
  const candy = window.candyEngine;
  const oldLvl = candy ? candy.calculateCurrentLevel({ points: oldPoints }) : 1;
  const newLvl = candy ? candy.calculateCurrentLevel({ points: newPoints }) : 1;
  const isLevelUp = newLvl > oldLvl;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="saga-advance-backdrop">
      <div class="modal-card saga-advance-modal-card" style="max-width: 440px; padding: 1.5rem 1.2rem; text-align: center; max-height: 90vh; overflow-y: auto; background: #18120F; color: #FAF4EA; border: 1.5px solid rgba(200, 157, 75, 0.45); box-shadow: 0 32px 80px rgba(0, 0, 0, 0.8), 0 0 30px rgba(200, 157, 75, 0.25);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✨</span>
            <span class="eyebrow" style="font-size: 0.72rem; letter-spacing: 0.12em; color: var(--color-gold-foil);">SAGA ROAD PROGRESSION</span>
          </div>
          <button class="btn-text" id="close-saga-advance-btn" style="font-size: 1.3rem; color: #C89D4B;">✕</button>
        </div>

        <div class="saga-advance-points-banner" style="margin-bottom: 0.6rem;">
          <div class="saga-advance-pts-glow" style="font-size: 1.7rem; font-weight: 800; color: #FFD43F; text-shadow: 0 0 20px rgba(255, 212, 63, 0.7); letter-spacing: -0.02em;">
            +${pointsEarned} Points Added!
          </div>
          <p style="font-size: 0.84rem; color: #D1C2B6; margin: 0.25rem 0 0.8rem;">
            ${drinkName} • Total Balance: <strong style="color: #FFD43F;">${newPoints} Pts</strong>
          </p>
          ${isLevelUp ? `
            <div class="saga-levelup-badge" style="background: linear-gradient(135deg, rgba(200, 157, 75, 0.3), rgba(255, 212, 63, 0.2)); border: 1px solid #FFD43F; border-radius: 999px; padding: 6px 14px; font-weight: 800; font-size: 0.85rem; color: #FFF; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(255, 212, 63, 0.3);">
              🏆 LEVEL UP! Level ${newLvl} Achieved!
            </div>
          ` : `
            <div class="saga-advancing-pill" style="background: rgba(255, 212, 63, 0.12); border: 1px solid rgba(255, 212, 63, 0.3); border-radius: 999px; padding: 4px 12px; font-weight: 700; font-size: 0.78rem; color: #FFE8A3; display: inline-flex; align-items: center; gap: 5px;">
              ⭐ ${user.firstName} is advancing on the road to Level ${Math.min(candy ? candy.levels.length : 100, newLvl + 1)}!
            </div>
          `}
        </div>

        <!-- Saga Road Winding Section -->
        <div class="saga-advance-map-viewport" id="saga-modal-map-viewport" style="border-radius: 18px; border: 1px solid rgba(200, 157, 75, 0.3); overflow: hidden; background: #120D0A; margin: 0.8rem 0; position: relative; max-height: 380px; overflow-y: auto;">
          ${candy ? candy.renderSagaMap({ compact: true, currentPoints: oldPoints, hideHeader: true, hideFooter: true }) : ''}
        </div>

        <button id="saga-modal-continue-btn" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem; margin-top: 0.6rem;">
          <span>Continue Journey ☕</span>
        </button>

      </div>
    </div>
  `;

  // Animate character moving smoothly through the levels with locked camera focus
  setTimeout(() => {
    const mapViewport = document.getElementById('saga-modal-map-viewport');
    if (!mapViewport || !candy) return;

    const charEl = mapViewport.querySelector('.candy-character-container');
    if (!charEl) return;

    // Use authoritative layout from candyEngine as single source of truth
    const layout = candy.getWaypoints ? candy.getWaypoints(true) : null;
    const waypoints = layout ? layout.waypoints : [];
    const svgWidth = layout ? layout.svgWidth : 400;

    const oldPos = candy.getCharacterRoadPosition(oldPoints, waypoints, svgWidth);
    const newPos = candy.getCharacterRoadPosition(newPoints, waypoints, svgWidth);

    // Precise camera tracking that always locks the character dead-center in the viewport
    function focusCameraOnPos(pos) {
      if (!mapViewport) return;
      const targetY = typeof pos === 'number' ? pos : (pos && typeof pos.y === 'number' ? pos.y : parseFloat(charEl.style.top));
      if (!isNaN(targetY)) {
        const vHeight = mapViewport.clientHeight || 380;
        const targetScroll = Math.max(0, targetY - (vHeight / 2) + 20);
        mapViewport.scrollTop = targetScroll;
      }
    }

    // 1. Initial lock-on: position character at starting level and center camera immediately
    charEl.style.setProperty('transition', 'none', 'important');
    charEl.style.willChange = 'left, top';
    charEl.style.left = `${oldPos.xPercent}%`;
    charEl.style.top = `${oldPos.y}px`;
    if (oldPos.isFacingRight !== undefined) {
      charEl.classList.toggle('facing-right', oldPos.isFacingRight);
      charEl.classList.toggle('facing-left', !oldPos.isFacingRight);
    }

    // Lock camera on starting position immediately across multiple frames as modal renders
    focusCameraOnPos(oldPos);
    requestAnimationFrame(() => focusCameraOnPos(oldPos));
    setTimeout(() => focusCameraOnPos(oldPos), 40);
    setTimeout(() => focusCameraOnPos(oldPos), 120);
    setTimeout(() => focusCameraOnPos(oldPos), 220);

    // 2. Animate character journey smoothly along the road curve through each level
    setTimeout(() => {
      focusCameraOnPos(oldPos);
      const completedPath = mapViewport.querySelector('.candy-svg-completed-fill');
      const glowPath = mapViewport.querySelector('.candy-svg-completed-glow');
      const charPtsEl = charEl.querySelector('.char-pts-bold');

      if (window.AtelierAudio && window.AtelierAudio.playCardFlip) {
        window.AtelierAudio.playCardFlip();
      }

      if (oldPoints === newPoints) {
        charEl.classList.add('is-tapped');
        focusCameraOnPos(oldPos);
        return;
      }

      const ptsDiff = Math.abs(newPoints - oldPoints);
      const animDuration = Math.min(3600, Math.max(2200, 2000 + ptsDiff * 2));
      let animStartTime = null;

      function stepFrame(now) {
        if (!animStartTime) animStartTime = now;
        const elapsed = now - animStartTime;
        const progress = Math.min(1, elapsed / animDuration);

        // Smooth easeInOutCubic progression
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentPts = oldPoints + (newPoints - oldPoints) * ease;
        const currentPos = candy.getCharacterRoadPosition(currentPts, waypoints, svgWidth);

        // Update character position directly on Bézier road curve
        charEl.style.left = `${currentPos.xPercent}%`;
        charEl.style.top = `${currentPos.y}px`;

        if (currentPos.isFacingRight !== undefined) {
          charEl.classList.toggle('facing-right', currentPos.isFacingRight);
          charEl.classList.toggle('facing-left', !currentPos.isFacingRight);
        }

        // Camera smoothly tracks character frame-by-frame, keeping them dead-center
        focusCameraOnPos(currentPos);

        // Light up completed golden road path in real time
        const currentPathD = candy.generateProgressPathSvg(waypoints, currentPos);
        if (completedPath && currentPathD) completedPath.setAttribute('d', currentPathD);
        if (glowPath && currentPathD) glowPath.setAttribute('d', currentPathD);

        // Live points count in speech bubble
        if (charPtsEl) {
          charPtsEl.textContent = `${Math.round(currentPts)} Pts`;
        }

        if (progress < 1) {
          requestAnimationFrame(stepFrame);
        } else {
          // Final destination settlement
          charEl.style.left = `${newPos.xPercent}%`;
          charEl.style.top = `${newPos.y}px`;
          if (newPos.isFacingRight !== undefined) {
            charEl.classList.toggle('facing-right', newPos.isFacingRight);
            charEl.classList.toggle('facing-left', !newPos.isFacingRight);
          }
          if (charPtsEl) charPtsEl.textContent = `${newPoints} Pts`;

          focusCameraOnPos(newPos);

          // Triumphant bounce & sound at destination
          charEl.classList.add('is-tapped');
          if (window.AtelierAudio) {
            if (isLevelUp && window.AtelierAudio.playCandyFanfare) {
              window.AtelierAudio.playCandyFanfare();
            } else if (isLevelUp && window.AtelierAudio.playRewardUnlock) {
              window.AtelierAudio.playRewardUnlock();
            } else if (window.AtelierAudio.playTap) {
              window.AtelierAudio.playTap();
            }
          }
          if (isLevelUp && window.launchAtelierCelebration) {
            window.launchAtelierCelebration();
          }
        }
      }

      requestAnimationFrame(stepFrame);
    }, 420);
  }, 50);

  // Close handlers: After completing the stamping and level pop up, ask for a review again using the Google review pop up
  const handleClose = () => {
    closeAllModals();
    if (window.router) window.router.render();
    setTimeout(() => {
      if (typeof openGoogleReviewModal === 'function') {
        openGoogleReviewModal({ location, drinkName });
      } else if (typeof window.openGoogleReviewModal === 'function') {
        window.openGoogleReviewModal({ location, drinkName });
      }
    }, 280);
  };
  document.getElementById('close-saga-advance-btn')?.addEventListener('click', handleClose);
  document.getElementById('saga-modal-continue-btn')?.addEventListener('click', handleClose);
  document.getElementById('saga-advance-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'saga-advance-backdrop') handleClose();
  });
}

// 11. Update Date of Birth Modal
function openEditDobModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const user = window.AtelierStore?.getState()?.user || {};
  const currentDob = user.dob || '';

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="edit-dob-backdrop">
      <div class="modal-card" style="max-width: 420px; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
          <div>
            <h3 style="font-size: 1.4rem; font-family: var(--font-serif);">Date of Birth (DOB)</h3>
            <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-top: 3px;">
              Set your actual birth date for annual reserve gifts & tasting perks 🎂
            </p>
          </div>
          <button class="btn-text" id="close-edit-dob-btn" style="font-size: 1.2rem;">✕</button>
        </div>

        <form id="edit-dob-form" style="display: flex; flex-direction: column; gap: 1.2rem;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem; color: var(--color-espresso);">
              Your Birth Date
            </label>
            <input type="date" id="edit-dob-input" required class="auth-input" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.95rem; background: var(--bg-surface); color: var(--color-espresso); box-sizing: border-box;" value="${currentDob}">
            <div style="font-size: 0.75rem; color: var(--color-roast-muted); margin-top: 0.4rem; line-height: 1.4;">
              ✦ Unlocks a complimentary Estate Reserve Pour-Over & bonus reward points during your birthday week.
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
            <button type="button" class="btn-secondary" id="cancel-edit-dob-btn" style="flex: 1; justify-content: center; padding: 0.75rem;">
              Cancel
            </button>
            <button type="submit" class="btn-primary" id="save-dob-btn" style="flex: 1; justify-content: center; padding: 0.75rem;">
              <span>Save Date</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Initialize Bespoke Atelier Theme Calendar
  const dobInput = document.getElementById('edit-dob-input');
  if (dobInput && window.attachAtelierDatePicker) {
    window.attachAtelierDatePicker(dobInput, {
      inline: true,
      defaultYear: 1998
    });
  }

  document.getElementById('close-edit-dob-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('cancel-edit-dob-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('edit-dob-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'edit-dob-backdrop') closeAllModals();
  });

  document.getElementById('edit-dob-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newDob = document.getElementById('edit-dob-input')?.value;
    if (!newDob) {
      window.showToast('Please select your date of birth 🎂');
      return;
    }

    if (window.AtelierStore?.updateUserProfile) {
      await window.AtelierStore.updateUserProfile({ dob: newDob });
    }

    closeAllModals();
    window.showToast('Date of birth updated successfully! 🎂');

    if (window.router?.currentRoute === 'profile') {
      window.router.render();
    }
  });
}

// 12. Update Contact Phone Modal
function openEditPhoneModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const user = window.AtelierStore?.getState()?.user || {};
  const currentPhone = user.phone || '';

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="edit-phone-backdrop">
      <div class="modal-card" style="max-width: 420px; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem;">
          <div>
            <h3 style="font-size: 1.4rem; font-family: var(--font-serif);">Contact Phone</h3>
            <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-top: 3px;">
              Used for membership lookups at café till and SMS receipts
            </p>
          </div>
          <button class="btn-text" id="close-edit-phone-btn" style="font-size: 1.2rem;">✕</button>
        </div>

        <form id="edit-phone-form" style="display: flex; flex-direction: column; gap: 1.2rem;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem; color: var(--color-espresso);">
              Phone Number
            </label>
            <input type="tel" id="edit-phone-input" required placeholder="+91 98765 43210" class="auth-input" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.95rem; background: var(--bg-surface); color: var(--color-espresso); box-sizing: border-box;" value="${currentPhone}">
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
            <button type="button" class="btn-secondary" id="cancel-edit-phone-btn" style="flex: 1; justify-content: center; padding: 0.75rem;">
              Cancel
            </button>
            <button type="submit" class="btn-primary" id="save-phone-btn" style="flex: 1; justify-content: center; padding: 0.75rem;">
              <span>Save Phone</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('close-edit-phone-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('cancel-edit-phone-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('edit-phone-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'edit-phone-backdrop') closeAllModals();
  });

  document.getElementById('edit-phone-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPhone = document.getElementById('edit-phone-input')?.value?.trim();
    if (!newPhone) return;

    if (window.AtelierStore?.updateUserProfile) {
      await window.AtelierStore.updateUserProfile({ phone: newPhone });
    }

    closeAllModals();
    window.showToast('Contact phone updated successfully! 📱');

    if (window.router?.currentRoute === 'profile') {
      window.router.render();
    }
  });
}

// Card Renewal Confirmation Modal
function openRenewCardModal() {
  closeAllModals();

  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const state = store ? store.getState() : {};
  const membership = state.membership || {};
  const currentStamps = Number(membership.currentStamps || 0);
  const maxStamps = Number(membership.maxStamps || 10);
  const cycles = Number(membership.cardCyclesCompleted || 0) + 1;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="renew-card-backdrop">
      <div class="modal-card" style="max-width: 440px; text-align: center; padding: 2rem 1.6rem;">
        
        <div style="width: 4rem; height: 4rem; margin: 0 auto 1.1rem; border-radius: 50%; background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(194,142,42,0.1) 100%); border: 1.5px solid rgba(212,175,55,0.4); display: flex; align-items: center; justify-content: center; font-size: 1.9rem;">
          🔄
        </div>

        <div style="font-size: 0.72rem; color: var(--color-gold-foil); font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.3rem;">
          CARD CYCLE #${cycles} COMPLETE
        </div>
        
        <h2 class="font-serif" style="font-size: 1.65rem; margin-bottom: 0.5rem; color: var(--color-espresso);">
          Renew Your Loyalty Card
        </h2>
        
        <p style="font-size: 0.88rem; color: var(--color-roast-medium); line-height: 1.5; margin-bottom: 1.3rem;">
          You've filled all <strong>${currentStamps}/${maxStamps} stamps</strong>! Renewing your card resets your active stamp slots back to 0 so you can collect fresh stamps on your upcoming visits.
        </p>

        <!-- Perks Preserved Box -->
        <div style="background: var(--bg-canvas-subtle); border: 1px solid var(--color-cream-border); border-radius: 14px; padding: 0.9rem 1.1rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.82rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; color: var(--color-forest-roast); font-weight: 600;">
            <span>✓</span>
            <span>All lifetime visits & Saga Road level progress kept</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; color: var(--color-forest-roast); font-weight: 600;">
            <span>✓</span>
            <span>Current points balance preserved</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--color-gold-foil); font-weight: 700;">
            <span>🎁</span>
            <span>+50 Bonus Points awarded instantly on renewal</span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <button id="cancel-renew-card-btn" class="btn-secondary" style="flex: 1; padding: 0.7rem 1rem;">
            <span>Not Now</span>
          </button>
          <button id="confirm-renew-card-btn" class="btn-primary" style="flex: 1.4; padding: 0.7rem 1.2rem; background: linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%); color: #1c1511; font-weight: 700; border: none; box-shadow: 0 4px 14px rgba(212,175,55,0.35);">
            <span>Renew Card Now 🔄</span>
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('cancel-renew-card-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('renew-card-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'renew-card-backdrop') closeAllModals();
  });

  document.getElementById('confirm-renew-card-btn')?.addEventListener('click', () => {
    closeAllModals();
    if (window.AtelierStore) {
      const res = window.AtelierStore.renewLoyaltyCard();
      if (res) {
        window.showToast?.(`Card Renewed! Fresh card ready +${res.bonusPoints} bonus points awarded! 🎉`);
      }
    }
    if (window.router) {
      window.router.render();
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
  document.body.style.overflow = '';
  const dock = document.getElementById('mobile-app-dock');
  if (dock) {
    dock.style.opacity = '1';
    dock.style.pointerEvents = 'auto';
  }
}

window.openRedemptionPassModal = openRedemptionPassModal;
window.openRedeemConfirmModal = openRedeemConfirmModal;
window.openWelcomeCeremonyModal = openWelcomeCeremonyModal;
window.openReceiptModal = openReceiptModal;
window.openAddProductModal = openAddProductModal;
window.openCaffeineWrappedModal = openCaffeineWrappedModal;
window.openReviewModal = openReviewModal;
window.openGoogleReviewModal = openGoogleReviewModal;
window.openCollectStampModal = openOwnerStampModal;
window.openOwnerStampModal = openOwnerStampModal;
window.openSagaLevelAdvanceModal = openSagaLevelAdvanceModal;
window.openForgotPasswordModal = openForgotPasswordModal;
window.openResetPasswordModal = openResetPasswordModal;
window.openEditDobModal = openEditDobModal;
window.openEditPhoneModal = openEditPhoneModal;
window.openRenewCardModal = openRenewCardModal;
window.closeAllModals = closeAllModals;
