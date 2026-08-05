import View from "@/components/view";
import Input from "@/components/input";
import CostSummary from "./CostSummary";
import { RootState } from "@/actions/store";
import { GenericStatus } from "@/interfaces";
// import AddCostInput from "@/components/AddCost";
import React, { useEffect, useState } from "react";
import useForm from "@/utils/custom-hooks/use-form";
import { useDispatch, useSelector } from "react-redux";
import SingleSelector from "@/components/SingleSelector";
import { Consultation } from "@/interfaces/consultation";
import { statusOptions } from "../consultationFormOptions";
import { useServiceCost } from "@/actions/calls/serviceCost";
import { discountPercentSlice } from "@/actions/slices/serviceCost";
import { setConsultationAmount } from "@/actions/slices/consultation";
import { useConsultationFees } from "@/actions/calls/consultationFees";
// import AdditionalServiceCost from "./AdditionalServiceCost";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import Text from "@/components/text";
import Button from "@/components/button";
import { setServicesModel } from "@/actions/slices/medicalStatus";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { Plus, X } from "lucide-react";
import { toast } from "@/utils/custom-hooks/use-toast";
import { TAB_COLORS } from "../consultationFormConfig";
import PostSurgeryFollowUp from "@/pages/postSurgeryFollowUp";
// import RadioGroup from "@/components/RadioGroup";
import Switch from "@/components/ui/switch";
// import dayjs from "dayjs";
// import Text from "@/components/text";
// import Text from "@/components/text";
// import Text from "@/components/text";
// import Input from "@/components/input";
// import Select from "@/components/Select";
// import Button from "@/components/button";
// import { Card } from "@/components/ui/card";
// import Textarea from "@/components/Textarea";
// import { useOpd } from "@/actions/calls/opd";
// import { useTest } from "@/actions/calls/test";
// import SearchSelect from "@/components/SearchSelect";
// import TransferList from "@/components/TransferList";
// import SearchSelect from "@/components/SearchSelect";
// import MultiSelector from "@/components/MultiSelector";
// import { useMedicine } from "@/actions/calls/medicine";
// import { Appointment } from "@/interfaces/appointments";
// import TipTapTextEditor from "@/components/TipTapTexteditor";
// import MedicinesSection from "@/components/MedicinesSection";
// import useExtractValue from "@/utils/custom-hooks/useExtractValue";
// import MultiSelectWithDropDown from "@/components/MultiSelectWithDropDown";

interface SectionFourProps {
  errorConsultationAmount: string;
  // errorsTemperature: string;
  // errorsBp: string;
  // errorsPulse: string;
  // errorsCvs: string;
  // errorsRs: string;
  // errorsTest: string;
  // postExaminationData: any;
  // mainOnSetHandler: (name: string, value: any) => void;
}

