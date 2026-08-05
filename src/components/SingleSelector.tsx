import React, { useState, useRef, useEffect } from "react";
import View from "./view";
import Text from "./text";
import Input from "./input";

// Interface for single selector props
interface SingleSelectorProps {
  id?: string;
  name?: string;
  label?: string;
  style?: React.CSSProperties;
  value?: any;
  error?: string;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (value: any) => void;
  onFocus?: (event: React.FocusEvent) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  options?: Array<{
    value: any;
    label: string;
    disabled?: boolean;
    selected?: boolean; // NEW: Add selected attribute
  }>;
  defaultValue?: any;
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
  multiple?: false;
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
  default: string;
}

const sizeClasses: SizeClassesProps = {
  small: "min-h-9 text-sm px-3 py-1.5 rounded-md",
  medium: "min-h-11 text-sm px-4 py-2.5 rounded-lg",
  large: "min-h-13 text-base px-5 py-3 rounded-xl",
  default: "min-h-11 text-sm px-4 py-2.5 rounded-lg",
};

const variantClasses: VariantProps = {
  // error: "border-1 border-red-500 bg-white dark:bg-background shadow-sm",
  error: " bg-white dark:bg-background",
  default: "border border-gray-200 bg-white dark:bg-background hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 transition-colors duration-200",
  outlined: "border-2 border-blue-500 bg-transparent shadow-sm",
  filled: "border border-blue-100 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800/50",
};

