import {
  BtnVariant,
  ButtonProps,
  SetButtonSizeProps,
} from "@/interfaces/components/button";

// const setVariantCssHandler: Partial<Record<BtnVariant | "default", string>> = {
//   default: "bg-primary hover:bg-primary-600",
//   ghost: "bg-transparent outline-none focus:outline-none",
//   danger: "bg-danger text-white focus:outline-none outline-none hover:bg-red-800",
//   primary: "bg-primary outline-none hover:bg-primary-600  text-white",
//   outline:
//     "border border-border bg-transparent hover:bg-neutral-200 dark:hover:bg-primary dark:hover:border-primary ",
// };
const setVariantCssHandler: Partial<Record<BtnVariant | "default", string>> = {
  default: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
  ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 outline-none focus:outline-none",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
  outline:
    "border border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300",
};

const setButtonSize: SetButtonSizeProps = {
  // large: "px-5 py-3 text-lg",
  // small: "px-3 py-1.5 text-sm",
  // medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-base",
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-sm",
  icon: "p-2",
};
const Button: React.FC<ButtonProps> = ({
  style,
  onPress,
  className,
  size = "medium",
  loading = false,
  disabled = false,
  children = "Button",
  htmlType = "button",
  variant = "primary",
  ...props
}) => {
  //focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
  return (
    <button
      type={htmlType}
      onClick={onPress}
      style={{ cursor: loading ? "progress" : "pointer", ...style }}
      disabled={disabled || loading}
      // className={`${loading ? "progress" : "auto"} ${setButtonSize[size]} ${
      //   setVariantCssHandler[variant]
      // } font-medium transition focus:outline-none   rounded-md py-3 ${className} `}
      className={`${loading ? "progress" : "auto"} ${setButtonSize[size]} ${
        setVariantCssHandler[variant]
      } font-medium transition-all duration-200  rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
