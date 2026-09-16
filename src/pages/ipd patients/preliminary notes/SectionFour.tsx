import { RootState } from "@/actions/store";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";

const SectionFour: React.FC = () => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData
  ) as Partial<PreliminaryNotes> | null;

  const { values, handleChange } = useForm<Partial<PreliminaryNotes> | null>(
    preliminaryNotes
  );

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Textarea
            id="cvs"
            name="cvs"
            label="CVS"
            placeholder="Cardiovascular examination findings"
            onChange={handleChange}
            value={values?.cvs || ""}
          />
        </View>
        <View>
          <Textarea
            id="rs"
            name="rs"
            label="RS"
            placeholder="Respiratory examination findings"
            onChange={handleChange}
            value={values?.rs || ""}
          />
        </View>
        <View>
          <Textarea
            id="per_abdomen"
            name="per_abdomen"
            label="Per Abdomen"
            placeholder="Abdominal examination findings"
            onChange={handleChange}
            value={values?.per_abdomen || ""}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <View>
          <Textarea
            id="pr"
            name="pr"
            label="P/R"
            placeholder="PR examination findings"
            onChange={handleChange}
            value={values?.pr || ""}
          />
        </View>
        <View>
          <Textarea
            id="dre"
            name="dre"
            label="DRE"
            placeholder="DRE findings"
            onChange={handleChange}
            value={values?.dre || ""}
          />
        </View>
        <View>
          <Textarea
            id="proctoscopy"
            name="proctoscopy"
            label="Proctoscopy"
            placeholder="Proctoscopy findings"
            onChange={handleChange}
            value={values?.proctoscopy || ""}
          />
        </View>
      </View>
      <Textarea
            id="examination_comments"
            name="examination_comments"
            label="Comment"
            placeholder="Comments on examination findings"
            onChange={handleChange}
            value={values?.examination_comments || ""}
          />
    </>
  );
};

export default SectionFour;
