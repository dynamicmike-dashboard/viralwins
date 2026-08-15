import React from 'react';
import { Smartphone, Tablet, Monitor, Maximize2 } from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop' | 'full';

interface DevicePreviewFrameProps {
  children: React.ReactNode;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
}

export const DevicePreviewFrame: React.FC<DevicePreviewFrameProps> = ({
  children,
  deviceMode,
  setDeviceMode
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-100/90 rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      
      {/* Device Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs font-bold text-slate-700 ml-2">Live Responsive Staging View</span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setDeviceMode('mobile');
            }}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'mobile' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setDeviceMode('tablet');
            }}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'tablet' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setDeviceMode('desktop');
            }}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'desktop' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Desktop View (1024px)"
          >
            <Monitor className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              triggerHapticFeedback('light');
              setDeviceMode('full');
            }}
            className={`p-1.5 rounded-lg text-xs transition ${
              deviceMode === 'full' ? 'bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Full Width"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Viewport Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-slate-100">
        <div
          className={`transition-all duration-300 w-full ${
            deviceMode === 'mobile'
              ? 'max-w-[400px] border-8 border-slate-800 rounded-[40px] p-3 bg-slate-50 shadow-2xl my-2'
              : deviceMode === 'tablet'
              ? 'max-w-[768px] border-8 border-slate-700 rounded-[32px] p-4 bg-slate-50 shadow-2xl my-2'
              : deviceMode === 'desktop'
              ? 'max-w-[1024px] border border-slate-200 rounded-2xl p-4 bg-slate-50 shadow-xl my-2'
              : 'w-full'
          }`}
        >
          {deviceMode === 'mobile' && (
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
          )}
          {children}
        </div>
      </div>

    </div>
  );
};
