import React from "react";
import View from "@/components/view";
import ReadOnlyField from "./components/ReadOnlyField";
import SectionDivider from "./components/SectionDivider";
import dayjs from "dayjs";

interface Props {
  detail: any;
}

/**
 * Anaesthesia Record tab.
 */
const AnaesthesiaRecordTab: React.FC<Props> = ({ detail }) => {

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

    </View>
  );
};

export default AnaesthesiaRecordTab;