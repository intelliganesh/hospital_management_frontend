import Input from "@/components/input";
import View from "@/components/view";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import useForm from "@/utils/custom-hooks/use-form";
import SingleSelector from "@/components/SingleSelector";
import { reactiveOptions } from "./preliminaryFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";

const SectionFive: React.FC = () => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData
  ) as Partial<PreliminaryNotes> | null;

  const { values, handleChange, onSetHandler } =
    useForm<Partial<PreliminaryNotes> | null>(preliminaryNotes);

  return (
    <>
      <View className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="hb"
            name="hb"
            label="Hb %"
            placeholder="Hemoglobin"
            onChange={handleChange}
            value={values?.hb}
          />
        </View>
        <View>
          <Input
            id="tc"
            name="tc"
            label="TC"
            placeholder="Total Count"
            onChange={handleChange}
            value={values?.tc}
          />
        </View>
        <View>
          <Input
            id="esr"
            name="esr"
            label="ESR"
            placeholder="ESR value"
            onChange={handleChange}
            value={values?.esr}
          />
        </View>
      </View>
      <View className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="rbs"
            name="rbs"
            label="RBS"
            placeholder="Random Blood Sugar"
            onChange={handleChange}
            value={values?.rbs}
          />
        </View>
        <View>
          <Input
            id="bt"
            name="bt"
            label="BT (Bleeding Time)"
            placeholder="Bleeding Time"
            onChange={handleChange}
            value={values?.bt}
          />
        </View>
        <View>
          <Input
            id="ct"
            name="ct"
            label="CT (Clotting Time)"
            placeholder="Clotting Time"
            onChange={handleChange}
            value={values?.ct}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="blood_urea"
            name="blood_urea"
            label="Blood Urea"
            placeholder="Blood Urea"
            onChange={handleChange}
            value={values?.blood_urea}
          />
        </View>
        <View>
          <SingleSelector
            id="hiv"
            label="HIV I & II"
            name="hiv"
            value={values?.hiv || ""}
            placeholder="Select result"
            onChange={(value) => {
              onSetHandler("hiv", value);
            }}
            options={reactiveOptions}
            closeOnSelect={true}
          />
        </View>
        <View>
          <SingleSelector
            id="hbsag"
            label="HBsAg"
            name="hbsag"
            value={values?.hbsag || ""}
            placeholder="Select result"
            onChange={(value) => {
              onSetHandler("hbsag", value);
            }}
            options={reactiveOptions}
            closeOnSelect={true}
          />
        </View>
      </View>
    </>
  );
};

export default SectionFive;
