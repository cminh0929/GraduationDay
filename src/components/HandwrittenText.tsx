/**
 * HandwrittenText — SVG stroke-dashoffset text reveal animation.
 *
 * Approach & Honest Limitation
 * ─────────────────────────────
 * True "per-stroke handwriting" (each individual brush stroke within a glyph,
 * drawn in order) requires extracting bezier glyph paths from the font file via
 * an API like opentype.js. That is NOT what this component does, and it is NOT
 * achievable with plain HTML/SVG text rendering.
 *
 * What this component DOES:
 *  • Renders each WORD in an absolutely-positioned SVG <text> element that
 *    inherits the exact same font (Noto Serif, size, weight, letter-spacing)
 *    as the surrounding HTML element.
 *  • Animates stroke-dashoffset from LARGE → 0 so the full glyph-outline strokes
 *    of that word are "drawn" progressively (all strokes simultaneously within one
 *    word, but staggered word-by-word left→right).
 *  • After the animation completes, swaps back to plain HTML text — no layers
 *    remain on top of the text; original color and sharpness are restored.
 *
 * Vietnamese diacritics are fully preserved: SVG <text> uses the browser's font
 * renderer with the inherited font, so ắ, ộ, ề, etc. render identically to HTML.
 *
 * The visual effect: word-by-word left→right "stroke drawing" of glyph outlines.
 * This is NOT a typewriter (no character pop-in) and NOT a shimmer/clip sweep.
 */

import React, {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useMemo,
} from 'react';

// Large enough to exceed the total glyph-outline path length of any word
// rendered in a serif font at up to ~72 px. (Typical word ≈ 800–3500 px of path.)
const STROKE_DASH = 6000;

// ─── Keyframe injection (once per session) ───────────────────────────────────
let _keyframeInjected = false;
function ensureKeyframe() {
  if (_keyframeInjected || typeof document === 'undefined') return;
  _keyframeInjected = true;
  const s = document.createElement('style');
  s.textContent = `@keyframes hw-draw { from { stroke-dashoffset: ${STROKE_DASH}; } to { stroke-dashoffset: 0; } }`;
  document.head.appendChild(s);
}

// ─── Baseline measurement via Canvas TextMetrics ─────────────────────────────
function measureBaseline(
  computedFont: string,
  elementHeight: number,
): number {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = computedFont;
      // Use a glyph that covers both diacritic ascent and descender
      const m = ctx.measureText('Ấg');
      const asc = (m as TextMetrics & { fontBoundingBoxAscent?: number }).fontBoundingBoxAscent;
      const desc = (m as TextMetrics & { fontBoundingBoxDescent?: number }).fontBoundingBoxDescent;
      if (typeof asc === 'number' && typeof desc === 'number' && asc + desc > 0) {
        // Center the em-box within the line box, baseline at ascent from em-box top
        const emH = asc + desc;
        const leading = Math.max(0, (elementHeight - emH) / 2);
        return leading + asc;
      }
    }
  } catch {
    // ignore
  }
  // Fallback: empirically ~78% of line-box height is a good serif baseline estimate
  return elementHeight * 0.78;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

interface WordDatum {
  word: string;
  x: number;
  baseline: number;
}

