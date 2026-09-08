import { useBillingServiceCategory } from "@/actions/calls/billingServiceCategory";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { RootState } from "@/actions/store";
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  BILLING_SERVICE_CATEGORY_EDIT_URL,
  BILLING_SERVICE_CATEGORY_FORM_URL,
  BILLING_SERVICE_CATEGORY_TABLE_URL,
} from "@/utils/urls/frontend";
import { Loader, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const getCategoryName = (data: any) =>
  data?.category_name || data?.service_category || data?.name || "N/A";

const BillingServiceCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    billingServiceCategoryListHandler,
    deleteBillingServiceCategoryHandler,
    cleanUp,
  } = useBillingServiceCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  const billingServiceCategoryListData = useSelector(
    (state: RootState) =>
      state.billingServiceCategory.billingServiceCategoryListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      billingServiceCategoryListHandler(
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
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const sortOptions: SortOption[] = [
    { label: "Category (A-Z)", value: "category_name", order: "asc" },
    { label: "Category (Z-A)", value: "category_name", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const modalCloseHandler = () => setDeleteId(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Billing Service Category Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this data? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={modalCloseHandler}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onPress={() => {
              setIsDeleting(true);
              if (deleteId) {
                deleteBillingServiceCategoryHandler(deleteId, (success) => {
                  if (success) {
                    billingServiceCategoryListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => modalCloseHandler(),
                      searchParams.get("search") ?? null,
                      searchParams.get("sort_by") ?? null,
                      searchParams.get("sort_order") ?? null
                    );
                  }
                  setIsDeleting(false);
                });
              } else {
                setIsDeleting(false);
              }
            }}
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            Delete
            <span className={`${isDeleting ? "block" : "hidden"}`}>
              <Loader size={16} className="animate-spin" />
            </span>
          </Button>
        </View>
      </Modal>

      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Billing Service Categories
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all billing service categories
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={["Category", "Status", "Actions"]}
          tableData={billingServiceCategoryListData?.data?.map((data: any) => [
            <Text as="span" className="font-medium text-text-DEFAULT">
              {getCategoryName(data)}
            </Text>,
            <Badge
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status || "N/A"}
            </Badge>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  BILLING_SERVICE_CATEGORY_TABLE_URL +
                    BILLING_SERVICE_CATEGORY_EDIT_URL +
                    "/" +
                    data.id
                )
              }
              onDelete={() => setDeleteId(data.id)}
            />,
          ])}
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
                    { replace: true }
                  );
                }}
                className="shadow-sm dark:shadow-none"
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
                onPress={() => {
                  navigate(
                    BILLING_SERVICE_CATEGORY_TABLE_URL +
                      BILLING_SERVICE_CATEGORY_FORM_URL
                  );
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Billing Service Category
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={billingServiceCategoryListData?.current_page}
                last_page={billingServiceCategoryListData?.last_page}
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

export default BillingServiceCategoryPage;