/**
 * fireworkSound.ts
 * Synthesizes realistic, pleasant firework celebratory sound effects using native Web Audio API.
 * - Zero external assets or network dependencies
 * - Sub-bass punch + filtered noise burst + sparkling crackles
 * - Stereo panning & dynamic randomization
 * - Mute control with localStorage persistence
 * - Respects prefers-reduced-motion
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

const STORAGE_KEY = 'graduation_sound_muted';

type SoundStateListener = (muted: boolean) => void;
const listeners = new Set<SoundStateListener>();

/** Check initial muted state from localStorage (defaults to false) */
function getInitialMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

let isMutedState = getInitialMuted();

export function isSoundMuted(): boolean {
  return isMutedState;
}

export function subscribeSoundState(fn: SoundStateListener): () => void {
  listeners.add(fn);
  fn(isMutedState);
  return () => {
    listeners.delete(fn);
  };
}

export function setSoundMuted(muted: boolean): void {
  isMutedState = muted;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
  } catch {
    // Ignore localStorage error in private mode
  }
  listeners.forEach((fn) => fn(muted));
}

export function toggleSound(): boolean {
  const next = !isMutedState;
  setSoundMuted(next);
  if (!next) {
    // Unlock and play a cheerful preview pop
    unlockAudio();
    playBurst({ pan: 0, pitch: 1.1, intensity: 0.7, withCrackles: true });
  }
  return next;
}

/** Check if reduced motion is requested */
function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Lazily initialize AudioContext and master nodes */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return null;

    audioCtx = new AudioCtxClass();

    // Studio-grade dynamic compressor to prevent distortion
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(8, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.2, audioCtx.currentTime);

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.38, audioCtx.currentTime);

    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  return audioCtx;
}

/** Create and cache 1 second of white noise for explosions & crackles */
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const bufferSize = Math.floor(ctx.sampleRate * 1.0);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  noiseBuffer = buffer;
  return buffer;
}

/**
 * Unlock AudioContext on user interaction
 */
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/** Helper to route audio through optional stereo panner */
function connectPanner(ctx: AudioContext, sourceNode: AudioNode, pan = 0): AudioNode {
  if (!masterGain) return sourceNode;
  if (typeof ctx.createStereoPanner === 'function' && pan !== 0) {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, pan)), ctx.currentTime);
    sourceNode.connect(panner);
    panner.connect(masterGain);
    return panner;
  }
  sourceNode.connect(masterGain);
  return masterGain;
}

/**
 * Play launch whistle / whoosh ("phíuuu")
 */
export function playLaunch(pan = 0, pitchMultiplier = 1): void {
  if (isMutedState || isReducedMotion()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  const startFreq = 220 * pitchMultiplier;
  const endFreq = 650 * pitchMultiplier;

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.28);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.connect(gain);
  connectPanner(ctx, gain, pan);

  osc.start(now);
  osc.stop(now + 0.3);
}

/**
 * Play firework burst (boom + noise impact + crackles)
 */
export interface BurstOptions {
  pan?: number;
  pitch?: number;
  intensity?: number;
  withCrackles?: boolean;
}

export function playBurst(options: BurstOptions = {}): void {
  if (isMutedState || isReducedMotion()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const { pan = 0, pitch = 1, intensity = 1, withCrackles = true } = options;
  const now = ctx.currentTime;
  const noise = getNoiseBuffer(ctx);

  // 1. Low-end punch (body thud)
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(130 * pitch, now);
  subOsc.frequency.exponentialRampToValueAtTime(38 * pitch, now + 0.16);

  subGain.gain.setValueAtTime(0.32 * intensity, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  subOsc.connect(subGain);
  connectPanner(ctx, subGain, pan);
  subOsc.start(now);
  subOsc.stop(now + 0.24);

  // 2. Mid/High noise explosion burst
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1100 * pitch, now);
  filter.Q.setValueAtTime(1.6, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.26 * intensity, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

  noiseSource.connect(filter);
  filter.connect(noiseGain);
  connectPanner(ctx, noiseGain, pan);

  noiseSource.start(now);
  noiseSource.stop(now + 0.35);

  // 3. Celebratory sizzling crackles (4-8 micro-pops)
  if (withCrackles) {
    const crackleCount = Math.floor(4 + Math.random() * 5);
    for (let i = 0; i < crackleCount; i++) {
      const crackleDelay = 0.08 + Math.random() * 0.38;
      const crackleTime = now + crackleDelay;
      const cracklePan = pan + (Math.random() - 0.5) * 0.35;

      const cSource = ctx.createBufferSource();
      cSource.buffer = noise;

      const cFilter = ctx.createBiquadFilter();
      cFilter.type = 'highpass';
      cFilter.frequency.setValueAtTime(2600 + Math.random() * 1800, crackleTime);

      const cGain = ctx.createGain();
      const cVol = (0.06 + Math.random() * 0.09) * intensity;
      cGain.gain.setValueAtTime(cVol, crackleTime);
      cGain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.035);

      cSource.connect(cFilter);
      cFilter.connect(cGain);
      connectPanner(ctx, cGain, cracklePan);

      cSource.start(crackleTime);
      cSource.stop(crackleTime + 0.04);
    }
  }
}

/**
 * Play soft sparkle crackle shower
 */
export function playSparkleShower(pan = 0): void {
  if (isMutedState || isReducedMotion()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const now = ctx.currentTime;
  const noise = getNoiseBuffer(ctx);
  const count = 6;

  for (let i = 0; i < count; i++) {
    const delay = i * 0.06 + Math.random() * 0.04;
    const time = now + delay;

    const source = ctx.createBufferSource();
    source.buffer = noise;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200 + Math.random() * 1200, time);
    filter.Q.setValueAtTime(3, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    source.connect(filter);
    filter.connect(gain);
    connectPanner(ctx, gain, pan + (Math.random() - 0.5) * 0.2);

    source.start(time);
    source.stop(time + 0.06);
  }
}

/**
 * Play soft firework (for closing section or wish submit)
 */
export function playSoftFirework(pan = 0): void {
  playBurst({
    pan,
    pitch: 1.15,
    intensity: 0.65,
    withCrackles: true,
  });
}

/**
 * Play synchronized firework audio sequence matching fireGrandCelebration in App.tsx
 */
export function playGrandFireworkSequence(): void {
  if (isMutedState || isReducedMotion()) return;
  unlockAudio();

  // Stage 1 (0ms): Dual corner launch & burst
  playLaunch(-0.4, 0.95);
  playLaunch(0.4, 1.05);
  setTimeout(() => {
    playBurst({ pan: -0.4, pitch: 1.0, intensity: 0.85, withCrackles: true });
    playBurst({ pan: 0.4, pitch: 1.05, intensity: 0.85, withCrackles: true });
  }, 160);

  // Stage 2 (280ms): Fast star-shaped bursts
  setTimeout(() => {
    playBurst({ pan: -0.25, pitch: 1.25, intensity: 0.75, withCrackles: true });
    playBurst({ pan: 0.25, pitch: 1.3, intensity: 0.75, withCrackles: true });
  }, 280);

  // Stage 3 (700ms): Central Grand Explosion
  setTimeout(() => {
    playBurst({ pan: 0, pitch: 0.88, intensity: 1.2, withCrackles: true });
    // Additional crackles shower 150ms after grand explosion
    setTimeout(() => {
      playSparkleShower(0);
    }, 140);
  }, 700);

  // Stage 4 (1250ms): Gentle shimmer rain
  setTimeout(() => {
    playSparkleShower(-0.3);
    playSparkleShower(0.3);
  }, 1250);
}
