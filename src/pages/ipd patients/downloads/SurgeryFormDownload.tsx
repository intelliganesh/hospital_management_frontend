import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import {
  Download,
  FileText,
  ClipboardList,
  FileCheck,
  ScrollText,
  HeartPulse,
} from "lucide-react";

const DownloadSurgeryForm = () => {
  const forms = [
    {
      name: "Pre-Operative Anesthesia Evaluation",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      name: "Department Of Anesthesia",
      icon: ClipboardList,
      color: "text-purple-600",
    },
    {
      name: "Anesthetist Record",
      icon: ScrollText,
      color: "text-indigo-600",
    },
    {
      name: "Recovery Room Observation",
      icon: HeartPulse,
      color: "text-teal-600",
    },
    {
      name: "Consent For Anesthesia",
      icon: FileCheck,
      color: "text-emerald-600",
    },
    {
      name: "Consent Form",
      icon: FileCheck,
      color: "text-cyan-600",
    },
    {
      name: "Pre-Operative Checklist",
      icon: ClipboardList,
      color: "text-violet-600",
    },
  ];

  const DownloadCard = ({ item }) => {
    const Icon = item.icon;
    return (
      <button className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 w-full sm:w-auto min-w-[240px]">
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
      <View className="flex justify-between items-center gap-4">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
          >
            Form Downloads
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            Download IPD Forms Here
          </Text>
        </View>
      </View>

      {/* Forms Section */}
      <Card className="p-6 space-y-5">
        <View className="flex items-center gap-2">
          <FileText className="text-blue-600" size={20} />
          <Text
            as="h2"
            className="text-xl font-semibold text-slate-900 dark:text-white"
          >
            Forms
          </Text>
        </View>
        <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 mt-4">
          {forms.map((form, index) => (
            <DownloadCard key={index} item={form} />
          ))}
        </View>
      </Card>
    
    </View>
  );
};

export default DownloadSurgeryForm;
