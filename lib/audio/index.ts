/**
 * Ambient sound for the guided reset, synthesized entirely in the browser
 * with the Web Audio API — no external audio file to source, license, or
 * host. Two soft, detuned low sine tones through a lowpass filter, with a
 * slow LFO on the filter cutoff for a gentle "breathing" swell.
 *
 * The AudioContext is created lazily on the first play() call (always
 * triggered by a real user click on the mute toggle), never at module load
 * or component mount, so this never runs into browser autoplay
 * restrictions. play()/stop() only ramp a master gain up and down — the
 * oscillators keep running silently in between so toggling is instant and
 * click-free.
 */
export interface AmbientAudioController {
  play: () => void;
  stop: () => void;
  dispose: () => void;
}

const TARGET_VOLUME = 0.1;
const FADE_SECONDS = 1.2;

export function createAmbientAudio(): AmbientAudioController {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;

  function ensureGraph() {
    if (ctx) return;

    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    ctx = new AudioContextCtor();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.7;
    filter.connect(masterGain);

    // Two gently detuned low tones (A2 + E3) for a soft, non-melodic pad.
    const voices: { freq: number; gain: number }[] = [
      { freq: 110, gain: 0.7 },
      { freq: 164.81, gain: 0.4 },
    ];

    for (const voice of voices) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = voice.freq;

      const oscGain = ctx.createGain();
      oscGain.gain.value = voice.gain;

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
    }

    // Slow LFO modulating the filter cutoff for a gentle breathing swell.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05; // ~20 second cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
  }

  return {
    play: () => {
      if (typeof window === "undefined") return;
      ensureGraph();
      if (!ctx || !masterGain) return;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(TARGET_VOLUME, now, FADE_SECONDS / 3);
    },
    stop: () => {
      if (!ctx || !masterGain) return;
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(0, now, FADE_SECONDS / 3);
    },
    dispose: () => {
      ctx?.close();
      ctx = null;
      masterGain = null;
    },
  };
}
