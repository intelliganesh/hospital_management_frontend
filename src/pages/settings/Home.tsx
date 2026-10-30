import View from "@/components/view";
import TabView from "@/components/Tabs";
import SystemSettingsPage from "../systemSettings/Home";
import MedicineCategoryMappingPage from "../medicineCategoryMapping/medicineCategoryMappingPage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Settings: React.FC<{}> = () => {
  const tabs = [
    {
      value: "system-settings",
      label: "System Setting",
      content: <SystemSettingsPage />,
    },
    {
      value: "medicine-categories-mapping",
      label: "Medicine Categories Mapping",
      content: <MedicineCategoryMappingPage />,
    },
  ];
  return (
    <View className="">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <View className="p-4">
        <TabView tabs={tabs} defaultValue="system-settings" />
      </View>
    </View>
  );
};
export default Settings;
