import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/button";
import View from "./view";
import Text from "./text";
import Input from "./input";
import Textarea from "./Textarea";
import SingleSelector from "./SingleSelector";
import RadioGroup from "./RadioGroup";
import CheckBox from "./CheckBox";

export interface FieldConfig {
  key: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "date";
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
  colSpan?: number; // 1 to 12
  validation?: (value: any) => string | null;
  componentProps?: any; // Pass-through props
  disabled?: boolean;
}

interface DynamicItem {
  id: string; // Unique ID for React keys
  [key: string]: any;
}

interface DynamicFormGroupProps {
  title: string;
  entryLabel?: string;
  fields: FieldConfig[];
  data: any[]; // Array of objects
  onChange: (newData: any[]) => void;
  errors?: Record<string, string>; // External errors
  minGroups?: number;
  maxGroups?: number;
  readOnly?: boolean;
  className?: string;
  gridCols?: number; // Default 1 (1 column) or specify grid columns
  renderCustomField?: (
    field: FieldConfig,
    item: any,
    onChange: (val: any) => void,
  ) => React.ReactNode;
  isDeletable?: (item: any, index: number) => boolean;
}

const DynamicFormGroup: React.FC<DynamicFormGroupProps> = ({
  title,
  entryLabel = "Entry",
  fields,
  data = [],
  onChange,
  // errors = {},
  minGroups = 0,
  maxGroups = 100,
  readOnly = false,
  className = "",
  gridCols = 1,
  renderCustomField,
  isDeletable,
}) => {
  const [internalData, setInternalData] = useState<DynamicItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, Record<string, string>>
  >({});

  // Sync internal state with prop data, ensuring IDs exist
  useEffect(() => {
    if (data && data.length > 0) {
      const ensuredData = data.map((item, idx) => ({
        ...item,
        id: item.id || `item-${Date.now()}-${idx}`,
      }));
      setInternalData(ensuredData);
    } else if (minGroups > 0 && (!data || data.length === 0)) {
      // Initialize valid empty groups
      const initialGroups = Array.from({ length: minGroups }).map((_, idx) =>
        createEmptyItem(`init-${idx}`),
      );
      setInternalData(initialGroups);
    } else {
      setInternalData([]);
    }
  }, [data, minGroups]);

  const createEmptyItem = (idSuffix: string): DynamicItem => {
    const newItem: DynamicItem = { id: `new-${Date.now()}-${idSuffix}` };
    fields.forEach((f) => {
      if (f.type === "checkbox") newItem[f.key] = false;
      else newItem[f.key] = "";
    });
    return newItem;
  };

  const handleAddGroup = useCallback(() => {
    if (internalData.length >= maxGroups) return;
    const newItem = createEmptyItem(internalData.length.toString());
    const newData = [...internalData, newItem];
    setInternalData(newData);
    onChange(newData);
  }, [internalData, maxGroups, fields, onChange]);

  const handleRemoveGroup = useCallback(
    (id: string) => {
      // Check constraints
      if (internalData.length <= minGroups) return;

      const newData = internalData.filter((item) => item.id !== id);
      setInternalData(newData);
      onChange(newData);

      // Cleanup errors
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [internalData, minGroups, onChange],
  );

  const handleFieldChange = useCallback(
    (id: string, fieldKey: string, value: any) => {
      const fieldConfig = fields.find((f) => f.key === fieldKey);

      // Validate on change
      if (fieldConfig?.validation) {
        const error = fieldConfig.validation(value);
        setValidationErrors((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            [fieldKey]: error || "",
          },
        }));
      }

      const newData = internalData.map((item) => {
        if (item.id === id) {
          return { ...item, [fieldKey]: value };
        }
        return item;
      });

      setInternalData(newData);
      onChange(newData);
    },
    [internalData, fields, onChange],
  );

  // Render a single field based on type
  const renderFieldInput = (item: DynamicItem, field: FieldConfig) => {
    if (renderCustomField) {
      const custom = renderCustomField(field, item, (val) =>
        handleFieldChange(item.id, field.key, val),
      );
      if (custom) return custom;
    }

    //   const error = validationErrors[item.id]?.[field.key];
    const fieldError = validationErrors[item.id]?.[field.key];

    const commonProps = {
      name: `${field.key}-${item.id}`,
      id: `${field.key}-${item.id}`,
      label: field.label, // Most components handle label inside
      placeholder: field.placeholder,
      disabled: field.disabled || readOnly,
      error: fieldError,
      required: field.required,
      ...field.componentProps,
    };

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            value={item[field.key]}
            onChange={(e: any) =>
              handleFieldChange(item.id, field.key, e.target.value)
            }
          />
        );
      case "select":
        return (
          <SingleSelector
            {...commonProps}
            value={item[field.key]}
            onChange={(val: any) => handleFieldChange(item.id, field.key, val)}
            options={field.options || []}
          />
        );
      case "radio":
        return (
          <View>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <RadioGroup
              name={commonProps.name}
              value={item[field.key]}
              onChange={(val: any) =>
                handleFieldChange(item.id, field.key, val)
              }
              options={field.options || []}
              disabled={field.disabled || readOnly}
              {...field.componentProps}
            />
            {fieldError && (
              <Text className="text-red-500 text-sm mt-1">{fieldError}</Text>
            )}
          </View>
        );
      case "checkbox":
        return (
          <View className="flex items-center gap-2 pt-8">
            {/* pt-8 aligns it roughly with inputs that have labels */}
            <CheckBox
              {...commonProps}
              checked={!!item[field.key]}
              onChange={(e: any) =>
                handleFieldChange(item.id, field.key, e.target.checked)
              }
            />
            <label
              htmlFor={commonProps.id}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {field.label}
            </label>
          </View>
        );
      case "date":
        return (
          <Input
            type="date"
            {...commonProps}
            value={item[field.key]}
            onChange={(e: any) =>
              handleFieldChange(item.id, field.key, e.target.value)
            }
          />
        );
      default: // text, number, email, password, etc.
        return (
          <Input
            type={field.type}
            {...commonProps}
            //   disabled={field.disabled}
            value={item[field.key]}
            onChange={(e: any) =>
              handleFieldChange(item.id, field.key, e.target.value)
            }
          />
        );
    }
  };

  return (
    <Card
      className={`w-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <View className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </CardTitle>
          <Text className="text-xs text-slate-500 font-normal">
            {internalData.length}{" "}
            {internalData.length === 1 ? entryLabel : entryLabel + "s"}
          </Text>
        </View>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {internalData.length === 0 && (
          <View className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
            <Text className="text-slate-400">No entries yet.</Text>
          </View>
        )}

        {internalData.map((item, index) => (
          <View
            key={item.id}
            className="relative p-5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 group transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
          >
            <View className="flex justify-between items-center mb-4">
              <View className="flex items-center gap-2">
                <View className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </View>
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {entryLabel} #{index + 1}
                </Text>
              </View>

              {!readOnly && (!isDeletable || isDeletable(item, index)) && (
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => handleRemoveGroup(item.id)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 h-8 w-8 rounded-full transition-colors"
                  disabled={internalData.length <= minGroups}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </View>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              }}
            >
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{
                    gridColumn: field.colSpan
                      ? `span ${field.colSpan} / span ${field.colSpan}`
                      : "auto",
                  }}
                >
                  {renderFieldInput(item, field)}
                </div>
              ))}
            </div>
          </View>
        ))}

        {!readOnly && internalData.length < maxGroups && (
          <Button
            variant="outline"
            onPress={handleAddGroup}
            className="w-full flex items-center justify-center border-dashed border-2 py-6 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all group"
          >
            <Plus
              size={18}
              className="mr-2 group-hover:scale-110 transition-transform"
            />
            Add New {entryLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicFormGroup;
