import { RootState } from "@/actions/store";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Switch from "@/components/ui/switch";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";

const EmailWatsappNotification: React.FC<{}> = () => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );
  const { values, handleChange } = useForm(settingsData);
  const handleSwitchChange = (checked: boolean) => {
    handleChange({
      target: { name: "email_notification", value: String(checked) },
    } as any);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <View className="flex flex-col gap-2">
            <CardTitle>Email & Whatsapp Notification</CardTitle>
            <View className="flex items-center justify-between gap-2">
              <CardDescription>Enable email notifications </CardDescription>
              <Switch
                showIcons
                size="medium"
                variant="primary"
                labelPosition="right"
                id="email_notification"
                name="email_notification"
                onChange={handleSwitchChange}
                defaultChecked={values?.email_notification}
              />
            </View>
              <View className="flex items-center justify-between gap-2">
                <CardDescription className="text-black">Enable whatsapp notifications </CardDescription>
                <Switch
                  showIcons
                  size="medium"
                  variant="primary"
                  labelPosition="right"
                  id="whatsapp_notification"
                  name="whatsapp_notification"
                  onChange={handleSwitchChange}
                  defaultChecked={values?.whatsapp_notification}
                />
              </View>
          </View>
        </CardHeader>
      </Card>
    </>
  );
};

export default EmailWatsappNotification;
