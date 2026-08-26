/**
 * Form Utilities and Helper Components
 * 
 * Additional components and utilities that complement the main Form component system.
 * These provide common patterns and save development time.
 */

import React, { ReactNode } from "react";
import View from "@/components/view";
import Text from "@/components/text";   
// import Button from "@/components/button";

// Simple className utility
const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// ==================== FORM ROW COMPONENT ====================

/**
 * FormRow - Layout helper for side-by-side fields
 * Useful when you need more control than Form.Section grid
 * 
 * @example
 * ```tsx
 * <FormRow>
 *   <Form.Field label="First Name">
 *     <input />
 *   </Form.Field>
 *   <Form.Field label="Last Name">
 *     <input />
 *   </Form.Field>
 * </FormRow>
 * ```
 */
export interface FormRowProps {
  children: ReactNode;
  className?: string;
  gap?: "sm" | "md" | "lg";
  responsive?: boolean;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  className,
  gap = "md",
  responsive = true,
}) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <View
      className={classNames(
        "flex",
        responsive && "flex-col md:flex-row",
        gapClasses[gap],
        className
      )}
    >
      {children}
    </View>
  );
};

// ==================== FORM DIVIDER COMPONENT ====================

/**
 * FormDivider - Visual separator between form sections
 * 
 * @example
 * ```tsx
 * <Form.Section title="Personal Info">
 *   {fields}
 * </Form.Section>
 * <FormDivider />
 * <Form.Section title="Address">
 *   {fields}
 * </Form.Section>
 * ```
 */
export interface FormDividerProps {
  className?: string;
  label?: string;
  spacing?: "sm" | "md" | "lg";
}

