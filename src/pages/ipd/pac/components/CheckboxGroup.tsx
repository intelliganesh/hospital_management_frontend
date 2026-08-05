import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import CheckBox from "@/components/CheckBox";

interface CheckboxGroupProps {
  name: string;
  label?: string;
  options: string[];
  selected?: string[];
  /**
   * Called with the full updated selected array after every interaction.
   * Replaces the need for a manual `toggleSelection` helper in parent forms.
   */
  onChange?: (newSelected: string[]) => void;
  /**
   * "multi"  – any number of items can be selected (default)
   * "single" – at most one item selected at a time (radio-like)
   */
  selectionMode?: "multi" | "single";
  /**
   * "array" (default) – onChange receives the full updated string[].
   *   Store with: onSetHandler("field", newSelected)
   *
   * "flat" – each checkbox also fires onFlatChange with the native
   *   ChangeEvent (name="${name}__${opt}"), compatible with handleChange
   *   and new FormData() serialization. onChange still fires optionally.
   */
  valueMode?: "array" | "flat";
  /**
   * Only used when valueMode="flat". Pass handleChange here to store each
   * checkbox as an individual field (e.g. field__Option: "on").
   */
  onFlatChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** @deprecated Use `onChange` instead. Kept for backward compatibility. */
  onToggle?: (value: string, checked: boolean) => void;
  readOnly?: boolean;
  className?: string;
  itemClassName?: string;
  error?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  label,
  options,
  selected = [],
  onChange,
  onToggle,
  selectionMode = "multi",
  valueMode = "array",
  onFlatChange,
  readOnly = false,
  className = "flex flex-wrap gap-x-6 gap-y-3",
  itemClassName = "text-sm font-medium text-slate-700 dark:text-slate-200",
  error,
}) => {
  // Normalise: server may send a JSON string instead of a parsed array
  const safeSelected: string[] = (() => {
    if (Array.isArray(selected)) return selected;
    if (typeof selected === "string") {
      try {
        const parsed = JSON.parse(selected);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  const handleClick = (
    opt: string,
    e?: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (readOnly) return;
    const isChecked = safeSelected.includes(opt);

    let newSelected: string[];
    if (selectionMode === "single") {
      newSelected = isChecked ? [] : [opt];
    } else {
      newSelected = isChecked
        ? safeSelected.filter((s) => s !== opt)
        : [...safeSelected, opt];
    }

    onChange?.(newSelected);
    // backward-compat: still fire onToggle if provided
    onToggle?.(opt, !isChecked);
    // flat mode: synthesize an event with value "true"/"false" for handleChange
    if (valueMode === "flat" && e && onFlatChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: `${name}__${opt}`,
          value: String(!isChecked),
        },
        currentTarget: {
          ...e.currentTarget,
          name: `${name}__${opt}`,
          value: String(!isChecked),
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onFlatChange(syntheticEvent);
    }
  };

  return (
    <View>
      {label && (
        <Text className="text-xs font-bold text-slate-500 mb-2 uppercase">
          {label}
        </Text>
      )}
      <View className={className}>
        {options.map((opt) => (
          <View
            key={opt}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleClick(opt)}
          >
            <CheckBox
              name={`${name}__${opt}`}
              checked={safeSelected.includes(opt)}
              onChange={(e) => handleClick(opt, e)}
              disabled={readOnly}
              readonly={readOnly}
            />
            <Text as="span" className={itemClassName}>
              {opt}
            </Text>
          </View>
        ))}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
        )}
      </View>
    </View>
  );
};

export default CheckboxGroup;
