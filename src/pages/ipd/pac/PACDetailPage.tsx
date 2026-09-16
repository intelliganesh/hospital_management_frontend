import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import TabView from "@/components/Tabs";
import { FileDown, Edit, ArrowLeft, FileText } from "lucide-react";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_DOWNLOAD_PDF_URL, IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import BouncingLoader from "@/components/BouncingLoader";
import { useAnaesthesia } from "@/actions/calls/ipd/anaesthesia";
import {
  clearAnaesthesiaDetailSlice,
  clearPrefilledUploadedPdfSlice,
} from "@/actions/slices/ipd/anaesthesia/anaesthesia";
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

const anaesthesiaPdfActions = [
  { label: "Pre-Op Anesthesia Evaluation", type: "pre_anaesthesia_assessment" },
  { label: "Consent for Anaesthesia / Sedation", type: "anaesthesia_consent_form" },
  { label: "Department of Anaesthesia", type: "department_of_anaesthesia" },
  { label: "Anaesthesia Record", type: "anaesthesia_record" },
  {
    label: "Recovery Room Observation",
    type: "anaesthesia_recovery_room_observation",
  },
];

const titleFromKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const anaesthesiaTabPrefilledTypes = new Set(
  anaesthesiaPdfActions.map((item) => item.type),
);

const normalizePrefilledDocs = (data: any) => {
  const source = data?.url ?? data?.data?.url ?? data?.data ?? data;
  const list = Array.isArray(source) ? source : [];

  return list
    .filter(
      (item: any) =>
        anaesthesiaTabPrefilledTypes.has(item?.type) && Boolean(item?.content),
    )
    .map((item: any) => ({
      type: item.type,
      label: item.label || titleFromKey(item.type),
      path: item.content,
    }));
};
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
  const {
    anaesthesiaDetailHandler,
    prefilledUploadedPdfHandler,
    cleanUp,
  } = useAnaesthesia();
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
  const prefilledUploadedPdfData =
    useSelector(
      (state: RootState) => state.anaesthesia.prefilledUploadedPdfData,
    ) || [];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPrefilledLoading, setIsPrefilledLoading] = useState(false);

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
    if (_id) {
      prefilledUploadedPdfHandler(
        _id,
        () => {},
        [],
        (status) => setIsPrefilledLoading(status === "pending"),
      );
    }

    return () => {
      cleanUp();
      dispatch(clearAnaesthesiaDetailSlice());
      dispatch(clearPrefilledUploadedPdfSlice());
    };
  }, [pacId]);

  const ipdStatus = anaesthesiaDetail?.ipd?.status || anaesthesiaDetail?.status;
  const isDischarged = ipdStatus?.toLowerCase() === "discharged";
  const pdfActionText = isDischarged ? "Download" : "Generate";
  const prefilledDocs = normalizePrefilledDocs(prefilledUploadedPdfData);

  const handleDownload = (type: string) => {
    if (type && _id) {
      fetchAndDownloadPdf(
        _id,
        isDischarged ? IPD_DOWNLOAD_PDF_URL : IPD_GENERATE_PDF_URL,
        type,
        () => {},
        anaesthesiaDetail?.ipd_surgery_id,
      );
    }
  };

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
  };

  const getPreviewSource = (url: string) =>
    /^https?:\/\//.test(url) ? url : import.meta.env.VITE_APP_URL + url;

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
        <PreOpEvalTab detail={anaesthesiaPreOpDetail} />
      ),
    },
    {
      value: "consent",
      label: "Consent for Anaesthesia / Sedation",
      content: (
        <ConsentTab detail={anaesthesiaDetail} />
      ),
    },
    {
      value: "dept-anaes",
      label: "Department of Anaesthesia",
      content: (
        <DeptAnaesthesiaTab detail={departmentOfAnaesthesiaDetail} />
      ),
    },
    {
      value: "anaesthesia-record",
      label: "Anaesthesia Record",
      content: (
        <AnaesthesiaRecordTab detail={anaesthesiaDetail} />
      ),
    },
    {
      value: "recovery",
      label: "Recovery Room Observation",
      content: (
        <RecoveryObsTab detail={anaesthesiaRecoveryObservationDetail} />
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
      <View className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <View className="space-y-1">
          <Text
            as="h1"
            className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            View Anesthesia Details
          </Text>
          {/* <Text className="text-slate-500 font-medium flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] uppercase tracking-widest text-slate-600 font-bold">
              Reference
            </span>
            PAC #{anaesthesiaDetail?.id || pacId}
          </Text> */}
        </View>

        <View className="flex flex-wrap items-center gap-3">
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
      <View className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        <View className="min-w-0">
          <GenralAnesthesiaInfo anaesthesiaDetail={anaesthesiaDetail} />
        </View>

        <Card className="border-slate-100 shadow-xl shadow-slate-200/30 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden xl:sticky xl:top-4">
          <View className="p-5 space-y-6">
            <View>
              <View className="flex items-center gap-2 mb-4">
                <FileDown size={16} className="text-primary" />
                <Text className="text-xs font-black uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                  {pdfActionText} PDF
                </Text>
              </View>
              <View className="space-y-2">
                {anaesthesiaPdfActions.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    size="small"
                    className="flex w-full items-center justify-start gap-2 border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs leading-tight text-slate-700 transition-none hover:!border-slate-200 hover:!bg-slate-50 hover:!text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:!border-slate-600 dark:hover:!bg-slate-800 dark:hover:!text-slate-200"
                    onPress={() => handleDownload(item.type)}
                    disabled={isPdfDownloading}
                  >
                    {isPdfDownloading ? (
                      <BouncingLoader className="h-3.5 w-3.5 shrink-0" isLoading={true} />
                    ) : (
                      <FileDown size={13} className="shrink-0" />
                    )}
                    <span className="flex-1 truncate text-left">{`${pdfActionText} ${item.label}`}</span>
                  </Button>
                ))}
              </View>
            </View>

            <View className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <View className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-primary" />
                <Text className="text-xs font-black uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                  Uploaded Prefilled Forms ({prefilledDocs.length})
                </Text>
              </View>

              {isPrefilledLoading ? (
                <View className="py-6 flex justify-center">
                  <BouncingLoader isLoading={true} />
                </View>
              ) : prefilledDocs.length > 0 ? (
                <View className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {prefilledDocs.map((doc: any, index: number) => (
                    <Button
                      key={`${doc.path}-${index}`}
                      variant="outline"
                      size="small"
                      className="flex w-full items-center justify-start gap-2 border-slate-200 bg-white px-2.5 py-1.5 text-xs leading-tight text-slate-700 transition-none hover:!border-slate-200 hover:!bg-white hover:!text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:!border-slate-600 dark:hover:!bg-slate-800 dark:hover:!text-slate-200"
                      onPress={() => handlePreview(doc.path, doc.label)}
                    >
                      <FileText size={13} className="shrink-0 text-primary" />
                      <span className="flex-1 truncate text-left">{doc.label}</span>
                    </Button>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-slate-400 italic">
                  No uploaded prefilled forms found.
                </Text>
              )}
            </View>
          </View>
        </Card>
      </View>

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
              src={getPreviewSource(previewUrl)}
              alt={previewTitle}
              className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
            />
          ) : getFileType(previewUrl) === "pdf" ? (
            <iframe
              src={getPreviewSource(previewUrl)}
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
                    getPreviewSource(previewUrl),
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
