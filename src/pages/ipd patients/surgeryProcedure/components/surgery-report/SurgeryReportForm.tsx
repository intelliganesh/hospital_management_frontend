import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import Textarea from "@/components/Textarea";
import Upload from "@/components/Upload";
import Button from "@/components/button";
import FormSection from "@/pages/ipd/pac/components/FormSection";
import { FileText, Users, Stethoscope, ClipboardList, BookOpen } from "lucide-react";
import MultiSelector from "@/components/MultiSelector";
import { useShloka } from "@/actions/calls/shloka";
import useForm from "@/utils/custom-hooks/use-form";
import { useParams, useNavigate } from "react-router-dom";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import { useToast } from "@/utils/custom-hooks/use-toast";
import { SurgeryReportData } from "@/interfaces/ipd/surgeryProcedure/surgeryReport";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { imageUpload } from "@/actions/calls/uesImage";
import dayjs from "dayjs";
import { useOpd } from "@/actions/calls/opd";
import { useDepartment } from "@/actions/calls/department";

interface Props {
  readOnly?: boolean;
}

const SurgeryReportForm: React.FC<Props> = ({ readOnly = false }) => {
  const { id: surgeryId } = useParams();
  const navigate = useNavigate();
  const { updateSurgeryReport, surgeryReportDetail } = useSurgeryReport();
  const { PuaListHandler } = useOpd();
  const { departmentDropdownHandler } = useDepartment();
  const { shlokaDropdownHandler } = useShloka();
  const [shlokaError, setShlokaError] = useState<string>("");
  const { toast } = useToast();

  const surgeryReportData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryReportDetailData,
  );
  const doctors = useSelector((state: RootState) => state.opd.userList)
    ?.filter((doctor: any) => doctor.role === "Doctor");
  const doctorList = doctors?.map((doctor: any) => ({
    label: doctor.name,
    value: doctor.name,
  }));
  const surgeonDoctorList = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));
  const nurseList = useSelector((state: RootState) => state.opd.allUserList)
    ?.filter((nurse: any) => nurse.role === "Nurse")
    ?.map((nurse: any) => ({
      label: nurse.name,
      value: nurse.name,
    }));
  const departmentList = useSelector(
    (state: RootState) => state.department.departmentDropdownData,
  )?.map((department: any) => ({
    label: department.name,
    value: department.name,
  }));

  const shlokaDropdownData = useSelector(
    (state: RootState) => state.shloka.shlokaDropdownData,
  );

  const { values, handleChange, onSetHandler } =
    useForm<SurgeryReportData>(surgeryReportData);

  // Selected shloka ids: edited value, else the ids already saved on the surgery.
  const selectedShlokaIds: number[] =
    values?.shloka_ids ??
    (Array.isArray(values?.shloka_data)
      ? values.shloka_data.map((s: any) => s.id)
      : []);

  // Active masters + any saved shloka that is no longer active/available, so it still shows.
  const shlokaOptions = [
    ...(Array.isArray(shlokaDropdownData) ? shlokaDropdownData : []).map(
      (s: any) => ({ label: s.title, value: s.id }),
    ),
    ...(Array.isArray(values?.shloka_data) ? values.shloka_data : [])
      .filter(
        (s: any) =>
          !(Array.isArray(shlokaDropdownData) ? shlokaDropdownData : []).some(
            (m: any) => m.id === s.id,
          ),
      )
      .map((s: any) => ({ label: s.title, value: s.id })),
  ];

  useEffect(() => {
    if (surgeryId) {
      surgeryReportDetail(surgeryId, () => {});
    }
  }, []);

  useEffect(() => {
    PuaListHandler(() => {});
    departmentDropdownHandler(() => {});
    shlokaDropdownHandler(() => {});
  }, []);

  const toDateTimeInputValue = (value?: string) => {
    if (!value) return "";

    const parsedValue = dayjs(value);
    return parsedValue.isValid() ? parsedValue.format("YYYY-MM-DDTHH:mm") : "";
  };

  const toApiDateTime = (value?: string) => {
    if (!value) return "";

    const parsedValue = dayjs(value);
    return parsedValue.isValid()
      ? parsedValue.format("YYYY-MM-DD HH:mm:ss")
      : value;
  };

  const selectedSurgeonDoctorId =
    values?.doctor_id ||
    doctors?.find((doctor: any) => doctor.name === values?.surgeon)?.id ||
    "";

  const handleSubmit = async () => {
    if (!surgeryId) return;

    if (selectedShlokaIds.length === 0) {
      setShlokaError("Please select at least one Shloka");
      toast({
        title: "Error",
        description: "Please select at least one Shloka",
        variant: "destructive",
      });
      return;
    }
    setShlokaError("");

    const payload: any = {
      ...values,
      surgery_report: 1,
      shloka_ids: selectedShlokaIds,
      doctor_id: selectedSurgeonDoctorId,
      surgery_start_datetime: toApiDateTime(values?.surgery_start_datetime),
      surgery_end_datetime: toApiDateTime(values?.surgery_end_datetime),
    };
    delete payload.uploaded_report_path; // remove file
    delete payload.shloka_data; // server rebuilds it from shloka_ids

    await updateSurgeryReport(surgeryId, payload, (success: boolean) => {
      if (success) {
        surgeryReportDetail(surgeryId, () => {});
        toast({
          title: "Success",
          description: "Surgery report submitted successfully",
        });

        // STEP 2: Upload file separately
        if (values?.uploaded_report_path) {
          const uploadData = {
            id: surgeryId,
            modal_type: "ipd_surgery",
            file_name: "uploaded_report_path",
            folder_name: "ipd_surgery",
            image: values.uploaded_report_path,
          };

          imageUpload(uploadData, (uploadSuccess: boolean) => {
            if (uploadSuccess) {
              toast({
                title: "Success",
                description: "Report file uploaded successfully",
              });
            }
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to submit surgery report",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <View className="space-y-6">
      {/* Shloka */}
      <FormSection title="Shloka" icon={BookOpen}>
        <MultiSelector
          name="shloka_ids"
          label="Shloka"
          required
          value={selectedShlokaIds}
          options={shlokaOptions}
          placeholder="Select Shloka"
          disabled={readOnly}
          error={shlokaError}
          onChange={(vals: any) => {
            onSetHandler("shloka_ids", Array.isArray(vals) ? vals : []);
            setShlokaError("");
          }}
        />
      </FormSection>

      {/* Basic Information */}
      <FormSection title="Basic Information" icon={FileText}>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="surgery_name"
            name="surgery_name"
            label="Surgery Name"
            value={values?.surgery_name || ""}
            onChange={handleChange}
            disabled={readOnly}
            placeholder="e.g., Appendectomy"
          />
          <Input
            id="surgery_date"
            name="surgery_date"
            label="Surgery Date"
            type="date"
            value={values?.surgery_date || ""}
            onChange={handleChange}
            disabled={readOnly}
          />
          <Input
            id="status"
            name="status"
            label="Status"
            value={values?.status || ""}
            onChange={handleChange}
            disabled={readOnly}
            placeholder="e.g., Completed"
          />
          <SingleSelector
            id="department"
            name="department"
            label="Department"
            value={values?.department || ""}
            onChange={(value) => onSetHandler("department", value)}
            options={departmentList}
            disabled={readOnly}
            placeholder="Select Department"
          />
        </View>
      </FormSection>

      {/* Timing Details */}
      <FormSection title="Surgery Timing" icon={ClipboardList}>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="surgery_start_datetime"
            name="surgery_start_datetime"
            label="Surgery Start Date & Time"
            type="datetime-local"
            value={toDateTimeInputValue(
              values?.surgery_start_datetime || values?.surgery_date,
            )}
            onChange={handleChange}
            disabled={readOnly}
          />
          <Input
            id="surgery_end_datetime"
            name="surgery_end_datetime"
            label="Surgery End Date & Time"
            type="datetime-local"
            value={toDateTimeInputValue(values?.surgery_end_datetime)}
            onChange={handleChange}
            disabled={readOnly}
          />
        </View>
      </FormSection>

      {/* Medical Team */}
      <FormSection title="Medical Team" icon={Users}>
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelector
            id="surgeon"
            name="doctor_id"
            label="Doctor"
            value={selectedSurgeonDoctorId}
            onChange={(value) => {
              const selectedDoctor = doctors?.find(
                (doctor: any) => String(doctor.id) === String(value),
              );
              onSetHandler("doctor_id", value);
              onSetHandler("surgeon", selectedDoctor?.name || "");
            }}
            options={surgeonDoctorList}
            disabled={readOnly}
            placeholder="Select Doctor"
          />
          <SingleSelector
            id="assistant_surgeon"
            name="assistant_surgeon"
            label="Assistant Surgeon"
            value={values?.assistant_surgeon || ""}
            onChange={(value) => onSetHandler("assistant_surgeon", value)}
            options={doctorList}
            disabled={readOnly}
            placeholder="Select Assistant Surgeon"
          />
          <SingleSelector
            id="anaesthetist"
            name="anaesthetist"
            label="Anaesthetist"
            value={values?.anaesthetist || ""}
            onChange={(value) => onSetHandler("anaesthetist", value)}
            options={doctorList}
            disabled={readOnly}
            placeholder="Select Anaesthetist"
          />
          <Input
            name="external_anaesthetist"
            label="External Anaesthetist"
            value={values?.external_anaesthetist || ""}
            onChange={handleChange}
            disabled={readOnly}
            placeholder="Enter External Anaesthetist"
          />
          <SingleSelector
            id="scrub_nurse"
            name="scrub_nurse"
            label="Scrub Nurse"
            value={values?.scrub_nurse || ""}
            onChange={(value) => onSetHandler("scrub_nurse", value)}
            options={nurseList}
            disabled={readOnly}
            placeholder="Select Scrub Nurse"
          />
        </View>
      </FormSection>

      {/* Operative Details */}
      <FormSection title="Operative Details" icon={Stethoscope}>
        <View className="space-y-4">
          <Input
            id="specimen_for_hpe"
            name="specimen_for_hpe"
            label="Specimen For HPE"
            value={values?.specimen_for_hpe || ""}
            onChange={handleChange}
            disabled={readOnly}
            placeholder="e.g., Appendix"
          />
          <Textarea
            id="operative_notes"
            name="operative_notes"
            label="Operative Notes"
            value={values?.operative_notes || ""}
            onChange={handleChange}
            disabled={readOnly}
            className="bg-white min-h-[120px]"
            placeholder="Enter operative notes..."
          />
          <Textarea
            id="operative_findings"
            name="operative_findings"
            label="Operative Findings"
            value={values?.operative_findings || ""}
            onChange={handleChange}
            disabled={readOnly}
            className="bg-white min-h-[100px]"
            placeholder="Enter operative findings..."
          />
          <Textarea
            id="post_operative_instructions"
            name="post_operative_instructions"
            label="Post Operative Instructions"
            value={values?.post_operative_instructions || ""}
            onChange={handleChange}
            disabled={readOnly}
            className="bg-white min-h-[120px]"
            placeholder="Enter post-operative instructions..."
          />
        </View>
      </FormSection>

      {/* Summary */}
      <FormSection title="Summary" icon={FileText}>
        <Textarea
          id="summary"
          name="summary"
          label="Summary"
          value={values?.summary || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter summary of the surgery report..."
        />
      </FormSection>

      {/* Upload Section */}
      <FormSection title="Upload Surgery Report" icon={FileText}>
        <Upload
          label="Upload Filled Surgery Report"
          name="uploaded_report_path"
          multiple={false}
          maxCount={1}
          accept=".pdf,.jpg,.png,.jpeg,.webp"
          browseText="Upload Form"
          existingFiles={
            typeof values?.uploaded_report_path === "string"
              ? values?.uploaded_report_path
              : Array.isArray(values?.uploaded_report_path) &&
                  values?.uploaded_report_path.length > 0
                ? values?.uploaded_report_path
                    .filter((item: any) => typeof item === "string")
                    .join(",")
                : ""
          }
          onChange={(fileList: any) => {
            let file: any = null;

            if (Array.isArray(fileList) && fileList.length > 0) {
              const item = fileList[0];

              if (item?.file instanceof File) {
                file = item.file; // normal upload case
              } else if (item instanceof File) {
                file = item; // direct file case
              }
            }

            console.log("Selected File =>", file);

            onSetHandler("uploaded_report_path", file);
          }}
        />
      </FormSection>

      {/* Submit Button */}
      <View className="flex justify-end gap-4">
        <Button variant="outline" onPress={handleCancel} disabled={readOnly}>
          Cancel
        </Button>
        <Button variant="primary" onPress={handleSubmit} disabled={readOnly}>
          Submit Surgery Report
        </Button>
      </View>
    </View>
  );
};

export default SurgeryReportForm;
