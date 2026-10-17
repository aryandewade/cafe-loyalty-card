/* ==========================================================================
   ATELIER BOUTIQUE AUTHENTICATION (SIGN IN & SIGN UP)
   Luxury minimalist design, warm cream ambient backdrop, floating coffee bean & sparkles,
   pill segmented switcher, icon-adorned tactile inputs, and custom datepicker.
   ========================================================================== */

let authMode = 'login'; // 'login' or 'register'

function renderAuthPage(initialMode = 'login') {
  authMode = initialMode;
  const isLogin = authMode === 'login';

  return `
    <div class="auth-page-root">
      
      <!-- Ambient Decorative Backdrop (Sparkles, Coffee Bean & Warm Radial Bokeh) -->
      <div class="auth-ambient-wrapper" aria-hidden="true">
        <!-- Soft glowing radial orbs -->
        <div class="auth-ambient-orb orb-top-right"></div>
        <div class="auth-ambient-orb orb-bottom-left"></div>
        <div class="auth-ambient-orb orb-center-glow"></div>

        <!-- Four-point Sparkle Stars (as in screenshot) -->
        <svg class="auth-ambient-star star-tr" width="30" height="30" viewBox="0 0 24 24" fill="#E6C37F">
          <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z"/>
        </svg>
        <svg class="auth-ambient-star star-bl" width="24" height="24" viewBox="0 0 24 24" fill="#E6C37F">
          <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z"/>
        </svg>

        <!-- Roasted Coffee Bean (Bottom Left) -->
        <div class="auth-ambient-bean-wrap">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <g transform="rotate(-35 21 21)">
              <ellipse cx="21" cy="21" rx="14" ry="19" fill="#B38758" />
              <path d="M21 4C19.5 12 23 21 20 38" stroke="#5C3B1E" stroke-width="2.4" stroke-linecap="round" />
            </g>
          </svg>
        </div>
      </div>

      <!-- Main Boutique Card Container -->
      <div class="auth-boutique-card">
        
        <!-- Steaming Coffee Cup Icon -->
        <div class="auth-cup-header">
          <svg width="54" height="48" viewBox="0 0 52 48" fill="none" class="auth-cup-svg">
            <!-- Steam Lines -->
            <path d="M22 6C22 7.6 21 8.6 21 10.2C21 11.8 22 12.8 22 14.2" stroke="#C89D4B" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M26 4C26 5.8 25 7.0 25 8.8C25 10.6 26 11.8 26 14.2" stroke="#C89D4B" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M30 6C30 7.6 29 8.6 29 10.2C29 11.8 30 12.8 30 14.2" stroke="#C89D4B" stroke-width="1.8" stroke-linecap="round"/>
            <!-- Cup Body -->
            <path d="M14 17H38C38 17 38.5 28 26 28C13.5 28 14 17 14 17Z" stroke="#231B17" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Cup Handle -->
            <path d="M38 19.5C41 19.5 43.5 21 43.5 23.5C43.5 26 41 27.5 38 27.5" stroke="#231B17" stroke-width="2.2" stroke-linecap="round"/>
            <!-- Saucer Plate -->
            <path d="M11 32H41" stroke="#231B17" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Boutique Title -->
        <h1 class="auth-boutique-title font-serif">
          ${isLogin ? 'Welcome back' : 'Join the club'}
        </h1>

        <!-- Pill Segmented Switcher (Sign In | Sign Up) -->
        <div class="auth-pill-tabs">
          <button type="button" class="auth-pill-tab ${isLogin ? 'is-active' : ''}" id="auth-tab-login">
            Sign In
          </button>
          <button type="button" class="auth-pill-tab ${!isLogin ? 'is-active' : ''}" id="auth-tab-register">
            Sign Up
          </button>
        </div>

        <!-- Form Body Container -->
        <div id="auth-form-container">
          ${isLogin ? renderLoginForm() : renderRegisterForm()}
        </div>

      </div>
    </div>
  `;
}

function renderLoginForm() {
  return `
    <form id="login-form" class="auth-clean-form">
      <!-- Error Message Banner -->
      <div id="login-error-banner" class="auth-error-banner" role="alert"></div>

      <!-- Email Field with Envelope Icon -->
      <div class="auth-input-group">
        <span class="auth-input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E948A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </span>
        <input type="email" id="login-email" class="auth-clean-input has-icon" required placeholder="Email" autocomplete="email">
      </div>

      <!-- Password Field with Padlock Icon -->
      <div class="auth-input-group">
        <span class="auth-input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E948A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="3" ry="3"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </span>
        <input type="password" id="login-password" class="auth-clean-input has-icon" required placeholder="Password" autocomplete="current-password">
      </div>

      <!-- Remember Me & Forgot Password Row -->
      <div class="auth-options-row">
        <label class="auth-remember-check" for="login-remember">
          <input type="checkbox" id="login-remember" checked>
          <span>Remember me</span>
        </label>
        <button type="button" id="auth-forgot-btn" class="auth-forgot-link">Forgot password?</button>
      </div>

      <!-- Submit CTA Button: "Sign In →" -->
      <button type="submit" id="login-submit-btn" class="auth-boutique-btn">
        <span class="btn-label">Sign In &rarr;</span>
      </button>

      <!-- Footer Switcher Link -->
      <div class="auth-switch-footer">
        New here? <a href="#register" class="auth-switch-link" id="auth-switch-to-register">Create account</a>
      </div>
    </form>
  `;
}

