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
    window.showToast(`Password reset link sent to ${email}. Please check your inbox.`);
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
  ctx.fillText(`${user.tier || 'Gold Member'} • Atelier Specialty Club`, 110, footerY + 95);

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

// Interactive Tasting & Experience Review Modal
function openReviewModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  let currentRating = 5;
  const store = window.AtelierStore;
  const state = store.getState();

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="review-modal-backdrop">
      <div class="modal-card" style="max-width: 410px; padding: 1.6rem 1.4rem; text-align: center;">
        
        <div style="display: flex; justify-content: flex-end; margin-bottom: -0.4rem;">
          <button class="btn-text" id="close-review-btn" style="font-size: 1.3rem; color: var(--color-roast-muted); padding: 0.2rem;">✕</button>
        </div>

        <div style="width: 3.2rem; height: 3.2rem; border-radius: 50%; background: var(--bg-canvas-subtle); border: 1.5px solid var(--color-gold-foil); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem; font-size: 1.35rem;">
          ☕
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.55rem; color: var(--color-espresso); margin-bottom: 0.25rem;">
          Review Tasting Ritual
        </h3>
        <p style="font-size: 0.8rem; color: var(--color-roast-medium); line-height: 1.35; margin-bottom: 0.8rem;">
          Share your tasting impressions with our Master Roasters and earn <strong>+25 Loyalty Points</strong>.
        </p>

        <!-- Star Rating Row -->
        <div class="review-star-row" id="review-stars-container">
          <button class="review-star-btn is-active" data-val="1">★</button>
          <button class="review-star-btn is-active" data-val="2">★</button>
          <button class="review-star-btn is-active" data-val="3">★</button>
          <button class="review-star-btn is-active" data-val="4">★</button>
          <button class="review-star-btn is-active" data-val="5">★</button>
        </div>
        <div id="review-rating-label" style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 600; color: var(--color-gold-foil); margin-bottom: 0.9rem;">
          5 / 5 • Exceptional Single-Origin Brew
        </div>

        <!-- Flavor & Ambience Tags -->
        <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-roast-muted); font-weight: 600; text-align: left; margin-bottom: 0.35rem;">
          Tasting Highlights:
        </div>
        <div class="review-tags-container">
          <button type="button" class="review-tag-chip selected" data-tag="Silky Microfoam">Silky Microfoam 🥛</button>
          <button type="button" class="review-tag-chip selected" data-tag="Floral Jasmine Notes">Floral Notes 🌸</button>
          <button type="button" class="review-tag-chip" data-tag="Perfect Extraction">Hand Extraction ⚖️</button>
          <button type="button" class="review-tag-chip" data-tag="Warm Hospitality">Warm Hospitality 🖤</button>
          <button type="button" class="review-tag-chip" data-tag="Attikan Estate Reserve">Attikan Reserve 🌿</button>
        </div>

        <!-- Feedback Textarea -->
        <div style="margin: 0.9rem 0;">
          <textarea id="review-comment-input" rows="3" placeholder="Notes on roast profile, extraction, or roastery ambience..." style="width: 100%; border: 1px solid var(--color-cream-border); border-radius: 12px; padding: 0.75rem; font-family: var(--font-sans); font-size: 0.82rem; background: var(--bg-surface); color: var(--color-espresso); resize: none;"></textarea>
        </div>

        <button id="submit-review-btn" class="btn-primary btn-terracotta" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.9rem;">
          <span>Submit Review (+25 Points)</span>
        </button>
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

  // Star Rating Interaction
  const ratingLabels = [
    '',
    '1 / 5 • Sub-optimal Extraction',
    '2 / 5 • Fair Cup',
    '3 / 5 • Enjoyable Roast',
    '4 / 5 • Excellent Craft',
    '5 / 5 • Exceptional Single-Origin Brew'
  ];
  const starBtns = document.querySelectorAll('.review-star-btn');
  const ratingLabelEl = document.getElementById('review-rating-label');

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
      if (ratingLabelEl) ratingLabelEl.textContent = ratingLabels[val] || `${val} / 5`;
      if (window.AtelierAudio && typeof window.AtelierAudio.playStarSlam === 'function') {
        window.AtelierAudio.playStarSlam(Math.min(3, Math.max(1, Math.floor(val / 2))));
      }
    });
  });

  // Tag Chips Toggle
  document.querySelectorAll('.review-tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      if (window.AtelierAudio && typeof window.AtelierAudio.playTap === 'function') {
        window.AtelierAudio.playTap();
      }
    });
  });

  // Close Handlers
  document.getElementById('close-review-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('review-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'review-modal-backdrop') closeAllModals();
  });

  // Submit Handler
  document.getElementById('submit-review-btn')?.addEventListener('click', () => {
    // Add 25 bonus points
    store.state.membership.points = (store.state.membership.points || 0) + 25;
    store.saveState();

    if (window.AtelierAudio && typeof window.AtelierAudio.playCandyFanfare === 'function') {
      window.AtelierAudio.playCandyFanfare();
    }
    if (window.fireAtelierConfetti) {
      window.fireAtelierConfetti();
    }

    closeAllModals();
    window.showToast('⭐ Thank you for your review! +25 Loyalty Points added to your pass.');
  });
}