export interface HandwrittenTextProps {
  text: string;
  /** Which HTML element to render (for correct DOM semantics). */
  as?: TagName;
  /** CSS classes applied to the element — include font/color utilities. */
  className?: string;
  /**
   * Stroke color during animation — must match the element's text color so the
   * glyph outlines look like the final text. E.g. '#15305B', '#947229'.
   */
  strokeColor: string;
  /** Stroke width in SVG user units. Thinner = more delicate line. Default 0.5. */
  strokeWidth?: number;
  /** Seconds before the first word starts animating. */
  startDelay?: number;
  /** Duration in seconds for drawing each word's stroke path. */
  wordDuration?: number;
  /** Extra delay in seconds between consecutive word starts. */
  wordStagger?: number;
  /** Pass useReducedMotion() result; when truthy, renders plain text instantly. */
  shouldReduceMotion: boolean | null;
  /** Called once after the last word animation fully completes. */
  onDone?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const HandwrittenText: React.FC<HandwrittenTextProps> = ({
  text,
  as = 'span',
  className = '',
  strokeColor,
  strokeWidth = 0.5,
  startDelay = 0,
  wordDuration = 0.45,
  wordStagger = 0.12,
  shouldReduceMotion,
  onDone,
}) => {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const containerRef = useRef<HTMLElement>(null);
  const wordSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  type Phase = 'init' | 'animating' | 'done';
  const [phase, setPhase] = useState<Phase>(shouldReduceMotion ? 'done' : 'init');

  const [svgData, setSvgData] = useState<{
    w: number;
    h: number;
    words: WordDatum[];
  } | null>(null);

  // ── Measure word positions synchronously after first paint ──────────────────
  useLayoutEffect(() => {
    if (phase !== 'init' || shouldReduceMotion) return;
    const container = containerRef.current;
    if (!container) return;

    ensureKeyframe();

    const cr = container.getBoundingClientRect();
    const computedFont = window.getComputedStyle(container).font;

    const wordData: WordDatum[] = [];
    wordSpanRefs.current.slice(0, words.length).forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      wordData.push({
        word: words[i] ?? '',
        x: r.left - cr.left,
        baseline: r.top - cr.top + measureBaseline(computedFont, r.height),
      });
    });

    if (wordData.length > 0) {
      setSvgData({ w: container.offsetWidth, h: container.offsetHeight, words: wordData });
      setPhase('animating');
    }
  }, [phase, shouldReduceMotion, words]);

  // ── Set done timer after last word animation completes ──────────────────────
  useEffect(() => {
    if (phase !== 'animating') return;
    const ms =
      (startDelay + Math.max(0, words.length - 1) * wordStagger + wordDuration + 0.12) * 1000;
    const id = setTimeout(() => {
      setPhase('done');
      onDone?.();
    }, ms);
    return () => clearTimeout(id);
  }, [phase, startDelay, words.length, wordStagger, wordDuration, onDone]);

  // ── Done / reduced-motion: clean HTML, nothing extra ───────────────────────
  if (phase === 'done' || shouldReduceMotion) {
    return React.createElement(as, { className }, text);
  }

  // Invisible inline word spans keep the layout identical to the final HTML text.
  // `visibility: hidden` keeps them in flow; `display: none` would collapse space.
  const invisibleWords = (
    <span className="invisible whitespace-pre-wrap" aria-hidden="true">
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span ref={(el) => { wordSpanRefs.current[i] = el; }}>{w}</span>
          {i < words.length - 1 && '\u00A0' /* non-breaking space preserves spacing */}
        </React.Fragment>
      ))}
    </span>
  );

  // ── Init phase: render invisible text so useLayoutEffect can measure ────────
  if (phase === 'init') {
    return React.createElement(
      as,
      { ref: containerRef as React.Ref<HTMLElement>, className: `${className} relative`, 'aria-label': text },
      invisibleWords,
    );
  }

  // ── Animating phase: SVG overlay + invisible HTML placeholder ───────────────
  return React.createElement(
    as,
    { ref: containerRef as React.Ref<HTMLElement>, className: `${className} relative`, 'aria-label': text },
    <>
      {invisibleWords}
      {svgData && (
        <svg
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={svgData.w}
          height={svgData.h}
        >
          {svgData.words.map(({ word, x, baseline }, i) => (
            <text
              key={i}
              x={x}
              y={baseline}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={STROKE_DASH}
              strokeDashoffset={STROKE_DASH}
              style={{
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 'inherit',
                fontStyle: 'inherit',
                letterSpacing: 'inherit',
                // Animation: hw-draw drives stroke-dashoffset from STROKE_DASH → 0
                animation: `hw-draw ${wordDuration}s linear ${
                  startDelay + i * wordStagger
                }s forwards`,
              }}
            >
              {word}
            </text>
          ))}
        </svg>
      )}
    </>,
  );
};