function renderRegisterForm() {
  return `
    <form id="register-form" class="auth-clean-form">
      <!-- Error Message Banner -->
      <div id="register-error-banner" class="auth-error-banner" role="alert"></div>

      <!-- Row 1: First Name & Last Name (2 cols) -->
      <div class="auth-grid-2col">
        <div class="auth-input-group">
          <input type="text" id="reg-firstname" class="auth-clean-input" required placeholder="First name" autocomplete="given-name">
        </div>
        <div class="auth-input-group">
          <input type="text" id="reg-lastname" class="auth-clean-input" required placeholder="Last name" autocomplete="family-name">
        </div>
      </div>

      <!-- Row 2: Date of Birth & Mobile (2 cols) -->
      <div class="auth-grid-2col">
        <div class="auth-input-group auth-dob-group">
          <input type="text" id="reg-dob" class="auth-clean-input" placeholder="dd-mm-yyyy" readonly autocomplete="off">
        </div>
        <div class="auth-input-group">
          <input type="tel" id="reg-phone" class="auth-clean-input" placeholder="Mobile" autocomplete="tel">
        </div>
      </div>

      <!-- Row 3: Email with Envelope Icon -->
      <div class="auth-input-group">
        <span class="auth-input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E948A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="3"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
        </span>
        <input type="email" id="reg-email" class="auth-clean-input has-icon" required placeholder="Email" autocomplete="email">
      </div>

      <!-- Row 4: Password with Padlock Icon -->
      <div class="auth-input-group">
        <span class="auth-input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9E948A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="3" ry="3"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </span>
        <input type="password" id="reg-password" class="auth-clean-input has-icon" required minlength="6" placeholder="Password (6+ characters)" autocomplete="new-password">
      </div>

      <!-- Hidden confirm password field to keep seamless consistency -->
      <input type="hidden" id="reg-confirm" value="">

      <!-- Submit CTA Button: "Create Account →" -->
      <button type="submit" id="register-submit-btn" class="auth-boutique-btn">
        <span class="btn-label">Create Account &rarr;</span>
      </button>

      <!-- Footer Switcher Link -->
      <div class="auth-switch-footer">
        Have an account? <a href="#login" class="auth-switch-link" id="auth-switch-to-login">Sign in</a>
      </div>
    </form>
  `;
}

function initAuthEvents() {
  // Pill Tab Switchers
  document.getElementById('auth-tab-login')?.addEventListener('click', () => {
    window.location.hash = '#login';
  });

  document.getElementById('auth-tab-register')?.addEventListener('click', () => {
    window.location.hash = '#register';
  });

  // Footer Switcher Links
  document.getElementById('auth-switch-to-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#register';
  });

  document.getElementById('auth-switch-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#login';
  });

  // Forgot Password Trigger
  document.getElementById('auth-forgot-btn')?.addEventListener('click', () => {
    window.openForgotPasswordModal();
  });

  // Initialize Bespoke Atelier Theme Calendar for Date of Birth (dd-mm-yyyy format with top label)
  const regDobInput = document.getElementById('reg-dob');
  if (regDobInput && window.attachAtelierDatePicker) {
    window.attachAtelierDatePicker(regDobInput, {
      topLabel: 'DATE OF BIRTH',
      placeholder: 'dd-mm-yyyy',
      format: 'dd-mm-yyyy',
      defaultYear: 1998
    });
  }

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
          errorBanner.style.display = 'block';
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
      if (labelSpan) labelSpan.textContent = 'Signing in...';

      try {
        const result = await window.AtelierStore.login(email, password);
        const name = result?.user?.first_name || result?.user?.firstName || 'Connoisseur';
        window.showToast(`Welcome back, ${name}! Signed in successfully. ☕`);
        window.location.hash = '#dashboard';
      } catch (err) {
        let msg = err.message || 'Unable to sign in. Please verify your credentials.';
        if (msg === 'Failed to fetch') {
          msg = 'Unable to connect to database. Please check your network connection or server status.';
        }
        if (errorBanner) {
          errorBanner.textContent = msg;
          errorBanner.style.display = 'block';
        }
        window.showToast(msg);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (labelSpan) labelSpan.innerHTML = 'Sign In &rarr;';
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
      const confirmInput = document.getElementById('reg-confirm');
      const confirm = (confirmInput && confirmInput.value) ? confirmInput.value : password;
      const errorBanner = document.getElementById('register-error-banner');
      const submitBtn = document.getElementById('register-submit-btn');
      const labelSpan = submitBtn?.querySelector('.btn-label');

      if (!email || !password || !firstName) {
        if (errorBanner) {
          errorBanner.textContent = 'Please complete all required fields.';
          errorBanner.style.display = 'block';
        }
        return;
      }

      if (password !== confirm) {
        if (errorBanner) {
          errorBanner.textContent = 'Passwords do not match. Please re-enter.';
          errorBanner.style.display = 'block';
        }
        window.showToast('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        if (errorBanner) {
          errorBanner.textContent = 'Password must be at least 6 characters.';
          errorBanner.style.display = 'block';
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
      if (labelSpan) labelSpan.textContent = 'Creating account...';

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
        let msg = err.message || 'Registration failed. Please try again.';
        if (msg === 'Failed to fetch') {
          msg = 'Unable to connect to database. Please check your network connection or server status.';
        }
        if (errorBanner) {
          errorBanner.textContent = msg;
          errorBanner.style.display = 'block';
        }
        window.showToast(msg);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (labelSpan) labelSpan.innerHTML = 'Create Account &rarr;';
      }
    });
  }
}

window.renderAuthPage = renderAuthPage;
window.initAuthEvents = initAuthEvents;
