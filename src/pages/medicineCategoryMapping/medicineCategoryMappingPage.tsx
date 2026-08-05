import { useMedicineCategoryMapping } from "@/actions/calls/medicineCategoryMapping";
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
import { commanButtonStyle, handleSortChange } from "@/utils/helperFunctions";
import {
  MEDICINE_CATEGORY_MAPPING_EDIT_URL,
  MEDICINE_CATEGORY_MAPPING_FORM_URL,
  MEDICINE_CATEGORY_MAPPING_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const MedicineCategoryMappingPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const {
    listMedicineCategoryMappingHandler,
    cleanUp,
    medicineCategoryMapingDeleteHandler,
  } = useMedicineCategoryMapping();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const medicineCategoryMappingListData = useSelector(
    (state: any) =>
      state.medicineCategoryMapping.medicineCategoryMappingListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      listMedicineCategoryMappingHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null
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
    { label: "Medicine Name (A-Z)", value: "medicine_id", order: "asc" },
    { label: "Medicine Name (Z-A)", value: "medicine_id", order: "desc" },
    { label: "Category Name (A-Z)", value: "category_id", order: "asc" },
    { label: "Category Name (Z-A)", value: "category_id", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <Modal
        title="Medicine Category Mapping Delete"
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
                medicineCategoryMapingDeleteHandler(
                  deleteId,
                  (success: boolean) => {
                    if (success) {
                      listMedicineCategoryMappingHandler(
                        searchParams?.get("currentPage") ?? 1,
                        () => {
                          modalCloseHandler();
                        }
                      );
                    }
                  },
                  (status) => {
                    setIsDeleting(status === "pending" ? true : false);
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
          Medicine Category Mapping
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Medicine Category Mapping
        </Text>
      </View>

      <Card className="overflow-hidden">
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
                  navigate(
                    MEDICINE_CATEGORY_MAPPING_TABLE_URL +
                      MEDICINE_CATEGORY_MAPPING_FORM_URL
                  );
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Medicine Category Mapping
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={["Category Name", "Medicine Name", "Actions"]}
          tableData={Array.from(
            {
              length: medicineCategoryMappingListData?.data?.length,
            },
            (_, index: number) => {
              return [
                medicineCategoryMappingListData?.data[index]?.category
                  ?.category_name,
                medicineCategoryMappingListData?.data[index]?.medicine
                  ?.medicine_name,
                <ActionMenu
                  onEdit={() =>
                    navigate(
                      MEDICINE_CATEGORY_MAPPING_TABLE_URL +
                        MEDICINE_CATEGORY_MAPPING_EDIT_URL +
                        "/" +
                        medicineCategoryMappingListData?.data[index]?.id
                    )
                  }
                  onDelete={() =>
                    setDeleteId(
                      medicineCategoryMappingListData?.data[index]?.id
                    )
                  }
                />,
              ];
            }
          )}
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
                    MEDICINE_CATEGORY_MAPPING_TABLE_URL +
                      MEDICINE_CATEGORY_MAPPING_FORM_URL
                  );
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add Medicine Category Mapping
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={medicineCategoryMappingListData?.current_page}
                last_page={medicineCategoryMappingListData?.last_page}
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
          last_page={medicineCategoryMappingListData?.last_page}
          current_page={medicineCategoryMappingListData?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};

export default MedicineCategoryMappingPage;
