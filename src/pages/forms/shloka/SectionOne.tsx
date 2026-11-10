import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { Shloka } from "@/interfaces/slices/shloka";
import useForm from "@/utils/custom-hooks/use-form";
import { shlokaStatusOptions } from "./shlokaFormOptions";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsTitle: string;
  errorsVerseText: string;
  errorsStatus: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsTitle,
  errorsVerseText,
  errorsStatus,
}) => {
  const shlokaData = useSelector(
    (state: RootState) => state?.shloka?.shlokaDetailData,
  );
  const { values, handleChange, onSetHandler } =
    useForm<Partial<Shloka> | null>(shlokaData);

  return (
    <>
      <View className="grid grid-cols-1 gap-4 mb-4">
        <Input
          id="title"
          name="title"
          required={true}
          label="Title"
          error={errorsTitle}
          value={values?.title}
          placeholder="Shloka title"
          onChange={handleChange}
        />
      </View>
      <View className="grid grid-cols-1 gap-4 mb-4">
        <Textarea
          id="verse_text"
          name="verse_text"
          required={true}
          label="Shloka Text"
          error={errorsVerseText}
          value={values?.verse_text || ""}
          placeholder="Enter the shloka / verse text"
          className="bg-white min-h-[140px]"
          onChange={handleChange}
        />
      </View>
      <View className="grid grid-cols-1 gap-4 mb-4">
        <SingleSelector
          id="status"
          label="Status"
          name="status"
          error={errorsStatus}
          value={values?.status || shlokaStatusOptions[0].value}
          placeholder="Select Status"
          onChange={(value) => {
            onSetHandler("status", value);
          }}
          options={shlokaStatusOptions}
          required={true}
        />
      </View>
    </>
  );
};
export default SectionOne;
