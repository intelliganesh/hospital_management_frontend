import React, { useState } from "react";
import View from "../view";
import Text from "../text";
import Button from "../button";
import { Card, CardContent, CardHeader } from "./card";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  uiForRightPartOfStepTitle?: React.ReactNode;
  validate?: () => boolean | Promise<boolean> | { isValid: boolean; errors?: Record<string, string> };
}

export interface StepFormProps {
  steps: Step[];
  onSubmit: (data: any) => void | Promise<void>;
  onStepChange?: (stepIndex: number) => void;
  initialStep?: number;
  submitButtonText?: string;
  className?: string;
  showStepNumbers?: boolean;
  showStepDescription?: boolean;
  showProgressBar?: boolean;
  allowStepClick?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  nextButtonVariant?: "primary" | "outline" | "ghost" | "danger";
  previousButtonVariant?: "primary" | "outline" | "ghost" | "danger";
  submitButtonVariant?: "primary" | "outline" | "ghost" | "danger";
  hideNavigationButtons?: boolean;
  customNavigationButtons?: (props: {
    currentStep: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    handleNext: () => void;
    handlePrevious: () => void;
    handleSubmit: () => void;
    isSubmitting: boolean;
  }) => React.ReactNode;
}

const StepForm: React.FC<StepFormProps> = ({
  steps,
  onSubmit,
  onStepChange,
  initialStep = 0,
  submitButtonText = "Submit",
  className = "",
  showStepNumbers = true,
  showStepDescription = true,
  showProgressBar = true,
  allowStepClick = false,
  nextButtonText = "Next",
  previousButtonText = "Previous",
  nextButtonVariant = "primary",
  previousButtonVariant = "outline",
  submitButtonVariant = "primary",
  hideNavigationButtons = false,
  customNavigationButtons,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    // Validate current step if validation function exists
    if (steps[currentStep].validate) {
      const result = await steps[currentStep].validate!();
      
      // Handle both boolean and object return types
      const isValid = typeof result === 'boolean' ? result : result.isValid;
      
      if (!isValid) return;
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleSubmit = async () => {
    // Validate final step
    if (steps[currentStep].validate) {
      const result = await steps[currentStep].validate!();
      const isValid = typeof result === 'boolean' ? result : result.isValid;
      
      if (!isValid) return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (index: number) => {
    if (allowStepClick && index <= currentStep) {
      setCurrentStep(index);
      onStepChange?.(index);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <View className={`w-full ${className}`}>
      <Card className="shadow-lg">
        <CardHeader className="border-b border-border dark:border-slate-700">
          {/* Step Indicator */}
          <View className="mb-6">
            <View className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  {/* Step Circle */}
                  <View className="flex flex-col items-center flex-1">
                    <View
                      onClick={() => handleStepClick(index)}
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        index < currentStep
                          ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500"
                          : index === currentStep
                          ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500 ring-4 ring-primary-100 dark:ring-primary-900"
                          : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                      } ${allowStepClick && index <= currentStep ? 'cursor-pointer hover:scale-110' : ''}`}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : showStepNumbers ? (
                        <Text
                          as="span"
                          className={`text-sm font-semibold ${
                            index === currentStep
                              ? "text-white"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {index + 1}
                        </Text>
                      ) : null}
                    </View>
                    <Text
                      as="p"
                      className={`mt-2 text-xs font-medium text-center ${
                        index === currentStep
                          ? "text-primary-600 dark:text-primary-400"
                          : index < currentStep
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-500 dark:text-slate-500"
                      }`}
                    >
                      {step.title}
                    </Text>
                  </View>

                  {/* Connector Line */}
                  {index < steps.length - 1 && showProgressBar && (
                    <View className="flex-1 h-0.5 mx-2 -mt-8">
                      <View
                        className={`h-full transition-all duration-300 ${
                          index < currentStep
                            ? "bg-primary-600 dark:bg-primary-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      />
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Current Step Title & Description */}
          <View className="mt-4 flex items-center justify-between">
            <View>
              <Text
              as="h2"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              {steps[currentStep].title}
            </Text>
            {showStepDescription && steps[currentStep].description && (
              <Text
                as="p"
                className="mt-1 text-sm text-slate-600 dark:text-slate-400"
              >
                {steps[currentStep].description}
              </Text>
            )}
            </View>
            {
              steps[currentStep].uiForRightPartOfStepTitle && (
                steps[currentStep].uiForRightPartOfStepTitle
              )
            }
          </View>
        </CardHeader>

        <CardContent className="p-6">
          {/* Step Content */}
          <View className="h-fit">
            {steps[currentStep].content}
          </View>

          {/* Navigation Buttons */}
          {!hideNavigationButtons && (
            <View className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              {customNavigationButtons ? (
                customNavigationButtons({
                  currentStep,
                  isFirstStep,
                  isLastStep,
                  handleNext,
                  handlePrevious,
                  handleSubmit,
                  isSubmitting,
                })
              ) : (
                <>
                  <Button
                    variant={previousButtonVariant}
                    onPress={handlePrevious}
                    disabled={isFirstStep || isSubmitting}
                    className="min-w-[100px]"
                  >
                    {previousButtonText}
                  </Button>

                  <View className="flex items-center gap-2">
                    <Text className="text-sm text-slate-600 dark:text-slate-400">
                      Step {currentStep + 1} of {steps.length}
                    </Text>
                  </View>

                  {isLastStep ? (
                    <Button
                      variant={submitButtonVariant}
                      onPress={handleSubmit}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      className="min-w-[100px]"
                    >
                      {submitButtonText}
                    </Button>
                  ) : (
                    <Button
                      variant={nextButtonVariant}
                      onPress={handleNext}
                      disabled={isSubmitting}
                      className="min-w-[100px]"
                    >
                      {nextButtonText}
                    </Button>
                  )}
                </>
              )}
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

export default StepForm;

