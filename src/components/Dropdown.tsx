import { DropdownProps } from "@/interfaces/components/input/dropdownProps";
import { useState, useRef, useEffect } from "react";
import View from "./view";
import Text from "./text";

const Dropdown: React.FC<DropdownProps> = ({
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Select an option",
  value,
  defaultValue,
  dropdownSize = "medium",
  variant = "default",
  fullWidth = false,
  id,
  name,
  style,
  className,
  options = [],
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (onBlur) onBlur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onBlur]);

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;
    
    setSelectedValue(optionValue);
    setIsOpen(false);
    
    if (onChange) {
      onChange(optionValue);
    }
  };

  const selectedLabel = options.find(option => option.value === selectedValue)?.label || placeholder;

  return (
    <View 
      ref={dropdownRef}
      className={`dropdown-wrapper ${fullWidth ? "w-full" : ""} ${disabled ? "dropdown-disabled" : ""}`}
      style={style}
    >
      <View 
        className={`dropdown-selected dropdown-${variant} dropdown-${dropdownSize} ${className || ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={rest["aria-label"]}
      >
        {leftIcon && <View className="dropdown-icon-left">{leftIcon}</View>}
        <View className="dropdown-selected-text">
          {selectedValue ? selectedLabel : <Text as="span" className="dropdown-placeholder">{placeholder}</Text>}
        </View>
        {rightIcon ? (
          <View className="dropdown-icon-right">{rightIcon}</View>
        ) : (
          <View className={`dropdown-arrow ${isOpen ? "dropdown-arrow-up" : ""}`}>▼</View>
        )}
      </View>
      
      {isOpen && (
        <ul className="dropdown-options" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-option ${selectedValue === option.value ? "dropdown-option-selected" : ""} ${option.disabled ? "dropdown-option-disabled" : ""}`}
              onClick={() => !option.disabled && handleOptionClick(option.value)}
              role="option"
              aria-selected={selectedValue === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </View>
  );
};

export default Dropdown;