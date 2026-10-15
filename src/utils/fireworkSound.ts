/**
 * fireworkSound.ts
 * Synthesizes realistic, punchy, celebratory firework sound effects using native Web Audio API.
 * - Engineered for loud, crisp audibility on phone speakers, laptops, and desktop headphones
 * - Handles browser autoplay restrictions with automatic queued celebration upon first interaction
 * - Zero external assets or network dependencies
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

function getInitialMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

let isMutedState = getInitialMuted();
let pendingCelebration = false;
let unlockListenersAttached = false;

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
    // Ignore in private browsing
  }
  listeners.forEach((fn) => fn(muted));
}

export function toggleSound(): boolean {
  const next = !isMutedState;
  setSoundMuted(next);
  if (!next) {
    unlockAudio();
    setTimeout(() => {
      playBurst({ pan: 0, pitch: 1.05, intensity: 1.2, withCrackles: true });
    }, 50);
  }
  return next;
}

function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Lazily initialize AudioContext with loud, clear master gain & compressor */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return null;

    audioCtx = new AudioCtxClass();

    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-12, audioCtx.currentTime);
    compressor.knee.setValueAtTime(24, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(6, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.15, audioCtx.currentTime);

    masterGain = audioCtx.createGain();
    // High master volume for crisp audibility on phone and laptop speakers
    masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }

  return audioCtx;
}

/** 1 second of white noise for explosions & crackles */
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
 * Automatically attaches listeners to unlock audio on the very first touch/click/scroll
 * and immediately triggers any queued celebration sound.
 */
export function setupAutoUnlock(): void {
  if (typeof window === 'undefined' || unlockListenersAttached) return;
  unlockListenersAttached = true;

  const handleInteraction = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (pendingCelebration && !isMutedState && !isReducedMotion()) {
          pendingCelebration = false;
          playGrandFireworkSequence();
        }
      }).catch(() => {});
    } else if (pendingCelebration && !isMutedState && !isReducedMotion()) {
      pendingCelebration = false;
      playGrandFireworkSequence();
    }
  };

  const events = ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'];
  events.forEach((evt) => {
    window.addEventListener(evt, handleInteraction, { once: true, passive: true });
  });
}

/**
 * Force unlock AudioContext on user action
 */
export function unlockAudio(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

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
  const startFreq = 280 * pitchMultiplier;
  const endFreq = 950 * pitchMultiplier;

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.28);

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  connectPanner(ctx, gain, pan);

  osc.start(now);
  osc.stop(now + 0.32);
}

export interface BurstOptions {
  pan?: number;
  pitch?: number;
  intensity?: number;
  withCrackles?: boolean;
}

/**
 * Play loud, punchy firework burst:
 * 1. Rich harmonic punch (audible on phones)
 * 2. High-energy noise explosion
 * 3. Sizzling celebratory crackles
 */
