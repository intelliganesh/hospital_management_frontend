import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Check, Plus, RotateCcw } from "lucide-react";
import View from "./view";
import Text from "./text";
import Input from "./input";
import Button from "./button";
import SearchBar from "./ui/search-bar";

// Updated interface with proper structure
export interface TransferListItem {
  id?: string | number;
  label?: string; // Display name
  value?: string | number; // Form value
  description?: string; // Optional description
  icon?: React.ReactNode; // Optional icon
  disabled?: boolean;
  isCustom?: boolean;
  [key: string]: any;
}

interface TransferListProps {
  sourceData?: TransferListItem[];
  selectedItems?: TransferListItem[];
  onSelectionChange?: (items: TransferListItem[]) => void;
  placeholder?: string;
  sourceTitle?: string;
  selectedTitle?: string;
  height?: string;
  searchable?: boolean;
  searchableSelectedItems?: boolean;
  disabled?: boolean;
  showCount?: boolean;
  allowSelectAll?: boolean;
  allowSelectAllSelectedItems?: boolean;
  allowCustomValues?: boolean;
  customValuePlaceholder?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  required?: boolean;
  error?: string;
  maxSelections?: number;
  onAllowCustomValues?: () => void;
  variant?: "default" | "compact" | "detailed";
  name?: string; // Added name prop for form submission
  onCustomValueAdd?: (
    label: string,
    value: string,
    description?: string
  ) => TransferListItem;
}

