// src/components/sidebar/SidebarDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import { SidebarDropdownProps } from "@/interfaces/components/sidebar/dropdown";

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  title,
  icon,
  children,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onToggle,
  className = "",
  variant = "default",
  disabled = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // Check if any child is active
  const hasActiveChild = React.Children.toArray(children).some((child: any) => {
    if (!child || !child.props) return false;
    
    // If the child has a 'to' prop, check if it matches the current path
    if (child.props.to) {
      const currentPath = window.location.pathname;
      const targetPath = new URL(child.props.to, window.location.origin).pathname;
      const baseTargetPath = targetPath.split('?')[0];
      
      return currentPath.startsWith(baseTargetPath) && 
             (currentPath === targetPath || currentPath.startsWith(`${baseTargetPath}/`));
    }
    
    return false;
  });

  // Track if the dropdown was manually toggled by the user
  const userToggledRef = useRef(false);

  // Auto-expand if any child is active (only if user hasn't manually toggled it)
  useEffect(() => {
    if (hasActiveChild && !isOpen && controlledIsOpen === undefined && !userToggledRef.current) {
      setInternalIsOpen(true);
    }
  }, [hasActiveChild, isOpen, controlledIsOpen]);

  const handleToggle = () => {
    if (disabled) return;

    const newIsOpen = !isOpen;
    userToggledRef.current = true; // Mark as manually toggled by user

    if (controlledIsOpen === undefined) {
      setInternalIsOpen(newIsOpen);
    }

    onToggle?.(newIsOpen);
  };

  // Calculate content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  const variantClasses = {
    // default: "hover:bg-primary dark:hover:bg-primary text-white",
    // primary: "hover:bg-primary dark:hover:bg-primary text-white",
    // secondary:
    //   "text-white dark:text-neutral-400 hover:bg-primary-background hover:text-primary dark:hover:bg-primary dark:hover:text-white",
    default: "hover:bg-white/10 dark:hover:bg-white/10 text-white/90 hover:text-white",
    primary: "hover:bg-white/10 dark:hover:bg-white/10 text-white/90 hover:text-white",
    secondary:
      "text-white/90 dark:text-slate-300 hover:bg-white/10 hover:text-white dark:hover:bg-white/10 dark:hover:text-white",
  };

  const dropdownId = `dropdown-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <View className={`sidebar-dropdown ${className}`}>
      {/* Dropdown Header */}
      <View
  //       className={`
  //   flex items-center justify-between w-full px-3 py-2.5 rounded-lg cursor-pointer 
  //   transition-all duration-200 group relative
  //   ${variantClasses[variant]}
  //   ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}
  //   ${
  //     isOpen
  //       ? `shadow-sm !text-primary dark:!text-white font-medium bg-primary-background dark:bg-primary`
  //       : ""
  //   }
  // `}
  className={`
    flex items-center justify-between w-full px-3 py-2 rounded-lg cursor-pointer
    transition-all duration-200 group relative
    ${variantClasses[variant]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${
      isOpen
        ? `!text-white font-medium bg-white/15 backdrop-blur-sm shadow-sm`
        : ""
    }
  `}
        onClick={handleToggle}
        role="button"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <View
          style={{ paddingLeft: 4 }}
          className="flex items-center gap-3 min-w-0 flex-1 "
        >
          {icon && (
            <View
              className={`flex-shrink-0 transition-colors duration-200  ${
                isOpen ? "" : "dark:text-text-current dark:hover:text-white"
              }`}
            >
              {icon}
            </View>
          )}
          <Text as="span" className="font-medium truncate text-sm">
            {title}
          </Text>
        </View>

        {/* Improved chevron animation */}
        <View
          className={`
          flex-shrink-0 transition-all duration-300 ease-out
          ${
            isOpen
              ? "rotate-90 text-current"
              : "rotate-0 text-neutral-400 dark:text-neutral-500"
          }
          ${!disabled ? "group-hover:text-current" : ""}
        `}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </View>

        {/* Subtle active indicator */}
        {isOpen && (
          <View className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4  rounded-r-full" />
        )}
      </View>

      {/* Animated Dropdown Content */}
      <View
        className="overflow-hidden transition-all duration-300 ease-out pb-2"
        style={{
          maxHeight: isOpen ? contentHeight + 10 : 0,
          paddingBottom: isOpen ? "0.5rem" : 0,
        }}
      >
        <View
          ref={contentRef}
          id={dropdownId}
          style={{ marginLeft: 22 }}
          // className="mt-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700 pl-3 text-primary"
          className="mt-1 space-y-0.5 border-l border-white/20 dark:border-white/20 pl-3"
        >
          {children}
        </View>
      </View>
    </View>
  );
};

export default SidebarDropdown;
