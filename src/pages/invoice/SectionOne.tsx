import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useParams } from "react-router-dom";
import { Download, Minus, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useInvoice } from "@/actions/calls/invoice";
import { toast } from "@/utils/custom-hooks/use-toast";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
// import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import dayjs from "dayjs";
import { DATE_FORMAT, TIME_FORMAT } from "@/utils/urls/frontend";

interface SectionOneProps {
  type?: boolean;
  balanceAmount?: React.ReactNode;
}

const SectionOne: React.FC<SectionOneProps> = ({ }) => {
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  // const settingsData = useSelector(
  //   (state: RootState) => state.systemSettings.settings
  // );
  const invoiceData = useSelector(
    (state: RootState) => state.invoice.invoiceDetailData,
  );
  const paymentDetailData = useSelector(
    (state: RootState) => state.invoice.paymentDetailData,
  );

  // const currencySymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol,
  // );

  useEffect(() => {
    setCurrencySymbol(
      paymentDetailData.length > 0 ? paymentDetailData[0].currency : null,
    );
  }, [paymentDetailData]);

  const {
    downloadInvoiceHandler,
    amountIncludeInInvoice,
    getPaymentDetailHandler,
    getInvoiceDetailHandler,
  } = useInvoice();

  const handleExcludeFromInvoice = async (itemId: string, status: boolean) => {
    setIsLoading(true);
    await amountIncludeInInvoice(
      { id: itemId, include_in_invoice: status },
      async (success: boolean) => {
        if (success) {
          toast({
            title: "Updated",
            description: "Excluded from invoice successfully",
            variant: "success",
          });
          if (id) {
            getPaymentDetailHandler(id, () => {
              getInvoiceDetailHandler(id, () => {
                setIsLoading(false);
              });
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to exclude from invoice",
            variant: "destructive",
          });
        }
      },
    );
  };

  const handleDownloadInvoice = () => {
    if (id) {
      downloadInvoiceHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Bill",
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to download Bill",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <View className="relative">
      {isLoading && (
        <View className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Text>Loading...</Text>
        </View>
      )}
      {invoiceData?.payment_status === "Completed" && (
        <View className="flex justify-end mb-6 print:hidden gap-3">
          <Button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download Bill
          </Button>
        </View>
      )}
      <View ref={printRef}>
        {/* Hospital Header */}
        {/* <View className="flex justify-center items-center mb-8 pb-4 border-b-2 border-primary">
          {settingsData?.billing_letter_header && (
            <View
              dangerouslySetInnerHTML={{
                __html: settingsData.billing_letter_header,
              }}
            />
          )}
        </View> */}

        {/* Patient Information */}
        <View className="mb-8">
          <Text
            as="h2"
            className="text-xl font-semibold dark:text-white text-black mb-4"
          >
            Patient Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Name:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.patient_name}
              </Text>
            </View>

            <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Patient No:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.patient_number}
              </Text>
            </View>
            <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Contact:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.patient_phone}
              </Text>
            </View>
            <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Age:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.age} {`(${invoiceData?.gender})`}
              </Text>
            </View>
            {/* <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Gender:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.gender}
              </Text>
            </View> */}
            <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Appointment No:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.appointment_number}
              </Text>
            </View>
            <View className="whitespace-nowrap">
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Appointment date:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {dayjs(invoiceData?.created_at).format(DATE_FORMAT)}{" "}
                {`(${dayjs(invoiceData?.created_at).format(TIME_FORMAT)})`}
              </Text>
            </View>
          </View>
        </View>

        {/* Doctor Information */}
        <View className="mb-8">
          <Text
            as="h2"
            className="text-xl font-semibold dark:text-white text-black mb-4"
          >
            Doctor Information
          </Text>
          <View className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Name:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.doctor_name}
              </Text>
            </View>
            {/* <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Qualification:{" "}
              </Text>
              <Text as="span" className="text-muted-foreground">
                {invoiceData?.qualification}
              </Text>
            </View> */}
            {/* <View>
              <Text
                as="span"
                className="font-medium text-gray-700 dark:text-white"
              >
                Signature:
              </Text>
              <View className="mt-4 h-16 border-b border-gray-300"></View>
            </View> */}
          </View>
          <View className="mt-8">
            <Text
              as="h2"
              className="text-xl font-semibold dark:text-white text-black mb-4"
            >
              Amount Collected: {currencySymbol}
              {invoiceData?.collected_amount}
            </Text>
          </View>
        </View>

        <View>
          <Text
            as="h2"
            className="text-xl font-semibold dark:text-white text-black mb-4"
          >
            Bill Details
          </Text>
          <Table className="border border-black dark:border-white">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-black dark:border-white dark:text-white text-black font-semibold">
                  {invoiceData?.payment_status !== "Completed"
                    ? "Action"
                    : "Slno"}
                </TableHead>
                <TableHead className="border border-black dark:border-white dark:text-white text-black font-semibold">
                  Desctiption
                </TableHead>
                <TableHead className="border border-black dark:border-white dark:text-white text-black font-semibold">
                  Amount ({currencySymbol})
                </TableHead>
                {/* <TableHead className="border border-black dark:border-white dark:text-white text-black font-semibold">
                  Payment Status
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentDetailData?.map((data: any, index: number) => {
                return (
                  <TableRow key={data?.id}>
                    <TableCell className="border border-black dark:border-white text-muted-foreground">
                      {invoiceData?.payment_status !== "Completed" ? (
                        <View
                          className="flex items-center gap-2"
                          onClick={() => {
                            handleExcludeFromInvoice(
                              data?.id,
                              !data?.include_in_invoice,
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
                      )}
                    </TableCell>

                    <TableCell className="border border-black dark:border-white text-muted-foreground">
                      {data?.include_in_invoice ? (
                        <>{data?.amount_for}</>
                      ) : (
                        <del className="text-muted-foreground">
                          {data?.amount_for}
                        </del>
                      )}
                    </TableCell>
                    <TableCell className="border border-black dark:border-white text-muted-foreground">
                      {data?.include_in_invoice ? (
                        <>{data?.amount}</>
                      ) : (
                        <del className="text-muted-foreground">
                          {data?.amount}
                        </del>
                      )}
                    </TableCell>
                    {/* <TableCell className="border border-black dark:border-white text-muted-foreground">
                      <Text
                        as="span"
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
                        style={getStatusColorScheme(data?.payment_status)}
                      >
                        {data?.payment_status || "N/A"}
                      </Text>
                    </TableCell> */}

                    <TableCell
                      colSpan={4}
                      className="border border-black dark:border-white text-sm italic text-muted-foreground"
                    >
                      {data?.additional_amount_reason
                        ? data.additional_amount_reason
                        : data?.include_in_invoice
                          ? "Charges as per consultation."
                          : "Charge excluded as the patient request."}
                    </TableCell>
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
              <TableRow className="font-semibold bg-muted">
                <TableCell
                  className="border border-black dark:border-white"
                  colSpan={6}
                >
                  Sub Total
                </TableCell>
                <TableCell className="border border-black dark:border-white">
                  {currencySymbol} &nbsp;
                  {invoiceData?.total_amount}
                </TableCell>
              </TableRow>
              {invoiceData?.discount_amount > 0 && (
                <TableRow className="font-semibold bg-muted">
                  <TableCell
                    className="border border-black dark:border-white"
                    colSpan={6}
                  >
                    Discount
                  </TableCell>
                  <TableCell className="border border-black dark:border-white">
                    {currencySymbol} &nbsp;
                    {invoiceData?.discount_amount}
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="font-semibold bg-muted">
                <TableCell
                  className="border border-black dark:border-white"
                  colSpan={6}
                >
                  Total
                </TableCell>
                <TableCell className="border border-black dark:border-white">
                  {currencySymbol} &nbsp;
                  {invoiceData?.discount_total_amount ? (
                    <>
                      {/* <del className="text-muted-foreground">
                        {invoiceData?.total_amount}
                      </del>
                      &nbsp; */}
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
              </TableRow>
            </TableBody>
          </Table>
        </View>
        {invoiceData?.payment_type && invoiceData?.transaction_id && (
          <View style={{ marginTop: "30px" }}>
            <Text
              as="h2"
              className="text-xl font-semibold dark:text-white text-black my-4"
            >
              Payment Information
            </Text>

            <View className="flex justify-between items-center">
              <View>
                <View className="my-2">
                  <Text
                    as="span"
                    className="font-medium text-gray-700 dark:text-white"
                  >
                    Payment Type:{" "}
                  </Text>
                  <Text as="span" className="text-muted-foreground">
                    {invoiceData?.payment_type}
                  </Text>
                </View>
                <View className="my-2">
                  <Text
                    as="span"
                    className="font-medium text-gray-700 dark:text-white"
                  >
                    Transaction ID:{" "}
                  </Text>
                  <Text as="span" className="text-muted-foreground">
                    {invoiceData?.transaction_id}
                  </Text>
                </View>
              </View>
              <View>
                <hr></hr>
                <Text
                  as="span"
                  className="font-medium text-gray-700 dark:text-white"
                >
                  Authorized Signature
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SectionOne;
