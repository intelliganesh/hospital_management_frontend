import React from "react";
import View from "./view";

const BouncingLoader: React.FC<{ isLoading: boolean; notFixed?: boolean }> = ({
  isLoading = true,
  notFixed = false,
}) => {
  const colors = [
    "bg-primary-200",
    "bg-primary-400",
    "bg-primary-600",
    // "bg-orange-500",
  ];

  return (
    <View
      className={`w-32 h-fit mx-auto flex justify-center items-center ${
        !notFixed ? "fixed top-4 left-0 right-0" : ""
      } z-50`}
    >
      <View
        className={`flex justify-center items-center gap-4 p-3 z-50 bg-primary-20 dark:bg-card rounded-full ${
          !notFixed ? " shadow-lg " : ""
        } transition-all duration-500 ease-out ${
          isLoading
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        {colors.map((color, index) => (
          <View
            key={index}
            className={`w-3 h-3 rounded-full ${color} ${
              isLoading ? "animate-bounce" : ""
            }`}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: "1s",
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default BouncingLoader;
