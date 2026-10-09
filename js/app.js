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
      this.render();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeAllModals();
      }
    });

    this.handleRoute();
  }

  handleRoute() {
    let hash = window.location.hash.replace('#', '') || 'home';
    const isAuth = window.AtelierStore.getState().isAuthenticated;

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
    if (!isAuth && ['dashboard', 'rewards', 'activity', 'profile', 'staff'].includes(hash)) {
      window.location.hash = '#login';
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
        pageHtml = window.renderAuthPage('login');
        break;
      case 'register':
        pageHtml = window.renderAuthPage('register');
        break;
      case 'dashboard':
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
      ${window.renderBaristaSimulator()}
      <div id="modal-root"></div>
    `;

    // Rebind component listeners
    window.initNavbarEvents();
    window.initBaristaSimulatorEvents();

    switch (route) {
      case 'home':
        window.initLandingEvents();
        break;
      case 'login':
      case 'register':
        window.initAuthEvents();
        break;
      case 'dashboard':
        window.initDashboardEvents();
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
    }
  }
}

window.router = new Router();
