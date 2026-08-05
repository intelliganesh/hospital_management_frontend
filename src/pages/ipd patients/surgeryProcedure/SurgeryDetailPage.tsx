import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import TabView from "@/components/Tabs";
import {
  FileDown,
  Edit,
  ArrowLeft
} from "lucide-react";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import BouncingLoader from "@/components/BouncingLoader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import { usePreOperativeChecklist } from "@/actions/calls/ipd/surgeryProcedure/preOperativeChecklist";
import { useIpdPatients } from "@/actions/calls/ipd";
import { clearSurgeryReportDetailSlice } from "@/actions/slices/ipd/surgeryProcedure/surgeryReport";
import { clearPreOperativeChecklistDetailSlice } from "@/actions/slices/ipd/surgeryProcedure/preOperativeChecklist";
import { clearIpdPatientDetailDataSlice } from "@/actions/slices/ipd/ipdEnrollment";
import Modal from "@/components/Modal";
import dayjs from "dayjs";

import SurgeryConsentTab from "./components/SurgeryConsentTab";
import PreOpChecklistTab from "./components/PreOpChecklistTab";
import SurgeryReportTab from "./components/SurgeryReportTab";
import ReadOnlyField from "@/pages/ipd/pac/components/ReadOnlyField";

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <View className="flex items-center gap-3 mb-6">
    <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">
      {label}
    </Text>
    <View className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
  </View>
);

const SurgeryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // surgery_id
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();
  const { surgeryReportDetail, cleanUp: cleanSurgeryReport } =
    useSurgeryReport();
  const { preOperativeChecklistDetail, cleanUp: cleanPreOpChecklist } =
    usePreOperativeChecklist();
  const { ipdPatientDetailHandler, cleanUp: cleanIpdPatients } =
    useIpdPatients();

  const surgeryReportData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryReportDetailData,
  );

  const checklistDetailData = useSelector(
    (state: RootState) =>
      state.preOperativeChecklist.preOperativeChecklistDetailData,
  );

  const ipdPatientDetailData = useSelector(
    (state: RootState) => state.ipd.ipdPatientDetailData,
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "consent";

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setIsLoading(true);
      let count = 0;
      const done = () => {
        count++;
        if (count >= 2) {
          setIsLoading(false);
        }
      };

      surgeryReportDetail(id, () => {
        done();
      });

      preOperativeChecklistDetail(id, () => {
        done();
      });
    };

    loadData();

    return () => {
      cleanSurgeryReport();
      cleanPreOpChecklist();
      dispatch(clearSurgeryReportDetailSlice());
      dispatch(clearPreOperativeChecklistDetailSlice());
    };
  }, [id]);

  useEffect(() => {
    if (surgeryReportData?.ipd_id) {
      ipdPatientDetailHandler(
        surgeryReportData.ipd_id,
        () => {},
        [],
        () => {},
      );
    }
    return () => {
      cleanIpdPatients();
      dispatch(clearIpdPatientDetailDataSlice());
    };
  }, [surgeryReportData?.ipd_id]);

  const handleDownload = () => {
    if (!surgeryReportData?.ipd_id || !id) return;

    let type = "";
    switch (activeTab) {
      case "consent":
        type = "surgery_consent_form";
        break;
      case "checklist":
        type = "pre_operative_checklist";
        break;
      case "report":
        type = "surgery_report";
        break;
      default:
        return;
    }

    fetchAndDownloadPdf(
      surgeryReportData.ipd_id,
      IPD_GENERATE_PDF_URL,
      type,
      () => {},
      id,
    );
  };

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const getFileType = (url: string) => {
    const ext = url?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  };

  const tabs = [
    {
      value: "consent",
      label: "Consent Form",
      content: (
        <SurgeryConsentTab
          detail={surgeryReportData}
          onPreview={handlePreview}
        />
      ),
    },
    {
      value: "checklist",
      label: "Pre-Operative Checklist",
      content: (
        <PreOpChecklistTab
          detail={checklistDetailData}
          onPreview={handlePreview}
        />
      ),
    },
    {
      value: "report",
      label: "Surgery Report",
      content: (
        <SurgeryReportTab
          detail={surgeryReportData}
          onPreview={handlePreview}
        />
      ),
    },
  ];

  const surgeryStart = surgeryReportData?.surgery_start_datetime;
  const surgeryEnd = surgeryReportData?.surgery_end_datetime;
  const formattedSurgeryTime =
    surgeryStart && surgeryEnd
      ? `${dayjs(surgeryStart).format("DD MMM YYYY, hh:mm A")} – ${dayjs(
          surgeryEnd,
        ).format("hh:mm A")}`
      : "-";

  if (isLoading) {
    return (
      <View className="flex items-center justify-center h-[80vh]">
        <BouncingLoader isLoading={true} />
      </View>
    );
  }

  return (
    <View className="p-4 md:p-8 space-y-6 max-w-9xl mx-auto animate-in fade-in duration-700">
      {/* Page Header */}
      <View className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <View className="space-y-1">
          <Text
            as="h1"
            className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            View Surgery Details
          </Text>
          <Text className="text-slate-500 font-medium flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold">
              Reference
            </span>
            Surgery #{surgeryReportData?.id || id}
          </Text>
        </View>

        <View className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-sm"
            onPress={handleDownload}
            disabled={isPdfDownloading}
          >
            {isPdfDownloading ? (
              <BouncingLoader isLoading={true} />
            ) : (
              <FileDown size={16} className="text-primary" />
            )}
            {activeTab === "consent"
              ? "Generate Consent Form"
              : activeTab === "checklist"
                ? "Generate Pre-Operative Checklist"
                : "Generate Surgery Report"}
          </Button>

          <Button
            variant="primary"
            className="flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            onPress={() =>
              navigate(
                `/ipd-patients-list/ipd-patients-details/surgery-procedure/${id}`,
              )
            }
          >
            <Edit size={16} />
            Edit
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-sm"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </View>
      </View>

      {/* Demographics Card */}
      <Card className="border-slate-100 shadow-xl shadow-slate-200/30 dark:shadow-slate-50/10 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden relative">
        <View className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
        <View className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />

        <View className="p-6 md:p-8 space-y-8 relative z-10">
          <View>
            <SectionHeader label="Patient Demographics" />
            <View className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-6">
              <ReadOnlyField
                label="IP No"
                value={ipdPatientDetailData?.ipd_number}
              />
              <ReadOnlyField
                label="Patient Name"
                value={ipdPatientDetailData?.patient_name}
              />
              <ReadOnlyField
                label="Age"
                value={ipdPatientDetailData?.patient?.age}
              />
              <ReadOnlyField
                label="Gender"
                value={
                  ipdPatientDetailData?.patient?.gender ??
                  ipdPatientDetailData?.patient_gender
                }
              />
              <ReadOnlyField
                label="Admission Date"
                value={
                  ipdPatientDetailData?.admission_date_time
                    ? dayjs(ipdPatientDetailData.admission_date_time).format(
                        "DD MMM YYYY",
                      )
                    : null
                }
              />
              <ReadOnlyField
                label="Ward / Room / Bed"
                value={
                  ipdPatientDetailData?.ward_number
                    ? `${ipdPatientDetailData.ward_number} / ${ipdPatientDetailData.room_number} / ${ipdPatientDetailData.bed_number}`
                    : null
                }
              />
              <ReadOnlyField
                label="Contact"
                value={ipdPatientDetailData?.patient_phone}
              />
            </View>
          </View>

          <View>
            <SectionHeader label="Clinical & Surgery Details" />
            <View className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <ReadOnlyField
                label="Surgery Name"
                value={surgeryReportData?.surgery_name}
              />
              <ReadOnlyField
                label="Surgery Type"
                value={surgeryReportData?.surgery_type}
              />
              <ReadOnlyField
                label="Surgery Time"
                value={formattedSurgeryTime}
              />
              <ReadOnlyField
                label="Surgeon"
                value={surgeryReportData?.surgeon}
              />
              <ReadOnlyField
                label="Anaesthetist"
                value={surgeryReportData?.anaesthetist}
              />
            </View>
          </View>
        </View>
      </Card>

      {/* Tab Sections */}
      <Card className="border-slate-100 shadow-xl shadow-slate-200/30 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
        <TabView tabs={tabs} />
      </Card>

      {/* Document Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewTitle}
        size="full"
      >
        <View className="flex flex-col items-center justify-center min-h-[60vh]">
          {getFileType(previewUrl) === "image" ? (
            <img
              src={import.meta.env.VITE_APP_URL + previewUrl}
              alt={previewTitle}
              className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            />
          ) : getFileType(previewUrl) === "pdf" ? (
            <iframe
              src={import.meta.env.VITE_APP_URL + previewUrl}
              className="w-full h-[70vh] rounded-lg border-0"
              title={previewTitle}
            />
          ) : (
            <View className="text-center space-y-4">
              <Text className="text-slate-500">
                Preview not available for this file type.
              </Text>
              <Button
                variant="primary"
                onPress={() =>
                  window.open(
                    import.meta.env.VITE_APP_URL + previewUrl,
                    "_blank",
                  )
                }
              >
                Download File
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SurgeryDetailPage;
