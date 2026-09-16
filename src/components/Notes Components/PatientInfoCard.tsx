import React from "react";
import View from "@/components/view";
import Text from "@/components/text";

export interface PatientDetail {
  label: string;
  value: string;
  className?: string;
}

export interface PatientInfoCardProps {
  title?: string;
  patientDetails: PatientDetail[];
  columns?: 1 | 2 | 3 | 4;
  renderCustom?: (details: PatientDetail[]) => React.ReactNode;
  className?: string;
  features?: {
    reverseLabelValue?: boolean;
  }
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  title = "Patient Information",
  patientDetails,
  columns = 3,
  renderCustom,
  className = "",
  features = { reverseLabelValue: false }
}) => {
  // If custom render is provided, use it
  if (renderCustom) {
    return (
      <View
        className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 ${className}`}
      >
        {title && (
          <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
            {title}
          </Text>
        )}
        {renderCustom(patientDetails)}
      </View>
    );
  }

  // Default grid layout
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <View
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 ${className}`}
    >
      {title && (
        <Text className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-primary-600 dark:border-primary-500">
          {title}
        </Text>
      )}
      <View className={`grid ${gridColsClass} gap-x-8 gap-y-4`}>
        {patientDetails.map((detail, index) => (
          <View key={index} className={detail.className + (features.reverseLabelValue ? " flex flex-col" : "")}>
            <Text className={`text-xs text-slate-500 dark:text-slate-400 mb-1 ${features.reverseLabelValue ? "order-2" : "order-1"}`}>
              {detail.label}
            </Text>
            <Text className={`text-sm font-semibold text-slate-900 dark:text-white ${features.reverseLabelValue ? "order-1" : "order-2"}`}>
              {detail.value || "N/A"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PatientInfoCard;
