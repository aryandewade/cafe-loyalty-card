/* ==========================================================================
   ATELIER APPLICATION ROUTER & LIFE CYCLE ENGINE
   Single Page App architecture with state subscriptions and hash navigation
   ========================================================================== */

class Router {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentRoute = 'home';
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());

    // Subscribe to central store for zero-reload reactive updates
    window.AtelierStore.subscribe(() => {
      // If modal is active, do not re-render page to avoid destroying user modal interaction state
      const modalRoot = document.getElementById('modal-root');
      const hasActiveModal = modalRoot && modalRoot.children.length > 0;
      if (!hasActiveModal) {
        this.handleRoute();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeAllModals();
      }
    });

    this.handleRoute();
  }

  handleRoute(targetHash) {
    let rawHash = (typeof targetHash === 'string' && targetHash ? targetHash : window.location.hash).replace('#', '') || 'home';
    let [hash, queryString] = rawHash.split('?');
    const isAuth = window.AtelierStore.getState().isAuthenticated;

    // Handle Direct Password Reset Link: #reset-password?token=...&email=...
    if (hash === 'reset-password') {
      const params = new URLSearchParams(queryString || '');
      const token = params.get('token') || '';
      const email = params.get('email') || '';
      this.currentRoute = 'login';
      this.render();
      setTimeout(() => {
        if (window.openResetPasswordModal) {
          window.openResetPasswordModal({ email, token });
        }
      }, 120);
      return;
    }

    // Direct shortcut route to review modal: #review or #google-review
    if (hash === 'review' || hash === 'google-review') {
      this.currentRoute = isAuth ? 'dashboard' : 'home';
      this.render();
      setTimeout(() => {
        if (window.openGoogleReviewModal) {
          window.openGoogleReviewModal();
        }
      }, 100);
      return;
    }

    // Handle anchor links on landing page
    if (['how-it-works', 'rewards-preview', 'locations'].includes(hash)) {
      if (this.currentRoute !== 'home') {
        this.currentRoute = 'home';
        this.render();
      }
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    // Auth redirection
    if (!isAuth && ['dashboard', 'rewards', 'activity', 'profile', 'staff', 'levels'].includes(hash)) {
      window.location.hash = '#home';
      this.currentRoute = 'home';
      this.render();
      return;
    }

    if (isAuth && (hash === 'home' || hash === 'login' || hash === 'register')) {
      // If already logged in, redirect home/login to dashboard
      if (hash === 'login' || hash === 'register') {
        window.location.hash = '#dashboard';
        return;
      }
    }

    this.currentRoute = hash;
    this.render();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  render() {
    if (!this.appEl) {
      this.appEl = document.getElementById('app');
      if (!this.appEl) return;
    }

    const route = this.currentRoute;
    let pageHtml = '';

    switch (route) {
      case 'home':
        pageHtml = window.renderLandingPage();
        break;
      case 'login':
      case 'auth':
        pageHtml = window.renderAuthPage('login');
        break;
      case 'register':
        pageHtml = window.renderAuthPage('register');
        break;
      case 'dashboard':
        pageHtml = window.renderDashboardPage();
        break;
      case 'levels':
        if (typeof dashboardViewMode !== 'undefined') dashboardViewMode = 'candy';
        pageHtml = window.renderDashboardPage();
        break;
      case 'rewards':
        pageHtml = window.renderRewardsPage();
        break;
      case 'activity':
        pageHtml = window.renderActivityPage();
        break;
      case 'profile':
        pageHtml = window.renderProfilePage();
        break;
      case 'staff':
        pageHtml = window.renderStaffPage();
        break;
      case 'admin':
        pageHtml = window.renderAdminPage ? window.renderAdminPage() : '<p>Admin Portal Loading...</p>';
        break;
      default:
        pageHtml = window.renderLandingPage();
        break;
    }

    // Assemble Shell
    this.appEl.innerHTML = `
      ${window.renderNavbar(route)}
      <main id="main-content" class="page-content" tabindex="-1">
        ${pageHtml}
      </main>
    `;

    // Rebind component listeners
    window.initNavbarEvents();

    switch (route) {
      case 'home':
        window.initLandingEvents();
        break;
      case 'login':
      case 'register':
        window.initAuthEvents();
        break;
      case 'dashboard':
      case 'levels':
        window.initDashboardEvents();
        if (window.initCandyLevelsEvents) window.initCandyLevelsEvents();
        break;
      case 'rewards':
        window.initRewardsEvents();
        break;
      case 'activity':
        window.initActivityEvents();
        break;
      case 'profile':
        window.initProfileEvents();
        break;
      case 'staff':
        window.initStaffEvents();
        break;
      case 'admin':
        if (window.initAdminEvents) window.initAdminEvents();
        break;
    }
  }
}

window.router = new Router();

// Global Tactile Toast Notification System
window.showToast = function(message, duration = 3200) {
  if (!message) return;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (typeof toast.remove === 'function') {
        toast.remove();
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      if (container.children.length === 0) {
        if (typeof container.remove === 'function') container.remove();
        else if (container.parentNode) container.parentNode.removeChild(container);
      }
    }, 320);
  }, duration);
};

