/* ==========================================================================
   ATELIER SPECIALTY ROASTERS — PRELOADER CINEMA
   High-end code-crafted intro animation:
   - Streaming liquid espresso pour
   - Filling golden crema bowl with rising aromatic steam
   - Gold foil wax stamp seal impact with tactile audio
   - Luxury serif brandmark typography
   - Smooth iris/curtain reveal once per session
   ========================================================================== */

(function () {
  'use strict';

  function initPreloader() {
    const preloaderEl = document.getElementById('atelier-preloader');
    if (!preloaderEl) return;

    // Check session storage (Play once per session)
    const hasSeenIntro = sessionStorage.getItem('atelier_intro_shown');
    if (hasSeenIntro) {
      preloaderEl.style.display = 'none';
      return;
    }

    const progressBar = preloaderEl.querySelector('.preloader-progress-fill');
    const skipBtn = preloaderEl.querySelector('#preloader-skip-btn');
    let isDismissed = false;

    function dismissPreloader() {
      if (isDismissed) return;
      isDismissed = true;
      sessionStorage.setItem('atelier_intro_shown', 'true');

      preloaderEl.classList.add('is-dissolving');
      setTimeout(() => {
        preloaderEl.style.display = 'none';
        preloaderEl.classList.remove('is-dissolving');
      }, 750);
    }

    // Skip button click
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dismissPreloader();
      });
    }

    // Sound triggers
    setTimeout(() => {
      if (window.AtelierAudio && !preloaderEl.classList.contains('is-dissolving')) {
        if (window.AtelierAudio.playHeavyStampSound) {
          window.AtelierAudio.playHeavyStampSound();
        }
      }
    }, 750);

    // Progress bar fill animation
    if (progressBar) {
      setTimeout(() => {
        progressBar.style.width = '100%';
      }, 80);
    }

    // Auto dismiss after completion (2.2 seconds)
    setTimeout(() => {
      dismissPreloader();
    }, 2250);
  }

  // Allow manual replay anytime
  window.replayIntroAnimation = function () {
    sessionStorage.removeItem('atelier_intro_shown');
    const preloaderEl = document.getElementById('atelier-preloader');
    if (preloaderEl) {
      preloaderEl.style.display = 'flex';
      preloaderEl.classList.remove('is-dissolving');
      initPreloader();
    }
  };

  // Run on DOM load or immediate if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
