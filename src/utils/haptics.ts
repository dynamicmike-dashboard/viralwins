// PWA Native Haptics & Tactile Sound Synthesizer

export function triggerHapticFeedback(pattern: 'light' | 'medium' | 'success' | 'warning' | 'heavy' = 'light') {
  // 1. Mobile Device Vibration API
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      if (pattern === 'light') navigator.vibrate(12);
      else if (pattern === 'medium') navigator.vibrate(25);
      else if (pattern === 'heavy') navigator.vibrate(45);
      else if (pattern === 'success') navigator.vibrate([15, 40, 25]);
      else if (pattern === 'warning') navigator.vibrate([30, 50, 30]);
    } catch {
      // Ignore vibration errors
    }
  }

  // 2. Subtle Native Web Audio Synthesizer Pop
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (pattern === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (pattern === 'light' || pattern === 'medium') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
}
