import Input from "@/components/input";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import View from "@/components/view";
import { YogaAsana } from "@/interfaces/slices/yogaAsana";
import useForm from "@/utils/custom-hooks/use-form";
import {
  yogaAsanaLevelOptions,
  yogaAsanaStatusOptions,
} from "./yogaAsanaFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsAsanaName: string;
  errorsDescription: string;
  errorsBenefits: string;
  errorsContraindications: string;
  errorsDifficultyLevel: string;
  errorsRecommendedDuration: string;
  errorsStatus: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsAsanaName,
  errorsDifficultyLevel,
  errorsStatus,
}) => {
  const yogaAsanaData = useSelector(
    (state: RootState) => state?.yogaAsana?.yogaAsanaDetailData
  );
  const { values, handleChange, onSetHandler, handleTipTapChange } =
    useForm<Partial<YogaAsana> | null>(yogaAsanaData);

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Input
            id="asana_name"
            name="asana_name"
            required={true}
            label="Asana Name"
            error={errorsAsanaName}
            value={values?.asana_name}
            placeholder="Asana Name"
            onChange={handleChange}
          />
        </View>
        <View>
          <Input
            id="description"
            name="description"
            label="Description"
            value={values?.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 gap-4 mb-4">
        <View>
          <TipTapTextEditor
            name="benefits"
            label="Benefits"
            areaHeight="h-24"
            value={values?.benefits}
            placeholder="Benefits"
            onChange={handleTipTapChange}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 gap-4 mb-4">
        <View>
          <TipTapTextEditor
            name="contraindications"
            areaHeight="h-24"
            label="Contraindications"
            value={values?.contraindications}
            placeholder="Contraindications"
            onChange={handleTipTapChange}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          {/* <Select
            label="Difficulty Level"
            id="difficulty_level"
            name="difficulty_level"
            className={`w-full`}
            onChange={(e) => onSetHandler("difficulty_level", e.target.value)}
            options={yogaAsanaLevelOptions}
            placeholder="Select Difficulty Level"
            value={values?.difficulty_level || ""}
            required={true}
            error={errorsDifficultyLevel}
          /> */}
          <SingleSelector
            id="difficulty_level"
            label="Difficulty Level"
            name="difficulty_level"
            error={errorsDifficultyLevel}
            value={values?.difficulty_level || ""}
            placeholder="Select Difficulty Level"
            onChange={(value) => {
              onSetHandler("difficulty_level", value);
            }}
            options={yogaAsanaLevelOptions}
            required={true}
          />
        </View>
        <View>
          <Input
            id="recommended_duration"
            name="recommended_duration"
            label="Recommended Duration"
            value={values?.recommended_duration || ""}
            placeholder="Note: Plese enter in seconds"
            onChange={handleChange}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View className="col-span-2">
          {/* <Select
            label="Status"
            id="status"
            name="status"
            className={`w-full`}
            onChange={(e) => onSetHandler("status", e.target.value)}
            options={yogaAsanaStatusOptions}
            placeholder="Select Status"
            value={values?.status || ""}
            required={true}
            error={errorsStatus}
          /> */}
          <SingleSelector
            id="status"
            label="Status"
            name="status"
            error={errorsStatus}
            value={values?.status || yogaAsanaStatusOptions[0].value}
            placeholder="Select Status"
            onChange={(value) => {
              onSetHandler("status", value);
            }}
            options={yogaAsanaStatusOptions}
            required={true}
          />
        </View>
      </View>
    </>
  );
};
export default SectionOne;
