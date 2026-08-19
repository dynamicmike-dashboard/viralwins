import React, { useState } from 'react';
import { Disc3, Plus, Trash2, ImageIcon, FileCode } from 'lucide-react';
import { SpinWheelConfig, SpinWheelSegment } from '../../types';
import { triggerHapticFeedback } from '../../utils/haptics';

interface SpinWheelEditorProps {
  config: SpinWheelConfig;
  onChange: (config: SpinWheelConfig) => void;
}

const PRESET_BACKGROUNDS = [
  { title: 'Festive Confetti', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Neon Celebration', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Minimal Studio', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80' },
];

export const SpinWheelEditor: React.FC<SpinWheelEditorProps> = ({ config, onChange }) => {
  const update = <K extends keyof SpinWheelConfig>(field: K, value: SpinWheelConfig[K]) => {
    onChange({ ...config, [field]: value });
  };

  const addSegment = () => {
    triggerHapticFeedback('light');
    const seg: SpinWheelSegment = { id: `seg-${Date.now()}`, label: `Prize ${config.segments.length + 1}` };
    update('segments', [...config.segments, seg]);
  };

  const updateSegment = (id: string, label: string) => {
    update('segments', config.segments.map(s => s.id === id ? { ...s, label } : s));
  };

  const removeSegment = (id: string) => {
    triggerHapticFeedback('warning');
    update('segments', config.segments.filter(s => s.id !== id));
  };

  const loadSample = () => {
    triggerHapticFeedback('light');
    onChange({
      ...config,
      title: 'Spin & Win Big!',
      description: 'One free spin for every entrant. Prizes change weekly — try your luck!',
      buttonLabel: 'SPIN TO WIN',
      segments: [
        { id: 's1', label: '10% OFF' },
        { id: 's2', label: 'Free Shipping' },
        { id: 's3', label: 'Try Again' },
        { id: 's4', label: '$5 Gift Card' },
        { id: 's5', label: '20% OFF' },
        { id: 's6', label: 'Almost!' },
        { id: 's7', label: 'Free Drink' },
        { id: 's8', label: 'GRAND PRIZE' },
      ],
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title & Description */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Wheel Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Spin & Win Big!"
            className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Description</label>
          <textarea
            rows={2}
            value={config.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="One free spin for every entrant. Prizes change weekly!"
            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Spin Button Label</label>
            <input
              type="text"
              value={config.buttonLabel || ''}
              onChange={(e) => update('buttonLabel', e.target.value)}
              placeholder="SPIN TO WIN"
              className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Result Message</label>
            <input
              type="text"
              value={config.resultMessage || ''}
              onChange={(e) => update('resultMessage', e.target.value)}
              placeholder="You landed on"
              className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-indigo-600" /> Background Image (Optional)
        </label>
        <input
          type="text"
          value={config.backgroundImageUrl || ''}
          onChange={(e) => update('backgroundImageUrl', e.target.value)}
          placeholder="https://example.com/bg.jpg"
          className="w-full bg-white border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 font-mono focus:outline-none focus:border-indigo-600"
        />
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {PRESET_BACKGROUNDS.map(preset => (
            <button
              key={preset.title}
              type="button"
              onClick={() => update('backgroundImageUrl', preset.url)}
              className={`text-left text-[10px] p-2 rounded-lg border transition truncate font-semibold ${
                config.backgroundImageUrl === preset.url
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white hover:border-indigo-400 text-slate-600'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Segments */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Disc3 className="w-4 h-4 text-indigo-600" /> Wheel Segments ({config.segments.length})
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="text-[10px] text-slate-600 hover:text-indigo-600 font-bold inline-flex items-center gap-1"
            >
              <FileCode className="w-3 h-3" /> Load sample
            </button>
            <button
              onClick={addSegment}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-medium">Unlimited segments — prizes, discounts, names, or "try again" slots.</p>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {config.segments.map((seg, index) => (
            <div key={seg.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <span className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                style={{ backgroundColor: ['#6366F1','#F59E0B','#10B981','#EC4899','#0EA5E9','#8B5CF6','#EF4444','#14B8A6','#F97316','#84CC16','#06B6D4','#A855F7'][index % 12] }}>
                {index + 1}
              </span>
              <input
                type="text"
                value={seg.label}
                onChange={(e) => updateSegment(seg.id, e.target.value)}
                placeholder={`Prize ${index + 1}`}
                maxLength={30}
                className="flex-1 bg-transparent text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none py-1"
              />
              <button
                onClick={() => removeSegment(seg.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition shrink-0"
                title="Remove segment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {!config.segments.length && (
            <p className="text-center text-xs text-slate-400 font-semibold py-4">No segments yet — add your first prize.</p>
          )}
        </div>
      </div>
    </div>
  );
};
