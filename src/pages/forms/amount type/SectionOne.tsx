import View from "@/components/view";
import Input from "@/components/input";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import useForm from "@/utils/custom-hooks/use-form";
import { AmountTypeOptions } from "./amountTypeFormOptions";
import TipTapTextEditor from "@/components/TipTapTexteditor";
import { AmountType } from "@/interfaces/master/amount types";
import SingleSelector from "@/components/SingleSelector";
import { GenericStatus } from "@/interfaces";

interface SectionOneProps {
  errorName: string;
  errorStatus: string;
  errorDescription: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorName,
  errorStatus,
  errorDescription,
}) => {
  const amountTypeData = useSelector(
    (state: RootState) => state.amountType.amountTypeDetailData
  );
  const { values, handleChange, onSetHandler, handleTipTapChange } =
    useForm<AmountType | null>(amountTypeData);
  // const [otherAllergenType, setOtherAllergenType] = useState<boolean>(false);

  // useEffect(() => {
  //   if (values?.allergen_type === "Other") {
  //     setOtherAllergenType(true);
  //   }
  //   PuaListHandler(() => {});
  // }, [values?.allergen_type]);
  return (
    <>
        <View>
          <Input
            type="text"
            required={true}
            id="amount_for"
            name="amount_for"
            label="Amount Type Name"
            onChange={handleChange}
            error={errorName}
            value={values?.amount_for}
            placeholder="Enter Amount Type Name"
          />
        </View>

      <View className="mt-4">
        <TipTapTextEditor
          name="description"
          label="Description"
          areaHeight="h-24"
          placeholder="Enter Description"
          error={errorDescription}
          value={values?.description || ""}
          onChange={handleTipTapChange}
        />
      </View>
      <View className="mt-4">
        <SingleSelector
          required={true}
          id="status"
          name="status"
          label="Status"
          error={errorStatus}
          placeholder="Select Status"
          options={AmountTypeOptions}
          value={values?.status || GenericStatus.ACTIVE}
          onChange={(e: any) => {
            onSetHandler("status", e.target.value);
          }}
        />
        {/* <MultiSelector
            name="status"
            label="Status"
            value={values?.status || ""}
            onChange={(value: any) => onSetHandler("status", value)}
            multiSelect={false}
            placeholder="Select Status"
            options={AmountTypeOptions}
            // error={errorsAllergyType}
          /> */}
      </View>
    </>
  );
};
export default SectionOne;
