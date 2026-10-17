/* ==========================================================================
   ATELIER LANDING PAGE
   Editorial luxury café landing page with live interactive loyalty card preview
   ========================================================================== */

function renderLandingPage() {
  const store = window.AtelierStore;
  const state = store.getState();

  return `
    <div class="landing-page-root">
      <!-- 1. HERO SECTION -->
      <section class="section section-hero">
        <div class="container">
          <div class="hero-grid">
            <!-- Left: Editorial Typography & CTAs -->
            <div class="hero-content">
              <div class="eyebrow eyebrow-accent">
                <span>✦</span>
                <span>The Atelier Loyalty Club</span>
              </div>

              <h1 class="hero-title">
                Every cup brings you closer to something special.
              </h1>

              <p class="hero-description">
                Collect visits across our cafés and unlock exclusive rewards.
              </p>

              <div class="hero-ctas">
                <a href="#register" class="btn-primary" id="hero-join-btn">
                  <span>Join the Loyalty Club</span>
                  <div class="btn-icon-wrapper">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </a>

                <a href="#login" class="btn-secondary">
                  <span>Already a member? Sign in</span>
                </a>
              </div>

              <!-- Social Proof / Stats -->
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-value">10 Visits</span>
                  <span class="stat-label">Free Reward</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">4 Cafés</span>
                  <span class="stat-label">Pan-India</span>
                </div>
              </div>
            </div>

            <!-- Right: Interactive Live Loyalty Card Stage -->
            <div class="hero-stage">
              <div class="hero-stage-backdrop"></div>

              <!-- The Card -->
              <div class="hero-card-container">
                ${window.renderLoyaltyCard({ interactive: true })}
                <div style="text-align: center; margin-top: 1rem;">
                  <button id="hero-preview-stamp-btn" class="btn-text" style="font-size: 0.8rem; color: var(--color-terracotta);">
                    <span>Try Stamping ✦</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. THE PHILOSOPHY / HOW IT WORKS -->
      <section class="section section-ritual" id="how-it-works">
        <div class="container">
          <div class="section-heading-centered">
            <div class="eyebrow">How It Works</div>
            <h2>Simple & Rewarding.</h2>
          </div>

          <div class="ritual-steps-grid">
            <!-- Step 1 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">01</div>
                <h3 class="ritual-step-title">Order & Scan</h3>
                <p class="ritual-step-desc">
                  Show your pass QR code at checkout.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">02</div>
                <h3 class="ritual-step-title">Collect Stamps</h3>
                <p class="ritual-step-desc">
                  Earn points and stamps with every cup.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">03</div>
                <h3 class="ritual-step-title">Enjoy Rewards</h3>
                <p class="ritual-step-desc">
                  Redeem complimentary drinks and bakery treats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. REWARDS PREVIEW -->
      <section class="section section-rewards-preview" id="rewards-preview">
        <div class="container">
          <div class="rewards-preview-header">
            <div>
              <div class="eyebrow eyebrow-accent">Catalog</div>
              <h2>Member Rewards</h2>
            </div>
            <a href="#register" class="btn-secondary">
              <span>View All ↗</span>
            </a>
          </div>

          <div class="rewards-grid">
            <!-- Sample 1 -->
            <div class="double-bezel">
              <div class="reward-card">
                <div class="reward-card-header">
                  <div class="reward-icon-box">☕</div>
                  <span class="reward-badge ready">5 Visits</span>
                </div>
                <h3 class="reward-title">Chikmagalur Pour Over</h3>
                <p class="reward-description">
                  Single-estate pour-over coffee.
                </p>
                <div class="reward-meta-row">
                  <span>Requirement</span>
                  <span>5 Visits / 125 Pts</span>
                </div>
              </div>
            </div>

            <!-- Sample 2 -->
            <div class="double-bezel">
              <div class="reward-card">
                <div class="reward-card-header">
                  <div class="reward-icon-box">🥐</div>
                  <span class="reward-badge progress">8 Visits</span>
                </div>
                <h3 class="reward-title">Cardamom & Saffron Brioche</h3>
                <p class="reward-description">
                  Freshly baked morning brioche.
                </p>
                <div class="reward-meta-row">
                  <span>Requirement</span>
                  <span>8 Visits / 200 Pts</span>
                </div>
              </div>
            </div>

            <!-- Sample 3 -->
            <div class="double-bezel">
              <div class="reward-card">
                <div class="reward-card-header">
                  <div class="reward-icon-box">🫘</div>
                  <span class="reward-badge locked">12 Visits</span>
                </div>
                <h3 class="reward-title">Araku Valley Whole Bean (250g)</h3>
                <p class="reward-description">
                  Freshly roasted Arabica whole-bean bag.
                </p>
                <div class="reward-meta-row">
                  <span>Requirement</span>
                  <span>12 Visits / 300 Pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CAFÉ LOCATIONS -->
      <section class="section section-locations" id="locations">
        <div class="container">
          <div class="section-heading-centered">
            <div class="eyebrow">Locations</div>
            <h2>Visit our Cafés</h2>
          </div>

          <div class="locations-grid">
            <!-- Loc 1: Mumbai -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Bandra West</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">Pali Mala Road, Off Turner Rd, Mumbai</p>
              <div class="location-card-hours">07:30 AM — 11:00 PM IST</div>
            </div>

            <!-- Loc 2: Bengaluru -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Indiranagar</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">12th Main Road, HAL 2nd Stage, Bengaluru</p>
              <div class="location-card-hours">08:00 AM — 10:30 PM IST</div>
            </div>

            <!-- Loc 3: Delhi -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Khan Market</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">Middle Lane, Khan Market, New Delhi</p>
              <div class="location-card-hours">08:00 AM — 10:00 PM IST</div>
            </div>

            <!-- Loc 4: Pune -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Koregaon Park</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">Lane 6, Koregaon Park, Pune</p>
              <div class="location-card-hours">07:30 AM — 10:30 PM IST</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. FOOTER -->
      <footer class="site-footer">
        <div class="container">
          <div class="footer-main-row">
            <div class="footer-brand-col">
              <div class="footer-brand-title">
                <div class="nav-brand-logo footer-logo">A</div>
                <span class="nav-brand-text footer-brand-name">Atelier Café</span>
              </div>
            </div>

            <div class="footer-links-group">
              <div class="footer-col">
                <div class="footer-col-title">Navigation</div>
                <ul class="footer-links-list">
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#rewards-preview">Rewards</a></li>
                  <li><a href="#locations">Locations</a></li>
                  <li><a href="#login">Sign In</a></li>
                  <li><a href="#register">Sign Up</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="footer-bottom-row">
            <div class="footer-copyright">© 2026 Atelier Café. All rights reserved. • Powered by <a href="https://engiplex.in" target="_blank" rel="noopener noreferrer">Engiplex Solutions</a></div>
            <div class="footer-admin-link-wrap">
              <a href="#admin" class="footer-admin-btn" title="Café Owner Admin Portal" aria-label="Café Owner Admin Portal">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z"></path>
                  <circle cx="12" cy="15" r="1.5"></circle>
                </svg>
                <span></span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;
}

function initLandingEvents() {
  window.initLoyaltyCardInteractions();

  // Mini live stamp simulation in hero
  const stampBtn = document.getElementById('hero-preview-stamp-btn');
  if (stampBtn) {
    stampBtn.addEventListener('click', () => {
      window.AtelierStore.addStamp('Chikmagalur Single-Estate Pour Over');
      window.showToast('✦ Tasting Stamp collected! Card progress updated.');
    });
  }
}

window.renderLandingPage = renderLandingPage;
window.initLandingEvents = initLandingEvents;
