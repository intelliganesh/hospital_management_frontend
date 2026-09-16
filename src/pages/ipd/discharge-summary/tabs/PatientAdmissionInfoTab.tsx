import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import { User, Calendar, MapPin, Stethoscope, FileText } from "lucide-react";
import dayjs from "dayjs";

interface Props {
  readOnly?: boolean;
}

// Dummy data - in real app, this would come from API/context
const patientData = {
  ip_no: "1193",
  patient_name: "KEERTHANA V",
  age: "34",
  sex: "F",
  mr_no: "2236",
  address:
    "226, 1ST PHASE, 40FEET ROAD, MANJUNATHNAGAR, WC ROAD BESIDE ROYAL ENGLISH SCHOOL, RAJAJINAGAR, BANGALORE-560010",
  admission_date: dayjs().subtract(1, "day").format("DD-MM-YYYY"),
  admission_time: "07:42 AM",
  discharge_date: dayjs().format("DD-MM-YYYY"),
  discharge_time: "10:30 AM",
  doctor_incharge: "Dr Ramesh Bhat / Dr Sachin Chavre",
  consultants:
    "Dr Ramesh Bhat (Surgeon), Dr Sachin Chavre (Surgeon), Dr Vinay (Anaesthetist)",
};

// Info Item Component for consistent styling
const InfoItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <View className={`flex gap-2 ${className}`}>
    <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 min-w-[120px]">
      {label}
    </Text>
    <Text className="text-sm text-slate-800 dark:text-slate-200">
      : {value}
    </Text>
  </View>
);

const PatientAdmissionInfoTab: React.FC<Props> = () => {
  return (
    <View className="space-y-6">
      {/* Main Patient Info Card - Similar to PDF Header */}
      <Card className="p-6 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900">
        <View className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Patient Details */}
          <View className="space-y-3">
            <View className="flex items-center gap-2 mb-4">
              <View className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </View>
              <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                Patient Details
              </Text>
            </View>

            <InfoItem label="I.P. No" value={patientData.ip_no} />
            <InfoItem label="Patient's Name" value={patientData.patient_name} />
            <InfoItem
              label="Age/Sex"
              value={`${patientData.age} / ${patientData.sex}`}
            />
            <InfoItem label="MR No" value={patientData.mr_no} />

            <View className="flex gap-2 pt-2">
              <View className="flex items-start gap-1">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Address
                </Text>
                <Text className="text-sm text-slate-800 dark:text-slate-200 mt-1">
                  {patientData.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Column - Admission & Doctor Details */}
          <View className="space-y-3">
            {/* Admission Details */}
            <View className="space-y-3">
              <View className="flex items-center gap-2 mb-4">
                <View className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </View>
                <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Admission & Discharge
                </Text>
              </View>

              <InfoItem
                label="Admission Date & Time"
                value={`${patientData.admission_date} & ${patientData.admission_time}`}
              />
              <InfoItem
                label="Discharge Date & Time"
                value={`${patientData.discharge_date} & ${patientData.discharge_time}`}
              />
            </View>

            {/* Doctor Details */}
            <View className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <View className="flex items-center gap-2 mb-2">
                <View className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </View>
                <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Doctor Information
                </Text>
              </View>

              <InfoItem
                label="Doctor Incharge"
                value={patientData.doctor_incharge}
              />
            </View>
          </View>
        </View>
      </Card>

      {/* Consultants Card */}
      <Card className="p-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <View className="flex items-center gap-2 mb-4">
          <View className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </View>
          <Text className="font-bold text-lg text-slate-800 dark:text-slate-100">
            Consultants
          </Text>
        </View>
        <Text className="text-sm text-slate-800 dark:text-slate-200">
          {patientData.consultants}
        </Text>
      </Card>
    </View>
  );
};

export default PatientAdmissionInfoTab;
