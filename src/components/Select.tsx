import {
  SelectProps,
  VariantProps,
  SizeClassesProps,
} from "@/interfaces/components/input/selectProps";
import View from "./view";
import Text from "./text";

const sizeClasses: SizeClassesProps = {
  small: "h-8 text-xs px-2 py-1",
  medium: "h-10 text-sm px-3 py-2",
  large: "h-12 text-base px-4 py-3",
  default: "h-10 text-sm px-3 py-2",
};

const variantClasses: VariantProps = {
  error: "border border-danger focus:ring-danger/30",
  default: "border border-neutral-300 bg-white dark:bg-transparent",
  outlined: "border-2 border-primary-400 bg-white",
  filled: "border border-neutral-300 bg-neutral-100",
};

const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  style,
  value,
  error,
  onBlur,
  onChange,
  leftIcon,
  rightIcon,
  className,
  placeholder,
  options = [],
  defaultValue,
  disabled = false,
  fullWidth = false,
  variant = "default",
  selectSize = "medium",
  required = false,
  ...rest
}) => {
  return (
    <View>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <View className={`relative ${fullWidth ? "w-full" : ""}`}>
        {leftIcon && (
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            {leftIcon}
          </View>
        )}
        <select
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          value={value}
          id={id}
          name={name}
          className={`w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition appearance-none bg-white dark:bg-transparent 
            ${variantClasses[variant]} 
            ${sizeClasses[selectSize]} 
            ${leftIcon ? "pl-10" : ""} 
            ${rightIcon ? "pr-10" : ""} 
            ${error && "border-red-500"}
            ${className || ""}`}
          style={style}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options?.map((option) => (
            <option
              key={option?.value + ""}
              value={option?.value}
              selected={option?.value === value ? true : false}
              disabled={option?.disabled}
              className="dark:bg-card dark:border-b dark:border-background dark:shadow-md"
            >
              {option?.label}
            </option>
          ))}
        </select>
        {rightIcon ? (
          <View className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            {rightIcon}
          </View>
        ) : (
          <View className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </View>
        )}
        {error && (
          <Text as="p" className="text-red-500 text-sm mt-1">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Select;
