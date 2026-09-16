import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Upload from "@/components/Upload";
import useForm from "@/utils/custom-hooks/use-form";
import Button from "@/components/button";
import { toast } from "@/utils/custom-hooks/use-toast";
import { imageUpload } from "@/actions/calls/uesImage";
import { useAnaesthesia } from "@/actions/calls/ipd/anaesthesia";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
import FormSection from "../components/FormSection";
import { UploadIcon } from "lucide-react";
import Textarea from "@/components/Textarea";
import SingleSelector from "@/components/SingleSelector";

interface Props {
  readOnly?: boolean;
}

const ConsentForm: React.FC<Props> = ({ readOnly = false }) => {
  const { id: _id, pacId } = useParams<{ id: string; pacId?: string }>();
  const navigate = useNavigate();
  const { editAnaesthesiaHandler, anaesthesiaDetailHandler } = useAnaesthesia();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const anaesthesiaDetail = useSelector(
    (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
  ) as AnaesthesiaDetails | null;

  const { values, onSetHandler, handleChange } = useForm<any>(
    anaesthesiaDetail || {},
  );

  useEffect(() => {
    if (pacId) {
      anaesthesiaDetailHandler(pacId, () => {});
    }
    //  return () => {
    //       cleanUp();
    //       dispatch(clearAnaesthesiaDetailSlice());
    //     };
  }, []);

  const handleSubmit = async () => {
    if (!pacId) return;

    setIsSubmitting(true);

    editAnaesthesiaHandler(
      pacId,
      {
        ipd_id: anaesthesiaDetail?.ipd_id || "",
        ipd_surgery_id: anaesthesiaDetail?.ipd_surgery_id || "",
        operative_procedure: values?.operative_procedure,
        type_of_anaesthesia: values?.type_of_anaesthesia,
        consent_summary: values?.consent_summary,
      },
      (success) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Consent details saved successfully.",
            variant: "success",
          });
        } else {
          toast({
            title: "Error!",
            description: "Failed to save Consent details.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      },
    );

    if (values?.uploaded_consent_path instanceof File) {
      const uploadData = {
        id: pacId,
        modal_type: "ipd_anaesthesia",
        file_name: "uploaded_consent_path",
        folder_name: "ipd_anaesthesia",
        image: values.uploaded_consent_path,
      };

      imageUpload(uploadData, (uploadSuccess: boolean) => {
        if (uploadSuccess) {
          toast({
            title: "Success!",
            description: "Consent file uploaded successfully.",
            variant: "success",
          });
        } else {
          toast({
            title: "Error!",
            description: "Failed to upload Consent file.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }
      });
    }
  };

  return (
    <View className="space-y-6 mt-8 px-4">
      {/* Form Fields */}
      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
      <View>
        {/* <Input
          id="operative_procedure"
          name="operative_procedure"
          label="Operative Procedure"
          value={values?.operative_procedure || ""}
          onChange={handleChange}
          readOnly={readOnly}
          className="bg-white"
        /> */}
        {/* <Input
          id="type_of_anaesthesia"
          name="type_of_anaesthesia"
          label="Type of Anaesthesia"
          value={values?.type_of_anaesthesia || ""}
          onChange={handleChange}
          readOnly={readOnly}
          className="bg-white"
        /> */}
        <SingleSelector
          options={[
            {
              label: "Local",
              value: "local",
            },
            {
              label: "General",
              value: "general",
            },
            {
              label: "Spinal",
              value: "spinal",
            },
            {
              label: "Epidural",
              value: "epidural",
            },
            {
              label: "Nerve Block",
              value: "nerve_block",
            },
          ]}
          id="type_of_anaesthesia"
          name="type_of_anaesthesia"
          value={values?.type_of_anaesthesia || ""}
          onChange={(value) => onSetHandler("type_of_anaesthesia", value)}
          className="bg-white"
          placeholder="Select Type of Anaesthesia"
        />
      </View>

      {/* Upload Section */}
      <FormSection title="Upload Consent Form" icon={UploadIcon}>
        <Upload
          label="Upload Consent for Anaesthesia / Sedation Form"
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
          disabled={readOnly}
        />
      </FormSection>

      {/* <FormSection title="Consent Summary" icon={FileText}> */}
      <Textarea
        label="Consent Summary"
        name="consent_summary"
        value={values?.consent_summary || ""}
        onChange={handleChange}
        disabled={readOnly}
        // rows={4}
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Enter consent summary"
      />
      {/* </FormSection> */}

      {!readOnly && (
        <View className="flex justify-end gap-4">
          <Button variant="outline" onPress={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Consent Details"}
          </Button>
        </View>
      )}
    </View>
  );
};

export default ConsentForm;
