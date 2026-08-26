import React from "react";
import View from "@/components/view";
import Text from "@/components/text";

interface TagPillProps {
  label: string;
  items?: string[] | string | null;
}

const TagPill: React.FC<TagPillProps> = ({ label, items }) => {
  let itemList: string[] = [];
  if (Array.isArray(items)) {
    itemList = items;
  } else if (typeof items === "string") {
    itemList = items.split(",").map((s) => s.trim()).filter(Boolean);
  }

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </Text>
      <View className="flex flex-wrap gap-2">
        {itemList.length > 0 ? (
          itemList.map((item, index) => (
            <View
              key={index}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700"
            >
              {item}
            </View>
          ))
        ) : (
          <Text className="text-sm text-slate-400 italic">Not recorded</Text>
        )}
      </View>
    </View>
  );
};

export default TagPill;
