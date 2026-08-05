import Input from "@/components/input";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { BankDetails } from "@/interfaces/bankDetails";
import Textarea from "@/components/Textarea";
import SingleSelector from "@/components/SingleSelector";

interface SectionOneProps {
  errorsBankName: string;
  errorsAccountDetails: string;
  errorsIsActive: string;
}

const SectionOne: React.FC<SectionOneProps> = ({
  errorsBankName,
  errorsAccountDetails,
  errorsIsActive,
}) => {
  const bankDetailsData = useSelector(
    (state: RootState) => state?.bankDetails?.bankDetailsDetailData
  ) as Partial<BankDetails> | null;
  const { values, handleChange, onSetHandler } =
    useForm<Partial<BankDetails> | null>(bankDetailsData);
  const isActiveValue =
    values?.is_active === null || values?.is_active === undefined
      ? "1"
      : Number(values.is_active) === 1
        ? "1"
        : "0";

  return (
    <>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <View>
          <Input
            id="title"
            name="title"
            required={true}
            label="Bank Name"
            error={errorsBankName}
            value={values?.title || ""}
            placeholder="Ex: HDFC Bank"
            onChange={handleChange}
          />
        </View>
        <View>
          <SingleSelector
            id="is_active"
            label="Is Active"
            name="is_active"
            error={errorsIsActive}
            value={isActiveValue}
            placeholder="Select Is Active"
            onChange={(value) => {
              onSetHandler("is_active", value);
            }}
            options={[
              { label: "Yes", value: "1" },
              { label: "No", value: "0" },
            ]}
            required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 gap-6 mt-4">
        <View>
          <Textarea
            id="details"
            name="details"
            label="Account Details"
            error={errorsAccountDetails}
            value={values?.details || ""}
            placeholder="Ex: Account Number: 1234567890, IFSC: HDFC0001234"
            onChange={handleChange}
            required={true}
          />
        </View>
      </View>
    </>
  );
};

export default SectionOne;
