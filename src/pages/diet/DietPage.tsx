import { useDiet } from "@/actions/calls/diet";
import BouncingLoader from "@/components/BouncingLoader";
import Button from "@/components/button";
import DeleteLoader from "@/components/deleteLoader";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";  `12 `
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  DIET_TABLE_URL,
  DIET_FORM_URL,
  DIET_EDIT_URL,
  DIET_DETAILS_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const DietPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { dietListHandler, deleteDietHandler, cleanUp } = useDiet();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const dietListData = useSelector((state: any) => state?.diet?.dietListData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      dietListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (status) => {
          setIsLoading(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
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

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Diet Name (A-Z)", value: "diet_name", order: "asc" },
    { label: "Diet Name (Z-A)", value: "diet_name", order: "desc" },
    { label: "Calories (A-Z)", value: "calories", order: "asc" },
    { label: "Calories (Z-A)", value: "calories", order: "desc" },
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
        title="Diet Delete"
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
                deleteDietHandler(deleteId, (success: boolean) => {
                  if (success) {
                    dietListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
                  }
                },
                (status) => {
                  setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
                }
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
          Diet
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Diet Plan
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
          tableHeaders={["Diet Name", "Calories","Department Type","Status", "Actions"]}
          tableData={dietListData?.data?.map((data: any) => [
            <Link
              to={DIET_TABLE_URL + DIET_DETAILS_URL + "/" + data.id}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {data?.diet_name || "N/A"}
            </Link>,
            data?.calories || "N/A",
            data?.department_type || "N/A",
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(data?.is_active)}
            >
              {data?.is_active || "N/A"}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(DIET_TABLE_URL + DIET_EDIT_URL + "/" + data.id)
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
                  navigate(DIET_TABLE_URL + DIET_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Diet
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={dietListData?.current_page}
                last_page={dietListData?.last_page}
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

export default DietPage;
