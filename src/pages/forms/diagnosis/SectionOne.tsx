import { RootState } from "@/actions/store";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import {
  Diagnosis,
  diagnosisStatusOptions,
} from "@/interfaces/slices/diagnosis";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import DepartmentType from "../departmentType/DepartmentType";
import SingleSelector from "@/components/SingleSelector";
import { GenericStatus } from "@/interfaces";

interface SectionOneProps {
  errorsDiagnosisName: string;
  errorsStatus: string;
  errorsDepartmentType: string;
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsDiagnosisName,
  errorsStatus,
  errorsDepartmentType,
}) => {
  const diagnosisData = useSelector(
    (state: RootState) => state.diagnosis.diagnosisDetails
  );
  const { values, handleChange, onSetHandler } =
    useForm<Partial<Diagnosis> | null>(diagnosisData);
  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <View>
          <Input
            required={true}
            id="diagnosis_name"
            name="diagnosis_name"
            label="Diagnosis Name"
            onChange={handleChange}
            error={errorsDiagnosisName}
            placeholder="Diagnosis Name"
            value={values?.diagnosis_name}
          />
        </View>
        <View>
          <Input
            id="icd_code"
            name="icd_code"
            label="ICD Code"
            onChange={handleChange}
            placeholder="ICD Code"
            value={values?.icd_code}
          />
        </View>
      </View>
      <View>
        <Textarea
          id="description"
          label="Description"
          name="description"
          placeholder="Description"
          value={values?.description ?? ""}
          onChange={handleChange}
        />
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <View>
          <DepartmentType
            value={values?.department_type}
            error={errorsDepartmentType}
            onChange={(value) => onSetHandler("department_type", value)}
            required={true}
          />
        </View>
        <View>
          <SingleSelector
            id="is_active"
            required={true}
            name="is_active"
            label="Status"
            error={errorsStatus}
            placeholder="Status"
            value={values?.is_active || GenericStatus.ACTIVE}
            options={diagnosisStatusOptions}
            onChange={(e) => onSetHandler("is_active", e.target.value)}
          />
        </View>
      </View>
    </>
  );
};

export default SectionOne;
