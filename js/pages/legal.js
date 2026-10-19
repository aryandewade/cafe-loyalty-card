/* ==========================================================================
   ATELIER LEGAL & COMPLIANCE SYSTEM
   Terms & Conditions and Privacy Policy (DPDP Act, 2023 Compliant)
   ========================================================================== */

let activeLegalDoc = 'terms'; // 'terms' | 'privacy'

const ATELIER_TERMS_HTML = `
  <article class="legal-document">
    <header class="legal-doc-header">
      <div class="legal-badge-pill">
        <span>📜 Binding Member Agreement</span>
        <span class="legal-badge-dot">•</span>
        <span>Effective October 2026</span>
      </div>
      <h2 class="legal-doc-title">Terms &amp; Conditions</h2>
      <p class="legal-doc-sub">Atelier Specialty Coffee &amp; Roastery — Digital Loyalty Club</p>
    </header>

    <div class="legal-notice-callout">
      <div class="legal-notice-icon">⚖️</div>
      <div class="legal-notice-body">
        <strong>Important Data Notice:</strong> How we handle your personal data is explained in our 
        <a href="#privacy" class="legal-inline-link" onclick="window.switchLegalDoc('privacy')">Privacy Policy</a>, 
        which is a separate document. Accepting these Terms does <strong>not</strong> automatically give us consent to process your marketing data. Consent is collected separately and transparently.
      </div>
    </div>

    <div class="legal-content-body">
      <p>
        These Terms &amp; Conditions ("Terms") form the legal agreement between you and <strong>Atelier Specialty Coffee &amp; Roastery Private Limited</strong> ("Atelier", "we", "us") for the Atelier Digital Loyalty Club website and app (the "Platform") and the loyalty programme run at our specialty coffee roasteries (the "Club"). By creating an account or using the Club, you accept these Terms.
      </p>

      <section class="legal-section">
        <h3 class="legal-section-title">1. Membership</h3>
        <ul class="legal-list">
          <li><strong>1.1 Eligibility:</strong> You must be 18 years of age or older. A person under 18 may join only through a parent or lawful guardian who gives verifiable consent and remains responsible for the account.</li>
          <li><strong>1.2 One Person, One Account:</strong> Each member may hold one account and one Member ID. Duplicate or fraudulent accounts may be merged or closed without notice.</li>
          <li><strong>1.3 Accurate Details:</strong> You must provide true, current information (name, phone, email) and keep it updated in your Profile settings.</li>
          <li><strong>1.4 Account Security:</strong> You are responsible for safeguarding your password and your Member Pass QR code. Do not share them. Notify us immediately if you suspect misuse. We are not liable for loss caused by failure to keep credentials private.</li>
          <li><strong>1.5 Free to Join:</strong> Standard membership is completely free. We may introduce optional paid reserve tiers in the future with advance notice.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">2. Welcome Benefits</h3>
        <p>
          New members receive 100 welcome loyalty points and one complimentary first-visit tasting stamp upon successful sign-up and email confirmation, once per member. Welcome benefits have no monetary cash value and cannot be exchanged for cash.
        </p>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">3. Tasting Stamps</h3>
        <ul class="legal-list">
          <li><strong>3.1 Qualifying Visits:</strong> You earn one stamp for each qualifying visit or order of at least ₹150, verified at our coffee bar register via the Owner Stamp PIN authorization.</li>
          <li><strong>3.2 10-Stamp Card:</strong> A digital stamp card holds exactly 10 stamps. When complete, you unlock the reward shown in your Rewards catalogue, and a fresh card begins.</li>
          <li><strong>3.3 Authorised Verification:</strong> Stamps are added only by authorised café baristas or verified digital passes. Stamps cannot be bought, sold, gifted, or transferred between accounts.</li>
          <li><strong>3.4 Missing Stamps:</strong> If you believe a stamp was not credited, please notify us within 7 days of your visit with your café order bill number.</li>
          <li><strong>3.5 Expiry:</strong> Stamps on an incomplete card expire only if an account remains continuously inactive for 24 months.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">4. Loyalty Points &amp; Roaster's Path</h3>
        <ul class="legal-list">
          <li><strong>4.1 Point Earning:</strong> Points are earned on qualifying café purchases at the standard rate (₹10 spent = 1 point). Every 500 points advances you 1 level on the Roaster's Path saga road.</li>
          <li><strong>4.2 Calculation:</strong> Points are calculated on the net amount paid, excluding government taxes, tips, and delivery surcharges.</li>
          <li><strong>4.3 No Cash Value:</strong> Points have no cash or monetary value, cannot be exchanged for money, and cannot be transferred or assigned.</li>
          <li><strong>4.4 Expiry &amp; Reversals:</strong> Points expire after 24 months of total account inactivity. In the event of a refunded café bill, corresponding points and stamps are reversed.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">5. Rewards and Redemption Passes</h3>
        <ul class="legal-list">
          <li><strong>5.1 Reward Catalogue:</strong> Available rewards and single-estate brews are displayed in the Rewards catalogue with required stamp or point balances.</li>
          <li><strong>5.2 15-Minute Dynamic Pass:</strong> When you redeem a perk, the Platform generates a secure digital pass with a cryptographic QR code valid for exactly <strong>15 minutes</strong>. If it expires unused, the pass is cancelled and the points/stamps are restored to your account.</li>
          <li><strong>5.3 In-Café Verification:</strong> A pass must be presented to your barista, who scans or validates it at the bar. A pass is strictly single-use by the registered member.</li>
          <li><strong>5.4 Non-Combinable:</strong> Rewards cannot be combined with external discount promotions unless explicitly stated, and are non-exchangeable.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">6. Fair Use Policy</h3>
        <p>Members agree not to:</p>
        <ul class="legal-list">
          <li>Create fictitious, temporary, or multiple accounts.</li>
          <li>Use another member's Card ID, QR pass, or login credentials.</li>
          <li>Tamper with, copy, forge, or reverse-engineer digital passes, stamps, or points.</li>
          <li>Use automated scripts, bots, or scrapers to access the Platform.</li>
          <li>Mislead café staff into unauthorized stamp issuance.</li>
        </ul>
        <p>Violations will result in immediate forfeiture of points, pass invalidation, and account termination.</p>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">7. Your Data and Rights (DPDP Act, 2023)</h3>
        <ul class="legal-list">
          <li><strong>7.1 Explicit Separate Consent:</strong> In accordance with the Digital Personal Data Protection Act, 2023, data processing consent is obtained through an unticked, explicit checkbox during registration. Promotional communications are strictly optional.</li>
          <li><strong>7.2 Right to Withdraw &amp; Erasure:</strong> You may withdraw your consent or request account deletion at any time in your Profile or by contacting our Grievance Officer. Upon confirmed deletion, your points and active cards are permanently closed.</li>
          <li><strong>7.3 Legal Compliance:</strong> We retain mandatory accounting and tax records for the duration prescribed by Indian tax laws.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">8. Food Safety &amp; Allergens</h3>
        <p>
          Coffee and food allergen preferences saved in your profile are for personalized recommendation purposes only. <strong>Always notify our baristas and café team of any medical allergies, lactose intolerance, or dietary restrictions before ordering.</strong>
        </p>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">9. Governing Law &amp; Grievance Redressal</h3>
        <p>
          These Terms are governed by and construed under the laws of the Republic of India. Any disputes are subject to the exclusive jurisdiction of the competent courts in <strong>Mumbai, Maharashtra, India</strong>. Members also retain full rights to approach the statutory Data Protection Board of India for personal data concerns.
        </p>
        <div class="legal-contact-card">
          <div class="contact-header">☕ Atelier Grievance Officer</div>
          <div class="contact-row"><strong>Email:</strong> <a href="mailto:grievance@atelier-coffee.com">grievance@atelier-coffee.com</a></div>
          <div class="contact-row"><strong>Registered Address:</strong> Atelier Specialty Coffee Roastery, Bandra West, Mumbai 400050, India</div>
          <div class="contact-row"><strong>Response Time:</strong> Acknowledged within 48 hours; resolved within 15 days.</div>
        </div>
      </section>
    </div>
  </article>
`;

