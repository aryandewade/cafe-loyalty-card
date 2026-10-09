/* ==========================================================================
   ATELIER NAVIGATION COMPONENT
   Floating island navbar, mobile drawer, bottom app dock, sound & theme toggles
   ========================================================================== */

function renderNavbar(currentPage = 'home') {
  const store = window.AtelierStore;
  const state = store.getState();
  const isAuth = state.isAuthenticated;
  const user = state.user;

  let linksHtml = '';
  if (isAuth) {
    linksHtml = `
      <li class="nav-link-item"><a href="#dashboard" class="${currentPage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
      <li class="nav-link-item"><a href="#rewards" class="${currentPage === 'rewards' ? 'active' : ''}">Rewards</a></li>
      <li class="nav-link-item"><a href="#activity" class="${currentPage === 'activity' ? 'active' : ''}">Activity</a></li>
      <li class="nav-link-item"><a href="#profile" class="${currentPage === 'profile' ? 'active' : ''}">Profile</a></li>
      <li class="nav-link-item"><a href="#staff" class="${currentPage === 'staff' ? 'active' : ''}" style="color: var(--color-gold-foil);">Staff POS</a></li>
    `;
  } else {
    linksHtml = `
      <li class="nav-link-item"><a href="#home" class="${currentPage === 'home' ? 'active' : ''}">Experience</a></li>
      <li class="nav-link-item"><a href="#how-it-works" class="${currentPage === 'how-it-works' ? 'active' : ''}">The Club</a></li>
      <li class="nav-link-item"><a href="#rewards-preview" class="${currentPage === 'rewards-preview' ? 'active' : ''}">Privileges</a></li>
      <li class="nav-link-item"><a href="#locations" class="${currentPage === 'locations' ? 'active' : ''}">Locations</a></li>
    `;
  }

  let actionsHtml = '';
  if (isAuth) {
    actionsHtml = `
      <!-- Sound Haptics Toggle -->
      <button id="sound-toggle-btn" class="btn-text" title="Toggle tactile sound feedback" style="padding: 0.4rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path>
        </svg>
      </button>

      <!-- Member Pill -->
      <a href="#profile" class="btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-gold-foil);"></span>
        <span>${user.firstName}</span>
      </a>

      <!-- Sign Out -->
      <button id="nav-logout-btn" class="btn-text" title="Sign out" style="font-size: 0.8rem; color: var(--color-roast-muted);">
        Exit
      </button>
    `;
  } else {
    actionsHtml = `
      <button id="sound-toggle-btn" class="btn-text" title="Toggle tactile sound feedback" style="padding: 0.4rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path>
        </svg>
      </button>
      <a href="#login" class="btn-text">Sign In</a>
      <a href="#register" class="btn-primary">
        <span>Join Club</span>
        <div class="btn-icon-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </a>
    `;
  }

  return `
    <header class="site-header">
      <nav class="navbar-island">
        <!-- Brand Logo -->
        <a href="${isAuth ? '#dashboard' : '#home'}" class="nav-brand">
          <div class="nav-brand-logo">A</div>
          <span class="nav-brand-text">Atelier</span>
        </a>

        <!-- Desktop Links -->
        <ul class="nav-links">
          ${linksHtml}
        </ul>

        <!-- Action CTAs -->
        <div class="nav-actions">
          ${actionsHtml}
          <!-- Mobile Hamburger -->
          <button class="hamburger-btn" id="mobile-menu-trigger" aria-label="Toggle navigation menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Mobile Drawer Overlay -->
    <div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>
    <div class="mobile-nav-sheet" id="mobile-nav-sheet">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div class="nav-brand-logo" style="width: 1.8rem; height: 1.8rem; font-size: 1rem;">A</div>
            <span class="nav-brand-text" style="font-size: 1.2rem;">Atelier Café</span>
          </div>
          <button id="mobile-menu-close" class="btn-text" style="font-size: 1.3rem;">✕</button>
        </div>

        <ul style="list-style: none; display: flex; flex-direction: column; gap: 1.2rem; font-size: 1.15rem; font-family: var(--font-serif);">
          ${isAuth ? `
            <li><a href="#dashboard" class="mobile-nav-link">Dashboard</a></li>
            <li><a href="#rewards" class="mobile-nav-link">Rewards Catalog</a></li>
            <li><a href="#activity" class="mobile-nav-link">Visit Ledger</a></li>
            <li><a href="#profile" class="mobile-nav-link">Member Profile</a></li>
            <li><a href="#staff" class="mobile-nav-link" style="color: var(--color-gold-foil);">Staff POS Bar</a></li>
          ` : `
            <li><a href="#home" class="mobile-nav-link">Experience</a></li>
            <li><a href="#how-it-works" class="mobile-nav-link">How It Works</a></li>
            <li><a href="#rewards-preview" class="mobile-nav-link">Rewards</a></li>
            <li><a href="#locations" class="mobile-nav-link">Café Locations</a></li>
            <li><a href="#login" class="mobile-nav-link">Sign In</a></li>
            <li><a href="#register" class="mobile-nav-link" style="color: var(--color-terracotta);">Join the Club</a></li>
          `}
        </ul>
      </div>

      <div style="border-top: 1px solid var(--color-cream-border); padding-top: 1.5rem;">
        <div style="font-size: 0.8rem; color: var(--color-roast-muted); margin-bottom: 0.8rem;">
          ${isAuth ? `Signed in as ${user.firstName} (${user.membershipId})` : 'Specialty Roastery & Tasting Room'}
        </div>
        ${isAuth ? `
          <button id="mobile-logout-btn" class="btn-secondary" style="width: 100%; justify-content: center;">Sign Out</button>
        ` : `
          <a href="#register" class="btn-primary" style="width: 100%; justify-content: center;">Join the Club</a>
        `}
      </div>
    </div>

    <!-- Mobile Bottom Dock (Authenticated Mode) -->
    ${isAuth ? `
      <div class="mobile-dock" id="mobile-app-dock">
        <a href="#dashboard" class="dock-item ${currentPage === 'dashboard' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Card</span>
        </a>
        <a href="#rewards" class="dock-item ${currentPage === 'rewards' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <span>Rewards</span>
        </a>
        <a href="#activity" class="dock-item ${currentPage === 'activity' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span>Activity</span>
        </a>
        <a href="#profile" class="dock-item ${currentPage === 'profile' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </a>
      </div>
    ` : ''}
  `;
}

