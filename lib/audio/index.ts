/**
 * Placeholder ambient-audio controller. No audio asset ships in V1 — this
 * exists so the guided reset UI already has a mute toggle wired to
 * something, and a future ambient track can be dropped in here without
 * touching ResetTimer or any other consumer.
 */
export interface AmbientAudioController {
  play: () => void;
  stop: () => void;
}

export function createAmbientAudio(): AmbientAudioController {
  return {
    play: () => {},
    stop: () => {},
  };
}
