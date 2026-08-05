import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_DOWNLOAD_PDF_URL, IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import BouncingLoader from "@/components/BouncingLoader";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import { Card } from "@/components/ui/card";
import FormSection from "../pac/components/FormSection";
import useForm from "@/utils/custom-hooks/use-form";
import dayjs from "dayjs";
import {
  FileDown,
  User,
  Calendar,
  MapPin,
  Stethoscope,
  FileText,
  Activity,
  Syringe,
  Pill,
  AlertTriangle,
  FlaskConical,
  SendIcon,
} from "lucide-react";
import { useDischargeSummary } from "@/actions/calls/ipd/dischargeSummary";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { toast } from "@/utils/custom-hooks/use-toast";


// Dummy patient data - in real app, this would come from API/context
const patientData = {
  ip_no: "1193",
  patient_name: "KEERTHANA V",
  age: "34",
  sex: "F",
  mr_no: "2236",
  address:
    "226, 1ST PHASE, 40FEET ROAD, MANJUNATHNAGAR, WC ROAD BESIDE ROYAL ENGLISH SCHOOL, RAJAJINAGAR, BANGALORE-560010",
  admission_date: dayjs().subtract(1, "day").format("DD-MM-YYYY"),
  admission_time: "07:42 AM",
};

interface DischargeSummaryForm {
  // Editable fields
  discharge_date?: string;
  discharge_time?: string;
  doctor_incharge?: string;
  consultants?: string;
  diagnosis?: string;
  case_history_and_complaints?: string;
  general_examination?: string;
  systemic_examination?: string;
  investigations?: string;
  operation_done?: string;
  findings_and_procedure?: string;
  course_in_hospital?: string;
  patient_health_condition_at_discharge?: string;
  special_instruction?: string;
  advice_on_discharge?: string;
}

/**
 * Discharge Summary Page - Single form for creating discharge summaries
 * Modes:
 *  - create (new)   => /ipd/:id/discharge-summary/new
 *  - edit/view      => /ipd/:id/discharge-summary/:summaryId?mode=view|edit
 */
