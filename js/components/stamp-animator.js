/* ==========================================================================
   ATELIER PHYSICAL STAMP TOOL ANIMATOR
   Realistic 3D-styled brass & lathe-turned walnut café hand stamper that
   physically descends, presses down onto the loyalty card with impact recoil,
   splatters micro-ink droplets, and lifts to reveal wet lustrous ink.
   ========================================================================== */

(function() {
  'use strict';

  // SVG Markup of the Handcrafted Vintage Café Stamp Tool
  // SVG Markup of the Handcrafted Vintage Café Stamp Tool (First-Person 3D Perspective)
  const STAMP_TOOL_SVG = `
    <div class="physical-stamp-tool" id="physical-stamp-tool">
      <svg viewBox="0 0 140 240" class="stamp-tool-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 3D Lathe-Turned Walnut Handle Gradients -->
          <radialGradient id="woodKnobGrad" cx="42%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#9C5221"/>
            <stop offset="35%" stop-color="#5E2C11"/>
            <stop offset="75%" stop-color="#2E1206"/>
            <stop offset="100%" stop-color="#140803"/>
          </radialGradient>

          <linearGradient id="woodStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#2A1208"/>
            <stop offset="25%" stop-color="#643317"/>
            <stop offset="50%" stop-color="#844520"/>
            <stop offset="75%" stop-color="#542B13"/>
            <stop offset="100%" stop-color="#1D0A04"/>
          </linearGradient>

          <!-- Polished Solid Brass Mirror Gradients -->
          <linearGradient id="brassMetallicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#6B4B1B"/>
            <stop offset="18%" stop-color="#E2BA46"/>
            <stop offset="42%" stop-color="#FFF8D6"/>
            <stop offset="65%" stop-color="#C59B27"/>
            <stop offset="85%" stop-color="#845D1C"/>
            <stop offset="100%" stop-color="#4E330D"/>
          </linearGradient>

          <linearGradient id="brassBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#553912"/>
            <stop offset="20%" stop-color="#D8AC31"/>
            <stop offset="46%" stop-color="#FFF2B8"/>
            <stop offset="72%" stop-color="#B2851E"/>
            <stop offset="100%" stop-color="#41290B"/>
          </linearGradient>

          <!-- Fresh Wet Espresso Ink Reservoir -->
          <radialGradient id="wetInkGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3D1D0D"/>
            <stop offset="60%" stop-color="#210F07"/>
            <stop offset="100%" stop-color="#0E0502"/>
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- 1. Top Walnut Ball Knob with Brass Crown Inset (Owner's Top-Down View) -->
        <g id="stamp-knob">
          <!-- Ambient Drop Shadow -->
          <ellipse cx="70" cy="52" rx="32" ry="12" fill="rgba(0,0,0,0.45)" filter="blur(2.5px)"/>
          
          <!-- Spherical Turned Walnut Knob -->
          <circle cx="70" cy="38" r="30" fill="url(#woodKnobGrad)"/>
          
          <!-- Top Brass Crown Inset Cap (Seen from Owner's Perspective) -->
          <ellipse cx="70" cy="20" rx="16" ry="7" fill="url(#brassMetallicGrad)"/>
          <ellipse cx="70" cy="20" rx="11" ry="4.5" fill="#5A3A10"/>
          <circle cx="70" cy="20" r="2.5" fill="#FFF2B8"/>

          <!-- Specular Light Reflection on Turned Walnut Dome -->
          <ellipse cx="56" cy="29" rx="11" ry="7" transform="rotate(-25 56 29)" fill="rgba(255, 235, 205, 0.5)" filter="blur(1px)"/>
          <ellipse cx="53" cy="27" rx="5" ry="3" transform="rotate(-25 53 27)" fill="rgba(255, 255, 255, 0.75)"/>

          <!-- Turned Neck Ring Ring -->
          <rect x="52" y="60" width="36" height="6" rx="2" fill="url(#woodStemGrad)"/>
        </g>

        <!-- 2. Ergonomic Contoured Wooden Handle Stem -->
        <g id="stamp-stem">
          <path d="M 54 66 
                   C 54 78, 45 98, 47 118 
                   C 49 133, 56 144, 53 152 
                   L 87 152 
                   C 84 144, 91 133, 93 118 
                   C 95 98, 86 78, 86 66 Z" 
                fill="url(#woodStemGrad)"/>
          
          <!-- Wood Grain Specular Spine -->
          <path d="M 66 68 C 66 92, 63 118, 65 150" stroke="rgba(255, 220, 180, 0.32)" stroke-width="4.5" stroke-linecap="round" filter="blur(1px)"/>
          <path d="M 67 68 C 67 92, 64 118, 66 150" stroke="rgba(255, 255, 255, 0.55)" stroke-width="1.4" stroke-linecap="round"/>
        </g>

        <!-- 3. Polished Solid Brass Collar / Ferrule -->
        <g id="stamp-brass-collar">
          <!-- Top Brass Rim -->
          <rect x="48" y="152" width="44" height="6" rx="2" fill="url(#brassMetallicGrad)"/>
          <!-- Knurled Grip Texture Band -->
          <rect x="50" y="158" width="40" height="12" fill="url(#brassMetallicGrad)"/>
          <line x1="55" y1="158" x2="55" y2="170" stroke="#553912" stroke-width="1"/>
          <line x1="60" y1="158" x2="60" y2="170" stroke="#553912" stroke-width="1"/>
          <line x1="65" y1="158" x2="65" y2="170" stroke="#553912" stroke-width="1"/>
          <line x1="70" y1="158" x2="70" y2="170" stroke="#553912" stroke-width="1"/>
          <line x1="75" y1="158" x2="75" y2="170" stroke="#553912" stroke-width="1"/>
          <line x1="80" y1="158" x2="80" y2="170" stroke="#553912" stroke-width="1"/>
          <line x1="85" y1="158" x2="85" y2="170" stroke="#553912" stroke-width="1"/>
          <!-- Bottom Brass Bevel -->
          <rect x="46" y="170" width="48" height="5" rx="1.5" fill="url(#brassMetallicGrad)"/>
        </g>

        <!-- 4. Heavy Flared Solid Brass Stamp Die Base -->
        <g id="stamp-brass-base">
          <!-- Heavy Bell Flare Curve -->
          <path d="M 46 175 
                   C 41 190, 18 206, 12 217 
                   L 128 217 
                   C 122 206, 99 190, 94 175 Z" 
                fill="url(#brassBaseGrad)"/>

          <!-- Specular Gleam on Polished Brass Bell Curve -->
          <path d="M 64 176 C 62 190, 54 206, 48 216" stroke="rgba(255, 255, 255, 0.75)" stroke-width="3.5" filter="blur(1px)"/>

          <!-- Bottom Knurled Brass Base Rim -->
          <rect x="8" y="217" width="124" height="10" rx="3" fill="url(#brassMetallicGrad)"/>
          
          <!-- Bottom Rim Shadow -->
          <rect x="10" y="225" width="120" height="2" fill="rgba(0,0,0,0.55)"/>

          <!-- Bottom Stamping Die Face (Deep Espresso Rubber Ink Cushion) -->
          <rect x="12" y="227" width="116" height="6" rx="2" fill="url(#wetInkGrad)"/>
          <ellipse cx="70" cy="232" rx="55" ry="4.5" fill="#E8B038" opacity="0.35"/>
        </g>
      </svg>
    </div>
  `;

  // Spawn Particle Droplets on Ink Contact
  function spawnInkParticles(x, y, container) {
    const particleCount = 24;
    const colors = ['#C89D4B', '#F8DF9E', '#8B4513', '#3A1E0D', '#E2A83B', '#FFF0BD'];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'stamp-ink-particle';
      
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const distance = 28 + Math.random() * 56;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 6.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 0.42 + Math.random() * 0.35;

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

  // Core Animation Engine: Executes Physical Stamping Motion
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
      await new Promise(r => setTimeout(r, 380));
    } else {
      await new Promise(r => setTimeout(r, 50));
    }

    // Get exact viewport coordinates of the slot
    const slotRect = liveSlotEl.getBoundingClientRect();
    const slotCenterX = Math.round(slotRect.left + slotRect.width / 2);
    const slotCenterY = Math.round(slotRect.top + slotRect.height / 2);
    const slotDiameter = Math.round(Math.min(slotRect.width, slotRect.height));

    // Create Animation Stage Overlay
    const stage = document.createElement('div');
    stage.className = 'stamp-animation-stage';
    stage.id = 'stamp-animation-stage';
    stage.style.perspectiveOrigin = `${slotCenterX}px ${slotCenterY}px`;

    // Highlight beacon ring on target slot
    const beacon = document.createElement('div');
    beacon.className = 'stamp-target-beacon';
    beacon.style.left = `${slotCenterX}px`;
    beacon.style.top = `${slotCenterY}px`;
    beacon.style.width = `${Math.round(slotDiameter * 1.15)}px`;
    beacon.style.height = `${Math.round(slotDiameter * 1.15)}px`;

    // Dynamic 3D Contact Shadow
    const shadow = document.createElement('div');
    shadow.className = 'stamp-tool-shadow';
    shadow.style.left = `${slotCenterX}px`;
    shadow.style.top = `${slotCenterY}px`;
    shadow.style.width = `${Math.round(slotDiameter * 1.05)}px`;
    shadow.style.height = `${Math.round(slotDiameter * 1.05)}px`;

    // Shockwave Pressure Ripple
    const shockwave = document.createElement('div');
    shockwave.className = 'stamp-shockwave-ring';
    shockwave.style.left = `${slotCenterX}px`;
    shockwave.style.top = `${slotCenterY}px`;
    shockwave.style.width = `${slotDiameter}px`;
    shockwave.style.height = `${slotDiameter}px`;

    // Inject Tool HTML
    stage.innerHTML = STAMP_TOOL_SVG;
    stage.appendChild(beacon);
    stage.appendChild(shadow);
    stage.appendChild(shockwave);
    document.body.appendChild(stage);

    const tool = stage.querySelector('#physical-stamp-tool');

    // Position tool base precisely centered above the slot (center X=70, base Y=230)
    const toolLeft = Math.round(slotCenterX - 70);
    const toolTop = Math.round(slotCenterY - 230);

    tool.style.left = `${toolLeft}px`;
    tool.style.top = `${toolTop}px`;

    // Sound: Descent Whoosh
    if (window.AtelierAudio && window.AtelierAudio.playStampWhoosh) {
      window.AtelierAudio.playStampWhoosh();
    }

    // Step 1: Start Descent Animation
    tool.classList.add('tool-descend');
    shadow.classList.add('shadow-descend');

    // Step 2: Exact Point of Impact (270ms - Frame-perfect synchronization)
    setTimeout(() => {
      // Sound: Heavy multi-layer brass & wood thud + ink squelch
      if (window.AtelierAudio && window.AtelierAudio.playHeavyStampSound) {
        window.AtelierAudio.playHeavyStampSound();
      }

      // Card physical spring recoil
      if (liveCardEl) {
        liveCardEl.classList.remove('card-recoil-shake');
        void liveCardEl.offsetWidth; // Trigger reflow
        liveCardEl.classList.add('card-recoil-shake');
      }

      // Shockwave ring explosion
      shockwave.classList.add('shockwave-active');

      // Ink particle burst
      spawnInkParticles(slotCenterX, slotCenterY, stage);

      // Instantly switch slot to stamped state with wet ink appearance
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

      // Haptic feedback for supported mobile devices
      if (navigator.vibrate) {
        navigator.vibrate([35, 45, 20]);
      }
    }, 270);

    // Step 3: Tool Hold & Lift Retreat (500ms - deliberate 230ms dwell time)
    setTimeout(() => {
      tool.classList.remove('tool-descend');
      tool.classList.add('tool-lift');
      shadow.classList.add('shadow-lift');
    }, 500);

    // Step 4: Complete & Cleanup (920ms)
    setTimeout(() => {
      // Sparkle celebration over newly stamped slot
      if (window.confetti) {
        window.confetti({
          particleCount: 30,
          spread: 65,
          origin: {
            x: slotCenterX / window.innerWidth,
            y: slotCenterY / window.innerHeight
          },
          colors: ['#C89D4B', '#F8DF9E', '#AA7C26', '#FFFFFF']
        });
      }

      // Cleanup overlay stage
      stage.remove();

      // Trigger user completion callback
      onComplete();
    }, 920);
  }

  // Export to global window namespace
  window.playStampToolAnimation = playStampToolAnimation;

})();
