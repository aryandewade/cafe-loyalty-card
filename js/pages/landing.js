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
                    <span>Tap to simulate stamp ✦</span>
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
      <section class="section" id="how-it-works" style="background: var(--bg-canvas-subtle); border-top: 1px solid var(--color-cream-border); border-bottom: 1px solid var(--color-cream-border);">
        <div class="container">
          <div style="text-align: center; max-width: 620px; margin: 0 auto 3.5rem;">
            <div class="eyebrow">The Ritual</div>
            <h2 style="margin-bottom: 1rem;">Crafted for genuine coffee lovers.</h2>
            <p style="color: var(--color-roast-medium); font-size: 1.05rem;">
              No convoluted tiers or expiring plastic cards. A tactile digital pass honoring your daily visits.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <!-- Step 1 -->
            <div class="double-bezel">
              <div class="double-bezel-inner" style="padding: 2.2rem 1.8rem;">
                <div style="font-family: var(--font-mono); font-size: 1.8rem; color: var(--color-gold-foil); font-weight: 500; margin-bottom: 1.2rem;">01</div>
                <h3 style="margin-bottom: 0.6rem;">Sip & Scan</h3>
                <p style="color: var(--color-roast-medium); font-size: 0.95rem; line-height: 1.6;">
                  Order your customary flat white or pour over at any Atelier location. Simply show your digital pass QR code at the till.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="double-bezel">
              <div class="double-bezel-inner" style="padding: 2.2rem 1.8rem;">
                <div style="font-family: var(--font-mono); font-size: 1.8rem; color: var(--color-gold-foil); font-weight: 500; margin-bottom: 1.2rem;">02</div>
                <h3 style="margin-bottom: 0.6rem;">Collect Harvest Stamps</h3>
                <p style="color: var(--color-roast-medium); font-size: 0.95rem; line-height: 1.6;">
                  Every drink orders yields a physical ink-style digital stamp with haptic feedback, tracking your path toward curated privileges.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="double-bezel">
              <div class="double-bezel-inner" style="padding: 2.2rem 1.8rem;">
                <div style="font-family: var(--font-mono); font-size: 1.8rem; color: var(--color-gold-foil); font-weight: 500; margin-bottom: 1.2rem;">03</div>
                <h3 style="margin-bottom: 0.6rem;">Unlock Reserve Privileges</h3>
                <p style="color: var(--color-roast-medium); font-size: 0.95rem; line-height: 1.6;">
                  Enjoy complimentary single-origins, handcrafted morning brioche buns, rare micro-lot beans, or private tasting flights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. REWARDS PREVIEW -->
      <section class="section" id="rewards-preview">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem;">
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
      <section class="section" id="locations" style="background: var(--bg-canvas-subtle); border-top: 1px solid var(--color-cream-border);">
        <div class="container">
          <div style="text-align: center; max-width: 580px; margin: 0 auto 3rem;">
            <div class="eyebrow">Our Houses</div>
            <h2>Visit our roasteries across India.</h2>
            <p style="color: var(--color-roast-medium);">Your loyalty card is recognized seamlessly across all four Atelier coffee houses.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <!-- Loc 1: Mumbai -->
            <div style="background: var(--bg-surface); padding: 1.6rem; border-radius: 18px; border: 1px solid var(--color-cream-border);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.25rem;">Bandra West Flagship</h3>
                <span style="font-size: 0.72rem; color: var(--color-forest-roast); font-weight: 600;">● Open</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-bottom: 0.8rem;">Pali Mala Road, Off Turner Rd, Mumbai</p>
              <div style="font-size: 0.75rem; color: var(--color-roast-muted); font-family: var(--font-mono);">07:30 AM — 11:00 PM IST</div>
            </div>

            <!-- Loc 2: Bengaluru -->
            <div style="background: var(--bg-surface); padding: 1.6rem; border-radius: 18px; border: 1px solid var(--color-cream-border);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.25rem;">Indiranagar Roastery</h3>
                <span style="font-size: 0.72rem; color: var(--color-forest-roast); font-weight: 600;">● Open</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-bottom: 0.8rem;">12th Main Road, HAL 2nd Stage, Bengaluru</p>
              <div style="font-size: 0.75rem; color: var(--color-roast-muted); font-family: var(--font-mono);">08:00 AM — 10:30 PM IST</div>
            </div>

            <!-- Loc 3: Delhi -->
            <div style="background: var(--bg-surface); padding: 1.6rem; border-radius: 18px; border: 1px solid var(--color-cream-border);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.25rem;">Khan Market Tasting Room</h3>
                <span style="font-size: 0.72rem; color: var(--color-forest-roast); font-weight: 600;">● Open</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-bottom: 0.8rem;">Middle Lane, Khan Market, New Delhi</p>
              <div style="font-size: 0.75rem; color: var(--color-roast-muted); font-family: var(--font-mono);">08:00 AM — 10:00 PM IST</div>
            </div>

            <!-- Loc 4: Pune -->
            <div style="background: var(--bg-surface); padding: 1.6rem; border-radius: 18px; border: 1px solid var(--color-cream-border);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.25rem;">Koregaon Park Roastery</h3>
                <span style="font-size: 0.72rem; color: var(--color-forest-roast); font-weight: 600;">● Open</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--color-roast-medium); margin-bottom: 0.8rem;">Lane 6, Koregaon Park, Pune</p>
              <div style="font-size: 0.75rem; color: var(--color-roast-muted); font-family: var(--font-mono);">07:30 AM — 10:30 PM IST</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. FOOTER -->
      <footer style="padding: 4.5rem 0 3rem; background: var(--bg-canvas); border-top: 1px solid var(--color-cream-border);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2rem; margin-bottom: 3.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                <div class="nav-brand-logo" style="width: 2.2rem; height: 2.2rem; font-size: 1.2rem;">A</div>
                <span class="nav-brand-text" style="font-size: 1.5rem;">Atelier Café</span>
              </div>
              <p style="color: var(--color-roast-medium); max-width: 380px; font-size: 0.9rem; line-height: 1.6;">
                Specialty roastery and intentional hospitality. Dedicated to single-origin cultivation, seasonal micro-lots, and digital craftsmanship.
              </p>
            </div>

            <div style="display: flex; gap: 3rem; flex-wrap: wrap;">
              <div>
                <div style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; color: var(--color-espresso);">Loyalty Club</div>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; color: var(--color-roast-medium);">
                  <li><a href="#how-it-works" style="text-decoration: none; color: inherit;">How It Works</a></li>
                  <li><a href="#rewards-preview" style="text-decoration: none; color: inherit;">Privileges</a></li>
                  <li><a href="#register" style="text-decoration: none; color: inherit;">Create Account</a></li>
                  <li><a href="#login" style="text-decoration: none; color: inherit;">Member Login</a></li>
                </ul>
              </div>

              <div>
                <div style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; color: var(--color-espresso);">Roastery</div>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.88rem; color: var(--color-roast-medium);">
                  <li><a href="#locations" style="text-decoration: none; color: inherit;">Houses & Hours</a></li>
                  <li><a href="#home" style="text-decoration: none; color: inherit;">Ethical Sourcing</a></li>
                  <li><a href="#staff" style="text-decoration: none; color: var(--color-gold-foil);">Barista Mode</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--color-roast-muted); border-top: 1px solid var(--color-cream-border); padding-top: 1.8rem; flex-wrap: wrap; gap: 1rem;">
            <div>© 2026 Atelier Coffee & Roastery Group. All rights reserved.</div>
            <div style="display: flex; gap: 1.5rem;">
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
      window.showToast('✦ Ink Stamp added! Card progress updated.');
    });
  }
}

window.renderLandingPage = renderLandingPage;
window.initLandingEvents = initLandingEvents;
