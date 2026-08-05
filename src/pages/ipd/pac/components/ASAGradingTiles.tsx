import React from "react";
import View from "@/components/view";
import Text from "@/components/text";

interface ASAGradingTilesProps {
  value?: string | number | null;
}

const ASAGradingTiles: React.FC<ASAGradingTilesProps> = ({ value }) => {
  const options = ["1", "2", "3", "4", "5", "E"];

  const normalizedValue =
    {
      I: "1",
      II: "2",
      III: "3",
      IV: "4",
      V: "5",
      E: "E",
    }[value?.toString() || ""] || value?.toString();

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        ASA Grading
      </Text>
      <View className="flex gap-2">
        {options.map((option) => (
          <View
            key={option}
            className={`w-10 h-10 flex items-center justify-center rounded border text-sm font-semibold ${
              normalizedValue === option
                ? "bg-primary text-white border-primary"
                : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
          >
            {option}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ASAGradingTiles;