export function playBurst(options: BurstOptions = {}): void {
  if (isMutedState || isReducedMotion()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  const { pan = 0, pitch = 1, intensity = 1, withCrackles = true } = options;
  const now = ctx.currentTime;
  const noise = getNoiseBuffer(ctx);

  // 1. Transient click / initial contact (punchy start)
  const transientSource = ctx.createBufferSource();
  transientSource.buffer = noise;
  const transientFilter = ctx.createBiquadFilter();
  transientFilter.type = 'bandpass';
  transientFilter.frequency.setValueAtTime(1400 * pitch, now);
  transientFilter.Q.setValueAtTime(1.2, now);
  const transientGain = ctx.createGain();
  transientGain.gain.setValueAtTime(0.7 * intensity, now);
  transientGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  transientSource.connect(transientFilter);
  transientFilter.connect(transientGain);
  connectPanner(ctx, transientGain, pan);
  transientSource.start(now);
  transientSource.stop(now + 0.05);

  // 2. Harmonic Body Thump (Sawtooth filtered to 400Hz -> 80Hz for phone speaker harmonics)
  const subOsc = ctx.createOscillator();
  const subFilter = ctx.createBiquadFilter();
  const subGain = ctx.createGain();

  subOsc.type = 'sawtooth';
  subOsc.frequency.setValueAtTime(180 * pitch, now);
  subOsc.frequency.exponentialRampToValueAtTime(50 * pitch, now + 0.22);

  subFilter.type = 'lowpass';
  subFilter.frequency.setValueAtTime(450 * pitch, now);
  subFilter.frequency.exponentialRampToValueAtTime(90 * pitch, now + 0.22);

  subGain.gain.setValueAtTime(0.55 * intensity, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  subOsc.connect(subFilter);
  subFilter.connect(subGain);
  connectPanner(ctx, subGain, pan);
  subOsc.start(now);
  subOsc.stop(now + 0.3);

  // 3. Wide Noise Blast
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noise;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1250 * pitch, now);
  filter.Q.setValueAtTime(1.3, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.65 * intensity, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  noiseSource.connect(filter);
  filter.connect(noiseGain);
  connectPanner(ctx, noiseGain, pan);

  noiseSource.start(now);
  noiseSource.stop(now + 0.42);

  // 4. Celebratory sizzling crackles (6-10 distinct micro-pops)
  if (withCrackles) {
    const crackleCount = Math.floor(6 + Math.random() * 5);
    for (let i = 0; i < crackleCount; i++) {
      const crackleDelay = 0.07 + Math.random() * 0.45;
      const crackleTime = now + crackleDelay;
      const cracklePan = pan + (Math.random() - 0.5) * 0.4;

      const cSource = ctx.createBufferSource();
      cSource.buffer = noise;

      const cFilter = ctx.createBiquadFilter();
      cFilter.type = 'highpass';
      cFilter.frequency.setValueAtTime(2400 + Math.random() * 2200, crackleTime);

      const cGain = ctx.createGain();
      const cVol = (0.15 + Math.random() * 0.18) * intensity;
      cGain.gain.setValueAtTime(cVol, crackleTime);
      cGain.gain.exponentialRampToValueAtTime(0.001, crackleTime + 0.04);

      cSource.connect(cFilter);
      cFilter.connect(cGain);
      connectPanner(ctx, cGain, cracklePan);

      cSource.start(crackleTime);
      cSource.stop(crackleTime + 0.05);
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
  const count = 7;

  for (let i = 0; i < count; i++) {
    const delay = i * 0.05 + Math.random() * 0.04;
    const time = now + delay;

    const source = ctx.createBufferSource();
    source.buffer = noise;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000 + Math.random() * 1500, time);
    filter.Q.setValueAtTime(2.5, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    source.connect(filter);
    filter.connect(gain);
    connectPanner(ctx, gain, pan + (Math.random() - 0.5) * 0.25);

    source.start(time);
    source.stop(time + 0.07);
  }
}

export function playSoftFirework(pan = 0): void {
  playBurst({
    pan,
    pitch: 1.15,
    intensity: 0.8,
    withCrackles: true,
  });
}

/**
 * Play full synchronized firework audio sequence.
 * If audio context is suspended, queues the celebration and sets up auto-unlock!
 */
export function playGrandFireworkSequence(): void {
  if (isMutedState || isReducedMotion()) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') {
    pendingCelebration = true;
    setupAutoUnlock();
    return;
  }

  // Stage 1 (0ms): Dual corner launch & burst
  playLaunch(-0.4, 0.95);
  playLaunch(0.4, 1.05);
  setTimeout(() => {
    playBurst({ pan: -0.4, pitch: 1.0, intensity: 1.1, withCrackles: true });
    playBurst({ pan: 0.4, pitch: 1.05, intensity: 1.1, withCrackles: true });
  }, 160);

  // Stage 2 (280ms): Fast star-shaped bursts
  setTimeout(() => {
    playBurst({ pan: -0.25, pitch: 1.25, intensity: 0.95, withCrackles: true });
    playBurst({ pan: 0.25, pitch: 1.3, intensity: 0.95, withCrackles: true });
  }, 280);

  // Stage 3 (700ms): Central Grand Explosion
  setTimeout(() => {
    playBurst({ pan: 0, pitch: 0.9, intensity: 1.4, withCrackles: true });
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
