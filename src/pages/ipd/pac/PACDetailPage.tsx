import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import TabView from "@/components/Tabs";
import { FileDown, Edit, ArrowLeft } from "lucide-react";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import BouncingLoader from "@/components/BouncingLoader";
import { useAnaesthesia } from "@/actions/calls/ipd/anaesthesia";
import { clearAnaesthesiaDetailSlice } from "@/actions/slices/ipd/anaesthesia/anaesthesia";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { usePreOpAnaesthesiaEval } from "@/actions/calls/ipd/anaesthesia/pre-opAnaesthesiaEvaluation";
import { useAnaesthesiaRecoveryObservation } from "@/actions/calls/ipd/anaesthesia/anaesthesiaRecoveryObservation";
import { useDepartmentOfAnaesthesia } from "@/actions/calls/ipd/anaesthesia/departmentOfAnaesthesia";
import Modal from "@/components/Modal";

import PreOpEvalTab from "./PreOpEvalTab";
import DeptAnaesthesiaTab from "./DeptAnaesthesiaTab";
import RecoveryObsTab from "./RecoveryObsTab";
import ConsentTab from "./ConsentTab";
import AnaesthesiaRecordTab from "./AnaesthesiaRecordTab";
import GenralAnesthesiaInfo from "./GenralAnesthesiaInfo";

/**
 * View PAC Detail Page – Strictly read-only view of a PAC record.
 * Uploaded documents are shown within their respective tabs.
 */
const PACDetailPage: React.FC = () => {
  const { id: _id, pacId } = useParams<{ id: string; pacId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();
  const { anaesthesiaDetailHandler, cleanUp } = useAnaesthesia();
  const { preOpAnaesthesiaEvalDetailsHandler } = usePreOpAnaesthesiaEval();
  const { anaesthesiaRecoveryObservationDetailsHandler } =
    useAnaesthesiaRecoveryObservation();
  const { departmentOfAnaesthesiaDetailsHandler } =
    useDepartmentOfAnaesthesia();

  const anaesthesiaDetail =
    (useSelector(
      (state: RootState) => state.anaesthesia.anaesthesiaDetailData,
    ) as any) || null;

  const anaesthesiaPreOpDetail =
    (useSelector(
      (state: RootState) =>
        state.preOpAnaesthesiaEval.PreOpAnaesthesiaEvalDetails,
    ) as any) || null;

  const anaesthesiaRecoveryObservationDetail =
    (useSelector(
      (state: RootState) =>
        state.anaesthesiaRecoveryObservation
          .AnaesthesiaRecoveryObservationDetails,
    ) as any) || null;

  const departmentOfAnaesthesiaDetail =
    (useSelector(
      (state: RootState) =>
        state.departmentOfAnaesthesia.DepartmentOfAnaesthesiaDetails,
    ) as any) || null;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    if (!pacId) return;
    const loadingHandler = (status: string) =>
      setIsLoading(status === "pending");
    const onComplete = () => setIsLoading(false);

    anaesthesiaDetailHandler(pacId, onComplete, undefined, loadingHandler);
    preOpAnaesthesiaEvalDetailsHandler(
      pacId,
      onComplete,
      undefined,
      loadingHandler,
    );
    anaesthesiaRecoveryObservationDetailsHandler(
      pacId,
      onComplete,
      undefined,
      loadingHandler,
    );
    departmentOfAnaesthesiaDetailsHandler(
      pacId,
      onComplete,
      undefined,
      loadingHandler,
    );

    return () => {
      cleanUp();
      dispatch(clearAnaesthesiaDetailSlice());
    };
  }, [pacId]);

  const handleDownload = (tabValue: string) => {
    const typeMap: Record<string, string> = {
      "pre-op": "pre_anaesthesia_assessment",
      "dept-anaes": "department_of_anaesthesia",
      recovery: "anaesthesia_recovery_room_observation",
      consent: "anaesthesia_consent_form",
      "anaesthesia-record": "anaesthesia_record",
    };
    const type = typeMap[tabValue];
    if (type && _id) {
      fetchAndDownloadPdf(_id, IPD_GENERATE_PDF_URL, type, () => {});
    }
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
      value: "pre-op",
      label: "Pre-Op Anesthesia Evaluation",
      content: (
        <PreOpEvalTab
          detail={anaesthesiaPreOpDetail}
          uploadPath={
            anaesthesiaDetail?.upload_pdf_path ||
            anaesthesiaDetail?.preop_upload
          }
          onPreview={handlePreview}
          onDownload={() => handleDownload("pre-op")}
        />
      ),
    },
    {
      value: "consent",
      label: "Consent for Anaesthesia / Sedation",
      content: (
        <ConsentTab
          detail={anaesthesiaDetail}
          onPreview={handlePreview}
          onDownload={() => handleDownload("consent")}
        />
      ),
    },
    {
      value: "anaesthesia-record",
      label: "Anaesthesia Record",
      content: (
        <AnaesthesiaRecordTab
          detail={anaesthesiaDetail}
          onPreview={handlePreview}
          onDownload={() => handleDownload("anaesthesia-record")}
        />
      ),
    },
    {
      value: "dept-anaes",
      label: "Department of Anaesthesia",
      content: (
        <DeptAnaesthesiaTab
          detail={departmentOfAnaesthesiaDetail}
          uploadPath={anaesthesiaDetail?.anaes_upload}
          onPreview={handlePreview}
          onDownload={() => handleDownload("dept-anaes")}
        />
      ),
    },
    {
      value: "recovery",
      label: "Recovery Room Observation",
      content: (
        <RecoveryObsTab
          detail={anaesthesiaRecoveryObservationDetail}
          uploadPath={anaesthesiaDetail?.recovery_upload}
          onPreview={handlePreview}
          onDownload={() => handleDownload("recovery")}
        />
      ),
    },
    
    
  ];

  if (isLoading) {
    return (
      <View className="flex items-center justify-center h-[80vh]">
        <BouncingLoader isLoading={true} />
      </View>
    );
  }

  return (
    <View className="p-4 md:p-8 space-y-6 max-w-9xl mx-auto animate-in fade-in duration-700">
      {/* ── Page Header ── */}
      <View className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <View className="space-y-1">
          <Text
            as="h1"
            className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            View PAC
          </Text>
          <Text className="text-slate-500 font-medium flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] uppercase tracking-widest text-slate-600 font-bold">
              Reference
            </span>
            PAC #{anaesthesiaDetail?.id || pacId}
          </Text>
        </View>

        <View className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-sm"
            onPress={() => handleDownload("pre-op")}
            disabled={isPdfDownloading}
          >
            {isPdfDownloading ? (
              <BouncingLoader isLoading={true} />
            ) : (
              <FileDown size={16} className="text-primary" />
            )}
            Generate PDF
          </Button>

          <Button
            variant="primary"
            className="flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            onPress={() => navigate(`/ipd/${_id}/pac/${pacId}?mode=edit`)}
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

      {/* ── General Information ── */}
      <GenralAnesthesiaInfo anaesthesiaDetail={anaesthesiaDetail} />

      {/* ── Tab Sections ── */}
      <Card className="border-slate-100 shadow-xl shadow-slate-200/30 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
        <TabView tabs={tabs} />
      </Card>

      {/* ── Document Preview Modal ── */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        closeOnOutsideClick={false}
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

export default PACDetailPage;
