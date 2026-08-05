import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useEffect, useState } from "react";
import { useOpd } from "@/actions/calls/opd";
import useForm from "@/utils/custom-hooks/use-form";
import { AllergyRecord } from "@/interfaces/allergies";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import DepartmentType from "../departmentType/DepartmentType";

interface SectionOneProps {
  errorsNotes: string;
  errorsManagement: string;
  errorsAllergyName: string;
  errorsAllergyType: string;
  errorsDocumentedBy: string;
  errorsOtherAllergenType: string;
  errorDepartmentType: string;
  // errorsDateFirstExperienced: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsNotes,
  errorsAllergyName,
  // errorsAllergyType,
  errorDepartmentType,
  // errorsReactionType,
  // errorsSeverity,
  // errorsDateFirstExperienced,
  // errorsManagement,
  // errorsDocumentedBy,
  // errorsOtherAllergenType,
}) => {
  const { PuaListHandler } = useOpd();

  const allergyData = useSelector(
    (state: RootState) => state.allergies.allergiesDetailData
  );
  const { values, handleChange, onSetHandler, handleTipTapChange } =
    useForm<AllergyRecord | null>(allergyData);
  const [, setOtherAllergenType] = useState<boolean>(false);

  useEffect(() => {
    if (values?.allergen_type === "Other") {
      setOtherAllergenType(true);
    }
    PuaListHandler(() => {});
  }, [values?.allergen_type]);
  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            type="text"
            required={true}
            id="allergen_name"
            name="allergen_name"
            label="Allergy Name"
            onChange={handleChange}
            error={errorsAllergyName}
            value={values?.allergen_name}
            placeholder="Allergy Name"
          />
        </View>
        <View>
                              <DepartmentType
                                value={values?.department_type || ""}
                                error={errorDepartmentType}
                                onChange={(value) => onSetHandler("department_type", value)}
                                required={true}
                              />
                            </View>
        {/* <View> */}
          {/* <Select
            required={true}
            id="allergen_type"
            name="allergen_type"
            label="Allergy Type"
            error={errorsAllergyType}
            placeholder="Allergy Type"
            options={AllergyTypeOptions}
            value={values?.allergen_type}
            onChange={(e: any) => {
              onSetHandler("allergen_type", e.target.value);
              if (e.target.value === "Other") {
                setOtherAllergenType(true);
              }
            }}
          /> */}
          {/* <SingleSelector
            id="allergen_type"
            label="Allergy Type"
            name="allergen_type"
            // error={errorsIsActive}
            value={values?.allergen_type || ""}
            placeholder="Select Allergy Type"
            onChange={(value) => {
              onSetHandler("allergen_type", value);
              if (value === "Other") {
                setOtherAllergenType(true);
              }
            }}
            options={AllergyTypeOptions}
            required={true}
          /> */}
        {/* </View> */}
      </View>
      {/* <View className="grid grid-cols-1 gap-4 mb-4">
        {otherAllergenType && (
          <View>
            <Input
              type="text"
              required={true}
              id="other_allergen_type"
              name="other_allergen_type"
              label="Other Allergy Type"
              onChange={handleChange}
              error={errorsOtherAllergenType}
              placeholder="Other allergy type"
              value={values?.other_allergen_type}
            />
          </View>
        )}
        
      </View> */}
      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"> */}
      {/* <View>
          <Input
            type="date"
            required={true}
            id="date_first_experienced"
            name="date_first_experienced"
            label="Date First Experienced"
            onChange={handleChange}
            error={errorsDateFirstExperienced}
            value={values?.date_first_experienced + ""}
            placeholder="Date First Experienced"
          />
        </View> */}
      {/* <View className="mb-4">
        <Input
          required={true}
          id="documented_by"
          name="documented_by"
          label="Documented By"
          error={errorsDocumentedBy}
          placeholder="Documented By"
          value={values?.documented_by}
          onChange={handleChange}
        />
      </View> */}
      
      {/* </View> */}
      {/* <View>
        <Textarea
          type="text"
          required={true}
          id="management"
          name="management"
          label="Management"
          onChange={handleChange}
          error={errorsManagement}
          value={values?.management}
          placeholder="Management"
        />
      </View> */}
      <View className="mt-4">
        <TipTapTextEditor
          // required={true}
          name="notes"
          label="Notes"
          areaHeight="h-24"
          placeholder="Notes"
          error={errorsNotes}
          value={values?.notes}
          onChange={handleTipTapChange}
        />
      </View>
    </>
  );
};
export default SectionOne;
