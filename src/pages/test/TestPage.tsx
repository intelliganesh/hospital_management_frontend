import { useTest } from "@/actions/calls/test";
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
  TEST_DETAILS_URL,
  TEST_EDIT_URL,
  TEST_FORM_URL,
  TEST_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const TestPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { testListHandler, testDeleteHandler, cleanUp } = useTest();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const testListData = useSelector((state: any) => state.test.testListData);
  const [description, setDescription] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      testListHandler(
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

  const modalCloseHandler = () => {
    setDeleteId(null);
  };
  const modalDescriptionCloseHandler = () => {
    setDescription(null);
  };
  const handleDescription = (roleDescription: string) => {
    setDescription(roleDescription);
  };

  const sortOptions: SortOption[] = [
    { label: "Test Name (A-Z)", value: "test_name", order: "asc" },
    { label: "Test Name (Z-A)", value: "test_name", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Test Name"
        isOpen={description !== null}
        onClose={modalDescriptionCloseHandler}
        description={description || ""}
      >
        <View className="flex justify-end gap-2">
          <Button
            className="text-black dark:text-white "
            variant="outline"
            onPress={modalDescriptionCloseHandler}
          >
            Cancel
          </Button>
        </View>
      </Modal>
      <Modal
        title="Test Delete"
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
                testDeleteHandler(deleteId, (success: boolean) => {
                  if (success) {
                    testListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
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
          Tests
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Tests
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
                  navigate(TEST_TABLE_URL + TEST_FORM_URL);
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
            "Test Number",
            "Test Name",
            "Test Amount (Rs)",
            "Tax Amount (Rs)",
            // "Test Description",
            "Actions",
          ]}
          tableData={testListData?.data?.map((data: any) => [
            <Link to={TEST_TABLE_URL + TEST_DETAILS_URL + "/" + data.id}>
              {data?.test_number}
            </Link>,
            <Button
              variant="ghost"
              onClick={() => handleDescription(data?.test_name)}
              className="text-left hover:text-primary underline"
            >
              {data?.test_name?.length > 60 ? data?.test_name?.slice(0, 60) + "..."  : data?.test_name}
            </Button>,
            // data?.test_name,
            data?.test_price || "N/A",
            data?.tax_price || "N/A",
            // data?.test_description,
            <ActionMenu
              onEdit={() =>
                navigate(TEST_TABLE_URL + TEST_EDIT_URL + "/" + data.id)
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
                  navigate(TEST_TABLE_URL + TEST_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add Test
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={testListData?.current_page}
                last_page={testListData?.last_page}
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
          last_page={testListData?.last_page}
          current_page={testListData?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};

export default TestPage;
