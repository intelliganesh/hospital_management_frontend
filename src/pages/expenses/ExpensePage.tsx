import { useExpenses } from "@/actions/calls/expenses";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import DeleteLoader from "@/components/deleteLoader";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { toast } from "@/utils/custom-hooks/use-toast";
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import {
  DATE_FORMAT,
  EXPENSES_DETAILS_URL,
  EXPENSES_EDIT_URL,
  EXPENSES_FORM_URL,
  EXPENSES_TABLE_URL,
} from "@/utils/urls/frontend";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const ExpensesPage = () => {
  const navigate = useNavigate();
  const { expensesList, deleteExpenses, cleanUp, downloadVoucherHandler } =
    useExpenses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const expensesListData = useSelector(
    (state: any) => state?.expenses?.expensesList
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      expensesList(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (status) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
              ? true
              : status === "success" && false
          );
        }
      );
    }
    return () => {
      cleanUp();
    };
  }, [
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("currentPage"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const handleDeleteExpenses = () => {
    if (deleteId) {
      deleteExpenses(
        deleteId,
        (success: boolean) => {
          if (success) {
            modalCloseHandler();
            expensesList(searchParams?.get("currentPage") ?? 1, () => {});
          }
        },
        (status) => {
          setIsDeleting(
            status === "pending"
              ? true
              : status === "failed"
              ? true
              : status === "success" && false
          );
        }
      );
    }
  };

  const voucherDownloadHandler = (id: string) => {
    if (id) {
      setIsLoading(true);
      downloadVoucherHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Voucher",
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

  const sortOptions: SortOption[] = [
    { label: "Date (A-Z)", value: "date", order: "asc" },
    { label: "Date (Z-A)", value: "date", order: "desc" },
    { label: "Amount (Low to High)", value: "amount", order: "asc" },
    { label: "Amount (High to Low)", value: "amount", order: "desc" },
    { label: "Expense Name (A-Z)", value: "expense_name", order: "asc" },
    { label: "Expense Name (Z-A)", value: "expense_name", order: "desc" },
    { label: "Mode of Payment (A-Z)", value: "mode_of_payment", order: "asc" },
    { label: "Mode of Payment (Z-A)", value: "mode_of_payment", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <>
      <React.Fragment>
        <BouncingLoader isLoading={isLoading} />
        <Modal
          title="Expense Delete"
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
            <Button
              variant="danger"
              className="flex items-center gap-2"
              onPress={handleDeleteExpenses}
            >
              Delete <DeleteLoader isDeleting={isDeleting} />
            </Button>
          </View>
        </Modal>
        <View className="mb-6">
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Expenses
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all Expenses
          </Text>
        </View>

        <Card className={dynamicTableCardStyle}>
          <DynamicTable
            tableHeaders={[
              "Expense Name",
              "Date",
              "Amount",
              "Mode of Payment",
              "Voucher Number",
              "Action",
            ]}
            tableData={expensesListData?.data?.map((data: any) => [
              <Link
                to={`${EXPENSES_TABLE_URL + EXPENSES_DETAILS_URL}/${data.id}`}
              >
                {data?.expense_name}
              </Link>,
              data?.date ? dayjs(data?.date).format(DATE_FORMAT) : "-",

              data?.amount,
              data?.mode_of_payment,
              data?.voucher_number ? data?.voucher_number : "-",
              <ActionMenu
                onEdit={() =>
                  navigate(
                    `${EXPENSES_TABLE_URL + EXPENSES_EDIT_URL}/${data.id}`
                  )
                }
                onDelete={() => setDeleteId(data.id)}
                onDownloadVoucher={
                  data?.voucher_number
                    ? () => {
                        voucherDownloadHandler(data?.id);
                      }
                    : undefined
                }
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
              action: (
                <Button
                  variant="primary"
                  size="small"
                  className={commanButtonStyle}
                  onPress={() =>
                    navigate(EXPENSES_TABLE_URL + EXPENSES_FORM_URL)
                  }
                >
                  <Plus size={16} /> Add New Expense
                </Button>
              ),
            }}
            footer={{
              pagination: (
                <PaginationComponent
                  current_page={expensesListData?.current_page}
                  last_page={expensesListData?.last_page}
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
    </>
  );
};
export default ExpensesPage;
