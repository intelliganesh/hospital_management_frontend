import { RootState } from "@/actions/store";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import {
  Comorbidity,
  comorbidityStatusTyeOptions,
  // isChronicTypeOptions,
} from "@/interfaces/slices/comorbidities";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import DepartmentType from "../departmentType/DepartmentType";
import SingleSelector from "@/components/SingleSelector";
import { GenericStatus } from "@/interfaces";

interface SectionOneProps {
  errorsName: string;
  errorsIsChronic: string;
  errorsStatus: string;
  errorsDepartmentType: string;
  iAmIn?: string;
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  // errorsIsChronic,
  errorsStatus,
  errorsDepartmentType,
  iAmIn = "",
}) => {
  const ComorbidityData = useSelector(
    (state: RootState) => state.comorbidities.comorbidityDetails
  );

  const departmentType = iAmIn ? useSelector(
    (state: any) => state?.consultation?.consultationDetailData
  ).consultations?.type : "";

  const { values, handleChange, onSetHandler } =
    useForm<Partial<Comorbidity> | null>(ComorbidityData);
  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <View className="col-span-2">
          <Input
            id="name"
            name="name"
            required={true}
            error={errorsName}
            value={values?.name}
            label="Comorbidity Name"
            onChange={handleChange}
            placeholder="BP, Diabetes, etc."
          />
        </View>
        {/* <View>
          <SingleSelector
            id="is_chronic"
            required={true}
            name="is_chronic"
            label="Is Chronic"
            error={errorsIsChronic}
            placeholder="Is Chronic"
            value={values?.is_chronic ? true : false}
            options={isChronicTypeOptions}
            onChange={(e) => onSetHandler("is_chronic", e.target.value)}
          />
        </View> */}
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
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 mt-4">
        <View>
          <DepartmentType
            value={values?.department_type ? values?.department_type : (iAmIn === "consultation") && departmentType ? departmentType : ""}
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
            options={comorbidityStatusTyeOptions}
            onChange={(e) => onSetHandler("is_active", e.target.value)}
          />
        </View>
      </View>
    </>
  );
};

export default SectionOne;
