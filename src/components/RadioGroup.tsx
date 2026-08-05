import React from "react";
import View from "./view";
import Text from "./text";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large";
  variant?: "default" | "card" | "button";
  label?: string;
  error?: string;
  id?: string;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options = [],
  name,
  value,
  defaultValue,
  onChange,
  disabled = false,
  direction = "horizontal",
  size = "medium",
  variant = "default",
  label,
  error,
  id,
  className = "",
}) => {
  const handleChange = (optionValue: string) => {
    if (!disabled && onChange) {
      onChange(optionValue);
    }
  };

  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const radioSizeClasses = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  const gapClasses = {
    horizontal: direction === "horizontal" ? "gap-4" : "gap-2",
    vertical: "gap-3",
  };

  return (
    <View className={`space-y-2 ${className}`} id={id}>
      {label && (
        <Text
          as="label"
          className="block text-sm font-medium text-text-DEFAULT mb-2"
        >
          {label}
        </Text>
      )}

      <View
        className={`flex ${
          direction === "horizontal" ? "flex-row flex-wrap" : "flex-col"
        } ${gapClasses[direction]}`}
        role="radiogroup"
      >
        {options.map((option) => {
          const isChecked =
            value !== undefined
              ? value === option.value
              : defaultValue === option.value;
          const isDisabled = disabled || option.disabled;
          const radioId = `${name}-${option.value}`;

          if (variant === "card") {
            return (
              <View
                key={option.value}
                className={`
                  flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${
                    isChecked
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 bg-card"
                  }
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${direction === "horizontal" ? "flex-1 min-w-[120px]" : "w-full"}
                `}
                onClick={() => !isDisabled && handleChange(option.value)}
              >
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={option?.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleChange(option?.value)}
                  className="hidden"
                />
                <View className="flex items-start gap-3 w-full">
                  <View
                    className={`
                      ${radioSizeClasses[size]} rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isChecked ? "border-primary" : "border-border"}
                    `}
                  >
                    {isChecked && (
                      <View
                        className={`${size === "small" ? "h-2 w-2" : size === "large" ? "h-3.5 w-3.5" : "h-2.5 w-2.5"} rounded-full bg-primary`}
                      />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      as="span"
                      className={`block font-medium ${sizeClasses[size]} text-text-DEFAULT dark:text-slate-100`}
                    >
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text
                        as="span"
                        className="block text-xs text-text-light dark:text-slate-400 mt-1"
                      >
                        {option.description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          }

          if (variant === "button") {
            return (
              <View key={option.value}>
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={option?.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleChange(option?.value)}
                  className="hidden peer"
                />
                <label
                  htmlFor={radioId}
                  className={`
                    inline-flex items-center justify-center px-4 py-2 rounded-md border-2 cursor-pointer transition-all
                    ${sizeClasses[size]} font-medium
                    ${
                      isChecked
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-text-DEFAULT dark:text-slate-100 hover:border-primary/50"
                    }
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                    peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
                  `}
                >
                  {option.label}
                </label>
              </View>
            );
          }

          // Default variant
          return (
            <View key={option.value} className="flex items-center">
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option?.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => handleChange(option?.value)}
                className="hidden peer"
              />
              <label
                htmlFor={radioId}
                className={`
                  flex items-center cursor-pointer group
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <View
                  className={`
                    ${radioSizeClasses[size]} rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      isChecked
                        ? "border-primary"
                        : "border-border group-hover:border-primary/50"
                    }
                    peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
                  `}
                >
                  {isChecked && (
                    <View
                      className={`
                        ${size === "small" ? "h-2 w-2" : size === "large" ? "h-3.5 w-3.5" : "h-2.5 w-2.5"} 
                        rounded-full bg-primary transition-transform scale-100
                      `}
                    />
                  )}
                </View>
                <Text
                  as="span"
                  className={`ml-2 ${sizeClasses[size]} ${isChecked ? "font-medium text-text-DEFAULT dark:text-slate-100" : "text-text-DEFAULT dark:text-slate-100"}`}
                >
                  {option.label}
                </Text>
              </label>
            </View>
          );
        })}
      </View>

      {error && (
        <Text as="p" className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default RadioGroup;
