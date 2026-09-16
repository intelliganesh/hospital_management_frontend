import React, { useEffect } from "react";
import View from "./view";
import { useSearchParams } from "react-router-dom";

interface Tab {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
}

const TabView: React.FC<TabViewProps> = ({ tabs, defaultValue, className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || defaultValue || tabs[0]?.value;

  useEffect(() => {
    if (!searchParams.get("tab") && tabs.length > 0) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("tab", defaultValue || tabs[0].value);
      setSearchParams(nextParams, { replace: true });
    }
  }, []);

  return (
    <View className={`w-full ${className || ""}`}>
      <View className="border-b border-slate-200 dark:border-slate-700">
        <View className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  if (activeTab === tab.value) return;
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set("tab", tab.value);
                  if (tab.value === "system-settings") {
                    nextParams.delete("currentPage");
                  } else {
                    nextParams.set("currentPage", "1");
                  }
                  setSearchParams(nextParams);
                }}
                className={`relative px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none rounded-t-lg whitespace-nowrap ${
                  isActive
                    ? "text-primary bg-primary/5 dark:bg-primary/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
                {isActive && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </View>
      </View>
      <View className="mt-6">
        {tabs.map((tab) => {
          if (activeTab !== tab.value) return null;
          return (
            <View key={tab.value} className="animate-in fade-in duration-200">
              {tab.content}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default TabView;
