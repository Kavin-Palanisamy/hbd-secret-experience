/**
 * Web Audio API synthesized soundtrack and sound designer for Beast Mode.
 * No external assets needed - zero loading failure, real-time procedural synthesis.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private currentMode: 'ambient' | 'beast' = 'ambient';
  private bgTimer: number | null = null;
  private wishOsc: OscillatorNode | null = null;
  private wishGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(0.32, this.ctx.currentTime);

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.musicGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : (this.currentMode === 'beast' ? 0.22 : 0.18);
      this.musicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.32;
      this.sfxGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMode(mode: 'ambient' | 'beast') {
    this.currentMode = mode;
  }

  public startMusic(mode: 'ambient' | 'beast' = 'ambient') {
    this.initContext();
    if (!this.ctx) return;
    this.currentMode = mode;
    this.stopMusic();
    this.isMusicPlaying = true;

    if (mode === 'beast') {
      this.runBeastSynthLoop();
    } else {
      this.runAmbientLoop();
    }
  }

  private runAmbientLoop() {
    const chords = [
      [146.83, 220.00, 293.66, 440.00], // D add9
      [196.00, 293.66, 369.99, 587.33], // G maj7
      [220.00, 261.63, 329.63, 440.00], // A sus / min
      [164.81, 246.94, 329.63, 493.88]  // E min
    ];
    let chordIdx = 0;

    const tick = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.currentMode !== 'ambient') return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const noteGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420 + idx * 75, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

        const duration = 5.5;
        const now = this.ctx.currentTime;

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.045, now + 1.8);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + duration + 0.5);
      });

      this.bgTimer = window.setTimeout(tick, 4800);
    };

    tick();
  }

  private runBeastSynthLoop() {
    // Cyber energetic arpeggiator (synth bass + pulsing lead)
    const baseFreqs = [110, 130.81, 146.83, 164.81, 196.00];
    let step = 0;

    const synthTick = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.currentMode !== 'beast') return;

      const now = this.ctx.currentTime;
      const freq = baseFreqs[step % baseFreqs.length] * (step % 4 === 0 ? 1 : (step % 2 === 0 ? 2 : 1.5));
      step++;

      // Synth Bass Osc
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.sin(step) * 400, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.4);

      this.bgTimer = window.setTimeout(synthTick, 220);
    };

    synthTick();
  }

  public stopMusic() {
    if (this.bgTimer) {
      clearTimeout(this.bgTimer);
      this.bgTimer = null;
    }
    this.isMusicPlaying = false;
  }

  // --- Sound Effects ---

  public playClick() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.04);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playTerminalKey() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 600, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playBeastDrop() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Sub bass drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.8);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.3);
  }

  public playGlitch() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.setValueAtTime(800, now + 0.05);
    osc.frequency.setValueAtTime(120, now + 0.1);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playSuccessChime() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  public playBossHit() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playBossDefeat() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Epic 8-bit fanfare
    const melody = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;

    melody.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.14;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  public playCandlePuff() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playTransition() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.7);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.7);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.1);
  }

  public playEnvelopeOpen() {
    this.playSuccessChime();
  }

  public startWishHum() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain || this.wishOsc) return;

    const now = this.ctx.currentTime;
    this.wishOsc = this.ctx.createOscillator();
    this.wishGain = this.ctx.createGain();

    this.wishOsc.type = 'sine';
    this.wishOsc.frequency.setValueAtTime(180, now);

    this.wishGain.gain.setValueAtTime(0.001, now);
    this.wishGain.gain.linearRampToValueAtTime(0.08, now + 0.3);

    this.wishOsc.connect(this.wishGain);
    this.wishGain.connect(this.sfxGain);
    this.wishOsc.start(now);
  }

  public updateWishHum(progress: number) {
    if (!this.wishOsc || !this.wishGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const targetFreq = 180 + progress * 420;
    const targetGain = 0.05 + progress * 0.12;
    this.wishOsc.frequency.setTargetAtTime(targetFreq, now, 0.05);
    this.wishGain.gain.setTargetAtTime(targetGain, now, 0.05);
  }

  public stopWishHum() {
    if (this.wishOsc && this.wishGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.wishGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      setTimeout(() => {
        try {
          this.wishOsc?.stop();
          this.wishOsc?.disconnect();
          this.wishGain?.disconnect();
        } catch {}
        this.wishOsc = null;
        this.wishGain = null;
      }, 120);
    }
  }

  public playWishExplosion() {
    this.stopWishHum();
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const chords = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.1, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 2.6);
    });
  }

  public playBeastImpact() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  public playStarCatch() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playGiftOpen() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [440, 659.25, 880, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  public playTypingBeep() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playCelebrationChime() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const chord = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00];
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 2.9);
    });
  }
}

export const audioEngine = new AudioEngine();