const SectionSix: React.FC<SectionFourProps> = ({
  errorConsultationAmount,
  // errorsTemperature,
  // errorsBp,
  // errorsPulse,
  // errorsCvs,
  // errorsRs,
  // errorsTest,
  // postExaminationData,
  // mainOnSetHandler,
}) => {
  // const examinationDetails = useSelector(
  //   (state: RootState) => state.examinations.examinationDetails
  // );
  // const { values, handleChange } = useForm<Examination | null>(
  //   examinationDetails
  // );
  // const { medicineDropdownHandler } = useMedicine();
  // const dispatch = useDispatch();

  const [additionalCosts, setAdditionalCosts] = useState<string[]>([]);

  const { consultationFeesDropdownHandler } = useConsultationFees();
  const [amountFor, setAmountFor] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [postSurgeryData, setPostSurgeryData] = useState<any[]>([]);


  // const totalServiceCost = useExtractValue("serviceCost", "totalServiceCost");
  // console.log("totalServiceCost", totalServiceCost);

  // const totalServiceCost = useSelector(
  //   (state: RootState) => state.serviceCost.totalServiceCost
  // );

  // const currencySymbol = useExtractValue("systemSettings", "settings.currency_symbol");
  // const currencySymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol
  // );

  // const consultationDetail = useExtractValue("consultation", "consultationDetailData");
  const consultationDetail = useSelector(
    (state: RootState) => state.consultation.consultationDetailData
  );
  const discountPercent = useSelector(
    (state: RootState) => state.serviceCost.discountPercent
  );

  const consultationDetailData = {
    ...consultationDetail?.consultations,
    ...consultationDetail?.proctologyOrNonProctology,
    // additional_cost: consultationDetail?.proctologyOrNonProctology?.additional_cost,
  };

  const { values, onSetHandler } = useForm<Consultation | null>(
    consultationDetailData || {}
  );

  // const medicineDropdownData = useSelector(
  //     (state: RootState) => state.medicines.medicineDropdownData
  //   )?.map((item: any) => ({
  //     id: item?.id,
  //     label: item?.medicine_name,
  //     value: item?.medicine_name,
  //   }));

  //   useEffect(() => {
  //       medicineDropdownHandler(() => {});
  //     }, []);

  // const testIds = testData?.split(",")?.map((item: any) => item.trim());
  // const testLabelMap = testObj?.filter((item: any) =>
  //   testIds?.includes(item?.value?.toString())
  // )?.map((item: any) => {
  //   return {
  //     id: item?.value,
  //     label: item?.label,
  //     value: item?.value,
  //   };
  // });
  // const testLabelMap = testObj?.filter((item: any) =>
  //   testIds?.includes(item?.value?.toString())
  // )?.map((item: any) => item?.label)?.join(",");
  // console.log("testLabelMap", testLabelMap);

  const { serviceCostDropdownHandler, setTotalServiceCost } = useServiceCost();
  const [, setServiceCostStatus] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("consultationDetail", consultationDetail?.additionalCost);
    // if (consultationDetailData?.additional_cost) {
    if (
      // consultationDetailData?.additional_cost ||
      consultationDetail?.additionalCost?.length > 0
    ) {
      setAdditionalCosts(consultationDetail?.additionalCost);

      // const costs = Object.values(consultationDetail.additionalCost)
      //   .map((item: any) => `${item.amount_for}#${item.amount}`)
      //   .filter(Boolean);
      // setAdditionalCosts(costs);

      // const totalCost = consultationDetailData?.additional_cost
      // const totalCost = costs
      //   // ?.split(",")
      //   ?.reduce(
      //     (acc: number, item: string) => acc + Number(item.split("#")[1]),
      //     0
      //   );
      const totalCost = consultationDetail?.additionalCost
        ?.filter((item: any) => item.include_in_invoice === 1) // ✅ filter only included
        ?.reduce((acc: number, item: any) => acc + Number(item.amount), 0);
      setTotalServiceCost(totalCost);
    } else {
      setAdditionalCosts([]);
      setTotalServiceCost(0);
    }
  }, [consultationDetail?.additionalCost]);
  // }, [values?.additional_cost, consultationDetail?.additionalCost]);
  // useEffect(() => {
  //   if (consultationDetail?.additionalCost) {
  //     const costs = Object.values(consultationDetail.additionalCost)
  //       .map((item: any) => `${item.amount_for}#${item.amount}`)
  //       .filter(Boolean);
  //     setAdditionalCosts(costs);
  //   }
  // }, [consultationDetail?.additionalCost]);

  const serviceCostDropdownData = useSelector(
    (state: RootState) => state.serviceCost.serviceCostDropdownData
  )?.map((data: any) => {
    return {
      id: data?.id,
      label: data?.service_name,
      value: data?.service_name + "#" + data?.cost,
    };
  });

  const consultationFeesDropdownData = useSelector(
    (state: RootState) => state.consultationFees.consultationFeesDropdownData
  )?.map((data: any) => {
    return {
      id: data?.id,
      label: data?.amount,
      value: data?.amount,
    };
  });

  // const { values, handleChange, handleTipTapChange, onSetHandler } =
  //   useForm<Consultation | null>(consultationDetail);

  useEffect(() => {
    if (consultationDetailData?.type) {
      consultationFeesDropdownHandler(() => {});
      serviceCostDropdownHandler(() => {
        setServiceCostStatus(true);
      });
    }
    // consultationFeesDropdownHandler(() => {});
  }, [consultationDetailData?.type]);

  useEffect(() => {
    dispatch(discountPercentSlice(values?.consultation_discount));
  }, [values?.consultation_discount]);

  const handleAddAdditionalCost = () => {
    // onSetHandler(
    //   "Service",
    //   [...additionalCosts, { amount_for: amountFor, amount: amount }]
    //     ?.map((item) => item.amount_for + "#" + item.amount)
    //     ?.join(",")
    // );
    let isAmountForExists = false;
    if (amountFor && amount) {
      additionalCosts.forEach((item: any) => {
        if (item.amount_for === amountFor) {
          isAmountForExists = true;
          toast({
            title: "Notice",
            description: "Amount for already exists",
            variant: "warning",
          });
          return;
        }
      });
    }
    if (!isAmountForExists) {
      const newItem = {
        amount_for: amountFor,
        amount: amount,
        include_in_invoice: 1,
      };
      setAdditionalCosts((prev: any) => [...prev, newItem]);
      const totalCost = [...additionalCosts, newItem]
        ?.filter((item: any) => item.include_in_invoice === 1) // ✅ don't exclude the new one
        ?.reduce((acc: number, item: any) => acc + Number(item.amount), 0);

      setTotalServiceCost(totalCost);
      setAmountFor("");
      setAmount("");
    }
  };

  const handleRemoveAdditionalCost = (amountFor: any) => {
    setAdditionalCosts((prev: any) => {
      return prev.filter((item: any) => item.amount_for !== amountFor);
    });
    const totalCost = additionalCosts
      ?.filter((item: any) => item.amount_for !== amountFor)
      ?.reduce((acc: number, item: any) => acc + Number(item.amount), 0);
    setTotalServiceCost(totalCost);
  };

  // console.log("postSurgeryData", postSurgeryData);
  

  return (
    <React.Fragment>
      <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* consultatioin type  */}
        <View>
          {/* <Input
            id="type"
            name="type"
            label="Consultation Type"
            value={values?.type || ""}
            onChange={handleChange}
            placeholder="Enter Consultation Type"
            required={true}
            readOnly={true}
          /> */}
          {/* <SingleSelector
            id="type"
            label="Consultation Type"
            name="type"
            value={values?.type || ""}
            placeholder="Select Consultation Type"
            onChange={(value) => {
              onSetHandler("type", value);
              dispatch(
                consultationDetailSlice({
                  ...consultationDetail,
                  consultations: {
                    ...consultationDetail?.consultations,
                    type: value,
                  },
                })
              );
            }}
            options={departmentTypeDropdownData}
            required={true}
          /> */}
        </View>

        {/* consultaton cost  */}
        <View className="col-span-2">
          <SingleSelector
            id="consultation_amount"
            label="Consultation Cost"
            name="consultation_amount"
            value={values?.consultation_amount?.toString() || "0.00"}
            placeholder="Select Consultation Cost"
            onChange={(value) => {
              dispatch(
                setConsultationAmount({
                  amount: Number(value),
                })
              );
              onSetHandler("consultation_amount", value);
            }}
            options={consultationFeesDropdownData}
            error={errorConsultationAmount}
            required={true}
          />
        </View>
      </View>

      <View>
        {/* <DynamicFormSection
          title="Addition Costs"
          itemLabelPrefix="Addition cost"
          addButtonText="Add Cost"
          onPressed={() => {
            if (!serviceCostStatus) {
              serviceCostDropdownHandler(() => {
                setServiceCostStatus(true);
              });
            }
          }}
          data={consultationDetail?.proctologyOrNonProctology?.additional_cost?.split(",")}
          fieldConfigs={[
            {
              key: "Service",
              label: "Service#Cost",
              type: "custom-select",
              placeholder: "Select Service",
              required: true,
              // value: values?.additional_cost.split(","),
              options: serviceCostDropdownData,
              // options: [
              //   { label: "Test", value: "Test" },
              //   { label: "Medicine", value: "Medicine" },
              //   { label: "Surgery", value: "Surgery" },
              //   { label: "Consultation", value: "Consultation" },
              //   { label: "Admission", value: "Admission" },
              //   { label: "Discharge", value: "Discharge" },
              // ],
            },
            // {
            //   key: "Cost",
            //   label: "Cost",
            //   type: "number",
            //   placeholder: "Enter Cost",
            //   required: true,
            // },
          ]}
          onDataChange={(data) => {
            dispatch(addDynamicFieldSections(data));
            // onSetHandler("billing_details", data);
          }}
        /> */}

        {/* <div className="border border-gray-300 dark:border-gray-600 dark:bg-background rounded-lg py-6 my-6">
          <h3 className="text-gray-700 dark:text-white text-lg font-semibold mb-4 px-6">
            Additional Cost
          </h3>
          <div className="border-b border-gray-300 dark:border-gray-600 mb-6 px-6 " /> */}

        {/* <AddCostInput
            title=""
            minItems={0}
            maxItems={10}
            // defaultValue={
            //   consultationDetail?.proctologyOrNonProctology?.additional_cost?.split(
            //     ","
            //   ) || []
            // }
            defaultValue={additionalCosts}
            cardClassName="w-full"
            addButtonText="Add Cost"
            inputField={{
              name: "cost",
              label: "Cost",
              type: "number",
              placeholder: "Enter Cost",
              required: true,
            }}
            selectDropDown={{
              name: "service",
              label: "Service",
              required: true,
              placeholder: "Select Service",
              options: serviceCostDropdownData || [],
            }}
          /> */}

        {/* <AdditionalServiceCost /> */}
        <View>
          {/* <Text
        as="h2"
        className="text-xl font-semibold dark:text-white text-black mb-4"
      >
        Bill Details
      </Text> */}

          <View className="mb-8">
            <View className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 mt-12">
              <Text as="h3" weight="font-bold" className={TAB_COLORS.consultationBilling.textColor}>Additional service</Text>
              <Button
                variant="secondary"
                className="border border-gray-300 dark:border-gray-600 mb-2 dark:hover:border-primary hover:border-primary"
                onPress={() => {
                  dispatch(setServicesModel(true));
                }}
              >
                <span className="text-primary text-underline flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Service Amount
                </span>
              </Button>
            </View>
            {/* <PaymentSection /> */}
            <View>
              <View className="flex flex-col md:flex-row gap-4 mt-4 items-end">
                <View className="w-full md:flex-1">
                  <SingleSelector
                    label="Amount For"
                    // name="amount_for"
                    options={serviceCostDropdownData}
                    placeholder={`Select`}
                    value={amountFor}
                    //   error={errors?.amount_for}
                    onChange={(value) => {
                      setAmountFor(value.split("#")[0]);
                      setAmount(value.split("#")[1]);
                    }}
                  />
                </View>

                {/* Cost Input (Read-only) */}
                <View className="w-full md:flex-1">
                  <Input
                    label="Amount"
                    // name="amount"
                    value={amount}
                    //   error={errors?.amount}
                    type="number"
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    placeholder={"Enter Service Amount"}
                  />
                </View>
              
                <View className="w-full md:w-auto">
                    <Button onPress={handleAddAdditionalCost} className="flex items-center w-full justify-center h-10 mb-[1px]"> <Plus className="mr-2 h-5 w-5" /> Add Amount</Button>
                </View>
              </View>
            </View>

            <Input
              // label="Additional Cost"
              name="Service"
              value={additionalCosts
                ?.map((data: any) => data.amount_for + "#" + data.amount)
                ?.join(",")}
              type="hidden"
            />
          </View>
          {
            (additionalCosts?.length > 0) && (
              <Table className="border border-black dark:border-white">
            <TableHeader>
              <TableRow className="bg-background">
                <TableHead className="border border-black dark:border-border dark:text-white text-black font-semibold">
                  {/* {invoiceData?.payment_status !== "Completed" ? "Action" : "Slno"} */}
                  Slno
                </TableHead>
                <TableHead className="border border-black dark:border-border dark:text-white text-black font-semibold">
                  Desctiption
                </TableHead>
                <TableHead className="border border-black dark:border-border dark:text-white text-black font-semibold">
                  Amount (Rs)
                </TableHead>
                {/* <TableHead className="border border-black dark:border-white dark:text-white text-black font-semibold">
                  Discount Amount (Rs)
                </TableHead>
                <TableHead className="border border-black dark:border-border dark:text-white text-black font-semibold">
                  Discount in (%)
                </TableHead> */}
                <TableHead className="border border-black dark:border-border dark:text-white text-black font-semibold">
                  Payment Status
                </TableHead>
                <TableHead className="border border-black dark:border-border dark:text-white text-black font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {additionalCosts?.map((data: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="border border-black dark:border-border text-muted-foreground">
                      {index + 1}
                      {/* {data?.payment_status !== "Completed" ? (
                    <View
                      className="flex items-center gap-2"
                      onClick={() => {
                        handleExcludeFromInvoice(
                          data?.id,
                          !data?.include_in_invoice
                        );
                      }}
                    >
                      {data?.amount_for !== "Consultation Cost" ? (
                        data?.include_in_invoice ? (
                          <Button variant="danger">
                            <Minus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="primary">
                            <Plus className="h-4 w-4" />
                          </Button>
                        )
                      ) : (
                        <></>
                      )}
                    </View>
                  ) : (
                    <Text>{index + 1}</Text>
                  )} */}
                    </TableCell>

                    <TableCell className="border border-black dark:border-border text-muted-foreground">
                      {/* {data?.include_in_invoice ? (
                        <>{data?.amount_for}</>
                      ) : (
                        <del className="text-muted-foreground">
                          {data?.amount_for}
                        </del>
                      )} */}
                      {data?.include_in_invoice === 0 ? (
                        <del className="text-muted-foreground">
                          {data?.amount_for}
                        </del>
                      ) : (
                        <>{data?.amount_for}</>
                      )}
                    </TableCell>
                    <TableCell className="border border-black dark:border-border text-muted-foreground">
                      {/* {data?.include_in_invoice ? (
                        <>{data?.amount}</>
                      ) : (
                        <del className="text-muted-foreground">
                          {data?.amount}
                        </del>
                      )} */}
                      {data?.include_in_invoice === 0 ? (
                        <p>
                          <del className="text-muted-foreground">
                            {data?.amount}
                          </del>{" "}
                          (
                          {data?.include_in_invoice === 0
                            ? "Charge excluded as the patient request."
                            : "Charges as per consultation."}
                          )
                        </p>
                      ) : (
                        <>
                          {data?.amount} (
                          {data?.include_in_invoice === 0
                            ? "Charge excluded as the patient request."
                            : "Charges as per consultation."}
                          )
                        </>
                      )}
                    </TableCell>
                    {/* <TableCell className="border border-black dark:border-white text-muted-foreground">
                      {data?.include_in_invoice ? (
                        <>{data?.discount_amount || 0}</>
                      ) : (
                        <del className="text-muted-foreground">
                          {data?.discount_amount || 0}
                        </del>
                      )}
                    </TableCell>
                    <TableCell className="border border-black dark:border-white text-muted-foreground">
                      {data?.include_in_invoice ? (
                        <>{data?.discount_percentage || 0} %</>
                      ) : (
                        <del className="text-muted-foreground">
                          {data?.discount_percentage || 0} %
                        </del>
                      )}
                    </TableCell> */}
                    <TableCell className="border border-black dark:border-border text-muted-foreground">
                      <Text
                        as="span"
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                        style={getStatusColorScheme(
                          data?.payment_status || "Pending"
                        )}
                      >
                        {data?.payment_status || "Pending"}
                      </Text>
                    </TableCell>
                    <TableCell className="border border-black dark:border-border text-muted-foreground">
                      {data?.payment_status !== "Completed" ? (
                        <Button
                          variant="danger"
                          onPress={() =>
                            handleRemoveAdditionalCost(data?.amount_for)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <></>
                      )}
                    </TableCell>

                    {/* <TableCell
                    colSpan={4}
                    className="border border-black dark:border-white text-sm italic text-muted-foreground"
                  >
                    {!data?.include_in_invoice
                      ? "Charge excluded as the patient request."
                      : "Charges as per consultation."}
                  </TableCell> */}
                  </TableRow>
                );
              })}
              {/* {invoiceData?.test?.map((data: Test) => (
                <TableRow key={data.id}>
                  <TableCell className="border border-black dark:border-white text-muted-foreground">
                    {data.test_name}
                  </TableCell>
                  <TableCell className="border border-black dark:border-white text-muted-foreground">
                    {data.test_price + data.tax_price}
                  </TableCell>
                </TableRow>
              ))} */}
              {/* <TableRow className="font-semibold bg-muted">
            <TableCell
              className="border border-black dark:border-white"
              colSpan={6}
            >
              Sub Total
            </TableCell>
            <TableCell className="border border-black dark:border-white">
              ₹ &nbsp;
              {invoiceData?.total_amount}
            </TableCell>
          </TableRow> */}
              {/* {invoiceData?.discount_amount > 0 && (
            <TableRow className="font-semibold bg-muted">
              <TableCell
                className="border border-black dark:border-white"
                colSpan={6}
              >
                Discount
              </TableCell>
              <TableCell className="border border-black dark:border-white">
                ₹ &nbsp;
                {invoiceData?.discount_amount}
              </TableCell>
            </TableRow>
          )} */}
              {/* <TableRow className="font-semibold bg-muted">
            <TableCell
              className="border border-black dark:border-white"
              colSpan={6}
            >
              Total
            </TableCell>
            <TableCell className="border border-black dark:border-white">
              ₹ &nbsp;
              {invoiceData?.discount_total_amount ? (
                <>
                  
                  {invoiceData?.discount_total_amount}{" "}
                  {paymentDetailData?.length > 0 &&
                  paymentDetailData[0]?.discount_percentage
                    ? `( ${paymentDetailData[0]?.discount_percentage}% )`
                    : ""}
                </>
              ) : (
                invoiceData?.total_amount
              )}
            </TableCell>
          </TableRow> */}
            </TableBody>
          </Table>
          )}
        </View>
        {/* </div> */}

        {
          values?.consultation_amount?.toString() !== "0.00" && (
            <View className="mt-6">
          <Input
            type="number"
            id="consultation_discount"
            name="consultation_discount"
            label="Discount in (%)"
            // value={values?.consultation_discount || 0}
            value={discountPercent ? discountPercent : ""}
            onChange={(e) => {
              const discountValue = parseInt(e.target.value, 10);
              if (discountValue > 100) return;
              if (discountValue < 0) return;
              dispatch(discountPercentSlice(e.target.value));
              onSetHandler("consultation_discount", e.target.value);
            }}
            placeholder="Enter Discount"
          />
        </View>
        )
        }

        {/* Post Surgery Follow Up */}
         <View className=" mt-6 flex items-center justify-between border-t border-b border-border p-2 bg-background">
              <Text className="text-sm font-semibold">Post Surgery Follow Up </Text>
              <View className="flex items-center">
                <Switch
                showIcons
                size="medium"
                variant="green"
                labelPosition="right"
                // id="post_surgery_details"
                name="post_surgery_details"
                onChange={(checked)=>{
                  // setShowPostSurgery(checked);
                  
                  onSetHandler("post_surgery_details", checked ? "yes" : "no");
                }}
                checked={values?.post_surgery_details ? values?.post_surgery_details === "yes" : false}
                // defaultChecked={values?.post_surgery_details === "yes"}
              />
              </View>
            </View>
        {
          values?.post_surgery_details === "yes" && ( 
        <View className="mt-6">
          {/* <PostSurgeryFollowUp
            patient_id={consultationDetail?.consultations?.patient_id}
            consultation_id={consultationDetail?.consultations?.id}
            appointment_number={consultationDetail?.consultations?.appointment_number}
            onRecordsChange={(data: any[]) => {
              console.log("data", data);
              setPostSurgeryData(data);
              onSetHandler("post_surgery_followup", data[0]);
            }}
            mode="embedded"
            maxRows={1}
            features={{ showDownloadButtons: false,
              allowDelete: false,
             }}
          /> */}
          <PostSurgeryFollowUp
            patient_id={consultationDetail?.consultations?.patient_id}
            consultation_id={consultationDetail?.consultations?.id}
            appointment_number={consultationDetail?.consultations?.appointment_number}
            onRecordsChange={(data: any[]) => {
              setPostSurgeryData(data);
              onSetHandler("post_surgery_followup", postSurgeryData[0]);
            }}
            formMode={true}
            maxRows={1}
            // viewMode={false}
            features={{
              allowDelete: false,
              showAPNColumn: false,
             }}
            showDownloadButton={false}
          />

          
          <Input
            type="text"
            id="post_surgery_followup"
            name="post_surgery_followup"
            label="Post Surgery Follow Up"
            value={JSON.stringify(postSurgeryData[0])}
            hidden
          />
        </View>
        )
        }
        {/* Cost summary  */}
        <View className="mt-12">
          <CostSummary />
        </View>
      </View>

      <View className="mt-6">
        <SingleSelector
          id="status"
          label="Consultation Status"
          name="status"
          // error={errorsStatus}
          // value={values?.status || GenericStatus.COMPLETED}
          value={GenericStatus.COMPLETED}
          placeholder="Select Status"
          onChange={(value) => {
            onSetHandler("status", value);
          }}
          options={statusOptions}
        />
      </View>
    </React.Fragment>
  );
};
export default SectionSix;
