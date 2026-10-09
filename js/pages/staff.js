/* ==========================================================================
   ATELIER STAFF / BARISTA POS TERMINAL & CAFÉ MANAGEMENT
   Till view for product ordering, dynamic points, conversion rate settings,
   and customer pass fulfillment.
   ========================================================================== */

let activeCategoryFilter = 'all';

function renderStaffPage() {
  const store = window.AtelierStore;
  const state = store.getState();
  const { user, membership, activeRedemptionPass, products, settings } = state;
  const rupeesPerPoint = settings.rupeesPerPoint || 10;

  // Filter products by category
  const filteredProducts = (products || []).filter(prod => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'coffee') return prod.category === 'Coffee';
    if (activeCategoryFilter === 'kaapi') return prod.category === 'Specialty Kaapi';
    if (activeCategoryFilter === 'brew') return prod.category === 'Brew Bar';
    if (activeCategoryFilter === 'bakery') return prod.category === 'Bakery' || prod.category === 'Pastry';
    if (activeCategoryFilter === 'retail') return prod.category === 'Retail' || prod.category === 'Provisions';
    return true;
  });

  const productCardsHtml = filteredProducts.map(prod => {
    const pts = store.getProductPoints(prod);
    return `
      <div class="pos-product-card" data-product-id="${prod.id}">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div style="font-size: 1.6rem;">${prod.icon || '☕'}</div>
            <span class="points-badge-gold">
              <span>✦</span>
              <span>+${pts} Points</span>
            </span>
          </div>
          <h4 style="font-size: 1.05rem; margin-bottom: 0.2rem; font-family: var(--font-serif);">${prod.name}</h4>
          <p style="font-size: 0.78rem; color: var(--color-roast-medium); margin-bottom: 0.8rem; line-height: 1.35;">
            ${prod.description || ''}
          </p>
        </div>

        <div style="border-top: 1px solid var(--color-cream-border-subtle); padding-top: 0.8rem; margin-top: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 1.15rem; font-weight: 700; color: var(--color-espresso);">
              ₹${prod.price}
            </span>
            <span style="font-size: 0.7rem; color: var(--color-roast-muted); display: block;">
              (₹${rupeesPerPoint} = 1 pt)
            </span>
          </div>

          <button class="btn-primary pos-charge-product-btn" data-product-id="${prod.id}" style="padding: 0.45rem 0.85rem; font-size: 0.78rem;">
            <span>Ring Up ✓</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="staff-page-root" style="padding: 2rem 0 5rem;">
      <div class="container container-narrow">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="eyebrow" style="background: rgba(200, 157, 75, 0.15); color: var(--color-gold-foil); border-color: rgba(200, 157, 75, 0.4);">
              <span>☕</span>
              <span>Barista POS Terminal & Manager Console • Register #02</span>
            </div>
            <h1 style="font-size: 2.2rem; margin-bottom: 0.3rem;">Till Register & Café Management</h1>
            <p style="color: var(--color-roast-medium); font-size: 0.95rem;">
              Create transactions, award product-based points, manage conversion rates, and fulfill reward passes.
            </p>
          </div>

          <a href="#dashboard" class="btn-secondary" style="font-size: 0.82rem;">
            ← Return to Customer App
          </a>
        </div>

        <!-- 1. Customer Identification Card -->
        <div class="double-bezel" style="margin-bottom: 1.8rem;">
          <div class="double-bezel-inner" style="padding: 1.8rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.2rem;">
              <div style="display: flex; align-items: center; gap: 1.1rem;">
                <div style="width: 3.8rem; height: 3.8rem; border-radius: 50%; background: var(--color-espresso); color: #FAF6ED; display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 1.5rem; border: 2px solid var(--color-gold-foil);">
                  ${user.firstName[0]}${user.lastName[0]}
                </div>
                <div>
                  <h3 style="font-size: 1.4rem; margin-bottom: 2px;">${user.firstName} ${user.lastName}</h3>
                  <div style="font-size: 0.85rem; color: var(--color-roast-medium);">
                    ID: <strong>${user.membershipId}</strong> • ${user.tier}
                  </div>
                  <div style="font-size: 0.78rem; color: var(--color-forest-roast); font-weight: 500; margin-top: 2px;">
                    Favorite: ${user.favoriteDrink}
                  </div>
                </div>
              </div>

              <!-- Live Loyalty Stats Counters -->
              <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                <div style="background: var(--bg-canvas-subtle); padding: 0.7rem 1.2rem; border-radius: 14px; text-align: center; border: 1px solid var(--color-cream-border);">
                  <div class="font-serif" style="font-size: 1.6rem; font-weight: 600; color: var(--color-espresso);" id="staff-cust-points">
                    ${membership.points}
                  </div>
                  <div style="font-size: 0.7rem; color: var(--color-roast-muted); text-transform: uppercase;">Points Balance</div>
                </div>

                <div style="background: var(--bg-canvas-subtle); padding: 0.7rem 1.2rem; border-radius: 14px; text-align: center; border: 1px solid var(--color-cream-border);">
                  <div class="font-serif" style="font-size: 1.6rem; font-weight: 600; color: var(--color-espresso);">
                    ${membership.currentStamps} / ${membership.maxStamps}
                  </div>
                  <div style="font-size: 0.7rem; color: var(--color-roast-muted); text-transform: uppercase;">Card Stamps</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Live Prompt Demonstration Scenario Showcase -->
        <div class="double-bezel" style="margin-bottom: 2rem; background: linear-gradient(135deg, #FFFDF9 0%, #FAF4E8 100%); border-color: rgba(188, 90, 43, 0.4);">
          <div class="double-bezel-inner" style="padding: 1.6rem 1.8rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.2rem;">
              <div>
                <div class="eyebrow" style="background: rgba(188, 90, 43, 0.12); color: var(--color-terracotta); border-color: rgba(188, 90, 43, 0.3); margin-bottom: 0.4rem;">
                  <span>⚡</span>
                  <span>Instant Test: Customer Buys Cappuccino Flow</span>
                </div>
                <h3 style="font-size: 1.4rem; margin-bottom: 0.4rem; font-family: var(--font-serif);">
                  Customer buys Cappuccino ₹180
                </h3>
                <div style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-roast-medium); flex-wrap: wrap;">
                  <span class="step-chip">Transaction created</span>
                  <span>→</span>
                  <span class="step-chip">₹180 spent</span>
                  <span>→</span>
                  <span class="step-chip" style="color: var(--color-terracotta); font-weight: 700; background: #FFF4EE; border-color: rgba(188,90,43,0.3);">
                    +${store.calculatePoints(180)} points
                  </span>
                  <span>→</span>
                  <span class="step-chip" style="color: var(--color-forest-roast); font-weight: 700; background: #F0F6F2; border-color: rgba(46,71,59,0.3);">
                    New balance: ${membership.points + store.calculatePoints(180)} points
                  </span>
                </div>
                <div style="font-size: 0.76rem; color: var(--color-roast-muted); margin-top: 0.4rem;">
                  Conversion formula: ₹180 ÷ ₹${rupeesPerPoint}/pt = ${store.calculatePoints(180)} points awarded.
                </div>
              </div>

              <button id="staff-buy-cappuccino-btn" class="btn-primary btn-terracotta" style="padding: 0.75rem 1.4rem; font-size: 0.88rem;">
                <span>Buy Cappuccino (₹180) →</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3. Café Owner Conversion Rate Manager -->
        <div class="double-bezel" style="margin-bottom: 2rem;">
          <div class="double-bezel-inner" style="padding: 1.8rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.4rem;">
              <div>
                <div class="eyebrow" style="background: rgba(200, 157, 75, 0.15); color: var(--color-gold-foil); border-color: rgba(200, 157, 75, 0.4); margin-bottom: 0.4rem;">
                  <span>⚙️</span>
                  <span>Café Owner & Manager Control</span>
                </div>
                <h3 style="font-size: 1.4rem; margin-bottom: 0.2rem;">Points Conversion Rate Setting</h3>
                <p style="font-size: 0.88rem; color: var(--color-roast-medium); max-width: 540px;">
                  Set the conversion rate for your loyalty program. Every product's points value updates dynamically across all menus and transactions.
                </p>
              </div>

              <!-- Active Rule Badge -->
              <div style="background: var(--color-espresso); color: #FAF6ED; padding: 0.7rem 1.25rem; border-radius: 14px; text-align: center; border: 1px solid var(--color-gold-foil);">
                <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-gold-foil);">Current Active Rule</div>
                <div style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 600;">
                  ₹${rupeesPerPoint} spent = 1 Point
                </div>
              </div>
            </div>

            <div style="background: var(--bg-canvas-subtle); padding: 1.4rem; border-radius: 16px; border: 1px solid var(--color-cream-border); display: flex; flex-direction: column; gap: 1.2rem;">
              <!-- Rate Presets -->
              <div>
                <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--color-roast-muted); display: block; margin-bottom: 0.6rem;">
                  Conversion Rate Presets:
                </label>
                <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                  <button class="rate-preset-btn ${rupeesPerPoint === 5 ? 'active' : ''}" data-rate="5">
                    ₹5 = 1 Pt (20% back)
                  </button>
                  <button class="rate-preset-btn ${rupeesPerPoint === 10 ? 'active' : ''}" data-rate="10">
                    ₹10 = 1 Pt (10% back • Standard)
                  </button>
                  <button class="rate-preset-btn ${rupeesPerPoint === 15 ? 'active' : ''}" data-rate="15">
                    ₹15 = 1 Pt (6.7% back)
                  </button>
                  <button class="rate-preset-btn ${rupeesPerPoint === 20 ? 'active' : ''}" data-rate="20">
                    ₹20 = 1 Pt (5% back)
                  </button>
                </div>
              </div>

              <!-- Custom Stepper Input Form -->
              <form id="owner-rate-form" style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-espresso);">Custom Conversion Rate:</span>
                <div style="display: flex; align-items: center; gap: 0.4rem; background: #FFF; border: 1px solid var(--color-cream-border); border-radius: 12px; padding: 0.35rem 0.8rem;">
                  <span style="font-weight: 600; color: var(--color-roast-medium);">₹</span>
                  <input type="number" id="owner-custom-rate-input" min="1" max="500" step="1" value="${rupeesPerPoint}" style="width: 75px; border: none; outline: none; font-family: var(--font-mono); font-size: 1rem; font-weight: 600;" required>
                  <span style="font-size: 0.82rem; color: var(--color-roast-medium);">spent</span>
                </div>
                <span style="font-size: 0.85rem; color: var(--color-roast-muted);">= 1 Loyalty Point</span>
                <button type="submit" class="btn-primary" style="padding: 0.55rem 1.1rem; font-size: 0.82rem;">
                  <span>Update Conversion Rate</span>
                </button>
              </form>

              <!-- Live Interactive Preview -->
              <div style="font-size: 0.82rem; color: var(--color-roast-medium); border-top: 1px dashed var(--color-cream-border); padding-top: 0.8rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span>🔍</span>
                <span>
                  <strong>Interactive Calculation:</strong> A customer purchasing Cappuccino (₹180) earns 
                  <strong style="color: var(--color-terracotta);">${store.calculatePoints(180)} points</strong> under this rule. 
                  (If changed to ₹5/pt, it gives <strong style="color: var(--color-forest-roast);">${Math.floor(180 / 5)} points</strong>).
                </span>
              </div>

              <!-- Café Stamp Password / PIN Security Control -->
              <div style="border-top: 1px dashed var(--color-cream-border); padding-top: 1rem; margin-top: 0.2rem;">
                <label style="font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--color-roast-muted); display: block; margin-bottom: 0.5rem;">
                  🔐 Café Owner Stamp Authorization Code / PIN:
                </label>
                <form id="owner-pin-form" style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 0.4rem; background: #FFF; border: 1px solid var(--color-cream-border); border-radius: 12px; padding: 0.35rem 0.8rem;">
                    <span style="font-size: 0.78rem; color: var(--color-roast-muted);">PIN:</span>
                    <input type="text" id="owner-custom-pin-input" maxlength="8" value="${store.getOwnerStampPin()}" style="width: 85px; border: none; outline: none; font-family: var(--font-mono); font-size: 1rem; font-weight: 700; letter-spacing: 0.15em;" required>
                  </div>
                  <button type="submit" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                    <span>Update Stamp Code</span>
                  </button>
                  <span style="font-size: 0.78rem; color: var(--color-roast-muted);">
                    (Barista enters this code on customer's phone to authenticate physical stamps)
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Till Product Register & Menu -->
        <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); border-radius: 20px; padding: 1.8rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
            <div>
              <h3 style="font-size: 1.35rem; margin-bottom: 0.2rem;">Till Product Register & Points Menu</h3>
              <p style="font-size: 0.82rem; color: var(--color-roast-muted);">
                Select any item to sell to customer and automatically credit their loyalty points based on the current conversion rule.
              </p>
            </div>

            <!-- Add Custom Product Button -->
            <button id="staff-open-add-product-btn" class="btn-secondary" style="font-size: 0.8rem; padding: 0.45rem 0.9rem;">
              <span>+ Add New Product</span>
            </button>
          </div>

          <!-- Category Filter Tabs -->
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.4rem; border-bottom: 1px solid var(--color-cream-border-subtle); padding-bottom: 0.8rem;">
            <button class="menu-category-tab ${activeCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">All Items</button>
            <button class="menu-category-tab ${activeCategoryFilter === 'coffee' ? 'active' : ''}" data-cat="coffee">Coffee</button>
            <button class="menu-category-tab ${activeCategoryFilter === 'kaapi' ? 'active' : ''}" data-cat="kaapi">Specialty Kaapi</button>
            <button class="menu-category-tab ${activeCategoryFilter === 'brew' ? 'active' : ''}" data-cat="brew">Brew Bar</button>
            <button class="menu-category-tab ${activeCategoryFilter === 'bakery' ? 'active' : ''}" data-cat="bakery">Bakery & Pastry</button>
            <button class="menu-category-tab ${activeCategoryFilter === 'retail' ? 'active' : ''}" data-cat="retail">Provisions & Retail</button>
          </div>

          <!-- Product Grid -->
          <div class="pos-product-grid">
            ${productCardsHtml}
          </div>
        </div>

        <!-- 5. Active Redemption Pass Inspection -->
        <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); border-radius: 20px; padding: 1.8rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.35rem; margin-bottom: 0.8rem;">Active Reward Pass Verification</h3>

          ${activeRedemptionPass ? `
            <div style="background: var(--color-forest-light); border: 1px solid rgba(46,71,59,0.3); border-radius: 14px; padding: 1.4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="reward-badge ready" style="margin-bottom: 0.4rem; display: inline-block;">Pass #${activeRedemptionPass.code}</span>
                <div style="font-size: 1.2rem; font-weight: 600; color: var(--color-forest-roast);">
                  ${activeRedemptionPass.rewardTitle}
                </div>
                <div style="font-size: 0.82rem; color: var(--color-roast-medium);">
                  Customer: ${activeRedemptionPass.customerName} (${activeRedemptionPass.membershipId})
                </div>
              </div>

              <button id="staff-confirm-pass-btn" class="btn-primary" style="background: var(--color-forest-roast); padding: 0.65rem 1.25rem;">
                <span>Confirm & Fulfill Drink ✓</span>
              </button>
            </div>
          ` : `
            <div style="padding: 1.6rem; text-align: center; background: var(--bg-canvas-subtle); border-radius: 14px; color: var(--color-roast-muted); font-size: 0.9rem;">
              No active reward pass currently awaiting fulfillment for this customer.
            </div>
          `}
        <!-- 5b. Production Security & Fraud Prevention Center -->
        <div style="background: var(--bg-surface); border: 1px solid var(--color-cream-border); border-radius: 20px; padding: 1.8rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span style="font-size: 1.2rem;">🛡️</span>
                <h3 style="font-size: 1.35rem; margin: 0;">Production Security & Anti-Fraud Center</h3>
                <span class="reward-badge ready" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;">
                  PBKDF2 • HMAC-SHA256 • Rate-Limited
                </span>
              </div>
              <p style="font-size: 0.82rem; color: var(--color-roast-muted); margin: 0;">
                Enterprise cryptographic protection against stamp spoofing, replay attacks, PIN brute-forcing, and pass screenshot fraud.
              </p>
            </div>

            <div style="display: flex; gap: 0.6rem; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--color-forest-roast); background: var(--color-forest-light); padding: 0.35rem 0.75rem; border-radius: 999px; border: 1px solid rgba(46,71,59,0.3); font-weight: 600;">
                ● Rate Limiter: ${window.AtelierSecurity ? (window.AtelierSecurity.checkRateLimit().locked ? '⛔ Locked Out' : `${window.AtelierSecurity.checkRateLimit().remainingAttempts}/5 Attempts Active`) : 'Active'}
              </span>
              <button id="staff-reset-rate-limiter-btn" class="btn-text" style="font-size: 0.75rem; color: var(--color-terracotta);">
                Reset Limits ↻
              </button>
            </div>
          </div>

          <!-- Dynamic QR Pass Cryptographic Verifier Box -->
          <div style="background: var(--bg-canvas-subtle); border: 1px solid var(--color-cream-border-subtle); border-radius: 14px; padding: 1.2rem; margin-bottom: 1.2rem;">
            <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; display: flex; justify-content: space-between;">
              <span>🎟️ Anti-Screenshot Dynamic QR Pass Verifier (HMAC-SHA256 • 90s TTL)</span>
              <button id="staff-test-gen-pass-btn" class="btn-text" style="font-size: 0.75rem; color: var(--color-gold-foil);">
                ⚡ Sample Customer Pass Token
              </button>
            </div>
            <div style="display: flex; gap: 0.6rem; margin-top: 0.5rem; flex-wrap: wrap;">
              <input type="text" id="staff-verify-token-input" placeholder="Paste or scan cryptographic pass token..." style="flex: 1; min-width: 260px; padding: 0.5rem 0.8rem; border-radius: 10px; border: 1px solid var(--color-cream-border); font-family: var(--font-mono); font-size: 0.75rem; background: var(--bg-surface-elevated);">
              <button id="staff-run-token-verify-btn" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.78rem;">
                Cryptographically Verify Pass
              </button>
            </div>
            <div id="token-verify-result-box" style="margin-top: 0.6rem; font-size: 0.75rem; display: none;"></div>
          </div>

          <!-- Real-Time Security Audit Log -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-espresso);">
                Live Security & Audit Trail (Last Events)
              </span>
              <span style="font-size: 0.72rem; color: var(--color-roast-muted);">
                Encrypted ledger • Auto-synced
              </span>
            </div>

            <div style="max-height: 200px; overflow-y: auto; border: 1px solid #2B211C; border-radius: 12px; background: #16110E; color: #FAF4EA; font-family: var(--font-mono); font-size: 0.73rem; padding: 0.6rem 0.9rem;">
              ${(window.AtelierSecurity ? window.AtelierSecurity.getAuditLogs() : []).map(log => {
                const statusColor = log.status === 'SUCCESS' ? '#4CAF50' : log.status === 'BLOCKED' ? '#FF9800' : '#F44336';
                return `
                  <div style="display: flex; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); gap: 0.8rem;">
                    <span style="color: #AA9588; flex-shrink: 0;">${log.timestamp}</span>
                    <span style="color: ${statusColor}; font-weight: 600; flex-shrink: 0;">[${log.status}]</span>
                    <span style="color: #E2B96F; flex-shrink: 0;">${log.type}</span>
                    <span style="color: #DDD4C7; flex-grow: 1; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${log.details}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 6. Terminal Utilities -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <button id="staff-award-bonus-pts" class="btn-secondary" style="font-size: 0.85rem;">
            <span>Award +50 Bonus Loyalty Points</span>
          </button>
          <button id="staff-reset-demo" class="btn-text" style="color: var(--color-roast-muted); font-size: 0.82rem;">
            Reset Customer to Clean Demo State (420 Pts • 7/10 Visits)
          </button>
        </div>

      </div>
    </div>
  `;
}

function initStaffEvents() {
  const store = window.AtelierStore;

  // 1. Live Example Flow: Buy Cappuccino ₹180
  document.getElementById('staff-buy-cappuccino-btn')?.addEventListener('click', () => {
    const res = store.createTransaction({
      productName: 'Cappuccino',
      amountSpent: 180,
      addStamp: true
    });

    window.showToast(
      `✓ Transaction created: Cappuccino (₹180 spent) → +${res.pointsEarned} points! New balance: ${res.newBalance} points`
    );

    // Open receipt modal automatically to showcase the full breakdown
    if (window.openReceiptModal && res.transaction) {
      setTimeout(() => {
        window.openReceiptModal(res.transaction);
      }, 350);
    }

    window.router.render();
  });

  // 2. Preset conversion rates
  document.querySelectorAll('.rate-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const rate = Number(btn.getAttribute('data-rate'));
      store.setConversionRate(rate);
      window.showToast(`✓ Conversion rate updated: ₹${rate} spent = 1 Point! All products updated.`);
      window.router.render();
    });
  });

  // 3. Custom rate form
  document.getElementById('owner-rate-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('owner-custom-rate-input');
    const val = Number(input?.value);
    if (val && val > 0) {
      store.setConversionRate(val);
      window.showToast(`✓ Conversion rate updated to: ₹${val} spent = 1 Point! All product point values recalculated.`);
      window.router.render();
    }
  });

  // 3b. Owner Stamp PIN form
  document.getElementById('owner-pin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pinInput = document.getElementById('owner-custom-pin-input');
    const newPin = pinInput?.value?.trim();
    if (newPin) {
      store.setOwnerStampPin(newPin);
      window.showToast(`✓ Café Owner stamp PIN updated to "${newPin}"! Baristas can now authorize stamps with this code.`);
      window.router.render();
    }
  });

  // 4. Product charge buttons in Till grid
  document.querySelectorAll('.pos-charge-product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-product-id');
      const prod = store.getState().products.find(p => p.id === prodId);
      if (prod) {
        const res = store.createTransaction({ productId: prod.id, addStamp: true });
        window.showToast(`✓ Sold ${prod.name} (₹${prod.price} spent) → +${res.pointsEarned} pts! New balance: ${res.newBalance} pts`);
        window.router.render();
      }
    });
  });

  // 5. Category tabs
  document.querySelectorAll('.menu-category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCategoryFilter = tab.getAttribute('data-cat') || 'all';
      window.router.render();
    });
  });

  // 6. Add New Product modal trigger
  document.getElementById('staff-open-add-product-btn')?.addEventListener('click', () => {
    if (window.openAddProductModal) {
      window.openAddProductModal();
    }
  });

  // 7. Active pass fulfillment
  document.getElementById('staff-confirm-pass-btn')?.addEventListener('click', () => {
    store.confirmPassVerification();
    window.showToast('Reward pass fulfilled! Customer ledger updated.');
    window.router.render();
  });

  // 8. Award bonus points
  document.getElementById('staff-award-bonus-pts')?.addEventListener('click', () => {
    store.awardPoints(50);
    window.showToast('+50 Bonus Points credited to customer account!');
    window.router.render();
  });

  // 9. Reset Demo Defaults
  document.getElementById('staff-reset-demo')?.addEventListener('click', () => {
    store.resetToDemoDefaults();
    window.showToast('Reset customer data to default demo state (Arjun • 420 Pts • 7/10 visits).');
    window.router.render();
  });

  // 10. Security Controls: Reset Rate Limiter
  document.getElementById('staff-reset-rate-limiter-btn')?.addEventListener('click', () => {
    if (window.AtelierSecurity) {
      window.AtelierSecurity.resetRateLimit();
      window.AtelierSecurity.logEvent({
        type: 'RATE_LIMITER_CLEARED',
        status: 'SUCCESS',
        details: 'Staff manager manually cleared brute-force lockout threshold'
      });
      window.showToast('✓ Security rate limits reset to 0/5 attempts.');
      window.router.render();
    }
  });

  // 11. Security Controls: Test Generate 90s Signed Pass Token
  document.getElementById('staff-test-gen-pass-btn')?.addEventListener('click', async () => {
    if (window.AtelierSecurity) {
      const pass = await window.AtelierSecurity.generateSignedQrPass('usr_arjun_9842', 'AT-48291');
      const input = document.getElementById('staff-verify-token-input');
      if (input) input.value = pass.token;
      window.showToast('⚡ Generated 90-second cryptographic HMAC-SHA256 member pass token!');
    }
  });

  // 12. Security Controls: Verify Scanned Pass Token
  document.getElementById('staff-run-token-verify-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('staff-verify-token-input');
    const resultBox = document.getElementById('token-verify-result-box');
    const token = input?.value?.trim();
    if (!token) {
      window.showToast('Please enter or paste a token to verify');
      return;
    }

    if (window.AtelierSecurity && resultBox) {
      resultBox.style.display = 'block';
      const check = await window.AtelierSecurity.verifyQrPassToken(token);
      if (check.valid) {
        resultBox.innerHTML = `
          <div style="background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.4); padding: 0.6rem 0.8rem; border-radius: 8px; color: #2E7D32;">
            <strong>✓ Pass Authenticated!</strong> Member: <code>${check.membershipId}</code> • Signature: Valid • Anti-Screenshot TTL: Active
          </div>
        `;
        window.showToast('✓ Pass cryptographically authenticated!');
      } else {
        resultBox.innerHTML = `
          <div style="background: rgba(244, 67, 54, 0.15); border: 1px solid rgba(244, 67, 54, 0.4); padding: 0.6rem 0.8rem; border-radius: 8px; color: #C62828;">
            <strong>✕ Verification Failed:</strong> ${check.reason}
          </div>
        `;
        window.showToast('✕ Invalid pass token: ' + check.reason);
      }
    }
  });
}

window.renderStaffPage = renderStaffPage;
window.initStaffEvents = initStaffEvents;
