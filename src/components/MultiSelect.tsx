// src/components/MultiSelect.tsx
import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import View from '@/components/view';
import { X } from 'lucide-react';
import { MultiSelectProps, SizeType, VariantType } from '@/interfaces/components/multiselect';
import Text from './text';

// Define variant types


// Variant classes mapping
const variantClasses: Record<VariantType, string> = {
  error: "border border-danger bg-white",
  default: "border border-neutral-300 bg-white dark:bg-transparent",
  outlined: "border-2 border-primary-400 bg-white",
  filled: "border border-neutral-300 bg-neutral-100",
};

// Size classes mapping
const sizeClasses: Record<SizeType, string> = {
  small: "min-h-[32px] text-xs py-1 px-2",
  medium: "min-h-[40px] text-sm py-2 px-3",
  large: "min-h-[48px] text-base py-3 px-4",
  default: "min-h-[40px] text-sm py-2 px-3",
};

// Tag size classes
const tagSizeClasses: Record<SizeType, string> = {
  small: "py-0 px-1 text-xs",
  medium: "py-1 px-2 text-sm",
  large: "py-1.5 px-2.5 text-base",
  default: "py-1 px-2 text-sm",
};



const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  name,
  label,
  value = [],
  onChange,
  placeholder = 'Type and press Enter to add...',
  className = '',
  error,
  disabled = false,
  required = false,
  options = [],
  allowCustomValues = true,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Check if the value already exists
      if (!value.includes(inputValue.trim())) {
        // If options are provided and custom values aren't allowed,
        // check if the input matches an option
        if (options.length > 0 && !allowCustomValues) {
          const matchingOption = options.find(
            option => option.label.toLowerCase() === inputValue.trim().toLowerCase()
          );
          
          if (matchingOption) {
            addValue(matchingOption.value);
          }
        } else {
          // Add the custom value
          addValue(inputValue.trim());
        }
      }
      
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove the last tag when backspace is pressed in an empty input
      removeValue(value[value.length - 1]);
    }
  };

  const addValue = (newValue: string) => {
    if (onChange) {
      onChange(name, [...value, newValue]);
    }
  };

  const removeValue = (valueToRemove: string) => {
    if (onChange) {
      onChange(name, value.filter(v => v !== valueToRemove));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Determine if we should show the error variant
  const effectiveVariant = error ? 'error' : variant;

  return (
    <View className={`multi-select ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-red-600 ">*</span>}
        </label>
      )}
      
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            {leftIcon}
          </View>
        )}
        
        <View 
          className={`
            rounded-md flex flex-wrap gap-2 cursor-text
            ${variantClasses[effectiveVariant]} 
            ${sizeClasses[size]}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-70' : ''}
            ${isFocused ? 'ring-2 ring-primary border-primary' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
          onClick={() => {
            // Find the input element and focus it
            const inputElement = document.getElementById(`${id || name}-input`);
            if (inputElement) {
              inputElement.focus();
            }
          }}
        >
          {/* Selected values */}
          {value.map((val) => (
            <View 
              key={val} 
              className={`
                bg-primary-50 text-primary rounded-md flex items-center gap-1
                ${tagSizeClasses[size]}
              `}
            >
              <Text as="span">{val}</Text>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(val);
                  }}
                  className="text-primary hover:text-primary-600 focus:outline-none"
                >
                  <X size={size === 'small' ? 12 : size === 'large' ? 18 : 14} />
                </button>
              )}
            </View>
          ))}
          
          {/* Input field */}
          <input
            id={`${id || name}-input`}
            name={`${name}_input`}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            className={`
              flex-grow outline-none bg-transparent
              ${size === 'small' ? 'text-xs min-w-[80px]' : 
                size === 'large' ? 'text-base min-w-[150px]' : 'text-sm min-w-[120px]'}
            `}
          />
        </View>
        
        {rightIcon && (
          <View className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            {rightIcon}
          </View>
        )}
      </View>
      
      {/* Error message */}
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
      
      {/* Hidden input for form submission */}
      <input 
        type="hidden" 
        name={name} 
        value={value.join(',')} 
      />
    </View>
  );
};

export default MultiSelect;