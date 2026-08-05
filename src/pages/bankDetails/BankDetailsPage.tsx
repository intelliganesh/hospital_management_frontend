import { useBankDetails } from "@/actions/calls/bankDetails";
import { RootState } from "@/actions/store";
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
import { GenericStatus } from "@/interfaces";
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  BANK_DETAILS_DETAILS_URL,
  BANK_DETAILS_EDIT_URL,
  BANK_DETAILS_FORM_URL,
  BANK_DETAILS_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const BankDetailsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { bankDetailsListHandler, deleteBankDetailsHandler, cleanUp } =
    useBankDetails();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const bankDetailsData = useSelector(
    (state: RootState) => state?.bankDetails?.bankDetailsListData,
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      bankDetailsListHandler(
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
                : status === "success" && false,
          );
        },
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

  const handleDeleteBankDetails = () => {
    if (deleteId) {
      deleteBankDetailsHandler(
        deleteId,
        (success: boolean) => {
          if (success) {
            modalCloseHandler();
            bankDetailsListHandler(
              searchParams?.get("currentPage") ?? 1,
              () => {},
            );
          }
        },
        (status) => {
          setIsDeleting(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Bank Name (A-Z)", value: "bank_name", order: "asc" },
    { label: "Bank Name (Z-A)", value: "bank_name", order: "desc" },
    { label: "Is Active (A-Z)", value: "is_active", order: "asc" },
    { label: "Is Active (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Bank Details Delete"
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
            onPress={handleDeleteBankDetails}
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
          Bank Details
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Bank Details
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={["Bank Name", "Account Details", "Is Active", "Action"]}
          tableData={bankDetailsData?.data?.map((bank: any) => [
            <Link
              to={`${BANK_DETAILS_TABLE_URL + BANK_DETAILS_DETAILS_URL}/${bank.id}`}
            >
              <Text as="span" className="font-medium text-text-DEFAULT">
                {bank.title}
              </Text>
            </Link>,
            bank.details || "N/A",

            Number(bank.is_active) === 1 ? (
              <Text
                as="span"
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                style={getStatusColorScheme(GenericStatus.ACTIVE)}
              >
                Yes
              </Text>
            ) : (
              <Text
                as="span"
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                style={getStatusColorScheme(GenericStatus.INACTIVE)}
              >
                No
              </Text>
            ),
            <ActionMenu
              onEdit={() =>
                navigate(
                  `${BANK_DETAILS_TABLE_URL + BANK_DETAILS_EDIT_URL}/${bank?.id}`,
                )
              }
              onDelete={() => setDeleteId(bank.id)}
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
            action: (
              <Button
                variant="primary"
                size="small"
                className={commanButtonStyle}
                onPress={() =>
                  navigate(BANK_DETAILS_TABLE_URL + BANK_DETAILS_FORM_URL)
                }
              >
                <Plus size={16} /> Add New Bank Details
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={bankDetailsData?.current_page}
                last_page={bankDetailsData?.last_page}
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
export default BankDetailsPage;
