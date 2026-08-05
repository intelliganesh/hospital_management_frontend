import React from "react";
import View from "@/components/view";
import Textarea from "@/components/Textarea";
import FormSection from "../../pac/components/FormSection";
import { Syringe, FileText } from "lucide-react";
import useForm from "@/utils/custom-hooks/use-form";

interface SurgicalDetails {
  operation_done?: string;
  findings_procedure?: string;
}

interface Props {
  readOnly?: boolean;
}

const SurgicalDetailsTab: React.FC<Props> = ({ readOnly = false }) => {
  const { values, handleChange } = useForm<SurgicalDetails>({});

  return (
    <View className="space-y-6">
      {/* Operation Done */}
      <FormSection title="Operation Done" icon={Syringe}>
        <Textarea
          name="operation_done"
          value={values?.operation_done || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[120px]"
          placeholder="Enter surgical procedures performed (e.g., Ksharakarma, Agnikarma, Chedana)..."
        />
      </FormSection>

      {/* Findings And Procedure */}
      <FormSection title="Findings And Procedure" icon={FileText}>
        <Textarea
          name="findings_procedure"
          value={values?.findings_procedure || ""}
          onChange={handleChange}
          disabled={readOnly}
          className="bg-white min-h-[120px]"
          placeholder="Enter detailed surgical findings and procedure description..."
        />
      </FormSection>
    </View>
  );
};

export default SurgicalDetailsTab;
