import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { FileDown } from "lucide-react";

interface Doc {
  label: string;
  path: string | null | undefined;
}

interface Props {
  docs: Doc[];
  onPreview: (url: string, title: string) => void;
}

/**
 * Renders uploaded document preview buttons for a given tab.
 * Only shows if at least one doc path exists.
 */
const TabUploadSection: React.FC<Props> = ({ docs, onPreview }) => {
  const filtered = docs.filter((d) => d.path);
  if (filtered.length === 0) return null;

  return (
    <View className="mt-2 pt-6 border-t border-slate-100">
      <Text className="text-[10px] font-black text-slate-500 uppercase tracking-[0.18em] mb-4 block">
        Uploaded Documents
      </Text>
      <View className="flex flex-wrap gap-3">
        {filtered.map((doc, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="small"
            className="group flex items-center gap-2 bg-slate-50 border-slate-200 hover:bg-primary hover:text-white hover:border-primary text-slate-600 font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 text-sm"
            onPress={() => onPreview(doc.path!, doc.label)}
          >
            <FileDown
              size={14}
              className="text-primary group-hover:text-white transition-colors"
            />
            {doc.label}
          </Button>
        ))}
      </View>
    </View>
  );
};

export default TabUploadSection;
