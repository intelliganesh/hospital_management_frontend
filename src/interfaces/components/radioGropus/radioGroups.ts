import { CSSProperties, ReactNode, InputHTMLAttributes, HTMLAttributes } from "react"

export interface BaseProps {
  className?: string
  style?: CSSProperties
}

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  children: ReactNode
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

export interface RadioGroupItemProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>, BaseProps {
  value: string
  icon?: ReactNode
  label?: string
}