import View from "@/components/view";
import Text from "@/components/text";
import SectionOne from "./SectionOne";
import LaunchApi from "@/actions/api";
import Input from "@/components/input";
import Button from "@/components/button";
import ServiceModel from "./serviceModel";
import { RootState } from "@/actions/store";
import { GenericStatus } from "@/interfaces";
import Textarea from "@/components/Textarea";
import PaymentSection from "./PaymentSection";
import DynamicFormGroup from "@/components/DynamicFormGroup";
import React, { useEffect, useState } from "react";
import { useInvoice } from "@/actions/calls/invoice";
import { toast } from "@/utils/custom-hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import SingleSelector from "@/components/SingleSelector";
import BouncingLoader from "@/components/BouncingLoader";
import { useNavigate, useParams } from "react-router-dom";
import { useAmountType } from "@/actions/calls/amountType";
import { INVOICE_ADD_OR_UPDATE_URL } from "@/utils/urls/backend";
import { statusOptions } from "../forms/consultationForm/consultationFormOptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { clearInvoiceDetail } from "@/actions/slices/invoice";

const api = new LaunchApi();

const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setCollectedAmount] = useState<number>(0);
  const [additionalAmountReason, setAdditionalAmountReason] = useState<
    string | null
  >(null);
  const [comment, setComment] = useState<string>("");
  const paymentDetailData = useSelector(
    (state: RootState) => state.invoice.paymentDetailData,
  );
  const [taxAmount] = useState<number>(0);
  const [type, setType] = useState<boolean>(false);
  const { getPaymentDetailHandler, getInvoiceDetailHandler, cleanUp } =
    useInvoice();
  const [paymentType, setPaymentType] = useState<string>("");
  const [transactionId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { amountTypeDropdownHandler } = useAmountType();
  const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
  // console.log(paymentDetails, "paymentDetails")

  const invoiceData = useSelector(
    (state: RootState) => state.invoice.invoiceDetailData,
  );
  const amountTypeData = useSelector(
    (state: RootState) => state.amountType.amountTypeDropdownData,
  );

  // const currencySymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol,
  // );

  useEffect(() => {
    if (
      invoiceData &&
      invoiceData?.paymentArray &&
      invoiceData?.paymentArray.length > 0
    ) {
      const fetchedPaymentDetails = invoiceData?.paymentArray.map(
        (item: any) => ({
          id: item?.id,
          amount: Number(item.amount),
          payment_type: item.payment_type,
          transaction_id: item.transaction_id,
          status: item.status,
        }),
      );
      setPaymentDetails(fetchedPaymentDetails || []);
    }
  }, [invoiceData]);

  // console.log(paymentDetails, "paymentDetails");

  useEffect(() => {
    if (id) {
      amountTypeDropdownHandler(() => {});
      getPaymentDetailHandler(id, () => {});
      getInvoiceDetailHandler(
        id,
        () => {},
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
    return () => {
      cleanUp();
      dispatch(clearInvoiceDetail());
      // dispatch(clearYogaAsanaDetailSlice());
    };
  }, [id]);

  useEffect(() => {
    setPaymentStatus(invoiceData?.payment_status);
    setCollectedAmount(invoiceData?.collected_amount);
    setPaymentType(invoiceData?.payment_type);
    setType(invoiceData?.type !== "Follow-up" ? true : false);
    setStatus(invoiceData?.status);
    setAdditionalAmountReason(paymentDetailData?.additional_amount_reason);
    setCurrencySymbol(
      paymentDetailData.length > 0 ? paymentDetailData[0].currency : null,
    );
    // setAmount(
    //   invoiceData?.discount_total_amount
    //     ? Number(invoiceData?.discount_total_amount)
    //     : Number(invoiceData.total_amount)
    // );
    setAmount(Number(invoiceData?.collected_amount));
  }, [
    invoiceData?.type,
    invoiceData?.status,
    invoiceData?.payment_type,
    invoiceData?.payment_status,
    invoiceData?.prefill_amount,
    invoiceData?.balanced_amount,
    invoiceData?.collected_amount,
    invoiceData?.additional_amount_reason,
  ]);

  const submitData = () => {
    const intalments = paymentDetails.map((item: any) => ({
      id: item?.id && item?.id.startsWith("new-") ? null : item?.id,
      amount: Number(item.amount),
      payment_type: item.payment_type,
      transaction_id: item.transaction_id,
    }));

    api.post(
      `${INVOICE_ADD_OR_UPDATE_URL}/${invoiceData?.id}`,
      (_, success) => {
        if (success) {
          navigate(-1);
          toast({
            title: "Success!",
            description: "Successfully Amount added",
            variant: "success",
          });
          // if (id) {
          //   getInvoiceDetailHandler(id, () => {});
          //   getPaymentDetailHandler(id, () => {});
          // }
        }
      },
      {
        invoice_id: invoiceData?.id,
        status: status,
        tax_amount: taxAmount,
        instalment: intalments,
        payment_type: paymentType,
        paymentStatus: paymentStatus,
        transaction_id: transactionId,
        columnName: "consultation_id",
        consultationId: invoiceData?.id,
        discount_amount: invoiceData?.discount_amount,
        collected_amount:
          Number(invoiceData?.collected_amount || 0) + Number(amount),
        // balanced_amount:
        //   Number(invoiceData?.total_amount || 0) -
        //   (Number(invoiceData?.collected_amount || 0) + Number(amount)),
        balanced_amount: 0,
        additional_amount_reason: additionalAmountReason,
        comment: comment,
      },
    );
  };

  const handleSubmit = () => {
    // // Validation check
    // if (!paymentType && !transactionId && !amount) {
    //   return alert("Please select payment type and transaction id");
    // }

    // // Check if amount is less than total amount
    // if (amount < invoiceData?.total_amount - invoiceData?.collected_amount) {
    //   const confirmed = confirm(
    //     "Amount is less than total. Do you want to continue?"
    //   );
    //   if (!confirmed) {
    //     return; // Exit early if user cancels
    //   }
    // }

    // // Check if amount is more than total amount
    // if (amount > invoiceData?.total_amount) {
    //   return alert("Amount is more than total amount");
    // }

    // Only call submitData if all validations pass
    submitData();
  };

  return (
    <View className="min-h-screen p-8">
      <BouncingLoader isLoading={isLoading} />
      <ServiceModel>
        <View className="max-w-4xl mx-auto">
          {/* <SectionOne type={type} testTotalAmountData={testTotalAmountData} /> */}
          <SectionOne
            type={type}
            balanceAmount={
              <>
                {!!invoiceData?.balanced_amount && (
                  <Text className="text-muted-foreground text-sm">
                    Balance Amount : {currencySymbol}
                    {invoiceData?.balanced_amount}
                  </Text>
                )}
              </>
            }
          />
          <hr style={{ margin: "20px 0px" }} />
          <View className="mt-8 w-full">
            <PaymentSection />
          </View>
          <hr style={{ margin: "20px 0px" }} />
          <View>
            <Text as="h2">Bill Payment</Text>

            <form>
              {/* <View className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Collected Amount
                  </Text>
                  <Input
                    type="number"
                    value={amount}
                    name="collected_amount"
                    placeholder="Enter Collected Amount"
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                    }}
                    readOnly
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Mode of Payment
                  </Text>
                  <SingleSelector
                    name="payment_type"
                    options={amountTypeData?.map((item: any) => ({
                      value: item.amount_for,
                      label: item.amount_for,
                    }))}
                    placeholder="Select Payment Method"
                    value={paymentType}
                    onChange={(value) => {
                      setPaymentType(value);
                    }}
                    disabled={invoiceData?.payment_status === "Completed"}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-white mb-1">
                    Transaction ID
                  </Text>
                  <Input
                    name="transaction_id"
                    placeholder="Enter Transaction ID"
                    value={transactionId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTransactionId(e.target.value);
                    }}
                    disabled={invoiceData?.payment_status === "Completed"}
                  />
                </View>
              </View> */}

              <View className="mt-4 border-b border-gray-200 pb-6 dark:border-gray-700">
                <DynamicFormGroup
                  title="Payment Breakdown"
                  entryLabel="Installment"
                  data={paymentDetails}
                  isDeletable={(item) => {
                    if (item?.status === "Completed") {
                      return false;
                    }

                    return true;
                  }}
                  onChange={setPaymentDetails}
                  minGroups={1}
                  fields={[
                    {
                      key: "amount",
                      label: "Installment Amount",
                      type: "number",
                      //  required: true,
                      colSpan: 1,
                    },
                    {
                      key: "payment_type",
                      label: "Payment Type",
                      type: "select",
                      options:
                        amountTypeData?.map((item: any) => ({
                          value: item.amount_for,
                          label: item.amount_for,
                        })) || [],
                      placeholder: "Select Mode",
                      //  required: true,
                      colSpan: 1,
                      disabled: invoiceData?.payment_status === "Completed",
                    },
                    {
                      key: "transaction_id",
                      label: "Transaction ID",
                      type: "text",
                      placeholder: "Transaction ID",
                      //  required: true,
                      colSpan: 1,
                      disabled: invoiceData?.payment_status === "Completed",
                    },
                  ]}
                  gridCols={3}
                />
              </View>
              <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <View>
                  {invoiceData?.payment_status === "Completed" ? (
                    <Input
                      readOnly
                      label="Payment Status"
                      value={paymentStatus}
                    />
                  ) : (
                    <SingleSelector
                      label="Payment Status"
                      value={paymentStatus}
                      onChange={(value) => {
                        setPaymentStatus(value);
                      }}
                      placeholder="Select Appointment Payment Status"
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Completed", value: "Completed" },
                      ]}
                    />
                  )}
                </View>
                <View>
                  <SingleSelector
                    id="status"
                    name="status"
                    placeholder="Select Status"
                    label="Consultation Status"
                    value={status || GenericStatus.PENDING}
                    onChange={(value) => {
                      setStatus(value);
                    }}
                    options={statusOptions}
                    disabled={invoiceData?.payment_status === "Completed"}
                  />
                </View>
                <View className="col-span-2">
                  {(invoiceData?.collected_amount > 0 ||
                    invoiceData?.payment_status === "Completed") && (
                    <Textarea
                      required
                      value={additionalAmountReason ?? ""}
                      id="additional_amount_reason"
                      onChange={(e) => {
                        setAdditionalAmountReason(e.target.value);
                      }}
                      name="additional_amount_reason"
                      placeholder="Additional Services (after payment completed)"
                    ></Textarea>
                  )}
                </View>
                <View className="col-span-2">
                  <Textarea
                    value={comment ?? ""}
                    id="comment"
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    name="comment"
                    placeholder="Comment"
                  ></Textarea>
                </View>
              </View>
              <View className="flex justify-between items-center">
                <View>
                  <Text className="text-lg font-semibold">
                    Balance Amount: {currencySymbol}
                    {Math.abs(
                      invoiceData?.discount_total_amount -
                        (paymentDetails?.reduce(
                          (total: any, item: any) =>
                            total + Number(item.amount),
                          0,
                        ) || 0),
                    )}
                  </Text>
                </View>
                {invoiceData?.payment_status !== "Completed" ? (
                  // IF payment not completed → check reason
                  <View className="flex justify-end mt-4">
                    <Button type="button" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </View>
                ) : additionalAmountReason?.trim() !== "" ? (
                  // ELSE IF payment completed BUT reason exists
                  <View className="flex justify-end mt-4">
                    <Button type="button" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </View>
                ) : // ELSE show nothing
                null}
              </View>
            </form>
            <View className="mb-2 mt-8 border-t border-b py-6 flex justify-between">
              <Text as="span" weight="font-bold" className="text-lg">
                Collected Amount:
              </Text>
              <Text as="h1" className=" text-primary-600" weight="font-bold">
                {currencySymbol}
                {amount}
              </Text>
            </View>
          </View>
          <View className="mt-8 w-full">
            <Text as="h2">Transaction History</Text>
            <View className="overflow-x-auto">
              <Table className="w-full min-w-max">
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                    {/* <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">
                      Invoice No
                    </TableHead> */}
                    <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">
                      Amount
                    </TableHead>
                    <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">
                      Date
                    </TableHead>
                    <TableHead className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">
                      Payment Type
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData?.paymentArray?.map(
                    (item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {currencySymbol}
                          {item.amount}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {dayjs(item.date).format("DD-MM-YYYY h:mm A")}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {item.payment_type}
                        </TableCell>
                      </TableRow>
                    ),
                  )}

                  {/* <TableRow>
                   
                    <TableCell className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {invoiceData?.collected_amount || "0"}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {invoiceData?.payment_date
                        ? invoiceData.payment_date
                        : invoiceData?.updated_at
                        ? invoiceData.updated_at
                        : "-"}
                    </TableCell>

                    <TableCell className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {invoiceData?.payment_type || "-"}
                    </TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </View>
          </View>
        </View>
      </ServiceModel>
      {/* Footer */}
      <View className="mt-12 pt-4 border-t border-gray-300">
        <Text as="p" className="text-center text-gray-500 text-sm">
          {import.meta.env.VITE_HOSPITAL_NAME || "MedCare Hospital"}
        </Text>
      </View>
    </View>
  );
};

export default InvoiceDetail;
