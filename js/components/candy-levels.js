/* ==========================================================================
   ATELIER CANDY CRUSH SAGA LEVELS & JUICY ANIMATION ENGINE
   Progression Rule: 500 Points = Advance 1 Level (Points converted from Cafe Bills)
   Winding Bézier Road, 3D Candy Gem Nodes, Bobbing Avatar, Star Slams,
   and Web Audio Celebration Fanfare
   ========================================================================== */

const ATELIER_CANDY_LEVELS = [
  {
    level: 1,
    title: "First Sip Initiate",
    subtitle: "Earn 500 points from café bills to advance to Level 2",
    pointsRequired: 0,
    pointsToPass: 500,
    reward: "Welcome 50 Bonus Points & Level 2 Status",
    rewardIcon: "✨",
    icon: "☕",
    stars: [
      { id: 1, label: "Earn 250 points in Level 1 (0-500 pts)", earned: true },
      { id: 2, label: "Reach 500 points to unlock Level 2", earned: false },
      { id: 3, label: "Maintain a 3-day coffee visit streak", earned: true }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 2,
    title: "Crema Apprentice",
    subtitle: "Earn 1,000 points (500 pts in this tier) to advance to Level 3",
    pointsRequired: 500,
    pointsToPass: 1000,
    reward: "Free Vanilla, Hazelnut or Cardamom Shot",
    rewardIcon: "🥛",
    icon: "☕",
    stars: [
      { id: 1, label: "Earn 750 points (250 pts into Level 2)", earned: false },
      { id: 2, label: "Reach 1,000 points to unlock Level 3", earned: false },
      { id: 3, label: "Try Oatly Barista or A2 desi milk", earned: false }
    ],
    xPercent: 78,
    milestone: false
  },
  {
    level: 3,
    title: "Roastery Regular",
    subtitle: "Earn 1,500 points (500 pts in this tier) to advance to Level 4",
    pointsRequired: 1000,
    pointsToPass: 1500,
    reward: "15% Off Any Hand-Laminated Brioche",
    rewardIcon: "🥐",
    icon: "☕",
    stars: [
      { id: 1, label: "Earn 1,250 points (250 pts into Level 3)", earned: false },
      { id: 2, label: "Reach 1,500 points to unlock Level 4", earned: false },
      { id: 3, label: "Maintain a 3-day coffee visit streak", earned: false }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 4,
    title: "Pour-Over Explorer",
    subtitle: "Earn 2,000 points (500 pts in this tier) to advance to Level 5",
    pointsRequired: 1500,
    pointsToPass: 2000,
    reward: "Complimentary V60 Brew Bar Upgrade",
    rewardIcon: "🧪",
    icon: "🧪",
    stars: [
      { id: 1, label: "Earn 1,750 points (250 pts into Level 4)", earned: false },
      { id: 2, label: "Reach 2,000 points to unlock Level 5", earned: false },
      { id: 3, label: "Sample Baba Budangiri harvest", earned: false }
    ],
    xPercent: 22,
    milestone: false
  },
  {
    level: 5,
    title: "Bronze Cupper Vault",
    subtitle: "Milestone: 2,000 Points! Roastery Vault Unlocked (500 pts to Lvl 6)",
    pointsRequired: 2000,
    pointsToPass: 2500,
    reward: "🎁 Custom Ceramic & Brass Mug + 100 Bonus Pts",
    rewardIcon: "🎁",
    icon: "🎁",
    stars: [
      { id: 1, label: "Earn 2,250 points (250 pts into Level 5)", earned: false },
      { id: 2, label: "Reach 2,500 points to unlock Level 6", earned: false },
      { id: 3, label: "Redeem any seasonal reward pass", earned: false }
    ],
    xPercent: 50,
    milestone: true
  },
  {
    level: 6,
    title: "Cold Drip Alchemist",
    subtitle: "Earn 3,000 points (500 pts in this tier) to advance to Level 7",
    pointsRequired: 2500,
    pointsToPass: 3000,
    reward: "Complimentary Chilled Nitro Cold Brew",
    rewardIcon: "🧊",
    icon: "🧊",
    stars: [
      { id: 1, label: "Earn 2,750 points (250 pts into Level 6)", earned: false },
      { id: 2, label: "Reach 3,000 points to unlock Level 7", earned: false },
      { id: 3, label: "Order an Araku Valley cold drip", earned: false }
    ],
    xPercent: 78,
    milestone: false
  },
  {
    level: 7,
    title: "Artisan Kaapi Master",
    subtitle: "Earn 3,500 points (500 pts in this tier) to advance to Level 8",
    pointsRequired: 3000,
    pointsToPass: 3500,
    reward: "Free Artisanal Davara Kaapi & Sweet Bun",
    rewardIcon: "🏺",
    icon: "🏺",
    stars: [
      { id: 1, label: "Earn 3,250 points (250 pts into Level 7)", earned: false },
      { id: 2, label: "Reach 3,500 points to unlock Level 8", earned: false },
      { id: 3, label: "Order traditional brass dabara Kaapi", earned: false }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 8,
    title: "Micro-Lot Connoisseur",
    subtitle: "Earn 4,000 points (500 pts in this tier) to advance to Level 9",
    pointsRequired: 3500,
    pointsToPass: 4000,
    reward: "Free 250g Araku Valley Whole-Bean Bag",
    rewardIcon: "🫘",
    icon: "🫘",
    stars: [
      { id: 1, label: "Earn 3,750 points (250 pts into Level 8)", earned: false },
      { id: 2, label: "Reach 4,000 points to unlock Level 9", earned: false },
      { id: 3, label: "Sample 4 different roast origins", earned: false }
    ],
    xPercent: 22,
    milestone: false
  },
  {
    level: 9,
    title: "Western Ghats Pioneer",
    subtitle: "Earn 4,500 points (500 pts in this tier) to advance to Level 10",
    pointsRequired: 4000,
    pointsToPass: 4500,
    reward: "VIP Cupping Masterclass for Two",
    rewardIcon: "✨",
    icon: "✨",
    stars: [
      { id: 1, label: "Earn 4,250 points (250 pts into Level 9)", earned: false },
      { id: 2, label: "Reach 4,500 points to unlock Level 10", earned: false },
      { id: 3, label: "5-week uninterrupted visit streak", earned: false }
    ],
    xPercent: 50,
    milestone: false
  },
  {
    level: 10,
    title: "Legend of Atelier",
    subtitle: "Grand Summit: 5,000 Lifetime Points Master Roaster",
    pointsRequired: 4500,
    pointsToPass: 5000,
    reward: "🏆 Permanent Gold Founder Badge & Engraved Brass Flask",
    rewardIcon: "🏆",
    icon: "🏆",
    stars: [
      { id: 1, label: "Earn 4,750 points (250 pts into Level 10)", earned: false },
      { id: 2, label: "Reach 5,000 Lifetime Points summit", earned: false },
      { id: 3, label: "Accumulate 5,000 lifetime points", earned: false }
    ],
    xPercent: 50,
    milestone: true
  }
];

class CandyLevelsEngine {
  constructor() {
    this.levels = ATELIER_CANDY_LEVELS;
  }

  // CORE RULE: Each level has a difference of 500 points!
  // Points 0-499   -> Level 1
  // Points 500-999 -> Level 2
  // Points 1000-1499 -> Level 3
  // Points 1500-1999 -> Level 4
  // ...
  calculateCurrentLevel(membership) {
    const points = membership ? (membership.points || 0) : 0;
    const level = Math.floor(points / 500) + 1;
    return Math.min(this.levels.length, Math.max(1, level));
  }

  // Get exact level progression: current level, points in current level (0-500), and points left to level up
  getLevelProgress(membership) {
    const points = membership ? (membership.points || 0) : 0;
    const currentLevel = this.calculateCurrentLevel(membership);
    const minPointsForLevel = (currentLevel - 1) * 500;
    const maxPointsForLevel = currentLevel * 500;
    const pointsInCurrentLevel = Math.max(0, points - minPointsForLevel);
    const pointsLeftForNextLevel = currentLevel >= this.levels.length 
      ? 0 
      : Math.max(0, maxPointsForLevel - points);
    const progressPercent = currentLevel >= this.levels.length
      ? 100
      : Math.min(100, Math.round((pointsInCurrentLevel / 500) * 100));

    return {
      currentLevel,
      points,
      minPointsForLevel,
      maxPointsForLevel,
      pointsInCurrentLevel,
      pointsLeftForNextLevel,
      progressPercent
    };
  }

  // Backward compatibility wrapper for getCardProgress
  getCardProgress(membership) {
    const prog = this.getLevelProgress(membership);
    return {
      completedCards: prog.currentLevel - 1,
      currentCardNumber: prog.currentLevel,
      stampsOnCurrentCard: Math.min(10, Math.floor(prog.pointsInCurrentLevel / 50)),
      visitsLeftForNextLevel: prog.pointsLeftForNextLevel,
      pointsInCurrentLevel: prog.pointsInCurrentLevel,
      pointsLeftForNextLevel: prog.pointsLeftForNextLevel
    };
  }

  // Calculate stars earned for a level given current state
  // Star 1: Halfway through level (250 pts earned in this tier)
  // Star 2: Full 500 points achieved for this tier
  // Star 3: Tier bonus / mastery milestone
  calculateLevelStars(level, membership) {
    const points = membership ? (membership.points || 0) : 0;
    const minPoints = (level.level - 1) * 500;
    const halfwayPoints = minPoints + 250;
    const fullLevelPoints = level.level * 500;

    if (points < minPoints) return 0;

    let stars = 0;
    // Star 1: Halfway (250 pts earned in tier)
    if (points >= halfwayPoints) stars++;
    // Star 2: Full 500 pts completed for this tier
    if (points >= fullLevelPoints) stars++;
    // Star 3: Full level passed
    if (points >= fullLevelPoints) {
      stars++;
    } else if (level.stars && level.stars[2] && level.stars[2].earned) {
      stars++;
    }

    // Active level gets 1 star if past 200 points
    const currentLvl = this.calculateCurrentLevel(membership);
    if (level.level === currentLvl && stars === 0 && points >= minPoints + 200) {
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
    const levelProgress = this.getLevelProgress(membership);
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
          <div class="candy-player-marker" title="${user.firstName}'s Current Level: Level ${currentLevelNum} (${membership.points || 0} Pts)">
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
             style="left: ${lvl.xPercent}%; top: ${coords.y}px;"
             data-level-num="${lvl.level}">
          ${starsHtml}
          ${avatarHtml}
          <button class="candy-node-btn" 
                  onclick="window.candyEngine.openLevelDetails(${lvl.level})"
                  title="Level ${lvl.level}: ${lvl.title} (${lvl.pointsRequired} - ${lvl.pointsToPass} Pts)"
                  aria-label="Level ${lvl.level}: ${lvl.title}">
            <div class="candy-btn-gloss"></div>
            <div class="candy-btn-inner">
              ${nodeContent}
            </div>
          </button>
          <div class="candy-node-caption">
            <span class="caption-title">${lvl.title}</span>
            <span class="caption-card-sub" style="font-size: 0.65rem; color: #C2B3A8; display: block;">${lvl.pointsRequired} - ${lvl.pointsToPass} Pts</span>
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
              <span>500 POINTS = 1 LEVEL</span>
            </div>
            <h2 class="candy-saga-title">Roaster's Path</h2>
            <p class="candy-saga-desc">
              Advance 1 level every 500 points earned from café bills.
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
              <span class="stat-icon">💎</span>
              <span class="stat-val font-mono">${membership.points || 0} Pts</span>
              <span class="stat-lbl">${levelProgress.pointsInCurrentLevel}/500 in Lvl ${currentLevelNum}</span>
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
            <span class="footer-icon">💎</span>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">
                Level ${currentLevelNum}: ${levelProgress.pointsLeftForNextLevel} pts to Level ${Math.min(totalLevels, currentLevelNum + 1)}
              </div>
              <div style="font-size: 0.78rem; color: var(--color-roast-muted);">
                ${levelProgress.pointsInCurrentLevel} / 500 points in Level ${currentLevelNum} (${membership.points || 0} total points)
              </div>
            </div>
          </div>
          <button class="btn-primary" onclick="window.candyEngine.openNextLevelAction()" style="padding: 0.55rem 1.2rem; font-size: 0.85rem;">
            <span>Add Bill / Stamp Card →</span>
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
    const levelProgress = this.getLevelProgress(membership);

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
              ${isCompleted ? '✓ COMPLETED' : isCurrent ? `★ ACTIVE: LEVEL ${lvl.level}` : '🔒 LOCKED'}
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
            <div class="candy-stage-lvl-tag">LEVEL ${lvl.level} • ${lvl.pointsRequired} - ${lvl.pointsToPass} POINTS</div>
            <h3 class="candy-stage-title font-serif">${lvl.title}</h3>
            <p class="candy-stage-subtitle">500 Points Tier • ${lvl.pointsToPass} Total Points Required</p>
          </div>

          <!-- Points Progress Meter on Active Stage -->
          ${isCurrent ? `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 0.8rem 1rem; margin-bottom: 1.2rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
                <span style="color: var(--color-roast-muted);">Level ${lvl.level} Progression:</span>
                <span class="font-mono" style="font-weight: 700; color: var(--color-gold-foil);">${levelProgress.pointsInCurrentLevel} / 500 Points</span>
              </div>
              <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 999px; overflow: hidden;">
                <div style="width: ${levelProgress.progressPercent}%; height: 100%; background: linear-gradient(90deg, #FFB03A, #10B981); border-radius: 999px; transition: width 0.3s;"></div>
              </div>
              <div style="font-size: 0.72rem; color: #C2B3A8; margin-top: 0.35rem; text-align: center;">
                ${levelProgress.pointsLeftForNextLevel === 0 ? 'Tier complete! Level up unlocked.' : `Earn ${levelProgress.pointsLeftForNextLevel} more points from café bills to advance to Level ${lvl.level + 1} (500 pts difference)!`}
              </div>
            </div>
          ` : ''}

          <!-- 3-Star Showcase -->
          <div class="candy-stage-stars-row">
            <div class="stage-star-slot ${starsEarned >= 1 ? 'earned' : ''}">
              <div class="star-glyph">★</div>
              <span class="star-label">Star 1 (250 Pts in Tier)</span>
            </div>
            <div class="stage-star-slot center ${starsEarned >= 2 ? 'earned' : ''}">
              <div class="star-glyph">★</div>
              <span class="star-label">Star 2 (500 Pts / Lvl Up)</span>
            </div>
            <div class="stage-star-slot ${starsEarned >= 3 ? 'earned' : ''}">
              <div class="star-glyph">★</div>
              <span class="star-label">Star 3 (Mastery)</span>
            </div>
          </div>

          <!-- Objectives Box -->
          <div class="candy-objectives-box">
            <div class="obj-header">LEVEL ADVANCEMENT OBJECTIVES (500 PTS TIER)</div>
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
                <span>Enter Bill & Stamp Card ☕</span>
              </button>
            ` : isCompleted ? `
              <button class="candy-squish-btn btn-secondary" onclick="window.candyEngine.replayCelebration(${lvl.level})">
                <span>View Level Ceremony 🎉</span>
              </button>
            ` : `
              <div class="candy-locked-notice">
                <span>Reach ${lvl.pointsRequired} points from cafe bills to unlock Level ${lvl.level}.</span>
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
    const adjectives = ["500 POINTS REACHED!", "SWEET!", "TASTY!", "DIVINE!", "LEVEL UNLOCKED!"];
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
            <span class="eyebrow" style="color: var(--color-gold-foil); font-weight: 700;">500 POINTS REACHED • LEVEL ${lvl.level} UNLOCKED!</span>
            <h2 class="font-serif" style="font-size: 2.1rem; color: #FFF; margin: 4px 0;">${lvl.title}</h2>
            <p style="font-size: 0.85rem; color: #E0D3C9; margin-top: 2px;">You've accumulated ${lvl.pointsRequired}+ points and unlocked the next Roaster tier!</p>
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
            <div class="reward-sparkle-tag">✦ UNLOCKED LEVEL PRIVILEGE ✦</div>
            <div class="reward-title">${lvl.reward}</div>
            <div class="reward-desc">Credited to your Atelier digital pass and member ledger.</div>
          </div>

          <!-- CTA Button -->
          <button class="candy-squish-btn btn-primary candy-btn-epic" onclick="window.candyEngine.closeModal()">
            <span>CONTINUE SAGA JOURNEY ➔</span>
          </button>

        </div>
      </div>
    `;
  }

  // Quick actions
  claimCurrentStamp(levelNum) {
    this.closeModal();
    if (window.openOwnerStampModal) {
      window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
    } else if (window.AtelierStore) {
      window.AtelierStore.addStamp('Chikmagalur Single-Estate Pour Over');
    }
  }

  replayCelebration(levelNum) {
    this.closeModal();
    setTimeout(() => {
      this.triggerLevelUpCelebration(levelNum);
    }, 150);
  }

  openNextLevelAction() {
    if (window.openOwnerStampModal) {
      window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
    } else {
      const store = window.AtelierStore;
      const state = store ? store.getState() : {};
      const membership = state.membership || {};
      const currentLvl = this.calculateCurrentLevel(membership);
      this.openLevelDetails(currentLvl);
    }
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
