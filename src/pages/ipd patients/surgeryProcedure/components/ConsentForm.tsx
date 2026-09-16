import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Textarea from "@/components/Textarea";
import Upload from "@/components/Upload";
import Button from "@/components/button";
import FormSection from "@/pages/ipd/pac/components/FormSection";
import { FileText, Upload as UploadIcon } from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { SurgeryReportData } from "@/interfaces/ipd/surgeryProcedure/surgeryReport";
import { imageUpload } from "@/actions/calls/uesImage";

interface ConsentFormData {
  consent_summary?: string;
  uploaded_consent_path?: any;
}

const ConsentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateConsentForm, surgeryReportDetail } = useSurgeryReport();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const surgeryReportData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryReportDetailData,
  );

  const { values, handleChange, onSetHandler } =
    useForm<SurgeryReportData>(surgeryReportData);

  useEffect(() => {
    if (id) {
      surgeryReportDetail(id, () => {});
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;

    setIsSubmitting(true);

    const payload: Partial<ConsentFormData> = {
      consent_summary: values?.consent_summary,
    };

    // STEP 1: Update summary only
    await updateConsentForm(id, payload, (success: boolean) => {
      if (success) {
        toast({
          title: "Success!",
          description: "Consent Form updated successfully.",
          variant: "success",
        });

        // STEP 2: Upload file separately (same pattern as SurgeryReport)
        if (values?.uploaded_consent_path) {
          const uploadData = {
            id,
            modal_type: "ipd_surgery",
            file_name: "uploaded_consent_path",
            folder_name: "ipd_surgery",
            image: values.uploaded_consent_path,
          };

          imageUpload(uploadData, (uploadSuccess: boolean) => {
            if (uploadSuccess) {
              toast({
                title: "Success!",
                description: "Consent file uploaded successfully.",
                variant: "success",
              });
            }
          });
        }
      } else {
        toast({
          title: "Error!",
          description: "Failed to update Consent Form",
          variant: "destructive",
        });
      }

      setIsSubmitting(false);
    });
  };

  return (
    <View className="space-y-6">
      {/* Summary */}
      <FormSection title="Summary" icon={FileText}>
        <Textarea
          id="consent_summary"
          name="consent_summary"
          label="Summary"
          value={values?.consent_summary || ""}
          onChange={handleChange}
          className="bg-white min-h-[100px]"
          placeholder="Enter summary of the consent form..."
        />
      </FormSection>

      {/* Upload Section */}
      <FormSection title="Upload Consent Form" icon={UploadIcon}>
        <Upload
          label="Upload Filled Consent Form"
          name="uploaded_consent_path"
          multiple={false}
          maxCount={1}
          accept=".pdf,.jpg,.png,.jpeg,.webp"
          browseText="Upload Form"
          existingFiles={
            typeof values?.uploaded_consent_path === "string"
              ? values?.uploaded_consent_path
              : ""
          }
          onChange={(fileList: any) => {
            let file: any = null;

            if (Array.isArray(fileList) && fileList.length > 0) {
              const item = fileList[0];

              if (item?.file instanceof File) {
                file = item.file;
              } else if (item instanceof File) {
                file = item;
              }
            }

            onSetHandler("uploaded_consent_path", file);
          }}
        />
      </FormSection>

      {/* Submit Button */}
      <View className="flex justify-end gap-4">
        <Button variant="outline" onPress={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Consent Form"}
        </Button>
      </View>
    </View>
  );
};

export default ConsentForm;
