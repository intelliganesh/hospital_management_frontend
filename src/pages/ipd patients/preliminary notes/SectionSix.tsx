import { RootState } from "@/actions/store";
import RadioGroup from "@/components/RadioGroup";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";

const SectionSix: React.FC = () => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData
  ) as Partial<PreliminaryNotes> | null;

  const { values, handleChange, onSetHandler } =
    useForm<Partial<PreliminaryNotes> | null>(preliminaryNotes);

  return (
    <>
      <View>
        <RadioGroup
          name="line_of_treatment"
          label="Line of Treatment"
          value={values?.line_of_treatment || ""}
          onChange={(value) => onSetHandler("line_of_treatment", value)}
          options={[
            { label: "Medical", value: "Medical" },
            { label: "Surgical", value: "Surgical" },
          ]}
        />
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Textarea
            id="provisional_diagnosis"
            name="provisional_diagnosis"
            label="Provisional Diagnosis"
            placeholder="Initial diagnosis"
            onChange={handleChange}
            value={values?.provisional_diagnosis || ""}
          />
        </View>
        <View>
          <Textarea
            id="final_diagnosis"
            name="final_diagnosis"
            label="Final Diagnosis"
            placeholder="Confirmed diagnosis"
            onChange={handleChange}
            value={values?.final_diagnosis || ""}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Textarea
            id="treatment_advised"
            name="treatment_advised"
            label="Treatment Advised"
            placeholder="Detailed treatment plan"
            onChange={handleChange}
            value={values?.treatment_advised || ""}
          />
        </View>
        <View>
          <Textarea
            id="treatment_given"
            name="treatment_given"
            label="Treatment Given"
            placeholder="Detailed treatment plan"
            onChange={handleChange}
            value={values?.treatment_given || ""}
          />
        </View>
      </View>
      <View>
        <Textarea
          id="preoperative_instruction"
          name="preoperative_instruction"
          label="Preoperative Instructions"
          placeholder="Preoperative instructions"
          onChange={handleChange}
          value={values?.preoperative_instruction || ""}
        />
      </View>
    </>
  );
};

export default SectionSix;
