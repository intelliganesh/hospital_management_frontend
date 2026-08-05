/**
 * Form Component Type Definitions
 * 
 * This file provides comprehensive TypeScript support for the Form component system.
 * Import these types when you need to extend or customize the Form components.
 */

import { ReactNode, FormEvent, CSSProperties } from "react";

// ==================== UTILITY TYPES ====================

/**
 * Valid column span values for grid layouts
 */
export type ColSpan = 1 | 2 | 3 | 4 | "full";

/**
 * Valid column count for grid sections
 */
export type GridColumns = 1 | 2 | 3 | 4;

/**
 * Valid gap sizes between grid items
 */
export type GridGap = "sm" | "md" | "lg";

/**
 * Valid alignment options for form actions
 */
export type ActionAlignment = "left" | "center" | "right" | "between";

// ==================== FORM COMPONENT TYPES ====================

/**
 * Props for the main Form component
 * 
 * @example
 * ```tsx
 * <Form
 *   onSubmit={handleSubmit}
 *   title="User Registration"
 *   showBackButton
 *   isSubmitting={loading}
 * >
 *   {children}
 * </Form>
 * ```
 */
export interface FormProps {
  /** Form content - typically Form.Section and Form.Field components */
  children: ReactNode;
  
  /** Form submission handler - receives native form event */
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  
  /** Custom CSS classes for the form container */
  className?: string;
  
  /** Main title displayed in the form header */
  title?: string;
  
  /** Subtitle/description displayed below the title */
  subtitle?: string;
  
  /** Whether to show the header section (default: true) */
  showHeader?: boolean;
  
  /** Custom action buttons to display in the header */
  headerActions?: ReactNode;
  
  /** Whether to show a back button in the header */
  showBackButton?: boolean;
  
  /** Handler for back button click */
  onBack?: () => void;
  
  /** Text for the back button (default: "Back") */
  backButtonText?: string;
  
  /** Text for the submit button (default: "Submit") */
  submitButtonText?: string;
  
  /** Loading state for form submission */
  isSubmitting?: boolean;
  
  /** Whether to show the default submit button (default: true) */
  showSubmitButton?: boolean;
  
  /** Custom CSS classes for the submit button */
  submitButtonClassName?: string;
  
  /** Custom CSS classes for the header section */
  headerClassName?: string;
  
  /** Custom CSS classes for the form content wrapper */
  contentClassName?: string;
}

/**
 * Props for Form.Section component
 * Used to group related form fields with optional title and grid layout
 * 
 * @example
 * ```tsx
 * <Form.Section
 *   title="Personal Information"
 *   columns={2}
 *   gap="md"
 * >
 *   <Form.Field>...</Form.Field>
 * </Form.Section>
 * ```
 */
export interface FormSectionProps {
  /** Section title */
  title?: string;
  
  /** Section subtitle/description */
  subtitle?: string;
  
  /** Section content - typically Form.Field components */
  children: ReactNode;
  
  /** Custom CSS classes for the section container */
  className?: string;
  
  /** Custom CSS classes for the section title */
  titleClassName?: string;
  
  /** Custom CSS classes for the section content grid */
  contentClassName?: string;
  
  /** Whether to show a divider under the title (default: true) */
  showDivider?: boolean;
  
  /** Number of columns in the grid (default: 2) */
  columns?: GridColumns;
  
  /** Gap size between grid items (default: "md") */
  gap?: GridGap;
}

/**
 * Props for Form.Field component
 * Wraps individual form inputs with label, error, and hint support
 * 
 * @example
 * ```tsx
 * <Form.Field
 *   label="Email Address"
 *   error={errors.email}
 *   required
 *   hint="We'll never share your email"
 *   colSpan={2}
 * >
 *   <input type="email" name="email" />
 * </Form.Field>
 * ```
 */
export interface FormFieldProps {
  /** Label text for the field */
  label?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  
  /** The form input element */
  children: ReactNode;
  
  /** Custom CSS classes for the field container */
  className?: string;
  
  /** Custom CSS classes for the label */
  labelClassName?: string;
  
  /** Custom CSS classes for the error message */
  errorClassName?: string;
  
  /** Help text to display below the input */
  hint?: string;
  
  /** Custom CSS classes for the hint text */
  hintClassName?: string;
  
  /** Number of columns this field should span (default: 1) */
  colSpan?: ColSpan;
  
  /** Whether to show error message (default: true) */
  showError?: boolean;
}

/**
 * Props for Form.Actions component
 * Provides a consistent layout for form action buttons
 * 
 * @example
 * ```tsx
 * <Form.Actions
 *   align="between"
 *   showSubmit
 *   showCancel
 *   onCancel={handleCancel}
 * />
 * ```
 */
export interface FormActionsProps {
  /** Custom action buttons - if provided, overrides default buttons */
  children?: ReactNode;
  
  /** Custom CSS classes for the actions container */
  className?: string;
  
  /** Alignment of action buttons (default: "right") */
  align?: ActionAlignment;
  
  /** Text for the submit button (default: "Submit") */
  submitButtonText?: string;
  
  /** Text for the cancel button (default: "Cancel") */
  cancelButtonText?: string;
  