// 6. Caffeine Wrapped Story Export Modal
function openCaffeineWrappedModal() {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const state = store.getState();
  const { user, membership } = state;

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
                ${user.tier} • Atelier Club
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
      } catch (e) {}
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
// 7. Collect Stamp & Earn Points Modal (NO Owner PIN required)
function openCollectStampModal(options = {}) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const drinkName = options.drinkName || 'Chikmagalur Single-Estate Pour Over';
  const initialBillAmount = options.amountSpent !== undefined && options.amountSpent !== null 
    ? Number(options.amountSpent) 
    : 250;
  const rate = store.getRupeesPerPoint();
  let billAmount = initialBillAmount;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="collect-stamp-backdrop">
      <div class="modal-card" style="max-width: 385px; padding: 1.8rem 1.5rem; text-align: center;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <span style="font-size: 1.2rem;">☕</span>
            <span class="eyebrow" style="font-size: 0.72rem; letter-spacing: 0.1em; color: var(--color-gold-foil);">VISIT STAMP</span>
          </div>
          <button class="btn-text" id="close-collect-stamp-btn" style="font-size: 1.3rem; color: var(--color-roast-muted);">✕</button>
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.3rem;">
          Collect Stamp & Earn Points
        </h3>
        <p style="font-size: 0.82rem; color: var(--color-roast-medium); line-height: 1.35; margin-bottom: 1rem;">
          Add your café order to claim your loyalty stamp and advance along the Saga Road!
        </p>

        <!-- Bill Amount Entry & Dynamic Points Conversion -->
        <div class="owner-bill-box" style="margin-bottom: 1.2rem;">
          <label class="owner-bill-label">Order / Café Bill Amount</label>
          <div class="owner-bill-input-wrap">
            <span class="owner-bill-currency">₹</span>
            <input type="number" id="collect-bill-amount-input" class="owner-bill-input" value="${billAmount}" min="0" step="10" placeholder="250">
          </div>
          <div class="owner-bill-chips">
            <button type="button" class="owner-bill-chip-btn ${billAmount === 180 ? 'active' : ''}" data-amt="180">₹180 (Cappuccino)</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 250 ? 'active' : ''}" data-amt="250">₹250 (Pour Over)</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 350 ? 'active' : ''}" data-amt="350">₹350 (Brew Bar)</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 500 ? 'active' : ''}" data-amt="500">₹500 (Reserve)</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 750 ? 'active' : ''}" data-amt="750">₹750</button>
            <button type="button" class="owner-bill-chip-btn ${billAmount === 1000 ? 'active' : ''}" data-amt="1000">₹1,000</button>
          </div>
          <div class="owner-bill-conversion-pill" id="collect-bill-conversion-badge" style="margin-top: 0.6rem;">
            <span>💎 Converts to <strong id="collect-converted-pts">+${store.calculatePoints(billAmount)} Loyalty Points</strong></span>
            <span style="font-size: 0.68rem; color: var(--color-roast-muted);">(₹${rate} = 1 pt)</span>
          </div>
        </div>

        <button id="confirm-collect-stamp-btn" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem; font-size: 0.95rem;">
          <span>Collect Stamp & Earn Points (+${store.calculatePoints(billAmount)} Pts) ✨</span>
        </button>

      </div>
    </div>
  `;

  // Dynamic bill amount and points calculation listeners
  const billInput = document.getElementById('collect-bill-amount-input');
  const ptsBadge = document.getElementById('collect-converted-pts');
  const submitBtn = document.getElementById('confirm-collect-stamp-btn');
  const chipBtns = container.querySelectorAll('.owner-bill-chip-btn');

  function updatePointsPreview(amt) {
    billAmount = Math.max(0, Number(amt) || 0);
    const pts = store.calculatePoints(billAmount);
    if (ptsBadge) ptsBadge.textContent = `+${pts} Loyalty Points`;
    if (submitBtn) {
      submitBtn.querySelector('span').textContent = `Collect Stamp & Earn Points (+${pts} Pts) ✨`;
    }
    chipBtns.forEach(btn => {
      const btnAmt = Number(btn.getAttribute('data-amt'));
      btn.classList.toggle('active', btnAmt === billAmount);
    });
  }

  billInput?.addEventListener('input', (e) => updatePointsPreview(e.target.value));

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = Number(btn.getAttribute('data-amt'));
      if (billInput) billInput.value = amt;
      updatePointsPreview(amt);
      if (window.AtelierAudio && window.AtelierAudio.playTap) {
        window.AtelierAudio.playTap();
      }
    });
  });

  submitBtn?.addEventListener('click', () => {
    const currentBill = Math.max(0, parseFloat(billInput?.value || billAmount) || 0);
    const oldPoints = store.getState().membership.points || 0;

    // Ink stamp sound
    if (window.AtelierAudio && window.AtelierAudio.playStampSound) {
      window.AtelierAudio.playStampSound();
    }

    const res = store.addStamp(drinkName, currentBill);
    const newPoints = store.getState().membership.points || 0;

    // Immediately pop up Saga Level road progression with animated character!
    openSagaLevelAdvanceModal({
      oldPoints,
      newPoints,
      pointsEarned: res.pointsEarned,
      newVisits: res.newVisits,
      drinkName
    });
  });

  document.getElementById('close-collect-stamp-btn')?.addEventListener('click', closeAllModals);
  document.getElementById('collect-stamp-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'collect-stamp-backdrop') closeAllModals();
  });
}

// 8. Saga Level Progress Popup & Animated Road Character March
function openSagaLevelAdvanceModal({ oldPoints = 0, newPoints = 0, pointsEarned = 0, newVisits = 1, drinkName = 'Café Order' } = {}) {
  closeAllModals();
  const container = document.getElementById('modal-root');
  if (!container) return;

  const store = window.AtelierStore;
  const user = store.getState().user || { firstName: 'Explorer' };
  const candy = window.candyEngine;
  const oldLvl = candy ? candy.calculateCurrentLevel({ points: oldPoints }) : 1;
  const newLvl = candy ? candy.calculateCurrentLevel({ points: newPoints }) : 1;
  const isLevelUp = newLvl > oldLvl;

  container.innerHTML = `
    <div class="modal-backdrop is-active" id="saga-advance-backdrop">
      <div class="modal-card saga-advance-modal-card" style="max-width: 440px; padding: 1.5rem 1.2rem; text-align: center; max-height: 90vh; overflow-y: auto;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✨</span>
            <span class="eyebrow" style="font-size: 0.72rem; letter-spacing: 0.12em; color: var(--color-gold-foil);">SAGA ROAD PROGRESSION</span>
          </div>
          <button class="btn-text" id="close-saga-advance-btn" style="font-size: 1.3rem; color: var(--color-roast-muted);">✕</button>
        </div>

        <div class="saga-advance-points-banner">
          <div class="saga-advance-pts-glow" style="font-size: 1.6rem; font-weight: 800; color: #FFD43F; text-shadow: 0 0 15px rgba(255, 212, 63, 0.6);">
            +${pointsEarned} Points Added!
          </div>
          <p style="font-size: 0.82rem; color: var(--color-roast-medium); margin: 0.2rem 0 0.8rem;">
            ${drinkName} • Total Balance: <strong>${newPoints} Pts</strong>
          </p>
          ${isLevelUp ? `
            <div class="saga-levelup-badge" style="background: linear-gradient(135deg, rgba(200, 157, 75, 0.3), rgba(255, 212, 63, 0.2)); border: 1px solid #FFD43F; border-radius: 999px; padding: 6px 14px; font-weight: 800; font-size: 0.85rem; color: #FFF; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(255, 212, 63, 0.3);">
              🏆 LEVEL UP! Level ${newLvl} Achieved!
            </div>
          ` : `
            <div class="saga-advancing-pill" style="background: rgba(255, 212, 63, 0.12); border: 1px solid rgba(255, 212, 63, 0.3); border-radius: 999px; padding: 4px 12px; font-weight: 700; font-size: 0.78rem; color: #FFE8A3; display: inline-flex; align-items: center; gap: 5px;">
              ⭐ ${user.firstName} is advancing on the road to Level ${Math.min(10, newLvl + 1)}!
            </div>
          `}
        </div>

        <!-- Saga Road Winding Section -->
        <div class="saga-advance-map-viewport" id="saga-modal-map-viewport" style="border-radius: 18px; border: 1px solid rgba(200, 157, 75, 0.3); overflow: hidden; background: #120D0A; margin: 0.8rem 0; position: relative; max-height: 380px; overflow-y: auto;">
          ${candy ? candy.renderSagaMap({ compact: true }) : ''}
        </div>

        <button id="saga-modal-continue-btn" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem; margin-top: 0.6rem;">
          <span>Continue Journey ☕</span>
        </button>

      </div>
    </div>
  `;

  // Animate character moving through the levels
  setTimeout(() => {
    const mapViewport = document.getElementById('saga-modal-map-viewport');
    if (!mapViewport || !candy) return;

    const charEl = mapViewport.querySelector('.candy-character-container');
    if (!charEl) return;

    // Calculate waypoints for compact map
    const totalLevels = candy.levels.length;
    const nodeSpacingY = 180; // compact
    const svgWidth = 400;
    const paddingTop = 90;
    const paddingBottom = 260;
    const svgHeight = paddingTop + (totalLevels - 1) * nodeSpacingY + paddingBottom;

    const nodeCoords = [];
    for (let i = 0; i < totalLevels; i++) {
      const lvl = candy.levels[i];
      const x = (lvl.xPercent / 100) * svgWidth;
      const y = svgHeight - paddingBottom - i * nodeSpacingY;
      nodeCoords.push({ x, y, level: lvl.level, xPercent: lvl.xPercent });
    }
    const startCoord = { x: (38 / 100) * svgWidth, y: svgHeight - 65, level: 0, xPercent: 38 };
    const waypoints = [startCoord, ...nodeCoords];

    const oldPos = candy.getCharacterRoadPosition(oldPoints, waypoints, svgWidth);
    const newPos = candy.getCharacterRoadPosition(newPoints, waypoints, svgWidth);

    // 1. Set starting position to oldPoints
    charEl.style.transition = 'none';
    charEl.style.left = `${oldPos.xPercent}%`;
    charEl.style.top = `${oldPos.y}px`;

    // Center viewport on character
    charEl.scrollIntoView({ behavior: 'auto', block: 'center' });

    // 2. Animate to newPoints
    setTimeout(() => {
      charEl.style.transition = 'left 1.8s cubic-bezier(0.34, 1.25, 0.64, 1), top 1.8s cubic-bezier(0.34, 1.25, 0.64, 1)';
      charEl.style.left = `${newPos.xPercent}%`;
      charEl.style.top = `${newPos.y}px`;

      // Update completed river path SVG
      const completedPath = mapViewport.querySelector('.candy-svg-completed-fill');
      const glowPath = mapViewport.querySelector('.candy-svg-completed-glow');
      const newPathD = candy.generateProgressPathSvg(waypoints, newPos);
      if (completedPath && newPathD) completedPath.setAttribute('d', newPathD);
      if (glowPath && newPathD) glowPath.setAttribute('d', newPathD);

      if (window.AtelierAudio && window.AtelierAudio.playCardFlip) {
        window.AtelierAudio.playCardFlip();
      }

      // Smooth scroll viewport along with character
      setTimeout(() => {
        charEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);

      // Character tap celebration bounce at destination
      setTimeout(() => {
        charEl.classList.add('is-tapped');
        if (window.AtelierAudio) {
          if (isLevelUp && window.AtelierAudio.playRewardUnlock) {
            window.AtelierAudio.playRewardUnlock();
          } else if (window.AtelierAudio.playTap) {
            window.AtelierAudio.playTap();
          }
        }
        if (isLevelUp && window.launchAtelierCelebration) {
          window.launchAtelierCelebration();
        }
      }, 1800);
    }, 200);
  }, 100);

  // Close handlers
  const handleClose = () => {
    closeAllModals();
    if (window.router) window.router.render();
  };
  document.getElementById('close-saga-advance-btn')?.addEventListener('click', handleClose);
  document.getElementById('saga-modal-continue-btn')?.addEventListener('click', handleClose);
  document.getElementById('saga-advance-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'saga-advance-backdrop') handleClose();
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
window.openCollectStampModal = openCollectStampModal;
window.openOwnerStampModal = openCollectStampModal;
window.openSagaLevelAdvanceModal = openSagaLevelAdvanceModal;
window.openForgotPasswordModal = openForgotPasswordModal;
window.closeAllModals = closeAllModals;
