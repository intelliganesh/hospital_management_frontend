import React from "react";
import View from "@/components/view";
import ReadOnlyField from "@/pages/ipd/pac/components/ReadOnlyField";
import SectionDivider from "@/pages/ipd/pac/components/SectionDivider";
import dayjs from "dayjs";

interface Props {
  detail: any;
}

const SurgeryReportTab: React.FC<Props> = ({ detail }) => {
  const formatDateTime = (val: string) => {
    return val ? dayjs(val).format("DD MMM YYYY, hh:mm A") : "-";
  };

  return (
    <View className="space-y-8 p-6">
      {/* Basic Info */}
      <SectionDivider label="Basic Information" />
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ReadOnlyField label="Surgery Name" value={detail?.surgery_name} />
        <ReadOnlyField label="Surgery Type" value={detail?.surgery_type} />
        <ReadOnlyField
          label="Surgery Date"
          value={
            detail?.surgery_date
              ? dayjs(detail.surgery_date).format("DD MMM YYYY")
              : null
          }
        />
        <ReadOnlyField label="Status" value={detail?.status} />
        <ReadOnlyField label="Department" value={detail?.department} />
      </View>

      {/* Timings */}
      <SectionDivider label="Surgery Timing" />
      <View className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ReadOnlyField
          label="Surgery Start Time"
          value={formatDateTime(detail?.surgery_start_datetime)}
        />
        <ReadOnlyField
          label="Surgery End Time"
          value={formatDateTime(detail?.surgery_end_datetime)}
        />
      </View>

      {/* Medical Team */}
      <SectionDivider label="Medical Team" />
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ReadOnlyField label="Surgeon" value={detail?.surgeon} />
        <ReadOnlyField label="Anaesthetist" value={detail?.anaesthetist} />
        <ReadOnlyField
          label="External Anaesthetist"
          value={detail?.external_anaesthetist}
        />
        <ReadOnlyField
          label="Assistant Surgeon"
          value={detail?.assistant_surgeon}
        />
        <ReadOnlyField label="Scrub Nurse" value={detail?.scrub_nurse} />
      </View>

      {/* Operative Details */}
      <SectionDivider label="Operative Details" />
      <View className="space-y-6">
        <ReadOnlyField
          label="Specimen for HPE"
          value={detail?.specimen_for_hpe}
        />
        <ReadOnlyField label="Operative Notes" value={detail?.operative_notes} />
        <ReadOnlyField
          label="Operative Findings"
          value={detail?.operative_findings}
        />
        <ReadOnlyField
          label="Post Operative Instructions"
          value={detail?.post_operative_instructions}
        />
      </View>

      {/* Summary */}
      <SectionDivider label="Summary" />
      <ReadOnlyField label="Surgery Summary" value={detail?.summary} />
    </View>
  );
};

export default SurgeryReportTab;