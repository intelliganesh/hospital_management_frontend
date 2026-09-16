import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_DOWNLOAD_PDF_URL } from "@/utils/urls/backend";

import {
  Download,
  FileText,
  ClipboardList,
  FileCheck,
  ScrollText,
  ChevronDown,
  Scissors,
} from "lucide-react";
import { useSurgeryReport } from "@/actions/calls/ipd/surgeryProcedure/surgeryReport";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useEffect, useState } from "react";
import BouncingLoader from "@/components/BouncingLoader";

const DownloadSurgeryReports = () => {
  const { id } = useParams();
  const { fetchAndDownloadPdf } = useDownloadIpdPdf();
  const { getSurgeryList } = useSurgeryReport();
  const [expandedSurgery, setExpandedSurgery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const surgeryData = useSelector(
    (state: RootState) => state?.surgeryReport?.surgeryList,
  );

  useEffect(() => {
    if (id) {
      getSurgeryList(
        id,
        1,
        () => {},
        null,
        null,
        null,
        [],
        (status) => setIsLoading(status === "pending"),
      );
    }
  }, [id]);

  const handleDownload = (type: string, surgeryId?: string) => {
    if (!id) return;

    fetchAndDownloadPdf(
      id,
      IPD_DOWNLOAD_PDF_URL,
      type,
      (success: boolean) => {
        if (!success) {
          console.error("Download failed");
        }
      },
      surgeryId,
    );
  };

  const generalReports = [
    {
      name: "Preliminary Notes",
      icon: FileText,
      color: "text-blue-600",
      type: "preliminary_notes",
    },
    {
      name: "Doctor Notes",
      icon: ClipboardList,
      color: "text-emerald-600",
      type: "doctor_notes",
    },
    {
      name: "Nurse Notes",
      icon: ScrollText,
      color: "text-pink-600",
      type: "nurse_notes",
    },
    {
      name: "Discharge Summary",
      icon: FileCheck,
      color: "text-amber-600",
      type: "discharge_summary",
    },
  ];

  const anesthesiaReports = [
    {
      name: "Pre-Operative Anesthesia",
      icon: FileText,
      color: "text-indigo-600",
      type: "pre_anaesthesia_assessment",
    },
    {
      name: "Anesthesia Record",
      icon: FileCheck,
      color: "text-purple-600",
      type: "department_of_anaesthesia",
    },
    {
      name: "Recovery Room Observation",
      icon: ClipboardList,
      color: "text-teal-600",
      type: "anaesthesia_recovery_room_observation",
    },
    {
      name: "Consent For Anesthesia",
      icon: FileCheck,
      color: "text-cyan-600",
      type: "anaesthesia_consent_form",
    },
  ];

  const surgeryReports = [
    {
      name: "Surgery Consent Form",
      icon: FileCheck,
      color: "text-blue-600",
      type: "surgery_consent_form",
    },
    {
      name: "Pre-Operative Checklist",
      icon: ClipboardList,
      color: "text-violet-600",
      type: "pre_operative_checklist",
    },
    {
      name: "Surgery Report",
      icon: FileText,
      color: "text-rose-600",
      type: "surgery_report",
    },
  ];

  const DownloadCard = ({
    item,
    surgeryId,
  }: {
    item: any;
    surgeryId?: string;
  }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => handleDownload(item.type, surgeryId)}
        className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 w-full"
      >
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-700 ${item.color} group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon size={14} />
        </div>
        <div className="flex-1 text-left">
          <Text
            as="p"
            className="font-medium text-slate-900 dark:text-white text-sm"
          >
            {item.name}
          </Text>
          <Text
            as="p"
            className="text-xs text-slate-500 dark:text-slate-400 mt-0.5"
          >
            Click to download
          </Text>
        </div>
        <Download
          size={18}
          className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
        />
      </button>
    );
  };

  return (
    <View className="p-6 space-y-6 mx-auto">
      <BouncingLoader isLoading={isLoading} />
      <View className="flex justify-between items-center gap-4">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
          >
            Report Downloads
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            Download Patient Reports
          </Text>
        </View>
      </View>
      {/* General Medical Reports Section */}
      <View className="space-y-4">
        <View className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1">
          <View className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <FileText className="text-blue-600 dark:text-blue-400" size={24} />
          </View>
          <View>
            <Text
              as="h2"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              General Medical Reports
            </Text>
            <Text as="p" className="text-xs text-slate-500 dark:text-slate-400">
              Standard clinical documentation and case summaries
            </Text>
          </View>
        </View>
        <Card className="p-6 bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 shadow-sm">
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {generalReports.map((report, index) => (
              <DownloadCard key={index} item={report} />
            ))}
          </View>
        </Card>
      </View>
      <View className="h-4" /> {/* Spacer */}
      {/* Surgery-Related Reports Section */}
      <View className="space-y-4">
        <View className="flex items-center gap-3 border-l-4 border-rose-500 pl-4 py-1">
          <View className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
            <FileCheck className="text-rose-600 dark:text-rose-400" size={24} />
          </View>
          <View>
            <Text
              as="h2"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              Surgery-Related Reports
            </Text>
            <Text as="p" className="text-xs text-slate-500 dark:text-slate-400">
              Technical documentations specific to surgical procedures
            </Text>
          </View>
        </View>

        {surgeryData?.data && surgeryData.data.length > 0 ? (
          <View className="space-y-5">
            {surgeryData.data.map((surgery: any) => (
              <Card
                key={surgery.id}
                className="overflow-hidden border-rose-100 dark:border-rose-900/30 shadow-sm"
              >
                <button
                  onClick={() =>
                    setExpandedSurgery(
                      expandedSurgery === surgery.id ? null : surgery.id,
                    )
                  }
                  className={`w-full flex items-center justify-between p-5 transition-all duration-300 ${
                    expandedSurgery === surgery.id
                      ? "bg-rose-50/50 dark:bg-rose-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <View className="flex items-center gap-4 text-left">
                    <View
                      className={`p-2 rounded-full ${expandedSurgery === surgery.id ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"} transition-colors`}
                    >
                      <Scissors size={18} />
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-slate-900 dark:text-white">
                        {surgery.surgery_name}
                      </Text>
                      <View className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                        <View className="flex items-center gap-1.5">
                          <Text className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Date:
                          </Text>
                          <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {surgery.surgery_date}
                          </Text>
                        </View>
                        <View className="flex items-center gap-1.5">
                          <Text className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Surgeon:
                          </Text>
                          <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {surgery.surgeon}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    className={`transition-transform duration-300 ${expandedSurgery === surgery.id ? "rotate-180" : ""}`}
                  >
                    <ChevronDown className="text-slate-400" />
                  </View>
                </button>

                {expandedSurgery === surgery.id && (
                  <View className="p-6 bg-white dark:bg-slate-900 border-t border-rose-100 dark:border-rose-900/30 space-y-8">
                    {/* Anesthesia Subsection */}
                    <View className="space-y-4">
                      <View className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <Text className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                          Anesthesia Section
                        </Text>
                      </View>
                      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {anesthesiaReports.map((report, index) => (
                          <DownloadCard
                            key={index}
                            item={report}
                            surgeryId={surgery.id}
                          />
                        ))}
                      </View>
                    </View>

                    {/* Surgery Subsection */}
                    <View className="space-y-4">
                      <View className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                        <Text className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                          Surgery Section
                        </Text>
                      </View>
                      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {surgeryReports.map((report, index) => (
                          <DownloadCard
                            key={index}
                            item={report}
                            surgeryId={surgery.id}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </Card>
            ))}
          </View>
        ) : (
          <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed border-2 border-slate-200 dark:border-slate-700">
            <View className="flex flex-col items-center gap-2">
              <FileCheck className="text-slate-300" size={40} />
              <Text className="text-slate-500 font-medium">
                No surgical records found for this inpatient enrollment.
              </Text>
            </View>
          </Card>
        )}
      </View>
    </View>
  );
};

export default DownloadSurgeryReports;
