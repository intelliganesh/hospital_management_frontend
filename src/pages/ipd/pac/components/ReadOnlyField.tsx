import React from "react";
import View from "@/components/view";
import Text from "@/components/text";

interface ReadOnlyFieldProps {
  label: string;
  value?: string | number | null;
  className?: string;
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value, className }) => {
  const displayValue = value !== undefined && value !== null && value !== "" ? value : null;

  return (
    <View className={`flex flex-col gap-1 ${className || ""}`}>
      <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </Text>
      <View className="min-h-[1.5rem] flex items-center">
        {displayValue ? (
          <Text className="text-sm text-slate-900 dark:text-slate-100 font-medium">
            {displayValue}
          </Text>
        ) : (
          <Text className="text-sm text-slate-400 italic">Not recorded</Text>
        )}
      </View>
    </View>
  );
};

export default ReadOnlyField;