export const FormDivider: React.FC<FormDividerProps> = ({
  className,
  label,
  spacing = "md",
}) => {
  const spacingClasses = {
    sm: "my-4",
    md: "my-6",
    lg: "my-8",
  };

  if (label) {
    return (
      <View className={classNames(spacingClasses[spacing], "relative", className)}>
        <View className="absolute inset-0 flex items-center">
          <View className="w-full border-t border-slate-200 dark:border-slate-700" />
        </View>
        <View className="relative flex justify-center">
          <Text
            as="span"
            className="bg-white dark:bg-slate-800 px-4 text-sm text-slate-500 dark:text-slate-400"
          >
            {label}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className={classNames(
        "border-t border-slate-200 dark:border-slate-700",
        spacingClasses[spacing],
        className
      )}
    />
  );
};

// ==================== FORM CARD COMPONENT ====================

/**
 * FormCard - Wrapper for creating card-based form layouts
 * Useful for multi-step or wizard-style forms
 * 
 * @example
 * ```tsx
 * <FormCard
 *   title="Step 1"
 *   icon={<UserIcon />}
 *   active={currentStep === 1}
 * >
 *   {stepContent}
 * </FormCard>
 * ```
 */
export interface FormCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  active?: boolean;
  completed?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  active = false,
  completed = false,
  className,
  onClick,
}) => {
  return (
    <View
      onClick={onClick}
      className={classNames(
        "border rounded-lg p-6 transition-all",
        active && "border-primary-500 bg-primary-50 dark:bg-primary-900/10",
        completed && "border-green-500 bg-green-50 dark:bg-green-900/10",
        !active && !completed && "border-slate-200 dark:border-slate-700",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
    >
      {(title || icon) && (
        <View className="flex items-center gap-3 mb-4">
          {icon && (
            <View className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20">
              {icon}
            </View>
          )}
          <View>
            {title && (
              <Text
                as="h3"
                className="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text as="p" className="text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      )}
      {children}
    </View>
  );
};

// ==================== FORM FIELDSET COMPONENT ====================

/**
 * FormFieldset - Groups related fields with a border and legend
 * Traditional HTML fieldset pattern
 * 
 * @example
 * ```tsx
 * <FormFieldset legend="Shipping Address">
 *   <Form.Field label="Street">
 *     <input />
 *   </Form.Field>
 * </FormFieldset>
 * ```
 */
export interface FormFieldsetProps {
  legend?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const FormFieldset: React.FC<FormFieldsetProps> = ({
  legend,
  children,
  className,
  disabled = false,
}) => {
  return (
    <fieldset disabled={disabled} className={classNames("border rounded-lg p-4", className)}>
      {legend && (
        <legend className="px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
};

// ==================== FORM HELP TEXT COMPONENT ====================

/**
 * FormHelpText - Consistent help/info text component
 * 
 * @example
 * ```tsx
 * <Form.Field label="Password">
 *   <input type="password" />
 *   <FormHelpText>
 *     Must be at least 8 characters with one uppercase letter
 *   </FormHelpText>
 * </Form.Field>
 * ```
 */
export interface FormHelpTextProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "error" | "success" | "warning";
}

export const FormHelpText: React.FC<FormHelpTextProps> = ({
  children,
  className,
  variant = "default",
}) => {
  const variantClasses = {
    default: "text-slate-500 dark:text-slate-400",
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <Text
      as="p"
      className={classNames("mt-1.5 text-xs", variantClasses[variant], className)}
    >
      {children}
    </Text>
  );
};

// ==================== FORM ERROR SUMMARY COMPONENT ====================

/**
 * FormErrorSummary - Displays all form errors at the top
 * Useful for accessibility and long forms
 * 
 * @example
 * ```tsx
 * <FormErrorSummary
 *   errors={errors}
 *   title="Please fix the following errors:"
 * />
 * ```
 */
export interface FormErrorSummaryProps {
  errors: Record<string, string>;
  title?: string;
  className?: string;
  onErrorClick?: (fieldName: string) => void;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  title = "Please fix the following errors:",
  className,
  onErrorClick,
}) => {
  const errorEntries = Object.entries(errors).filter(([_, value]) => value);

  if (errorEntries.length === 0) return null;

  return (
    <View
      className={classNames(
        "p-4 mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg",
        className
      )}
      role="alert"
    >
      <Text
        as="h3"
        className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2"
      >
        {title}
      </Text>
      <ul className="list-disc list-inside space-y-1">
        {errorEntries.map(([field, message]) => (
          <li key={field} className="text-sm text-red-700 dark:text-red-300">
            {onErrorClick ? (
              <button
                type="button"
                onClick={() => onErrorClick(field)}
                className="hover:underline text-left"
              >
                {message}
              </button>
            ) : (
              message
            )}
          </li>
        ))}
      </ul>
    </View>
  );
};

// ==================== FORM SUCCESS MESSAGE COMPONENT ====================

/**
 * FormSuccessMessage - Success feedback component
 * 
 * @example
 * ```tsx
 * {submitSuccess && (
 *   <FormSuccessMessage>
 *     Form submitted successfully!
 *   </FormSuccessMessage>
 * )}
 * ```
 */
export interface FormSuccessMessageProps {
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export const FormSuccessMessage: React.FC<FormSuccessMessageProps> = ({
  children,
  className,
  onDismiss,
}) => {
  return (
    <View
      className={classNames(
        "p-4 mb-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg",
        "flex items-center justify-between",
        className
      )}
      role="status"
    >
      <Text as="p" className="text-sm text-green-800 dark:text-green-200">
        {children}
      </Text>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </View>
  );
};

// ==================== FORM PROGRESS INDICATOR ====================

/**
 * FormProgress - Progress indicator for multi-step forms
 * 
 * @example
 * ```tsx
 * <FormProgress
 *   steps={["Personal", "Address", "Review"]}
 *   currentStep={1}
 * />
 * ```
 */
export interface FormProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
  onStepClick?: (step: number) => void;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  steps,
  currentStep,
  className,
  onStepClick,
}) => {
  return (
    <View className={classNames("mb-8", className)}>
      <View className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && (isCompleted || isActive);

          return (
            <React.Fragment key={index}>
              <View className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={classNames(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    isActive &&
                      "bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/30",
                    isCompleted &&
                      "bg-green-500 text-white hover:bg-green-600",
                    !isActive &&
                      !isCompleted &&
                      "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
                    isClickable && "cursor-pointer"
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </button>
                <Text
                  as="span"
                  className={classNames(
                    "mt-2 text-xs font-medium",
                    isActive && "text-primary-600 dark:text-primary-400",
                    isCompleted && "text-green-600 dark:text-green-400",
                    !isActive &&
                      !isCompleted &&
                      "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {step}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  className={classNames(
                    "flex-1 h-0.5 mx-2 -mt-8",
                    isCompleted
                      ? "bg-green-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

// ==================== FORM SKELETON LOADER ====================

/**
 * FormSkeleton - Loading skeleton for forms
 * Shows while form data is being fetched
 * 
 * @example
 * ```tsx
 * {isLoading ? (
 *   <FormSkeleton fields={5} />
 * ) : (
 *   <Form>...</Form>
 * )}
 * ```
 */
export interface FormSkeletonProps {
  fields?: number;
  sections?: number;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  fields = 4,
  sections = 1,
  className,
}) => {
  return (
    <View className={classNames("animate-pulse space-y-6", className)}>
      {Array.from({ length: sections }).map((_, sIndex) => (
        <View key={sIndex}>
          {/* Section Title Skeleton */}
          <View className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />

          {/* Fields Grid Skeleton */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: fields }).map((_, fIndex) => (
              <View key={fIndex}>
                <View className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
                <View className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Submit Button Skeleton */}
      <View className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-full" />
    </View>
  );
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Scroll to first error in the form
 */
export const scrollToFirstError = (errors: Record<string, string>) => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      (element as HTMLElement).focus();
    }
  }
};

/**
 * Focus first field in the form
 */
export const focusFirstField = (formRef: React.RefObject<HTMLFormElement>) => {
  const firstInput = formRef.current?.querySelector<HTMLInputElement>(
    'input:not([type="hidden"]), select, textarea'
  );
  if (firstInput) {
    firstInput.focus();
  }
};

/**
 * Get form data as object
 */
export const getFormData = (form: HTMLFormElement): Record<string, any> => {
  const formData = new FormData(form);
  const data: Record<string, any> = {};

  for (let [key, value] of formData.entries()) {
    // Handle multiple values (checkboxes, multi-select)
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  return data;
};

/**
 * Debounce function for validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ==================== EXPORTS ====================

// export {
//   FormRow,
//   FormDivider,
//   FormCard,
//   FormFieldset,
//   FormHelpText,
//   FormErrorSummary,
//   FormSuccessMessage,
//   FormProgress,
//   FormSkeleton,
//   scrollToFirstError,
//   focusFirstField,
//   getFormData,
//   debounce,
// };