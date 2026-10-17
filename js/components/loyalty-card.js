/* ==========================================================================
   ATELIER DIGITAL LOYALTY CARD COMPONENT
   Physical membership card aesthetics: debossed foil, ink stamps, 3D tilt, QR flip
   + Gen Z Enhancements: Collectible Skins, Ritual Streaks (1.5x Multiplier),
     and 9:16 Caffeine Wrapped Export.
   ========================================================================== */

function renderLoyaltyCard(options = {}) {
  const store = window.AtelierStore;
  const state = store.getState();
  const user = state.user || {
    firstName: 'Connoisseur',
    lastName: 'Circle',
    membershipId: 'AT-PREVIEW',
    memberSince: '2026'
  };
  const membership = state.membership || {
    currentStamps: 7,
    maxStamps: 10,
    currentStreak: 4,
    points: 420
  };
  const stamps = membership.currentStamps;
  const maxStamps = membership.maxStamps;
  const isInteractive = options.interactive !== false;
  const currentSkin = state.cardSkin || 'espresso';
  const streak = membership.currentStreak || 4;

  // Render 10 Stamp Slots
  let stampsHtml = '';
  for (let i = 1; i <= maxStamps; i++) {
    const isStamped = i <= stamps;
    const isNext = i === stamps + 1;
    // Slight organic rotation for each ink stamp
    const rot = ((i * 17) % 11) - 5; // e.g. -4deg to +5deg

    if (isStamped) {
      stampsHtml += `
        <div class="stamp-slot stamped" id="stamp-slot-${i}" data-slot-index="${i}" style="--random-rot: ${rot}deg; --seal-rot: ${rot}deg;" title="Visit ${i} collected">
          <div class="stamp-seal" style="transform: rotate(${rot}deg);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
        </div>
      `;
    } else if (isNext) {
      stampsHtml += `
        <div class="stamp-slot next-target" id="stamp-slot-${i}" data-slot-index="${i}" title="Next visit target">
          <span class="stamp-number font-mono">${i}</span>
        </div>
      `;
    } else {
      stampsHtml += `
        <div class="stamp-slot empty" id="stamp-slot-${i}" data-slot-index="${i}" title="Visit ${i}">
          <span class="stamp-number font-mono">${i}</span>
        </div>
      `;
    }
  }

  return `
    <div class="loyalty-card-wrapper" id="loyalty-card-wrapper">
      <div class="loyalty-card" id="digital-loyalty-card" ${isInteractive ? 'data-tilt="true"' : ''}>
        <!-- FRONT: Member Card with Selected Collectible Skin -->
        <div class="card-face card-face-front skin-${currentSkin}">
          <!-- Dynamic Holographic Glare Layer -->
          <div class="card-holo-glare" id="card-holo-glare"></div>

          <!-- Header Bar: Brand, Streak Pill, Tier -->
          <div class="card-header-bar">
            <div class="card-brand-mark">
              <span class="card-brand-name">Atelier Café</span>
              <span class="card-brand-sub">Roastery & Club</span>
            </div>

            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <!-- Duolingo-style Ritual Streak with Multiplier -->
              <div class="card-streak-pill" title="${streak}-day daily coffee ritual! 1.5x points multiplier active">
                <span class="streak-flame-icon">🔥</span>
                <span>${streak}d Streak</span>
                <span class="streak-multiplier-badge">1.5x</span>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: row; gap: 16px;">
             <div>&nbsp;</div>
           </div>

          <!-- 10 Physical Stamp Grid -->
          <div class="card-stamps-grid">
            ${stampsHtml}
          </div>

          <!-- Card Footer Bar: Customer Name & Member ID -->
          <div class="card-footer-bar">
            <div class="card-holder-box">
              <span class="card-holder-tag">
              <div class="card-holder-name">${(user.firstName || 'Valued') + ' ' + (user.lastName || 'Guest')}</div></span>
              <div class="card-holder-since">Member since ${user.memberSince || '2024'}</div>
            </div>
            <div style="text-align: right;">
              <span class="card-holder-tag">MEMBER ID</span>
              <div class="card-member-id">${user.membershipId}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gen Z Controls: Card Skin Switcher & Caffeine Wrapped Export -->
      ${isInteractive ? `
        <div class="skin-selector-bar">
          <button class="skin-chip-btn ${currentSkin === 'espresso' ? 'active' : ''}" data-skin="espresso" title="Classic Noir Cardstock">
            <span>☕</span>
            <span>Espresso</span>
          </button>
          <button class="skin-chip-btn ${currentSkin === 'holo' ? 'active' : ''}" data-skin="holo" title="Prismatic Holographic Foil">
            <span>🪩</span>
            <span>Prismatic Holo</span>
          </button>
          <button class="skin-chip-btn ${currentSkin === 'matcha' ? 'active' : ''}" data-skin="matcha" title="Sage Botanical Green">
            <span>🍵</span>
            <span>Matcha Sage</span>
          </button>
          <button class="skin-chip-btn ${currentSkin === 'cyber' ? 'active' : ''}" data-skin="cyber" title="Obsidian Titanium & Amber Glow">
            <span>⚡</span>
            <span>Cyber Amber</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 0.6rem;">
          <button id="card-open-wrapped-btn" class="btn-text" style="font-size: 0.82rem; color: var(--color-terracotta); font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
            <span>📸 Monthly Caffeine Wrapped</span>
            <span>↗</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// 3D Parallax Tilt & Glare Tracking
function initLoyaltyCardInteractions() {
  const card = document.getElementById('digital-loyalty-card');
  const wrapper = document.getElementById('loyalty-card-wrapper');
  if (!card || !wrapper) return;

  const glare = document.getElementById('card-holo-glare');

  // Subtle 3D mouse tilt & Holographic Glare Tracking
  wrapper.addEventListener('mousemove', (e) => {
    if (card.classList.contains('is-flipped')) return;
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glare) {
      const glareX = ((x / rect.width) * 100 - 50) * 1.6;
      const glareY = ((y / rect.height) * 100 - 50) * 1.6;
      glare.style.setProperty('--glare-x', `${glareX}%`);
      glare.style.setProperty('--glare-y', `${glareY}%`);
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    if (!card.classList.contains('is-flipped')) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  });

  // Collectible Skin Selector Listeners
  document.querySelectorAll('.skin-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedSkin = btn.getAttribute('data-skin');
      window.AtelierStore.setCardSkin(selectedSkin);
      window.router.render();
    });
  });

  // Open 9:16 Caffeine Wrapped Modal
  document.getElementById('card-open-wrapped-btn')?.addEventListener('click', () => {
    if (window.openCaffeineWrappedModal) {
      window.openCaffeineWrappedModal();
    }
  });
}

window.renderLoyaltyCard = renderLoyaltyCard;
window.initLoyaltyCardInteractions = initLoyaltyCardInteractions;
