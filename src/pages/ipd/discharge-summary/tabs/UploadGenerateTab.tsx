import React from "react";
import View from "@/components/view";
import Upload from "@/components/Upload";
import Button from "@/components/button";
import { FileDown, Eye } from "lucide-react";

interface Props {
  readOnly?: boolean;
}

const UploadGenerateTab: React.FC<Props> = ({ readOnly = false }) => {
  const handleGeneratePDF = () => {
    console.log("Generate PDF from form data");
    // TODO: Implement PDF generation logic
  };

  const handlePreviewPDF = () => {
    console.log("Preview PDF");
    // TODO: Implement PDF preview logic
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
    // TODO: Implement PDF download logic
  };

  return (
    <View className="space-y-8">
      {/* Upload Section */}
      {/* <View className="flex justify-center">
        <View className="p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-primary border-dashed border-border dark:border-border !w-4/5">
          <Upload
            label="Upload Filled Discharge Summary"
            name="discharge_summary_upload"
            multiple={false}
            maxCount={1}
            accept=".pdf,.jpg,.png,.jpeg,.webp"
            browseText="Upload Form"
          />
        </View>
      </View> */}

      {/* Divider */}
      {/* <View className="relative">
        <View className="absolute inset-0 flex items-center">
          <View className="w-full border-t border-slate-200 dark:border-slate-700" />
        </View>
        <View className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </View>
      </View> */}

      {/* Generate PDF Section */}
      <View className="space-y-4">
        <View className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Generate PDF from Form Data
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create a discharge summary PDF using the information entered in the
            form
          </p>
        </View>

        <View className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            onPress={handlePreviewPDF}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview PDF
          </Button>
          {/* <Button
            variant="primary"
            onPress={handleGeneratePDF}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Generate PDF
          </Button> */}
          <Button
            variant="outline"
            onPress={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </Button>
        </View>
      </View>
    </View>
  );
};

export default UploadGenerateTab;
