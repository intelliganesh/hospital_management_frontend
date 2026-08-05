export interface MultiSelectProps {
  id?: string;
  name?: string;
  label?: string;
  style?: React.CSSProperties;
  value?: any[] | undefined | null;
  error?: string;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (values: any[]) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  // options?: Array<{
  //   value: any;
  //   label: string;
  //   disabled?: boolean;
  // }>;
  options?: any[];
  defaultValue?: any[];
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: keyof VariantProps;
  selectSize?: keyof SizeClassesProps;
  required?: boolean;
  displayCount?: number;
  maxSelections?: number;
  showSelectAll?: boolean;
  closeOnSelect?: boolean;
  singleSelect?: boolean;
  allowCustomValues?: boolean;
}

export interface VariantProps {
  error: string;
  default: string;
  outlined: string;
  filled: string;
}

export interface SizeClassesProps {
  small: string;
  medium: string;
  large: string;
  default: string;
}
