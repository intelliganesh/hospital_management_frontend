import React from "react";
import View from "@/components/view";
import ReadOnlyField from "@/pages/ipd/pac/components/ReadOnlyField";
import SectionDivider from "@/pages/ipd/pac/components/SectionDivider";
import TabUploadSection from "@/pages/ipd/pac/components/TabUploadSection";

interface Props {
  detail: any;
  onPreview: (url: string, title: string) => void;
}

const SurgeryConsentTab: React.FC<Props> = ({ detail, onPreview }) => {
  return (
    <View className="space-y-8 p-6">
      <SectionDivider label="Consent Summary" />
      <ReadOnlyField label="Summary" value={detail?.consent_summary} />

      <TabUploadSection
        docs={[
          {
            label: "Surgery Consent Form",
            path: detail?.uploaded_consent_path,
          },
        ]}
        onPreview={onPreview}
      />
    </View>
  );
};

export default SurgeryConsentTab;
