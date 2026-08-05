import React from "react";
import View from "@/components/view";
import Textarea from "@/components/Textarea";
import FormSection from "../../pac/components/FormSection";
import { FileText, Activity, Stethoscope, FlaskConical } from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";

interface MedicalDetails {
  diagnosis?: string;
  case_history?: string;
  general_examination?: string;
  systemic_examination?: string;
  investigations?: string;
}

interface Props {
  readOnly?: boolean;
}

const MedicalDetailsTab: React.FC<Props> = ({ readOnly = false }) => {
  const { values, handleChange } = useForm<MedicalDetails>({});

  return (
    <View className="space-y-6">
      {/* Diagnosis */}
      <FormSection title="Diagnosis" icon={FileText}>
        <Textarea
          name="diagnosis"
          value={values?.diagnosis || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter primary diagnosis..."
        />
      </FormSection>

      {/* Case History & Complaints */}
      <FormSection title="Case History & Complaints" icon={Stethoscope}>
        <Textarea
          name="case_history"
          value={values?.case_history || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[120px]"
          placeholder="Enter patient's medical history and complaints..."
        />
      </FormSection>

      {/* General Examination */}
      <FormSection title="General Examination" icon={Activity}>
        <Textarea
          name="general_examination"
          value={values?.general_examination || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter general examination findings (e.g., RS - B/L NVBS heard, CVS - S1 and S2 Heard, CNS - No neuromuscular deficit)..."
        />
      </FormSection>

      {/* Systemic Examination */}
      <FormSection title="Systemic Examination" icon={Activity}>
        <Textarea
          name="systemic_examination"
          value={values?.systemic_examination || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter systemic examination findings (e.g., P/R - Posterior sentinel tag +, DRE - Hypertonic Sphincter)..."
        />
      </FormSection>

      {/* Investigations */}
      <FormSection title="Investigations" icon={FlaskConical}>
        <Textarea
          name="investigations"
          value={values?.investigations || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[100px]"
          placeholder="Enter investigation results (e.g., All reports enclosed and given to patient)..."
        />
      </FormSection>
    </View>
  );
};

export default MedicalDetailsTab;
