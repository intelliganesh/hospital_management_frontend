import { useInvoice } from "@/actions/calls/invoice";
import { RootState } from "@/actions/store";
import Button from "@/components/button";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  DATE_FORMAT,
  INVOICE_DETAIL_URL,
  INVOICE_URL,
  // TIME_FORMAT,
} from "@/utils/urls/frontend";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Filter from "../filter";
import ActionMenu from "@/components/editDeleteAction";
import { toast } from "@/utils/custom-hooks/use-toast";
import DateRangePicker from "@/components/DateRangePicker";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import dayjs from "dayjs";
import { formatTime } from "@/utils/dateTimeUtils";

const InvoicePage: React.FC<{}> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    getInvoiceListHandler,
    downloadPrescroriptionHandler,
    downloadInvoiceHandler,
    downloadConsultationHandler,
    cleanUp,
  } = useInvoice();
  const invoiceData = useSelector(
    (state: RootState) => state?.invoice?.invoiceListData,
  );
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null,
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      getInvoiceListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        searchParams?.get("from_date"),
        searchParams?.get("to_date"),
        filterData,
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
    };
  }, [
    filterData,
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("currentPage"),
    searchParams?.get("from_date"),
    searchParams?.get("to_date"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const prescriptionDownloadHandler = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadPrescroriptionHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Prescription",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download Prescription",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };

  // const currencySymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol,
  // );

  const handleDownloadConsultation = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadConsultationHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded consultation",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download consultation",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };
  const handleDownloadInvoice = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadInvoiceHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Bill",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download Bill",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };

  //   const handleDeletePatient = () => {
  //     if (deleteId) {
  //       deleteYogaAsanaHandler(deleteId, (success: boolean) => {
  //         if (success) {
  //           modalCloseHandler();
  //           yogaAsanaListHandler(searchParams?.get("currentPage") ?? 1, () => {});
  //         }
  //       });
  //     }
  //   };
  const sortOptions: SortOption[] = [
    { label: "Bill Number (A-Z)", value: "invoice_number", order: "asc" },
    { label: "Bill Number (Z-A)", value: "invoice_number", order: "desc" },
    {
      label: "Appointment Number (A-Z)",
      value: "appointment_number",
      order: "asc",
    },
    {
      label: "Appointment Number (Z-A)",
      value: "appointment_number",
      order: "desc",
    },
    { label: "Patient Number (A-Z)", value: "patient_number", order: "asc" },
    { label: "Patient Number (Z-A)", value: "patient_number", order: "desc" },
    { label: "Doctor Name (A-Z)", value: "doctor_name", order: "asc" },
    { label: "Doctor Name (Z-A)", value: "doctor_name", order: "desc" },
    { label: "Next Visit Date (A-Z)", value: "next_visit_date", order: "asc" },
    { label: "Next Visit Date (Z-A)", value: "next_visit_date", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Bill Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this data? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="text-black"
            onPress={modalCloseHandler}
          >
            Cancel
          </Button>
          <Button variant="danger">Delete</Button>
        </View>
      </Modal>
      <View className="mb-6 flex justify-between items-center">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Bills
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all Bills
          </Text>
        </View>
        <View>
          <Text
            as="label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Select Date Range
          </Text>
          <DateRangePicker
            // onDateChange={handleDateChange}
            placeholder="Choose your dates"
          />
        </View>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Bill No",
            "Patient Details",
            "Appointment No",
            "Appointment On",
            "Doctor Name",
            "Total Bill",
            "Consultation Status",
            "Payment Status",
            // "Next Visit Date",
            "Downloads",
          ]}
          tableData={invoiceData?.data?.data?.map((data: any) => [
            <Link
              to={`${INVOICE_URL}${INVOICE_DETAIL_URL}/${data.id}`}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {data?.invoice_number?.invoice_number ?? "NA"}
            </Link>,
            // data?.appointment_number,
            <View className="flex flex-col gap-1">
              <Text className="text-sm  font-normal">
                {data?.invoice_number?.patient_name}
              </Text>
              <Text className="text-sm  font-normal">
                {data?.patient_number}
              </Text>
            </View>,
            data?.appointment_number || "N/A",
            <View className="flex flex-col gap-1">
              <Text className="text-sm font-normal">
                {dayjs(data?.appointment_date).format(DATE_FORMAT)}
              </Text>
              <Text className="text-sm font-normal">
                {formatTime(data?.appointment_time)}
              </Text>
            </View>,
            data?.doctor_name,
            data?.invoice_number?.currency + data?.discount_total_amount || 0,
            // currencySymbol + data?.discount_total_amount || 0,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status}
            </Text>,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.payment_status)}
            >
              {data?.payment_status}
            </Text>,
            // data?.next_visit_date
            //   ? dayjs(data?.next_visit_date).format(DATE_FORMAT)
            //   : "NA",
            <ActionMenu
              onDownloadPrescription={
                data?.status === GenericStatus.COMPLETED
                  ? () => {
                      prescriptionDownloadHandler(data?.id);
                    }
                  : undefined
              }
              onDownloadConsultation={
                data?.status === GenericStatus.COMPLETED
                  ? () => {
                      handleDownloadConsultation(data?.id);
                    }
                  : undefined
              }
              onDownload={
                data?.payment_status === GenericStatus.COMPLETED
                  ? () => {
                      handleDownloadInvoice(data?.id);
                    }
                  : undefined
              }
              downloadTitle="Download Bill"
              downloadPrescriptionTitle="Download Prescription"
              downloadConsultationTitle="Download Consultation"
            />,
          ])}
          header={{
            search: (
              <SearchBar
                onSearch={(val) =>
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    search: val,
                    currentPage: "1",
                  })
                }
              />
            ),
            sort: (
              <DataSort
                sortOptions={sortOptions}
                activeSort={activeSort ?? undefined}
                onSort={(option) =>
                  handleSortChange(
                    option,
                    setActiveSort,
                    setSearchParams,
                    searchParams,
                  )
                }
              />
            ),
            filter: (
              <Filter
                title="Bill Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="invoice_number" placeholder="Bill Number" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="appointment_number"
                      placeholder="Appointment Number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="patient_name" placeholder="Patient Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="patient_phone" placeholder="Patient Phone" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="doctor_name" placeholder="Doctor Name" />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Select
                  //     label="Status"
                  //     name="status"
                  // value={paymentStatus}
                  // onChange={(e) => {
                  //   setPaymentStatus(e.target.value);
                  //   // onSetHandler("payment_status", e.target.value)
                  // }}
                  // placeholder="Select Status"
                  // options={[
                  //   { label: "Pending", value: "Pending" },
                  //   { label: "Completed", value: "Completed" },
                  // ]}
                  // error={errorsPaymentStatus}
                  // />
                  // </View>,
                  // <View className="w-full my-4">
                  //   <Select
                  //     label="Payment Status"
                  //     name="payment_status"
                  // value={paymentStatus}
                  // onChange={(e) => {
                  //   setPaymentStatus(e.target.value);
                  //   // onSetHandler("payment_status", e.target.value)
                  // }}
                  // placeholder="Select Payment Status"
                  // options={[
                  //   { label: "Pending", value: "Pending" },
                  //   { label: "Completed", value: "Completed" },
                  // ]}
                  // error={errorsPaymentStatus}
                  //   />
                  // </View>,
                  <View className="w-full my-4">
                    <Input name="bill_amount" placeholder="Bill Amount" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      type="date"
                      name="next_visit_date"
                      placeholder="Next Visit Date"
                      onFocus={(e) => (e.target.type = "date")}
                    />
                  </View>,
                ]}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={invoiceData?.data?.current_page}
                last_page={invoiceData?.data?.last_page}
                getPageNumberHandler={(page) =>
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: `${page}`,
                    },
                    { replace: true },
                  )
                }
              />
            ),
          }}
        />
      </Card>
    </React.Fragment>
  );
};
export default InvoicePage;
