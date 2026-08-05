import React, { useState, useRef, useEffect } from "react";
import View from "./view";
import Text from "./text";
import Input from "./input";

// Interface for multi selector props
interface MultiSelectorProps {
  id?: string;
  name?: string;
  label?: string;
  style?: React.CSSProperties;
  value?: any[] | undefined | null;
  error?: string;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (values: any[]) => void;
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
  maxSelections?: number;
  showSelectAll?: boolean;
  closeOnSelect?: boolean;
  allowCustomValues?: boolean;
  searchable?: boolean;
  autoComplete?: string;
  form?: string;
  multiple?: true; // Always true for multi selector
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
  selectAllText?: string;
  deselectAllText?: string;
  separator?: string; // For hidden input value separator
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
  small: "min-h-9 text-xs px-3 py-2",
  medium: "min-h-11 text-sm px-4 py-2.5",
  large: "min-h-13 text-base px-5 py-3",
  default: "min-h-11 text-sm px-4 py-2.5",
};

const variantClasses: VariantProps = {
  error: "border border-red-400 bg-white dark:bg-slate-900 shadow-sm shadow-red-100",
  default: "border border-slate-200 bg-white dark:bg-background dark:border-border shadow-sm hover:border-slate-300 dark:hover:border-border",
  outlined: "border-2 border-blue-400 bg-white dark:bg-slate-900 shadow-sm shadow-blue-50",
  filled: "border border-primary-200 bg-primary-50 dark:bg-primary-800 dark:border-primary-700",
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
  defaultValue = [],
  disabled = false,
  fullWidth = false,
  variant = "default",
  selectSize = "medium",
  required = false,
  maxSelections,
  showSelectAll = false,
  closeOnSelect = false,
  allowCustomValues = false,
  searchable = true,
  autoComplete,
  form,
  // size,
  tabIndex,
  title,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  clearable = false,
  noOptionsText = "No options found",
  loadingText = "Loading...",
  isLoading = false,
  selectAllText = "Select All",
  deselectAllText = "Deselect All",
  separator = ",",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<any[]>(() => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value];
    }
    return Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : []);
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [customOptions, setCustomOptions] = useState<Array<{value: any, label: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Combine original options with custom options
  const allOptions = [...options, ...customOptions];

  // Update selectedValues when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const newValue = Array.isArray(value) ? value : [value];
      setSelectedValues(newValue);
    }
  }, [value]);

  // Handle defaultValue initialization
  useEffect(() => {
    if (
      !initializedRef.current &&
      value === undefined &&
      (Array.isArray(defaultValue) ? defaultValue.length > 0 : defaultValue)
    ) {
      const initialValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      setSelectedValues(initialValue);
      onChange?.(initialValue);
      initializedRef.current = true;
    }
  }, [defaultValue, value, onChange]);

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

  const handleToggleOption = (optionValue: any) => {
    if (disabled) return;

    let newSelectedValues: any[];
    
    if (selectedValues.includes(optionValue)) {
      newSelectedValues = selectedValues.filter(val => val !== optionValue);
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      newSelectedValues = [...selectedValues, optionValue];
    }

    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);

    if (closeOnSelect) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleAddCustomValue = () => {
    if (!allowCustomValues || !searchTerm.trim()) return;

    const customValue = searchTerm.trim();
    const newCustomOption = { value: customValue, label: customValue };
    
    // Add to custom options
    setCustomOptions(prev => [...prev, newCustomOption]);
    
    // Add to selected values
    if (maxSelections && selectedValues.length >= maxSelections) {
      return;
    }
    
    const newSelectedValues = [...selectedValues, customValue];
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
    setSearchTerm("");
    
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;

    const allFilteredValues = filteredOptions
      .filter((option : any) => !option.disabled)
      .map(option => option.value);
    
    const allSelected = allFilteredValues.every(val => selectedValues.includes(val));
    
    let newSelectedValues: any[];
    if (allSelected) {
      newSelectedValues = selectedValues.filter(val => !allFilteredValues.includes(val));
    } else {
      const uniqueNewValues = allFilteredValues.filter(val => !selectedValues.includes(val));
      if (maxSelections) {
        const availableSlots = maxSelections - selectedValues.length;
        newSelectedValues = [...selectedValues, ...uniqueNewValues.slice(0, availableSlots)];
      } else {
        newSelectedValues = [...selectedValues, ...uniqueNewValues];
      }
    }
    
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  const handleRemoveTag = (valueToRemove: any, event: React.MouseEvent) => {
    event.stopPropagation();
    if (disabled) return;

    const newSelectedValues = selectedValues.filter(val => val !== valueToRemove);
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);

    // Remove from customOptions if it was custom-added and now deselected
    const isCustom = !options.some(opt => opt.value === valueToRemove);
    if (isCustom) {
      setCustomOptions(prev => prev.filter(opt => opt.value !== valueToRemove));
    }
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (disabled) return;

    setSelectedValues([]);
    onChange?.([]);
    
    // Clear all custom options
    setCustomOptions([]);
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
        setSearchTerm("");
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
      case 'Backspace':
        // Remove last selected item when backspace is pressed and no search term
        if (!isOpen && selectedValues.length > 0) {
          event.preventDefault();
          const lastValue = selectedValues[selectedValues.length - 1];
          handleRemoveTag(lastValue, event as any);
        }
        break;
      case 'Delete':
        // Clear all selections
        if (!isOpen && event.ctrlKey && selectedValues.length > 0) {
          event.preventDefault();
          handleClearAll(event as any);
        }
        break;
    }
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) {
      return placeholder || "Choose options...";
    }
    return `${selectedValues.length} option${selectedValues.length > 1 ? 's' : ''} selected`;
  };

  const hasValues = selectedValues.length > 0;

  return (
    <View>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <View className={`relative ${fullWidth ? "w-full" : ""}`} ref={dropdownRef}>
        {leftIcon && (
          <View className={`absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200 ${
            error ? 'text-red-400' : 'text-slate-400'
          }`}>
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
          aria-multiselectable={true}
          title={title}
          className={`w-full rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm
            ${variantClasses[variant]} 
            ${sizeClasses[selectSize]} 
            ${leftIcon ? 'pl-12' : ''} 
            ${rightIcon || clearable ? 'pr-12' : 'pr-12'} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md focus:shadow-lg'}
            ${isOpen ? 'ring-1 ring-primary-500 shadow-md' : 'focus:outline-none focus:ring-1 focus:ring-primary-500'}
            ${error ? 'ring-1 ring-red-500/20' : ''}
            ${className || ""}`}
          style={style}
        >
          <View className="flex items-center justify-between">
            <Text as="span" className={`font-medium ${
              selectedValues.length === 0 
                ? 'text-slate-400 dark:text-slate-500' 
                : 'text-slate-700 dark:text-slate-300'
            }`}>
              {getDisplayValue()}
            </Text>
          </View>
        </View>

        {/* Clear All button */}
        {clearable && hasValues && !disabled && (
          <View className="absolute right-10 top-1/2 transform -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={handleClearAll}
              className={`p-1 rounded-full transition-colors duration-150 ${
                error
                  ? 'hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              aria-label="Clear all selections"
            >
              <svg className={`w-4 h-4 transition-colors duration-150 ${
                error
                  ? 'text-red-400 hover:text-red-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </View>
        )}

        {/* Dropdown arrow */}
        {rightIcon ? (
          <View className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors duration-200 ${
            error ? 'text-red-400' : 'text-slate-400'
          }`}>
            {rightIcon}
          </View>
        ) : (
          <View className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${
            error ? 'text-red-400' : 'text-slate-400'
          }`}>
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

        {/* Dropdown Menu */}
        {isOpen && (
          <View 
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-background backdrop-blur-lg border border-slate-200/50 dark:border-border rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden"
            role="listbox"
            aria-label="Options"
            aria-multiselectable={true}
          >
            {/* Search Bar */}
            {searchable && (
              <View className="p-4 border-b border-border dark:border-border">
                <View className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  <Input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={allowCustomValues ? "Search or type to add..." : "Search options..."}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200"
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
                    <View className="w-5 h-5 rounded border-2 border-green-500 bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
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

              {/* Select All */}
              {!isLoading && showSelectAll && filteredOptions.length > 0 && (
                <View
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAll();
                  }}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-card cursor-pointer border-b border-slate-100 dark:border-border font-semibold text-primary-600 dark:text-primary-400 transition-colors duration-150"
                  role="option"
                  aria-selected={false}
                >
                  <View className="flex items-center gap-3 text-primary">
                    <View className="w-5 h-5 rounded border-2 border-primary-500 bg-primary-50 dark:bg-transparent flex items-center justify-center">
                      {filteredOptions.every(opt => !(opt as any).disabled && selectedValues.includes(opt.value)) ? (
                        <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : null}
                    </View>
                    {filteredOptions.every(opt => !(opt as any).disabled && selectedValues.includes(opt.value)) ? deselectAllText : selectAllText}
                  </View>
                </View>
              )}
              
              {/* Options */}
              {!isLoading && filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const isDisabled = (option as any).disabled || (maxSelections && selectedValues.length >= maxSelections && !isSelected);
                
                return (
                  <View
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        handleToggleOption(option.value);
                      }
                    }}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-150
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-card'}
                      ${isSelected ? 'bg-primary-50 dark:bg-card border-r-2 border-primary-500' : ''}
                    `}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                  >
                    <View className={`w-5 h-5 rounded border-2 transition-all duration-150 flex items-center justify-center
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-500 shadow-sm' 
                        : 'border-slate-300 dark:border-border bg-white dark:bg-transparent'
                      }
                      ${isDisabled ? 'opacity-50' : ''}
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
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

        {/* Error Message */}
        {error && (
          <View className="flex items-center gap-2 mt-2" id={`${id || name}-error`}>
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <Text as="p" className="text-red-500 text-sm font-medium">{error}</Text>
          </View>
        )}
      </View>

      {/* Selected Options Display - Below the selector */}
      {selectedValues.length > 0 && (
        <View className="mt-3">
          <View className="flex items-center justify-between mb-2">
            <Text as="p" className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Selected Options ({selectedValues.length}{maxSelections ? `/${maxSelections}` : ''}):
            </Text>
            {clearable && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors duration-150"
              >
                Clear All
              </button>
            )}
          </View>

          {/* Tags Display */}
          <View className="flex flex-wrap gap-2">
            {selectedValues.map((val) => {
              const option = allOptions.find(opt => opt.value === val);
              const label = option?.label || val;

              return (
                <View
                  key={val}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-150"
                >
                  <Text as="span" className="truncate max-w-32">
                    {label}
                  </Text>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveTag(val, e)}
                      className="flex-shrink-0 p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full transition-colors duration-150 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                      aria-label={`Remove ${label}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </View>
              );
            })}
          </View>

          {/* Max selections warning */}
          {maxSelections && selectedValues.length >= maxSelections && (
            <Text as="p" className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Maximum selections reached ({maxSelections})
            </Text>
          )}
        </View>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedValues.join(separator)}
        form={form}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
      />
    </View>
  );
};

export default MultiSelector;