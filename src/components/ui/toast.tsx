import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import View from "../view";
import Button from "../button";

// Add global styles for animations
const animationStyles = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .toast-enter {
    animation: slideInRight 0.3s ease-out forwards;
  }
  
  .toast-exit {
    animation: slideOutRight 0.3s ease-out forwards;
  }
`;

// Add styles to the document head
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = animationStyles;
  document.head.appendChild(styleElement);
}

// ----------------------------
// Toast Variant Type
// ----------------------------
export type ToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "neutral"
  | "dark";

// ----------------------------
// Toast Events Emitter
// ----------------------------
const toastEvents = {
  listeners: new Map<string, Function[]>(),

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    return () => this.off(event, callback);
  },

  off(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index !== -1) callbacks.splice(index, 1);
  },

  emit(event: string, ...args: any[]) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach((callback) => callback(...args));
  },
};

export { toastEvents };

// ----------------------------
// Toast Provider
// ----------------------------
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return children;
}

// ----------------------------
// Toast Component
// ----------------------------
interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  variant?: ToastVariant;
  className?: string;
  children: React.ReactNode;
}

export function Toast({
  className = "",
  variant = "default",
  id,
  children,
  ...props
}: ToastProps) {
  const [isExiting, setIsExiting] = React.useState(false);
  const toastRef = React.useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  const variantIcons: Record<ToastVariant, React.ReactNode> = {
    default: <Info className="h-5 w-5 text-gray-400" />,
    destructive: <AlertCircle className="h-5 w-5 text-red-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    neutral: <Info className="h-5 w-5 text-gray-500" />,
    dark: <Info className="h-5 w-5 text-gray-300" />,
  };

  const variantClasses: Record<ToastVariant, string> = {
    default: "bg-white border border-gray-200 text-gray-900",
    destructive: "bg-white border border-red-100 text-gray-900",
    success: "bg-white border border-green-100 text-gray-900",
    warning: "bg-white border border-yellow-100 text-gray-900",
    info: "bg-white border border-blue-100 text-gray-900",
    neutral: "bg-white border border-gray-100 text-gray-900",
    dark: "bg-gray-800 border-gray-700 text-white",
  };

  const baseClasses =
    "group pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg p-4 shadow-md transition-all";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const handleClose = () => {
    if (isExiting) return;

    setIsExiting(true);

    // Wait for exit animation to complete before removing
    setTimeout(() => {
      if (isMounted) {
        toastEvents.emit("DISMISS_TOAST", id);
      }
    }, 250); // Slightly less than animation duration to ensure smooth transition
  };

  // Add animation classes based on state
  const animationClass = isExiting ? "toast-exit" : "toast-enter";

  return (
    <View
      ref={toastRef}
      className={`${combinedClasses} ${animationClass}`}
      {...props}
    >
      <View className="mt-0.5">{variantIcons[variant]}</View>
      <View className="flex-1">{children}</View>
      <ToastClose onClick={handleClose} variant={variant} />
    </View>
  );
}

// ----------------------------
// ToastViewport Component
// ----------------------------
export function ToastViewport({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const base =
    "fixed top-4 right-4 z-[10000] flex max-h-screen w-full flex-col gap-3 p-0 shadow-md sm:bottom-auto  sm:left-auto sm:right-4 sm:top-4 sm:w-96 overflow-hidden";
  const combined = `${base} ${className}`;

  // Add pointerEvents to allow clicks to pass through when not hovering over a toast
  return (
    <View className={combined} style={{ pointerEvents: "none" }} {...props} />
  );
}

// ----------------------------
// ToastTitle Component
// ----------------------------
export function ToastTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View className={`text-sm font-medium leading-5 ${className}`} {...props} />
  );
}

// ----------------------------
// ToastDescription Component
// ----------------------------
export function ToastDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View className={`mt-1 text-sm text-gray-500 ${className}`} {...props} />
  );
}

// ----------------------------
// ToastClose Component
// ----------------------------
interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ToastVariant;
}

export function ToastClose({
  className = "",
  onClick,
  variant = "default",
  ...props
}: ToastCloseProps) {
  const variantClasses: Record<ToastVariant, string> = {
    default:
      "text-gray-400 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-200",
    destructive:
      "text-red-400 hover:bg-red-50 hover:text-red-600 focus:ring-red-200",
    success:
      "text-green-400 hover:bg-green-50 hover:text-green-600 focus:ring-green-200",
    warning:
      "text-yellow-500 hover:bg-yellow-50 hover:text-yellow-700 focus:ring-yellow-200",
    info: "text-blue-400 hover:bg-blue-50 hover:text-blue-600 focus:ring-blue-200",
    neutral:
      "text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-gray-200",
    dark: "text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-gray-600",
  };

  const baseClasses =
    "absolute right-2 top-2 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";

  const combined = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <Button
      className={combined}
      onClick={onClick}
      aria-label="Close toast"
      type="button"
      {...props}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

// ----------------------------
// ToastAction Button
// ----------------------------
interface ToastActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ToastVariant;
}

export function ToastAction({
  className = "",
  variant = "default",
  ...props
}: ToastActionProps) {
  const variantClasses: Record<ToastVariant, string> = {
    default: "bg-transparent border-gray-200 hover:bg-gray-100",
    destructive: "bg-red-700 border-red-800 text-white hover:bg-red-800",
    success: "bg-green-100 border-green-200 text-green-800 hover:bg-green-200",
    warning:
      "bg-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-200",
    info: "bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200",
    neutral: "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200",
    dark: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
  };

  const baseClasses =
    "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 disabled:pointer-events-none disabled:opacity-50";

  const combined = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <Button className={combined} {...props} />;
}
