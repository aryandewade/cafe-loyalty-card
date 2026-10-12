/* ==========================================================================
   ATELIER AUDIO & HAPTIC SYNTHESIZER
   Zero-external-asset Web Audio API physics engine for physical tactile feedback
   ========================================================================== */

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Realistic Physical Ink Stamp Thud (wood handle impact + paper press)
  playStampSound() {
    this.playHeavyStampSound();
  }

  // Multi-layer Heavy Brass & Wood Stamp Impact
  playHeavyStampSound() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // 1. Heavy resonant wood thud (body of lathe-turned walnut stamper)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.16);

      gain.gain.setValueAtTime(0.48, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);

      // 2. Brass die impact ping (solid brass collar clack)
      const brassOsc = this.ctx.createOscillator();
      const brassGain = this.ctx.createGain();
      brassOsc.type = 'sine';
      brassOsc.frequency.setValueAtTime(1450, t);
      brassOsc.frequency.exponentialRampToValueAtTime(800, t + 0.05);

      brassGain.gain.setValueAtTime(0.12, t);
      brassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      brassOsc.connect(brassGain);
      brassGain.connect(this.ctx.destination);
      brassOsc.start(t);
      brassOsc.stop(t + 0.06);

      // 3. Wet ink suction squelch & paper snap
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1600;
      noiseFilter.Q.value = 1.8;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.24, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  // Downward stamp tool descent whoosh
  playStampWhoosh() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.exponentialRampToValueAtTime(1400, t + 0.1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch (e) {}
  }

  // Celebratory Harmonious Chime (Champagne / Coffee Bell)
  playRewardUnlock() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.85);
      });
    } catch (e) {}
  }

  // Card Flip / Swoosh
  playFlipSound() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch (e) {}
  }

  // Subtle Haptic Button Tap
  playTap() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  }

  // Realistic Cash Register / Coin Chime (Transaction created & points earned)
  playCashRegister() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // High bright metallic coin ring
      const freqs = [987.77, 1318.51, 1567.98];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.04);
        gain.gain.setValueAtTime(0, t + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, t + idx * 0.04 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.5);
      });
      // Low till drawer click
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, t);
      osc2.frequency.exponentialRampToValueAtTime(90, t + 0.09);
      gain2.gain.setValueAtTime(0.22, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.11);
    } catch (e) {}
  }

  // Juicy Candy Crush Bubble / Node Tap Pop
  playCandyClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(740, t + 0.07);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {}
  }

  // Candy Crush Star Slam Impact Sound with Climbing Pitch (Star 1, 2, 3)
  playStarSlam(starIndex = 1) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const pitches = [659.25, 830.61, 1046.50]; // E5, G#5, C6
      const freq = pitches[Math.min(2, Math.max(0, starIndex - 1))];

      // Primary crystalline bell ping
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);

      // Sub-thud impact
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(160, t);
      thudOsc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
      thudGain.gain.setValueAtTime(0.3, t);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(t);
      thudOsc.stop(t + 0.15);
    } catch (e) {}
  }

  // Triumphant Candy Crush Level-Up Major Chord Fanfare (Do-Mi-Sol-Do flourish)
  playCandyFanfare() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [
        { f: 523.25, time: 0, dur: 0.12 },     // C5
        { f: 659.25, time: 0.08, dur: 0.12 },  // E5
        { f: 783.99, time: 0.16, dur: 0.14 },  // G5
        { f: 1046.50, time: 0.25, dur: 0.6 }   // C6 (held)
      ];

      notes.forEach(({ f, time, dur }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + time);
        gain.gain.setValueAtTime(0.25, t + time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + time);
        osc.stop(t + time + dur);
      });
    } catch (e) {}
  }
}

window.AtelierAudio = new AudioSynthesizer();