function initNavbarEvents() {
  const trigger = document.getElementById('mobile-menu-trigger');
  const close = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-nav-overlay');
  const sheet = document.getElementById('mobile-nav-sheet');

  function openMobileNav() {
    if (overlay && sheet) {
      overlay.classList.add('is-open');
      sheet.classList.add('is-open');
    }
  }

  function closeMobileNav() {
    if (overlay && sheet) {
      overlay.classList.remove('is-open');
      sheet.classList.remove('is-open');
    }
  }

  if (trigger) trigger.addEventListener('click', openMobileNav);
  if (close) close.addEventListener('click', closeMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);

  // Close when clicking mobile links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Logout Listeners
  const logoutBtn = document.getElementById('nav-logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  function doLogout() {
    window.AtelierStore.logout();
    window.showToast('You have been signed out. Have a wonderful day!');
    window.location.hash = '#home';
  }
  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', doLogout);

  // Sound Haptics Toggle
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (window.AtelierAudio) {
        const isMuted = window.AtelierAudio.toggleMute();
        window.showToast(isMuted ? 'Haptic sound muted' : 'Haptic sound enabled ☕');
        soundBtn.style.opacity = isMuted ? '0.4' : '1';
      }
    });
  }
}

window.renderNavbar = renderNavbar;
window.initNavbarEvents = initNavbarEvents;
