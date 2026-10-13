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

  // Mathematical Cubic Bézier Point Evaluation B(t)
  getCubicBezierPoint(t, p0, c1, c2, p3) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: mt3 * p0.x + 3 * mt2 * t * c1.x + 3 * mt * t2 * c2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * c1.y + 3 * mt * t2 * c2.y + t3 * p3.y
    };
  }

  // Mathematical Cubic Bézier Tangent Derivative B'(t) to determine walking direction
  getCubicBezierTangent(t, p0, c1, c2, p3) {
    const mt = 1 - t;
    return {
      dx: 3 * mt * mt * (c1.x - p0.x) + 6 * mt * t * (c2.x - c1.x) + 3 * t * t * (p3.x - c2.x),
      dy: 3 * mt * mt * (c1.y - p0.y) + 6 * mt * t * (c2.y - c1.y) + 3 * t * t * (p3.y - c2.y)
    };
  }

  // Split cubic bezier at parameter t using de Casteljau's algorithm
  getCubicBezierSubsegment(p0, c1, c2, p3, t) {
    if (t <= 0.002) return null;
    const q1 = { x: (1 - t) * p0.x + t * c1.x, y: (1 - t) * p0.y + t * c1.y };
    const q12 = { x: (1 - t) * c1.x + t * c2.x, y: (1 - t) * c1.y + t * c2.y };
    const q2 = { x: (1 - t) * q1.x + t * q12.x, y: (1 - t) * q1.y + t * q12.y };
    const pt = this.getCubicBezierPoint(t, p0, c1, c2, p3);
    return { q1, q2, pt };
  }

  // Continuous Road Character Interpolation:
  // Waypoints:
  // [0]: Roastery Gates (0 Pts)
  // [1]: Level 1 Node (500 Pts)
  // [2]: Level 2 Node (1,000 Pts)
  // ...
  // [10]: Level 10 Node (5,000 Pts)
  // Segment 1 connects Level 1 (500 Pts) and Level 2 (1,000 Pts).
  // At 750 points, segmentIndex = 1, t = (750 - 500) / 500 = 0.5 (exactly halfway between Level 1 and 2)!
  getCharacterRoadPosition(points, waypoints, svgWidth) {
    const pts = Math.max(0, points || 0);
    const maxTrackPoints = (waypoints.length - 1) * 500; // 5000 pts
    const clampedPts = Math.min(maxTrackPoints, pts);

    const segmentIndex = Math.min(waypoints.length - 2, Math.floor(clampedPts / 500));
    const segmentPts = clampedPts - segmentIndex * 500;
    const segmentRatio = Math.max(0, Math.min(1.0, segmentPts / 500));

    // Spacious non-overlapping travel along the road curve:
    // Character travels smoothly between checkpoints (t: 0.20 to 0.58),
    // guaranteeing wide breathing margins from both origin and destination nodes.
    const t = clampedPts >= maxTrackPoints
      ? 1.0
      : 0.20 + segmentRatio * (0.58 - 0.20);

    const p0 = waypoints[segmentIndex];
    const p3 = waypoints[segmentIndex + 1];
    const midY = (p0.y + p3.y) / 2;
    const c1 = { x: p0.x, y: midY };
    const c2 = { x: p3.x, y: midY };

    const pt = this.getCubicBezierPoint(t, p0, c1, c2, p3);
    const tangent = this.getCubicBezierTangent(t, p0, c1, c2, p3);
    const isFacingRight = tangent.dx >= 0;

    const fromLevelNum = segmentIndex;
    const toLevelNum = segmentIndex + 1;
    const pointsLeft = Math.max(0, 500 - segmentPts);

    return {
      x: pt.x,
      y: pt.y,
      xPercent: (pt.x / svgWidth) * 100,
      segmentIndex,
      t,
      isFacingRight,
      fromLevelNum,
      toLevelNum,
      pointsLeft,
      segmentPts
    };
  }

  // Generate smooth cubic bezier SVG path connecting waypoints from bottom to top
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

  // Generate glowing river path starting at Roastery Gates and terminating precisely at the character's feet
  generateProgressPathSvg(waypoints, charPos) {
    if (!waypoints || waypoints.length < 2) return '';
    const { segmentIndex, t } = charPos;
    let d = `M ${waypoints[0].x} ${waypoints[0].y}`;

    // 1. Fully traversed complete segments
    for (let i = 0; i < segmentIndex; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }

    // 2. Active subsegment up to character t
    if (t > 0.005) {
      const p0 = waypoints[segmentIndex];
      const p3 = waypoints[segmentIndex + 1];
      const midY = (p0.y + p3.y) / 2;
      const c1 = { x: p0.x, y: midY };
      const c2 = { x: p3.x, y: midY };
      const sub = this.getCubicBezierSubsegment(p0, c1, c2, p3, t);
      if (sub) {
        d += ` C ${sub.q1.x} ${sub.q1.y}, ${sub.q2.x} ${sub.q2.y}, ${sub.pt.x} ${sub.pt.y}`;
      }
    }

    return d;
  }

  // Render the Candy Crush Winding Road with Interactive Character Avatar
  renderSagaMap({ compact = false, currentPoints = null, hideHeader = false } = {}) {
    const store = window.AtelierStore;
    const state = store ? store.getState() : {};
    const membership = state.membership || { lifetimeVisits: 27, currentStamps: 7, points: 420 };
    const points = currentPoints !== null && currentPoints !== undefined ? Number(currentPoints) : (membership ? (membership.points || 0) : 0);
    const activeMembership = { ...membership, points };
    const currentLevelNum = this.calculateCurrentLevel(activeMembership);
    const levelProgress = this.getLevelProgress(activeMembership);
    const user = state.user || { firstName: 'Coffee Explorer' };

    // Layout configuration - Generous vertical spacing for spatial breathing room
    const totalLevels = this.levels.length; // 10 levels
    const nodeSpacingY = compact ? 180 : 210;
    const svgWidth = 400;
    const paddingTop = 90;
    const paddingBottom = compact ? 260 : 295;
    const svgHeight = paddingTop + (totalLevels - 1) * nodeSpacingY + paddingBottom;

    // 1. Calculate (x, y) coordinates for Level Nodes (Level 1 to Level 10)
    const nodeCoords = [];
    for (let i = 0; i < totalLevels; i++) {
      const lvl = this.levels[i];
      const x = (lvl.xPercent / 100) * svgWidth;
      const y = svgHeight - paddingBottom - i * nodeSpacingY;
      nodeCoords.push({ x, y, level: lvl.level, xPercent: lvl.xPercent });
    }

    // 2. Roastery Gates (WayPoint 0: 0 Points threshold)
    const startCoord = {
      x: (38 / 100) * svgWidth,
      y: svgHeight - 65,
      level: 0,
      xPercent: 38
    };

    // 3. Combined Waypoints for Continuous Road (Indices 0 through 10)
    const waypoints = [startCoord, ...nodeCoords];

    // 4. Calculate Character Continuous Position along Winding Curve
    const charPos = this.getCharacterRoadPosition(points, waypoints, svgWidth);

    // 5. Generate Road Paths
    const fullPathD = this.generatePathSvg(waypoints);
    const completedPathD = this.generateProgressPathSvg(waypoints, charPos);

    // Contextual status text for character speech pill
    let charStatusText = '';
    if (points >= 5000) {
      charStatusText = 'Grand Master Roaster Summit 🏆';
    } else if (charPos.segmentPts === 0 && charPos.segmentIndex > 0) {
      charStatusText = `Level ${charPos.segmentIndex} Achieved! 🎉`;
    } else if (charPos.t >= 0.45 && charPos.t <= 0.55) {
      charStatusText = charPos.segmentIndex === 0
        ? `Midway to Level 1 (${charPos.pointsLeft} pts left)`
        : `Midway to Level ${charPos.toLevelNum} (${charPos.pointsLeft} pts left)`;
    } else if (charPos.segmentIndex === 0) {
      charStatusText = `${charPos.pointsLeft} pts to Level 1`;
    } else {
      charStatusText = `${charPos.pointsLeft} pts to Level ${charPos.toLevelNum}`;
    }

    // Render nodes HTML
    const nodesHtml = this.levels.map((lvl, idx) => {
      const coords = nodeCoords[idx];
      const isCompleted = points >= lvl.pointsToPass;
      const isCurrent = lvl.level === currentLevelNum;
      const isLocked = lvl.level > currentLevelNum;
      const starsEarned = this.calculateLevelStars(lvl, activeMembership);

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

      // Active Target Node Destination Pulse (Only show TARGET badge if no stars earned yet to prevent collision)
      let targetBeaconHtml = '';
      if (isCurrent) {
        targetBeaconHtml = `
          <div class="candy-pulse-ring"></div>
          <div class="candy-pulse-ring delay"></div>
          ${starsEarned === 0 ? `
            <div class="candy-destination-flag" title="Active Target: Level ${lvl.level}">
              <span>TARGET</span>
            </div>
          ` : ''}
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

      // Side placement for node caption to ensure 100% road and mascot clearance
      const captionSide = lvl.xPercent > 55
        ? 'side-left'
        : lvl.xPercent < 45
          ? 'side-right'
          : (idx % 2 === 0 ? 'side-left' : 'side-right');

      return `
        <div class="${nodeClass}" 
             style="left: ${lvl.xPercent}%; top: ${coords.y}px;"
             data-level-num="${lvl.level}">
          ${starsHtml}
          ${targetBeaconHtml}
          <button class="candy-node-btn" 
                  onclick="window.candyEngine.openLevelDetails(${lvl.level})"
                  title="Level ${lvl.level}: ${lvl.title} (${lvl.pointsToPass} Pts Target)"
                  aria-label="Level ${lvl.level}: ${lvl.title}">
            <div class="candy-btn-gloss"></div>
            <div class="candy-btn-inner">
              ${nodeContent}
            </div>
          </button>
          <div class="candy-node-caption ${captionSide}">
            <span class="caption-title">${lvl.title}</span>
            <span class="caption-card-sub">${lvl.pointsToPass} Pts Target</span>
            ${lvl.milestone ? `<span class="caption-milestone">VAULT</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Roastery Gates HTML (Start at 0 Pts)
    const startGateHtml = `
      <div class="candy-start-gate" style="left: ${startCoord.xPercent}%; top: ${startCoord.y}px;" title="Roastery Entrance • 0 Pts Start">
        <div class="start-gate-badge">
          <span class="start-icon">🚪</span>
          <div class="start-text-col">
            <span class="start-title">ROASTERY GATES</span>
            <span class="start-pts font-mono">0 PTS</span>
          </div>
        </div>
      </div>
    `;

    // Dynamic Character Avatar Mascot along the Road
    const characterHtml = `
      <div class="candy-character-container ${charPos.isFacingRight ? 'facing-right' : 'facing-left'}" 
           style="left: ${charPos.xPercent}%; top: ${charPos.y}px;"
           onclick="window.candyEngine.characterTap(event)"
           title="${user.firstName} • ${points} Points (Tap for Barista Cheer!)">
        
        <!-- Ground Footstep Energy & Shadow -->
        <div class="candy-char-ground-pulse"></div>
        <div class="candy-char-shadow"></div>

        <!-- Floating Status Callout (Compact Sleek Badge) -->
        <div class="candy-char-callout">
          <div class="char-unified-pill">
            <span class="char-avatar-dot">☕</span>
            <span class="char-name-bold">${user.firstName || 'Explorer'}</span>
            <span class="char-pill-divider">•</span>
            <span class="char-pts-bold font-mono">${points} Pts</span>
          </div>
        </div>

        <!-- Animated Character Mascot Figure -->
        <div class="candy-char-figure">
          <div class="candy-char-aura"></div>
          
          <svg class="candy-char-svg" viewBox="0 0 60 74" width="44" height="56" aria-label="Atelier Barista Character">
            <defs>
              <linearGradient id="charApronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3A2C27" />
                <stop offset="100%" stop-color="#211713" />
              </linearGradient>
              <linearGradient id="charGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE885" />
                <stop offset="100%" stop-color="#D4AF37" />
              </linearGradient>
              <linearGradient id="charSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE3D1" />
                <stop offset="100%" stop-color="#F7C9AA" />
              </linearGradient>
              <linearGradient id="charCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFDF9" />
                <stop offset="100%" stop-color="#EADBCE" />
              </linearGradient>
            </defs>

            <!-- 1. Apron & Body -->
            <path d="M 17 38 L 43 38 L 46 62 L 14 62 Z" fill="url(#charApronGrad)" rx="3" />
            <!-- Leather Straps -->
            <line x1="20" y1="38" x2="27" y2="50" stroke="#8C5835" stroke-width="2.6" stroke-linecap="round" />
            <line x1="40" y1="38" x2="33" y2="50" stroke="#8C5835" stroke-width="2.6" stroke-linecap="round" />
            <!-- Brass Center Buckle -->
            <circle cx="30" cy="48" r="3.2" fill="url(#charGoldGrad)" stroke="#8C5835" stroke-width="1.2" />
            <!-- Crisp White Barista Collar -->
            <polygon points="23,37 30,42 37,37" fill="#FFFFFF" stroke="#E2D8CF" stroke-width="0.8" />

            <!-- 2. Arms & Ceramic Coffee Cup -->
            <path d="M 16 41 Q 20 50 26 50" stroke="#FFE3D1" stroke-width="3.4" stroke-linecap="round" fill="none" />
            <path d="M 44 41 Q 40 50 34 50" stroke="#FFE3D1" stroke-width="3.4" stroke-linecap="round" fill="none" />
            
            <!-- Ceramic Cup -->
            <rect x="25" y="45" width="10" height="10" rx="2.5" fill="url(#charCupGrad)" stroke="#C89D4B" stroke-width="1" />
            <!-- Cup Handle -->
            <path d="M 35 47 Q 39 49 35 52" stroke="#C89D4B" stroke-width="1.4" fill="none" />
            <!-- Espresso Surface & Latte Art Heart -->
            <ellipse cx="30" cy="46" rx="4.5" ry="1.8" fill="#54311C" />
            <path d="M 30 45 C 28.8 44.2 27.5 45.4 30 46.8 C 32.5 45.4 31.2 44.2 30 45 Z" fill="#FFF5ED" />

            <!-- Animated Steam Trails -->
            <path class="char-steam steam-1" d="M 28 43 Q 26 38 29 34" stroke="rgba(255,255,255,0.75)" stroke-width="1.6" stroke-linecap="round" fill="none" />
            <path class="char-steam steam-2" d="M 32 42 Q 34 37 31 32" stroke="rgba(255,255,255,0.75)" stroke-width="1.6" stroke-linecap="round" fill="none" />

            <!-- 3. Head & Expressive Facial Features -->
            <ellipse cx="30" cy="27" rx="12" ry="12" fill="url(#charSkinGrad)" />
            <!-- Rosy Cheeks -->
            <circle cx="22" cy="30" r="2.2" fill="#FF8A80" opacity="0.4" />
            <circle cx="38" cy="30" r="2.2" fill="#FF8A80" opacity="0.4" />
            <!-- Catchlight Sparkle Eyes -->
            <circle cx="25" cy="26" r="2.1" fill="#241711" />
            <circle cx="25.7" cy="25.3" r="0.8" fill="#FFFFFF" />
            <circle cx="35" cy="26" r="2.1" fill="#241711" />
            <circle cx="35.7" cy="25.3" r="0.8" fill="#FFFFFF" />
            <!-- Cheerful Smile -->
            <path d="M 27 31 Q 30 34.5 33 31" stroke="#241711" stroke-width="1.8" stroke-linecap="round" fill="none" />

            <!-- 4. Barista Flat Cap / Beret -->
            <ellipse cx="30" cy="18" rx="15" ry="7.5" fill="#281A14" />
            <path d="M 15 18 Q 30 8 45 18 Q 30 13 15 18 Z" fill="#3D281F" />
            <!-- Golden Coffee Crest on Cap -->
            <ellipse cx="30" cy="14" rx="3.5" ry="1.6" fill="url(#charGoldGrad)" />
            <path d="M 30 11.5 Q 32.5 14 30 16.5 Q 27.5 14 30 11.5 Z" fill="url(#charGoldGrad)" />
          </svg>

          <!-- Ambient Coffee Sparkles -->
          <div class="char-sparkle char-sparkle-1">✦</div>
          <div class="char-sparkle char-sparkle-2">✦</div>
        </div>
      </div>
    `;

    return `
      <div class="candy-saga-viewport ${compact ? 'is-compact' : ''}">
        ${hideHeader ? '' : `
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
              <span class="stat-val font-mono">${this.calculateTotalStars(activeMembership)}</span>
              <span class="stat-lbl">Stars</span>
            </div>
            <div class="candy-stat-badge highlight">
              <span class="stat-icon">💎</span>
              <span class="stat-val font-mono">${points} Pts</span>
              <span class="stat-lbl">${levelProgress.pointsInCurrentLevel}/500 in Lvl ${currentLevelNum}</span>
            </div>
            <div class="candy-stat-badge">
              <span class="stat-icon">🚩</span>
              <span class="stat-val font-mono">Lvl ${currentLevelNum}</span>
              <span class="stat-lbl">Active</span>
            </div>
          </div>
        </div>
        `}

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
            ${startGateHtml}
            ${nodesHtml}
          </div>

          <!-- 5. Floating Dynamic Character Mascot Layer -->
          ${characterHtml}
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
            <span class="eyebrow candy-celebrate-eyebrow">${lvl.pointsRequired > 0 ? `${lvl.pointsRequired} POINTS REACHED` : 'ROASTERY ROOKIE'} • LEVEL ${lvl.level} UNLOCKED!</span>
            <h2 class="font-serif candy-celebrate-title">${lvl.title}</h2>
            <p class="candy-celebrate-desc">You've accumulated ${lvl.pointsRequired}+ points and unlocked the next Roaster tier!</p>
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
    if (window.openCollectStampModal) {
      window.openCollectStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
    } else if (window.openOwnerStampModal) {
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
    if (window.openCollectStampModal) {
      window.openCollectStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
    } else if (window.openOwnerStampModal) {
      window.openOwnerStampModal({ drinkName: 'Chikmagalur Single-Estate Pour Over' });
    } else {
      const store = window.AtelierStore;
      const state = store ? store.getState() : {};
      const membership = state.membership || {};
      const currentLvl = this.calculateCurrentLevel(membership);
      this.openLevelDetails(currentLvl);
    }
  }

  // Tap interaction on character mascot
  characterTap(e) {
    if (e) e.stopPropagation();
    const charEl = document.querySelector('.candy-character-container');
    if (charEl) {
      charEl.classList.remove('is-tapped');
      void charEl.offsetWidth; // trigger reflow
      charEl.classList.add('is-tapped');

      // Floating cheer bubble
      let pop = charEl.querySelector('.char-tap-popup');
      if (!pop) {
        pop = document.createElement('div');
        pop.className = 'char-tap-popup';
        charEl.appendChild(pop);
      }
      const cheers = [
        "Brewing Greatness! ☕✨",
        "Keep Exploring! 🌟",
        "Roasted to Perfection! 🔥",
        "Onward to the Next Level! 🚀",
        "Delicious V60 Vibes! 🫘",
        "Step by Step to Grand Master! 🏆"
      ];
      pop.textContent = cheers[Math.floor(Math.random() * cheers.length)];
      pop.classList.remove('show');
      void pop.offsetWidth;
      pop.classList.add('show');
      setTimeout(() => {
        if (pop) pop.classList.remove('show');
      }, 2000);
    }

    if (window.AtelierAudio && window.AtelierAudio.playCardFlip) {
      window.AtelierAudio.playCardFlip();
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
  // Re-scroll active character or node smoothly into view if on levels page
  setTimeout(() => {
    const charMarker = document.querySelector('.candy-character-container');
    const currentMarker = charMarker || document.querySelector('.candy-level-node.is-current');
    if (currentMarker) {
      currentMarker.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 120);
}

// Global hooks
window.renderCandyLevelsPage = renderCandyLevelsPage;
window.initCandyLevelsEvents = initCandyLevelsEvents;
