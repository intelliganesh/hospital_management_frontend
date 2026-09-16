import { RootState } from "@/actions/store";
import Input from "@/components/input";
import View from "@/components/view";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";

const SectionThree: React.FC = () => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData
  ) as Partial<PreliminaryNotes> | null;

  const { values, handleChange } = useForm<Partial<PreliminaryNotes> | null>(
    preliminaryNotes
  );

  return (
    <>
      <View className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="bp"
            name="bp"
            label="BP"
            placeholder="e.g., 120/80"
            onChange={handleChange}
            value={values?.bp}
          />
        </View>
        <View>
          <Input
            id="pulse"
            name="pulse"
            label="Pulse"
            placeholder="e.g., 72 bpm"
            onChange={handleChange}
            value={values?.pulse}
          />
        </View>
        <View>
          <Input
            id="temperature"
            name="temperature"
            label="Temperature"
            placeholder="e.g., 98.6°F"
            onChange={handleChange}
            value={values?.temperature}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="spo2"
            name="spo2"
            label="SpO2"
            placeholder="e.g., 98%"
            onChange={handleChange}
            value={values?.spo2}
          />
        </View>
        <View>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            label="Weight (kg)"
            placeholder="Enter weight"
            onChange={handleChange}
            value={values?.weight}
          />
        </View>
        <View>
          <Input
            id="height"
            name="height"
            type="number"
            step="0.1"
            label="Height (cm)"
            placeholder="Enter height"
            onChange={handleChange}
            value={values?.height}
          />
        </View>
      </View>
    </>
  );
};

export default SectionThree;
