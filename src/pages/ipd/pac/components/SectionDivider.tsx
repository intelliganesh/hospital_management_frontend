import React from "react";
import View from "@/components/view";
import Text from "@/components/text";

interface SectionDividerProps {
  label: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
  return (
    <View className="flex items-center gap-4 my-6">
      <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
        {label}
      </Text>
      <View className="h-px bg-slate-100 flex-1" />
    </View>
  );
};

export default SectionDivider;
