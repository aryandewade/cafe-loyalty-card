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
            <!-- Left: Typography & CTAs -->
            <div class="hero-content">
              <div class="eyebrow eyebrow-accent">
                <span>✦</span>
                <span>Loyalty Pass</span>
              </div>

              <h1 class="hero-title">
                Collect stamps on every cup.
              </h1>

              <p class="hero-description">
                Scan your pass at our roasteries to earn stamps, level up, and unlock complimentary single-origin brews.
              </p>

              <div class="hero-ctas">
                <a href="#register" class="btn-primary" id="hero-join-btn">
                  <span>Join Club</span>
                  <div class="btn-icon-wrapper">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </a>

                <a href="#login" class="btn-secondary">
                  <span>Sign In</span>
                </a>
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
                    <span>Sample Tasting Stamp ✦</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. HOW IT WORKS -->
      <section class="section section-ritual" id="how-it-works">
        <div class="container">
          <div class="section-heading-centered">
            <h2>How it works</h2>
          </div>

          <div class="ritual-steps-grid">
            <!-- Step 1 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">01</div>
                <h3 class="ritual-step-title">Order & Scan</h3>
                <p class="ritual-step-desc">
                  Show your member QR code at the counter with any order.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">02</div>
                <h3 class="ritual-step-title">Collect Stamps</h3>
                <p class="ritual-step-desc">
                  Earn digital stamps and points with tactile haptic feedback.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">03</div>
                <h3 class="ritual-step-title">Claim Rewards</h3>
                <p class="ritual-step-desc">
                  Redeem complimentary pour overs, fresh pastries, and whole-bean bags.
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
              <h2>Member rewards</h2>
            </div>
            <a href="#rewards" class="btn-secondary">
              <span>View Catalog ↗</span>
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
                  Single-estate hand-brewed V60 with bright stone fruit notes.
                </p>
                <div class="reward-meta-row">
                  <span>Requirement</span>
                  <span>5 Visits</span>
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
                <h3 class="reward-title">Cardamom Saffron Brioche</h3>
                <p class="reward-description">
                  Fresh flaky pastry laminated with cultured butter and cardamom glaze.
                </p>
                <div class="reward-meta-row">
                  <span>Requirement</span>
                  <span>8 Visits</span>
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
                <h3 class="reward-title">Araku Valley Beans (250g)</h3>
                <p class="reward-description">
                  Freshly roasted single-origin Arabica from the Eastern Ghats.
                </p>
                <div class="reward-meta-row">
                  <span>Requirement</span>
                  <span>12 Visits</span>
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
            <h2>Locations</h2>
          </div>

          <div class="locations-grid">
            <!-- Loc 1: Mumbai -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Bandra West Flagship</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">Pali Mala Road, Off Turner Rd, Mumbai</p>
              <div class="location-card-hours">07:30 AM — 11:00 PM IST</div>
            </div>

            <!-- Loc 2: Bengaluru -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Indiranagar Roastery</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">12th Main Road, HAL 2nd Stage, Bengaluru</p>
              <div class="location-card-hours">08:00 AM — 10:30 PM IST</div>
            </div>

            <!-- Loc 3: Delhi -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Khan Market Tasting Room</h3>
                <span class="location-status-badge">● Open</span>
              </div>
              <p class="location-card-address">Middle Lane, Khan Market, New Delhi</p>
              <div class="location-card-hours">08:00 AM — 10:00 PM IST</div>
            </div>

            <!-- Loc 4: Pune -->
            <div class="location-card">
              <div class="location-card-header">
                <h3 class="location-card-name">Koregaon Park Roastery</h3>
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
              <p class="footer-brand-bio">
                Specialty coffee roasters and digital member pass.
              </p>
            </div>

            <div class="footer-links-group">
              <div class="footer-col">
                <div class="footer-col-title">Club</div>
                <ul class="footer-links-list">
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#rewards-preview">Rewards</a></li>
                  <li><a href="#register">Join</a></li>
                  <li><a href="#login">Sign In</a></li>
                </ul>
              </div>

              <div class="footer-col">
                <div class="footer-col-title">Houses</div>
                <ul class="footer-links-list">
                  <li><a href="#locations">Locations</a></li>
                  <li><a href="#home">Roastery</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="footer-bottom-row">
            <div class="footer-copyright">© 2026 Atelier Coffee. All rights reserved.</div>
            <div class="footer-legal-links">
              <span>Privacy</span>
              <span>Terms</span>
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
