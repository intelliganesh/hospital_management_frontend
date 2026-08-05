import React from "react";
import View from "./view";
import Button from "./button";
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

const TabView: React.FC<TabViewProps> = ({ tabs, className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <View className={`w-full ${className}`}>
      <View className="flex gap-3">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            disabled={searchParams.get("tab") === tab.value}
            onClick={() => {
              if (searchParams.get("tab") === tab.value) return;
              const searchData = {
                ...searchParams,
                tab: tab.value,
                currentPage: tab.value === "system-settings" ? undefined : "1",
              };
              setSearchParams(JSON.parse(JSON.stringify(searchData)));
            }}
            variant={`${
              searchParams.get("tab") === tab.value ? "ghost" : "ghost"
            }`}
            className={`px-4 py-2 text-sm font-medium transition-colors
              ${
                searchParams.get("tab") === tab.value
                  ? "border-b-2 border-primary text-primary"
                  : "text-neutral-600 hover:text-primary"
              }`}
          >
            {tab.label}
          </Button>
        ))}
      </View>
      <View className="mt-4">
        {tabs
          .filter((filterdata) => {
            if (searchParams.get("tab") === filterdata.value) {
              return filterdata;
            }
          })
          .map((tab) => (
            <View key={tab.value}>{tab.content}</View>
          ))}
      </View>
    </View>
  );
};

export default TabView;
