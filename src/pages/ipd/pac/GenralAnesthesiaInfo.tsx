import React from "react";
import { Card } from "@/components/ui/card";
import View from "@/components/view";
import Text from "@/components/text";
import dayjs from "dayjs";
import ReadOnlyField from "./components/ReadOnlyField";

interface Props {
  anaesthesiaDetail: any;
}

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <View className="flex items-center gap-3 mb-6">
    <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">
      {label}
    </Text>
    <View className="h-px bg-slate-100 flex-1" />
  </View>
);

const GenralAnesthesiaInfo: React.FC<Props> = ({ anaesthesiaDetail }) => {
  const ipd = anaesthesiaDetail?.ipd;
  const surgery = anaesthesiaDetail?.surgery;

  return (
    <Card className="border-slate-100 shadow-xl shadow-slate-200/30 dark:shadow-slate-50/10 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Decorative blobs */}
      <View className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
      <View className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />

      <View className="p-6 md:p-8 space-y-8 relative z-10">
        {/* ── Patient Demographics ── */}
        <View>
          <SectionHeader label="Patient Demographics" />
          <View className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-6">
            <ReadOnlyField label="IP No" value={ipd?.ipd_number} />
            <ReadOnlyField label="Patient Name" value={ipd?.patient_name} />
            <ReadOnlyField label="Age" value={ipd?.patient_age} />
            <ReadOnlyField
              label="Gender"
              value={ipd?.patient?.gender ?? ipd?.patient_gender}
            />
            <ReadOnlyField
              label="Date"
              value={
                anaesthesiaDetail?.datetime
                  ? dayjs(anaesthesiaDetail.datetime).format("DD MMM YYYY")
                  : null
              }
            />
            <ReadOnlyField
              label="Height"
              value={
                anaesthesiaDetail?.patient_height
                  ? `${anaesthesiaDetail.patient_height} cm`
                  : null
              }
            />
            <ReadOnlyField
              label="Weight"
              value={
                anaesthesiaDetail?.patient_weight
                  ? `${anaesthesiaDetail.patient_weight} kg`
                  : null
              }
            />
            <ReadOnlyField
              label="Community"
              value={anaesthesiaDetail?.patient_community}
            />
            <ReadOnlyField
              label="Mother Tongue"
              value={anaesthesiaDetail?.patient_mother_tongue}
            />
            <ReadOnlyField label="Contact" value={ipd?.patient_phone} />
          </View>
        </View>

        {/* ── Clinical Information ── */}
        <View>
          <SectionHeader label="Clinical Information" />
          <View className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <ReadOnlyField
              label="Diagnosis"
              value={anaesthesiaDetail?.diagnosis}
            />
            <ReadOnlyField label="Surgery" value={surgery?.surgery_name} />
            <ReadOnlyField label="Surgery Type" value={surgery?.surgery_type} />
            <ReadOnlyField
              label="Surgery Date"
              value={
                surgery?.surgery_date
                  ? dayjs(surgery.surgery_date).format("DD MMM YYYY")
                  : null
              }
            />
            <ReadOnlyField
              label="Position"
              value={anaesthesiaDetail?.position}
            />
          </View>
        </View>

        {/* ── Medical Team ── */}
        <View>
          <SectionHeader label="Medical Team" />
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            <ReadOnlyField label="Surgeon" value={surgery?.surgeon} />
            <ReadOnlyField
              label="Assistant Surgeons"
              value={surgery?.surgeon_assistants}
            />
            <ReadOnlyField
              label="Anaesthetist"
              value={surgery?.anaesthetist}
            />
            {/* <ReadOnlyField
              label="Anaesthesiologist Assistants"
              value={anaesthesiaDetail?.anaesthetist_assistant}
            /> */}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default GenralAnesthesiaInfo;
