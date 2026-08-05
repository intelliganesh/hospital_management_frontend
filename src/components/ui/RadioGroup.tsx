import React, { createContext, useContext } from "react"
import type { RadioGroupProps, RadioGroupItemProps } from "@/interfaces/components/radioGropus/radioGroups"
import View from "../view"
import { Input } from "./input"

const RadioGroupContext = createContext<{
  name?: string
  value?: string
  onValueChange?: (value: string) => void
}>({})

const RadioGroup: React.FC<RadioGroupProps> = ({ 
  children, 
  className = "", 
  value, 
  onValueChange,
  name,
  ...props 
}) => {
  return (
    <RadioGroupContext.Provider value={{ name, value, onValueChange }}>
      <View role="radiogroup" className={`flex items-center space-x-4 ${className}`} {...props}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  )
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className = "", style, id, value, disabled, icon, label, ...props }, ref) => {
    const { name, value: selectedValue, onValueChange } = useContext(RadioGroupContext)
    const uniqueId = id || `radio-${name}-${value}`
    const isChecked = selectedValue === value

    return (
      <View className="flex items-center space-x-2">
        <Input
          ref={ref}
          type="radio"
          id={uniqueId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onValueChange?.(value)}
          disabled={disabled}
          className={`appearance-none h-4 w-4 rounded-full border border-border checked:border-2 cursor-pointer checked:border-primary checked:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          style={style}
          {...props}
        />
        <label htmlFor={uniqueId} className="flex items-center cursor-pointer text-sm">
          {icon && <span className="mr-1.5">{icon}</span>}
          {label}
        </label>
      </View>
    )
  }
)

RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }