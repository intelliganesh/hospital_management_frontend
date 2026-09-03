import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import BouncingLoader from "@/components/BouncingLoader";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { useNavigate, useParams } from "react-router-dom";
import { IPD_DOWNLOAD_EMPTY_PDF_URL } from "@/utils/urls/backend";
import {
  Download,
  FileText,
  ClipboardList,
  FileCheck,
  ScrollText,
  HeartPulse,
  Receipt,
  Stethoscope,
} from "lucide-react";

const DownloadSurgeryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchAndDownloadPdf, isLoading } = useDownloadIpdPdf();

  const forms = [
    {
      name: "Preliminary Notes",
      type: "preliminary_notes",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      name: "Doctor Notes",
      type: "doctor_notes",
      icon: Stethoscope,
      color: "text-teal-600",
    },
    {
      name: "Nurse Notes",
      type: "nurse_notes",
      icon: HeartPulse,
      color: "text-fuchsia-600",
    },
    {
      name: "Discharge Summary",
      type: "discharge_summary",
      icon: FileCheck,
      color: "text-indigo-600",
    },
    {
      name: "Surgery Consent Form",
      type: "surgery_consent_form",
      icon: FileCheck,
      color: "text-cyan-600",
    },
    {
      name: "Anaesthesia Consent Form",
      type: "anaesthesia_consent_form",
      icon: FileCheck,
      color: "text-emerald-600",
    },
    {
      name: "Pre-Anaesthesia Assessment",
      type: "pre_anaesthesia_assessment",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      name: "Department of Anaesthesia",
      type: "department_of_anaesthesia",
      icon: ClipboardList,
      color: "text-purple-600",
    },
    {
      name: "Anaesthesia Record",
      type: "anaesthesia_record",
      icon: ScrollText,
      color: "text-indigo-600",
    },
    {
      name: "Pre-Operative Checklist",
      type: "pre_operative_checklist",
      icon: ClipboardList,
      color: "text-violet-600",
    },
    {
      name: "Recovery Room Observation",
      type: "anaesthesia_recovery_room_observation",
      icon: HeartPulse,
      color: "text-teal-600",
    },
    {
      name: "Surgery Report",
      type: "surgery_report",
      icon: ScrollText,
      color: "text-orange-600",
    },
    {
      name: "Billing Invoice",
      type: "billing_invoice",
      icon: Receipt,
      color: "text-emerald-600",
    },
  ];

  const handleDownload = (type: string) => {
    if (!id) return;
    fetchAndDownloadPdf(
      id,
      IPD_DOWNLOAD_EMPTY_PDF_URL,
      type,
      () => {},
      undefined,
      {
        ipd_id: id,
      },
    );
  };

  const DownloadCard = ({ item }: { item: any }) => {
    const Icon = item.icon;
    return (
      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleDownload(item.type)}
        className="relative flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-none hover:border-slate-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-50 dark:bg-slate-700 ${item.color}`}
        >
          <Icon size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <Text
            as="p"
            className="truncate text-sm font-semibold text-slate-900 dark:text-white"
          >
            {item.name}
          </Text>
          <Text
            as="p"
            className="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
          >
            Open empty PDF
          </Text>
        </div>
        {isLoading ? (
          <BouncingLoader className="h-4 w-4 shrink-0" isLoading={true} />
        ) : (
          <Download size={16} className="shrink-0 text-slate-400" />
        )}
      </button>
    );
  };

  return (
    <View className="p-6 space-y-6 mx-auto">
      <View className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
          >
            Download Empty Forms
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            Open blank IPD documents as PDF
          </Text>
        </View>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-none hover:border-slate-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
        >
          Back
        </button>
      </View>

      <Card className="p-6 space-y-5">
        <View className="flex items-center gap-2">
          <FileText className="text-blue-600" size={20} />
          <Text
            as="h2"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            Empty Forms
          </Text>
        </View>
        <View className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          {forms.map((form) => (
            <DownloadCard key={form.type} item={form} />
          ))}
        </View>
      </Card>
    </View>
  );
};

export default DownloadSurgeryForm;
