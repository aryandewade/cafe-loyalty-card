/* ==========================================================================
   ATELIER CANDY CRUSH SAGA LEVELS & JUICY ANIMATION ENGINE
   Progression Rule: 1 Full Card (10 Visits / Stamps) = Advance 1 Level
   Winding Bézier Road, 3D Candy Gem Nodes, Bobbing Avatar, Star Slams,
   and Web Audio Celebration Fanfare
   ========================================================================== */

const ATELIER_CANDY_LEVELS = [
  {
    level: 1,
    title: "First Sip Initiate",
    subtitle: "Complete Card #1 (10 visits) to advance to Level 2",
    cardCycle: 1,
    visitsRequired: 0,
    visitsToPass: 10,
    pointsRequired: 50,
    reward: "Welcome 50 Bonus Points & Level 2 Status",
    rewardIcon: "✨",
    icon: "☕",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #1", earned: true },
      { id: 2, label: "Complete all 10 stamps on Card #1", earned: true },
      { id: 3, label: "Order an espresso or pour-over", earned: true }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 2,
    title: "Crema Apprentice",
    subtitle: "Complete Card #2 (20 total visits) to advance to Level 3",
    cardCycle: 2,
    visitsRequired: 10,
    visitsToPass: 20,
    pointsRequired: 100,
    reward: "Free Vanilla, Hazelnut or Cardamom Shot",
    rewardIcon: "🥛",
    icon: "☕",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #2 (15 total visits)", earned: true },
      { id: 2, label: "Complete all 10 stamps on Card #2 (20 visits)", earned: true },
      { id: 3, label: "Try Oatly Barista or A2 desi milk", earned: true }
    ],
    xPercent: 78,
    milestone: false
  },
  {
    level: 3,
    title: "Roastery Regular",
    subtitle: "Complete Card #3 (30 total visits) to advance to Level 4",
    cardCycle: 3,
    visitsRequired: 20,
    visitsToPass: 30,
    pointsRequired: 200,
    reward: "15% Off Any Hand-Laminated Brioche",
    rewardIcon: "🥐",
    icon: "☕",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #3 (25 total visits)", earned: true },
      { id: 2, label: "Complete all 10 stamps on Card #3 (30 visits)", earned: false },
      { id: 3, label: "Maintain a 3-day coffee visit streak", earned: false }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 4,
    title: "Pour-Over Explorer",
    subtitle: "Complete Card #4 (40 total visits) to advance to Level 5",
    cardCycle: 4,
    visitsRequired: 30,
    visitsToPass: 40,
    pointsRequired: 300,
    reward: "Complimentary V60 Brew Bar Upgrade",
    rewardIcon: "🧪",
    icon: "🧪",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #4 (35 total visits)", earned: false },
      { id: 2, label: "Complete all 10 stamps on Card #4 (40 visits)", earned: false },
      { id: 3, label: "Sample Baba Budangiri harvest", earned: false }
    ],
    xPercent: 22,
    milestone: false
  },
  {
    level: 5,
    title: "Bronze Cupper Vault",
    subtitle: "Milestone: 4 Full Cards Completed! Roastery Vault Unlocked",
    cardCycle: 5,
    visitsRequired: 40,
    visitsToPass: 50,
    pointsRequired: 450,
    reward: "🎁 Custom Ceramic & Brass Mug + 100 Bonus Pts",
    rewardIcon: "🎁",
    icon: "🎁",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #5 (45 total visits)", earned: false },
      { id: 2, label: "Complete all 10 stamps on Card #5 (50 visits)", earned: false },
      { id: 3, label: "Redeem any seasonal reward pass", earned: false }
    ],
    xPercent: 50,
    milestone: true
  },
  {
    level: 6,
    title: "Cold Drip Alchemist",
    subtitle: "Complete Card #6 (60 total visits) to advance to Level 7",
    cardCycle: 6,
    visitsRequired: 50,
    visitsToPass: 60,
    pointsRequired: 600,
    reward: "Complimentary Chilled Nitro Cold Brew",
    rewardIcon: "🧊",
    icon: "🧊",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #6 (55 total visits)", earned: false },
      { id: 2, label: "Complete all 10 stamps on Card #6 (60 visits)", earned: false },
      { id: 3, label: "Order an Araku Valley cold drip", earned: false }
    ],
    xPercent: 78,
    milestone: false
  },
  {
    level: 7,
    title: "Artisan Kaapi Master",
    subtitle: "Complete Card #7 (70 total visits) to advance to Level 8",
    cardCycle: 7,
    visitsRequired: 60,
    visitsToPass: 70,
    pointsRequired: 750,
    reward: "Free Artisanal Davara Kaapi & Sweet Bun",
    rewardIcon: "🏺",
    icon: "🏺",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #7 (65 total visits)", earned: false },
      { id: 2, label: "Complete all 10 stamps on Card #7 (70 visits)", earned: false },
      { id: 3, label: "Order traditional brass dabara Kaapi", earned: false }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 8,
    title: "Micro-Lot Connoisseur",
    subtitle: "Complete Card #8 (80 total visits) to advance to Level 9",
    cardCycle: 8,
    visitsRequired: 70,
    visitsToPass: 80,
    pointsRequired: 900,
    reward: "Free 250g Araku Valley Whole-Bean Bag",
    rewardIcon: "🫘",
    icon: "🫘",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #8 (75 total visits)", earned: false },
      { id: 2, label: "Complete all 10 stamps on Card #8 (80 visits)", earned: false },
      { id: 3, label: "Sample 4 different roast origins", earned: false }
    ],
    xPercent: 22,
    milestone: false
  },
  {
    level: 9,
    title: "Western Ghats Pioneer",
    subtitle: "Complete Card #9 (90 total visits) to advance to Level 10",
    cardCycle: 9,
    visitsRequired: 80,
    visitsToPass: 90,
    pointsRequired: 1050,
    reward: "VIP Cupping Masterclass for Two",
    rewardIcon: "✨",
    icon: "✨",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #9 (85 total visits)", earned: false },
      { id: 2, label: "Complete all 10 stamps on Card #9 (90 visits)", earned: false },
      { id: 3, label: "5-week uninterrupted visit streak", earned: false }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 10,
    title: "Legend of Atelier",
    subtitle: "Grand Summit: 100 Lifetime Visits (10 Completed Cards)",
    cardCycle: 10,
    visitsRequired: 90,
    visitsToPass: 100,
    pointsRequired: 1200,
    reward: "🏆 Permanent Gold Founder Badge & Engraved Brass Flask",
    rewardIcon: "🏆",
    icon: "🏆",
    stars: [
      { id: 1, label: "Collect 5 stamps on Card #10 (95 total visits)", earned: false },
      { id: 2, label: "Complete 100 Lifetime Visits (10 full cards)", earned: false },
      { id: 3, label: "Accumulate 1,200 lifetime points", earned: false }
    ],
    xPercent: 50,
    milestone: true
  }
];