const DischargeSummaryPage: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dischargeSummaryDetail, updateDischargeSummary } = useDischargeSummary();
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } = useDownloadIpdPdf();
  const dischargeSummaryData = useSelector((state: RootState) => state.dischargeSummary.dischargeSummaryDetailData) as Partial<DischargeSummaryForm>
  const summaryId = dischargeSummaryData?.id as string;
  const mode = searchParams.get("mode") || (summaryId ? "edit" : "add");
  const [, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = () => {
    if (id) {
      fetchAndDownloadPdf(
        id,
        IPD_DOWNLOAD_PDF_URL,
        "discharge_summary",
        () => { }
      );
    }
  };

  const handleGeneratePdf = () => {
    if (id) {
      fetchAndDownloadPdf(
        id,
        IPD_GENERATE_PDF_URL,
        "discharge_summary",
        () => { }
      );
    }
  };
  const isViewMode = mode === "view";

  useEffect(() => {
    if (id) {
      dischargeSummaryDetail(id, () => { })
    }
  }, [])


  const { values, handleChange, onSetHandler } = useForm<DischargeSummaryForm>(
    dischargeSummaryData
  );

  // Initialize with default values
  useEffect(() => {
    if (!summaryId) {
      onSetHandler("discharge_date", dayjs().format("YYYY-MM-DD"));
      onSetHandler("discharge_time", "10:30");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dischargeSummaryFormObj: Partial<DischargeSummaryForm> = {};

    try {
      for (let [key, value] of formData.entries()) {
        dischargeSummaryFormObj[key as keyof DischargeSummaryForm] = value as any;
      }

      setErrors({});
      setIsSubmitting(true);

      if (id) {
        updateDischargeSummary(id, dischargeSummaryFormObj, (success: boolean) => {
          setIsSubmitting(false);
          if (success) {
            toast({
              title: "Success",
              description: "Discharge summary updated successfully",
              variant: "success",
            });

          } else {
            toast({
              title: "Error",
              description: "Failed to update discharge summary",
              variant: "destructive",
            });
          }
        });
      }
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.inner) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  // Info Item Component for readonly display
  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <View className="flex gap-2">
      <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 min-w-[140px]">
        {label}
      </Text>
      <Text className="text-sm text-slate-800 dark:text-slate-200">
        : {value}
      </Text>
    </View>
  );

  return (
    <View className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <View className="flex items-center justify-between gap-4">
        <View>
          <Text as="h1" className="text-2xl font-bold mb-1">
            {summaryId ? (mode === "view" ? "View" : "Edit") : "Create"}{" "}
            Discharge Summary
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            {summaryId
              ? `Discharge Summary #${summaryId}`
              : "Create a new discharge summary for the patient"}
          </Text>
        </View>
        <View className="flex gap-2">
          {summaryId && (
            <>
              <Button
                variant="outline"
                size="small"
                className="flex items-center gap-2"
                onPress={handleGeneratePdf}
                disabled={isPdfDownloading}
              >
                {isPdfDownloading ? <BouncingLoader isLoading={isPdfDownloading} /> : <FileDown className="w-4 h-4" />}
                Generate PDF
              </Button>
              {/* <Button
                variant="outline"
                size="small"
                className="flex items-center gap-2"
                onPress={handleDownload}
                disabled={isPdfDownloading}
              >
                {isPdfDownloading ? <BouncingLoader isLoading={isPdfDownloading} /> : <FileDown className="w-4 h-4" />}
                Download
              </Button> */}
            </>
          )}
          <Button variant="outline" size="small" onPress={() => navigate(-1)}>
            Back
          </Button>
        </View>
      </View>

      {/* Patient Information - Readonly */}
      <Card className="p-6">
        <View className="flex items-center gap-2 mb-4">
          <View className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </View>
          <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Patient Information
          </Text>
          <Text className="text-xs text-slate-500 ml-2">(Read Only)</Text>
        </View>

        <View className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <View className="space-y-3">
            <InfoItem label="I.P. No" value={patientData.ip_no} />
            <InfoItem label="Patient's Name" value={patientData.patient_name} />
            <InfoItem
              label="Age/Sex"
              value={`${patientData.age} / ${patientData.sex}`}
            />
            <InfoItem label="MR No" value={patientData.mr_no} />
          </View>

          {/* Right Column */}
          <View className="space-y-3">
            <InfoItem
              label="Admission Date & Time"
              value={`${patientData.admission_date} & ${patientData.admission_time}`}
            />
            <View className="flex gap-2">
              <View className="flex items-start gap-1">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Address
                </Text>
                <Text className="text-sm text-slate-800 dark:text-slate-200 mt-1">
                  {patientData.address}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>

      {/* Discharge & Doctor Details - Editable */}
      <form onSubmit={handleSubmit}>
        <FormSection title="Discharge & Doctor Details" icon={Calendar}>
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Discharge Date"
              name="discharge_date"
              type="date"
              value={values?.discharge_date || ""}
              onChange={handleChange}
              disabled={isViewMode}
              className="bg-white"
            />
            <Input
              label="Discharge Time"
              name="discharge_time"
              type="time"
              value={values?.discharge_time || ""}
              onChange={handleChange}
              disabled={isViewMode}
              className="bg-white"
            />
            <Input
              label="Doctor Incharge"
              name="doctor_incharge"
              value={values?.doctor_incharge || ""}
              onChange={handleChange}
              disabled={isViewMode}
              className="bg-white md:col-span-2"
              placeholder="e.g., Dr Ramesh Bhat / Dr Sachin Chavre"
            />
          </View>
          <View className="mt-4">
            <Textarea
              label="Consultants"
              name="consultants"
              value={values?.consultants || ""}
              onChange={handleChange}
              disabled={isViewMode}
              className="bg-white min-h-[80px]"
              placeholder="e.g., Dr Ramesh Bhat (Surgeon), Dr Sachin Chavre (Surgeon), Dr Vinay (Anaesthetist)"
            />
          </View>
        </FormSection>

        {/* Medical Details Section */}
        <FormSection title="Diagnosis" icon={FileText}>
          <Textarea
            name="diagnosis"
            value={values?.diagnosis || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter primary diagnosis..."
          />
        </FormSection>

        <FormSection title="Case History & Complaints" icon={Stethoscope}>
          <Textarea
            name="case_history_and_complaints"
            value={values?.case_history_and_complaints || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[120px]"
            placeholder="Enter patient's medical history and complaints..."
          />
        </FormSection>

        <FormSection title="General Examination" icon={Activity}>
          <Textarea
            name="general_examination"
            value={values?.general_examination || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter general examination findings (e.g., RS - B/L NVBS heard, CVS - S1 and S2 Heard, CNS - No neuromuscular deficit)..."
          />
        </FormSection>

        <FormSection title="Systemic Examination" icon={Activity}>
          <Textarea
            name="systemic_examination"
            value={values?.systemic_examination || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter systemic examination findings (e.g., P/R - Posterior sentinel tag +, DRE - Hypertonic Sphincter)..."
          />
        </FormSection>

        <FormSection title="Investigations" icon={FlaskConical}>
          <Textarea
            name="investigations"
            value={values?.investigations || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter investigation results (e.g., All reports enclosed and given to patient)..."
          />
        </FormSection>

        {/* Surgical Details Section */}
        <FormSection title="Operation Done" icon={Syringe}>
          <Textarea
            name="operation_done"
            value={values?.operation_done || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[120px]"
            placeholder="Enter surgical procedures performed (e.g., Ksharakarma, Agnikarma, Chedana)..."
          />
        </FormSection>

        <FormSection title="Findings And Procedure" icon={FileText}>
          <Textarea
            name="findings_and_procedure"
            value={values?.findings_and_procedure || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[120px]"
            placeholder="Enter detailed surgical findings and procedure description..."
          />
        </FormSection>

        {/* Discharge Information Section */}
        <FormSection title="Course In Hospital" icon={Activity}>
          <Textarea
            name="course_in_hospital"
            value={values?.course_in_hospital || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[120px]"
            placeholder="Enter the treatment timeline and course during hospitalization..."
          />
        </FormSection>

        <FormSection
          title="Patient's Health Condition at Discharge"
          icon={AlertTriangle}
        >
          <Textarea
            name="patient_health_condition_at_discharge"
            value={values?.patient_health_condition_at_discharge || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter current health status (e.g., General health condition is good with stable vitals and no bleeding at wound site)..."
          />
        </FormSection>

        {/* Medications Section */}
        <FormSection title="Advice On Discharge" icon={Pill}>
          <Textarea
            name="advice_on_discharge"
            value={values?.advice_on_discharge || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter advice on discharge..."
          />
          {/* <View className="rounded-lg">
            <MedicinesSection
              medicinesList={[]}
              medicineData={[]}
              onSetHandler={() => { }}
            />
          </View>

          <View className="mt-4 rounded-lg">
            <CombinationMedicineSection
              medicinesList={[]}
              combinationMedicineData={[]}
              onSetHandler={() => { }}
            />
          </View> */}
        </FormSection>

        {/* Special Instructions */}
        <FormSection title="Special Instructions" icon={AlertTriangle}>
          <Textarea
            name="special_instruction"
            value={values?.special_instruction || ""}
            onChange={handleChange}
            disabled={isViewMode}
            className="bg-white min-h-[100px]"
            placeholder="Enter any special instructions (e.g., Sitz bath twice daily for one month, P/R oiling once daily)..."
          />
        </FormSection>

        {/* Submit Button */}
        {!isViewMode && (
          // <Card className="p-4 mt-4 sticky bottom-4 bg-white dark:bg-slate-900 shadow-lg">
          <View className="flex justify-end gap-3">
            {/* <Button variant="outline" onPress={() => navigate(-1)}>
              Cancel
            </Button> */}
            <Button
              variant="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              className="flex justify-center items-center gap-2"
            >
              <SendIcon size={18} />
              Update Discharge Summary
            </Button>
          </View>
          // </Card>
        )}
      </form>
    </View>
  );
};

export default DischargeSummaryPage;
