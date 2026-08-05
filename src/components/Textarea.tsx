import { textareaProps } from "@/interfaces/components/input/input";
import View from "./view";

const Textarea: React.FC<textareaProps> = ({
  type = "text",
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Enter text",
  value,
  // defaultValue,
  variant = "default",
  fullWidth = false,
  id,
  name,
  ref,
  style,
  className,
  leftIcon,
  rightIcon,
  error,
  label,
  labelClassName,
  required = false,
  ...rest
}) => {
  const setVariantHandler = (variant: any) => {
    // if (variant == "danger") {
    //   return "border-danger focus:ring-danger/30";
    // }
    // if (variant == "filled") {
    //   return "w-full p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition bg-primary";
    // } else {
    //   return "w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition";
    // }
    if (variant == "danger" || variant == "error") {
      return "border-red-500 dark:border-red-400 bg-white dark:bg-slate-800";
    }
    if (variant == "filled") {
      return "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700";
    } else {
      return "border-slate-300 dark:border-slate-600 bg-white dark:bg-background";
    }
  };

  return (
    <View>
      {label && (
        // <label htmlFor={name} className="block mb-0.5 text-text-dark">
        //   {label}
        //   {required && <span className="text-red-600">*</span>}
        // </label>
        <label htmlFor={name} className={`block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <View className={`input-wrapper ${fullWidth ? "w-full" : ""}`}>
        {leftIcon && <View className="input-icon-left">{leftIcon}</View>}
        <textarea
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          value={value + ""}
          // defaultValue={defaultValue}
          id={id}
          name={name}
          // className={`w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition dark:bg-background ${setVariantHandler(
          //   variant
          // )} input-${variant} ${className || ""}`}
          className={`w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[100px] ${setVariantHandler(
            variant
          )} ${error ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400" : ""} ${className || ""}`}
          style={style}
          {...rest}
        ></textarea>
      </View>
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
       {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
    </View>
  );
};
export default Textarea;
