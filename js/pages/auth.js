/* ==========================================================================
   ATELIER AUTHENTICATION (LOGIN & REGISTRATION)
   Editorial split layout, seamless animated tabs, Supabase Cloud Authentication.
   Direct Supabase REST v1 integration with PBKDF2 cryptography.
   ========================================================================== */

let authMode = 'login'; // 'login' or 'register'

function renderAuthPage(initialMode = 'login') {
  authMode = initialMode;

  return `
    <div class="auth-page-root">
      <div class="container auth-card-container">
        

            <!-- RIGHT: Interactive Form (Login vs Register Switcher) -->
            <div class="auth-form-panel">
             
              
              <!-- Mode Tabs -->
              <div class="auth-mode-tabs">
                <button class="auth-tab-btn ${authMode === 'login' ? 'active' : ''}" id="auth-tab-login" type="button">
                  Sign In
                  ${authMode === 'login' ? '<span class="auth-tab-indicator"></span>' : ''}
                </button>

                <button class="auth-tab-btn ${authMode === 'register' ? 'active' : ''}" id="auth-tab-register" type="button">
                  Create Account
                  ${authMode === 'register' ? '<span class="auth-tab-indicator"></span>' : ''}
                </button>
              </div>

              <!-- Form Body -->
              <div id="auth-form-container">
                ${authMode === 'login' ? renderLoginForm() : renderRegisterForm()}
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
      <!-- Error Message Banner -->
      <div id="login-error-banner" class="auth-error-banner" role="alert"></div>

      <div class="auth-field">
        <label class="auth-label" for="login-email">Email Address</label>
        <input type="email" id="login-email" class="auth-input" required placeholder="connoisseur@example.com" autocomplete="email">
      </div>

      <div class="auth-field">
        <div class="auth-label-row">
          <label class="auth-label" for="login-password">Password</label>
          <button type="button" id="auth-forgot-btn" class="btn-text auth-forgot-btn">Forgot?</button>
        </div>
        <input type="password" id="login-password" class="auth-input" required placeholder="Enter your password" autocomplete="current-password">
      </div>

      <div class="auth-remember-row">
        <input type="checkbox" id="login-remember" checked>
        <label for="login-remember">Remember this browser</label>
      </div>

      <button type="submit" id="login-submit-btn" class="btn-primary auth-submit-btn">
        <span class="btn-label">Sign In to Tasting Room</span>
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
      <!-- Error Message Banner -->
      <div id="register-error-banner" class="auth-error-banner" role="alert"></div>

      <div class="auth-grid-2col">
        <div class="auth-field">
          <label class="auth-label" for="reg-firstname">First Name</label>
          <input type="text" id="reg-firstname" class="auth-input" required placeholder="Alex">
        </div>
        <div class="auth-field">
          <label class="auth-label" for="reg-lastname">Last Name</label>
          <input type="text" id="reg-lastname" class="auth-input" required placeholder="Doe">
        </div>
      </div>

      <div class="auth-grid-2col">
        <div class="auth-field">
          <label class="auth-label" for="reg-dob">Date of Birth</label>
          <input type="date" id="reg-dob" class="auth-input" title="Your birth date for annual reserve rewards">
        </div>
        <div class="auth-field">
          <label class="auth-label" for="reg-phone">Mobile Phone</label>
          <input type="tel" id="reg-phone" class="auth-input" placeholder="+91 98201 44829">
        </div>
      </div>

      <div class="auth-field">
        <label class="auth-label" for="reg-email">Email Address</label>
        <input type="email" id="reg-email" class="auth-input" required placeholder="alex.doe@example.com" autocomplete="email">
      </div>

      <div class="auth-grid-2col">
        <div class="auth-field">
          <label class="auth-label" for="reg-password">Password</label>
          <input type="password" id="reg-password" class="auth-input" required minlength="6" placeholder="At least 6 characters" autocomplete="new-password">
        </div>
        <div class="auth-field">
          <label class="auth-label" for="reg-confirm">Confirm Password</label>
          <input type="password" id="reg-confirm" class="auth-input" required minlength="6" placeholder="Repeat password" autocomplete="new-password">
        </div>
      </div>

      <div class="auth-terms-row">
        <input type="checkbox" id="reg-terms" required checked>
        <label for="reg-terms">I agree to the Club Terms & Coffee Privacy Policy</label>
      </div>

      <button type="submit" id="register-submit-btn" class="btn-primary auth-submit-btn">
        <span class="btn-label">Create My Loyalty Account</span>
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

  // Login Form Submission -> Authenticates with Supabase
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      const errorBanner = document.getElementById('login-error-banner');
      const submitBtn = document.getElementById('login-submit-btn');
      const labelSpan = submitBtn?.querySelector('.btn-label');

      const email = emailInput?.value?.trim() || '';
      const password = passwordInput?.value || '';

      if (!email || !password) {
        if (errorBanner) {
          errorBanner.textContent = 'Please enter both email address and password.';
          errorBanner.style.display = 'flex';
        }
        return;
      }

      // Clear previous error
      if (errorBanner) {
        errorBanner.textContent = '';
        errorBanner.style.display = 'none';
      }

      // Set Loading UI State
      if (submitBtn) submitBtn.disabled = true;
      if (labelSpan) labelSpan.textContent = 'Authenticating with Supabase...';

      try {
        const result = await window.AtelierStore.login(email, password);
        const name = result?.user?.first_name || result?.user?.firstName || 'Connoisseur';
        window.showToast(`Welcome back, ${name}! Signed in successfully. ☕`);
        window.location.hash = '#dashboard';
      } catch (err) {
        const msg = err.message || 'Unable to sign in. Please verify your credentials.';
        if (errorBanner) {
          errorBanner.textContent = msg;
          errorBanner.style.display = 'flex';
        }
        window.showToast(msg);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (labelSpan) labelSpan.textContent = 'Sign In to Tasting Room';
      }
    });
  }

  // Register Form Submission -> Registers user directly in Supabase
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('reg-firstname')?.value?.trim() || '';
      const lastName = document.getElementById('reg-lastname')?.value?.trim() || '';
      const dob = document.getElementById('reg-dob')?.value || '';
      const phone = document.getElementById('reg-phone')?.value?.trim() || '';
      const email = document.getElementById('reg-email')?.value?.trim() || '';
      const password = document.getElementById('reg-password')?.value || '';
      const confirm = document.getElementById('reg-confirm')?.value || '';
      const errorBanner = document.getElementById('register-error-banner');
      const submitBtn = document.getElementById('register-submit-btn');
      const labelSpan = submitBtn?.querySelector('.btn-label');

      if (!email || !password || !firstName) {
        if (errorBanner) {
          errorBanner.textContent = 'Please complete all required fields.';
          errorBanner.style.display = 'flex';
        }
        return;
      }

      if (password !== confirm) {
        if (errorBanner) {
          errorBanner.textContent = 'Passwords do not match. Please re-enter.';
          errorBanner.style.display = 'flex';
        }
        window.showToast('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        if (errorBanner) {
          errorBanner.textContent = 'Password must be at least 6 characters.';
          errorBanner.style.display = 'flex';
        }
        window.showToast('Password too short (min 6 characters)');
        return;
      }

      // Clear previous error
      if (errorBanner) {
        errorBanner.textContent = '';
        errorBanner.style.display = 'none';
      }

      // Set Loading UI State
      if (submitBtn) submitBtn.disabled = true;
      if (labelSpan) labelSpan.textContent = 'Creating account in Supabase...';

      try {
        const result = await window.AtelierStore.register({
          firstName,
          lastName,
          dob,
          email,
          phone,
          password
        });

        const user = window.AtelierStore.getState().user;
        window.showToast(`Welcome to the Atelier Club, ${firstName}! 🎉`);

        // Launch Welcome Unboxing Ceremony
        if (window.openWelcomeCeremonyModal) {
          window.openWelcomeCeremonyModal(user);
        }
        window.location.hash = '#dashboard';
      } catch (err) {
        const msg = err.message || 'Registration failed. Please try again.';
        if (errorBanner) {
          errorBanner.textContent = msg;
          errorBanner.style.display = 'flex';
        }
        window.showToast(msg);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (labelSpan) labelSpan.textContent = 'Create My Loyalty Account';
      }
    });
  }
}

window.renderAuthPage = renderAuthPage;
window.initAuthEvents = initAuthEvents;