const ATELIER_PRIVACY_HTML = `
  <article class="legal-document">
    <header class="legal-doc-header">
      <div class="legal-badge-pill">
        <span>🔒 DPDP Act, 2023 Compliant</span>
        <span class="legal-badge-dot">•</span>
        <span>Effective October 2026</span>
      </div>
      <h2 class="legal-doc-title">Privacy Policy</h2>
      <p class="legal-doc-sub">Atelier Specialty Coffee &amp; Roastery — Member Data Trust Policy</p>
    </header>

    <div class="legal-notice-callout">
      <div class="legal-notice-icon">🛡️</div>
      <div class="legal-notice-body">
        <strong>Our Privacy Promise:</strong> We never sell your personal data. We collect only what is strictly necessary to run your loyalty pass, verify your rewards, and brew your coffee to your tastes.
      </div>
    </div>

    <div class="legal-content-body">
      <p>
        This Privacy Policy explains how <strong>Atelier Specialty Coffee &amp; Roastery Private Limited</strong> ("Atelier", "we", "us", "our") collects, uses, stores, and protects your personal data under the <strong>Digital Personal Data Protection Act, 2023 ("DPDP Act")</strong>, the Information Technology Act, 2000, and the SPDI Rules, 2011.
      </p>

      <section class="legal-section">
        <h3 class="legal-section-title">1. Data Fiduciary Identity</h3>
        <p>
          Under Indian law, Atelier acts as the <strong>Data Fiduciary</strong>, determining the purposes and means of processing your loyalty pass data across our roasteries in Mumbai, Bengaluru, New Delhi, and Pune.
        </p>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">2. What Personal Data We Collect</h3>
        <div class="legal-table-wrap">
          <table class="legal-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Data Collected</th>
                <th>Why It Is Needed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Account Identity</strong></td>
                <td>Full name, email address, mobile number, hashed password</td>
                <td>To create and secure your membership pass. Passwords are cryptographically hashed; we cannot view plaintext passwords.</td>
              </tr>
              <tr>
                <td><strong>Loyalty Data</strong></td>
                <td>Member ID (e.g. AT-48291), stamps, points balance, tier level</td>
                <td>To maintain your stamp progress and track level milestones on the Roaster's Path.</td>
              </tr>
              <tr>
                <td><strong>Visit &amp; Receipts</strong></td>
                <td>Drink names, bill amount, timestamp, roastery branch</td>
                <td>To record qualifying visits and display itemized receipts in your Activity ledger.</td>
              </tr>
              <tr>
                <td><strong>Preferences (Optional)</strong></td>
                <td>Roast preference, milk preference (Oat, Almond, Dairy)</td>
                <td>To personalize order suggestions at the espresso bar. <em>We never solicit or store health or medical allergen data.</em></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">3. What We Do NOT Collect</h3>
        <ul class="legal-list">
          <li>We do <strong>not</strong> collect or store credit card, debit card, or UPI PIN details on our servers. Counter card payments are processed securely by our certified banking point-of-sale partners.</li>
          <li>We do <strong>not</strong> track background GPS coordinates, contact books, camera rolls, or biometric identifiers.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">4. How We Use Your Data</h3>
        <ul class="legal-list">
          <li>1. Authenticating your account and displaying your digital pass.</li>
          <li>2. Crediting points and ink stamps via owner PIN authorization.</li>
          <li>3. Generating 15-minute secure QR passes for privilege redemptions.</li>
          <li>4. Sending essential transactional alerts (stamps received, password resets, pass generation).</li>
          <li>5. Sending seasonal coffee harvest newsletters <strong>only if you affirmatively opted in</strong>.</li>
          <li>6. Preventing fraud, multiple pass usage, or tampering.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">5. Data Sharing &amp; Third Parties</h3>
        <p>
          <strong>We never sell or rent your personal data to data brokers or third-party advertisers.</strong> Data is shared only on a strict need-to-know basis:
        </p>
        <ul class="legal-list">
          <li><strong>Atelier Baristas &amp; Store Managers:</strong> Access to your Member ID, name, and loyalty balance to issue stamps and redeem rewards at the till.</li>
          <li><strong>Cloud &amp; Security Infrastructure:</strong> Secure cloud database (Supabase) and hosting providers under strict confidentiality agreements.</li>
          <li><strong>Legal Authorities:</strong> Only when strictly required by a lawful warrant, court order, or applicable Indian statute.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">6. Storage, Cookies &amp; Data Security</h3>
        <p>
          We employ industry-standard security safeguards in compliance with Section 43A of the Information Technology Act:
        </p>
        <ul class="legal-list">
          <li><strong>Encrypted Transport:</strong> 256-bit SSL/TLS HTTPS encryption on all data transmission.</li>
          <li><strong>Local Browser Storage:</strong> Local storage is used strictly to remember your active pass session on your mobile device.</li>
          <li><strong>Pass Token Expiry:</strong> All QR redemption passes self-expire in 15 minutes to prevent unauthorized replication.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">7. Your Statutory Rights Under the DPDP Act</h3>
        <p>As a Member and Data Principal, you have the following enforceable rights:</p>
        <ul class="legal-list">
          <li><strong>Right to Access:</strong> View all summary data, visit receipts, and points balances in your Activity ledger.</li>
          <li><strong>Right to Correction:</strong> Update your name, phone number, and preferences anytime in your Profile.</li>
          <li><strong>Right to Erasure:</strong> Request permanent deletion of your account and personal data.</li>
          <li><strong>Right to Withdraw Consent:</strong> Revoke consent for marketing or membership processing anytime.</li>
          <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your data rights in the event of death or incapacity.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">8. Age Restriction (18+)</h3>
        <p>
          The Atelier Digital Loyalty Club is designed strictly for individuals aged <strong>18 years and above</strong>. We do not knowingly process personal data of minors. Accounts discovered to belong to minors without verifiable parental consent will be promptly deleted.
        </p>
      </section>

      <section class="legal-section">
        <h3 class="legal-section-title">9. Contact &amp; Grievance Officer</h3>
        <p>
          For questions, data access requests, or privacy concerns, please contact our designated Grievance Officer:
        </p>
        <div class="legal-contact-card">
          <div class="contact-header">🛡️ Data Protection &amp; Grievance Redressal</div>
          <div class="contact-row"><strong>Direct Email:</strong> <a href="mailto:privacy@atelier-coffee.com">privacy@atelier-coffee.com</a></div>
          <div class="contact-row"><strong>Statutory Authority:</strong> Data Protection Board of India (<a href="https://meity.gov.in" target="_blank" rel="noopener noreferrer">meity.gov.in</a>)</div>
          <div class="contact-row"><strong>Response Commitment:</strong> Formal acknowledgement within 48 hours; complete resolution within 15–30 days.</div>
        </div>
      </section>
    </div>
  </article>
`;

