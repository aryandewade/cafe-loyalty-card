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
      <li class="nav-link-item"><a href="#dashboard" class="${currentPage === 'dashboard' || currentPage === 'levels' ? 'active' : ''}">Dashboard</a></li>
      <li class="nav-link-item"><a href="#rewards" class="${currentPage === 'rewards' ? 'active' : ''}">Rewards</a></li>
      <li class="nav-link-item"><a href="#activity" class="${currentPage === 'activity' ? 'active' : ''}">Activity</a></li>
      <li class="nav-link-item"><a href="#profile" class="${currentPage === 'profile' ? 'active' : ''}">Profile</a></li>
    `;
  } else {
    linksHtml = `
      <li class="nav-link-item"><a href="#home" class="${currentPage === 'home' ? 'active' : ''}">Home</a></li>
      <li class="nav-link-item"><a href="#how-it-works" class="${currentPage === 'how-it-works' ? 'active' : ''}">How It Works</a></li>
      <li class="nav-link-item"><a href="#rewards-preview" class="${currentPage === 'rewards-preview' ? 'active' : ''}">Rewards</a></li>
      <li class="nav-link-item"><a href="#locations" class="${currentPage === 'locations' ? 'active' : ''}">Locations</a></li>
    `;
  }

  let actionsHtml = '';
  if (isAuth) {
    actionsHtml = `
      <!-- Sound Haptics Toggle -->
      <button id="sound-toggle-btn" class="btn-text nav-sound-btn" title="Toggle tactile sound feedback" style="padding: 0.4rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path>
        </svg>
      </button>


      <!-- Member Pill -->
      <a href="#profile" class="btn-secondary nav-member-pill" style="padding: 0.4rem 0.9rem; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-gold-foil);"></span>
        <span>${user?.firstName || 'Member'}</span>
      </a>

      <!-- Sign Out -->
      <button id="nav-logout-btn" class="btn-text nav-logout-btn" title="Sign out" style="font-size: 0.8rem; color: var(--color-roast-muted);">
        Exit
      </button>
    `;
  } else {
    actionsHtml = `
      <button id="sound-toggle-btn" class="btn-text nav-sound-btn" title="Toggle tactile sound feedback" style="padding: 0.4rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path>
        </svg>
      </button>
      <a href="#login" class="btn-text nav-signin-btn">Sign In</a>
      <a href="#register" class="btn-primary nav-join-btn">
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
      <div class="mobile-sheet-content">
        <!-- Header -->
        <div class="mobile-sheet-header">
          <div class="mobile-sheet-brand">
            <div class="mobile-sheet-logo">A</div>
            <div>
              <div class="mobile-sheet-title">Atelier Café</div>
              <div class="mobile-sheet-sub">Member Pass</div>
            </div>
          </div>
          <button id="mobile-menu-close" class="mobile-sheet-close" aria-label="Close navigation menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        ${isAuth ? `
          <!-- Member Quick Card -->
          <div class="mobile-member-card">
            <div class="mobile-member-info">
              <div class="mobile-member-avatar">${(user.firstName || 'A')[0]}</div>
              <div style="min-width: 0;">
                <div class="mobile-member-name">${user.firstName} ${user.lastName || ''}</div>
                <div class="mobile-member-meta">${user.membershipId || 'AT-MEMBER'}</div>
              </div>
            </div>
            <div class="mobile-member-tier-pill">${user.tier || 'Gold Member'}</div>
          </div>
        ` : ''}

        <!-- Menu Navigation List -->
        <div class="mobile-nav-section-label">Navigation</div>
        <ul class="mobile-nav-list">
          ${isAuth ? `
            <li>
              <a href="#dashboard" class="mobile-nav-link ${currentPage === 'dashboard' || currentPage === 'levels' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                      <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                      <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                      <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Dashboard</span>
                    <span class="mobile-nav-desc">Card & saga road</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#rewards" class="mobile-nav-link ${currentPage === 'rewards' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="8" r="6"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Rewards</span>
                    <span class="mobile-nav-desc">Claim perks & brews</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#activity" class="mobile-nav-link ${currentPage === 'activity' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Activity</span>
                    <span class="mobile-nav-desc">Visit history & points</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#profile" class="mobile-nav-link ${currentPage === 'profile' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Profile</span>
                    <span class="mobile-nav-desc">Account & settings</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
          ` : `
            <li>
              <a href="#home" class="mobile-nav-link ${currentPage === 'home' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Home</span>
                    <span class="mobile-nav-desc">Digital loyalty pass</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#how-it-works" class="mobile-nav-link ${currentPage === 'how-it-works' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">How It Works</span>
                    <span class="mobile-nav-desc">Stamps & points</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#rewards-preview" class="mobile-nav-link ${currentPage === 'rewards-preview' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Rewards</span>
                    <span class="mobile-nav-desc">Free brews & bakes</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#locations" class="mobile-nav-link ${currentPage === 'locations' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Café Locations</span>
                    <span class="mobile-nav-desc">Mumbai • Delhi • Bengaluru • Pune</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
            <li>
              <a href="#login" class="mobile-nav-link ${currentPage === 'login' ? 'active' : ''}">
                <div class="mobile-nav-link-content">
                  <div class="mobile-nav-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                  </div>
                  <div class="mobile-nav-texts">
                    <span class="mobile-nav-title">Sign In</span>
                    <span class="mobile-nav-desc">Access your existing pass</span>
                  </div>
                </div>
                <div class="mobile-nav-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </a>
            </li>
          `}
        </ul>
      </div>

      <div class="mobile-sheet-footer">
        ${isAuth ? `
          <button id="mobile-logout-btn" class="mobile-signout-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign Out of Pass</span>
          </button>
        ` : `
          <a href="#register" class="btn-primary mobile-nav-link" style="justify-content: center; width: 100%; border-radius: var(--radius-button); padding: 0.8rem 1rem; color: #fff !important;">
            <span>Join the Roastery Club</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-left: 0.4rem;">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        `}
        <div class="mobile-sheet-signature">Atelier Specialty Coffee Roastery • Est. 2024</div>
      </div>
    </div>

    <!-- Mobile Bottom Dock (Authenticated Mode) -->
    ${isAuth && currentPage !== 'admin' ? `
      <div class="mobile-dock" id="mobile-app-dock">
        <a href="#dashboard" class="dock-item ${currentPage === 'dashboard' || currentPage === 'levels' ? 'active' : ''}">
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

  const dock = document.getElementById('mobile-app-dock');

  function openMobileNav() {
    if (overlay && sheet) {
      overlay.classList.add('is-open');
      sheet.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (dock) {
        dock.style.opacity = '0';
        dock.style.pointerEvents = 'none';
      }
      if (window.AtelierAudio && typeof window.AtelierAudio.playCardOpen === 'function') {
        window.AtelierAudio.playCardOpen();
      }
    }
  }

  function closeMobileNav() {
    if (overlay && sheet) {
      overlay.classList.remove('is-open');
      sheet.classList.remove('is-open');
      document.body.style.overflow = '';
      if (dock) {
        dock.style.opacity = '1';
        dock.style.pointerEvents = 'auto';
      }
      if (window.AtelierAudio && typeof window.AtelierAudio.playCardClose === 'function') {
        window.AtelierAudio.playCardClose();
      }
    }
  }

  if (trigger) trigger.addEventListener('click', openMobileNav);
  if (close) close.addEventListener('click', closeMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);

  // Close when clicking mobile links with tactile tap
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.AtelierAudio && typeof window.AtelierAudio.playTap === 'function') {
        window.AtelierAudio.playTap();
      }
      closeMobileNav();
    });
  });

  // Logout Listeners
  const logoutBtn = document.getElementById('nav-logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  function doLogout(e) {
    if (e) e.preventDefault();
    closeMobileNav();
    window.AtelierStore.logout();
    window.showToast('You have been signed out. Have a wonderful day!');
    window.location.hash = '#home';
    if (window.router) {
      window.router.currentRoute = 'home';
      window.router.handleRoute();
    }
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
