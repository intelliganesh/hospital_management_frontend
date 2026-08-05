import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Upload from "@/components/Upload";
import Button from "@/components/button";
import { FileText, Upload as UploadIcon } from "lucide-react";
import FormSection from "@/pages/ipd/pac/components/FormSection";
import useForm from "@/utils/custom-hooks/use-form";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { SurgeryReportData } from "@/interfaces/ipd/surgeryProcedure/surgeryReport";
import { imageUpload } from "@/actions/calls/uesImage";
import { useAnaesthesia } from "@/actions/calls/ipd/anaesthesia";
import { AnaesthesiaDetails } from "@/interfaces/ipd/anaesthesia";
import { clearAnaesthesiaDetailSlice } from "@/actions/slices/ipd/anaesthesia/anaesthesia";
import Textarea from "@/components/Textarea";

interface Props {
  readOnly?: boolean;
}

const AnaesthesiaRecordForm: React.FC<Props> = ({ readOnly = false }) => {
  const { id: _id, pacId } = useParams<{ id: string; pacId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { editAnaesthesiaHandler, anaesthesiaDetailHandler, cleanUp } =
    useAnaesthesia();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const anaesthesiaDetail = useSelector(
    (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
  ) as AnaesthesiaDetails | null;

  const { values, onSetHandler, handleChange } =
    useForm<any>(anaesthesiaDetail);
  useEffect(() => {
    if (pacId) {
      anaesthesiaDetailHandler(pacId, () => {});
    }
    return () => {
      cleanUp();
    };
  }, []);

  const handleSubmit = async () => {
    if (!pacId) return;

    setIsSubmitting(true);

    editAnaesthesiaHandler(
      pacId,
      {
        ipd_id: anaesthesiaDetail?.ipd_id || "",
        ipd_surgery_id: anaesthesiaDetail?.ipd_surgery_id || "",
        anaesthesia_record_summary: values?.anaesthesia_record_summary,
      },
      (success) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Anaesthesia record saved successfully.",
            variant: "success",
          });
        } else {
          toast({
            title: "Error!",
            description: "Failed to save Anaesthesia Record.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      },
    );

    if (values?.uploaded_anaesthesia_record_path instanceof File) {
      const uploadData = {
        id: pacId,
        modal_type: "ipd_anaesthesia",
        file_name: "upload_anaesthesia_record_path",
        folder_name: "ipd_anaesthesia",
        image: values.uploaded_anaesthesia_record_path,
      };

      imageUpload(uploadData, (uploadSuccess: boolean) => {
        if (uploadSuccess) {
          toast({
            title: "Success!",
            description: "Anesthesia Record uploaded successfully.",
            variant: "success",
          });
        } else {
          toast({
            title: "Error!",
            description: "Failed to upload Anaesthesia Record file.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }
      });
    }
  };

  return (
    <View className="space-y-6">
      <FormSection title="Anaesthesia Record Form" icon={UploadIcon}>
        <Upload
          label="Upload Anaesthesia Record Form"
          name="uploaded_anaesthesia_record_path"
          multiple={false}
          maxCount={1}
          accept=".pdf,.jpg,.png,.jpeg,.webp"
          browseText="Upload Form"
          existingFiles={
            typeof values?.upload_anaesthesia_record_path === "string"
              ? values?.upload_anaesthesia_record_path
              : typeof values?.uploaded_anaesthesia_record_path === "string"
                ? values?.uploaded_anaesthesia_record_path
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

            onSetHandler("uploaded_anaesthesia_record_path", file);
          }}
          disabled={readOnly}
        />
      </FormSection>

      <FormSection title="Summary" icon={FileText}>
        <Textarea
          name="anaesthesia_record_summary"
          value={values?.anaesthesia_record_summary || ""}
          onChange={handleChange}
          id="anaesthesia_record_summary"
          label="Anesthesia Record Summary"
          placeholder="Enter Anesthesia Record summary"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </FormSection>

      {/* Submit Button — hidden in view/readOnly mode, matching PACFormPage's readOnly={mode === "view"} */}
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
            {isSubmitting ? "Submitting..." : "Submit Anaesthesia Record"}
          </Button>
        </View>
      )}
    </View>
  );
};

export default AnaesthesiaRecordForm;
