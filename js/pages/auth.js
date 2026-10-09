/* ==========================================================================
   ATELIER AUTHENTICATION (LOGIN & REGISTRATION)
   Editorial split layout, seamless animated tabs, 1-click demo login, unboxing trigger
   ========================================================================== */

let authMode = 'login'; // 'login' or 'register'

function renderAuthPage(initialMode = 'login') {
  authMode = initialMode;

  return `
    <div class="auth-page-root" style="min-height: calc(100vh - 90px); display: flex; align-items: center; padding: 2.5rem 0 4rem;">
      <div class="container" style="max-width: 1040px;">
        <div class="double-bezel" style="padding: 10px; background: var(--bg-canvas-subtle);">
          <div class="double-bezel-inner" style="display: grid; grid-template-columns: 1fr 1.15fr; overflow: hidden; min-height: 600px;">
            
            <!-- LEFT: Editorial Craft Imagery & Storytelling -->
            <div style="background: linear-gradient(145deg, #241A16 0%, #17110F 100%); color: #FAF4EA; padding: 3rem 2.5rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; border-right: 1px solid rgba(200, 157, 75, 0.2);">
              <!-- Texture Background Accent -->
              <div style="position: absolute; inset: 0; background-image: radial-gradient(rgba(200, 157, 75, 0.08) 1px, transparent 1px); background-size: 16px 16px; opacity: 0.6; pointer-events: none;"></div>

              <div style="position: relative; z-index: 2;">
                <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem;">
                  <div class="nav-brand-logo" style="width: 2rem; height: 2rem; font-size: 1.1rem; background: var(--color-gold-foil); color: #181210;">A</div>
                  <span class="nav-brand-text" style="font-size: 1.3rem; color: #FAF4EA;">Atelier Café</span>
                </div>

                <div class="eyebrow" style="background: rgba(200, 157, 75, 0.15); border-color: rgba(200, 157, 75, 0.3); color: #E5BE6C; margin-bottom: 1.2rem;">
                  The Connoisseur Circle
                </div>

                <h2 style="font-size: 2.2rem; line-height: 1.2; color: #FAF4EA; margin-bottom: 1.2rem;">
                  "Coffee is not merely sustenance, but an intentional sensory ritual."
                </h2>

                <p style="color: #BBA89E; font-size: 0.95rem; line-height: 1.6; max-width: 380px;">
                  Receive your digital membership card immediately upon sign up. Collect stamps, savor seasonal reserve harvests, and enjoy private tasting room privileges.
                </p>
              </div>

              <!-- Mini Loyalty Card Graphic -->
              <div style="position: relative; z-index: 2; border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 1.5rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #C89D4B; font-family: var(--font-mono);">
                  <span>EST. 2021 • GLOBAL CLUB</span>
                  <span>CARD #AT-48291</span>
                </div>
              </div>
            </div>

            <!-- RIGHT: Interactive Form (Login vs Register Switcher) -->
            <div style="padding: 3rem 2.8rem; background: var(--bg-surface); display: flex; flex-direction: column; justify-content: center;">
              
              <!-- Mode Tabs -->
              <div style="display: flex; gap: 1.5rem; border-bottom: 1px solid var(--color-cream-border); padding-bottom: 0.8rem; margin-bottom: 2rem;">
                <button class="auth-tab-btn ${authMode === 'login' ? 'active' : ''}" id="auth-tab-login" style="background: none; border: none; font-family: var(--font-serif); font-size: 1.4rem; cursor: pointer; color: ${authMode === 'login' ? 'var(--color-espresso)' : 'var(--color-roast-muted)'}; position: relative; padding-bottom: 0.4rem; font-weight: ${authMode === 'login' ? '600' : '400'};">
                  Sign In
                  ${authMode === 'login' ? '<span style="position: absolute; bottom: -0.9rem; left: 0; right: 0; height: 2px; background: var(--color-terracotta);"></span>' : ''}
                </button>

                <button class="auth-tab-btn ${authMode === 'register' ? 'active' : ''}" id="auth-tab-register" style="background: none; border: none; font-family: var(--font-serif); font-size: 1.4rem; cursor: pointer; color: ${authMode === 'register' ? 'var(--color-espresso)' : 'var(--color-roast-muted)'}; position: relative; padding-bottom: 0.4rem; font-weight: ${authMode === 'register' ? '600' : '400'};">
                  Create Account
                  ${authMode === 'register' ? '<span style="position: absolute; bottom: -0.9rem; left: 0; right: 0; height: 2px; background: var(--color-terracotta);"></span>' : ''}
                </button>
              </div>

              <!-- Form Body -->
              <div id="auth-form-container">
                ${authMode === 'login' ? renderLoginForm() : renderRegisterForm()}
              </div>

              <!-- 1-Click Demo Login Trigger -->
              <div style="margin-top: 1.8rem; padding-top: 1.2rem; border-top: 1px dashed var(--color-cream-border); text-align: center;">
                <button id="quick-demo-login-btn" class="btn-text" style="font-size: 0.82rem; color: var(--color-terracotta);">
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
    <form id="login-form" style="display: flex; flex-direction: column; gap: 1.2rem;">
      <div>
        <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">Email Address</label>
        <input type="email" id="login-email" required value="arjun.mehta@atelier-coffee.com" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.92rem; background: var(--bg-surface-elevated);" placeholder="your@email.com">
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Password</label>
          <button type="button" id="auth-forgot-btn" class="btn-text" style="padding: 0; font-size: 0.78rem; color: var(--color-terracotta);">Forgot?</button>
        </div>
        <input type="password" id="login-password" required value="••••••••••••" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--color-cream-border); font-family: var(--font-sans); font-size: 0.92rem; background: var(--bg-surface-elevated);">
      </div>

      <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: var(--color-roast-medium);">
        <input type="checkbox" id="login-remember" checked style="accent-color: var(--color-terracotta);">
        <label for="login-remember">Remember this browser</label>
      </div>

      <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.85rem; margin-top: 0.5rem;">
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
    <form id="register-form" style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
        <div>
          <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">First Name</label>
          <input type="text" id="reg-firstname" required placeholder="Elena" style="width: 100%; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.88rem; background: var(--bg-surface-elevated);">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Last Name</label>
          <input type="text" id="reg-lastname" required placeholder="Vane" style="width: 100%; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.88rem; background: var(--bg-surface-elevated);">
        </div>
      </div>

      <div>
        <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Email Address</label>
        <input type="email" id="reg-email" required placeholder="elena@example.com" style="width: 100%; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.88rem; background: var(--bg-surface-elevated);">
      </div>

      <div>
        <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Mobile Phone (for Barista Pass)</label>
        <input type="tel" id="reg-phone" required placeholder="+1 (555) 019-2834" style="width: 100%; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.88rem; background: var(--bg-surface-elevated);">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
        <div>
          <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Password</label>
          <input type="password" id="reg-password" required placeholder="••••••••" style="width: 100%; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.88rem; background: var(--bg-surface-elevated);">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Confirm</label>
          <input type="password" id="reg-confirm" required placeholder="••••••••" style="width: 100%; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-size: 0.88rem; background: var(--bg-surface-elevated);">
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.8rem; color: var(--color-roast-medium); margin-top: 0.2rem;">
        <input type="checkbox" id="reg-terms" required checked style="accent-color: var(--color-terracotta);">
        <label for="reg-terms">I agree to the Club Terms & Coffee Privacy Policy</label>
      </div>

      <button type="submit" class="btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem; margin-top: 0.4rem;">
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
