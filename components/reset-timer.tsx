"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResetStep } from "@/components/reset-step";
import { ProgressIndicator } from "@/components/progress-indicator";
import { createAmbientAudio } from "@/lib/audio";
import type { ResetStep as ResetStepType } from "@/types";

export function ResetTimer({
  steps,
  onFinished,
}: {
  steps: ResetStepType[];
  onFinished: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(steps[0]?.duration_seconds ?? 0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const finishedRef = useRef(false);
  const ambientRef = useRef(createAmbientAudio());

  useEffect(() => {
    const ambient = ambientRef.current;
    if (!isMuted && !isPaused) {
      ambient.play();
    } else {
      ambient.stop();
    }
  }, [isMuted, isPaused]);

  useEffect(() => {
    const ambient = ambientRef.current;
    return () => ambient.dispose();
  }, []);

  const currentStep = steps[stepIndex];

  // Reset the countdown whenever the step changes. Adjusting state during
  // render (React's recommended pattern for this) instead of in an effect
  // avoids an extra render where the previous step's time briefly shows.
  const [renderedStepIndex, setRenderedStepIndex] = useState(stepIndex);
  if (stepIndex !== renderedStepIndex) {
    setRenderedStepIndex(stepIndex);
    setSecondsLeft(currentStep?.duration_seconds ?? 0);
  }

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          goToNext();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, stepIndex]);

  function goToNext() {
    setStepIndex((prev) => {
      const next = prev + 1;
      if (next >= steps.length) {
        if (!finishedRef.current) {
          finishedRef.current = true;
          onFinished();
        }
        return prev;
      }
      return next;
    });
  }

  if (!currentStep) return null;

  const stepProgress =
    ((currentStep.duration_seconds - secondsLeft) / currentStep.duration_seconds) * 100;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-4 py-16">
      <ProgressIndicator
        currentStep={stepIndex + 1}
        totalSteps={steps.length}
        stepProgress={Math.min(100, Math.max(0, stepProgress))}
      />
      <ResetStep step={currentStep} secondsLeft={secondsLeft} />
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" onClick={goToNext} aria-label="Skip to next step">
          <SkipForward className="h-4 w-4" aria-hidden="true" />
          Skip
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMuted((m) => !m)}
          aria-label={isMuted ? "Unmute ambient sound" : "Mute ambient sound"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
