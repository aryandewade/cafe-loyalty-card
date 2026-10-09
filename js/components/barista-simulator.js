/* ==========================================================================
   ATELIER BARISTA SIMULATOR & INTERACTIVE TEST ENGINE
   Floating simulation dock allowing immediate testing of real-time state changes
   ========================================================================== */

function renderBaristaSimulator() {
  const store = window.AtelierStore;
  const state = store.getState();
  if (!state.isAuthenticated) return '';

  return `
    <div class="barista-simulator-bar" id="barista-simulator" role="region" aria-label="Interactive Barista Simulator">
      <div class="simulator-label">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <span>Barista Simulator:</span>
      </div>

      <div class="simulator-actions">
        <!-- Buy Cappuccino ₹180 (Prompt Example) -->
        <button id="sim-cappuccino-btn" class="sim-btn sim-btn-accent" title="Test flow: Customer buys Cappuccino ₹180 → +${store.calculatePoints(180)} points">
          <span>☕ Cappuccino ₹180 (+${store.calculatePoints(180)} pts)</span>
        </button>

        <!-- Add 1 Stamp -->
        <button id="sim-add-stamp-btn" class="sim-btn" title="Simulate barista scanning QR and stamping card">
          <span>+1 Stamp</span>
        </button>

        <!-- Undo Stamp -->
        <button id="sim-sub-stamp-btn" class="sim-btn" title="Undo 1 stamp">
          <span>-1 Undo</span>
        </button>

        <!-- Fast Forward to 10/10 Reward Unlock -->
        <button id="sim-complete-card-btn" class="sim-btn" title="Fast forward visits to unlock highest reward">
          <span>Unlock 10/10</span>
        </button>

        <!-- Reset Demo Defaults -->
        <button id="sim-reset-btn" class="sim-btn" title="Reset back to initial demo state (420 pts • 7/10 visits)">
          <span>Reset</span>
        </button>
      </div>
    </div>
  `;
}

function initBaristaSimulatorEvents() {
  const cappBtn = document.getElementById('sim-cappuccino-btn');
  const addBtn = document.getElementById('sim-add-stamp-btn');
  const subBtn = document.getElementById('sim-sub-stamp-btn');
  const completeBtn = document.getElementById('sim-complete-card-btn');
  const resetBtn = document.getElementById('sim-reset-btn');

  if (cappBtn) {
    cappBtn.addEventListener('click', () => {
      const res = window.AtelierStore.createTransaction({
        productName: 'Cappuccino',
        amountSpent: 180,
        addStamp: true
      });
      window.showToast(`☕ Customer buys Cappuccino ₹180 → +${res.pointsEarned} pts! New balance: ${res.newBalance} pts`);
    });
  }

  const drinks = [
    'Chikmagalur Pour Over & Saffron Bun',
    'Artisanal South Indian Kaapi',
    'Araku Valley Nitro Cold Brew',
    'Coorg Honey-Processed Cortado',
    'Oat Flat White & Cardamom Bun',
    'Monsooned Malabar Aeropress'
  ];

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
      const res = window.AtelierStore.addStamp(randomDrink);
      window.showToast(`Stamp #${res.newVisits} stamped! +25 pts (${randomDrink})`);
    });
  }

  if (subBtn) {
    subBtn.addEventListener('click', () => {
      window.AtelierStore.removeStamp();
      const state = window.AtelierStore.getState();
      window.showToast(`Stamp removed. Current: ${state.membership.currentStamps}/10`);
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      window.AtelierStore.state.membership.currentStamps = 10;
      window.AtelierStore.state.membership.points += 75;
      window.AtelierStore.recomputeRewardsStatus();
      window.AtelierStore.saveState();
      if (window.AtelierAudio) window.AtelierAudio.playRewardUnlock();
      if (window.launchAtelierCelebration) window.launchAtelierCelebration();
      window.showToast('🎉 Card Completed! (10/10 visits) Rewards Unlocked!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      window.AtelierStore.resetToDemoDefaults();
      window.showToast('Reset to demo state (Arjun • 7/10 visits)');
    });
  }
}

// Global Toast System
function showToast(message, duration = 3400) {
  let container = document.getElementById('atelier-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'atelier-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--color-gold-foil);">✦</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

window.renderBaristaSimulator = renderBaristaSimulator;
window.initBaristaSimulatorEvents = initBaristaSimulatorEvents;
window.showToast = showToast;
