import React, { useState, useRef, useEffect } from "react";
import {
  MultiSelectProps,
  VariantProps,
  SizeClassesProps,
} from "@/interfaces/components/input/multiselector";
import View from "./view";
import Text from "./text";
import Input from "./input";

// Extended interface to include new props
interface EnhancedMultiSelectProps extends MultiSelectProps {
  multiSelect?: boolean; // true for multi-select, false for single select
  allowCustomValues?: boolean; // Allow adding custom values
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

const MultiSelector: React.FC<EnhancedMultiSelectProps> = ({
  // id,
  name,
  label,
  style,
  value,
  error,
  onBlur,
  onChange,
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
  displayCount = 2,
  showSelectAll = false,
  closeOnSelect = false,
  multiSelect = true, // New prop: true for multi-select, false for single select
  allowCustomValues = false, // New prop: allow custom values
}) => {    
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<any[]>(() => {
    if (value !== undefined) {
      return multiSelect ? (Array.isArray(value) ? value : [value]) : (Array.isArray(value) ? value : [value]);
    }
    return Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : []);
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [customOptions, setCustomOptions] = useState<Array<{value: any, label: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Combine original options with custom options
  const allOptions = [...options, ...customOptions];  

  // Update selectedValues when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const newValue = multiSelect ? (Array.isArray(value) ? value : [value]) : (Array.isArray(value) ? value : [value]);
      setSelectedValues(newValue);
    }
  }, [value, multiSelect]);

  // Fix defaultValue initialization
//   useEffect(() => {
//     if (value === undefined && (Array.isArray(defaultValue) ? defaultValue.length > 0 : defaultValue)) {
//       const initialValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
//       const processedValue = multiSelect ? initialValue : initialValue.slice(0, 1);
//       setSelectedValues(processedValue);
//       onChange?.(multiSelect ? processedValue : processedValue[0]);
//     }
//   }, [defaultValue, value, onChange, multiSelect]);
const initializedRef = useRef(false);

useEffect(() => {
  if (
    !initializedRef.current &&
    value === undefined &&
    (Array.isArray(defaultValue) ? defaultValue.length > 0 : defaultValue)
  ) {
    const initialValue = Array.isArray(defaultValue)
      ? defaultValue
      : [defaultValue];
    const processedValue = multiSelect ? initialValue : initialValue.slice(0, 1);
    setSelectedValues(processedValue);
    onChange?.(multiSelect ? processedValue : processedValue[0]);
    initializedRef.current = true; // ✅ prevent future triggers
  }
}, [defaultValue, value, onChange, multiSelect]);

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

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

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
    
    if (multiSelect) {
      // Multi-select logic
      if (selectedValues.includes(optionValue)) {
        newSelectedValues = selectedValues.filter(val => val !== optionValue);
      } else {
        if (maxSelections && selectedValues.length >= maxSelections) {
          return;
        }
        newSelectedValues = [...selectedValues, optionValue];
      }
    } else {
      // Single select logic
      newSelectedValues = [optionValue];
    }

    setSelectedValues(newSelectedValues);
    onChange?.(multiSelect ? newSelectedValues : newSelectedValues[0]);

