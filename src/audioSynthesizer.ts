// ============================================================================
// PROJECT 2K75: PROCEDURAL WEB AUDIO SYNTHESIZER
// Zero external assets. All audio is synthesized directly via Web Audio API.
// ============================================================================

export class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  
  // Singularity / Critical Climax Nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  // Prologue / Ambient Background Nodes
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;

  /**
   * Lazily initialize or resume the AudioContext to comply with browser autoplay policies.
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {
        // Safe catch if user hasn't interacted with document yet
      });
    }

    return this.ctx;
  }

  /**
   * Continuous deep space ambient drone for menus, intros, and VideoPrologue.
   */
  public startAmbientDrone(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (this.ambientOsc1 || this.ambientOsc2) return; // Prevent multiple overlapping drones

      const now = ctx.currentTime;

      // Low-pass filter to keep the sound soft and atmospheric
      this.ambientFilter = ctx.createBiquadFilter();
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(320, now);

      // Two low-frequency sine oscillators slightly detuned to create a gentle beating hum
      this.ambientOsc1 = ctx.createOscillator();
      this.ambientOsc2 = ctx.createOscillator();

      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(65.41, now); // C2 note

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(66.2, now); // Slight detune for subtle movement

      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      // Gentle fade-in over 2 seconds
      this.ambientGain.gain.linearRampToValueAtTime(0.08, now + 2.0);

      // Route audio nodes
      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * Smoothly stops and releases the ambient prologue drone nodes.
   */
  public stopAmbientDrone(): void {
    try {
      const ctx = this.ctx;
      if (!ctx || !this.ambientGain) return;

      const now = ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 0.8);

      setTimeout(() => {
        if (this.ambientOsc1) {
          this.ambientOsc1.stop();
          this.ambientOsc1.disconnect();
          this.ambientOsc1 = null;
        }
        if (this.ambientOsc2) {
          this.ambientOsc2.stop();
          this.ambientOsc2.disconnect();
          this.ambientOsc2 = null;
        }
        if (this.ambientFilter) {
          this.ambientFilter.disconnect();
          this.ambientFilter = null;
        }
        if (this.ambientGain) {
          this.ambientGain.disconnect();
          this.ambientGain = null;
        }
      }, 850);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * High-tech HUD telemetry chirp for discoveries, selector navigation, and console inputs.
   */
  public playTelemetryPing(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.exponentialRampToValueAtTime(2640, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * Dynamic radar scan tone that rises in frequency with scan progress.
   * @param progress Percentage of scan (0 to 100)
   */
  public playScanSweep(progress: number): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 400 + (Math.max(0, Math.min(progress, 100)) / 100) * 1000;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 60, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * Mechanical shutter clack triggered upon dossier verification or archival actions.
   */
  public playShutterClack(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.04;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.04);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * Harsh electrical blowout and digital crash noise for the DOOMSNEXUS breakdown.
   */
  public playCrashGlitchBurst(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 0.85;

      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(5000, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + duration);

      const subOsc = ctx.createOscillator();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.7);

      const distortion = ctx.createWaveShaper();
      const nSamples = 256;
      const curve = new Float32Array(nSamples);
      const deg = Math.PI / 180;
      const k = 60;
      for (let i = 0; i < nSamples; ++i) {
        const x = (i * 2) / nSamples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      distortion.curve = curve;
      distortion.oversample = '4x';

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.7, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(distortion);
      subOsc.connect(distortion);
      distortion.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(now);
      subOsc.start(now);
      whiteNoise.stop(now + duration);
      subOsc.stop(now + duration);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * Continuous ominous binaural dissonance drone for singularity / climax state.
   */
  public startSingularityDissonance(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (this.droneOsc1 || this.droneOsc2) return;

      const now = ctx.currentTime;
      this.droneOsc1 = ctx.createOscillator();
      this.droneOsc2 = ctx.createOscillator();
      this.droneGain = ctx.createGain();

      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, now);

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(58.5, now);

      this.droneGain.gain.setValueAtTime(0.01, now);
      this.droneGain.gain.linearRampToValueAtTime(0.12, now + 1.5);

      this.droneOsc1.connect(this.droneGain);
      this.droneOsc2.connect(this.droneGain);
      this.droneGain.connect(ctx.destination);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
    } catch {
      // Audio safety guard
    }
  }

  /**
   * Stop the singularity drone and fade out smoothly.
   */
  public stopSingularityDissonance(): void {
    try {
      const ctx = this.ctx;
      if (!ctx || !this.droneGain) return;

      const now = ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.001, now + 0.5);

      setTimeout(() => {
        if (this.droneOsc1) {
          this.droneOsc1.stop();
          this.droneOsc1.disconnect();
          this.droneOsc1 = null;
        }
        if (this.droneOsc2) {
          this.droneOsc2.stop();
          this.droneOsc2.disconnect();
          this.droneOsc2 = null;
        }
        if (this.droneGain) {
          this.droneGain.disconnect();
          this.droneGain = null;
        }
      }, 550);
    } catch {
      // Audio safety guard
    }
  }
}

export const audioSynth = new AudioSynthesizer();
export default audioSynth;