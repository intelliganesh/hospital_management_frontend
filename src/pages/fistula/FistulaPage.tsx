import { useFistula } from "@/actions/calls/fistula";
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
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  FISTULA_TABLE_URL,
  FISTULA_FORM_URL,
  FISTULA_EDIT_URL,
  FISTULA_DETAILS_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const FistulaPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { fistulaListHandler, deleteFistulaHandler, cleanUp } = useFistula();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fistulaListData = useSelector(
    (state: any) => state?.fistula?.fistulaListData,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      fistulaListHandler(
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
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Fistula Name (A-Z)", value: "fistula_name", order: "asc" },
    { label: "Fistula Name (Z-A)", value: "fistula_name", order: "desc" },
    {
      label: "Sub Fistula Name (A-Z)",
      value: "sub_fistula_name",
      order: "asc",
    },
    {
      label: "Sub Fistula Name (Z-A)",
      value: "sub_fistula_name",
      order: "desc",
    },
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
        title="Delete Fistula"
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
            className="flex items-center gap-2"
            onPress={() => {
              if (deleteId) {
                deleteFistulaHandler(
                  deleteId,
                  (success: boolean) => {
                    if (success) {
                      fistulaListHandler(
                        searchParams?.get("currentPage") ?? 1,
                        () => {
                          modalCloseHandler();
                        },
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
            }}
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
          Fistula
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Fistula
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        {/* <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:border-none">
          <View className="flex gap-2 w-full  justify-between items-center ">
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
            <View className="flex gap-3">
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
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(ALLERGY_TABLE_URL + ALLERGY_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Test
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Fistula Name",
            "Sub Fistula Name",
            "Department Type",
            "Status",
            "Actions",
          ]}
          tableData={fistulaListData?.data?.map((data: any) => [
            <Link
              to={FISTULA_TABLE_URL + FISTULA_DETAILS_URL + "/" + data.id}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {data?.fistula_name || "N/A"}
            </Link>,
            // data?.name || "N/A",
            data?.sub_fistula_name
              ? data?.sub_fistula_name?.split("_").join(" ")
              : data?.sub_fistula_name || "N/A",
            data?.department_type || "N/A",
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(data?.is_active)}
            >
              {data.is_active || "N/A"}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(FISTULA_TABLE_URL + FISTULA_EDIT_URL + "/" + data.id)
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
                    { replace: true },
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
                    searchParams,
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
                  navigate(FISTULA_TABLE_URL + FISTULA_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Fistula
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={fistulaListData?.current_page}
                last_page={fistulaListData?.last_page}
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
        {/* <PaginationComponent
          getPageNumberHandler={(page) => {
            setSearchParams(
              {
                ...Object.fromEntries([...searchParams]),
                currentPage: `${page}`,
              },
              { replace: true }
            );
          }}
          last_page={allergyListData?.last_page}
          current_page={allergyListData?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};

export default FistulaPage;
