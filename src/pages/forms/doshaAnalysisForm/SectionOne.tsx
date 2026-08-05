import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
// import { appointmentTypeOptions, statusOptions } from "./appointmentFormOptions";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
// import { categoryOptions, statusOptions } from "./findingsFormOptions";
import { useSelector } from "react-redux";
import { DoshaAnalysis } from "@/interfaces/doshaAnalysis";
import useDoshaAnalysis from "@/pages/doshaAnalysis";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsName: string;
  errorsDescription: string;
  errorsStatus: string;
  errorsCategory: string;
  formType: "add" | "edit";
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsName,
  formType,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { type } = useParams();
  const doshaAnalysisData = useSelector(
    (state: any) => state.doshaAnalysis.doshaAnalysisDetailData
  );
  const doshaAnalysisOptions = useSelector(
    (state: any) => state.doshaAnalysis.doshaAnalysisOptions
  );
  const { values, handleChange, onSetHandler } = useForm<DoshaAnalysis | null>(
    doshaAnalysisData
  );
  const { DetailHandler, OptionsListHandler, cleanUp } = useDoshaAnalysis();
  useEffect(() => {
    if (!id && formType === "edit") {
      navigate(-1);
      return;
    }
  }, [id, formType]);
  useEffect(() => {
    if (id) {
      DetailHandler(id, () => {});
      OptionsListHandler(() => {});
    }
    return () => {
      cleanUp();
    };
  }, [id]);
  return (
    <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <View>
        <Input
          id="name"
          name="name"
          required={true}
          error={errorsName}
          label="Name"
          value={values?.name}
          onChange={handleChange}
          placeholder="Ex: Doctor"
        />
      </View>

      <View>
        {/* <Select
          id="value"
          name="value"
          label="Dosha"
          // error={errorsCategory}
          value={values?.value ?? ""}
          placeholder={`Select ${type}`}
          options={doshaAnalysisOptions?.map((item: any) => ({
            label: item.lable,
            value: item.value,
          }))}
          onChange={handleChange}
          required={true}
        /> */}
        <SingleSelector
          id="value"
          label="Dosha"
          name="value"
          // error={errorsCategory}
          value={values?.value ?? ""}
          placeholder={`Select ${type}`}
          onChange={(value) => {
            onSetHandler("value", value);
          }}
          options={doshaAnalysisOptions?.map((item: any) => ({
            label: item.lable,
            value: item.value,
          }))}
          required={true}
        />
      </View>
    </View>
  );
};
export default SectionOne;
