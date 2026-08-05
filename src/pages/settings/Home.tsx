import View from "@/components/view";
import TabView from "@/components/Tabs";
import SystemSettingsPage from "../systemSettings/Home";
import MedicineCategoryMappingPage from "../medicineCategoryMapping/medicineCategoryMappingPage";

const Settings: React.FC<{}> = () => {
  const tabs = [
    {
      value: "system-settings",
      label: "System Setting",
      content: (
          <SystemSettingsPage />
      ),
    },
    {
      value: "medicine-categories-mapping",
      label: "Medicine Categories Mapping",
      content: (
          <MedicineCategoryMappingPage />
      ),
    },
  ];
  return (
    <View className="p-4">
      <TabView tabs={tabs} defaultValue="system-settings" />
    </View>
  );
};
export default Settings;
