import React, { useMemo, useRef, useState } from 'react';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { SpinWheelConfig } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

const PALETTE = [
  '#6366F1', '#F59E0B', '#10B981', '#EC4899',
  '#0EA5E9', '#8B5CF6', '#EF4444', '#14B8A6',
  '#F97316', '#84CC16', '#06B6D4', '#A855F7',
];

interface SpinWheelWidgetProps {
  config: SpinWheelConfig;
  onSpinResult?: (label: string) => void;
}

export const SpinWheelWidget: React.FC<SpinWheelWidgetProps> = ({ config, onSpinResult }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const pointerRef = useRef<HTMLDivElement>(null);

  const segments = config.segments.filter(s => s.label.trim());
  const count = Math.max(segments.length, 1);
  const segmentAngle = 360 / count;

  const gradient = useMemo(() => {
    if (!segments.length) return '#e2e8f0';
    const stops = segments.map((seg, i) => {
      const start = i * segmentAngle;
      const color = seg.color || PALETTE[i % PALETTE.length];
      return `${color} ${start}deg ${start + segmentAngle}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [segments, segmentAngle]);

  const spin = () => {
    if (spinning || !segments.length) return;
    triggerHapticFeedback('medium');
    setSpinning(true);
    setResult(null);

    const winningIndex = Math.floor(Math.random() * segments.length);
    const targetAngle = 360 * (6 + Math.floor(Math.random() * 3)) + (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    const current = rotation % 360;
    const next = rotation - current + targetAngle;

    setRotation(next);
    setSpinCount(c => c + 1);

    setTimeout(() => {
      setSpinning(false);
      setResult(segments[winningIndex].label);
      triggerHapticFeedback('success');
      onSpinResult?.(segments[winningIndex].label);
    }, 5200);
  };

  const reset = () => {
    setRotation(0);
    setResult(null);
    setSpinCount(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5">
      {/* Background image layer */}
      {config.backgroundImageUrl && (
        <>
          <img
            src={config.backgroundImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white/95 pointer-events-none" />
        </>
      )}

      <div className="relative p-6 sm:p-8 text-center">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">{config.title}</h3>
        {config.description && (
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 font-medium leading-relaxed">{config.description}</p>
        )}

        {/* Wheel */}
        <div className="relative mx-auto mt-8 h-72 w-72 sm:h-80 sm:w-80">
          {/* Pointer */}
          <div
            ref={pointerRef}
            className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
            style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '26px solid #0f172a', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}
          />

          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full shadow-2xl shadow-slate-900/20 ring-8 ring-slate-900/90" />

          {/* Rotating wheel */}
          <div
            className="absolute inset-2 rounded-full transition-transform duration-[5000ms]"
            style={{
              background: gradient,
              transform: `rotate(${rotation}deg)`,
              transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.08, 1)',
            }}
          >
            {/* Segment dividers + labels */}
            {segments.map((seg, i) => {
              const angle = i * segmentAngle;
              return (
                <div
                  key={seg.id}
                  className="absolute left-1/2 top-1/2 origin-top"
                  style={{ transform: `rotate(${angle + segmentAngle / 2}deg) translateY(-50%)`, width: 0, height: 0 }}
                >
                  <span
                    className="absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-black text-white"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)', writingMode: 'horizontal-tb' }}
                  >
                    {seg.label.length > 16 ? seg.label.slice(0, 15) + '…' : seg.label}
                  </span>
                </div>
              );
            })}
            {/* Center hub */}
            <div className="absolute left-1/2 top-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg ring-4 ring-slate-900/80 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {!result ? (
            <button
              onClick={spin}
              disabled={spinning || !segments.length}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 px-10 py-4 text-lg font-black text-white shadow-xl shadow-rose-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {spinning ? (
                <><RotateCcw className="h-5 w-5 animate-spin" /> Spinning…</>
              ) : (
                <>{config.buttonLabel || 'SPIN THE WHEEL'} <Sparkles className="h-5 w-5" /></>
              )}
            </button>
          ) : (
            <div className="animate-in zoom-in-95 duration-300 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 px-8 py-6 shadow-lg">
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <Trophy className="h-6 w-6" />
                <span className="text-xs font-black uppercase tracking-widest">{config.resultMessage || 'You landed on'}</span>
              </div>
              <p className="mt-2 text-3xl font-black text-slate-900">{result}</p>
              {spinCount > 0 && (
                <button onClick={spin} className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4">
                  Spin again
                </button>
              )}
            </div>
          )}
          {result && spinCount > 1 && (
            <button onClick={reset} className="text-[11px] font-bold text-slate-400 hover:text-slate-600">
              Reset wheel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
