import Filter from "@/pages/filter";
import Text from "@/components/text";
import View from "@/components/view";
import Input from "@/components/input";
import Button from "@/components/button";
import { RootState } from "@/actions/store";
import { Card } from "@/components/ui/card";
import DataSort from "@/components/SortData";
import InfoCard from "@/components/ui/infoCard";
import {
  Banknote,
  CreditCard,
  FileText,
  Percent,
  TrendingUp,
  UserX,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import { useDispatch, useSelector } from "react-redux";
import DynamicTable from "@/components/ui/DynamicTable";
import BouncingLoader from "@/components/BouncingLoader";
import PaginationComponent from "@/components/Pagination";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import DateRangePicker from "@/components/DateRangePicker";
import { clearList } from "@/actions/slices/invoiceReport";
import { INVOICE_REPORT_DOWNLOAD_URL } from "@/utils/urls/backend";
import { useInvoiceReport } from "@/actions/calls/reports/invoice";
import SingleSelector from "@/components/SingleSelector";
import { useAmountType } from "@/actions/calls/amountType";
import { Separator } from "@/components/ui/separator";
import { handleApiError } from "@/utils/errorHandler";
import PaymentTreemap from "@/components/PaymentTreemap";

const Invoice: React.FC<{}> = ({ }) => {
  //   const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingStatus, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { amountTypeDropdownHandler } = useAmountType();
  const invoiceReportList = useSelector(
    (state: RootState) => state.invoiceReport.invoiceReportList,
  );
  const currencySymbol = useSelector(
    (state: RootState) => state.systemSettings.settings.currency_symbol,
  );

  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null,
  );

  const { cleanUp, getListApi } = useInvoiceReport();

  const sortOptions: any[] = [
    { label: "Patient Name (A-Z)", value: "patient_name", order: "asc" },
    { label: "Patient Name (Z-A)", value: "patient_name", order: "desc" },
    { label: "Patient Email (A-Z)", value: "patient_email", order: "asc" },
    { label: "Patient Email (Z-A)", value: "patient_email", order: "desc" },
    { label: "Patient Phone (A-Z)", value: "patient_phone", order: "asc" },
    { label: "Patient Phone (Z-A)", value: "patient_phone", order: "desc" },
    { label: "Patient Number (A-Z)", value: "patient_number", order: "asc" },
    { label: "Patient Number (Z-A)", value: "patient_number", order: "desc" },
    { label: "Doctor Name (A-Z)", value: "doctor_name", order: "asc" },
    { label: "Doctor Name (Z-A)", value: "doctor_name", order: "desc" },
    { label: "Doctor Email (A-Z)", value: "doctor_email", order: "asc" },
    { label: "Doctor Email (Z-A)", value: "doctor_email", order: "desc" },
    { label: "Doctor Phone (A-Z)", value: "doctor_phone", order: "asc" },
    { label: "Doctor Phone (Z-A)", value: "doctor_phone", order: "desc" },
    {
      label: "Referred By Name (A-Z)",
      value: "referred_by_name",
      order: "asc",
    },
    {
      label: "Referred By Name (Z-A)",
      value: "referred_by_name",
      order: "desc",
    },
    {
      label: "Collected Amount (A-Z)",
      value: "collected_amount",
      order: "asc",
    },
    {
      label: "Collected Amount (Z-A)",
      value: "collected_amount",
      order: "desc",
    },
    { label: "Balance Amount (A-Z)", value: "balanced_amount", order: "asc" },
    { label: "Balance Amount (Z-A)", value: "balanced_amount", order: "desc" },
  ];

  const amountTypeData = useSelector(
    (state: RootState) => state.amountType.amountTypeDropdownData,
  );

  useEffect(() => {
    amountTypeDropdownHandler(() => { });
  }, []);

  const [activeSort, setActiveSort] = useState<any | null>(sortOptions[0]);

  useEffect(() => {
    if (searchParams.get("currentPage")) {
      getListApi(
        searchParams.get("currentPage") ?? 1,
        () => { },
        (loadingStatus) => {
          setIsLoading(
            loadingStatus == "pending"
              ? true
              : loadingStatus == "failed"
                ? true
                : loadingStatus == "success" && false,
          );
        },
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        searchParams?.get("from_date") ?? null,
        searchParams?.get("to_date") ?? null,
        filterData,
      );
    }

    return () => {
      cleanUp();
      dispatch(clearList());
    };
  }, [
    filterData,
    searchParams.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams?.get("to_date"),
    searchParams?.get("from_date"),
    searchParams.get("sort_order"),
  ]);

  // console.log(invoiceReportList, "invoiceReportList");
  // const cashAmount =
  //   invoiceReportList?.typesOfPayment.length > 0
  //     ? invoiceReportList?.typesOfPayment?.filter(
  //         (item: any) => item.payment_type === "Cash"
  //       )[0]?.total_collected
  //     : 0;

  // const upiOrOnlineAmount =
  //   invoiceReportList?.typesOfPayment.length > 0
  //     ? invoiceReportList?.typesOfPayment
  //         ?.filter((item: any) => item.payment_type !== "Cash")
  //         .reduce((acc: any, item: any) => acc + item.total_collected, 0)
  //     : 0;

  const ExistingtreemapData = invoiceReportList?.typesOfPayment
    ?.map((item: any) => {
      return {
        payment_type: item?.payment_type || "Cash",
        total_collected: item.total_collected,
      };
    })
    ?.filter((item: any) => item.payment_type !== "Card");

  const nonExistingTreemapData = amountTypeData
    ?.filter((item: any) => {
      return !ExistingtreemapData?.some(
        (t: any) => t?.payment_type === item?.amount_for,
      );
    })
    ?.map((item: any) => {
      return {
        payment_type: item?.amount_for,
        total_collected: 0,
      };
    });

  const treemapData = [
    ...(ExistingtreemapData || []),
    ...(nonExistingTreemapData || []),
  ];

  // const discountAmount =
  //   invoiceReportList?.paymentBreakPoint.length > 0
  //     ? invoiceReportList?.paymentBreakPoint?.reduce(
  //         (acc: any, item: any) => acc + Number(item.total_discount),
  //         0
  //       )
  //     : 0;

  const downloadExpensesExcel = async () => {
    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}${INVOICE_REPORT_DOWNLOAD_URL}?page=${searchParams.get("currentPage") ?? 1
        }${searchParams.get("search")
          ? "&search=" + searchParams.get("search")
          : ""
        }${searchParams.get("sort_by")
          ? "&sort_by=" + searchParams.get("sort_by")
          : ""
        }${searchParams.get("sort_order")
          ? "&sort_order=" + searchParams.get("sort_order")
          : ""
        }${searchParams?.get("from_date")
          ? "&from_date=" + searchParams?.get("from_date")
          : ""
        }${searchParams?.get("to_date")
          ? "&to_date=" + searchParams?.get("to_date")
          : ""
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        response && handleApiError(response);
        setIsLoading(false);
        throw new Error("Excel download failed");
      }
      setIsLoading(false);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice-report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      error && handleApiError(error);
      setIsLoading(false);
      alert("Failed to download Excel report");
    }
  };

  const pageCollectedTotal =
    invoiceReportList?.table?.data?.reduce(
      (sum: number, row: any) => sum + Number(row.collected_amount || 0),
      0,
    ) || 0;
  const pageTotalAmount =
    invoiceReportList?.table?.data?.reduce(
      (sum: number, row: any) => sum + Number(row.discount_total_amount || 0),
      0,
    ) || 0;

  const tableRows =
    invoiceReportList?.table?.data?.map((invoice: any) => [
      invoice.patient_name || "N/A",
      invoice.patient_email || "N/A",
      invoice.patient_phone || "N/A",
      invoice.patient_number || "N/A",
      invoice.doctor_name || "N/A",
      invoice.doctor_email || "N/A",
      invoice.doctor_phone || "N/A",
      invoice.referred_by_name || "N/A",
      invoice.currency + " " + invoice.discount_total_amount || 0,
      invoice.currency + " " + invoice.collected_amount || 0,
      <View className="flex flex-wrap gap-1.5">
        {[
          ...((invoice?.paymentBreakdown &&
            invoice?.paymentBreakdown?.length > 0 &&
            invoice?.paymentBreakdown?.map((item: any) => {
              return {
                payment_type: item?.payment_type,
                amount: item?.amount,
              };
            })) ||
            []),
          ...amountTypeData
            ?.filter((item: any) => {
              return !invoice?.paymentBreakdown?.some(
                (t: any) => t?.payment_type === item?.amount_for,
              );
            })
            ?.map((item: any) => {
              return {
                payment_type: item?.amount_for,
                amount: 0,
              };
            }),
        ].map((item: any, idx: number) => {
          // Color palette for capsules
          const colors = [
            {
              border: "border-emerald-600 dark:border-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-950/30",
              text: "text-emerald-600 dark:text-emerald-500",
            },
            {
              border: "border-purple-600 dark:border-purple-500",
              bg: "bg-purple-50 dark:bg-purple-950/30",
              text: "text-purple-600 dark:text-purple-500",
            },
            {
              border: "border-blue-600 dark:border-blue-500",
              bg: "bg-blue-50 dark:bg-blue-950/30",
              text: "text-blue-600 dark:text-blue-500",
            },
            {
              border: "border-amber-600 dark:border-amber-500",
              bg: "bg-amber-50 dark:bg-amber-950/30",
              text: "text-amber-600 dark:text-amber-500",
            },
            {
              border: "border-pink-600 dark:border-pink-500",
              bg: "bg-pink-50 dark:bg-pink-950/30",
              text: "text-pink-600 dark:text-pink-500",
            },
            {
              border: "border-cyan-600 dark:border-cyan-500",
              bg: "bg-cyan-50 dark:bg-cyan-950/30",
              text: "text-cyan-600 dark:text-cyan-500",
            },
            {
              border: "border-orange-600 dark:border-orange-500",
              bg: "bg-orange-50 dark:bg-orange-950/30",
              text: "text-orange-600 dark:text-orange-500",
            },
            {
              border: "border-indigo-600 dark:border-indigo-500",
              bg: "bg-indigo-50 dark:bg-indigo-950/30",
              text: "text-indigo-600 dark:text-indigo-500",
            },
          ];
          const colorScheme = colors[idx % colors.length];

          return (
            <View
              key={idx}
              className={`inline-flex items-center rounded-full border ${colorScheme.border} ${colorScheme.bg} px-3 py-1`}
            >
              <Text className={`text-xs font-semibold ${colorScheme.text}`}>
                {item?.payment_type}
              </Text>
              <View
                className={`mx-2 h-3 w-px ${colorScheme.bg}`}
                style={{ backgroundColor: "currentColor", opacity: 0.3 }}
              ></View>
              <Text className={`text-xs font-bold ${colorScheme.text}`}>
                {currencySymbol}
                {item?.amount || 0}
              </Text>
            </View>
          );
        })}
      </View>,
    ]) || [];

  const totalRow = [
    <strong>TOTAL</strong>,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    <View className="font-semibold text-slate-900 dark:text-slate-100">
      {currencySymbol}
      {pageTotalAmount}
    </View>,
    <View className="font-semibold text-slate-900 dark:text-slate-100">
      {currencySymbol}
      {pageCollectedTotal}
    </View>,
    "",
  ];

  return (
    <React.Fragment>
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={loadingStatus} />
      </View>
      <View className="flex justify-between items-center mb-6">
        <View className="flex items-center gap-3 mb-4">
          <View className="p-2 rounded-lg bg-primary/10">
            <Banknote className="h-6 w-6 text-primary" />
          </View>
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1"
            >
              Invoice Report
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Track billing, payments, and revenue analytics
            </Text>
          </View>
        </View>

        <View>
          <Text
            as="label"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Select Date Range
          </Text>
          <DateRangePicker placeholder="Choose your dates" />
        </View>
      </View>

      {/* Primary Stats Cards */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Amount Billed"
          value={`${currencySymbol || ""}${invoiceReportList?.includeInvoiceAmount || "0"
            }`}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<FileText size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Amount Collected"
          value={`${currencySymbol || ""}${invoiceReportList?.collected_amount || "0"
            }`}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<TrendingUp size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Cancelled by Patient"
          value={`${currencySymbol || ""}${invoiceReportList?.excludeInvoiceAmount || "0"
            }`}
          valueStyle="!text-red-600 dark:!text-red-400 !text-2xl"
          icon={<UserX size={20} />}
          iconStyle="!bg-gradient-to-br !from-red-100 !via-red-200 !to-red-300 dark:!from-red-800/40 dark:!via-red-700/40 dark:!to-red-600/40 !text-red-600 dark:!text-red-400 !shadow-lg !shadow-red-500/25 dark:!shadow-red-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Discount Amount"
          value={`${currencySymbol || ""}${invoiceReportList?.discountIncludeInvoiceAmount || "0"
            }`}
          valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
          icon={<Percent size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View>
      <Separator className="mb-6" />

      {/* Payment Distribution Treemap */}
      <View className="mb-6">
        <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700">
          <View className="p-6">
            <View className="flex items-center gap-3 mb-6">
              <View className="p-2 rounded-lg bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-800/40 dark:via-purple-700/40 dark:to-purple-600/40 shadow-lg shadow-purple-500/25 dark:shadow-purple-400/20">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </View>
              <View>
                <Text
                  as="h3"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  Payment Distribution Analysis
                </Text>
                <Text className="text-sm text-slate-600 dark:text-slate-400">
                  Collection breakdown by payment method
                </Text>
              </View>
            </View>

            {treemapData?.length > 0 ? (
              <PaymentTreemap
                data={treemapData || []}
                currencySymbol={currencySymbol}
              />
            ) : (
              <View className="flex items-center justify-center h-64">
                <Text className="text-slate-600 dark:text-slate-400">
                  No payment data available
                </Text>
              </View>
            )}
          </View>
        </Card>
      </View>

      {/* Commented out old cards */}
      {/* <View className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
        <InfoCard
          label="Cash Collection"
          value={`${currencySymbol}${cashAmount || "0"}`}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<Banknote size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="UPI/Online Collection"
          value={`${currencySymbol}${upiOrOnlineAmount || "0"}`}
          valueStyle="!text-purple-600 dark:!text-purple-400 !text-2xl"
          icon={<CreditCard size={20} />}
          iconStyle="!bg-gradient-to-br !from-purple-100 !via-purple-200 !to-purple-300 dark:!from-purple-800/40 dark:!via-purple-700/40 dark:!to-purple-600/40 !text-purple-600 dark:!text-purple-400 !shadow-lg !shadow-purple-500/25 dark:!shadow-purple-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
        {/* {invoiceReportList?.paymentBreakPoint?.map(
          (item: any, index: number) => (
            <InfoCard
              key={index}
              label={item?.amount_for}
              valueStyle="!text-primary"
              // icon={< />}
              value={
                <>
                  <Text>
                    <strong>Total amount</strong>: Rs {item?.total_amount}
                  </Text>
               
                </>
              }
              className="dark:bg-card rounded-2xl shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
            />
          )
        )} */}
      {/* </View> */}
      {/* <View className="mb-6 flex justify-between items-center">
        <View className="mb-6">
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Invoice Report
          </Text>
          <Text as="p" className="text-text-light">
            Manage Invoice Report
          </Text>
        </View>
        <View className="flex gap-4">
          {invoiceReportList?.table?.data?.length > 0 && (
            <Button variant="primary" onPress={downloadExpensesExcel}>
              Download Invoice Reports
            </Button>
          )}
          <View>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Select Date Range
            </label>
            <DateRangePicker
              // onDateChange={handleDateChange}
              placeholder="Choose your dates"
            />
          </View>
        </View>
      </View> */}

      <View className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <View className="flex items-center gap-4 mt-6">
          {invoiceReportList?.table?.data?.length > 0 && (
            <Button
              variant="outline"
              onPress={downloadExpensesExcel}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Download Invoice Report
            </Button>
          )}
        </View>
      </View>

      <Card className={dynamicTableCardStyle}>
        {/* Table */}
        <DynamicTable
          // isLoading={loadingStatus}
          tableHeaders={[
            "Patient Name",
            "Patient Email",
            "Patient Phone",
            "Patient Number",
            "Doctor Name",
            "Doctor Email",
            "Doctor Phone",
            "Referred By Name",
            "Total Amount",
            "Collected Amount",
            "Mode of Payment",
            // "Balance Amount",
            // amountTypeData?.length > 0 && (
            //   amountTypeData?.map((item: any, index: number) => item.amount_for + (index < (amountTypeData?.length - 1) ? " | " : ""))
            // ),
          ]}
          // tableData={invoiceReportList?.table?.data?.map((invoice: any) => [
          //   invoice.patient_name || "N/A",
          //   invoice.patient_email || "N/A",
          //   invoice.patient_phone || "N/A",
          //   invoice.patient_number || "N/A",
          //   invoice.doctor_name || "N/A",
          //   invoice.doctor_email || "N/A",
          //   invoice.doctor_phone || "N/A",
          //   invoice.referred_by_name || "N/A",
          //   `${currencySymbol}${invoice.discount_total_amount || 0}`,
          //   `${currencySymbol}${invoice.collected_amount || 0}`,
          //   <View className="flex flex-wrap gap-1.5">
          //     {[
          //       ...((invoice?.paymentBreakdown &&
          //         invoice?.paymentBreakdown?.length > 0 &&
          //         invoice?.paymentBreakdown?.map((item: any) => {
          //           return {
          //             payment_type: item?.payment_type,
          //             amount: item?.amount,
          //           };
          //         })) ||
          //         []),
          //       ...amountTypeData
          //         ?.filter((item: any) => {
          //           return !invoice?.paymentBreakdown?.some(
          //             (t: any) => t?.payment_type === item?.amount_for,
          //           );
          //         })
          //         ?.map((item: any) => {
          //           return {
          //             payment_type: item?.amount_for,
          //             amount: 0,
          //           };
          //         }),
          //     ].map((item: any, idx: number) => {
          //       // Color palette for capsules
          //       const colors = [
          //         {
          //           border: "border-emerald-600 dark:border-emerald-500",
          //           bg: "bg-emerald-50 dark:bg-emerald-950/30",
          //           text: "text-emerald-600 dark:text-emerald-500",
          //         },
          //         {
          //           border: "border-purple-600 dark:border-purple-500",
          //           bg: "bg-purple-50 dark:bg-purple-950/30",
          //           text: "text-purple-600 dark:text-purple-500",
          //         },
          //         {
          //           border: "border-blue-600 dark:border-blue-500",
          //           bg: "bg-blue-50 dark:bg-blue-950/30",
          //           text: "text-blue-600 dark:text-blue-500",
          //         },
          //         {
          //           border: "border-amber-600 dark:border-amber-500",
          //           bg: "bg-amber-50 dark:bg-amber-950/30",
          //           text: "text-amber-600 dark:text-amber-500",
          //         },
          //         {
          //           border: "border-pink-600 dark:border-pink-500",
          //           bg: "bg-pink-50 dark:bg-pink-950/30",
          //           text: "text-pink-600 dark:text-pink-500",
          //         },
          //         {
          //           border: "border-cyan-600 dark:border-cyan-500",
          //           bg: "bg-cyan-50 dark:bg-cyan-950/30",
          //           text: "text-cyan-600 dark:text-cyan-500",
          //         },
          //         {
          //           border: "border-orange-600 dark:border-orange-500",
          //           bg: "bg-orange-50 dark:bg-orange-950/30",
          //           text: "text-orange-600 dark:text-orange-500",
          //         },
          //         {
          //           border: "border-indigo-600 dark:border-indigo-500",
          //           bg: "bg-indigo-50 dark:bg-indigo-950/30",
          //           text: "text-indigo-600 dark:text-indigo-500",
          //         },
          //       ];
          //       const colorScheme = colors[idx % colors.length];

          //       return (
          //         <View
          //           key={idx}
          //           className={`inline-flex items-center rounded-full border ${colorScheme.border} ${colorScheme.bg} px-3 py-1`}
          //         >
          //           <Text
          //             className={`text-xs font-semibold ${colorScheme.text}`}
          //           >
          //             {item?.payment_type}
          //           </Text>
          //           <View
          //             className={`mx-2 h-3 w-px ${colorScheme.bg}`}
          //             style={{ backgroundColor: "currentColor", opacity: 0.3 }}
          //           ></View>
          //           <Text className={`text-xs font-bold ${colorScheme.text}`}>
          //             {currencySymbol}
          //             {item?.amount || 0}
          //           </Text>
          //         </View>
          //       );
          //     })}
          //   </View>,
          // ])}
          tableData={[...tableRows, totalRow]}
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
            filter: (
              <Filter
                onResetFilter={() => {
                  setFilterData(null);
                }}
                title="Expense Filter"
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="patient_name" placeholder="Patient name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="doctor_name" placeholder="Doctor name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="referred_by_name"
                      placeholder="Referred by name"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="collected_amount"
                      placeholder="Collected amount"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="balanced_amount"
                      placeholder="Balanced amount"
                      type="number"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      required={true}
                      id="payment_type"
                      name="payment_type"
                      label="Mode of Payment"
                      options={amountTypeData?.map((item: any) => ({
                        value: item.amount_for,
                        label: item.amount_for,
                      }))}
                      placeholder="Select Mode of Payment"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      required={true}
                      id="currency"
                      name="currency"
                      label="Currency"
                      options={[
                        { label: "INR (₹)", value: "₹" },
                        { label: "USD ($)", value: "$" },
                        { label: "EUR (€)", value: "€" },
                        { label: "GBP (£)", value: "£" },
                        { label: "AED (AED)", value: "AED" },
                      ]}
                      placeholder="Select Currency"
                    />
                  </View>,
                ]}
              />
            ),
            sort: (
              <DataSort
                sortOptions={sortOptions}
                onSort={(option) =>
                  handleSortChange(
                    option,
                    setActiveSort,
                    setSearchParams,
                    searchParams,
                  )
                }
                activeSort={activeSort ?? undefined}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={invoiceReportList?.table?.current_page}
                last_page={invoiceReportList?.table?.last_page}
                getPageNumberHandler={(page) => {
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: `${page}`,
                    },
                    { replace: true },
                  );
                }}
              />
            ),
          }}
        />
      </Card>
    </React.Fragment>
  );
};

export default Invoice;
