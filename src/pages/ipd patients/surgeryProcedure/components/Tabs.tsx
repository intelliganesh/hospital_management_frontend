import React, { useState } from "react";
import View from "@/components/view";
import Button from "@/components/button";

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || "");

  return (
    <View className="w-full">
      {/* Tab Headers */}
      <View className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            variant="ghost"
            className={`px-6 py-3 text-sm font-medium transition-all rounded-t-lg
              ${
                activeTab === tab.value
                  ? "border-b-2 border-primary text-primary bg-primary/5"
                  : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
          >
            {tab.label}
          </Button>
        ))}
      </View>

      {/* Tab Content */}
      <View className="mt-6">
        {tabs.map((tab) => (
          <View
            key={tab.value}
            className={activeTab === tab.value ? "block" : "hidden"}
          >
            {tab.content}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Tabs;