const TransferList: React.FC<TransferListProps> = ({
  sourceData = [],
  selectedItems = [],
  onSelectionChange = () => {},
  placeholder = "Search items...",
  sourceTitle = "Available Items",
  selectedTitle = "Selected Items",
  height = "300px",
  searchable = true,
  searchableSelectedItems = false,
  disabled = false,
  showCount = true,
  allowSelectAll = false,
  allowSelectAllSelectedItems = false,
  allowCustomValues = false,
  onAllowCustomValues,
  customValuePlaceholder = "Add custom item...",
  className = "",
  label,
  labelClassName,
  required = false,
  error,
  maxSelections,
  variant = "default",
  name, // Added name prop
  onCustomValueAdd,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(
    new Set(selectedItems.map((item) => item.id))
  );
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [activeList, setActiveList] = useState<"source" | "selected">("source");
  const [customLabel, setCustomLabel] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const sourceListRef = useRef<HTMLDivElement>(null);
  const selectedListRef = useRef<HTMLDivElement>(null);
  const customLabelInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search term
  const filteredSourceData = sourceData.filter((item) => {
    if (selectedIds.has(item.id)) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      item.label?.toLowerCase().includes(searchLower) ||
      item.value?.toString().toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  const filteredSelectedData = selectedItems.filter((item) => {
    const searchLower = selectedSearchTerm.toLowerCase();
    return (
      item.label?.toLowerCase().includes(searchLower) ||
      item.value?.toString().toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  // Update selected items when prop changes
  useEffect(() => {
    setSelectedIds(new Set(selectedItems.map((item) => item.id)));
  }, [selectedItems]);

  // Auto-focus custom input when shown
  useEffect(() => {
    if (showCustomInput && customLabelInputRef.current) {
      customLabelInputRef.current.focus();
    }
  }, [showCustomInput]);

  // Handle item selection
  const handleItemSelect = useCallback(
    (item: TransferListItem) => {
      if (disabled || item.disabled) return;

      const newSelectedIds = new Set(selectedIds);
      const newSelectedItems = [...selectedItems];

      if (selectedIds.has(item.id)) {
        newSelectedIds.delete(item.id);
        const index = newSelectedItems.findIndex(
          (selected) => selected.id === item.id
        );
        if (index > -1) {
          newSelectedItems.splice(index, 1);
        }
      } else {
        // Check max selections limit
        if (maxSelections && newSelectedItems.length >= maxSelections) {
          return;
        }
        newSelectedIds.add(item.id);
        newSelectedItems.push(item);
      }

      setSelectedIds(newSelectedIds);
      onSelectionChange(newSelectedItems);
    },
    [selectedIds, selectedItems, onSelectionChange, disabled, maxSelections]
  );

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (disabled) return;

    const newSelectedItems = [...selectedItems];
    const newSelectedIds = new Set(selectedIds);

    filteredSourceData.forEach((item) => {
      if (!selectedIds.has(item.id) && !item.disabled) {
        // Check max selections limit
        if (maxSelections && newSelectedItems.length >= maxSelections) {
          return;
        }
        newSelectedIds.add(item.id);
        newSelectedItems.push(item);
      }
    });

    setSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedItems);
  }, [
    filteredSourceData,
    selectedIds,
    selectedItems,
    onSelectionChange,
    disabled,
    maxSelections,
  ]);

  // Handle deselect all
  const handleDeselectAll = useCallback(() => {
    if (disabled) return;

    const newSelectedItems = [...selectedItems];
    const newSelectedIds = new Set(selectedIds);

    filteredSelectedData.forEach((item) => {
      if (selectedIds.has(item.id)) {
        newSelectedIds.delete(item.id);
        const index = newSelectedItems.findIndex(
          (selected) => selected.id === item.id
        );
        if (index > -1) {
          newSelectedItems.splice(index, 1);
        }
      }
    });

    setSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedItems);
  }, [
    filteredSelectedData,
    selectedIds,
    selectedItems,
    onSelectionChange,
    disabled,
  ]);

  // Handle custom value addition
  const handleAddCustomValue = useCallback(() => {
    if (!customLabel.trim() || !customValue.trim()) return;

    const newItem: TransferListItem = onCustomValueAdd
      ? onCustomValueAdd(customLabel, customValue, customDescription)
      : {
          id: `custom_${Date.now()}`,
          label: customLabel,
          value: customValue,
          description: customDescription || undefined,
          isCustom: true,
          icon: <Plus size={16} className="text-green-600" />,
        };

    const newSelectedItems = [...selectedItems, newItem];
    const newSelectedIds = new Set([...selectedIds, newItem.id]);

    setSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedItems);
    setCustomLabel("");
    setCustomValue("");
    setCustomDescription("");
    setShowCustomInput(false);
  }, [
    customLabel,
    customValue,
    customDescription,
    selectedItems,
    selectedIds,
    onSelectionChange,
    onCustomValueAdd,
  ]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, listType: "source" | "selected") => {
      const currentList =
        listType === "source" ? filteredSourceData : filteredSelectedData;
      const maxIndex = currentList.length - 1;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveList(listType);
          setFocusedIndex((prev) => Math.min(prev + 1, maxIndex));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveList(listType);
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < currentList.length) {
            handleItemSelect(currentList[focusedIndex]);
          }
          break;
        case "Escape":
          setFocusedIndex(-1);
          setShowCustomInput(false);
          break;
      }
    },
    [filteredSourceData, filteredSelectedData, focusedIndex, handleItemSelect]
  );

  // Get icon for item
  const getItemIcon = (item: TransferListItem) => {
    if (item.icon) return item.icon;

    const iconProps = { size: 16, className: "text-slate-500 shrink-0" };
    if (item.isCustom)
      return <Plus {...iconProps} className="text-green-600 shrink-0" />;
    return null;
    // return <Users {...iconProps} />;
  };

  // Render list item
  const renderListItem = (
    item: TransferListItem,
    index: number,
    isSelected: boolean,
    listType: "source" | "selected"
  ) => {
    const isActive = activeList === listType && focusedIndex === index;

    return (
      <View
        key={item.id}
        className={`
          group flex items-start gap-3 p-3 rounded-lg cursor-pointer overflow-hidden
          transition-all duration-200 ease-in-out
          ${
            isSelected
              ? "bg-card dark:bg-card border border-border dark:border-border"
              : "border border-transparent hover:bg-card dark:hover:bg-card"
          }
          ${isActive ? "" : ""}
          ${disabled || item.disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        // isActive = ring-2 ring-primary-500 ring-opacity-50
        onClick={() => !disabled && !item.disabled && handleItemSelect(item)}
        onMouseEnter={() => setFocusedIndex(index)}
        role="option"
        aria-selected={isSelected}
        tabIndex={isActive ? 0 : -1}
        title="Click to select"
      >
        {/* Checkbox */}
        <View
          className={`
          w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center shrink-0 mt-0.5
          ${
            isSelected
              ? "border-primary-500 bg-primary-500"
              : "border-slate-300 dark:border-border bg-white dark:bg-transparent"
          }
        `}
        >
          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
        </View>

        {/* Content */}
        <View className="flex-1 min-w-0 pr-2">
          {/* Main label */}
          <Text
            className={`font-medium text-sm leading-tight mb-1 break-words overflow-wrap-anywhere ${
              isSelected ? "text-primary-700 dark:text-primary" : ""
            }`}
            style={{
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              hyphens: "auto",
            }}
          >
            {item.label}
          </Text>

          {/* Value (if different from label) */}
          {/* {item.value && item.value !== item.label && (
            <Text className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-1 break-words">
              {item.value}
            </Text>
          )} */}

          {/* Description */}
          {item.description && (
            <Text
              className="text-xs text-muted-foreground dark:text-muted-foreground leading-tight break-words overflow-wrap-anywhere"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            >
              {item.description}
            </Text>
          )}

          {/* Custom badge */}
          {item.isCustom && (
            <View className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                Custom
              </span>
            </View>
          )}
        </View>

        {/* Icon */}
        <View className="flex items-center justify-center shrink-0 mt-0.5">
          {getItemIcon(item)}
        </View>
      </View>
    );
  };

  return (
    <View className={`w-full ${className}`} {...props}>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(
            selectedItems.map((item) => ({
              id: item.id,
              value: item.value,
              label: item.label,
            }))
          )}
        />
      )}

      {/* Label */}
      {/* {label && (
        <Text as="label" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      )} */}
      {label && (
        <label htmlFor={name} className={`font-bold text-lg ${labelClassName}`}>
          {label}
          {required && <span className="text-red-600 ">*</span>}
        </label>
      )}

      {/* Main Container */}
      <View className="flex flex-col lg:flex-row gap-4 mt-2">
        {/* Available Items */}
        <View className="flex-1 bg-white dark:bg-background border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <View className="p-4 border-b border-slate-200 dark:border-slate-700 bg-background dark:bg-background">
            <View className="flex items-center justify-between mb-3">
              <Text
                as="p"
                className=" text-slate-700 dark:text-slate-200"
              >
                {sourceTitle}
              </Text>
              {showCount && (
                <View className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary text-slate-600 dark:text-black text-xs rounded-full font-medium">
                    {filteredSourceData.length}
                  </span>
                  {maxSelections && (
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium border border-primary-200 dark:border-primary-700">
                      {selectedItems.length}/{maxSelections}
                    </span>
                  )}
                </View>
              )}
            </View>

            {/* Search */}
            {searchable && (
              <View className="mb-3">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="w-full bg-card "
                  variant="outlined"
                  parentType="div"
                />
              </View>
            )}

            {/* Select All */}
            {allowSelectAll && filteredSourceData.length > 0 && (
              <Button
                variant="ghost"
                size="small"
                onPress={handleSelectAll}
                disabled={disabled}
                className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <View
                  className={`w-4 h-4 rounded border-2 border-primary-500 flex items-center justify-center transition-colors ${
                    filteredSourceData.every(
                      (item) => selectedIds.has(item.id) || item.disabled
                    )
                      ? "bg-primary-500"
                      : "bg-white dark:bg-transparent"
                  }`}
                >
                  {filteredSourceData.every(
                    (item) => selectedIds.has(item.id) || item.disabled
                  ) && <Check className="w-2.5 h-2.5 text-white" />}
                </View>
                Select All
              </Button>
            )}
          </View>

          {/* Items List */}
          <View
            ref={sourceListRef}
            className="overflow-y-auto overflow-x-hidden p-2"
            style={{ height }}
            onKeyDown={(e) => handleKeyDown(e, "source")}
            tabIndex={0}
          >
            {filteredSourceData.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                <Search className="w-12 h-12 mb-3 opacity-30" />
                <Text className="text-sm">No items available</Text>
              </View>
            ) : (
              <View className="space-y-1">
                {filteredSourceData.map((item, index) =>
                  renderListItem(
                    item,
                    index,
                    selectedIds.has(item.id),
                    "source"
                  )
                )}
              </View>
            )}
          </View>
        </View>

        {/* Controls */}
        <View className="flex lg:flex-col justify-center items-center py-4 lg:py-0">
          <Button
            variant="ghost"
            size="small"
            onPress={() => {
              setSelectedIds(new Set());
              onSelectionChange([]);
            }}
            disabled={disabled || selectedItems.length === 0}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-red-600 
            bg-background hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            title="Clear all selections"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </View>

        {/* Selected Items */}
        <View className="flex-1 bg-white dark:bg-background border border-border dark:border-border rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <View className="p-4 border-b border-slate-200 dark:border-slate-700 bg-background dark:bg-background">
            <View className="flex items-center justify-between mb-3">
              <Text
                as="p"
                className=" text-slate-700 dark:text-slate-200 "
              >
                {selectedTitle}
              </Text>
              {showCount && (
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary text-slate-600 dark:text-black text-xs rounded-full font-medium">
                  {filteredSelectedData.length}
                </span>
              )}
            </View>

            {/* Search */}
            {searchableSelectedItems && (
              <View className="mb-3">
                <SearchBar
                  value={selectedSearchTerm}
                  onChange={setSelectedSearchTerm}
                  placeholder="Search selected items..."
                  disabled={disabled}
                  showClearButton
                  className="w-full bg-card"
                  variant="outlined"
                  parentType="div"
                />
              </View>
            )}

            {/* Deselect All */}
            {allowSelectAllSelectedItems && filteredSelectedData.length > 0 && (
              <View className="mb-3">
                <Button
                  variant="ghost"
                  size="small"
                  onPress={handleDeselectAll}
                  disabled={disabled}
                  className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <View
                    className={`w-4 h-4 rounded border-2 border-primary-500 flex items-center justify-center transition-colors ${
                      filteredSelectedData.every((item) =>
                        selectedIds.has(item.id)
                      )
                        ? "bg-primary-500"
                        : "bg-white dark:bg-slate-800"
                    }`}
                  >
                    {filteredSelectedData.every((item) =>
                      selectedIds.has(item.id)
                    ) && <Check className="w-2.5 h-2.5 text-white" />}
                  </View>
                  Deselect All
                </Button>
              </View>
            )}

            {/* Custom Value Input */}
            {onAllowCustomValues && (
              <Button
                variant="ghost"
                size="small"
                onPress={onAllowCustomValues}
                disabled={disabled}
                className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                <Plus className="w-4 h-4" />
                <Text>{customValuePlaceholder}</Text>
              </Button>
            )}
            {allowCustomValues && (
              <View className="mb-3">
                {!showCustomInput ? (
                  <Button
                    variant="ghost"
                    size="small"
                    onPress={() => setShowCustomInput(true)}
                    disabled={disabled}
                    className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <Plus className="w-4 h-4" />
                    <Text>{customValuePlaceholder}</Text>
                  </Button>
                ) : (
                  <View className="space-y-2">
                    <Input
                      ref={customLabelInputRef}
                      type="text"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="Enter label..."
                      disabled={disabled}
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddCustomValue();
                        } else if (e.key === "Escape") {
                          setShowCustomInput(false);
                          setCustomLabel("");
                          setCustomValue("");
                          setCustomDescription("");
                        }
                      }}
                    />
                    <Input
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      placeholder="Enter value..."
                      disabled={disabled}
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddCustomValue();
                        } else if (e.key === "Escape") {
                          setShowCustomInput(false);
                          setCustomLabel("");
                          setCustomValue("");
                          setCustomDescription("");
                        }
                      }}
                    />
                    <Input
                      type="text"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Enter description (optional)..."
                      disabled={disabled}
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddCustomValue();
                        } else if (e.key === "Escape") {
                          setShowCustomInput(false);
                          setCustomLabel("");
                          setCustomValue("");
                          setCustomDescription("");
                        }
                      }}
                    />
                    <View className="flex gap-2">
                      <Button
                        variant="primary"
                        size="small"
                        onPress={handleAddCustomValue}
                        disabled={
                          disabled || !customLabel.trim() || !customValue.trim()
                        }
                        className="flex-1"
                      >
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        size="small"
                        onPress={() => {
                          setShowCustomInput(false);
                          setCustomLabel("");
                          setCustomValue("");
                          setCustomDescription("");
                        }}
                        disabled={disabled}
                      >
                        Cancel
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Items List */}
          <View
            ref={selectedListRef}
            className="overflow-y-auto overflow-x-hidden p-2"
            style={{ height }}
            onKeyDown={(e) => handleKeyDown(e, "selected")}
            tabIndex={0}
          >
            {filteredSelectedData.length === 0 ? (
              <View className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                <View className="w-12 h-12 mb-3 opacity-30 flex items-center justify-center">
                  <View className="w-8 h-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg"></View>
                </View>
                <Text className="text-sm">No items selected</Text>
              </View>
            ) : (
              <View className="space-y-1">
                {filteredSelectedData.map((item, index) =>
                  renderListItem(
                    item,
                    index,
                    selectedIds.has(item.id),
                    "selected"
                  )
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View className="flex items-center gap-2 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <X className="w-4 h-4 text-red-500 shrink-0" />
          <Text className="text-red-500 text-sm font-medium">{error}</Text>
        </View>
      )}

      {/* Helper Text */}
      {/* <View className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <Text>• Click items to select/deselect</Text>
        <Text>• Use keyboard navigation with arrow keys</Text>
        {maxSelections && <Text>• Maximum {maxSelections} selections allowed</Text>}
      </View> */}
    </View>
  );
};

export default TransferList;
