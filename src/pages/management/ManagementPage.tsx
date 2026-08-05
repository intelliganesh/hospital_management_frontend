import { useManagement } from "@/actions/calls/management";
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
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  MANAGEMENT_DETAILS_URL,
  MANAGEMENT_EDIT_URL,
  MANAGEMENT_FORM_URL,
  MANAGEMENT_TABLE_URL,
} from "@/utils/urls/frontend";
import { Loader, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const ManagementPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { managementList, deleteManagement, cleanUp } = useManagement();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading] = useState(false);

  const managementListData = useSelector(
    (state: any) => state.management.managementList
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      managementList(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        []
      );
    }
    return () => {
      cleanUp();
    };
  }, [
    // filterData,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Management Name (A-Z)", value: "management_name", order: "asc" },
    { label: "Management Name (Z-A)", value: "management_name", order: "desc" },
    { label: "Department Type (A-Z)", value: "department_type", order: "asc" },
    { label: "Department Type (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "is_active", order: "asc" },
    { label: "Status (Z-A)", value: "is_active", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Management Delete"
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
                deleteManagement(deleteId, (success: boolean) => {
                  if (success) {
                    setIsDeleting(false);
                    managementList(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
                  } else {
                    setIsDeleting(false);
                  }
                });
              } else {
                setIsDeleting(false);
              }
            }}
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            Delete{" "}
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
          Management
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Management
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Management Name",
            "Department Type",
            "Status",
            "Actions",
          ]}
          tableData={managementListData?.data?.map((data: any) => [
            <Link
              to={
                MANAGEMENT_TABLE_URL + MANAGEMENT_DETAILS_URL + "/" + data?.id
              }
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {data?.management_name || "N/A"}
            </Link>,
            data.department_type || "N/A",
            <Badge
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.is_active)}
            >
              {data?.is_active || "N/A"}
            </Badge>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  MANAGEMENT_TABLE_URL + MANAGEMENT_EDIT_URL + "/" + data?.id
                )
              }
              onDelete={() => setDeleteId(data?.id)}
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
                  navigate(MANAGEMENT_TABLE_URL + MANAGEMENT_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Management
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={managementListData?.current_page}
                last_page={managementListData?.last_page}
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

export default ManagementPage;
