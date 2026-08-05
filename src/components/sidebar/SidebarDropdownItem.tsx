// src/components/sidebar/SidebarDropdownItem.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import { SidebarDropdownItemProps } from "@/interfaces/components/sidebar/dropdown";

import { usePermissions } from "@/utils/custom-hooks/use-permissions";

const SidebarDropdownItem: React.FC<SidebarDropdownItemProps> = ({
  to,
  icon,
  label,
  isActive: propIsActive,
  onClick,
  className = "",
  badge,
  disabled = false,
  children,
  requiredPermission,
}) => {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  
  // Permission check
  if (requiredPermission && !hasPermission(requiredPermission as any)) {
    return null;
  }

  // Auto-detect active state if not provided
  // const currentPath = location.pathname + location.search;
  // const isActive =
  //   propIsActive !== undefined ? propIsActive : to ? currentPath === to : false;
  const currentPath = location.pathname;
  const targetPath = to ? new URL(to, window.location.origin).pathname : "";
  // const searchParams = to ? new URL(to, window.location.origin).search : "";
  const baseTargetPath = targetPath.split("?")[0];

  // Check if current path starts with the target path (for sub-routes)
  // or if it's an exact match (for the exact route)
  const isActive =
    propIsActive !== undefined
      ? propIsActive
      : to
      ? currentPath.startsWith(baseTargetPath) &&
        (currentPath === targetPath ||
          currentPath.startsWith(`${baseTargetPath}/`))
      : false;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  // const itemClasses = `
  //   flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200
  //   group relative overflow-hidden
  //   ${
  //     isActive
  //       ? "bg-primary-100 text-primary shadow-sm dark:bg-primary-900/30 dark:text-primary"
  //       : "hover:bg-primary-background hover:text-primary dark:hover:bg-primary dark:hover:text-white text-white hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
  //   }
  //   ${
  //     disabled
  //       ? "opacity-50 cursor-not-allowed"
  //       : "cursor-pointer hover:shadow-sm"
  //   }
  //   ${className}
  // `;
  const itemClasses = `
    flex items-center justify-between w-full px-3 py-1.5 rounded-lg transition-all duration-200
    group relative overflow-hidden
    ${
      isActive
        ? "bg-white/20 text-white shadow-sm backdrop-blur-sm"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const badgeElement = badge && (
    <View className="flex-shrink-0">
      <View
        className={`
        px-2 py-0.5 rounded-full text-xs font-medium min-w-[20px] text-center
        transition-colors duration-200
        ${
          isActive
            ? "bg-primary-600 text-white"
            : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
        }
      `}
      >
        {badge}
      </View>
    </View>
  );

  const content = (
    <>
      {/* Active indicator */}
      {isActive && (
        <View className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full" />
      )}

      <View className="flex items-center gap-2.5 min-w-0 flex-1">
        {icon && (
          <View
            className={`
            flex-shrink-0 transition-colors duration-200
            ${
              isActive
                ? "text-current"
                : "text-neutral-500 dark:text-neutral-400 group-hover:text-current"
            }
          `}
          >
            {icon}
          </View>
        )}
        <Text
          as="span"
          className={`text-sm font-medium truncate ${
            isActive ? "text-white" : ""
          }`}
        >
          {label}
        </Text>
      </View>

      {badgeElement}
    </>
  );

  if (to && !disabled) {
    return (
      <>
        <Link to={to} className={itemClasses} onClick={handleClick}>
          {content}
        </Link>
        {children && <View className="ml-8 mt-1 space-y-0.5">{children}</View>}
      </>
    );
  }

  return (
    <>
      <View
        className={itemClasses}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
      >
        {content}
      </View>
      {children && <View className="ml-8 mt-1 space-y-0.5">{children}</View>}
    </>
  );
};

export default SidebarDropdownItem;