const SingleSelector: React.FC<SingleSelectorProps> = ({
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
  closeOnSelect = true,
  allowCustomValues = false,
  searchable = true,
  autoComplete,
  form,
  tabIndex,
  title,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  clearable = false,
  noOptionsText = "No options found",
  loadingText = "Loading...",
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // NEW: Find selected option from options array
  const findSelectedOption = () => {
    return options.find(option => option.selected === true);
  };

  const [selectedValue, setSelectedValue] = useState<any>(() => {
    if (value !== undefined) {
      return value;
    }
    // NEW: Check for selected option first, then defaultValue
    const selectedOption = findSelectedOption();
    if (selectedOption) {
      return selectedOption.value;
    }
    return defaultValue || null;
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [customOptions, setCustomOptions] = useState<Array<{value: any, label: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Combine original options with custom options
  const allOptions = [...options, ...customOptions];

  // Update selectedValue when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // NEW: Handle selected option and defaultValue initialization
  useEffect(() => {
    if (!initializedRef.current && value === undefined) {
      const selectedOption = findSelectedOption();
      let initialValue = null;
      
      if (selectedOption) {
        initialValue = selectedOption.value;
      } else if (defaultValue !== undefined) {
        initialValue = defaultValue;
      }
      
      if (initialValue !== null) {
        setSelectedValue(initialValue);
        onChange?.(initialValue);
      }
      
      initializedRef.current = true;
    }
  }, [defaultValue, value, onChange, options]);

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

    setSelectedValue(optionValue);
    onChange?.(optionValue);

    if (closeOnSelect) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleAddCustomValue = () => {
    if (!allowCustomValues || !searchTerm.trim()) return;

    const customValue = searchTerm.trim();
    const newCustomOption = { value: customValue, label: customValue };
    
    setCustomOptions(prev => [...prev, newCustomOption]);
    setSelectedValue(customValue);
    onChange?.(customValue);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (disabled) return;

    setSelectedValue(null);
    onChange?.(null);
    
    const isCustom = !options.some(opt => opt.value === selectedValue);
    if (isCustom) {
      setCustomOptions(prev => prev.filter(opt => opt.value !== selectedValue));
    }
  };

  const toggleDropdown = () => {
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
        event.preventDefault();
        setIsOpen(!isOpen);
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

  const getSelectedLabel = () => {
    if (selectedValue === null || selectedValue === undefined) return null;
    const option = allOptions.find(opt => opt.value === selectedValue);
    return option?.label || selectedValue;
  };

  const getDisplayValue = () => {
    const label = getSelectedLabel();
    return label || placeholder || "Select an option...";
  };

  const hasValue = selectedValue ? true : false;
  // const hasValue = selectedValue !== null && selectedValue !== undefined;  
  return (
    <View className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-red-600 ">*</span>}
        </label>
      )}

      <View className={`mt-2 relative ${fullWidth ? "w-full" : ""}`}>
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
            className={`w-full rounded-lg transition-all duration-200 cursor-pointer backdrop-blur-sm flex items-center 
              ${variantClasses[error ? 'error' : variant]} 
              ${sizeClasses[selectSize]} 
              ${leftIcon ? 'pl-12' : ''} 
              ${rightIcon || clearable ? 'pr-12' : 'pr-12'} 
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md focus:shadow-lg'}
              ${isOpen ? 'ring-1 ring-primary-500 shadow-md' : 'focus:outline-none focus:ring-1 focus:ring-primary-500'}
              ${error ? 'border border-border' : ''}
              ${className || ""}`}
            style={style}
          >
            {/* // ${error ? 'ring-1 ring-red-500/20' : ''} */}
            <Text as="span" className={`truncate text-sm flex-1 ${
              !hasValue  ? 'text-muted-foreground' : null
            }`}>
              {getDisplayValue()}
            </Text>
            {rightIcon ? (
            <View className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
              {rightIcon}
            </View>
          ) : (
            <View className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
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
                <svg className="w-4 h-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </View>
          )}

          {/* Dropdown arrow - FIXED: Positioned absolutely relative to the trigger */}
          {/* {rightIcon ? (
            <View className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
              {rightIcon}
            </View>
          ) : (
            <View className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </View>
          )} */}

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
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-muted-foreground w-4 h-4 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    
                    <Input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={allowCustomValues ? "Search or type to add..." : "Search options..."}
                      className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground placeholder-slate-400 dark:placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200"
                      aria-label="Search options"
                    />
                  </View>
                </View>
              )}

              <View className="max-h-60 overflow-y-auto">
                {/* Loading State */}
                {isLoading && (
                  <View className="px-4 py-8 text-slate-500 dark:text-slate-400 text-center">
                    <svg className="animate-spin w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
                      <View className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </View>
                      <Text as="span" className="text-green-700 dark:text-green-300 font-medium">
                        Add "{searchTerm.trim()}"
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* Options */}
                {!isLoading && filteredOptions.map((option : any) => {
                  const isSelected = selectedValue === option.value;
                  const isDisabled = option.disabled || false;
                  
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
                        ${isSelected ? 'bg-primary-50 dark:bg-card border-r-2 border-primary-500' : ''}
                      `}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled}
                    >
                      <View className={`w-5 h-5 rounded-full border-2 transition-all duration-150 flex items-center justify-center
                        ${isSelected 
                          ? 'border-primary-500 bg-primary-500 shadow-sm' 
                          : 'border-slate-300 dark:border-border bg-card dark:bg-transparent'
                        }
                        ${isDisabled ? 'opacity-50' : ''}
                      `}>
                        {isSelected && (
                          <View className="w-2 h-2 rounded-full bg-white"></View>
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
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.266 0-4.319-.904-5.824-2.377M15 17.24l-6-6M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Text as="p" className="font-medium">{noOptionsText}</Text>
                    <Text as="p" className="text-sm mt-1">Try adjusting your search</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* FIXED: Error Message positioned with proper spacing */}
        {error && (
          // <View className="mt-1" id={`${id || name}-error`}>
          //   <Text as="p" className="text-red-500 text-sm">{error}</Text>
          // </View>
          <View className="flex items-center gap-2 mt-2" id={`${id || name}-error`}>
            {/* <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg> */}
            <Text as="p" className="text-red-500 text-sm">{error}</Text>
          </View>
        )}
      </View>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedValue || ""}
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

export default SingleSelector;