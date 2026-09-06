import { Progress } from "@/components/ui/progress";

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepProgress,
}: {
  currentStep: number;
  totalSteps: number;
  stepProgress: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Progress value={stepProgress} aria-label={`Step ${currentStep} of ${totalSteps}`} />
    </div>
  );
}