  /** Handler for cancel button click */
  onCancel?: () => void;
  
  /** Loading state for the submit button */
  isSubmitting?: boolean;
  
  /** Whether to show the submit button (default: true) */
  showSubmit?: boolean;
  
  /** Whether to show the cancel button (default: false) */
  showCancel?: boolean;
  
  /** Custom CSS classes for the submit button */
  submitButtonClassName?: string;
  
  /** Custom CSS classes for the cancel button */
  cancelButtonClassName?: string;
}

// ==================== COMPOSITE COMPONENT TYPE ====================

/**
 * Main Form component with attached subcomponents
 * 
 * @example
 * ```tsx
 * import Form from "@/components/Form";
 * 
 * <Form onSubmit={handleSubmit}>
 *   <Form.Section title="Personal Info">
 *     <Form.Field label="Name">
 *       <input />
 *     </Form.Field>
 *   </Form.Section>
 *   <Form.Actions />
 * </Form>
 * ```
 */
export type FormComponent = React.FC<FormProps> & {
  Section: React.FC<FormSectionProps>;
  Field: React.FC<FormFieldProps>;
  Actions: React.FC<FormActionsProps>;
};

// ==================== HELPER TYPES ====================

/**
 * Error object shape typically used with form validation
 * 
 * @example
 * ```tsx
 * const [errors, setErrors] = useState<FormErrors>({});
 * ```
 */
export type FormErrors = Record<string, string>;

/**
 * Generic form values type
 * Use with your specific form data interface
 * 
 * @example
 * ```tsx
 * interface UserFormData {
 *   name: string;
 *   email: string;
 * }
 * 
 * const { values } = useForm<UserFormData>(initialValues);
 * ```
 */
export type FormValues<T = any> = T;

/**
 * Form submission handler type
 * 
 * @example
 * ```tsx
 * const handleSubmit: FormSubmitHandler = async (e) => {
 *   e.preventDefault();
 *   // Your logic
 * };
 * ```
 */
export type FormSubmitHandler = (e: FormEvent<HTMLFormElement>) => void | Promise<void>;

/**
 * Field change handler type
 * 
 * @example
 * ```tsx
 * const handleChange: FormChangeHandler = (e) => {
 *   // Your logic
 * };
 * ```
 */
export type FormChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;

// ==================== EXTENDED TYPES FOR CUSTOM IMPLEMENTATIONS ====================

/**
 * Extended Form props with additional customization options
 * Use this when you need to extend the base Form component
 */
export interface ExtendedFormProps extends FormProps {
  /** Custom inline styles for the container */
  style?: CSSProperties;
  
  /** Additional data attributes */
  dataAttributes?: Record<string, string>;
  
  /** Whether the form is in read-only mode */
  readOnly?: boolean;
  
  /** Custom validation function */
  validate?: (values: any) => FormErrors | Promise<FormErrors>;
  
  /** Callback when form values change */
  onChange?: (values: any) => void;
  
  /** Custom reset handler */
  onReset?: () => void;
}

/**
 * Extended Field props with conditional rendering support
 */
export interface ExtendedFormFieldProps extends FormFieldProps {
  /** Condition to show/hide the field */
  show?: boolean;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Custom tooltip text */
  tooltip?: string;
  
  /** Icon to display next to the label */
  icon?: ReactNode;
  
  /** Additional information to display */
  info?: ReactNode;
}

// ==================== VALIDATION INTEGRATION TYPES ====================

/**
 * Yup validation schema type helper
 * 
 * @example
 * ```tsx
 * import * as Yup from "yup";
 * 
 * const schema: YupSchema = Yup.object({
 *   email: Yup.string().email().required(),
 * });
 * ```
 */
export type YupSchema = any; // Replace with actual Yup type if available

/**
 * Zod validation schema type helper
 * 
 * @example
 * ```tsx
 * import { z } from "zod";
 * 
 * const schema: ZodSchema = z.object({
 *   email: z.string().email(),
 * });
 * ```
 */
export type ZodSchema = any; // Replace with actual Zod type if available

/**
 * Generic validation result
 */
export interface ValidationResult {
  success: boolean;
  errors?: FormErrors;
  data?: any;
}

// ==================== FORM STATE MANAGEMENT TYPES ====================

/**
 * Return type for useForm hook
 * 
 * @example
 * ```tsx
 * const formState: UseFormReturn<UserData> = useForm(initialValues);
 * ```
 */
export interface UseFormReturn<T = any> {
  values: T;
  handleChange: FormChangeHandler;
  handleTipTapChange: (value: string, name: string) => void;
  onSetHandler: (name: string, value: any) => void;
  resetForm: () => void;
}

/**
 * Form configuration options
 */
export interface FormConfig {
  /** Whether to reset form on successful submission */
  resetOnSubmit?: boolean;
  
  /** Whether to validate on change */
  validateOnChange?: boolean;
  
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  
  /** Whether to focus first error on validation failure */
  focusOnError?: boolean;
  
  /** Delay in ms before running validation on change */
  validationDebounce?: number;
}

// ==================== EXPORT ALL ====================

export type {
  FormComponent as default,
};