import View from "./view";
import Text from "./text";
import Button from "./button";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true,
  size = "md",
  closeOnOutsideClick = true,
  closeOnEsc = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    // xl: "max-w-xl",
    // full: "max-w-full mx-4",
    xl: "max-w-4xl",
    full: "max-w-6xl mx-4",
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOutsideClick) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <View
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      // className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-4 "
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6 overflow-auto"
    >
      <View
        // className={`w-full ${sizeClasses[size]} bg-white dark:bg-background rounded-lg shadow-lg overflow-hidden border border-border`}
        className={`w-full ${sizeClasses[size]} bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border-0 animate-fade-in`}
      >
        {/* <View className="p-6 border-b border-neutral-200 flex justify-between items-start"> */}
        <View className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
          <View>
            <Text
              as="h2"
              // className="text-xl text-black font-bold text-text-DEFAULT dark:text-white"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              {title}
            </Text>
            {description && (
              // <p className="text-text-light mt-1">{description}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {description}
              </p>
            )}
          </View>
          {showCloseButton && (
            <Button
              variant="ghost"
              onClick={onClose}
              // className="h-8 w-8 rounded-full flex items-center justify-center  text-black  dark:text-white hover:bg-primary-50"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <Text as="span" className="text hover:text-primary">
                X
              </Text>
            </Button>
          )}
        </View>

        <View className="p-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          {children}
        </View>

        {footer && (
          // <View className="bg-neutral-50 p-6 border-t border-neutral-200">
          <View className="bg-slate-50 dark:bg-slate-700/50 p-6 border-t border-slate-200 dark:border-slate-700">
            {footer}
          </View>
        )}
      </View>
    </View>,
    document.body,
  );
};

export default Modal;
