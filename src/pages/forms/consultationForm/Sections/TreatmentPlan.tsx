import Input from "@/components/input";
import Text from "@/components/text";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { Card } from "@/components/ui/card";
import View from "@/components/view";
import { Consultation } from "@/interfaces/consultation";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import { TAB_COLORS } from "../consultationFormConfig";

const TreatmentPlan: React.FC<{}> = () => {
  const consultationDetail = useSelector(
    (state: any) => state.consultation.consultationDetailData
  );
  const consultationDetailData = {
    ...consultationDetail?.consultations,
    ...consultationDetail?.proctologyOrNonProctology,
  };
  const { values, handleChange, handleTipTapChange } =
    useForm<Consultation | null>(consultationDetailData);

  return (
    <>
      <View>
        {/* Plan  */}
        <TipTapTextEditor
          name="treatment_plan"
          value={values?.treatment_plan || ""}
          onChange={handleTipTapChange}
          label="Treatment Plan"
          placeholder="Enter plan..."
        />
      </View>

      <Card className="mt-12 shadow-none border-none ">
        <Text className={`text-lg font-bold pb-2 mb-2 ${TAB_COLORS.treatmentPlan.textColor}`}>Estimated Cost</Text>
        <View className="grid grid-cols-1 gap-6 bg-neutral-100 dark:bg-background rounded-lg p-4">
          <View>
            <Input
              id="amount"
              name="amount"
              label="Amount"
              onChange={handleChange}
              value={values?.amount ? values?.amount + "" : ""}
              placeholder="Enter Amount"
              className="bg-card"
            />
          </View>
          {/* <View>
                        <Input
                            id="surgical_cost"
                            name="surgical_cost"
                            label="Surgical Cost"
                            onChange={handleChange}
                            value={values?.surgical_cost ? values?.surgical_cost + "" : ""}
                            placeholder="Enter Surgical Cost"
                            className="bg-card"
                        />
                    </View> */}

          {/* <View>
            <SingleSelector
              id="currency"
              label="Currency"
              name="currency"
              value={values?.currency || ""}
              placeholder="Select Currency"
              onChange={(value) => {
                onSetHandler("currency", value);
              }}
              options={[
                { label: "INR", value: "INR" },
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
              ]}
              className="bg-card"
            />
          </View> */}
        </View>
      </Card>
    </>
  );
};

export default TreatmentPlan;
