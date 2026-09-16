import React, { useState, useEffect, useRef } from "react";
import Button from "./button";
import { X } from "lucide-react";
import View from "./view";
import Input from "./input";

type Option = {
  id: string;
  label: string;
  value: string;
  type?: "countries" | "states" | "cities";
};

type SearchSelectProps = {
  name: string;
  label?: string;
  selected?: string;
  options: Option[];
  className?: string;
  placeholder?: string;
  onSelect: (value: Option) => void;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
};

const SearchSelect: React.FC<SearchSelectProps> = ({
  name,
  label,
  options,
  selected,
  onSelect,
  className = "",
  placeholder = "Search...",
  error,
  required = false,
  // showLabel = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [isSearchedStatus, setIsSearchedStatus] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  useEffect(() => {
    const results = options?.filter((option) =>
      option?.value
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase())
    );
    setHighlightIndex(0);
    setFilteredOptions(results);
  }, [searchTerm, options]);

  const handleSelect = (option: Option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm(option?.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      handleSelect(filteredOptions[highlightIndex]);
    }
  };

  return (
    <View>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && <span className="text-red-600 ">*</span>}
        </label>
      )}

      <View className={`relative w-full ${className}`}>
        <React.Fragment>
          {!isSearchedStatus && selected ? (
            <View className="flex items-center gap-2">
              <Input
                readOnly
                type="text"
                name={name}
                value={selected}
                autoComplete="off"
                className="w-full px-4 py-2.5 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-baclground"
              />
              <Button
                onPress={() => {
                  setIsSearchedStatus(true);
                }}
              >
                <X size={20} />
              </Button>
            </View>
          ) : (
            <React.Fragment>
              <Input
                type="text"
                name={name}
                ref={inputRef}
                value={searchTerm}
                autoComplete="off"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsOpen(false), 150);
                }}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                className="w-full px-4 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-background"
              />
              {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 h-32 overflow-y-auto bg-white dark:bg-card border border-border rounded-md shadow-dropdown">
                  {filteredOptions.map((option, index) => (
                    <li
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className={`px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary ${
                        index === highlightIndex
                          ? "bg-primary-100 dark:bg-primary"
                          : ""
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
              {isOpen && filteredOptions.length === 0 && (
                <View className="absolute z-10 w-full mt-1 px-4 py-2 bg-white dark:bg-background border border-neutral-300 rounded-md shadow-dropdown text-text-lighter">
                  No options found.
                </View>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </View>
    </View>
  );
};

export default SearchSelect;
