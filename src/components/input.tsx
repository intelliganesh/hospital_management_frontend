// Input component
import { InputProps } from "@/interfaces/components/input/input";
import View from "./view";

interface CSSProps {
  small: string;
  medium: string;
  large: string;
}
interface VariantProps {
  default: string;
  filled: string;
  error: string;
  outlined: string;
}

const sizeClasses: CSSProps = {
  // small: "h-8 text-xs px-2 py-1",
  // medium: "h-10 text-sm px-3 py-2",
  // large: "h-12 text-base px-4 py-3",
  small: "h-9 text-sm px-3 py-2",
  medium: "h-10 text-sm px-3 py-2.5",
  large: "h-12 text-base px-4 py-3",
};

const setVariantHandler: VariantProps = {
  // outlined: "",
  // error: "border-danger focus:ring-danger/30",
  // default:
  //   "w-full p-3 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition",
  // filled:
  //   "w-full p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition bg-primary",
  outlined:
    "border-2 border-primary-500 dark:border-primary-400 bg-white dark:bg-slate-800",
  error:
    "border-1 border-red-500 dark:border-red-400 bg-white dark:bg-slate-800",
  default: "border-slate-300 dark:border-slate-600 bg-white dark:bg-background",
  filled:
    "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700",
};

const Input: React.FC<InputProps> = ({
  id,
  ref,
  name,
  style,
  error,
  value,
  label,
  onBlur,
  onChange,
  leftIcon,
  rightIcon,
  className,
  type = "text",
  disabled = false,
  fullWidth = false,
  variant = "default",
  inputSize = "medium",
  placeholder = "Enter text",
  required = false,
  ...rest
}) => {
  return (
    <View className="relative w-full">
      {label && (
        // <label htmlFor={name}>
        //   {label}
        //   {required && <span className="text-red-600 ">*</span>}
        // </label>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <View className={`input-wrapper ${fullWidth ? "w-full" : ""}`}>
        {leftIcon && <View className="input-icon-left">{leftIcon}</View>}
        <input
          id={id}
          ref={ref}
          name={name}
          type={type}
          value={value?.toString()}
          style={style}
          onBlur={onBlur}
          autoComplete="off"
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          // className={`w-full px-4 py-2.5  rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition ${
          //   setVariantHandler[variant]
          // } input-${variant}  input-${sizeClasses[inputSize]} ${
          //   error && "border-red-500"
          // } ${className || ""}`}
          className={`w-full rounded-lg border transition-all duration-200 ${
            type !== "checkbox" &&
            "focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400"
          } text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed ${
            sizeClasses[inputSize]
          } ${setVariantHandler[variant]} ${
            error
              ? "border-1 border-red-500 dark:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20"
              : ""
          } ${type === "date" ? "dark:[color-scheme:dark]" : ""} ${
            className || ""
          }`}
          {...rest}
        />
        {rightIcon && <div className="input-icon-right">{rightIcon}</div>}
      </View>
      {/* {error && <p className="text-red-500 text-sm mt-1">{error}</p>} */}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
      )}
    </View>
  );
};

export default Input;
