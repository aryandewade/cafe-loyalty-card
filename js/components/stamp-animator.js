/* ==========================================================================
   ATELIER PHYSICAL STAMP TOOL ANIMATOR
   Authentic Handcrafted Barista Espresso Tamper & Hand Stamper
   Crafted with Turned Italian Walnut, Machined Polished Brass Flange,
   Brass Medallion Crown, Radial Pressure Tick Rays, and 6-Stage Stamping
   ========================================================================== */

(function() {
  'use strict';

  // Compute 24 Radial Pressure Burst Tick Lines (Step 3: Press)
  function generatePressureRaysSvg() {
    const rays = [];
    for (let i = 0; i < 24; i++) {
      const angle = (i * 15) * Math.PI / 180;
      const r1 = 73;
      const isMajor = (i % 2 === 0);
      const r2 = isMajor ? 88 : 81;
      const x1 = (100 + Math.cos(angle) * r1).toFixed(1);
      const y1 = (100 + Math.sin(angle) * r1).toFixed(1);
      const x2 = (100 + Math.cos(angle) * r2).toFixed(1);
      const y2 = (100 + Math.sin(angle) * r2).toFixed(1);
      const strokeWidth = isMajor ? 1.7 : 1.15;
      rays.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="stamp-pressure-ray ${isMajor ? 'major' : 'minor'}" stroke="url(#pressureRayGrad)" stroke-width="${strokeWidth}" stroke-linecap="round"/>`);
    }
    return rays.join('\n');
  }

  // SVG Markup of the 3D Brass & Walnut Hand Stamper (Matching User Reference Image)
  function buildStampToolHtml() {
    return `
      <div class="physical-stamp-tool" id="physical-stamp-tool">
        <svg viewBox="0 0 200 200" class="stamp-tool-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Realistic Ambient Drop Shadows -->
            <filter id="stampToolDropShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="4.5" flood-color="#0E0602" flood-opacity="0.6"/>
            </filter>
            
            <!-- High-Gloss Specular Highlight Filter -->
            <filter id="stampSpecGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.6" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>

            <!-- 1. Polished Brass Base Rim (Overhead top-left illumination) -->
            <radialGradient id="brassBaseRimGrad" cx="34%" cy="28%" r="68%">
              <stop offset="0%" stop-color="#FFFEE6"/>
              <stop offset="12%" stop-color="#FCE187"/>
              <stop offset="28%" stop-color="#E2B444"/>
              <stop offset="48%" stop-color="#AC7E23"/>
              <stop offset="72%" stop-color="#6F4B11"/>
              <stop offset="90%" stop-color="#462C07"/>
              <stop offset="100%" stop-color="#241503"/>
            </radialGradient>

            <!-- Brass Bevel Highlight Gradient -->
            <linearGradient id="brassBevelLinear" x1="22%" y1="18%" x2="78%" y2="82%">
              <stop offset="0%" stop-color="#FFFDF2"/>
              <stop offset="25%" stop-color="#FCE189"/>
              <stop offset="55%" stop-color="#B88726"/>
              <stop offset="85%" stop-color="#5B380C"/>
              <stop offset="100%" stop-color="#2D1A04"/>
            </linearGradient>

            <!-- Stepped Brass Collar Ring -->
            <radialGradient id="brassCollarGrad" cx="36%" cy="32%" r="64%">
              <stop offset="0%" stop-color="#FFFDE0"/>
              <stop offset="18%" stop-color="#F7D572"/>
              <stop offset="48%" stop-color="#B98725"/>
              <stop offset="76%" stop-color="#69430E"/>
              <stop offset="100%" stop-color="#2D1904"/>
            </radialGradient>

            <!-- 2. Lathe-Turned Solid Walnut Knob Dome (Top spherical face) -->
            <radialGradient id="walnutWoodDomeGrad" cx="36%" cy="32%" r="66%">
              <stop offset="0%" stop-color="#CF7F42"/>
              <stop offset="14%" stop-color="#A95722"/>
              <stop offset="30%" stop-color="#733213"/>
              <stop offset="54%" stop-color="#471C09"/>
              <stop offset="78%" stop-color="#280C03"/>
              <stop offset="92%" stop-color="#150501"/>
              <stop offset="100%" stop-color="#080200"/>
            </radialGradient>

            <!-- Wood Specular Gloss Glare (Upper-left spherical curved reflection) -->
            <linearGradient id="walnutGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.94"/>
              <stop offset="26%" stop-color="#FFF2D8" stop-opacity="0.75"/>
              <stop offset="60%" stop-color="#E8A96E" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#BF6628" stop-opacity="0"/>
            </linearGradient>

            <!-- 3. Center Polished Brass Medallion / Screw Coin -->
            <radialGradient id="brassMedallionGrad" cx="38%" cy="34%" r="62%">
              <stop offset="0%" stop-color="#FFFFF2"/>
              <stop offset="20%" stop-color="#FCE07C"/>
              <stop offset="52%" stop-color="#BE8E26"/>
              <stop offset="78%" stop-color="#6F4810"/>
              <stop offset="100%" stop-color="#2F1B04"/>
            </radialGradient>

            <!-- Medallion Inner Recessed Core -->
            <radialGradient id="brassMedallionCoreGrad" cx="36%" cy="32%" r="60%">
              <stop offset="0%" stop-color="#FFFDF0"/>
              <stop offset="35%" stop-color="#EABF53"/>
              <stop offset="70%" stop-color="#996B1E"/>
              <stop offset="100%" stop-color="#462C07"/>
            </radialGradient>

            <!-- Pressure Burst Rays Gradient (Panel 3: Press) -->
            <linearGradient id="pressureRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFBE6"/>
              <stop offset="45%" stop-color="#F8DF9E"/>
              <stop offset="100%" stop-color="#D4AF37"/>
            </linearGradient>
          </defs>

          <!-- LAYER 0: Radial Pressure Burst Tick Marks (Step 3: Press) -->
          <g class="stamp-radial-rays" id="stamp-radial-rays">
            ${generatePressureRaysSvg()}
          </g>

          <!-- LAYER 1: Solid Brass Base Flange -->
          <g id="stamp-brass-base-group">
            <!-- Contact Occlusion Shadow Under Rim -->
            <circle cx="100" cy="103" r="71" fill="rgba(12, 6, 2, 0.45)" filter="url(#stampToolDropShadow)"/>

            <!-- Outermost Flared Brass Rim (Radius 70) -->
            <circle cx="100" cy="100" r="70" fill="url(#brassBaseRimGrad)"/>

            <!-- Polished Brass Chamfer Edge Highlight -->
            <circle cx="100" cy="100" r="68" stroke="url(#brassBevelLinear)" stroke-width="1.8" fill="none"/>

            <!-- Concentric Machining Grooves on Brass Rim -->
            <circle cx="100" cy="100" r="65.5" stroke="#3D2508" stroke-width="1.1" fill="none"/>
            <circle cx="100" cy="100" r="64.5" stroke="rgba(255, 248, 220, 0.65)" stroke-width="0.8" fill="none"/>

            <!-- Inner Stepped Brass Ledge (Radius 62) -->
            <circle cx="100" cy="100" r="62" fill="url(#brassCollarGrad)"/>
            <circle cx="100" cy="100" r="59" stroke="#4A2E0A" stroke-width="1.2" fill="none"/>
            <circle cx="100" cy="100" r="58" stroke="rgba(255, 245, 215, 0.55)" stroke-width="0.7" fill="none"/>
          </g>

          <!-- LAYER 2: Stepped Brass Collar Ferrule (Transition to Wood) -->
          <g id="stamp-brass-collar-group">
            <!-- Shadow Under Collar -->
            <circle cx="100" cy="101" r="54" fill="rgba(10, 4, 1, 0.52)"/>
            <!-- Collar Ring -->
            <circle cx="100" cy="100" r="52.5" fill="url(#brassCollarGrad)"/>
            <circle cx="100" cy="100" r="49" stroke="#3B2207" stroke-width="1.4" fill="none"/>
            <circle cx="100" cy="100" r="48" stroke="rgba(255, 248, 225, 0.7)" stroke-width="0.8" fill="none"/>
          </g>

          <!-- LAYER 3: Lathe-Turned Solid Italian Walnut Wooden Handle (Top Spherical Knob Dome) -->
          <g id="stamp-walnut-dome-group">
            <!-- Shadow Cast by Wooden Knob onto Brass Collar -->
            <circle cx="100" cy="102" r="46.5" fill="rgba(8, 3, 1, 0.7)" filter="url(#stampToolDropShadow)"/>

            <!-- Main Turned Walnut Spherical Dome (Radius 45) -->
            <circle cx="100" cy="100" r="45" fill="url(#walnutWoodDomeGrad)"/>

            <!-- Concentric Lathe Chisel Micro-Grooves (Realistic wood-turning texture) -->
            <circle cx="100" cy="100" r="41" stroke="rgba(0, 0, 0, 0.22)" stroke-width="0.9" fill="none"/>
            <circle cx="100" cy="100" r="37.5" stroke="rgba(255, 215, 175, 0.12)" stroke-width="0.7" fill="none"/>
            <circle cx="100" cy="100" r="33" stroke="rgba(0, 0, 0, 0.2)" stroke-width="0.8" fill="none"/>
            <circle cx="100" cy="100" r="28.5" stroke="rgba(255, 225, 190, 0.14)" stroke-width="0.7" fill="none"/>
            <circle cx="100" cy="100" r="23" stroke="rgba(0, 0, 0, 0.26)" stroke-width="0.8" fill="none"/>

            <!-- High-Gloss Lacquer Reflection Glare (Spherical Curved Highlight on Upper Left) -->
            <ellipse cx="85" cy="83" rx="17" ry="9" transform="rotate(-38 85 83)" fill="url(#walnutGlossGrad)" filter="url(#stampSpecGlow)"/>
            <!-- Pure White Glint -->
            <ellipse cx="81" cy="79" rx="6.5" ry="3.2" transform="rotate(-38 81 79)" fill="#FFFFFF" opacity="0.95"/>
            <!-- Soft Warm Subsurface Amber Glow -->
            <ellipse cx="78" cy="76" rx="11" ry="5.5" transform="rotate(-38 78 76)" fill="rgba(255, 210, 160, 0.35)"/>
            <!-- Bottom-Right Ambient Rim Bounce Light -->
            <ellipse cx="118" cy="118" rx="15" ry="5.5" transform="rotate(45 118 118)" fill="rgba(215, 145, 75, 0.18)"/>
          </g>

          <!-- LAYER 4: Center Polished Brass Medallion / Screw Coin Inset -->
          <g id="stamp-center-medallion-group">
            <!-- Recessed Socket in Wood -->
            <circle cx="100" cy="100" r="15" fill="#1A0A04" stroke="#0B0301" stroke-width="0.9"/>

            <!-- Polished Brass Medallion Coin -->
            <circle cx="100" cy="100" r="13.5" fill="url(#brassMedallionGrad)"/>

            <!-- Concentric Machined Bevel Ring -->
            <circle cx="100" cy="100" r="11" stroke="#5C3B0E" stroke-width="1.0" fill="none"/>
            <circle cx="100" cy="100" r="10" stroke="rgba(255, 248, 220, 0.65)" stroke-width="0.6" fill="none"/>

            <!-- Inner Polished Brass Coin Face -->
            <circle cx="100" cy="100" r="8.5" fill="url(#brassMedallionCoreGrad)"/>

            <!-- Center Rivet Dot / Screw Pin -->
            <circle cx="100" cy="100" r="2.2" fill="#2E1B07"/>
            <circle cx="99.3" cy="99.3" r="0.9" fill="#FFF8E0"/>

            <!-- Medallion Glint -->
            <ellipse cx="96.5" cy="95.5" rx="3.5" ry="1.6" transform="rotate(-30 96.5 95.5)" fill="rgba(255, 255, 255, 0.85)"/>
          </g>
        </svg>
      </div>
    `;
  }

  // Spawn Particle Droplets on Ink Contact
  function spawnInkParticles(x, y, container) {
    const particleCount = 20;
    const colors = ['#C89D4B', '#F8DF9E', '#AA7C26', '#3A1E0D', '#E2A83B', '#FFF0BD'];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'stamp-ink-particle';
      
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const distance = 24 + Math.random() * 48;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 5.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 0.38 + Math.random() * 0.3;

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.backgroundColor = color;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.animationDuration = `${duration}s`;

      container.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, duration * 1000 + 50);
    }
  }

  // Core Animation Engine: Executes 6-Stage Stamping Choreography
  // Stage 1: Hover (above empty slot)
  // Stage 2: Lowering (moving down toward card)
  // Stage 3: Press (firm compression, radial pressure burst rays, card recoil)
  // Stage 4: Imprinting (stamp holds firm dwell, golden aura blooms beneath rim)
  // Stage 5: Lift (moving up after stamping)
  // Stage 6: Result (newly stamped slot with glowing golden aura)
  async function playStampToolAnimation(options = {}) {
    const targetSlotIndex = options.slotIndex || (window.AtelierStore.getState().membership.currentStamps + 1);
    const onComplete = options.onComplete || (() => {});

    // Ensure we are viewing the loyalty card
    const cardEl = document.getElementById('digital-loyalty-card');
    let slotEl = document.getElementById(`stamp-slot-${targetSlotIndex}`);

    // If on a different page or card not found, navigate to dashboard first
    if (!cardEl || !slotEl) {
      if (window.router && window.router.navigate) {
        window.router.navigate('dashboard');
        await new Promise(r => setTimeout(r, 120));
      }
    }

    const liveCardEl = document.getElementById('digital-loyalty-card');
    let liveSlotEl = document.getElementById(`stamp-slot-${targetSlotIndex}`);

    if (!liveSlotEl) {
      liveSlotEl = document.querySelector('.stamp-slot.next-target');
    }

    if (!liveSlotEl) {
      onComplete();
      return;
    }

    if (liveCardEl) {
      liveCardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    // Scroll card smoothly into center view if not comfortably visible
    const initialRect = liveSlotEl.getBoundingClientRect();
    const isVisibleInView = (
      initialRect.top >= 70 &&
      initialRect.bottom <= (window.innerHeight - 70) &&
      initialRect.left >= 10 &&
      initialRect.right <= (window.innerWidth - 10)
    );

    if (!isVisibleInView) {
      liveSlotEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      await new Promise(r => setTimeout(r, 340));
    } else {
      await new Promise(r => setTimeout(r, 40));
    }

    // Get exact viewport coordinates of the target slot
    const slotRect = liveSlotEl.getBoundingClientRect();
    const slotCenterX = Math.round(slotRect.left + slotRect.width / 2);
    const slotCenterY = Math.round(slotRect.top + slotRect.height / 2);
    const slotDiameter = Math.round(Math.min(slotRect.width, slotRect.height));

    // Dynamic scale proportion matching reference image:
    // Base rim is 70% of SVG viewBox (r=70 in 200x200), so toolSize makes the base ~1.45x slot diameter
    const toolSize = Math.max(76, Math.min(136, Math.round(slotDiameter * 2.12)));

    // Create Animation Stage Overlay
    const stage = document.createElement('div');
    stage.className = 'stamp-animation-stage';
    stage.id = 'stamp-animation-stage';
    stage.style.perspectiveOrigin = `${slotCenterX}px ${slotCenterY}px`;

    // Target slot subtle beacon ring
    const beacon = document.createElement('div');
    beacon.className = 'stamp-target-beacon';
    beacon.style.left = `${slotCenterX}px`;
    beacon.style.top = `${slotCenterY}px`;
    beacon.style.width = `${Math.round(slotDiameter * 1.15)}px`;
    beacon.style.height = `${Math.round(slotDiameter * 1.15)}px`;

    // Dynamic 3D Contact Shadow
    const shadow = document.createElement('div');
    shadow.className = 'stamp-tool-shadow shadow-phase-hover';
    shadow.style.left = `${slotCenterX}px`;
    shadow.style.top = `${slotCenterY}px`;
    const shadowSize = Math.round(slotDiameter * 1.5);
    shadow.style.width = `${shadowSize}px`;
    shadow.style.height = `${shadowSize}px`;

    // Shockwave Pressure Ripple (Step 3: Press)
    const shockwave = document.createElement('div');
    shockwave.className = 'stamp-shockwave-ring';
    shockwave.style.left = `${slotCenterX}px`;
    shockwave.style.top = `${slotCenterY}px`;
    shockwave.style.width = `${Math.round(slotDiameter * 1.45)}px`;
    shockwave.style.height = `${Math.round(slotDiameter * 1.45)}px`;

    // Golden Imprint Aura (Step 4: Imprinting)
    const imprintAura = document.createElement('div');
    imprintAura.className = 'stamp-imprint-aura';
    imprintAura.style.left = `${slotCenterX}px`;
    imprintAura.style.top = `${slotCenterY}px`;
    const auraSize = Math.round(slotDiameter * 1.55);
    imprintAura.style.width = `${auraSize}px`;
    imprintAura.style.height = `${auraSize}px`;

    // Inject Tool HTML
    stage.innerHTML = buildStampToolHtml();
    stage.appendChild(beacon);
    stage.appendChild(shadow);
    stage.appendChild(shockwave);
    stage.appendChild(imprintAura);
    document.body.appendChild(stage);

    const tool = stage.querySelector('#physical-stamp-tool');

    // Position top-down stamp tool perfectly concentric with slot
    const toolLeft = Math.round(slotCenterX - toolSize / 2);
    const toolTop = Math.round(slotCenterY - toolSize / 2);

    tool.style.width = `${toolSize}px`;
    tool.style.height = `${toolSize}px`;
    tool.style.left = `${toolLeft}px`;
    tool.style.top = `${toolTop}px`;

    // Sound: Hover glide
    if (window.AtelierAudio && window.AtelierAudio.playStampWhoosh) {
      window.AtelierAudio.playStampWhoosh();
    }

    // -------------------------------------------------------------
    // STEP 1: Hover (0ms)
    // Stamp above the empty slot (top view), hovering with soft shadow
    // -------------------------------------------------------------
    tool.classList.add('tool-phase-hover');
    shadow.classList.add('shadow-phase-hover');

    // -------------------------------------------------------------
    // STEP 2: Lowering (190ms)
    // Stamp smoothly moving down towards the card
    // -------------------------------------------------------------
    setTimeout(() => {
      tool.classList.remove('tool-phase-hover');
      tool.classList.add('tool-phase-lower');
      shadow.classList.remove('shadow-phase-hover');
      shadow.classList.add('shadow-phase-lower');
    }, 190);

    // -------------------------------------------------------------
    // STEP 3: Press (390ms)
    // Stamp fully pressed onto the card!
    // Radial pressure tick rays burst out, shockwave explodes, card recoils
    // -------------------------------------------------------------
    setTimeout(() => {
      tool.classList.remove('tool-phase-lower');
      tool.classList.add('tool-phase-press');
      shadow.classList.remove('shadow-phase-lower');
      shadow.classList.add('shadow-phase-press');

      // Radial pressure burst tick lines flash into view
      const raysEl = tool.querySelector('#stamp-radial-rays');
      if (raysEl) {
        raysEl.classList.remove('rays-active');
        void raysEl.getBoundingClientRect(); // trigger reflow
        raysEl.classList.add('rays-active');
      }

      // Contact shockwave ring burst
      shockwave.classList.add('shockwave-active');

      // Sound: Heavy authentic multi-layer brass & wood thud
      if (window.AtelierAudio && window.AtelierAudio.playHeavyStampSound) {
        window.AtelierAudio.playHeavyStampSound();
      }

      // Card physical spring recoil
      if (liveCardEl) {
        liveCardEl.classList.remove('card-recoil-shake');
        void liveCardEl.offsetWidth; // trigger reflow
        liveCardEl.classList.add('card-recoil-shake');
      }

      // Ink particle burst
      spawnInkParticles(slotCenterX, slotCenterY, stage);

      // Instantly imprint slot to stamped state with wet lustrous ink
      const rot = ((targetSlotIndex * 17) % 11) - 5;
      liveSlotEl.style.setProperty('--seal-rot', `${rot}deg`);
      liveSlotEl.style.setProperty('--random-rot', `${rot}deg`);
      liveSlotEl.classList.remove('empty', 'next-target');
      liveSlotEl.classList.add('stamped', 'freshly-inked');
      
      liveSlotEl.innerHTML = `
        <div class="stamp-seal wet-seal-gleam" style="transform: rotate(${rot}deg);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
      `;

      // Haptic feedback for mobile devices
      if (navigator.vibrate) {
        navigator.vibrate([35, 45, 20]);
      }
    }, 390);

    // -------------------------------------------------------------
    // STEP 4: Imprinting (590ms)
    // Stamp holds firm dwell position, leaving the mark with subtle gold glow
    // -------------------------------------------------------------
    setTimeout(() => {
      tool.classList.remove('tool-phase-press');
      tool.classList.add('tool-phase-imprint');
      shadow.classList.remove('shadow-phase-press');
      shadow.classList.add('shadow-phase-imprint');

      // Golden imprint aura bloom
      imprintAura.classList.add('imprint-active');
    }, 590);

    // -------------------------------------------------------------
    // STEP 5: Lift (790ms)
    // Stamp moving up and retracting after stamping
    // -------------------------------------------------------------
    setTimeout(() => {
      tool.classList.remove('tool-phase-imprint');
      tool.classList.add('tool-phase-lift');
      shadow.classList.remove('shadow-phase-imprint');
      shadow.classList.add('shadow-phase-lift');
    }, 790);

    // -------------------------------------------------------------
    // STEP 6: Result (1120ms)
    // New stamp added, radiant gold aura shines on newly stamped slot
    // -------------------------------------------------------------
    setTimeout(() => {
      liveSlotEl.classList.add('newly-stamped-gold-aura');

      // Sparkle celebration over newly stamped slot
      if (window.confetti) {
        window.confetti({
          particleCount: 30,
          spread: 60,
          origin: {
            x: slotCenterX / window.innerWidth,
            y: slotCenterY / window.innerHeight
          },
          colors: ['#FFF8D6', '#E2BA46', '#9E731B', '#FFFFFF']
        });
      }

      // Cleanup overlay stage
      stage.remove();

      // Trigger user completion callback
      onComplete();
    }, 1120);
  }

  // Export to global window namespace
  window.playStampToolAnimation = playStampToolAnimation;

})();
