import React, { FormEvent, ReactNode } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";

// Simple className utility to replace cn
const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// ==================== TYPES ====================

export interface FormProps {
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  headerActions?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonText?: string;
  submitButtonText?: string;
  isSubmitting?: boolean;
  showSubmitButton?: boolean;
  submitButtonClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export interface FormSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  showDivider?: boolean;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  hint?: string;
  hintClassName?: string;
  colSpan?: 1 | 2 | 3 | 4 | "full";
  showError?: boolean;
}

export interface FormActionsProps {
  children?: ReactNode;
  className?: string;
  align?: "left" | "center" | "right" | "between";
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  showSubmit?: boolean;
  showCancel?: boolean;
  submitButtonClassName?: string;
  cancelButtonClassName?: string;
}

// ==================== FORM COMPONENT ====================

const Form: React.FC<FormProps> & {
  Section: typeof FormSection;
  Field: typeof FormField;
  Actions: typeof FormActions;
} = ({
  children,
  onSubmit,
  className,
  title,
  subtitle,
  showHeader = true,
  headerActions,
  showBackButton = false,
  onBack,
  backButtonText = "Back",
  submitButtonText = "Submit",
  isSubmitting = false,
  showSubmitButton = true,
  submitButtonClassName,
  headerClassName,
  contentClassName,
}) => {
  return (
    <View
      className={classNames(
        "bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-none",
        "border border-slate-200 dark:border-slate-700 w-full p-6 md:p-8",
        className
      )}
    >
      {/* Header */}
      {showHeader && (title || headerActions || showBackButton) && (
        <View
          className={classNames(
            "flex items-center justify-between mb-6",
            headerClassName
          )}
        >
          <View>
            {title && (
              <Text
                as="h2"
                weight="font-bold"
                className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
                {subtitle}
              </Text>
            )}
          </View>
          <View className="flex items-center gap-2">
            {headerActions}
            {showBackButton && onBack && (
              <Button
                onPress={onBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                {backButtonText}
              </Button>
            )}
          </View>
        </View>
      )}

      {/* Form Content */}
      <form onSubmit={onSubmit} className={contentClassName}>
        {children}

        {/* Default Submit Button */}
        {showSubmitButton && (
          <View className="mt-6">
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className={classNames(
                "w-full bg-primary text-white rounded-md py-3 font-medium",
                "hover:bg-primary-600 transition focus:outline-none",
                "focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
                submitButtonClassName
              )}
            >
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          </View>
        )}
      </form>
    </View>
  );
};

// ==================== FORM SECTION ====================

const FormSection: React.FC<FormSectionProps> = ({
  title,
  subtitle,
  children,
  className,
  titleClassName,
  contentClassName,
  showDivider = true,
  columns = 2,
  gap = "md",
}) => {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-6",
    lg: "gap-8",
  };

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <View className={classNames("mb-6", className)}>
      {/* Section Header */}
      {(title || subtitle) && (
        <View className="mb-4">
          {title && (
            <Text
              as="h3"
              className={classNames(
                "text-lg font-semibold text-text-DEFAULT mb-1",
                showDivider && "pb-2 border-b border-slate-200 dark:border-slate-700",
                titleClassName
              )}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {/* Section Content */}
      <View
        className={classNames(
          "grid",
          columnClasses[columns],
          gapClasses[gap],
          contentClassName
        )}
      >
        {children}
      </View>
    </View>
  );
};

// ==================== FORM FIELD ====================

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className,
  labelClassName,
  errorClassName,
  hint,
  hintClassName,
  colSpan = 1,
  showError = true,
}) => {
  const colSpanClasses = {
    1: "",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    full: "col-span-full",
  };

  return (
    <View className={classNames(colSpanClasses[colSpan], className)}>
      {/* Label */}
      {label && (
        <Text
          as="label"
          className={classNames(
            "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      )}

      {/* Field Content */}
      {children}

      {/* Hint Text */}
      {hint && !error && (
        <Text
          as="p"
          className={classNames(
            "mt-1.5 text-xs text-slate-500 dark:text-slate-400",
            hintClassName
          )}
        >
          {hint}
        </Text>
      )}

      {/* Error Message */}
      {showError && error && (
        <Text
          as="p"
          className={classNames(
            "mt-1.5 text-xs text-red-600 dark:text-red-400",
            errorClassName
          )}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

// ==================== FORM ACTIONS ====================

const FormActions: React.FC<FormActionsProps> = ({
  children,
  className,
  align = "right",
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  onCancel,
  isSubmitting = false,
  showSubmit = true,
  showCancel = false,
  submitButtonClassName,
  cancelButtonClassName,
}) => {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <View
      className={classNames(
        "flex items-center gap-3 mt-6",
        alignClasses[align],
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          {showCancel && onCancel && (
            <Button
              type="button"
              variant="outline"
              onPress={onCancel}
              disabled={isSubmitting}
              className={classNames(
                "px-6 py-2.5 rounded-md font-medium transition",
                cancelButtonClassName
              )}
            >
              {cancelButtonText}
            </Button>
          )}
          {showSubmit && (
            <Button
              htmlType="submit"
              loading={isSubmitting}
              className={classNames(
                "px-6 py-2.5 bg-primary text-white rounded-md font-medium",
                "hover:bg-primary-600 transition focus:outline-none",
                "focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
                submitButtonClassName
              )}
            >
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          )}
        </>
      )}
    </View>
  );
};

// ==================== ATTACH SUBCOMPONENTS ====================

Form.Section = FormSection;
Form.Field = FormField;
Form.Actions = FormActions;

export default Form;