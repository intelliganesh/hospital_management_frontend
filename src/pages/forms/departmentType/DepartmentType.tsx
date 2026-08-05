import SingleSelector from "@/components/SingleSelector";
import View from "@/components/view";
import { departmentTypeOptions, caseTypeOptions } from "@/interfaces/slices/departmentType";

interface Props {
  value: string | undefined;
  caseTypeValue?: string | undefined;
  onChange: (value: string) => void;
  onCaseTypeChange?: (value: string) => void;
  error?: string;
  caseTypeError?: string;
  showCaseType?: boolean;
  required?: boolean;
  caseTypeRequired?: boolean;
  className?: string;

}

const DepartmentType: React.FC<Props> = ({ value, onChange, caseTypeValue, onCaseTypeChange, caseTypeError, error, showCaseType = false, required = false, caseTypeRequired = false, className = "" }) => {
  return (
    <View className={`grid grid-cols-1 ${className}`}>
     <View>
      <SingleSelector
        id="department_type"
        required={required}
        name="department_type"
        label="Department Type"
        error={error}
        placeholder="Select Department Type"
        value={value || ""}
        options={departmentTypeOptions}
        onChange={(e: any) => onChange(e.target.value)}
        // closeOnSelect
      />
    </View>
    {
      showCaseType && (
       <View>
      <SingleSelector
        id="case_type"
        required={caseTypeRequired}
        name="case_type"
        label="Case Type"
        error={caseTypeError}
        placeholder="Select Case Type"
        value={caseTypeValue}
        options={caseTypeOptions}
        onChange={(e: any) => onCaseTypeChange?.(e.target.value)}
      />
    </View>
      )
    }
    </View>
  );
};

export default DepartmentType;