function renderLegalPage(docType = 'terms') {
  activeLegalDoc = docType === 'privacy' || docType === 'privacy-policy' ? 'privacy' : 'terms';

  return `
    <div class="legal-page-root">
      <div class="container container-narrow">
        
        <!-- Breadcrumb & Top Bar -->
        <div class="legal-top-nav">
          <a href="#home" class="btn-text legal-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Café</span>
          </a>
          <button class="btn-text legal-print-btn" onclick="window.print()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Print Copy</span>
          </button>
        </div>

        <!-- Hero Header -->
        <div class="legal-hero-banner">
          <div class="eyebrow eyebrow-accent">LEGAL &amp; COMPLIANCE</div>
          <h1 class="legal-hero-title">Atelier Member Trust</h1>
          <p class="legal-hero-desc">
            Clear, transparent policies crafted in compliance with India's Digital Personal Data Protection Act (DPDP Act, 2023).
          </p>

          <!-- Document Toggle Tabs -->
          <div class="legal-tabs-pill-wrap">
            <button id="legal-tab-terms" class="legal-tab-btn ${activeLegalDoc === 'terms' ? 'active' : ''}">
              <span>📜 Terms &amp; Conditions</span>
            </button>
            <button id="legal-tab-privacy" class="legal-tab-btn ${activeLegalDoc === 'privacy' ? 'active' : ''}">
              <span>🔒 Privacy Policy</span>
            </button>
          </div>
        </div>

        <!-- Rendered Document Card -->
        <div class="legal-card-outer">
          <div id="legal-doc-container">
            ${activeLegalDoc === 'privacy' ? ATELIER_PRIVACY_HTML : ATELIER_TERMS_HTML}
          </div>
        </div>

        <!-- Bottom Assistance Callout -->
        <div class="legal-bottom-help">
          <div style="font-size: 1.4rem;">☕</div>
          <div>
            <div style="font-weight: 600; color: var(--color-espresso); font-size: 0.95rem;">Questions regarding your member data?</div>
            <div style="font-size: 0.8rem; color: var(--color-roast-medium); margin-top: 2px;">
              Our Grievance Officer responds to all inquiries within 48 business hours at <a href="mailto:privacy@atelier-coffee.com" style="color: var(--color-terracotta); font-weight: 600;">privacy@atelier-coffee.com</a>.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function initLegalEvents() {
  document.getElementById('legal-tab-terms')?.addEventListener('click', () => {
    switchLegalDoc('terms');
  });

  document.getElementById('legal-tab-privacy')?.addEventListener('click', () => {
    switchLegalDoc('privacy');
  });
}

function switchLegalDoc(docType) {
  activeLegalDoc = docType === 'privacy' || docType === 'privacy-policy' ? 'privacy' : 'terms';
  window.location.hash = activeLegalDoc === 'privacy' ? '#privacy' : '#terms';

  const container = document.getElementById('legal-doc-container');
  const termsBtn = document.getElementById('legal-tab-terms');
  const privacyBtn = document.getElementById('legal-tab-privacy');

  if (container) {
    container.innerHTML = activeLegalDoc === 'privacy' ? ATELIER_PRIVACY_HTML : ATELIER_TERMS_HTML;
  }
  if (termsBtn && privacyBtn) {
    termsBtn.classList.toggle('active', activeLegalDoc === 'terms');
    privacyBtn.classList.toggle('active', activeLegalDoc === 'privacy');
  }
  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// In-App Modal Reader for Registration & Checkout
function openLegalModal(docType = 'terms') {
  const isPrivacy = docType === 'privacy' || docType === 'privacy-policy';
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop is-active" id="legal-modal-backdrop">
      <div class="modal-card legal-modal-card" style="max-width: 680px; width: 94%; max-height: 88vh; display: flex; flex-direction: column; padding: 1.8rem 1.6rem; background: var(--bg-canvas); border: 1.5px solid var(--color-cream-border); border-radius: 24px; box-shadow: 0 25px 60px rgba(24, 18, 15, 0.35);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-cream-border); padding-bottom: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; gap: 0.5rem;">
            <button id="modal-tab-terms" class="btn-secondary ${!isPrivacy ? 'active' : ''}" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; border-radius: 999px; ${!isPrivacy ? 'background: var(--color-espresso); color: #fff; border-color: var(--color-espresso);' : ''}">
              📜 Terms &amp; Conditions
            </button>
            <button id="modal-tab-privacy" class="btn-secondary ${isPrivacy ? 'active' : ''}" style="padding: 0.4rem 0.85rem; font-size: 0.8rem; border-radius: 999px; ${isPrivacy ? 'background: var(--color-espresso); color: #fff; border-color: var(--color-espresso);' : ''}">
              🔒 Privacy Policy
            </button>
          </div>
          <button class="btn-text" id="close-legal-modal-btn" style="font-size: 1.3rem; color: var(--color-roast-muted); cursor: pointer;">✕</button>
        </div>

        <!-- Scrollable Document Viewport -->
        <div class="legal-modal-viewport" id="legal-modal-viewport" style="flex: 1; overflow-y: auto; padding-right: 0.5rem; text-align: left; -webkit-overflow-scrolling: touch;">
          ${isPrivacy ? ATELIER_PRIVACY_HTML : ATELIER_TERMS_HTML}
        </div>

        <!-- Footer Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-cream-border); padding-top: 1rem; margin-top: 1rem; flex-wrap: wrap; gap: 0.8rem;">
          <a href="${isPrivacy ? '#privacy' : '#terms'}" target="_blank" class="legal-inline-link" style="font-size: 0.82rem; color: var(--color-roast-medium); text-decoration: underline;">
            Open full standalone page ↗
          </a>
          <div style="display: flex; gap: 0.6rem;">
            <button id="legal-modal-agree-btn" class="btn-primary" style="padding: 0.55rem 1.3rem; font-size: 0.85rem;">
              <span>I Understand &amp; Agree ✓</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    document.body.style.overflow = '';
    modalRoot.innerHTML = '';
  };

  document.getElementById('close-legal-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('legal-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'legal-modal-backdrop') closeModal();
  });

  document.getElementById('modal-tab-terms')?.addEventListener('click', () => {
    const vp = document.getElementById('legal-modal-viewport');
    if (vp) {
      vp.innerHTML = ATELIER_TERMS_HTML;
      document.getElementById('modal-tab-terms')?.style.setProperty('background', 'var(--color-espresso)');
      document.getElementById('modal-tab-terms')?.style.setProperty('color', '#fff');
      document.getElementById('modal-tab-privacy')?.style.removeProperty('background');
      document.getElementById('modal-tab-privacy')?.style.removeProperty('color');
      vp.scrollTop = 0;
    }
  });

  document.getElementById('modal-tab-privacy')?.addEventListener('click', () => {
    const vp = document.getElementById('legal-modal-viewport');
    if (vp) {
      vp.innerHTML = ATELIER_PRIVACY_HTML;
      document.getElementById('modal-tab-privacy')?.style.setProperty('background', 'var(--color-espresso)');
      document.getElementById('modal-tab-privacy')?.style.setProperty('color', '#fff');
      document.getElementById('modal-tab-terms')?.style.removeProperty('background');
      document.getElementById('modal-tab-terms')?.style.removeProperty('color');
      vp.scrollTop = 0;
    }
  });

  document.getElementById('legal-modal-agree-btn')?.addEventListener('click', () => {
    // If on registration form, auto-tick the agreement checkbox
    const regAgree = document.getElementById('reg-agree');
    if (regAgree) {
      regAgree.checked = true;
    }
    closeModal();
    window.showToast?.('Terms & Privacy accepted ✓');
  });
}

// Exports
window.renderLegalPage = renderLegalPage;
window.initLegalEvents = initLegalEvents;
window.switchLegalDoc = switchLegalDoc;
window.openLegalModal = openLegalModal;
