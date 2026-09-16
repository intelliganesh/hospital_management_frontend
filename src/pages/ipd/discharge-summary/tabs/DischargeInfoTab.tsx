import React from "react";
import View from "@/components/view";
import Textarea from "@/components/Textarea";
import FormSection from "../../pac/components/FormSection";
// import DynamicFormGroup from "@/components/DynamicFormGroup";
import { Activity, Pill, AlertTriangle } from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";
import MedicinesSection from "@/components/MedicinesSection";
import CombinationMedicineSection from "@/components/CombinationMedicineSection";

interface Medication {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

interface DischargeInfo {
  course_in_hospital?: string;
  health_condition_at_discharge?: string;
  medications?: Medication[];
  special_instructions?: string;
}

interface Props {
  readOnly?: boolean;
}

const DischargeInfoTab: React.FC<Props> = ({ readOnly = false }) => {
  const { values, handleChange } = useForm<DischargeInfo>({
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
  });

  return (
    <View className="space-y-6">
      {/* Course In Hospital */}
      <FormSection title="Course In Hospital" icon={Activity}>
        <Textarea
          name="course_in_hospital"
          value={values?.course_in_hospital || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[120px]"
          placeholder="Enter the treatment timeline and course during hospitalization..."
        />
      </FormSection>

      {/* Patient's Health Condition at Discharge */}
      <FormSection
        title="Patient's Health Condition at Discharge"
        icon={AlertTriangle}
      >
        <Textarea
          name="health_condition_at_discharge"
          value={values?.health_condition_at_discharge || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter current health status (e.g., General health condition is good with stable vitals and no bleeding at wound site)..."
        />
      </FormSection>

      {/* Advice On Discharge - Medications */}
      <FormSection title="Advice On Discharge - Medications" icon={Pill}>
        {/* <DynamicFormGroup
          title=""
          entryLabel="Medication"
          data={values?.medications || []}
          onChange={(data) => onSetHandler("medications", data)}
          minGroups={1}
          readOnly={readOnly}
          fields={[
            {
              key: "name",
              label: "Medicine Name",
              type: "text",
              placeholder: "e.g., Tab K-Flam G 2",
              colSpan: 1,
            },
            {
              key: "dosage",
              label: "Dosage",
              type: "text",
              placeholder: "e.g., 2 tablets",
              colSpan: 1,
            },
            {
              key: "frequency",
              label: "Frequency",
              type: "text",
              placeholder: "e.g., Bid Before Food",
              colSpan: 1,
            },
            {
              key: "duration",
              label: "Duration",
              type: "text",
              placeholder: "e.g., 5 days",
              colSpan: 1,
            },
          ]}
        /> */}

        <View className="rounded-lg">
          <MedicinesSection
            // errorsDosage={errorsDosage}
            // errorsTiming={errorsTiming}
            // errorsMedicines={errorsMedicines}
            medicinesList={[]}
            medicineData={[]}
            // medicineData={postExaminationData?.medicines}
            onSetHandler={() => {}}
          />
        </View>

        <View className="mt-4 rounded-lg">
          <CombinationMedicineSection
            medicinesList={[]}
            combinationMedicineData={[]}
            onSetHandler={() => {}}
          />
        </View>
      </FormSection>

      {/* Special Instructions */}
      <FormSection title="Special Instructions" icon={AlertTriangle}>
        <Textarea
          name="special_instructions"
          value={values?.special_instructions || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter any special instructions (e.g., Sitz bath twice daily for one month, P/R oiling once daily)..."
        />
      </FormSection>
    </View>
  );
};

export default DischargeInfoTab;
