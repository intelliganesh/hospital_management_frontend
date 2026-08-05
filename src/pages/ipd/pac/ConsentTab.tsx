import React from "react";
import View from "@/components/view";
import ReadOnlyField from "./components/ReadOnlyField";
import SectionDivider from "./components/SectionDivider";
import TabUploadSection from "./components/TabUploadSection";

interface Props {
  detail: any;
  onPreview: (url: string, title: string) => void;
  onDownload: () => void;
}

/**
 * Consent for Anaesthesia / Sedation tab.
 */
const ConsentTab: React.FC<Props> = ({ detail, onPreview }) => (
  <View className="space-y-8 p-6">
    <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ReadOnlyField
        label="Type of Anaesthesia"
        value={detail?.type_of_anaesthesia}
      />
      <ReadOnlyField
        label="Operative Procedure"
        value={detail?.operative_procedure}
      />
    </View>

    <SectionDivider label="Consent Summary" />
    <ReadOnlyField label="Summary" value={detail?.consent_summary} />

    <TabUploadSection
      docs={[{ label: "Consent Form", path: detail?.uploaded_consent_path }]}
      onPreview={onPreview}
    />
  </View>
);

export default ConsentTab;
