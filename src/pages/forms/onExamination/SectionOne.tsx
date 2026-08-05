import { RootState } from "@/actions/store";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import View from "@/components/view";
import { GenericStatus } from "@/interfaces";
import {
  OnExamination,
  onExaminationTypeOptions,
} from "@/interfaces/slices/onExamination";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import DepartmentType from "../departmentType/DepartmentType";

interface SectionOneProps {
  iAmIn?: string;
  errorsFinding: string;
  errorsStatus: string;
  errorsDepartmentType: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  iAmIn = "",
  errorsFinding,
  errorsStatus,
  errorsDepartmentType
}) => {
  const onExaminationData = useSelector(
    (state: RootState) => state.onExamination.onExaminationDetailData
  );

  const departmentType = iAmIn ? useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  ).consultations?.type : "";

  const { values, handleChange, onSetHandler } =
    useForm<Partial<OnExamination> | null>(onExaminationData);
  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <View>
          <Input
            id="finding"
            name="finding"
            label="Finding"
            required={true}
            value={values?.finding ?? ""}
            onChange={handleChange}
            error={errorsFinding}
            placeholder="Finding"
          />
        </View>
        <View>
          <Input
            id="examination_type"
            name="examination_type"
            label="Examination Type"
            value={values?.examination_type ?? ""}
            onChange={handleChange}
            placeholder="Examination Type"
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <View>
          <Input
            id="normal_range"
            name="normal_range"
            label="Normal Range"
            value={values?.normal_range ?? ""}
            onChange={handleChange}
            placeholder="Normal Range"
          />
        </View>
        <View>
          <DepartmentType
            value={values?.department_type ? values?.department_type : (iAmIn === "consultation") && departmentType ? departmentType : ""}
            error={errorsDepartmentType}
            onChange={(value) => onSetHandler("department_type", value)}
            required={true}
          />
        </View>
      </View>
      <View>
        <SingleSelector
          id="is_active"
          label="Status"
          name="is_active"
          required={true}
          error={errorsStatus}
          value={values?.is_active || GenericStatus.ACTIVE}
          placeholder="Select Status"
          onChange={(value) => {
            onSetHandler("is_active", value);
          }}
          options={onExaminationTypeOptions}
        />
      </View>
    </>
  );
};

export default SectionOne;
