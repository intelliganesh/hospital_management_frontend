import React, { useState, useRef, useEffect } from "react";
import View from "./view";
import Text from "./text";
import Input from "./input";
import { X, Check, ChevronsUpDown } from "lucide-react";

// Interface for multi selector props
interface MultiSelectorProps {
  id?: string;
  name?: string;
  label?: string;
  style?: React.CSSProperties;
  value?: any[];
  error?: string;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (value: any[]) => void;
  onFocus?: (event: React.FocusEvent) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  options?: Array<{
    value: any;
    label: string;
    disabled?: boolean;
  }>;
  defaultValue?: any[];
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: keyof VariantProps;
  selectSize?: keyof SizeClassesProps;
  required?: boolean;
  closeOnSelect?: boolean;
  allowCustomValues?: boolean;
  searchable?: boolean;
  autoComplete?: string;
  form?: string;
  multiple?: true;
  size?: number;
  tabIndex?: number;
  title?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  clearable?: boolean;
  noOptionsText?: string;
  loadingText?: string;
  isLoading?: boolean;
  maxSelected?: number;
}

interface VariantProps {
  error: string;
  default: string;
  outlined: string;
  filled: string;
}

interface SizeClassesProps {
  small: string;
  medium: string;
  large: string;
}

const sizeClasses: SizeClassesProps = {
  small: "min-h-9 text-sm px-3 py-1 rounded-md",
  medium: "min-h-10 text-sm px-4 py-1.5 rounded-lg",
  large: "min-h-13 text-base px-5 py-2 rounded-xl",
};

const variantClasses: VariantProps = {
  error: " bg-white dark:bg-background",
  default: "border border-gray-200 bg-white dark:bg-background hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 transition-colors duration-200",
  outlined: "border-2 border-blue-500 bg-transparent shadow-sm",
  filled: "border border-blue-100 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800/50",
};

