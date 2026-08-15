import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Download } from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

interface QRCodeModalProps {
  referralLink: string;
  campaignTitle: string;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  referralLink,
  campaignTitle,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    triggerHapticFeedback('success');
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a clean QR Code API image URL with white background
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=0f172a&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
        
        <button
          onClick={() => {
            triggerHapticFeedback('light');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          Scan to Enter
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-5">
          Share this QR code on flyers, social stories, or screen-to-screen
        </p>

        {/* QR Code Container */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-center shadow-inner mx-auto mb-4 w-56 h-56">
          <img
            src={qrCodeUrl}
            alt="Referral QR Code"
            className="w-full h-full rounded-xl object-contain shadow-xs bg-white p-2"
          />
        </div>

        <p className="text-[11px] text-slate-500 font-mono break-all mb-4 px-2 select-all font-semibold">
          {referralLink}
        </p>

        <div className="flex gap-2">
          <button
            onClick={copyUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          
          <a
            href={qrCodeUrl}
            download="viral-referral-qr.png"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHapticFeedback('medium')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/25"
          >
            <Download className="w-3.5 h-3.5" />
            Save QR
          </a>
        </div>

      </div>
    </div>
  );
};
