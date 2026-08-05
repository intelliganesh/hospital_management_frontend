import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { updateColorVariables } from "@/utils/colorUpdater";
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

interface ColorScheme {
  primary_color: string;
  bg_primary_color: string;
  text_primary_color: string;
  secondary_color: string;
  bg_secondary_color: string;
  text_secondary_color: string;
  tertiary_color: string;
  bg_tertiary_color: string;
  text_tertiary_color: string;
}

const defaultColors: ColorScheme = {
  primary_color: "#006D77",
  bg_primary_color: "#ebfdff",
  text_primary_color: "#FFFFFF",

  secondary_color: "#E2952A",
  bg_secondary_color: "#fff9f0",
  text_secondary_color: "#FFFFFF",

  tertiary_color: "#f7c078",
  bg_tertiary_color: "#fff8f0",
  text_tertiary_color: "#FFFFFF",
};

type ColorContextType = {
  colors: ColorScheme;
  setColors: (colors: Partial<ColorScheme>) => void;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );

  // Initialize with default colors
  const [colors, setColorsState] = useState<ColorScheme>(defaultColors);

  useLayoutEffect(() => {
    updateColorVariables(colors);
  }, [colors]);

  // Function to update colors (only updates local state, not backend)

  useEffect(() => {
    const colors = localStorage.getItem("colors")
      ? JSON.parse(localStorage.getItem("colors") as string)
      : null;
    // if(colorData){
    //   setColorsState(colorData);
    //   // updateColorVariables(colorData);
    // }

    if (settingsData) {
      const colorData = {
        primary_color: colors
          ? colors?.primary_color
          : settingsData?.primary_color,
        tertiary_color: colors
          ? colors?.tertiary_color
          : settingsData?.tertiary_color,
        secondary_color: colors
          ? colors?.secondary_color
          : settingsData?.secondary_color,
        bg_primary_color: colors
          ? colors?.bg_primary_color
          : settingsData?.bg_primary_color,
        bg_tertiary_color: colors
          ? colors?.bg_tertiary_color
          : settingsData?.bg_tertiary_color,
        bg_secondary_color: colors
          ? colors?.bg_secondary_color
          : settingsData?.bg_secondary_color,
        text_primary_color: colors
          ? colors?.text_primary_color
          : settingsData?.text_primary_color,
        text_tertiary_color: colors
          ? colors?.text_tertiary_color
          : settingsData?.text_tertiary_color,
        text_secondary_color: colors
          ? colors?.text_secondary_color
          : settingsData?.text_secondary_color,
      };
      setColorsState(colorData);
      updateColorVariables(colorData);
    }
  }, [settingsData]);

  const setColors = (newColors: Partial<ColorScheme>) => {
    setColorsState((prevColors) => {
      const updatedColors = { ...prevColors, ...newColors };
      return updatedColors;
    });
  };

  // Apply colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    // Set CSS variables for colors
    root.style.setProperty("--primary", colors.primary_color);
    root.style.setProperty("--primary-foreground", colors.text_primary_color);
    root.style.setProperty("--secondary", colors.secondary_color);
    root.style.setProperty(
      "--secondary-foreground",
      colors.text_secondary_color
    );
    root.style.setProperty("--accent", colors.tertiary_color);
    root.style.setProperty("--accent-foreground", colors.text_tertiary_color);
    // Set background colors
    root.style.setProperty("--primary-bg", colors.bg_primary_color);
    root.style.setProperty("--secondary-bg", colors.bg_secondary_color);
    root.style.setProperty("--tertiary-bg", colors.bg_tertiary_color);
    // Also update Tailwind colors directly
    document.documentElement.style.setProperty(
      "--color-primary",
      colors.primary_color,
      "important"
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      colors.secondary_color
    );
    document.documentElement.style.setProperty(
      "--color-accent",
      colors.tertiary_color
    );

    return () => {
      root.style.removeProperty("--accent");
      root.style.removeProperty("--primary");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--primary-bg");
      root.style.removeProperty("--tertiary-bg");
      root.style.removeProperty("--secondary-bg");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--secondary-foreground");
      document.documentElement.style.removeProperty("--color-accent");
      document.documentElement.style.removeProperty("--color-primary");
      document.documentElement.style.removeProperty("--color-secondary");
    };
  }, [
    settingsData,
    colors.primary_color,
    colors.tertiary_color,
    colors.secondary_color,
    colors.bg_primary_color,
    colors.bg_tertiary_color,
    colors.text_primary_color,
    colors.bg_secondary_color,
    colors.text_tertiary_color,
    colors.text_secondary_color,
  ]);

  return (
    <ColorContext.Provider value={{ colors, setColors }}>
      {children}
    </ColorContext.Provider>
  );
};

// Custom hook to use the color context
export const useColors = () => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error("useColors must be used within a ColorProvider");
  }
  return context;
};
