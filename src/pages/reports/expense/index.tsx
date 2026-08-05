import dayjs from "dayjs";
import Filter from "@/pages/filter";
import Text from "@/components/text";
import View from "@/components/view";
import Input from "@/components/input";
import { Link } from "react-router-dom";
import Button from "@/components/button";
import { RootState } from "@/actions/store";
import { Card } from "@/components/ui/card";
import DataSort from "@/components/SortData";
import InfoCard from "@/components/ui/infoCard";
import { FileText, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import {
  REPORT,
  DATE_FORMAT,
  EXPENSES_TABLE_URL,
  EXPENSES_DETAILS_URL,
} from "@/utils/urls/frontend";
import { useDispatch, useSelector } from "react-redux";
import DynamicTable from "@/components/ui/DynamicTable";
import SingleSelector from "@/components/SingleSelector";
import BouncingLoader from "@/components/BouncingLoader";
import PaginationComponent from "@/components/Pagination";
import { useAmountType } from "@/actions/calls/amountType";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import DateRangePicker from "@/components/DateRangePicker";
import { clearList } from "@/actions/slices/expenseReport";
import { useExpenseReport } from "@/actions/calls/reports/expenses";
import { EXPENSE_REPORT_DOWNLOAD_URL } from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";
// import { Plus } from "lucide-react";
// import DataSort from "@/components/SortData";
// import ActionMenu from "@/components/editDeleteAction";

const Expense: React.FC<{}> = ({}) => {
  //   const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingStatus, setIsLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const expenseReportList = useSelector(
    (state: RootState) => state.expenseReport.expenseReportList
  );
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );

  const { amountTypeDropdownHandler } = useAmountType();

  const { cleanUp, getListApi } = useExpenseReport();

  const amountTypeData = useSelector(
    (state: RootState) => state.amountType.amountTypeDropdownData
  );

  const sortOptions: any[] = [
    { label: "Date (A-Z)", value: "date", order: "asc" },
    { label: "Date (Z-A)", value: "date", order: "desc" },
    { label: "Amount (A-Z)", value: "amount", order: "asc" },
    { label: "Amount (Z-A)", value: "amount", order: "desc" },
    { label: "Mode of payment (A-Z)", value: "mode_of_payment", order: "asc" },
    { label: "Mode of payment (Z-A)", value: "mode_of_payment", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<any | null>(sortOptions[0]);

  useEffect(() => {
    amountTypeDropdownHandler(() => {});
  }, []);

  useEffect(() => {
    getListApi(
      searchParams.get("currentPage") ?? 1,
      () => {},
      (loadingStatus) => {
        setIsLoading(
          loadingStatus == "pending"
            ? true
            : loadingStatus == "failed"
            ? true
            : loadingStatus == "success" && false
        );
      },
      searchParams.get("search") ?? null,
      searchParams.get("sort_by") ?? null,
      searchParams.get("sort_order") ?? null,
      searchParams?.get("from_date") ?? null,
      searchParams?.get("to_date") ?? null,
      filterData
    );
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

  const downloadExpensesExcel = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}${EXPENSE_REPORT_DOWNLOAD_URL}?page=${
          searchParams.get("currentPage") ?? 1
        }${
          searchParams.get("search")
            ? "&search=" + searchParams.get("search")
            : ""
        }${
          searchParams.get("sort_by")
            ? "&sort_by=" + searchParams.get("sort_by")
            : ""
        }${
          searchParams.get("sort_order")
            ? "&sort_order=" + searchParams.get("sort_order")
            : ""
        }${
          searchParams?.get("from_date")
            ? "&from_date=" + searchParams?.get("from_date")
            : ""
        }${
          searchParams?.get("to_date")
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
        }
      );

      if (!response.ok) {
        response && handleApiError(response);
        throw new Error("Excel download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses-report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      error && handleApiError(error);
      console.error("Excel download error:", error);
      alert("Failed to download Excel report");
    }
  };

  return (
    <React.Fragment>
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={loadingStatus} />
      </View>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Expense Report
        </Text>
        <Text as="p" className="text-text-light">
          Track and analyze hospital expenses and financial data
        </Text>
      </View>
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* <InfoCard
          label="Total Amount"
          valueStyle="!text-primary !text-3xl"
          icon={<CircleDollarSign />}
          value={expenseReportList?.totalExpenses ?? "N/A"}
          className="dark:bg-card rounded-2xl shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
        /> */}
        <InfoCard
          label="Total Amount"
          value={`₹${expenseReportList?.totalExpenses || 0}`}
          valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
          icon={<TrendingUp size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View>
      {/* <View className="mb-6 flex justify-between items-center">
        
        <View className="flex gap-4">
          {expenseReportList?.table?.data?.length > 0 && (
            <Button variant="outline" onPress={downloadExpensesExcel}>
              Download
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

      {/* <View className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft dark:shadow-none border border-slate-200 dark:border-slate-700 mb-6"> */}
      <View className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <View className="flex items-center gap-4">
          {expenseReportList?.table?.data?.length > 0 && (
            <Button
              variant="outline"
              onPress={downloadExpensesExcel}
              className="flex items-center gap-2"
            >
              <FileText size={16} />
              Download Report
            </Button>
          )}
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
      {/* </View> */}

      <Card className={dynamicTableCardStyle}>
        {/* Table */}
        <DynamicTable
          // isLoading={loadingStatus}
          tableHeaders={[
            "Name",
            "Date",
            "Amount",
            "Description",
            "Voucher Number",
            "Mode of payment",
          ]}
          tableData={expenseReportList?.table?.data?.map((expense: any) => [
            <Link
              target="_blank"
              to={`${REPORT + EXPENSES_TABLE_URL + EXPENSES_DETAILS_URL}/${
                expense.id
              }`}
            >
              {expense.expense_name}
            </Link>,
            dayjs(expense.date).format(DATE_FORMAT),
            expense.amount,
            expense.description,
            expense.voucher_number||'-',
            expense.mode_of_payment,
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
                    <SingleSelector
                      required={true}
                      id="mode_of_payment"
                      name="mode_of_payment"
                      label="Mode of Payment"
                      options={amountTypeData?.map((item: any) => ({
                        value: item.amount_for,
                        label: item.amount_for,
                      }))}
                      placeholder="Select Mode of Payment"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="voucher_number" placeholder="Voucher Number" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="date" type="date" placeholder="Date" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="amount" placeholder="Amount" type="number" />
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
                    searchParams
                  )
                }
                activeSort={activeSort ?? undefined}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={expenseReportList?.table?.current_page}
                last_page={expenseReportList?.table?.last_page}
                getPageNumberHandler={(page) =>
                  setSearchParams(
                    {
                      ...Object.fromEntries(searchParams),
                      currentPage: `${page}`,
                    },
                    { replace: true }
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

export default Expense;
