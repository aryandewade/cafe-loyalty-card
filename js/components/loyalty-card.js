/* ==========================================================================
   ATELIER DIGITAL LOYALTY CARD COMPONENT
   Physical membership card aesthetics: debossed foil, ink stamps, 3D tilt, QR flip
   + Gen Z Enhancements: Collectible Skins, Ritual Streaks (1.5x Multiplier),
     and 9:16 Caffeine Wrapped Export.
   ========================================================================== */

function renderLoyaltyCard(options = {}) {
  const store = window.AtelierStore;
  const state = store.getState();
  const { user, membership } = state;
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
        <div class="stamp-slot stamped" style="--random-rot: ${rot}deg;" title="Visit ${i} collected">
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
        <div class="stamp-slot next-target" title="Next visit target">
          <span class="stamp-number font-mono">${i}</span>
        </div>
      `;
    } else {
      stampsHtml += `
        <div class="stamp-slot empty" title="Visit ${i}">
          <span class="stamp-number font-mono">${i}</span>
        </div>
      `;
    }
  }

  // QR Code for card back
  const qrSvg = window.generateAtelierQR ? window.generateAtelierQR(`ATELIER-CARD-${user.membershipId}`, 130) : '';

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

              <!-- Tier Pill -->
              <div class="card-tier-pill">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${user.tier}</span>
              </div>
            </div>
          </div>

          <!-- 10 Physical Stamp Grid -->
          <div class="card-stamps-grid">
            ${stampsHtml}
          </div>

          <!-- Card Footer Info -->
          <div class="card-footer-bar">
            <div>
              <div class="card-holder-name">${user.firstName} ${user.lastName}</div>
              <div style="font-size: 0.65rem; color: #AA9588; margin-top: 1px;">Member since ${user.memberSince}</div>
            </div>
            <div style="text-align: right;">
              <div class="card-member-id">${user.membershipId}</div>
              <button class="card-flip-hint" id="card-flip-btn" type="button" aria-label="Flip card for QR pass">
                <span>Pass QR</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M3 21v-5h5"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- BACK: Pass QR Code for Barista Scanner -->
        <div class="card-face card-face-back">
          <div class="card-header-bar" style="margin-bottom: 0.5rem;">
            <div style="text-align: left;">
              <span style="font-family: var(--font-serif); font-size: 1.1rem; text-transform: uppercase; font-weight: 600;">Digital Member Pass</span>
              <div style="font-size: 0.72rem; color: var(--color-roast-medium);">Scan at till for stamp & perks</div>
            </div>
            <button class="card-flip-hint" id="card-flip-back-btn" type="button" style="color: var(--color-terracotta);">
              <span>Front</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0.4rem 0;">
            <div style="background: #FFF; padding: 8px; border-radius: 12px; border: 1px solid var(--color-cream-border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              ${qrSvg}
            </div>
            <div class="font-mono" style="font-size: 0.85rem; font-weight: 600; color: var(--color-espresso); margin-top: 0.5rem; letter-spacing: 0.1em;">
              ${user.membershipId}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: var(--color-roast-medium); border-top: 1px dashed var(--color-cream-border); padding-top: 0.5rem;">
            <span>${membership.currentStamps}/10 Stamps Earned</span>
            <span>${membership.points} Reward Points</span>
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
            <span>📸 Monthly Caffeine Wrapped (9:16 Instagram Story)</span>
            <span>↗</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

// 3D Parallax Tilt, Glare & Flip Listeners
function initLoyaltyCardInteractions() {
  const card = document.getElementById('digital-loyalty-card');
  const wrapper = document.getElementById('loyalty-card-wrapper');
  if (!card || !wrapper) return;

  const flipBtn = document.getElementById('card-flip-btn');
  const flipBackBtn = document.getElementById('card-flip-back-btn');
  const glare = document.getElementById('card-holo-glare');

  function toggleFlip(e) {
    if (e) e.stopPropagation();
    card.classList.toggle('is-flipped');
    if (window.AtelierAudio && window.AtelierAudio.playFlipSound) {
      window.AtelierAudio.playFlipSound();
    }
  }

  if (flipBtn) flipBtn.addEventListener('click', toggleFlip);
  if (flipBackBtn) flipBackBtn.addEventListener('click', toggleFlip);

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
