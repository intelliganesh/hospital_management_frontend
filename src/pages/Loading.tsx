import React from "react";
import Text from "@/components/text";
import View from "@/components/view";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ColorProvider } from "@/contexts/ColorContext";
import JellyTriangleSpinner from "@/components/JellyTriangleSpinner";
const Loading: React.FC<{ color?: string }> = ({ color = "#1A73E8" }) => {
  return (
    <ThemeProvider>
      <ColorProvider>
        <View className="flex items-center justify-center h-screen bg-white dark:bg-background">
          <View className="flex flex-col items-center gap-4 dark:bg-transparent">
            <View>
              <JellyTriangleSpinner color={color} size={50} />
            </View>
            <Text as="p" className="text-gray-600 text-lg font-medium">
              Loading, please wait...
            </Text>
          </View>
        </View>
      </ColorProvider>
    </ThemeProvider>
  );
};

export default Loading;
