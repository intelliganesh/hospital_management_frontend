import React from "react";
// import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
// import SearchSelect from "@/components/SearchSelect";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Medicine } from "@/interfaces/medicines";
// import { dosageFormOptions, strengthUnitOptions } from "./medicinesFormOptions";
import SingleSelector from "@/components/SingleSelector";
// import DepartmentType from "../departmentType/DepartmentType";

interface SectionTwoProps {
  errorsDepartmentType: string;
  errorsIsActive: string;
  // errorsStrength: string;
}

const SectionTwo: React.FC<SectionTwoProps> = () => {
  const medicineDetails = useSelector(
    (state: RootState) => state.medicines.medicineDetailData
  );
  // const [dosage, setDosage] = useState('tablet');
  // const [strength, setStrength] = useState('mg/ml');

  const { values, onSetHandler } = useForm<Medicine | null>(
    medicineDetails
  );

  // const [temp, setTemp] = React.useState(`\u00B0C`);

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <View className="space-y-2">
          {/* <Select
            label="Dosage Form"
            name="dosage_form"
            placeholder="Select Dosage Form"
            value={values?.dosage_form || ""}
            onChange={handleChange}
            options={dosageFormOptions}
            className=""
            required={true}
          /> */}
          {/* <SingleSelector
            id="dosage_form"
            label="Dosage Form"
            name="dosage_form"
            // error={errorsIsActive}
            value={values?.dosage_form || ""}
            placeholder="Select Dosage Form"
            onChange={(value) => {
              onSetHandler("dosage_form", value);
            }}
            options={dosageFormOptions}
          /> */}
          {/* <Input
          id="dosage"
          name="dosage"
          label="Dosage"
          onChange={handleChange}
          // error={errorsEnrollFees}
          value={values?.dosage ? values?.dosage?.split(" ")[0] : "" } 
          placeholder="Ex: 1 tablet"
          required={true}
        /> */}
        </View>
        {/* <View className="space-y-2">
          <Input
            id="strength"
            name="strength"
            label="Strength"
            onChange={handleChange}
            error={errorsStrength}
            value={values?.strength || ""}
            placeholder="Ex: 10"
          />
        </View> */}
        <View>
          {/* <Select
            name="strength_unit"
            label="Strength Unit"
            required={true}
            placeholder="Select Strength Unit"
            value={values?.strength_unit || ""}
            onChange={handleChange}
            options={strengthUnitOptions}
            className=""
          /> */}
          {/* <SingleSelector
            id="strength_unit"
            label="Strength Unit"
            name="strength_unit"
            // error={errorsIsActive}
            value={values?.strength_unit || ""}
            placeholder="Select Strength Unit"
            onChange={(value) => {
              onSetHandler("strength_unit", value);
            }}
            options={strengthUnitOptions}
          /> */}
        </View>
      </View>

      <View className="grid grid-cols-1 gap-6">
        {/* <View>
          <DepartmentType
            // required={true}
            // error={errorsDepartmentType}
            value={values?.department_type || ""}
            onChange={(value) => onSetHandler("department_type", value)}
          />
        </View> */}
        <View className="">
          <SingleSelector
            id="is_active"
            label="Is Active"
            name="is_active"

            // error={errorsIsActive}
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
            ]}
            required={true}
          />
        </View>
      </View>
    </React.Fragment>
  );
};
export default SectionTwo;
