import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import View from "./view";
import Text from "./text";

interface CollapsibleContainerProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
  headerTitleClassName?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  autoOpen?: boolean;
  variant?: "default" | "card" | "minimal" | "bordered" | "custom";
  colorScheme?: {
    primary: string;
    primaryHover?: string;
    darkPrimary?: string;
    shadow?: string;
    textColor?: string;
    borderColor?: string;
  };
}

const CollapsibleContainer: React.FC<CollapsibleContainerProps> = ({
  title,
  children,
  defaultOpen = false,
  headerClassName = "",
  contentClassName = "",
  containerClassName = "",
  headerTitleClassName = "",
  icon,
  subtitle,
  autoOpen = defaultOpen,
  variant = "default",
  colorScheme,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<string>("auto");
  const isFirstRender = useRef(true);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  // Only update isOpen when autoOpen changes (but not on first render if defaultOpen is set)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // console.log("hi");

    setIsOpen(autoOpen);
  }, [autoOpen]);

  // Use useLayoutEffect to measure before paint
  useLayoutEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(`${height}px`);
    }
  }, [children, isOpen]);

  // Recalculate height on window resize
  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContentHeight(`${height}px`);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case "card":
        return {
          container: "bg-card rounded-lg shadow-md border border-gray-200",
          header: "bg-gray-50 px-6 py-4 border-b border-gray-200",
          content: "p-6",
        };
      case "minimal":
        return {
          container: "",
          header: "py-4 border-b border-white",
          content: "py-4",
        };
      case "bordered":
        return {
          container: "border border-border rounded-md",
          header: "px-4 py-3 bg-background border-b border-border",
          content: "p-4",
        };
      case "custom":
        return {
          container: `bg-card rounded-lg border ${isOpen ? "border-2" : "border"}`,
          header: `p-4 bg-card border-b border-border ${
            colorScheme?.primary || "bg-primary"
          } ${colorScheme?.darkPrimary || ""} ${
            colorScheme?.shadow || ""
          } rounded-t-lg ${colorScheme?.textColor || "text-white"} font-bold`,
          content: "p-4",
          // containerClassName: `bg-card rounded-lg border ${
          //   colorScheme?.borderColor || "border-border"
          // } border-2`,
        };
      default:
        return {
          container: "bg-card rounded-lg shadow-lg border border-border",
          header: "px-6 py-4 bg-card border-b border-border",
          content: "p-6",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <View
      className={`${styles.container} ${containerClassName} transition-all duration-300`}
    >
      {/* Header */}
      <View
        className={`${styles.header} ${headerClassName} cursor-pointer hover:bg-opacity-80 transition-colors duration-200`}
        onClick={toggleCollapse}
      >
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-3">
            {icon && <View className="text-blue-600">{icon}</View>}
            <View>
              <Text
                as="h3"
                weight="font-bold"
                className={`text-lg ${headerTitleClassName}`}
              >
                {title}
              </Text>
              {subtitle && (
                <Text className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
          <View className="text-primary hover:text-primary-600 transition-colors duration-200">
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </View>
        </View>
      </View>

      {/* Content with smooth height transition */}
      <View
        className="transition-all duration-300 ease-in-out overflow-y-auto"
        style={{
          maxHeight: isOpen ? contentHeight : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <View
          ref={contentRef}
          className={`${styles.content} ${contentClassName}`}
        >
          {children}
        </View>
      </View>
    </View>
  );
};

export default CollapsibleContainer;
