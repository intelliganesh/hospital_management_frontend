import React, { forwardRef, useId } from "react";
import View from "@/components/view";
import { Check, X } from "lucide-react";

// Define variant types
type VariantType =
  | "default"
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "green";
type SizeType = "small" | "medium" | "large" | "default";

// Variant classes mapping for the track when unchecked
const trackVariantClasses: Record<VariantType, string> = {
  default: "bg-neutral-100 dark:bg-background border border-border",
  primary: "bg-neutral-100 dark:bg-background border border-border",
  success: "bg-neutral-100 dark:bg-background border border-border",
  danger: "bg-neutral-100 dark:bg-background border border-border",
  warning: "bg-neutral-100 dark:bg-background border border-border",
  green: "bg-neutral-100 dark:bg-background border border-border",
};

// Variant classes mapping for the track when checked
const trackCheckedVariantClasses: Record<VariantType, string> = {
  default: "bg-neutral-600 dark:bg-neutral-300",
  primary: "bg-primary dark:bg-primary",
  success: "bg-success-500 dark:bg-success-400",
  danger: "bg-danger-500 dark:bg-danger-400",
  warning: "bg-warning-500 dark:bg-warning-400",
  green: "bg-green-500 dark:bg-green-500", // Bright green like in the image
};

// Size classes mapping for the track
const trackSizeClasses: Record<SizeType, string> = {
  small: "w-10 h-6",
  medium: "w-12 h-7",
  large: "w-16 h-8",
  default: "w-12 h-7",
};

// Size classes mapping for the thumb
const thumbSizeClasses: Record<SizeType, string> = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
  default: "w-5 h-5",
};

// Size classes mapping for the thumb translation
const thumbTranslateClasses: Record<SizeType, string> = {
  small: "translate-x-5",
  medium: "translate-x-6",
  large: "translate-x-9",
  default: "translate-x-6",
};

// Size classes mapping for icons
const iconSizeClasses: Record<SizeType, number> = {
  small: 8,
  medium: 12,
  large: 14,
  default: 12,
};

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "onChange"> {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: React.FocusEventHandler;
  onFocus?: React.FocusEventHandler;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  className?: string;
  variant?: VariantType;
  size?: SizeType;
  labelPosition?: "left" | "right";
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
  showIcons?: boolean; // Whether to show icons
  iconPosition?: "thumb" | "track"; // Where to display the icons
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      name,
      checked,
      defaultChecked,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      required = false,
      label,
      description,
      className = "",
      variant = "green",
      size = "medium",
      labelPosition = "right",
      showIcons = true,
      iconPosition = "thumb",
      onIcon,
      offIcon,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);

    // Use controlled component if checked prop is provided
    const isControlled = checked !== undefined;
    const switchChecked = isControlled ? checked : isChecked;

    // Generate a unique ID if none provided
    const generatedId = useId();
    const switchId = id || `switch-${generatedId}`;
    const labelId = `${switchId}-label`;
    const descriptionId = description ? `${switchId}-description` : undefined;

    const handleChange = () => {
      if (disabled) return;

      if (!isControlled) {
        setIsChecked(!switchChecked);
      }

      if (onChange) {
        onChange(!switchChecked);
      }
    };

    // Create appropriately sized icons
    const iconSize = iconSizeClasses[size];
    const defaultOnIcon = (
      <Check size={iconSize} className="text-neutral-600 " />
    );
    const defaultOffIcon = <X size={iconSize} className="text-neutral-600" />;

    // Use provided icons or defaults with appropriate sizing
    const actualOnIcon = onIcon || defaultOnIcon;
    const actualOffIcon = offIcon || defaultOffIcon;

    return (
      <View className={`flex items-center ${className}`}>
        {label && labelPosition === "left" && (
          <View className="mr-3">
            <label
              id={labelId}
              htmlFor={switchId}
              className={`text-sm font-medium ${
                disabled
                  ? "text-neutral-400 dark:text-neutral-600"
                  : "text-text-DEFAULT dark:text-white"
              } cursor-pointer`}
            >
              {label}
              {required && <span className="text-danger ml-1">*</span>}
            </label>
            {description && (
              <p
                id={descriptionId}
                className="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {description}
              </p>
            )}
          </View>
        )}

        <View className="relative">
          {/* Hidden native checkbox for form submission */}
          <input
            type="checkbox"
            id={switchId}
            name={name}
            checked={switchChecked}
            onChange={() => {}} // Controlled by the button
            disabled={disabled}
            required={required}
            className="sr-only" // Screen reader only - visually hidden
            aria-hidden="true"
          />

          {/* Accessible switch button */}
          <button
            ref={ref}
            role="switch"
            aria-checked={switchChecked}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={descriptionId}
            aria-disabled={disabled}
            aria-required={required}
            tabIndex={disabled ? -1 : 0}
            type="button"
            id={`${switchId}-control`}
            className={`
            outline-none
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          `}
            onClick={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            {...props}
          >
            <View
              className={`
              ${trackSizeClasses[size]}
              ${
                switchChecked
                  ? trackCheckedVariantClasses[variant]
                  : trackVariantClasses[variant]
              }
              rounded-full transition-colors duration-300 ease-in-out
              relative
            `}
            >
              {/* Icons in track (before and after thumb) */}
              {showIcons && iconPosition === "track" && (
                <View className="absolute inset-0 flex justify-between items-center px-1 z-10">
                  {/* On icon (left side) */}
                  <View
                    className={`
                  flex items-center justify-center
                  transition-opacity duration-300 ease-in-out
                  ${switchChecked ? "opacity-100" : "opacity-0"}
                `}
                  >
                    {actualOnIcon}
                  </View>
                  {/* Off icon (right side) */}
                  <View
                    className={`
                  flex items-center justify-center
                  transition-opacity duration-300 ease-in-out
                  ${!switchChecked ? "opacity-100" : "opacity-0"}
                `}
                  >
                    {actualOffIcon}
                  </View>
                </View>
              )}

              {/* Thumb with optional icon */}
              <View
                className={`
                ${thumbSizeClasses[size]}
                bg-white dark:bg-white
                rounded-full shadow-md transform 
                transition-all duration-300 ease-in-out
                absolute top-1/2 -translate-y-1/2 z-20
                ${switchChecked ? thumbTranslateClasses[size] : "translate-x-1"}
                flex items-center justify-center
              `}
              >
                {/* Icons in thumb */}
                {showIcons && iconPosition === "thumb" && (
                  <View className="flex items-center justify-center overflow-hidden">
                    {switchChecked ? actualOnIcon : actualOffIcon}
                  </View>
                )}
              </View>
            </View>
          </button>
        </View>

        {label && labelPosition === "right" && (
          <View className="ml-3">
            <label
              id={labelId}
              htmlFor={switchId}
              className={`text-sm font-medium ${
                disabled
                  ? "text-neutral-400 dark:text-neutral-600"
                  : "text-text-DEFAULT dark:text-white"
              } cursor-pointer`}
            >
              {label}
              {required && <span className="text-danger ml-1">*</span>}
            </label>
            {description && (
              <p
                id={descriptionId}
                className="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {description}
              </p>
            )}
          </View>
        )}
      </View>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