    if (closeOnSelect || !multiSelect) {
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
    let newSelectedValues: any[];
    if (multiSelect) {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      newSelectedValues = [...selectedValues, customValue];
    } else {
      newSelectedValues = [customValue];
    }
    
    setSelectedValues(newSelectedValues);
    onChange?.(multiSelect ? newSelectedValues : newSelectedValues[0]);
    setSearchTerm("");
    
    if (!multiSelect) {
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (disabled || !multiSelect) return;

    const allFilteredValues = filteredOptions
      .filter(option => !option.disabled)
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

//   const handleRemoveTag = (valueToRemove: any, event: React.MouseEvent) => {
//     event.stopPropagation();
//     if (disabled) return;

//     const newSelectedValues = selectedValues.filter(val => val !== valueToRemove);
//     setSelectedValues(newSelectedValues);
//     onChange?.(multiSelect ? newSelectedValues : (newSelectedValues[0] || null));
//   };

const handleRemoveTag = (valueToRemove: any, event: React.MouseEvent) => {
  event.stopPropagation();
  if (disabled) return;

  const newSelectedValues = selectedValues.filter(val => val !== valueToRemove);
  setSelectedValues(newSelectedValues);
  onChange?.(multiSelect ? newSelectedValues : newSelectedValues[0] || null);

  // 🔥 Remove from customOptions if it was custom-added and now deselected
  const isCustom = !options.some(opt => opt.value === valueToRemove);
  if (isCustom) {
    setCustomOptions(prev => prev.filter(opt => opt.value !== valueToRemove));
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && canAddCustomValue) {
      event.preventDefault();
      handleAddCustomValue();
    }
  };

  const getDisplayCount = () => {
    if (!multiSelect) return selectedValues.length;
    if (selectedValues.length <= displayCount) return selectedValues.length;
    return displayCount;
  };

  const getRemainingCount = () => {
    return selectedValues.length - displayCount;
  };

  const getSelectedLabel = () => {
    if (selectedValues.length === 0) return null;
    const option = allOptions.find(opt => opt.value === selectedValues[0]);
    return option?.label || selectedValues[0];
  };  

  return (
    <View>
      {/* {label && (
        <label htmlFor={id || name} className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )} */}
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-red-600 ">*</span>}
        </label>
      )}

      <View className={`relative ${fullWidth ? "w-full" : ""}`} ref={dropdownRef}>
        {leftIcon && (
          <View className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400 z-10">
            {leftIcon}
          </View>
        )}
        
        <View
          onClick={toggleDropdown}
          onBlur={handleBlur}
          tabIndex={0}
          className={`w-full rounded-md transition-all duration-200 cursor-pointer backdrop-blur-sm
            ${variantClasses[variant]} 
            ${sizeClasses[selectSize]} 
            ${leftIcon ? 'pl-12' : ''} 
            ${rightIcon ? 'pr-12' : 'pr-12'} 
            ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md focus:shadow-lg'}
            ${isOpen ? 'ring-1 ring-primary-500 shadow-md' : 'focus:outline-none focus:ring-1 focus:ring-primary-500'}
            ${error ? 'ring-1 ring-red-500/20' : ''}
            ${className || ""}`}
          style={style}
        >
          <View className="flex flex-wrap items-center gap-1.5 min-h-[1.5rem]">
            {selectedValues.length === 0 ? (
              <Text as="span" className="text-slate-400 dark:text-slate-500 font-medium">
                {placeholder || (multiSelect ? "Choose options..." : "Choose an option...")}
              </Text>
            ) : (
              <>
                {multiSelect ? (
                  // Multi-select display with tags
                  <>
                    {selectedValues.slice(0, getDisplayCount()).map((val) => {
                      const option = allOptions.find(opt => opt.value === val);
                      const label = option?.label || val;
                      
                      return (
                        <Text as="span"
                          key={val}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 group"
                        >
                          <Text as="span" className="truncate max-w-[120px]">{label}</Text>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveTag(val, e)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors duration-150 group-hover:bg-white/10"
                            disabled={disabled}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </Text>
                      );
                    })}
                    {selectedValues.length > displayCount && (
                      <Text as="span" className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg">
                        +{getRemainingCount()} more
                      </Text>
                    )}
                  </>
                ) : (
                  // Single select display - looks like a regular select
                  <Text as="span" className="font-medium truncate">
                  {/* <Text as="span" className="text-slate-700 dark:text-slate-300 font-medium truncate"> */}
                    {getSelectedLabel()}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>

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

        {/* Modern Dropdown */}
        {isOpen && (
          <View className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-background backdrop-blur-lg border border-slate-200/50 dark:border-border rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden">
          {/* <View className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden"> */}
            {/* Search Bar */}
            <View className="p-4 border-b border-border dark:border-border">
              <View className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" fill="none" stroke="currentColor"  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <Input
                  name={name}
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={allowCustomValues ? "Search or type to add..." : "Search options..."}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-card border border-slate-200 dark:border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-200"
                />
              </View>
            </View>

            <View className="max-h-60 overflow-y-auto">
              {/* Add Custom Value Option */}
              {canAddCustomValue && (
                <View
                  onClick={handleAddCustomValue}
                  className="px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer border-b border-slate-100 dark:border-slate-800 transition-colors duration-150"
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

              {/* Select All - only show in multi-select mode */}
              {multiSelect && showSelectAll && filteredOptions.length > 0 && (
                <View
                  onClick={handleSelectAll}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-card cursor-pointer border-b border-slate-100 dark:border-border font-semibold text-primary-600 dark:text-primary-400 transition-colors duration-150"
                >
                  <View className="flex items-center gap-3 text-primary">
                    <View className="w-5 h-5 rounded border-2 border-primary-500 bg-primary-50 dark:bg-transparent flex items-center justify-center">
                      {filteredOptions.every(opt => !opt.disabled && selectedValues.includes(opt.value)) ? (
                        <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        null
                      )}
                    </View>
                    {filteredOptions.every(opt => !opt.disabled && selectedValues.includes(opt.value)) ? 'Deselect All' : 'Select All'}
                  </View>
                </View>
              )}
              
              {/* Options */}
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const isDisabled = option.disabled || (multiSelect && maxSelections && selectedValues.length >= maxSelections && !isSelected);
                
                return (
                  <View
                    key={option.value}
                    onClick={() => !isDisabled && handleToggleOption(option.value)}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-150 
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-card'}
                      ${isSelected ? 'bg-primary-50 dark:bg-card border-r-2 border-primary-500' : ''}
                    `}
                  >
                    <View className={`w-5 h-5 ${multiSelect ? 'rounded' : 'rounded-full'} border-2 transition-all duration-150 flex items-center justify-center
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
              
              {filteredOptions.length === 0 && !canAddCustomValue && (
                <View className="px-4 py-8 text-slate-500 dark:text-slate-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.266 0-4.319-.904-5.824-2.377M15 17.24l-6-6M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Text as="p" weight="font-medium">No options found</Text>
                  <Text as="p" className="text-sm mt-1">Try adjusting your search</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {error && (
          <View className="flex items-center gap-2 mt-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <Text as="p" className="text-red-500 text-sm font-medium">{error}</Text>
          </View>
        )}
      </View>
      <input
  type="hidden"
  name={name}
  value={selectedValues.join(",")} // or JSON.stringify(selectedValues) if backend supports
/>

    </View>
  );
};

export default MultiSelector;