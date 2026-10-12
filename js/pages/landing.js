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
                Join our private loyalty circle. Collect visits across our roasteries in Mumbai, Bengaluru, Delhi, and Pune, unlock rare seasonal estate harvests, and savor the ritual of thoughtful coffee.
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
                  <span class="stat-label">To Reserve Reward</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">4 Roasteries</span>
                  <span class="stat-label">Pan-India Club</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">88+ Score</span>
                  <span class="stat-label">Micro-Lot Coffees</span>
                </div>
              </div>
            </div>

            <!-- Right: Interactive Live Loyalty Card Stage -->
            <div class="hero-stage">
              <div class="hero-stage-backdrop"></div>

              <!-- Floating Micro Badge 1 -->
              <div class="floating-badge badge-top">
                <span style="font-size: 1.1rem;">☕</span>
                <div>
                  <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Latest Stamp</div>
                  <div style="font-weight: 600; font-size: 0.82rem;">Chikmagalur Pour Over</div>
                </div>
              </div>

              <!-- The Card -->
              <div class="hero-card-container">
                ${window.renderLoyaltyCard({ interactive: true })}
                <div style="text-align: center; margin-top: 1rem;">
                  <button id="hero-preview-stamp-btn" class="btn-text" style="font-size: 0.8rem; color: var(--color-terracotta);">
                    <span>Sample Tasting Stamp ✦</span>
                  </button>
                </div>
              </div>

              <!-- Floating Micro Badge 2 -->
              <div class="floating-badge badge-bottom">
                <span style="font-size: 1.1rem; color: var(--color-gold-foil);">✦</span>
                <div>
                  <div style="font-size: 0.72rem; color: var(--color-roast-muted); text-transform: uppercase;">Next Privilege</div>
                  <div style="font-weight: 600; font-size: 0.82rem;">Chikmagalur Free Brew</div>
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
            <div class="eyebrow">The Ritual</div>
            <h2>Crafted for genuine coffee lovers.</h2>
            <p>
              No convoluted tiers or expiring plastic cards. A tactile digital pass honoring your daily visits.
            </p>
          </div>

          <div class="ritual-steps-grid">
            <!-- Step 1 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">01</div>
                <h3 class="ritual-step-title">Sip & Scan</h3>
                <p class="ritual-step-desc">
                  Order your customary flat white or pour over at any Atelier location. Simply show your digital pass QR code at the till.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">02</div>
                <h3 class="ritual-step-title">Collect Harvest Stamps</h3>
                <p class="ritual-step-desc">
                  Every drink orders yields a physical ink-style digital stamp with haptic feedback, tracking your path toward curated privileges.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="double-bezel">
              <div class="double-bezel-inner ritual-step-card">
                <div class="ritual-step-num">03</div>
                <h3 class="ritual-step-title">Unlock Reserve Privileges</h3>
                <p class="ritual-step-desc">
                  Enjoy complimentary single-origins, handcrafted morning brioche buns, rare micro-lot beans, or private tasting flights.
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
              <div class="eyebrow eyebrow-accent">Curated Privileges</div>
              <h2>Rewards that honor the palate.</h2>
            </div>
            <a href="#register" class="btn-secondary">
              <span>View Full Catalog ↗</span>
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
                <h3 class="reward-title">Chikmagalur Single-Estate Pour Over</h3>
                <p class="reward-description">
                  A bespoke hand-poured V60 extraction highlighting bright stone fruit, mandarin, and sweet jaggery notes from our shade-grown harvest in Baba Budangiri.
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
                <h3 class="reward-title">Cardamom & Saffron Morning Brioche</h3>
                <p class="reward-description">
                  Morning viennoiserie hand-twisted daily, laminated with 84% cultured butter, crushed green Idukki cardamom, and delicate Kashmiri saffron glaze.
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
                <h3 class="reward-title">Araku Valley Micro-Lot (250g)</h3>
                <p class="reward-description">
                  Direct-trade, high-altitude organic Arabica from tribal cooperatives in Eastern Ghats, freshly roasted on our Probat to brew in your home ritual.
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
            <div class="eyebrow">Our Houses</div>
            <h2>Visit our roasteries across India.</h2>
            <p>Your loyalty card is recognized seamlessly across all four Atelier coffee houses.</p>
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
                Specialty roastery and intentional hospitality. Dedicated to single-origin cultivation, seasonal micro-lots, and digital craftsmanship.
              </p>
            </div>

            <div class="footer-links-group">
              <div class="footer-col">
                <div class="footer-col-title">Loyalty Club</div>
                <ul class="footer-links-list">
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#rewards-preview">Privileges</a></li>
                  <li><a href="#register">Create Account</a></li>
                  <li><a href="#login">Member Login</a></li>
                </ul>
              </div>

              <div class="footer-col">
                <div class="footer-col-title">Roastery</div>
                <ul class="footer-links-list">
                  <li><a href="#locations">Houses & Hours</a></li>
                  <li><a href="#home">Ethical Sourcing</a></li>
                  <li><a href="#home">Reserve Harvests</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="footer-bottom-row">
            <div class="footer-copyright">© 2026 Atelier Coffee & Roastery Group. All rights reserved.</div>
            <div class="footer-legal-links">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Digital Member Pass</span>
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
