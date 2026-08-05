import React, { useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import BasicDetails from "./components/BasicDetails";
import ConsentForm from "./components/ConsentForm";
import PreOperativeChecklist from "./components/pre-operative/PreOperativeChecklist";
import SurgeryReportForm from "./components/surgery-report/SurgeryReportForm";
import { FileDown } from "lucide-react";
import Button from "@/components/button";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useParams } from "react-router-dom";
import BouncingLoader from "@/components/BouncingLoader";

const SurgeryProcedurePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("consent");
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } = useDownloadIpdPdf();

  const surgeryReportData = useSelector(
    (state: RootState) => state.surgeryReport.surgeryReportDetailData
  );

  const handleGeneratePdf = () => {
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
      id // surgery_id
    );
  };


  const tabs = [
    {
      value: "consent",
      label: "Consent Form",
      content: <ConsentForm />,
    },
    {
      value: "checklist",
      label: "Pre-Operative Checklist",
      content: <PreOperativeChecklist />,
    },
    {
      value: "report",
      label: "Surgery Report",
      content: <SurgeryReportForm />,
    },
  ];

  const renderContent = () => {
    const activeTabData = tabs.find((tab) => tab.value === activeTab);
    return activeTabData?.content || null;
  };

  return (
    <View className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <View className="flex justify-between items-center">
        <View>
          <Text
            as="h1"
            className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
          >
            Surgery Procedure
          </Text>
          <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
            Manage surgical procedures, consent forms, and pre-operative
            checklists
          </Text>
        </View>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onPress={handleGeneratePdf}
          disabled={isPdfDownloading}
        >
          {isPdfDownloading ? <BouncingLoader isLoading={isPdfDownloading} /> : <FileDown size={14} />}
          {activeTab === "consent"
            ? "Generate Consent Form"
            : activeTab === "checklist"
            ? "Generate Pre-Operative Checklist"
            : "Generate Surgery Report"}
        </Button>
      </View>

      {/* Basic Details Section */}
      <BasicDetails />

      {/* Tabs Section */}
      <Card className="p-6">
        {/* Main Tabs */}
        <View className="border-b border-border">
          <View className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.value
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </View>
        </View>

        {/* Content */}
        <View className="mt-6">{renderContent()}</View>
      </Card>
    </View>
  );
};

export default SurgeryProcedurePage;
