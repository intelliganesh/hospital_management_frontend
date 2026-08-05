import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Department } from "@/interfaces/departments";
import Textarea from "@/components/Textarea";
import SingleSelector from "@/components/SingleSelector";
import DepartmentType from "../../departmentType/DepartmentType";

interface SectionOneProps {
  errorsName: string;
  errorsCode: string;
  errorsIsActive: string;
  errorsDescription: string;
  errorsDepartmentType: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  errorsCode,
  errorsIsActive,
  errorsDescription,
  errorsDepartmentType,
}) => {
  const departmentsData = useSelector(
    (state: RootState) => state?.department?.departmentDetailData
  ) as Partial<Department> | null;
  const { values, handleChange, onSetHandler } =
    useForm<Partial<Department> | null>(departmentsData);

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <View>
          <Input
            id="name"
            name="name"
            required={true}
            label="Department Name"
            error={errorsName}
            value={values?.name || ""}
            placeholder="Ex: Cardiology"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="code"
            name="code"
            label="Department Code"
            error={errorsCode}
            value={values?.code || ""}
            placeholder="Ex: CARD"
            onChange={handleChange}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 gap-6  mt-4">
        <View>
          <Textarea
            id="description"
            name="description"
            label="Description"
            error={errorsDescription}
            value={values?.description || ""}
            placeholder="Ex: Cardiology Department Description"
            onChange={handleChange}
          />
        </View>
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
          {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <View>
          <SingleSelector
            id="type_of_department"
            label="Type of Department"
            name="type_of_department"
            error={errorsDepartmentType}
            value={values?.type_of_department || ""}
            placeholder="Select Department Type"
            onChange={(value) => {
              onSetHandler("type_of_department", value);
            }}
            options={departmentTypeOptions}
            required={true}
          />
        </View>
        <View> */}
          {/* <Select
            id="is_active"
            name="is_active"
            required={true}
            label="Is Active"
            error={errorsIsActive}
            value={values?.is_active + ""}
            options={[
              { label: "Yes", value: "1" },
              { label: "No", value: "0" },
            ]}
            onChange={(e) => {
              onSetHandler("is_active", e.currentTarget.value);
            }}
          /> */}

          <SingleSelector
            id="is_active"
            label="Is Active"
            name="is_active"
            error={errorsIsActive}
            value={
              values?.is_active === null || values?.is_active === undefined
                ? "1"
                : values?.is_active
                ? "1"
                : "0"
            }
            placeholder="Select Is Active"
            onChange={(value) => {
              onSetHandler("is_active", value);
            }}
            options={[
              { label: "Yes", value: "1" },
              { label: "No", value: "0" },
              // { label: "Pending", value: "2" },
            ]}
            required={true}
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
