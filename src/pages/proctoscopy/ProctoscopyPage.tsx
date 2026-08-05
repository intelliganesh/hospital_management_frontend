import { useProctoscopy } from "@/actions/calls/proctoscopy";
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
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import {
  PROCTOSCOPY_TABLE_URL,
  PROCTOSCOPY_FORM_URL,
  PROCTOSCOPY_EDIT_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const ProctoscopyPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { proctoscopyListHandler, deleteProctoscopyHandler, cleanUp } = useProctoscopy();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const proctoscopyListData = useSelector((state: any) => state?.proctoscopy?.proctoscopyListData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      proctoscopyListHandler(
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
    { label: "Proctoscopy Name (A-Z)", value: "proctoscopys_name", order: "asc" },
    { label: "Proctoscopy Name (Z-A)", value: "proctoscopys_name", order: "desc" },
    { label: "Department Type (A-Z)", value: "department_type", order: "asc" },
    { label: "Department Type (Z-A)", value: "department_type", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Proctoscopy Delete"
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
                  deleteProctoscopyHandler(deleteId, (success: boolean) => {
                  if (success) {
                    proctoscopyListHandler(
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
          Proctoscopy 
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Proctoscopy's
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
          tableHeaders={["Proctoscopy Name","Department Type", "Actions"]}
          tableData={proctoscopyListData?.data?.map((data: any) => [
            // <Link
            //   to={DRE_TABLE_URL + DRE_DETAILS_URL + "/" + data.id}
            //   className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            // >
            //   {data?.diet_name || "N/A"}
            // </Link>,
            data?.proctoscopys_name || "N/A",
            data?.department_type || "N/A",
            <ActionMenu
              onEdit={() =>
                navigate(PROCTOSCOPY_TABLE_URL + PROCTOSCOPY_EDIT_URL + "/" + data.id)
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
                  navigate(PROCTOSCOPY_TABLE_URL + PROCTOSCOPY_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add New Proctoscopy
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={proctoscopyListData?.current_page}
                last_page={proctoscopyListData?.last_page}
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

export default ProctoscopyPage;
