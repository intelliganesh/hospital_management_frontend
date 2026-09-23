import React, { useEffect, useState } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import { FileText, Activity, CreditCard, Clock, Eye } from "lucide-react";
import InfoCard from "@/components/ui/infoCard";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import DateRangePicker from "@/components/DateRangePicker";
import Filter from "@/pages/filter";
import SingleSelector from "@/components/SingleSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IPD_BILL_DETAILS_URL } from "@/utils/urls/frontend";
import Button from "@/components/button";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";
import { giveGradient } from "@/utils/bgGradientProvider";
import dayjs from "dayjs";
import { useIpdBilling } from "@/actions/calls/ipd/billing";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useOpd } from "@/actions/calls/opd";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import BouncingLoader from "@/components/BouncingLoader";
import PaginationComponent from "@/components/Pagination";

const IpdBillsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getIpdBillingList, cleanUp } = useIpdBilling();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<null | { multiple_filter: Record<string, any> }>(null);
  const [downloadingBillId, setDownloadingBillId] = useState<string | null>(
    null,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const billData = useSelector(
    (state: any) => state.ipdBilling.ipdBillingListData,
  );
  const patientList = useSelector((state: RootState) => state.opd.patientList);
  const { PuaListHandler } = useOpd();
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();
  const patientNameOptions = patientList?.map((patient: any) => ({
    label:
      patient.patient_number +
      "(" +
      patient.first_name +
      " " +
      patient.last_name +
      ")",
    value: [patient.first_name, patient.last_name].filter(Boolean).join(" "),
  }));

  const statusOptions = [
    { label: "Paid", value: "Paid" },
    { label: "Unpaid", value: "Unpaid" },
    { label: "Partial", value: "Partial" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ];
  const handleGeneratePdf = async (ipdId?: string) => {
    if (ipdId) {
      setDownloadingBillId(ipdId);
      await fetchAndDownloadPdf(
        ipdId,
        IPD_GENERATE_PDF_URL,
        "billing_invoice",
        () => {},
      );
      setDownloadingBillId(null);
    }
  };
  useEffect(() => {
    PuaListHandler(() => {});
  }, []);

  useEffect(() => {
    getIpdBillingList(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        {
          from_date: searchParams.get("from_date") ?? null,
          to_date: searchParams.get("to_date") ?? null,
          ...(filterData || {}),
        },
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
    return () => {
      cleanUp();
    };
  }, [
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("currentPage"),
    searchParams.get("from_date"),
    searchParams.get("to_date"),
    filterData,
  ]);

  return (
    <View className="space-y-6">
      <BouncingLoader isLoading={isLoading} />
      {/* Header & Breadcrumbs */}
      <View>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>IPD Bills</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <View className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
          <View>
            <Text
              as="h1"
              weight="font-bold"
              className="text-2xl text-slate-900 dark:text-white mb-1"
            >
              IPD Bills
            </Text>
            <Text as="p" className="text-slate-500 dark:text-slate-400 text-sm">
              Manage and track all in-patient billing records
            </Text>
          </View>
          <View>
            <Text as="label" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Select Date Range
            </Text>
            <DateRangePicker placeholder="Choose your dates" />
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard
          label="Total Bills"
          value={billData?.analytics?.total_bills}
          icon={<FileText size={20} />}
          iconStyle={giveGradient("blue")}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
        />
        <InfoCard
          label="Running Bills"
          value={billData?.analytics?.running_bills}
          icon={<Activity size={20} />}
          iconStyle={giveGradient("yellow")}
          valueStyle="!text-yellow-600 !text-2xl !text-yellow-400"
        />
        <InfoCard
          label="Total Billed"
          value={billData?.analytics?.total_billed}
          icon={<CreditCard size={20} />}
          iconStyle={giveGradient("emerald")}
          valueStyle="!text-emerald-600 !text-2xl !text-emerald-400"
        />
        <InfoCard
          label="Pending Collection"
          value={billData?.analytics?.pending_collection}
          icon={<Clock size={20} />}
          iconStyle={giveGradient("rose")}
          valueStyle="!text-rose-600 !text-2xl !text-rose-400"
        />
      </View>

      {/* Bills Table */}
      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            { label: "Bill No", key: "invoice_number" },
            { label: "Patient Details", key: "patient_name" },
            { label: "Admission", key: "admission_date_time" },
            { label: "Discharge", key: "discharge_date" },
            { label: "Total", key: "total_amount" },
            { label: "Paid", key: "receipt_total" },
            { label: "Balance", key: "balanced_amount" },
            { label: "Status", key: "billing_status" },
            "Actions",
          ]}
          tableData={billData?.data?.map((bill: any) => [
            <Text weight="font-medium" className="text-secondary-600">
              {bill?.invoice_number}
            </Text>,
            <View>
              <Text weight="font-medium" className="block">
                {bill.patient_name}
              </Text>
              <Text className="text-xs text-slate-500">
                {bill.patient_number}
              </Text>
            </View>,
            dayjs(bill?.ipd?.admission_date_time).format("DD-MM-YYYY"),
            bill.ipd?.discharge_date
              ? dayjs(bill.ipd.discharge_date).format("DD-MM-YYYY")
              : "-",
            `₹${bill.total_amount.toLocaleString()}`,
            <Text className="text-emerald-600 font-medium">
              ₹{Number(bill.receipt_total ?? 0).toLocaleString()}
            </Text>,
            <Text
              className={
                bill.balanced_amount > 0
                  ? "text-rose-600 font-medium"
                  : "text-emerald-600"
              }
            >
              ₹{Number(bill.balanced_amount ?? 0).toLocaleString()}
            </Text>,
            <Text
              as="span"
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(bill.billing_status as GenericStatus)}
            >
              {bill.billing_status}
            </Text>,
            <View className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                className=" text-slate-500 hover:text-primary hover:bg-primary-50 p-0 flex items-center justify-center"
                onPress={() =>
                  navigate(`${IPD_BILL_DETAILS_URL}/${bill.ipd_id}`)
                }
                title="View Details"
              >
                <Eye size={14} />
              </Button>
              <Button
                variant="ghost"
                size="small"
                className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 p-0 flex items-center justify-center"
                onPress={() => handleGeneratePdf(bill.ipd_id)}
                disabled={isPdfDownloading && downloadingBillId === bill.ipd_id}
                title="Get Bill"
              >
                {isPdfDownloading && downloadingBillId === bill.ipd_id ? (
                  <BouncingLoader isLoading={true} />
                ) : (
                  <FileText size={14} />
                )}
              </Button>
            </View>,
          ])}
          sortBy={searchParams.get("sort_by") || undefined}
          sortOrder={(searchParams.get("sort_order") as "asc" | "desc") || undefined}
          onSort={(key, order) => {
            setSearchParams(
              {
                ...Object.fromEntries([...searchParams]),
                sort_by: key,
                sort_order: order,
              },
              { replace: true },
            );
          }}
          header={{
            search: (
              <SearchBar
                onSearch={(value: string) => {
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: "1",
                      search: value,
                    },
                    { replace: true },
                  );
                }}
                placeholder="Search by Bill No, Patient or MR No..."
                className="w-full max-w-sm"
              />
            ),
            filter: (
              <Filter
                title="IPD Bill Filter"
                onResetFilter={() => setFilterData(null)}
                onFilterApiCall={(data) => {
                  setFilterData({ multiple_filter: data });
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: "1",
                    },
                    { replace: true },
                  );
                }}
                inputFields={[
                  <View className="w-full my-4" key="patient-name">
                    <SingleSelector
                      name="patient_name"
                      placeholder="Patient Name"
                      options={patientNameOptions}
                    />
                  </View>,
                  <View className="w-full my-4" key="status">
                    <SingleSelector
                      name="status"
                      placeholder="Status"
                      options={statusOptions}
                    />
                  </View>,
                ]}
              />
            ),
          }}          footer={{
            pagination: (
              <PaginationComponent
                current_page={billData?.current_page}
                last_page={billData?.last_page}
                getPageNumberHandler={(page: number) => {
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: page.toString(),
                    },
                    { replace: true },
                  );
                }}
              />
            ),
          }}
        />
      </Card>
    </View>
  );
};

export default IpdBillsPage;



