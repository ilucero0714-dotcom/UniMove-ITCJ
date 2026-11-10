/**
 * Sound synthesis using the browser Web Audio API.
 * Provides authentic, crisp acoustic feedback for bike rental interactions
 * (QR scan, bike unlock mechanical latch, dock return, warnings).
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playSound(type: 'beep' | 'unlock' | 'lock' | 'success' | 'alert' | 'click') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'beep': {
        // Crisp QR barcode scan beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // A6 note
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'unlock': {
        // Mechanical heavy latch release followed by a pleasant high chime
        // 1. Mechanical clunk (short burst low frequency square)
        const clunk = ctx.createOscillator();
        const clunkGain = ctx.createGain();
        clunk.type = 'square';
        clunk.frequency.setValueAtTime(120, now);
        clunk.frequency.exponentialRampToValueAtTime(40, now + 0.07);
        clunkGain.gain.setValueAtTime(0.12, now);
        clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        clunk.connect(clunkGain);
        clunkGain.connect(ctx.destination);
        clunk.start(now);
        clunk.stop(now + 0.07);

        // 2. Rising twin chimes (C6 -> E6 -> G6)
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + 0.08 + idx * 0.09);
          gain.gain.setValueAtTime(0.09, now + 0.08 + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + idx * 0.09 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.08 + idx * 0.09);
          osc.stop(now + 0.08 + idx * 0.09 + 0.25);
        });
        break;
      }

      case 'lock': {
        // Deep solid latch engagement (clack-snap)
        const snap = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snap.type = 'sawtooth';
        snap.frequency.setValueAtTime(240, now);
        snap.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        snapGain.gain.setValueAtTime(0.15, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        snap.connect(snapGain);
        snapGain.connect(ctx.destination);
        snap.start(now);
        snap.stop(now + 0.12);

        // Confirmation double soft beep
        [880, 1174.66].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + 0.14 + idx * 0.08);
          gain.gain.setValueAtTime(0.06, now + 0.14 + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14 + idx * 0.08 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + 0.14 + idx * 0.08);
          osc.stop(now + 0.14 + idx * 0.08 + 0.18);
        });
        break;
      }

      case 'success': {
        // Harmonious chord celebration
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.07, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.35);
        });
        break;
      }

      case 'alert': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
      }
    }
  } catch {
    // Graceful degradation when audio is restricted
  }
}
