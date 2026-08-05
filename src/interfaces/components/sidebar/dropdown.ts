// src/interfaces/components/sidebar/dropdown.ts
import React from 'react';

export interface SidebarDropdownProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
  disabled?: boolean;
}

export interface SidebarDropdownItemProps {
  to?: string;
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: React.ReactNode;
  requiredPermission?: string;
}

export interface DropdownState {
  isOpen: boolean;
  activeItem?: string;
}