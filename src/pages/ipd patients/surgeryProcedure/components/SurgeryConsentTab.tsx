import React from "react";
import View from "@/components/view";
import ReadOnlyField from "@/pages/ipd/pac/components/ReadOnlyField";
import SectionDivider from "@/pages/ipd/pac/components/SectionDivider";

interface Props {
  detail: any;
}

const SurgeryConsentTab: React.FC<Props> = ({ detail }) => {
  return (
    <View className="space-y-8 p-6">
      <SectionDivider label="Consent Summary" />
      <ReadOnlyField label="Summary" value={detail?.consent_summary} />

    </View>
  );
};

export default SurgeryConsentTab;