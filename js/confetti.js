/* ==========================================================================
   ATELIER REWARD & WELCOME CELEBRATION PARTICLES
   Lightweight canvas particles with champagne gold and warm coffee confetti
   ========================================================================== */

function launchAtelierCelebration() {
  const canvas = document.createElement('canvas');
  canvas.id = 'atelier-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '99999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#C89D4B', '#BC5A2B', '#E2BC6E', '#3D302B', '#FAF4EA', '#D48B55'];
  const particles = [];
  const particleCount = 75;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * (0.2 + Math.random() * 0.6),
      y: height * 0.45 + (Math.random() * 40 - 20),
      vx: (Math.random() - 0.5) * 16,
      vy: -(Math.random() * 14 + 6),
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      gravity: 0.38,
      opacity: 1,
      decay: Math.random() * 0.012 + 0.008
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, width, height);
    let activeCount = 0;

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.opacity -= p.decay;

      if (p.opacity > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        // Rectangular luxury ribbon flakes
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
        ctx.restore();
      }
    }

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  update();
}

window.launchAtelierCelebration = launchAtelierCelebration;
