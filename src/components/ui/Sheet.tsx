import React, { useEffect } from "react";
import View from "../view";
import Text from "../text";
import Button from "../button";
import { X } from "lucide-react";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  side?: "right" | "left";
}

const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  side = "right",
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  // const sideClasses = {
  //   right: "right-0 translate-x-0",
  //   left: "left-0 translate-x-0",
  // };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <View
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm transition-opacity duration-300"
    >
      <View
        className={`fixed inset-y-0 ${side === "right" ? "right-0" : "left-0"} h-full w-full ${
          sizeClasses[size]
        } bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-border animate-in slide-in-from-right`}
      >
        <View className="p-6 border-b border-border flex justify-between items-start">
          <View>
            <Text
              as="h2"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              {title}
            </Text>
            {description && (
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                {description}
              </p>
            )}
          </View>
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 w-12 p-0 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </Button>
        </View>

        <View className="flex-1 overflow-y-auto p-6">
          {children}
        </View>

        {footer && (
          <View className="p-6 border-t border-border bg-slate-50 dark:bg-slate-800/50">
            {footer}
          </View>
        )}
      </View>
    </View>
  );
};

export default Sheet;
