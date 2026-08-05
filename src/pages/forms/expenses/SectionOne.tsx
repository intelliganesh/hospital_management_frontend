import { RootState } from "@/actions/store";
import Input from "@/components/input";
import Textarea from "@/components/Textarea";
import View from "@/components/view";
import useForm from "@/utils/custom-hooks/use-form";
import { useSelector } from "react-redux";
import SingleSelector from "@/components/SingleSelector";
import { Expenses } from "@/interfaces/slices/expenses";
import { useAmountType } from "@/actions/calls/amountType";
import { useEffect } from "react";
import { useOpd } from "@/actions/calls/opd";
import WebcamCapture from "@/components/Capture";
import Switch from "@/components/ui/switch";
import Text from "@/components/text";

interface SectionOneProps {
  errorsDate: string;
  errorsDescription: string;
  errorsAmount: string;
  errorsModeOfPayment: string;
  errorsTransactionId: string;
  errorsName: string;
  setImage: (name: string, value: any) => void;
}
const SectionOne: React.FC<SectionOneProps> = ({
  errorsDate,
  errorsDescription,
  errorsAmount,
  errorsModeOfPayment,
  errorsTransactionId,
  errorsName,
  setImage,
}) => {
  const { amountTypeDropdownHandler } = useAmountType();
  const { PuaListHandler } = useOpd();
  const allUserList = useSelector(
    (state: RootState) => state?.opd?.allUserList
  );

  const allUserOptions = allUserList?.map((user: any) => ({
    id: user.id,
    label: `${user.name} (${user.role})`, 
    value: user.name,
  }));

  const expensesData = useSelector(
    (state: RootState) => state.expenses.expensesDetails
  );

  const isEdit = !!expensesData?.id;

  const expenseDataDetail = {
    ...expensesData,
    generate_voucher_number: isEdit
      ? expensesData?.voucher_number
        ? true
        : false
      : true, // add form → default ON
  };

  // const expenseDataDetail = {
  //   ...expensesData,
  //   generate_voucher_number: expensesData?.voucher_number ? true : false,
  // };

  const amountTypeData = useSelector(
    (state: RootState) => state.amountType.amountTypeDropdownData
  );
  const { values, handleChange, onSetHandler } =
    useForm<Partial<Expenses> | null>(expenseDataDetail);
  const handleSwitchChange = (checked: boolean) => {
    handleChange({
      target: { name: "generate_voucher_number", value: checked },
    } as any);
  };

  useEffect(() => {
    amountTypeDropdownHandler(() => {});
    PuaListHandler(() => {});
  }, []);
  return (
    <>
      <View className="flex items-center justify-between gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <View className="flex items-center gap-3">
          <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            Voucher Number
          </Text>

          <Switch
            showIcons
            size="medium"
            variant="primary"
            labelPosition="right"
            id="generate_voucher_number"
            name="generate_voucher_number"
            onChange={handleSwitchChange}
            checked={values?.generate_voucher_number}
            disabled={isEdit}
          />
        </View>
        {values?.voucher_number && (
          <Text className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
            #{values.voucher_number}
          </Text>
        )}
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <View>
          <Input
            type="date"
            required={true}
            id="date"
            name="date"
            onChange={handleChange}
            // min={new Date().toISOString().split("T")[0]}
            label="Expense Date"
            error={errorsDate}
            value={
              values?.date
                ? values?.date + ""
                : new Date().toISOString().split("T")[0]
            }
          />
        </View>
        <View>
          <Input
            required={true}
            id="expense_name"
            name="expense_name"
            label="Expense Name"
            onChange={handleChange}
            error={errorsName}
            placeholder="Expense Name"
            value={values?.expense_name}
          />
        </View>
      </View>
      <View>
        <Textarea
          id="description"
          required={true}
          label="Description"
          name="description"
          error={errorsDescription}
          placeholder="Description"
          value={values?.description ?? ""}
          onChange={handleChange}
        />
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* <View> */}
        {/* <Input
            // required={true}
            id="entered_name"
            name="entered_name"
            label="Entered By"
            onChange={handleChange}
            // error={errorsTransactionId}
            placeholder="Entered By"
            value={values?.entered_name}
          />
        </View> */}
        <View>
          <SingleSelector
            id="entered_name"
            label="Approved By"
            name="entered_name"
            // error={errorsPatientId}
            value={values?.entered_name}
            placeholder="Approved By"
            onChange={(selected) => {
              onSetHandler("entered_name", selected);
            }}
            options={allUserOptions}
            // closeOnSelect={true}
            // required={true}
          />
        </View>
        <View>
          <SingleSelector
            id="for_name"
            label="Paid By"
            name="for_name"
            // error={errorsPatientId}
            value={values?.for_name}
            placeholder="Paid By"
            onChange={(selected) => {
              onSetHandler("for_name", selected);
            }}
            options={allUserOptions}
            // closeOnSelect={true}
            // required={true}
          />
        </View>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <View>
          <Input
            required={true}
            id="amount"
            name="amount"
            label="Expense Amount"
            onChange={handleChange}
            error={errorsAmount}
            value={values?.amount ? values?.amount + "" : ""}
            placeholder="Enter Expense Amount"
          />
        </View>
        <View>
          <SingleSelector
            required={true}
            id="mode_of_payment"
            name="mode_of_payment"
            label="Mode of Payment"
            error={errorsModeOfPayment}
            options={amountTypeData?.map((item: any) => ({
              value: item.amount_for,
              label: item.amount_for,
            }))}
            value={values?.mode_of_payment}
            placeholder="Select Mode of Payment"
            onChange={(value) => {
              onSetHandler("mode_of_payment", value);
            }}
          />
        </View>
      </View>
      {values?.mode_of_payment === "Others" && (
        <View className="mb-2">
          <Textarea
            id="other"
            // required={true}
            label="Other Mode of Payment"
            name="other"
            // error={errorsother}
            placeholder="Other Mode of Payment"
            value={values?.other ?? ""}
            onChange={handleChange}
          />
        </View>
      )}
      <View>
        <Input
          // required={true}
          id="transaction_id"
          name="transaction_id"
          label="Transaction ID"
          onChange={handleChange}
          error={errorsTransactionId}
          value={values?.transaction_id ? values?.transaction_id + "" : ""}
          placeholder="Enter Transaction ID"
        />
      </View>
      <View className="col-span-2 mt-4">
        {/* <Upload
          label="Upload Proof"
          name="image"
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          maxSize={1024 * 1024 * 2}
          multiple={false}
          maxCount={1}
          // required={true}
          // error={errorsImage}
          existingFiles={
            typeof values?.image === "string"
              ? values?.image
              : Array.isArray(values?.image) && values?.image.length > 0
              ? values?.image
                  .filter((item) => typeof item === "string")
                  .join(",")
              : ""
          }
          onChange={(fileList: any) => {
            const file =
              fileList?.map((item: any) => {
                if (item.isExisting) {
                  return item.url;
                } else {
                  return item.file;
                }
              }) || [];

            setImage("image", file);
          }}
        /> */}
        <WebcamCapture
          label="Upload Proof"
          name="image"
          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          maxSize={1024 * 1024 * 2}
          multiple={false}
          maxCount={1}
          // required={true}
          // error={errorsImage}
          existingFiles={
            typeof values?.image === "string"
              ? values?.image
              : Array.isArray(values?.image) && values?.image.length > 0
              ? values?.image
                  .filter((item) => typeof item === "string")
                  .join(",")
              : ""
          }
          onChange={(fileList: any) => {
            const file =
              fileList?.map((item: any) => {
                if (item.isExisting) {
                  return item.url;
                } else {
                  return item.file;
                }
              }) || [];

            setImage("image", file);
          }}
        />
      </View>
    </>
  );
};

export default SectionOne;