class CandyLevelsEngine {
  constructor() {
    this.levels = ATELIER_CANDY_LEVELS;
  }

  // CORE RULE: Completing 10 visits on a card advances 1 level!
  // Visits 0-9   (Card 1) -> Level 1 (0 cards completed)
  // Visits 10-19 (Card 2) -> Level 2 (1 card completed)
  // Visits 20-29 (Card 3) -> Level 3 (2 cards completed)
  // Visits 30-39 (Card 4) -> Level 4 (3 cards completed)
  // ...
  calculateCurrentLevel(membership) {
    const visits = membership.lifetimeVisits || 0;
    const cardsCompleted = Math.floor(visits / 10);
    return Math.min(this.levels.length, Math.max(1, cardsCompleted + 1));
  }

  // Get exact card status: current card number, stamps on card (0-10), and stamps left to level up
  getCardProgress(membership) {
    const visits = membership.lifetimeVisits || 0;
    const stampsOnCurrentCard = membership.currentStamps !== undefined 
      ? membership.currentStamps 
      : (visits % 10 || 0);
    const visitsLeftForNextLevel = Math.max(0, 10 - stampsOnCurrentCard);
    const completedCards = Math.floor(visits / 10);
    const currentCardNumber = completedCards + 1;

    return {
      completedCards,
      currentCardNumber,
      stampsOnCurrentCard,
      visitsLeftForNextLevel
    };
  }

