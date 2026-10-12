/* ==========================================================================
   ATELIER AUTHENTICATION (LOGIN & REGISTRATION)
   Editorial split layout, seamless animated tabs, 1-click demo login, unboxing trigger
   ========================================================================== */

let authMode = 'login'; // 'login' or 'register'

function renderAuthPage(initialMode = 'login') {
  authMode = initialMode;

  return `
    <div class="auth-page-root">
      <div class="container auth-card-container">
        <div class="double-bezel auth-double-bezel">
          <div class="double-bezel-inner auth-split-grid">
            
            <!-- LEFT: Editorial Craft Imagery & Storytelling -->
            <div class="auth-editorial-panel">
              <!-- Texture Background Accent -->
              <div class="auth-texture-overlay"></div>

              <div class="auth-editorial-content">
                <div class="auth-editorial-brand">
                  <div class="nav-brand-logo auth-brand-logo">A</div>
                  <span class="nav-brand-text auth-brand-text">Atelier Café</span>
                </div>

                <div class="eyebrow auth-eyebrow">
                  The Connoisseur Circle
                </div>

                <h2 class="auth-quote-heading">
                  "Coffee is not merely sustenance, but an intentional sensory ritual."
                </h2>

                <p class="auth-quote-desc">
                  Receive your digital membership card immediately upon sign up. Collect stamps, savor seasonal reserve harvests, and enjoy private tasting room privileges.
                </p>
              </div>

              <!-- Mini Loyalty Card Graphic -->
              <div class="auth-mini-card-bar">
                <div class="auth-mini-card-text">
                  <span>EST. 2021 • GLOBAL CLUB</span>
                  <span>CARD #AT-48291</span>
                </div>
              </div>
            </div>

            <!-- RIGHT: Interactive Form (Login vs Register Switcher) -->
            <div class="auth-form-panel">
              
              <!-- Mode Tabs -->
              <div class="auth-mode-tabs">
                <button class="auth-tab-btn ${authMode === 'login' ? 'active' : ''}" id="auth-tab-login">
                  Sign In
                  ${authMode === 'login' ? '<span class="auth-tab-indicator"></span>' : ''}
                </button>

                <button class="auth-tab-btn ${authMode === 'register' ? 'active' : ''}" id="auth-tab-register">
                  Create Account
                  ${authMode === 'register' ? '<span class="auth-tab-indicator"></span>' : ''}
                </button>
              </div>

              <!-- Form Body -->
              <div id="auth-form-container">
                ${authMode === 'login' ? renderLoginForm() : renderRegisterForm()}
              </div>

              <!-- 1-Click Demo Login Trigger -->
              <div class="auth-demo-row">
                <button id="quick-demo-login-btn" class="btn-text auth-demo-btn">
                  ⚡ Fast Demo 1-Click Login (Arjun • 7/10 Visits)
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLoginForm() {
  return `
    <form id="login-form" class="auth-form-body">
      <div class="auth-field">
        <label class="auth-label">Email Address</label>
        <input type="email" id="login-email" class="auth-input" required value="arjun.mehta@atelier-coffee.com" placeholder="your@email.com">
      </div>

      <div class="auth-field">
        <div class="auth-label-row">
          <label class="auth-label">Password</label>
          <button type="button" id="auth-forgot-btn" class="btn-text auth-forgot-btn">Forgot?</button>
        </div>
        <input type="password" id="login-password" class="auth-input" required value="••••••••••••">
      </div>

      <div class="auth-remember-row">
        <input type="checkbox" id="login-remember" checked>
        <label for="login-remember">Remember this browser</label>
      </div>

      <button type="submit" class="btn-primary auth-submit-btn">
        <span>Sign In to Tasting Room</span>
        <div class="btn-icon-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </button>
    </form>
  `;
}

function renderRegisterForm() {
  return `
    <form id="register-form" class="auth-form-body auth-reg-form">
      <div class="auth-grid-2col">
        <div class="auth-field">
          <label class="auth-label">First Name</label>
          <input type="text" id="reg-firstname" class="auth-input" required placeholder="Elena">
        </div>
        <div class="auth-field">
          <label class="auth-label">Last Name</label>
          <input type="text" id="reg-lastname" class="auth-input" required placeholder="Vane">
        </div>
      </div>

      <div class="auth-field">
        <label class="auth-label">Email Address</label>
        <input type="email" id="reg-email" class="auth-input" required placeholder="elena@example.com">
      </div>

      <div class="auth-field">
        <label class="auth-label">Mobile Phone (for Barista Pass)</label>
        <input type="tel" id="reg-phone" class="auth-input" required placeholder="+1 (555) 019-2834">
      </div>

      <div class="auth-grid-2col">
        <div class="auth-field">
          <label class="auth-label">Password</label>
          <input type="password" id="reg-password" class="auth-input" required placeholder="••••••••">
        </div>
        <div class="auth-field">
          <label class="auth-label">Confirm</label>
          <input type="password" id="reg-confirm" class="auth-input" required placeholder="••••••••">
        </div>
      </div>

      <div class="auth-terms-row">
        <input type="checkbox" id="reg-terms" required checked>
        <label for="reg-terms">I agree to the Club Terms & Coffee Privacy Policy</label>
      </div>

      <button type="submit" class="btn-primary auth-submit-btn">
        <span>Create My Loyalty Account</span>
        <div class="btn-icon-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
      </button>
    </form>
  `;
}

function initAuthEvents() {
  // Tab Switchers
  document.getElementById('auth-tab-login')?.addEventListener('click', () => {
    window.location.hash = '#login';
  });

  document.getElementById('auth-tab-register')?.addEventListener('click', () => {
    window.location.hash = '#register';
  });

  // Forgot Password Trigger
  document.getElementById('auth-forgot-btn')?.addEventListener('click', () => {
    window.openForgotPasswordModal();
  });

  // 1-Click Demo Login
  document.getElementById('quick-demo-login-btn')?.addEventListener('click', () => {
    window.AtelierStore.login();
    window.showToast('Welcome back, Arjun! Loaded demo profile.');
    window.location.hash = '#dashboard';
  });

  // Login Form Submission
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.AtelierStore.login();
    window.showToast('Welcome back to the Atelier Tasting Room.');
    window.location.hash = '#dashboard';
  });

  // Register Form Submission -> Welcome Ceremony Trigger!
  document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('reg-firstname')?.value || 'New';
    const lastName = document.getElementById('reg-lastname')?.value || 'Member';
    const email = document.getElementById('reg-email')?.value || 'new@atelier.com';
    const phone = document.getElementById('reg-phone')?.value || '+1 555-0100';

    window.AtelierStore.register({ firstName, lastName, email, phone });
    // Launch Welcome Ceremony
    window.openWelcomeCeremonyModal(window.AtelierStore.getState().user);
  });
}

window.renderAuthPage = renderAuthPage;
window.initAuthEvents = initAuthEvents;
