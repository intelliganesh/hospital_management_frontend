import { RootState } from "@/actions/store";
import Input from "@/components/input";
import View from "@/components/view";
import { MeasurementUnit } from "@/interfaces";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import useForm from "@/utils/custom-hooks/use-form";
import { removeUnit } from "@/utils/helperFunctions";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { vitalUnitFields } from "./preliminaryFormOptions";

const SectionThree: React.FC = () => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData
  ) as Partial<PreliminaryNotes> | null;

  // backend sends vitals with unit, show only the value in the fields
  const preliminaryNotesWithoutUnits = useMemo(() => {
    if (!preliminaryNotes) return preliminaryNotes;
    const notes: Partial<PreliminaryNotes> = { ...preliminaryNotes };
    Object.entries(vitalUnitFields).forEach(([field, unit]) => {
      const key = field as keyof PreliminaryNotes;
      (notes as any)[key] = removeUnit(notes[key], unit as MeasurementUnit);
    });
    return notes;
  }, [preliminaryNotes]);

  const { values, handleChange } = useForm<Partial<PreliminaryNotes> | null>(
    preliminaryNotesWithoutUnits
  );

  return (
    <>
      <View className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Input
            id="bp"
            name="bp"
            label={`BP (${MeasurementUnit.MMHG})`}
            placeholder="e.g., 120/80"
            onChange={handleChange}
            value={values?.bp}
          />
        </View>
        <View>
          <Input
            id="pulse"
            name="pulse"
            label={`Pulse (${MeasurementUnit.BPM})`}
            placeholder="e.g., 72"
            onChange={handleChange}
            value={values?.pulse}
          />
        </View>
        <View>
          <Input
            id="temperature"
            name="temperature"
            label={`Temperature (${MeasurementUnit.FAHRENHEIT})`}
            placeholder="e.g., 98.6"
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
            label={`SpO2 (${MeasurementUnit.PERCENTAGE})`}
            placeholder="e.g., 98"
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
            label={`Weight (${MeasurementUnit.KG})`}
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
            label={`Height (${MeasurementUnit.CM})`}
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
