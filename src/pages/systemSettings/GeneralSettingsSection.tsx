import View from "@/components/view";
import Input from "@/components/input";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useEffect, useRef, useState } from "react";
import useForm from "@/utils/custom-hooks/use-form";
import { QrCode, Building, Upload } from "lucide-react";
import ImageComponent from "@/components/ui/ImageComponent";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Text from "@/components/text";
import Textarea from "@/components/Textarea";
import SingleSelector from "@/components/SingleSelector";
import {
  currencyOptions,
  currenySymbolsOptions,
} from "./systemSettingsOptions";

interface GeneralSettingsProps {
  errorsCurrency: string;
  errorsHospitalName: string;
  errorsCurrencySymbol: string;
  errorsAddress: string;
}

const GeneralSettingsSection: React.FC<GeneralSettingsProps> = ({
  errorsCurrency,
  errorsHospitalName,
  errorsCurrencySymbol,
  errorsAddress,
}) => {
  const settingsData = useSelector(
    (state: RootState) => state.systemSettings.settings
  );
  const logoInputRef = useRef<HTMLInputElement>(null);
  const letterHeaderInputRef = useRef<HTMLInputElement>(null);
  const qrCodeInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { values, handleChange, onSetHandler } = useForm(settingsData);
  const [letterHeaderPreview, setLetterHeaderPreview] = useState<string | null>(
    null
  );
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);

  useEffect(() => {
    setLogoPreview(import.meta.env.VITE_APP_URL + values?.hospital_logo);
    setLetterHeaderPreview(
      import.meta.env.VITE_APP_URL + values?.letter_header
    );
    setQrCodePreview(
      values?.qr_code ? import.meta.env.VITE_APP_URL + values?.qr_code : null
    );
  }, [values?.hospital_logo, values?.letter_header, values?.qr_code]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // handleChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLetterHeaderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // handleChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLetterHeaderPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Hospital Information</CardTitle>
        <CardDescription>
          Update your hospital details and global settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hospital Logo */}
        <View className="space-y-2">
          <Text as="label" className="text-sm font-medium">
            Hospital Logo
          </Text>
          <View className="flex items-start space-x-4">
            <View className="w-24 h-24 bg-neutral-100 rounded-md border border-neutral-300 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <ImageComponent
                  src={logoPreview}
                  alt="Logo preview"
                  className="object-contain w-full h-full"
                />
              ) : (
                <Building className="h-12 w-12 text-neutral-400" />
              )}
            </View>
            <View className="space-y-2">
              <Button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                variant="ghost"
                className="flex items-center gap-1.5 relative border border-neutral-300 hover:bg-neutral-100 text-xs dark:hover:bg-primary dark:hover:border-primary dark:shadow-md"
              >
                <View>
                  <Upload className="h-4 w-4 cusor-pointer" />
                </View>
                <View>
                  Upload Logo
                  <Input
                    type="file"
                    ref={logoInputRef}
                    name="hospital_logo"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </View>
              </Button>
              {/* <p className="text-xs text-text-light">
                Recommended size: 400x400px. Max file size: 2MB.
              </p> */}
            </View>
          </View>
        </View>
        <View className="space-y-2">
          <Text as="label" className="text-sm font-medium">
            Hospital Letter Header
          </Text>
          <View className="">
            <View className="w-full h-32 bg-neutral-100 rounded-md border border-neutral-300 flex items-center justify-center overflow-hidden">
              {letterHeaderPreview ? (
                <ImageComponent
                  src={letterHeaderPreview}
                  alt="Logo preview"
                  className="object-contain w-full h-full"
                />
              ) : (
                <Building className="h-12 w-12 text-neutral-400" />
              )}
            </View>
            <View className="space-y-2 mt-4 w-full">
              <Button
                type="button"
                onClick={() => letterHeaderInputRef.current?.click()}
                variant="ghost"
                className="flex w-full justify-center items-center gap-1.5 relative border border-neutral-300 hover:bg-neutral-100 text-xs dark:hover:bg-primary dark:hover:border-primary dark:shadow-md"
              >
                <View className="flex items-center justify-center">
                  <Upload className="h-4 w-4 cusor-pointer" />
                </View>
                <View>
                  Upload Letter Header
                  <Input
                    type="file"
                    ref={letterHeaderInputRef}
                    name="letter_header"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleLetterHeaderChange}
                  />
                </View>
              </Button>
              {/* <p className="text-xs text-text-light">
                Recommended size: 400x400px. Max file size: 2MB.
              </p> */}
            </View>
          </View>
        </View>

        {/* QR Code Upload */}
        <View className="space-y-2">
          <Text as="label" className="text-sm font-medium">
            QR Code
          </Text>
          <View className="flex items-start space-x-4">
            <View className="w-24 h-24 bg-neutral-100 rounded-md border border-neutral-300 flex items-center justify-center overflow-hidden">
              {qrCodePreview ? (
                <ImageComponent
                  src={qrCodePreview}
                  alt="QR Code preview"
                  className="object-contain w-full h-full"
                />
              ) : (
                <QrCode className="h-12 w-12 text-neutral-400" />
              )}
            </View>
            <View className="space-y-2">
              <Button
                type="button"
                onClick={() => qrCodeInputRef.current?.click()}
                variant="ghost"
                className="flex items-center gap-1.5 relative border border-neutral-300 hover:bg-neutral-100 text-xs dark:hover:bg-primary dark:hover:border-primary dark:shadow-md"
              >
                <View>
                  <Upload className="h-4 w-4 cusor-pointer" />
                </View>
                <View>
                  Upload QR Code
                  <Input
                    type="file"
                    ref={qrCodeInputRef}
                    name="qr_code"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleQrCodeChange}
                  />
                </View>
              </Button>
            </View>
          </View>
        </View>

        <View className="space-y-2">
          <Textarea
            name="billing_letter_header"
            value={values?.billing_letter_header}
            onChange={handleChange}
            label="Billing Letter Header"
            placeholder="Enter Billing Letter Header  ..."
          />
        </View>
        <View className="space-y-2">
          <Textarea
            name="footer_content"
            value={values?.footer_content}
            onChange={handleChange}
            label="Footer Content"
            placeholder="Enter Billing Letter Header  ..."
          />
        </View>
        <input type="hidden" name="id" value={values?.id ?? "NA"} />

        {/* Hospital Name */}
        <View className="space-y-2">
          <Text as="label" className="text-sm font-medium">
            Hospital Name
          </Text>
          <Input
            id="hospital_name"
            name="hospital_name"
            onChange={handleChange}
            error={errorsHospitalName}
            value={values?.hospital_name || ""}
            placeholder="Enter hospital name"
          // readOnly={values?.hospital_name ? true : false}
          />
          <Text as="p" className="text-xs text-text-light">
            This name will appear on reports, invoices, and the system header.
          </Text>
        </View>
        <View>
          <Text as="label" className="text-sm font-medium">
            Address
          </Text>
          <Textarea
            id="address"
            name="address"
            required={true}
            onChange={handleChange}
            error={errorsAddress}
            value={values?.address || ""}
            placeholder="Enter address"
          />
        </View>

        {/* Currency Settings */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Currency
            </Text>
            {/* <Input
              id="currency"
              name="currency"
              placeholder="USD"
              error={errorsCurrency}
              onChange={handleChange}
              value={values?.currency}
            /> */}
            <SingleSelector
              id="currency"
              // label="Currency"
              name="currency"
              value={values?.currency || ""}
              placeholder="Select Currency"
              onChange={(value) => {
                onSetHandler("currency", value?.value);
              }}
              options={currencyOptions}
              error={errorsCurrency}
            />
          </View>

          <View className="space-y-2">
            <Text as="label" className="text-sm font-medium">
              Currency Symbol
            </Text>
            {/* <Input
              placeholder="$"
              id="currency_symbol"
              name="currency_symbol"
              onChange={handleChange}
              error={errorsCurrencySymbol}
              value={values?.currency_symbol}
            /> */}
            <SingleSelector
              id="currency_symbol"
              // label="Currency Symbol"
              name="currency_symbol"
              value={values?.currency_symbol || ""}
              placeholder="Select Currency Symbol"
              onChange={(value) => {
                onSetHandler("currency_symbol", value?.value);
              }}
              options={currenySymbolsOptions}
              error={errorsCurrencySymbol}
            />
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsSection;