  // Calculate stars earned for a level given current state
  // Star 1: Halfway through this card (5 stamps collected on this card)
  // Star 2: Full 10 stamps completed on this card!
  // Star 3: Point balance target achieved for this tier
  calculateLevelStars(level, membership) {
    const visits = membership.lifetimeVisits || 0;
    const points = membership.points || 0;

    const startVisits = (level.level - 1) * 10;
    const halfwayVisits = startVisits + 5;
    const cardCompletedVisits = level.level * 10;

    if (visits < startVisits) return 0;

    let stars = 0;
    // Star 1: Halfway mark on this card
    if (visits >= halfwayVisits) stars++;
    // Star 2: Completed full 10 visits on this card
    if (visits >= cardCompletedVisits) stars++;
    // Star 3: Points target
    if (points >= level.pointsRequired) stars++;

    // Current active level always has at least 1 star base if halfway or first check-in
    const currentLvl = this.calculateCurrentLevel(membership);
    if (level.level === currentLvl && stars === 0 && visits > startVisits) {
      stars = 1;
    }

    return Math.min(3, stars);
  }

  // Generate smooth cubic bezier SVG path connecting all level nodes from bottom to top
  generatePathSvg(nodeCoords) {
    if (!nodeCoords || nodeCoords.length < 2) return '';
    let d = `M ${nodeCoords[0].x} ${nodeCoords[0].y}`;

    for (let i = 0; i < nodeCoords.length - 1; i++) {
      const p1 = nodeCoords[i];
      const p2 = nodeCoords[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  // Render the Candy Crush Winding Road
  renderSagaMap({ compact = false } = {}) {
    const store = window.AtelierStore;
    const state = store ? store.getState() : {};
    const membership = state.membership || { lifetimeVisits: 27, currentStamps: 7, points: 420 };
    const currentLevelNum = this.calculateCurrentLevel(membership);
    const cardProgress = this.getCardProgress(membership);
    const user = state.user || { firstName: 'Coffee Explorer' };

    // Layout configuration
    const totalLevels = this.levels.length;
    const nodeSpacingY = compact ? 88 : 110;
    const svgWidth = 400;
    const paddingBottom = 70;
    const paddingTop = 70;
    const svgHeight = paddingTop + (totalLevels - 1) * nodeSpacingY + paddingBottom;

    // Calculate (x, y) coordinates for each level node from bottom (Level 1) to top (Level 10)
    const nodeCoords = [];
    for (let i = 0; i < totalLevels; i++) {
      const lvl = this.levels[i];
      const x = (lvl.xPercent / 100) * svgWidth;
      const y = svgHeight - paddingBottom - i * nodeSpacingY;
      nodeCoords.push({ x, y, level: lvl.level });
    }

    // Path segments:
    const fullPathD = this.generatePathSvg(nodeCoords);
    const completedCoords = nodeCoords.slice(0, currentLevelNum);
    const completedPathD = completedCoords.length >= 2 ? this.generatePathSvg(completedCoords) : '';

    // Render nodes HTML
    const nodesHtml = this.levels.map((lvl, idx) => {
      const coords = nodeCoords[idx];
      const isCompleted = lvl.level < currentLevelNum;
      const isCurrent = lvl.level === currentLevelNum;
      const isLocked = lvl.level > currentLevelNum;
      const starsEarned = this.calculateLevelStars(lvl, membership);

      // Star cluster HTML
      let starsHtml = '';
      if (isCompleted || (isCurrent && starsEarned > 0)) {
        starsHtml = `
          <div class="candy-stars-cluster" aria-label="${starsEarned} of 3 stars">
            <span class="candy-star ${starsEarned >= 1 ? 'earned' : ''}">★</span>
            <span class="candy-star center ${starsEarned >= 2 ? 'earned' : ''}">★</span>
            <span class="candy-star ${starsEarned >= 3 ? 'earned' : ''}">★</span>
          </div>
        `;
      }

      // Avatar Marker HTML on Current Level
      let avatarHtml = '';
      if (isCurrent) {
        avatarHtml = `
          <div class="candy-player-marker" title="${user.firstName}'s Current Level: Card #${cardProgress.currentCardNumber}">
            <div class="candy-player-avatar">
              <span class="avatar-face">☕</span>
              <div class="avatar-sparkle">✦</div>
            </div>
            <div class="candy-player-shadow"></div>
            <div class="candy-player-label">YOU</div>
          </div>
          <div class="candy-pulse-ring"></div>
          <div class="candy-pulse-ring delay"></div>
        `;
      }

      // Milestone or regular button content
      let nodeContent = '';
      if (lvl.milestone) {
        nodeContent = `<span class="milestone-icon">${lvl.level === 10 ? '🏆' : '🎁'}</span>`;
      } else if (isLocked) {
        nodeContent = `<span class="lock-icon">🔒</span><span class="lvl-num-sub">${lvl.level}</span>`;
      } else {
        nodeContent = `<span class="lvl-number">${lvl.level}</span>`;
      }

      const nodeClass = [
        'candy-level-node',
        isCompleted ? 'is-completed' : '',
        isCurrent ? 'is-current' : '',
        isLocked ? 'is-locked' : '',
        lvl.milestone ? 'is-milestone' : ''
      ].filter(Boolean).join(' ');

      return `
        <div class="${nodeClass}" 
             style="left: ${coords.x}px; top: ${coords.y}px;"
             data-level-num="${lvl.level}">
          ${starsHtml}
          ${avatarHtml}
          <button class="candy-node-btn" 
                  onclick="window.candyEngine.openLevelDetails(${lvl.level})"
                  title="Level ${lvl.level}: ${lvl.title} (Card #${lvl.cardCycle})"
                  aria-label="Level ${lvl.level}: ${lvl.title}">
            <div class="candy-btn-gloss"></div>
            <div class="candy-btn-inner">
              ${nodeContent}
            </div>
          </button>
          <div class="candy-node-caption">
            <span class="caption-title">${lvl.title}</span>
            <span class="caption-card-sub" style="font-size: 0.65rem; color: #C2B3A8; display: block;">Card #${lvl.cardCycle} (10 Visits)</span>
            ${lvl.milestone ? `<span class="caption-milestone">VAULT</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="candy-saga-viewport ${compact ? 'is-compact' : ''}">
        <!-- Header Banner -->
        <div class="candy-saga-header">
          <div class="candy-header-info">
            <div class="candy-eyebrow">
              <span class="candy-sparkle-dot"></span>
              <span>ATELIER ODYSSEY • 1 CARD (10 VISITS) = 1 LEVEL</span>
            </div>
            <h2 class="candy-saga-title">The Coffee Roaster's Path</h2>
            <p class="candy-saga-desc">
              Every 10 visits on your card advances you 1 level. Finish your card to unlock rare reserve vaults!
            </p>
          </div>

          <!-- Quick Stats Pill -->
          <div class="candy-stats-bar">
            <div class="candy-stat-badge">
              <span class="stat-icon">⭐</span>
              <span class="stat-val font-mono">${this.calculateTotalStars(membership)}</span>
              <span class="stat-lbl">Stars</span>
            </div>
            <div class="candy-stat-badge highlight">
              <span class="stat-icon">💳</span>
              <span class="stat-val font-mono">Card #${cardProgress.currentCardNumber}</span>
              <span class="stat-lbl">${cardProgress.stampsOnCurrentCard}/10 Stamps</span>
            </div>
            <div class="candy-stat-badge">
              <span class="stat-icon">🚩</span>
              <span class="stat-val font-mono">Lvl ${currentLevelNum}</span>
              <span class="stat-lbl">Active</span>
            </div>
          </div>
        </div>

        <!-- The Interactive Winding S-Curve Road -->
        <div class="candy-road-stage" style="height: ${svgHeight}px;">
          <!-- SVG Path Layer -->
          <svg class="candy-road-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="candyGoldenFlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#C89D4B" />
                <stop offset="50%" stop-color="#FFD43F" />
                <stop offset="100%" stop-color="#FF9E2C" />
              </linearGradient>
              <filter id="candyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <!-- 1. Background Shadow / Trench -->
            <path d="${fullPathD}" class="candy-svg-trench" />

            <!-- 2. Anticipation Path (Ahead) -->
            <path d="${fullPathD}" class="candy-svg-dashed-track" />

            <!-- 3. Unlocked Golden Glowing River -->
            ${completedPathD ? `
              <path d="${completedPathD}" class="candy-svg-completed-glow" />
              <path d="${completedPathD}" class="candy-svg-completed-fill" />
            ` : ''}
          </svg>

          <!-- 4. Level Nodes Layer -->
          <div class="candy-nodes-layer">
            ${nodesHtml}
          </div>
        </div>

        <!-- Saga Footer Action Banner -->
        <div class="candy-saga-footer">
          <div class="candy-footer-left">
            <span class="footer-icon">☕</span>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">
                Card #${cardProgress.currentCardNumber}: ${cardProgress.visitsLeftForNextLevel} stamps to Level ${Math.min(totalLevels, currentLevelNum + 1)}
              </div>
              <div style="font-size: 0.78rem; color: var(--color-roast-muted);">
                ${cardProgress.stampsOnCurrentCard} of 10 stamps collected on this card (${membership.lifetimeVisits || 0} lifetime visits)
              </div>
            </div>
          </div>
          <button class="btn-primary" onclick="window.candyEngine.openNextLevelAction()" style="padding: 0.55rem 1.2rem; font-size: 0.85rem;">
            <span>Stamp to Level Up →</span>
          </button>
        </div>
      </div>
    `;
  }

  // Calculate total stars earned across all levels
  calculateTotalStars(membership) {
    let total = 0;
    for (let i = 0; i < this.levels.length; i++) {
      total += this.calculateLevelStars(this.levels[i], membership);
    }
    return total;
  }

  // Open Stage Modal with Candy Crush styling
  openLevelDetails(levelNum) {
    if (window.AtelierAudio && window.AtelierAudio.playCandyClick) {
      window.AtelierAudio.playCandyClick();
    }

    const lvl = this.levels.find(l => l.level === levelNum);
    if (!lvl) return;

    const store = window.AtelierStore;
    const state = store ? store.getState() : {};
    const membership = state.membership || {};
    const currentLvl = this.calculateCurrentLevel(membership);
    const cardProgress = this.getCardProgress(membership);

    const isCompleted = lvl.level < currentLvl;
    const isCurrent = lvl.level === currentLvl;
    const isLocked = lvl.level > currentLvl;
    const starsEarned = this.calculateLevelStars(lvl, membership);

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop is-active" id="candy-stage-backdrop" onclick="window.candyEngine.closeModal(event)">
        <div class="candy-stage-card pop-bounce" onclick="event.stopPropagation()">
          
          <!-- Stage Top Ribbon -->
          <div class="candy-stage-ribbon">
            <span class="ribbon-tail left"></span>
            <span class="ribbon-content">
              ${isCompleted ? '✓ 10 VISITS COMPLETED' : isCurrent ? `★ ACTIVE: CARD #${lvl.cardCycle} (${cardProgress.stampsOnCurrentCard}/10)` : '🔒 STAGE LOCKED'}
            </span>
            <span class="ribbon-tail right"></span>
          </div>

          <!-- Close Cross -->
          <button class="candy-stage-close-btn" onclick="window.candyEngine.closeModal()">✕</button>

          <!-- Stage Head -->
          <div class="candy-stage-header">
            <div class="candy-stage-badge-sphere ${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}">
              <span>${lvl.icon}</span>
            </div>
            <div class="candy-stage-lvl-tag">LEVEL ${lvl.level} • CARD #${lvl.cardCycle}</div>
            <h3 class="candy-stage-title font-serif">${lvl.title}</h3>
            <p class="candy-stage-subtitle">${lvl.subtitle}</p>
          </div>

          <!-- Card Progress Meter on Active Stage -->
          ${isCurrent ? `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 0.8rem 1rem; margin-bottom: 1.2rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                <span style="color: var(--color-roast-muted);">Card #${lvl.cardCycle} Completion:</span>
                <span class="font-mono" style="font-weight: 700; color: var(--color-gold-foil);">${cardProgress.stampsOnCurrentCard} / 10 Stamps</span>
              </div>
              <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 999px; overflow: hidden;">
                <div style="width: ${Math.min(100, (cardProgress.stampsOnCurrentCard / 10) * 100)}%; height: 100%; background: linear-gradient(90deg, #FFB03A, #10B981); border-radius: 999px; transition: width 0.3s;"></div>
              </div>
              <div style="font-size: 0.72rem; color: #C2B3A8; margin-top: 0.35rem; text-align: center;">
                ${cardProgress.visitsLeftForNextLevel === 0 ? 'Card complete! Stamp to advance level.' : `Collect ${cardProgress.visitsLeftForNextLevel} more stamps on this card to advance to Level ${lvl.level + 1}!`}
              </div>
            </div>
          ` : ''}

          <!-- 3-Star Showcase -->
          <div class="candy-stage-stars-row">
            <div class="stage-star-slot ${starsEarned >= 1 ? 'earned' : ''}">
              <div class="star-glyph">★</div>
              <span class="star-label">Star 1 (5 Visits)</span>
            </div>
            <div class="stage-star-slot center ${starsEarned >= 2 ? 'earned' : ''}">
              <div class="star-glyph">★</div>
              <span class="star-label">Star 2 (Card Complete)</span>
            </div>
            <div class="stage-star-slot ${starsEarned >= 3 ? 'earned' : ''}">
              <div class="star-glyph">★</div>
              <span class="star-label">Star 3 (Points)</span>
            </div>
          </div>

          <!-- Objectives Box -->
          <div class="candy-objectives-box">
            <div class="obj-header">LEVEL ADVANCEMENT OBJECTIVES</div>
            <ul class="obj-list">
              ${lvl.stars.map((s, idx) => `
                <li class="obj-item ${idx < starsEarned ? 'done' : ''}">
                  <span class="obj-check">${idx < starsEarned ? '✓' : '○'}</span>
                  <span>${s.label}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Reward Spotlight -->
          <div class="candy-stage-reward-banner">
            <div class="reward-icon-disc">${lvl.rewardIcon}</div>
            <div>
              <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-gold-foil); font-weight: 600; letter-spacing: 0.08em;">
                ${lvl.milestone ? 'SPECIAL VAULT REWARD' : 'LEVEL UNLOCK PERK'}
              </div>
              <div style="font-size: 0.95rem; font-weight: 600; color: var(--color-espresso);">${lvl.reward}</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="candy-stage-actions">
            ${isCurrent ? `
              <button class="candy-squish-btn btn-primary" onclick="window.candyEngine.claimCurrentStamp(${lvl.level})">
                <span>Collect Stamp (+1 toward Level ${lvl.level + 1}) ☕</span>
              </button>
            ` : isCompleted ? `
              <button class="candy-squish-btn btn-secondary" onclick="window.candyEngine.replayCelebration(${lvl.level})">
                <span>View Level Ceremony 🎉</span>
              </button>
            ` : `
              <div class="candy-locked-notice">
                <span>Complete all 10 visits on Card #${lvl.level - 1} to unlock Level ${lvl.level}.</span>
              </div>
              <button class="candy-squish-btn btn-secondary" onclick="window.candyEngine.closeModal()">
                <span>Back to Map</span>
              </button>
            `}
          </div>

        </div>
      </div>
    `;
  }

  // Trigger Juicy Candy Crush Celebration (Sweet! Divine! Level Up!)
  triggerLevelUpCelebration(levelNum) {
    const lvl = this.levels.find(l => l.level === levelNum) || this.levels[0];
    const adjectives = ["CARD COMPLETED!", "SWEET!", "TASTY!", "DIVINE!", "10 VISITS COMPLETE!"];
    const exclamation = adjectives[(levelNum - 1) % adjectives.length];

    // 1. Web Audio fanfare
    if (window.AtelierAudio) {
      if (window.AtelierAudio.playCandyFanfare) {
        window.AtelierAudio.playCandyFanfare();
      } else if (window.AtelierAudio.playRewardUnlock) {
        window.AtelierAudio.playRewardUnlock();
      }
    }

    // 2. Confetti Particles blast
    if (window.launchAtelierCelebration) {
      window.launchAtelierCelebration();
    }

    // 3. Play Staggered Star Slam Sounds
    setTimeout(() => { if (window.AtelierAudio && window.AtelierAudio.playStarSlam) window.AtelierAudio.playStarSlam(1); }, 300);
    setTimeout(() => { if (window.AtelierAudio && window.AtelierAudio.playStarSlam) window.AtelierAudio.playStarSlam(2); }, 650);
    setTimeout(() => { if (window.AtelierAudio && window.AtelierAudio.playStarSlam) window.AtelierAudio.playStarSlam(3); }, 1000);

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;

    modalRoot.innerHTML = `
      <div class="modal-backdrop is-active candy-celebration-backdrop" id="candy-celebrate-backdrop">
        
        <!-- Floating Ambient Sparkles -->
        <div class="candy-floating-sparkles" aria-hidden="true">
          <span class="sparkle s1">✨</span>
          <span class="sparkle s2">☕</span>
          <span class="sparkle s3">⭐</span>
          <span class="sparkle s4">🥐</span>
          <span class="sparkle s5">✨</span>
        </div>

        <div class="candy-celebrate-card pop-bounce">
          
          <!-- Golden Ray Sunburst Background -->
          <div class="candy-sunburst-rays"></div>

          <!-- Big Candy Ribbon -->
          <div class="candy-celebrate-ribbon">
            <span class="candy-ribbon-text">${exclamation}</span>
          </div>

          <div class="candy-celebrate-badge">
            <span class="badge-icon">${lvl.icon}</span>
          </div>

          <div class="candy-celebrate-heading">
            <span class="eyebrow" style="color: var(--color-gold-foil); font-weight: 700;">10 VISITS COMPLETE • LEVEL ${lvl.level} UNLOCKED!</span>
            <h2 class="font-serif" style="font-size: 2.1rem; color: #FFF; margin: 4px 0;">${lvl.title}</h2>
            <p style="font-size: 0.85rem; color: #E0D3C9; margin-top: 2px;">You've completed your card and unlocked Card #${lvl.cardCycle}!</p>
          </div>

          <!-- Staggered 3-Star Slam In -->
          <div class="candy-slam-stars-container">
            <div class="candy-slam-star slam-1">
              <div class="star-shape">★</div>
              <div class="star-impact-dust"></div>
            </div>
            <div class="candy-slam-star slam-2 big">
              <div class="star-shape">★</div>
              <div class="star-impact-dust"></div>
            </div>
            <div class="candy-slam-star slam-3">
              <div class="star-shape">★</div>
              <div class="star-impact-dust"></div>
            </div>
          </div>

          <!-- Reward Unlocked Box -->
          <div class="candy-celebrate-reward-box">
            <div class="reward-sparkle-tag">✦ UNLOCKED CARD PRIVILEGE ✦</div>
            <div class="reward-title">${lvl.reward}</div>
            <div class="reward-desc">Credited to your Atelier digital pass and member ledger.</div>
          </div>

          <!-- CTA Button -->
          <button class="candy-squish-btn btn-primary candy-btn-epic" onclick="window.candyEngine.closeModal()">
            <span>START CARD #${Math.min(10, lvl.cardCycle + 1)} ➔</span>
          </button>

        </div>
      </div>
    `;
  }

  // Quick actions
  claimCurrentStamp(levelNum) {
    if (window.AtelierStore) {
      window.AtelierStore.addStamp('Chikmagalur Pour Over & Roast');
    }
    this.closeModal();
  }

  replayCelebration(levelNum) {
    this.closeModal();
    setTimeout(() => {
      this.triggerLevelUpCelebration(levelNum);
    }, 150);
  }

  openNextLevelAction() {
    const store = window.AtelierStore;
    const state = store ? store.getState() : {};
    const membership = state.membership || {};
    const currentLvl = this.calculateCurrentLevel(membership);
    this.openLevelDetails(currentLvl);
  }

  closeModal(e) {
    if (e && e.target && e.target.id !== 'candy-stage-backdrop' && e.target.id !== 'candy-celebrate-backdrop') {
      return;
    }
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.innerHTML = '';
    }
  }
}

// Global Singleton
window.candyEngine = new CandyLevelsEngine();

// Standalone dedicated page renderer for #levels
function renderCandyLevelsPage() {
  return `
    <div class="candy-levels-page-root" style="padding: 2rem 0 5rem;">
      <div class="container container-narrow">
        ${window.candyEngine.renderSagaMap({ compact: false })}
      </div>
    </div>
  `;
}

function initCandyLevelsEvents() {
  // Re-scroll active node smoothly into view if on levels page
  setTimeout(() => {
    const currentMarker = document.querySelector('.candy-level-node.is-current');
    if (currentMarker) {
      currentMarker.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 120);
}

// Global hooks
window.renderCandyLevelsPage = renderCandyLevelsPage;
window.initCandyLevelsEvents = initCandyLevelsEvents;
