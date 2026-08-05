export type VariantType = 'default' | 'error' | 'outlined' | 'filled';
export type SizeType = 'small' | 'medium' | 'large' | 'default';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  id?: string;
  name: string;
  label?: string;
  value?: string[];
  onChange?: (name: string, value: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  options?: MultiSelectOption[];
  allowCustomValues?: boolean;
  variant?: VariantType;
  size?: SizeType;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}