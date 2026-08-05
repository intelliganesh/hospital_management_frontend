import { Save } from "lucide-react";
import View from "@/components/view";
import Text from "@/components/text";
import React, { useState } from "react";
import Button from "@/components/button";
import PrefixesSection from "./PrefixesSection";
import { useColors } from "@/contexts/ColorContext";
import ColorSchemeSection from "./ColorSchemeSection";
import { validationSchema } from "./validationSchema";
import { UploadImageProps } from "@/interfaces/image";
import { toast } from "@/utils/custom-hooks/use-toast";
import { imageUpload } from "@/actions/calls/uesImage";
import ThemeSettingSection from "./ThemeSettingSection";
import { SystemSettings } from "@/interfaces/systemSettings";
import GeneralSettingsSection from "./GeneralSettingsSection";
import { useSystemSettings } from "@/actions/calls/systemSettings";
import { formSubmissionFailMessage } from "@/utils/helperFunctions";
import EmailWatsappNotification from "./EmailWatsappNotification";

const SystemSettingsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startNumbersVariables = [
    "invoice_start_number",
    "opd_start_number",
    "ipd_start_number",
    "patient_start_number",
    "appointment_start_number",
    "payment_start_number",
    "test_start_number",
  ];

  const statusVariables = [
    "invoice_status",
    "opd_status",
    "ipd_status",
    "patient_status",
    "appointment_status",
    "payment_status",
    "test_status",
  ];
  const { colors } = useColors();
  const { getSystemSettings, editOrAddSystemSetting } = useSystemSettings();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form data using Yup
      const formData = new FormData(e.currentTarget);
      let logoFile: File | null = null;
      let letterHeaderFile: File | null = null;
      let qrCodeFile: File | null = null;

      const systemSettingsObj: Partial<SystemSettings> = {};
      for (const [key, value] of formData.entries()) {
        // Cast to any to avoid TypeScript errors with complex types
        // (systemSettingsObj as any)[key] = value;
        if (formData.get("email_notification") === "on") {
          (systemSettingsObj as any)["email_notification"] = true;
        } else {
          (systemSettingsObj as any)["email_notification"] = false;
        }
        if (key === "hospital_logo" && value instanceof File) {
          if (value.size > 0) {
            logoFile = value;
          }
        } else if (key === "letter_header" && value instanceof File) {
          if (value.size > 0) {
            letterHeaderFile = value;
          }
        } else if (key === "qr_code" && value instanceof File) {
          if (value.size > 0) {
            qrCodeFile = value;
          }
        } else {
          (systemSettingsObj as any)[key] = value;
        }

        if (startNumbersVariables.includes(key) && value) {
          (systemSettingsObj as any)[key] = Number(value);
        }
        // if (key === "invoice_start_number"  && value) {
        //   (systemSettingsObj as any)[key] = Number(value);
        // }

        if (statusVariables.includes(key)) {
          (systemSettingsObj as any)[key] = value === "true" ? true : false;
        }
        // if (key === "invoice_status" ) {
        //   (systemSettingsObj as any)["invoice_status"] =
        //     value === "true" ? true : false;
        // }
      }

      await validationSchema.validate(systemSettingsObj, { abortEarly: false });
      setIsSubmitting(true);
      setErrors({});

      // Add color values from the ColorContext
      Object.entries(colors).forEach(([key, value]) => {
        if (!(key in systemSettingsObj)) {
          // Cast to any to avoid TypeScript errors with complex types
          (systemSettingsObj as any)[key] = value;
        }
      });

      if ("hospital_logo" in systemSettingsObj) {
        delete systemSettingsObj.hospital_logo;
      }
      if ("letter_header" in systemSettingsObj) {
        delete systemSettingsObj.letter_header;
      }
      if ("qr_code" in systemSettingsObj) {
        delete systemSettingsObj.qr_code;
      }

      editOrAddSystemSetting(systemSettingsObj, (success, response) => {
        setIsSubmitting(false);
        if (success && response?.data?.id) {
          getSystemSettings();
          if (logoFile && typeof logoFile !== "string") {
            const imageUploaddata: UploadImageProps = {
              id: response?.data?.id,
              modal_type: "system_settings",
              file_name: "hospital_logo",
              folder_name: "hospital_image",
              image: logoFile,
            };
            imageUpload(imageUploaddata, (uploadSuccess, _) => {
              if (!uploadSuccess) {
                // toast({
                //   title: "Error!",
                //   description: "Failed to upload image",
                //   variant: "destructive",
                // });
              }
            });
          }
          if (letterHeaderFile && typeof letterHeaderFile !== "string") {
            const letterHeaderImageUploaddata: UploadImageProps = {
              id: response?.data?.id,
              modal_type: "system_settings",
              file_name: "letter_header",
              folder_name: "hospital_letter_header_image",
              image: letterHeaderFile,
            };
            imageUpload(letterHeaderImageUploaddata, (uploadSuccess, _) => {
              if (!uploadSuccess) {
                // toast({
                //   title: "Error!",
                //   description: "Failed to upload letter header image",
                //   variant: "destructive",
                // });
              }
            });
          }
          if (qrCodeFile && typeof qrCodeFile !== "string") {
            const qrCodeImageUploaddata: UploadImageProps = {
              id: response?.data?.id,
              modal_type: "system_settings",
              file_name: "qr_code",
              folder_name: "hospital_image",
              image: qrCodeFile,
            };
            imageUpload(qrCodeImageUploaddata, (uploadSuccess, _) => {
              if (!uploadSuccess) {
                // toast
              }
            });
          }
          toast({
            title: "Settings saved",
            description: "Your system settings have been updated successfully.",
            variant: "success",
          });
        } else {
          // toast({
          //   title: "Error!",
          //   description: "Failed to update settings",
          //   variant: "destructive",
          // });
        }
      });
    } catch (err: any) {
      setIsSubmitting(false);
      if (err.inner) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          if (e.path) errors[e.path] = e.message;
        });
        setErrors(errors);
        formSubmissionFailMessage();
        // toast({
        //   title: "Error!",
        //   description: "Something went wrong! Please check your input fields.",
        //   variant: "destructive",
        // });
      }
    }
  };

  return (
    <React.Fragment>
      <View className="space-y-6">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT"
          >
            System Settings
          </Text>
          <Text as="p" className="text-text-light">
            Customize your hospital management system
          </Text>
        </View>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          encType="multipart/form-data"
        >
          {/* General Settings Section */}
          <GeneralSettingsSection
            errorsAddress={errors.address}
            errorsCurrency={errors.currency}
            errorsHospitalName={errors.hospital_name}
            errorsCurrencySymbol={errors.currency_symbol}
          />
          {/* Prefixes Section */}
          <PrefixesSection
            errorsIpdPrefix={errors.ipd_prefix}
            errorsOpdPrefix={errors.opd_prefix}
            errorsTestPrefix={errors.test_prefix}
            errorsPatientPrefix={errors.patient_prefix}
            errorsPaymentPrefix={errors.payment_prefix}
            errorsInvoicePrefix={errors.invoice_prefix}
            errorsHospitalPrefix={errors.hospital_prefix}
            // errorsFindingsPrefix={errors.findings_prefix}
            errorsAppointmentPrefix={errors.appointment_prefix}
            errorsInvoiceStartNumber={errors.invoice_start_number}
            errorsInvoiceStatus={errors.invoice_status}
            errorsVoucherPrefix={errors.voucher_prefix}
            errorsVoucherStartNumber={errors.voucher_start_number}
            errorsVoucherStatus={errors.voucher_status}
            errorsWardPrefix={errors.ward_prefix}
            errorsRoomPrefix={errors.room_prefix}
            errorsBedPrefix={errors.bed_prefix}
          />

          {/* Theme Settings */}
          <ThemeSettingSection errorsTheme={errors.theme} />
          <EmailWatsappNotification />

          {/* Color Scheme */}
          <ColorSchemeSection
            errorsPrimaryColor={errors.primary_color}
            errorsTertiaryColor={errors.tertiary_color}
            errorsSecondaryColor={errors.secondary_color}
            errorsBgPrimaryColor={errors.bg_primary_color}
            errorsBgTertiaryColor={errors.bg_tertiary_color}
            errorsBgSecondaryColor={errors.bg_secondary_color}
            errorsTextPrimaryColor={errors.text_primary_color}
            errorsTextTertiaryColor={errors.text_tertiary_color}
            errorsTextSecondaryColor={errors.text_secondary_color}
          />

          <View className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5"
              onPress={() => handleSubmit}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </View>
        </form>
      </View>
    </React.Fragment>
  );
};

export default SystemSettingsPage;
