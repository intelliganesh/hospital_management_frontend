import dayjs from "dayjs";
import { MapPin, User } from "lucide-react";
import Text from "@/components/text";
import View from "@/components/view";
import { Card } from "@/components/ui/card";
import { DischargeSummaryForm } from "./types";

interface BasicDetailsProps {
  dischargeSummaryData?: Partial<DischargeSummaryForm>;
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex gap-2">
    <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 min-w-[140px]">
      {label}
    </Text>
    <Text className="text-sm text-slate-800 dark:text-slate-200">
      : {value}
    </Text>
  </View>
);

const BasicDetails: React.FC<BasicDetailsProps> = ({
  dischargeSummaryData,
}) => {
  const ipd = dischargeSummaryData?.ipd;

  return (
    <Card className="p-6">
      <View className="flex items-center gap-2 mb-4">
        <View className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </View>
        <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Patient Information
        </Text>
        <Text className="text-xs text-slate-500 ml-2">(Read Only)</Text>
      </View>

      <View className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <View className="space-y-3">
          <InfoItem label="IPD No" value={ipd?.ipd_number || "-"} />
          <InfoItem label="Patient Name" value={ipd?.patient_name || "-"} />
          <InfoItem label="Patient ID" value={ipd?.patient_number || "-"} />
          <InfoItem
            label="Age"
            value={ipd?.patient_age ? `${ipd.patient_age}` : "-"}
          />
          <InfoItem label="Phone" value={ipd?.patient_phone || "-"} />
          <InfoItem
            label="Attendant"
            value={ipd?.patient_attendant_name || "-"}
          />
          <InfoItem
            label="Attendant Phone"
            value={ipd?.patient_attendant_phone || "-"}
          />
        </View>

        <View className="space-y-3">
          <InfoItem label="Doctor" value={ipd?.doctor_name || "-"} />
          <InfoItem
            label="Ward"
            value={`${ipd?.ward_number || "-"} (${ipd?.ward_type || "-"})`}
          />
          <InfoItem
            label="Room"
            value={`${ipd?.room_number || "-"} (${ipd?.room_type || "-"})`}
          />
          <InfoItem label="Bed" value={ipd?.bed_number || "-"} />
          <InfoItem
            label="Admission"
            value={
              ipd?.admission_date_time
                ? dayjs(ipd.admission_date_time).format("DD-MM-YYYY hh:mm A")
                : "-"
            }
          />
          <InfoItem label="Status" value={ipd?.status || "-"} />

          <View className="flex gap-2">
            <View className="flex items-start gap-1">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
            </View>

            <View>
              <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Address
              </Text>
              <Text className="text-sm text-slate-800 dark:text-slate-200 mt-1">
                {ipd?.patient_address?.trim() || "-"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default BasicDetails;
