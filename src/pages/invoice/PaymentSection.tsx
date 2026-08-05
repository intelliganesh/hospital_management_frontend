import View from "@/components/view";
import Input from "@/components/input";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useParams } from "react-router-dom";
import { validationForm } from "./validationForm";
import React, { useEffect, useState } from "react";
import { useInvoice } from "@/actions/calls/invoice";
import { toast } from "@/utils/custom-hooks/use-toast";
import SingleSelector from "@/components/SingleSelector";
import { useServiceCost } from "@/actions/calls/serviceCost";
import Text from "@/components/text";
// import { setServicesModel } from "@/actions/slices/medicalStatus";

const PaymentSection: React.FC<{}> = () => {
  const { id } = useParams();
  // const dispatch = useDispatch();
  const [amount, setAmount] = useState<string>("");
  const [amountFor, setAmountFor] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [manualMode, setManualMode] = useState<boolean>(false); // ✅ To toggle manual input

  const { invoicePayment, getPaymentDetailHandler, getInvoiceDetailHandler } =
    useInvoice();
  const { serviceCostDropdownHandler } = useServiceCost();
  const invoiceData = useSelector(
    (state: RootState) => state.invoice.invoiceDetailData
  );

  const discountPercentage = useSelector(
    (state: RootState) => state.invoice.paymentDetailData
  )[0]?.discount_percentage;

  const serviceCostDropdownData = useSelector(
    (state: RootState) => state.serviceCost.serviceCostDropdownData
  )?.map((data) => {
    return {
      id: data?.id,
      label: data?.service_name,
      value: data?.service_name + "#" + data?.cost,
    };
  });

  useEffect(() => {
    serviceCostDropdownHandler(() => {});
  }, [invoiceData?.consultation_type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    try {
      for (let [key, value] of formData.entries()) {
        data[key as keyof any] = value as any;
      }

      await validationForm.validate(data, { abortEarly: false });
      setErrors({});
      data["patient_id"] = invoiceData?.patient_id;
      data["appointment_id"] = invoiceData?.appointment_id;
      data["consultation_id"] = invoiceData?.id;
      data["front_desk_user_id"] = invoiceData?.front_desk_user_id;
      data["doctor_id"] = invoiceData?.doctor_id;
      data["discount_percentage"] = discountPercentage || 0;

      invoicePayment(data, (success: boolean) => {
        if (success && id) {
          setAmount("");
          setAmountFor("");
          setManualMode(false);
          getPaymentDetailHandler(id, () => {});
          getInvoiceDetailHandler(id, () => {});
          toast({
            title: "Success!",
            description: "Successfully added payment",
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add payment",
            variant: "destructive",
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <React.Fragment>
      <View className="flex gap-4 items-center">
        <Text as="h2">Additional service</Text>
        <Button
          type="button"
          onClick={() => setManualMode(!manualMode)}
        >
          {manualMode ? (
            <span className="">Select from Dropdown</span>
          ) : (
            <span className="">Add New Service</span>
          )}
        </Button>
      </View>
      <form onSubmit={handleSubmit}>
        <View className="flex flex-col md:flex-row gap-4 mt-4 w-full">
          {!manualMode ? (
            <>
              {/* ✅ Dropdown Selector */}
              <View className="w-full">
                <SingleSelector
                  label="Amount For"
                  name="amount_for"
                  options={serviceCostDropdownData}
                  placeholder="Select"
                  value={amountFor}
                  error={errors?.amount_for}
                  onChange={(value) => {
                    setAmountFor(value.split("#")[0]);
                    setAmount(value.split("#")[1]);
                  }}
                />
              </View>

              {/* ✅ Read-only Amount Input */}
              <View className="w-full">
                <Input
                  label="Amount"
                  name="amount"
                  value={amount}
                  error={errors?.amount}
                  readOnly
                  type="number"
                />
              </View>
            </>
          ) : (
            <>
              {/* ✅ Manual Inputs for New Service */}
              <View className="w-full">
                <Input
                  required
                  label="Amount For"
                  name="amount_for"
                  value={amountFor}
                  placeholder="Enter Service Name"
                  error={errors?.amount_for}
                  onChange={(e) => setAmountFor(e.target.value)}
                />
              </View>

              <View className="w-full">
                <Input
                  required
                  label="Amount"
                  name="amount"
                  type="number"
                  placeholder="Enter Amount"
                  value={amount}
                  error={errors?.amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </View>
            </>
          )}
          <View className="mt-6">
            <Button type="submit">Submit</Button>
          </View>
        </View>

        {/* ❌ Commented old button */}
        {/* 
        <Button
          variant="secondary"
          className="w-full mt-4"
          onPress={() => {
            dispatch(setServicesModel(true));
          }}
        >
          <span className="text-primary">Add Service Amount</span>
        </Button> 
        */}
      </form>
    </React.Fragment>
  );
};

export default PaymentSection;
