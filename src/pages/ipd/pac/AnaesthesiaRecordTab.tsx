import React from "react";
import View from "@/components/view";
import ReadOnlyField from "./components/ReadOnlyField";
import SectionDivider from "./components/SectionDivider";
import dayjs from "dayjs";
import TabUploadSection from "./components/TabUploadSection";

interface Props {
  detail: any;
  onPreview: (url: string, title: string) => void;
  onDownload: () => void;
}

/**
 * Anaesthesia Record tab.
 */
const AnaesthesiaRecordTab: React.FC<Props> = ({ detail, onPreview }) => {
  const uploadPath =
    detail?.uploaded_anaesthesia_record_path ||
    detail?.upload_anaesthesia_record_path ||
    detail?.uploaded_record_path;

  return (
    <View className="space-y-8 p-6">
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReadOnlyField
          label="Surgery Name"
          value={detail?.surgery?.surgery_name}
        />
        <ReadOnlyField
          label="Surgery Date"
          value={
            detail?.surgery?.surgery_date
              ? dayjs(detail.surgery.surgery_date).format("DD MMM YYYY")
              : null
          }
        />
      </View>

      <SectionDivider label="Record Summary" />
      <ReadOnlyField
        label="Anaesthesia Record Summary"
        value={detail?.anaesthesia_record_summary}
      />

      <TabUploadSection
        docs={[{ label: "Anaesthesia Record", path: uploadPath }]}
        onPreview={onPreview}
      />
    </View>
  );
};

export default AnaesthesiaRecordTab;
