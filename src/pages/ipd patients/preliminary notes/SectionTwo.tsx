import { RootState } from "@/actions/store";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import { PreliminaryNotes } from "@/interfaces/preliminaryNotes";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";

interface SectionTwoProps {
  errorsChiefComplaints?: string;
}

const SectionTwo: React.FC<SectionTwoProps> = ({ errorsChiefComplaints }) => {
  const preliminaryNotes = useSelector(
    (state: RootState) => state.preliminaryNotes.preliminaryNotesDetailData
  ) as Partial<PreliminaryNotes> | null;

  const { values, handleChange } = useForm<Partial<PreliminaryNotes> | null>(
    preliminaryNotes
  );

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Textarea
            id="chief_complaint"
            name="chief_complaint"
            required={true}
            label="Chief Complaints With Duration"
            error={errorsChiefComplaints}
            placeholder="Describe main complaints"
            onChange={handleChange}
            value={values?.chief_complaint || ""}
          />
        </View>
        <View>
          <Textarea
            id="associated_complaint"
            name="associated_complaint"
            label="Associated Complaints"
            placeholder="Other related symptoms"
            onChange={handleChange}
            value={values?.associated_complaint || ""}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Textarea
            id="previous_treatment_history"
            name="previous_treatment_history"
            label="Previous Treatment History"
            placeholder="Details of any previous treatment"
            onChange={handleChange}
            value={values?.previous_treatment_history || ""}
          />
        </View>
        <View>
          <Textarea
            id="medical_history"
            name="medical_history"
            label="Medical History"
            placeholder="Associated medical illness & current medications"
            onChange={handleChange}
            value={values?.medical_history || ""}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <View>
          <Textarea
            id="family_history"
            name="family_history"
            label="Family History"
            placeholder="Relevant family medical history"
            onChange={handleChange}
            value={values?.family_history || ""}
          />
        </View>
        <View>
          <Textarea
            id="personal_history"
            name="personal_history"
            label="Personal History"
            placeholder="Lifestyle, habits, etc."
            onChange={handleChange}
            value={values?.personal_history || ""}
          />
        </View>
      </View>
      <View className="mb-4">
        <Textarea
          id="allergy"
          name="allergy"
          label="Allergies"
          placeholder="Any known allergies"
          onChange={handleChange}
          value={values?.allergy || ""}
        />
      </View>
    </>
  );
};

export default SectionTwo;
