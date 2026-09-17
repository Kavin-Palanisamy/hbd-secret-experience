/**
 * Web Audio API Microphone detector for detecting blowing sounds onto candles.
 * Safely handles permissions, audio analysis, and proper resource teardown.
 */

export class MicBlowDetector {
  private audioCtx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private isListening: boolean = false;
  private animFrameId: number | null = null;
  private onBlowCallback: (() => void) | null = null;
  private blowStreak: number = 0;

  public async startListening(
    onReady?: () => void,
    onBlow?: () => void,
    onError?: () => void
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (onBlow) this.onBlowCallback = onBlow;
      this.blowStreak = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.stream = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(stream);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.2;

      // Bandpass filter to isolate breath / blowing turbulent noise
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.0;

      source.connect(filter);
      filter.connect(this.analyser);

      this.isListening = true;
      if (onReady) onReady();
      this.detectLoop();

      return { success: true };
    } catch (err: unknown) {
      this.stopListening();
      if (onError) onError();
      const errorMessage = err instanceof Error ? err.message : 'Microphone permission denied';
      return { success: false, error: errorMessage };
    }
  }

  private detectLoop = () => {
    if (!this.isListening || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate volume in breath frequencies
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;

    // Threshold for blowing sound (turbulent acoustic energy)
    if (average > 36) {
      this.blowStreak++;
      if (this.blowStreak >= 3) {
        if (this.onBlowCallback) {
          this.onBlowCallback();
        }
        this.blowStreak = 0;
      }
    } else {
      this.blowStreak = Math.max(0, this.blowStreak - 1);
    }

    this.animFrameId = requestAnimationFrame(this.detectLoop);
  };

  public stopListening() {
    this.isListening = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    this.analyser = null;
    this.onBlowCallback = null;
  }
}

export const micBlowDetector = new MicBlowDetector();