const MultiSelector: React.FC<MultiSelectorProps> = ({
  id,
  name,
  label,
  style,
  value,
  error,
  onBlur,
  onChange,
  onFocus,
  leftIcon,
  rightIcon,
  className,
  placeholder,
  options = [],
  defaultValue,
  disabled = false,
  fullWidth = false,
  variant = "default",
  selectSize = "medium",
  required = false,
  closeOnSelect = false,
  allowCustomValues = false,
  searchable = true,
  autoComplete,
  form,
  tabIndex,
  title,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  clearable = true,
  noOptionsText = "No options found",
  loadingText = "Loading...",
  isLoading = false,
  maxSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [selectedValues, setSelectedValues] = useState<any[]>(() => {
    if (value !== undefined) return value;
    return defaultValue || [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [customOptions, setCustomOptions] = useState<Array<{value: any, label: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Combine original options with custom options
  const allOptions = [...options, ...customOptions];

  // Update selectedValues when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions = allOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term could be a custom value
  const canAddCustomValue = allowCustomValues && 
    searchTerm.trim() !== "" && 
    !allOptions.some(option => option.label.toLowerCase() === searchTerm.toLowerCase());

  const handleSelectOption = (optionValue: any) => {
    if (disabled) return;

    let newValues;
    if (selectedValues.includes(optionValue)) {
      newValues = selectedValues.filter(v => v !== optionValue);
    } else {
      if (maxSelected && selectedValues.length >= maxSelected) return;
      newValues = [...selectedValues, optionValue];
    }

    setSelectedValues(newValues);
    onChange?.(newValues);

    if (closeOnSelect) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleRemoveOption = (event: React.MouseEvent, optionValue: any) => {
    event.stopPropagation();
    const newValues = selectedValues.filter(v => v !== optionValue);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const handleAddCustomValue = () => {
    if (!allowCustomValues || !searchTerm.trim()) return;

    const customValue = searchTerm.trim();
    const newCustomOption = { value: customValue, label: customValue };
    
    setCustomOptions(prev => [...prev, newCustomOption]);
    
    // Auto select the new custom value
    if (maxSelected && selectedValues.length >= maxSelected) return;
    
    const newValues = [...selectedValues, customValue];
    setSelectedValues(newValues);
    onChange?.(newValues);
    
    setSearchTerm("");
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (disabled) return;

    setSelectedValues([]);
    onChange?.([]);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    // Prevent toggling if checking a checkbox or clicking a remove button
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (!dropdownRef.current?.contains(event.relatedTarget as Node)) {
      onBlur?.(event);
    }
  };

  const handleFocus = (event: React.FocusEvent) => {
    onFocus?.(event);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && canAddCustomValue) {
      event.preventDefault();
      handleAddCustomValue();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        // Only open on space/enter if not typing in search
        if (event.target === triggerRef.current) {
            event.preventDefault();
            setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const getOptionLabel = (val: any) => {
    const option = allOptions.find(opt => opt.value === val);
    return option?.label || val;
  };

  const hasValue = selectedValues.length > 0;

  return (
    <View className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-red-600 ">*</span>}
        </label>
      )}

      <View className={`${label ? "mt-2" : "mt-0"} relative ${fullWidth ? "w-full" : ""}`}>
        <View ref={dropdownRef}>
          {leftIcon && (
            <View className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground z-10">
              {leftIcon}
            </View>
          )}
          
          <View
            ref={triggerRef}
            onClick={toggleDropdown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            tabIndex={tabIndex || 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy || (error ? `${id || name}-error` : undefined)}
            aria-required={required}
            aria-disabled={disabled}
            aria-invalid={!!error}
            title={title}
            className={`w-full rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm flex items-center flex-wrap gap-2
              ${variantClasses[error ? 'error' : variant]} 
              ${sizeClasses[selectSize]} 
              ${leftIcon ? 'pl-12' : ''} 
              ${rightIcon || clearable ? 'pr-12' : 'pr-4'} 
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md focus:shadow-lg'}
              ${isOpen ? 'ring-1 ring-primary-500 shadow-md' : 'focus:outline-none focus:ring-1 focus:ring-primary-500'}
              ${error ? 'border border-border' : ''}
              ${className || ""}`}
            style={style}
          >
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => (
                <View 
                    key={val} 
                    className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    onClick={(e) => e.stopPropagation()} // Prevent opening dropdown when clicking tag
                >
                  <Text as="span">{getOptionLabel(val)}</Text>
                  {!disabled && (
                    <button
                        type="button"
                        onClick={(e) => handleRemoveOption(e, val)}
                        className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <X size={12} />
                    </button>
                  )}
                </View>
              ))
            ) : (
                <Text as="span" className="text-muted-foreground flex-1 truncate">
                    {placeholder || "Select options..."}
                </Text>
            )}
            
            {/* Right Icon / Chevron */}
            {rightIcon ? (
            <View className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
              {rightIcon}
            </View>
          ) : (
            <View className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
               <ChevronsUpDown size={15} />
            </View>
          )}
          </View>

          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <View className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors duration-150"
                aria-label="Clear selection"
              >
                <X size={14} className="text-slate-400 hover:text-slate-600" />
              </button>
            </View>
          )}

          {/* Dropdown Menu */}
          {isOpen && (
            <View 
              className="absolute top-full left-0 right-0 mt-2 bg-background backdrop-blur-lg border border-border dark:border-border rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden"
              role="listbox"
              aria-label="Options"
            >
              {/* Search Bar */}
              {searchable && (
                <View className="p-4 border-b border-border dark:border-border">
                  <View className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={allowCustomValues ? "Search or type to add..." : "Search options..."}
                      className="w-full pl-4 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground placeholder-slate-400 dark:placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200"
                      aria-label="Search options"
                    />
                  </View>
                </View>
              )}

              <View className="max-h-60 overflow-y-auto">
                {/* Loading State */}
                {isLoading && (
                  <View className="px-4 py-8 text-slate-500 dark:text-slate-400 text-center">
                    <Text as="p" className="font-medium">{loadingText}</Text>
                  </View>
                )}

                {/* Add Custom Value Option */}
                {!isLoading && canAddCustomValue && (
                  <View
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddCustomValue();
                    }}
                    className="px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer border-b border-slate-100 dark:border-slate-800 transition-colors duration-150"
                    role="option"
                    aria-selected={false}
                  >
                    <View className="flex items-center gap-3">
                      <Text as="span" className="text-green-700 dark:text-green-300 font-medium">
                        Add "{searchTerm.trim()}"
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* Options */}
                {!isLoading && filteredOptions.map((option : any) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isDisabled = option.disabled || (maxSelected && !isSelected && selectedValues.length >= maxSelected) || false;
                  
                  return (
                    <View
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) {
                          handleSelectOption(option.value);
                        }
                      }}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-150
                        ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-50  dark:hover:bg-card'}
                        ${isSelected ? 'bg-primary-50 dark:bg-card' : ''}
                      `}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled}
                    >
                      <View className={`w-5 h-5 rounded border transition-all duration-150 flex items-center justify-center
                        ${isSelected 
                          ? 'border-primary-500 bg-primary-500 shadow-sm' 
                          : 'border-slate-300 dark:border-border bg-card dark:bg-transparent'
                        }
                        ${isDisabled ? 'opacity-50' : ''}
                      `}>
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                      </View>
                      <Text as="span" className={`font-medium transition-colors duration-150 ${
                        isSelected 
                          ? 'text-primary-700 dark:text-primary-300' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {option.label}
                      </Text>
                    </View>
                  );
                })}
                
                {/* No options found */}
                {!isLoading && filteredOptions.length === 0 && !canAddCustomValue && (
                  <View className="px-4 py-8 text-slate-500 dark:text-slate-400 text-center">
                    <Text as="p" className="font-medium">{noOptionsText}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {error && (
          <View className="flex items-center gap-2 mt-2" id={`${id || name}-error`}>
            <Text as="p" className="text-red-500 text-sm">{error}</Text>
          </View>
        )}
      </View>

      {/* Hidden input for form submission - comma separated values */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedValues.join(',')}
        form={form}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        tabIndex={tabIndex}
        title={title}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
      />
    </View>
  );
};

export default MultiSelector;