
import React from 'react';
import { Check, Sparkles, FileText, MessageSquare, Hash } from 'lucide-react';
import { Progress } from './ui/progress';

export interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
  completedIcon?: React.ElementType;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (index: number) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="relative space-y-6 mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isClickable = index <= Math.max(...completedSteps) + 1 && index <= completedSteps.length;
          
          const StepIcon = isCompleted ? Check : step.icon;
          
          return (
            <div
              key={step.id}
              className={`relative flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-tva-primary text-white'
                    : isCurrent
                    ? 'bg-tva-surface border-2 border-tva-primary text-tva-primary glow-border'
                    : 'bg-tva-surface text-tva-text/60'
                }`}
              >
                <StepIcon size={20} className="transition-transform" />
              </div>
              <span className="text-xs font-medium mt-2 text-center max-w-[80px]">{step.label}</span>
            </div>
          );
        })}
      </div>
      
      <div className="relative h-1 bg-tva-surface rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-tva-primary to-tva-secondary transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
