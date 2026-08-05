import { useEffect } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useColors } from "@/contexts/ColorContext";
import useForm from "@/utils/custom-hooks/use-form";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const ColorPreview = ({ color }: { color: string }) => (
  <View
    className="w-6 h-6 rounded-md border border-neutral-300 inline-block mr-2"
    style={{ backgroundColor: color }}
  />
);

interface ColorSchemeProps {
  errorsPrimaryColor: string;
  errorsTertiaryColor: string;
  errorsBgPrimaryColor: string;
  errorsSecondaryColor: string;
  errorsBgTertiaryColor: string;
  errorsTextPrimaryColor: string;
  errorsBgSecondaryColor: string;
  errorsTextSecondaryColor: string;
  errorsTextTertiaryColor: string;
}
const ColorSchemeSection: React.FC<ColorSchemeProps> = ({
  errorsPrimaryColor,
  errorsTertiaryColor,
  errorsBgPrimaryColor,
  errorsSecondaryColor,
  errorsBgTertiaryColor,
  errorsBgSecondaryColor,
  // errorsTextPrimaryColor,
  // errorsTextTertiaryColor,
  // errorsTextSecondaryColor,
}) => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );
  const colors = localStorage.getItem("colors") ? JSON.parse(localStorage.getItem("colors") as string) : null;
  const { values, handleChange, onSetHandler } = useForm(colors ? colors : settingsData);
  const { setColors } = useColors();

  useEffect(() => {
    onSetHandler("primary_color", values?.primary_color);
    onSetHandler("tertiary_color", values?.tertiary_color);
    onSetHandler("secondary_color", values?.secondary_color);
    onSetHandler("bg_primary_color", values?.bg_primary_color);
    onSetHandler("bg_tertiary_color", values?.bg_tertiary_color);
    onSetHandler("text_primary_color", values?.text_primary_color);
    onSetHandler("bg_secondary_color", values?.bg_secondary_color);
    onSetHandler("text_tertiary_color", values?.text_tertiary_color);
    onSetHandler("text_secondary_color", values?.text_secondary_color);

    // Update ColorContext for live preview
    setColors({
      primary_color: values?.primary_color,
      tertiary_color: values?.tertiary_color,
      secondary_color: values?.secondary_color,
      bg_primary_color: values?.bg_primary_color,
      bg_tertiary_color: values?.bg_tertiary_color,
      text_primary_color: values?.text_primary_color,
      bg_secondary_color: values?.bg_secondary_color,
      text_tertiary_color: values?.text_tertiary_color,
      text_secondary_color: values?.text_secondary_color,
    });
  }, [
    values?.primary_color,
    values?.tertiary_color,
    values?.secondary_color,
    values?.bg_primary_color,
    values?.bg_tertiary_color,
    values?.text_primary_color,
    values?.bg_secondary_color,
    values?.text_tertiary_color,
    values?.text_secondary_color,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Scheme</CardTitle>
        <CardDescription>Customize the system color scheme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Colors */}
        <View >
          <Text as="h3" className="text-lg font-medium mb-3">
            Primary Colors
          </Text>
          <View className="grid grid-cols-1 gap-6">
            <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.primary_color} />
                Primary
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="primary_color_picker"
                    name="primary_color"
                    value={values?.primary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="primary_color"
                  name="primary_color"
                  value={values?.primary_color}
                  onChange={handleChange}
                  placeholder="#1A73E8"
                  error={errorsPrimaryColor}
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.bg_primary_color} />
                Background
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="bg_primary_color_picker"
                    name="bg_primary_color"
                    value={values?.bg_primary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="bg_primary_color"
                  name="bg_primary_color"
                  value={values?.bg_primary_color}
                  onChange={handleChange}
                  placeholder="#F5F9FF"
                  error={errorsBgPrimaryColor}
                />
              </View>
            </View>

            {/* <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.text_primary_color} />
                Text
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="text_primary_color_picker"
                    name="text_primary_color"
                    value={values?.text_primary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="text_primary_color"
                  name="text_primary_color"
                  value={values?.text_primary_color}
                  onChange={handleChange}
                  placeholder="#FFFFFF"
                  error={errorsTextPrimaryColor}
                />
              </View>
            </View> */}
          </View>
        </View>

        {/* <Separator /> */}

        {/* Secondary Colors */}
        <View>
          <Text as="h3" className="text-lg font-medium mb-3">
            Secondary Colors
          </Text>
          <View className="grid grid-cols-1 gap-6">
            <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.secondary_color} />
                Secondary
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="secondary_color_picker"
                    name="secondary_color"
                    value={values?.secondary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="secondary_color"
                  name="secondary_color"
                  value={values?.secondary_color}
                  onChange={handleChange}
                  placeholder="#36B37E"
                  error={errorsSecondaryColor}
                  className={`w-full ${
                    errorsSecondaryColor ? "border-red-500" : ""
                  }`}
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.bg_secondary_color} />
                Background
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="bg_secondary_color_picker"
                    name="bg_secondary_color"
                    value={values?.bg_secondary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="bg_secondary_color"
                  name="bg_secondary_color"
                  value={values?.bg_secondary_color}
                  onChange={handleChange}
                  placeholder="#F0FAF5"
                  error={errorsBgSecondaryColor}
                  className={`w-full ${
                    errorsBgSecondaryColor ? "border-red-500" : ""
                  }`}
                />
              </View>
            </View>

            {/* <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.text_secondary_color} />
                Text
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="text_secondary_color_picker"
                    name="text_secondary_color"
                    value={values?.text_secondary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="text_secondary_color"
                  name="text_secondary_color"
                  value={values?.text_secondary_color}
                  onChange={handleChange}
                  placeholder="#FFFFFF"
                  error={errorsTextSecondaryColor}
                  className={`w-full ${
                    errorsTextSecondaryColor ? "border-red-500" : ""
                  }`}
                />
              </View>
            </View> */}
          </View>
        </View>

        {/* <Separator /> */}

        {/* Tertiary Colors */}
        <View>
          <Text as="h3" className="text-lg font-medium mb-3">
            Tertiary Colors
          </Text>
          <View className="grid grid-cols-1 gap-6">
            <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.tertiary_color} />
                Tertiary
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="tertiary_color_picker"
                    name="tertiary_color"
                    value={values?.tertiary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="tertiary_color"
                  name="tertiary_color"
                  value={values?.tertiary_color}
                  onChange={handleChange}
                  placeholder="#FBBC05"
                  error={errorsTertiaryColor}
                  className={`w-full ${
                    errorsTertiaryColor ? "border-red-500" : ""
                  }`}
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.bg_tertiary_color} />
                Background
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="bg_tertiary_color_picker"
                    name="bg_tertiary_color"
                    value={values?.bg_tertiary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="bg_tertiary_color"
                  name="bg_tertiary_color"
                  value={values?.bg_tertiary_color}
                  onChange={handleChange}
                  placeholder="#FEF7CD"
                  error={errorsBgTertiaryColor}
                  className={`w-full ${
                    errorsBgTertiaryColor ? "border-red-500" : ""
                  }`}
                />
              </View>
            </View>

            {/* <View className="space-y-2">
              <Text
                as="label"
                className="flex items-center text-sm font-medium"
              >
                <ColorPreview color={values?.text_tertiary_color} />
                Text
              </Text>
              <View className="flex gap-2">
                <View>
                  <Input
                    type="color"
                    id="text_tertiary_color_picker"
                    name="text_tertiary_color"
                    value={values?.text_tertiary_color}
                    onChange={handleChange}
                    className="w-10 h-10 p-1"
                  />
                </View>
                <Input
                  type="text"
                  id="text_tertiary_color"
                  name="text_tertiary_color"
                  value={values?.text_tertiary_color}
                  onChange={handleChange}
                  placeholder="#000000"
                  error={errorsTextTertiaryColor}
                  className={`w-full ${
                    errorsTextTertiaryColor ? "border-red-500" : ""
                  }`}
                />
              </View>
            </View> */}
          </View>
        </View>
        </View>

        {/* Color Preview */}
        <View className="mt-8 p-6 border border-border rounded-lg">
          <Text as="h3" className="text-lg font-medium mb-4">
            Live Preview
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <View
              className="p-4 rounded-md flex flex-col items-center justify-center h-24 text-center border border-border"
              style={{
                backgroundColor: values?.primary_color,
                color: values?.text_primary_color,
              }}
            >
              <Text as="span" className="font-medium">
                Primary
              </Text>
              <Text as="span" className="text-xs mt-1">
                {values?.primary_color}
              </Text>
            </View>

            <View
              className="p-4 rounded-md flex flex-col items-center justify-center h-24 text-center border border-border"
              style={{
                backgroundColor: values?.secondary_color,
                color: values?.text_secondary_color,
              }}
            >
              <Text as="span" className="font-medium">
                Secondary
              </Text>
              <Text as="span" className="text-xs mt-1">
                {values?.secondary_color}
              </Text>
            </View>

            <View
              className="p-4 rounded-md flex flex-col items-center justify-center h-24 text-center border border-border"
              style={{
                backgroundColor: values?.tertiary_color,
                color: values?.text_tertiary_color,
              }}
            >
              <Text as="span" className="font-medium">
                Tertiary
              </Text>
              <Text as="span" className="text-xs mt-1">
                {values?.tertiary_color}
              </Text>
            </View>

            <View
              className="p-4 rounded-md flex flex-col items-center justify-center h-24 text-center border border-border"
              style={{
                backgroundColor: values?.bg_primary_color,
                color: values?.primary_color,
              }}
            >
              <Text as="span" className="font-medium">
                Primary BG
              </Text>
              <Text as="span" className="text-xs mt-1">
                {values?.bg_primary_color}
              </Text>
            </View>

            <View
              className="p-4 rounded-md flex flex-col items-center justify-center h-24 text-center border border-border"
              style={{
                backgroundColor: values?.bg_secondary_color,
                color: values?.secondary_color,
              }}
            >
              <Text as="span" className="font-medium">
                Secondary BG
              </Text>
              <Text as="span" className="text-xs mt-1">
                {values?.bg_secondary_color}
              </Text>
            </View>

            <View
              className="p-4 rounded-md flex flex-col items-center justify-center h-24 text-center border border-border"
              style={{
                backgroundColor: values?.bg_tertiary_color,
                color: values?.tertiary_color,
              }}
            >
              <Text as="span" className="font-medium">
                Tertiary BG
              </Text>
              <Text as="span" className="text-xs mt-1">
                {values?.bg_tertiary_color}
              </Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};
export default ColorSchemeSection;
