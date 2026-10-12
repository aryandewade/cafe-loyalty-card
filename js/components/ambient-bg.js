/* ==========================================================================
   ATELIER GAMIFIED AMBIENT BACKGROUND SYSTEM
   - Interactive, highly visible 2D physics sandbox:
     * Tumbling roasted coffee beans with authentic cleft line
     * Twinkling 4-point Atelier gold stars & glowing crema orbs
     * Cursor gravity vortex & tangential fluid swirl
     * Game-like Click-to-Pop mechanic (pop beans & stars into spark bursts)
     * Comet spark dust trails following rapid pointer movement
     * Dual concentric energy ripple shockwaves
     * Tactile audio feedback on popping
   ========================================================================== */

(function() {
  'use strict';

  class AmbientGameEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.glowEl = null;

      // Active simulation arrays
      this.entities = [];   // Persistent floating beans, stars, and orbs
      this.sparks = [];     // Transient kinetic burst particles
      this.ripples = [];    // Expanding concentric shockwave rings
      this.animFrameId = null;

      // Pointer tracking & physics
      this.pointer = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 3,
        prevX: window.innerWidth / 2,
        prevY: window.innerHeight / 3,
        speed: 0,
        isHovered: false,
        radius: 160
      };

      // Glow coordinates (smooth lerp)
      this.glowX = window.innerWidth / 2;
      this.glowY = window.innerHeight / 3;

      this.lastTime = performance.now();
      this.lastScrollY = window.scrollY;
      this.scrollVelocity = 0;
      this.isDark = false;
      this.isReducedMotion = false;
      this.trailCooldown = 0;

      this.init();
    }

    init() {
      this.canvas = document.getElementById('ambient-canvas');
      this.glowEl = document.getElementById('ambient-glow');

      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ambient-canvas';
        this.canvas.className = 'ambient-canvas';
        this.canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(this.canvas);
      }

      if (!this.glowEl) {
        this.glowEl = document.createElement('div');
        this.glowEl.id = 'ambient-glow';
        this.glowEl.className = 'ambient-glow';
        this.glowEl.setAttribute('aria-hidden', 'true');
        document.body.prepend(this.glowEl);
      }

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      if (!this.ctx) return;

      this.checkReducedMotion();
      this.checkTheme();
      this.resize();
      this.spawnEntities();
      this.bindEvents();

      if (!this.isReducedMotion) {
        this.loop = this.loop.bind(this);
        this.animFrameId = requestAnimationFrame(this.loop);
      } else {
        this.drawStatic();
      }
    }

    checkReducedMotion() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
        if (this.isReducedMotion) {
          if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
          this.drawStatic();
        } else {
          this.lastTime = performance.now();
          this.loop();
        }
      });
    }

    checkTheme() {
      const theme = document.documentElement.getAttribute('data-theme');
      this.isDark = theme === 'dark';
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);

      // Keep entities in screen bounds
      this.entities.forEach(e => {
        if (e.x > this.width) e.x = Math.random() * this.width;
        if (e.y > this.height) e.y = Math.random() * this.height;
      });
    }

    spawnEntities() {
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 16 : 28;

      this.entities = [];
      const types = ['bean', 'star', 'orb', 'bean', 'star'];

      for (let i = 0; i < count; i++) {
        const type = types[i % types.length];
        this.entities.push(this.createEntity(type));
      }
    }

    createEntity(type, customX, customY) {
      const isMobile = window.innerWidth < 768;
      let size, color, glowColor;

      if (type === 'bean') {
        size = isMobile ? (10 + Math.random() * 6) : (13 + Math.random() * 8);
        color = this.isDark
          ? (Math.random() > 0.4 ? '#8B5028' : '#C89D4B')
          : (Math.random() > 0.4 ? '#683B1E' : '#B88232');
        glowColor = 'rgba(200, 157, 75, 0.4)';
      } else if (type === 'star') {
        size = isMobile ? (8 + Math.random() * 5) : (11 + Math.random() * 7);
        color = this.isDark ? '#F5D075' : '#D4A346';
        glowColor = 'rgba(255, 215, 100, 0.55)';
      } else { // orb
        size = isMobile ? (7 + Math.random() * 5) : (10 + Math.random() * 7);
        color = this.isDark ? 'rgba(217, 115, 67, 0.7)' : 'rgba(188, 90, 43, 0.65)';
        glowColor = 'rgba(188, 90, 43, 0.4)';
      }

      return {
        type,
        x: customX !== undefined ? customX : Math.random() * this.width,
        y: customY !== undefined ? customY : Math.random() * this.height,
        size,
        baseSize: size,
        color,
        glowColor,
        alpha: 0.6 + Math.random() * 0.3,
        baseAlpha: 0.6 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.25 + Math.random() * 0.55), // Natural buoyant lift
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.035,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.025,
        amplitude: 0.4 + Math.random() * 0.7,
        scalePulse: 1,
        // Kinetic forces from interactions
        pushX: 0,
        pushY: 0,
        isPopping: false,
        popScale: 1
      };
    }

    bindEvents() {
      const onMove = (clientX, clientY) => {
        this.pointer.targetX = clientX;
        this.pointer.targetY = clientY;
        this.pointer.isHovered = true;

        // Calculate cursor drag speed
        const dx = clientX - this.pointer.prevX;
        const dy = clientY - this.pointer.prevY;
        this.pointer.speed = Math.hypot(dx, dy);
        this.pointer.prevX = clientX;
        this.pointer.prevY = clientY;

        // Emit Comet Dust Sparks when moving briskly
        if (this.pointer.speed > 8) {
          this.trailCooldown++;
          if (this.trailCooldown % 2 === 0) {
            this.spawnCometTrail(clientX, clientY, dx, dy);
          }
        }
      };

      window.addEventListener('mousemove', (e) => {
        onMove(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          const t = e.touches[0];
          onMove(t.clientX, t.clientY);
          this.handleClickAt(t.clientX, t.clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          const t = e.touches[0];
          onMove(t.clientX, t.clientY);
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.pointer.isHovered = false;
        this.pointer.targetX = this.width / 2;
        this.pointer.targetY = this.height / 3;
      });

      // Click: Pop game mechanic + Ripple blast
      window.addEventListener('click', (e) => {
        this.handleClickAt(e.clientX, e.clientY);
      }, { passive: true });

      // Scroll momentum
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - this.lastScrollY;
        this.lastScrollY = currentScrollY;
        this.scrollVelocity = Math.max(-16, Math.min(16, delta * 0.4));
      }, { passive: true });

      window.addEventListener('resize', () => {
        this.resize();
      }, { passive: true });

      // Theme toggle observer
      const observer = new MutationObserver(() => {
        this.checkTheme();
        this.spawnEntities();
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      // Visibility change pause
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        } else {
          this.lastTime = performance.now();
          if (!this.isReducedMotion) {
            this.loop();
          }
        }
      });
    }

    // Interactive Game Mechanic: Click to pop entities or trigger kinetic blast
    handleClickAt(x, y) {
      let poppedAny = false;

      // Check if user clicked on or near a floating entity
      this.entities.forEach(e => {
        if (e.isPopping) return;
        const dist = Math.hypot(e.x - x, e.y - y);
        const hitRadius = e.size * 2 + 18;

        if (dist < hitRadius) {
          // POP!
          poppedAny = true;
          e.isPopping = true;
          this.triggerPopExplosion(e);
        }
      });

      // Tactile sound feedback
      if (poppedAny) {
        if (window.AtelierAudio) {
          if (window.AtelierAudio.playCandyClick) window.AtelierAudio.playCandyClick();
          else if (window.AtelierAudio.playTap) window.AtelierAudio.playTap();
        }
      }

      // Always spawn expanding energy shockwaves
      this.spawnRipple(x, y, poppedAny ? 1.4 : 1.0);

      // Spawn click kinetic fountain sparks
      this.spawnClickSparks(x, y, poppedAny ? 14 : 9);
    }

    triggerPopExplosion(entity) {
      // 12 festive sparks in a radial starburst
      const count = 12;
      const colors = ['#FFD868', '#FFA347', '#FFEEDB', '#C89D4B', '#FFFFFF'];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.3 - 0.15);
        const speed = 3.5 + Math.random() * 4.5;
        this.sparks.push({
          x: entity.x,
          y: entity.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.2 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.024 + Math.random() * 0.02,
          gravity: 0.08,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.2
        });
      }

      // Respawn entity after short delay
      setTimeout(() => {
        entity.isPopping = false;
        entity.popScale = 1;
        entity.y = this.height + 20;
        entity.x = Math.random() * this.width;
        entity.alpha = entity.baseAlpha;
      }, 1200);
    }

    spawnClickSparks(x, y, count) {
      const colors = ['#E8BA5A', '#FF9944', '#FFF3D0', '#D88A3A'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.2 + Math.random() * 4.2;
        this.sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.8 + Math.random() * 2.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.95,
          decay: 0.028 + Math.random() * 0.02,
          gravity: 0.06,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.15
        });
      }
    }

    spawnCometTrail(x, y, dx, dy) {
      if (this.sparks.length > 55) return;
      const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() * 0.8 - 0.4);
      const speed = 1.2 + Math.random() * 2.5;
      const colors = ['#FFD875', '#FFAA50', '#FFFFFF'];

      this.sparks.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.85,
        decay: 0.045 + Math.random() * 0.03,
        gravity: 0.02,
        rotation: Math.random() * Math.PI,
        spin: 0.1
      });
    }

    spawnRipple(x, y, intensityMultiplier = 1) {
      if (this.ripples.length > 6) this.ripples.shift();
      this.ripples.push({
        x,
        y,
        radius: 8,
        maxRadius: Math.min(260, window.innerWidth * 0.5) * intensityMultiplier,
        alpha: 0.65 * intensityMultiplier,
        speed: 4.0 * intensityMultiplier
      });

      // Kinetic repulsion blast on all nearby entities
      const blastRadius = 180 * intensityMultiplier;
      this.entities.forEach(e => {
        const dx = e.x - x;
        const dy = e.y - y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < blastRadius) {
          const power = (1 - dist / blastRadius) * 3.8 * intensityMultiplier;
          e.pushX += (dx / dist) * power;
          e.pushY += (dy / dist) * power;
          e.rotSpeed += (Math.random() - 0.5) * 0.08;
        }
      });
    }

    update(dt) {
      // 1. Smooth Pointer Lerp for Luminous Spotlight
      this.glowX += (this.pointer.targetX - this.glowX) * 0.085;
      this.glowY += (this.pointer.targetY - this.glowY) * 0.085;

      if (this.glowEl) {
        const pctX = ((this.glowX / this.width) * 100).toFixed(1);
        const pctY = ((this.glowY / this.height) * 100).toFixed(1);
        this.glowEl.style.setProperty('--glow-x', `${pctX}%`);
        this.glowEl.style.setProperty('--glow-y', `${pctY}%`);
      }

      this.scrollVelocity *= 0.91;

      // 2. Update Entities (Floating Beans, Stars, Orbs)
      const mouseR = this.pointer.radius;
      const mouseX = this.glowX;
      const mouseY = this.glowY;

      this.entities.forEach(e => {
        if (e.isPopping) {
          e.popScale += 0.08;
          e.alpha = Math.max(0, e.alpha - 0.05);
          return;
        }

        // Harmonic oscillation
        e.phase += e.phaseSpeed;
        const wanderX = Math.sin(e.phase) * e.amplitude;

        // Twinkle pulse on stars
        if (e.type === 'star') {
          e.scalePulse = 0.82 + 0.28 * Math.sin(e.phase * 2.2);
        }

        // Tumble rotation
        e.rotation += e.rotSpeed;

        // Interactive Cursor Magnetic Gravity Vortex
        const dx = e.x - mouseX;
        const dy = e.y - mouseY;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseR && dist > 1) {
          const force = (1 - dist / mouseR) * 2.2;
          
          // Tangential swirl (stirring vortex around pointer)
          e.pushX += (-dy / dist) * force * 0.65;
          e.pushY += (dx / dist) * force * 0.65;

          // Gentle outward/inward balance
          const radial = dist < 70 ? 0.9 : -0.3; // Push if too close, pull gently if nearby
          e.pushX += (dx / dist) * force * radial;
          e.pushY += (dy / dist) * force * radial;

          // Increase spin slightly when interacting
          e.rotation += 0.02;
        }

        // Kinetic push decay
        e.pushX *= 0.92;
        e.pushY *= 0.92;

        // Position update
        e.x += e.vx + wanderX + e.pushX;
        e.y += e.vy - (this.scrollVelocity * 0.09) + e.pushY;

        // Subtle alpha pulsation
        e.alpha = e.baseAlpha * (0.85 + 0.15 * Math.sin(e.phase * 1.4));

        // Screen wrap
        if (e.y < -30) {
          e.y = this.height + 25;
          e.x = Math.random() * this.width;
        } else if (e.y > this.height + 30) {
          e.y = -25;
          e.x = Math.random() * this.width;
        }

        if (e.x < -30) {
          e.x = this.width + 25;
        } else if (e.x > this.width + 30) {
          e.x = -25;
        }
      });

      // 3. Update Sparks (Comet Trail & Explosions)
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.rotation += s.spin;
        s.alpha -= s.decay;

        if (s.alpha <= 0.02) {
          this.sparks.splice(i, 1);
        }
      }

      // 4. Update Ripples
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.radius += r.speed;
        r.alpha = Math.max(0, 0.65 * (1 - r.radius / r.maxRadius));
        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          this.ripples.splice(i, 1);
        }
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw Ripples
      this.ripples.forEach(r => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isDark
          ? `rgba(240, 195, 100, ${r.alpha.toFixed(3)})`
          : `rgba(200, 157, 75, ${r.alpha.toFixed(3)})`;
        this.ctx.lineWidth = Math.max(1.2, 3.2 * (1 - r.radius / r.maxRadius));
        this.ctx.stroke();

        // Inner harmonic gold ring
        if (r.radius > 25) {
          this.ctx.beginPath();
          this.ctx.arc(r.x, r.y, r.radius * 0.72, 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(188, 90, 43, ${(r.alpha * 0.55).toFixed(3)})`;
          this.ctx.lineWidth = 1.4;
          this.ctx.stroke();
        }
        this.ctx.restore();
      });

      // Draw Entities (Beans, Stars, Orbs)
      this.entities.forEach(e => {
        if (e.alpha <= 0.01) return;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, Math.min(1, e.alpha));

        if (e.type === 'bean') {
          this.drawBean(e);
        } else if (e.type === 'star') {
          this.drawStar(e);
        } else {
          this.drawOrb(e);
        }

        this.ctx.restore();
      });

      // Draw Sparks (Comet Trail & Click Bursts)
      this.sparks.forEach(s => {
        if (s.alpha <= 0.01) return;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        this.ctx.translate(s.x, s.y);
        this.ctx.rotate(s.rotation);

        this.ctx.beginPath();
        this.ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        this.ctx.fillStyle = s.color;
        this.ctx.shadowColor = s.color;
        this.ctx.shadowBlur = 6;
        this.ctx.fill();

        this.ctx.restore();
      });
    }

    // Draw Luminous Roasted Coffee Bean with 3D Cleft Groove
    drawBean(e) {
      const ctx = this.ctx;
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rotation);
      const scale = e.isPopping ? e.popScale : 1;
      ctx.scale(scale, scale);

      const w = e.size;
      const h = e.size * 1.55;

      // Outer bean body with rich shadow glow
      ctx.beginPath();
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.glowColor;
      ctx.shadowBlur = 10;
      ctx.fill();

      // Curved gloss light specular edge
      ctx.beginPath();
      ctx.ellipse(-w * 0.16, -h * 0.16, w * 0.24, h * 0.28, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.fill();

      // Signature curved central coffee bean groove
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.44);
      ctx.bezierCurveTo(w * 0.16, -h * 0.15, -w * 0.16, h * 0.15, 0, h * 0.44);
      ctx.strokeStyle = this.isDark ? '#1C0D06' : '#2D160A';
      ctx.lineWidth = Math.max(1.2, w * 0.14);
      ctx.stroke();
    }

    // Draw Gleaming 4-Point Atelier Star with Glint Core
    drawStar(e) {
      const ctx = this.ctx;
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rotation);
      const r = e.size * (e.scalePulse || 1) * (e.isPopping ? e.popScale : 1);

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const nextAngle = ((i + 1) * Math.PI) / 2;
        const midAngle = angle + Math.PI / 4;
        const innerR = r * 0.26;

        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.quadraticCurveTo(
          Math.cos(midAngle) * innerR,
          Math.sin(midAngle) * innerR,
          Math.cos(nextAngle) * r,
          Math.sin(nextAngle) * r
        );
      }
      ctx.closePath();
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.glowColor;
      ctx.shadowBlur = 14;
      ctx.fill();

      // Diamond specular core
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    // Draw Radiant Crema Orb
    drawOrb(e) {
      const ctx = this.ctx;
      ctx.translate(e.x, e.y);
      const r = e.size * (e.isPopping ? e.popScale : 1);

      const grad = ctx.createRadialGradient(0, 0, r * 0.12, 0, 0, r);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.35, e.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = e.glowColor;
      ctx.shadowBlur = 12;
      ctx.fill();
    }

    drawStatic() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.entities.forEach(e => {
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        if (e.type === 'bean') this.drawBean(e);
        else if (e.type === 'star') this.drawStar(e);
        else this.drawOrb(e);
        this.ctx.restore();
      });
    }

    loop() {
      const now = performance.now();
      const dt = Math.min(32, now - this.lastTime);
      this.lastTime = now;

      this.update(dt);
      this.draw();

      this.animFrameId = requestAnimationFrame(this.loop);
    }
  }

  // Auto-init on DOM readiness
  function start() {
    if (!window.AtelierAmbientBg) {
      window.AtelierAmbientBg = new AmbientGameEngine();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
