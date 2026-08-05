import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import useForm from "@/utils/custom-hooks/use-form";
import { Theme } from "@/interfaces/systemSettings";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import View from "@/components/view";
import Text from "@/components/text";

interface ThemeSettingProps {
  errorsTheme: string;
}

const ThemeSettingSection: React.FC<ThemeSettingProps> = ({ errorsTheme }) => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );
  const { theme, setTheme } = useTheme();
  const { values, onSetHandler } = useForm(settingsData);

  useEffect(() => {
    if (values?.theme) {
      onSetHandler("theme", values.theme);
    } else {
      onSetHandler("theme", theme);
    }
  }, [values?.theme, theme]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Choose a theme for your system interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="space-y-3">
          <Text as="label" className="text-sm font-medium">Theme Mode</Text>
          <RadioGroup
            name="theme"
            value={values?.theme}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const selectedTheme = event.target.value as Theme;
              onSetHandler("theme", selectedTheme);
              setTheme(selectedTheme);
            }}
          >
            <RadioGroupItem
              label="Light"
              id="theme-light"
              value={Theme.LIGHT}
              icon={<Sun className="h-4 w-4" />}
            />
            <RadioGroupItem
              label="Dark"
              id="theme-dark"
              value={Theme.DARK}
              icon={<Moon className="h-4 w-4" />}
            />
            <RadioGroupItem
              label="System"
              id="theme-system"
              value={Theme.SYSTEM}
              icon={<Laptop className="h-4 w-4" />}
            />
          </RadioGroup>
          {errorsTheme && (
            <Text as="p" className="text-red-500 text-xs mt-1">{errorsTheme}</Text>
          )}
        </View>
      </CardContent>
    </Card>
  );
};

export default ThemeSettingSection;
