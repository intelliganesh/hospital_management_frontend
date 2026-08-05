import { useFindings } from "@/actions/calls/findings";
import Button from "@/components/button";
import ActionMenu from "@/components/editDeleteAction";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  FINDINGS_DETAILS_URL,
  FINDINGS_EDIT_URL,
  FINDINGS_FORM_URL,
  FINDINGS_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import Filter from "../filter";
import Select from "@/components/Select";
import {
  categoryOptions,
  statusOptions,
} from "../forms/findings form/findingsFormOptions";

const FindingsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { findingListHandler, deleteFindingHandler, cleanUp } = useFindings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );
  const findingListData = useSelector(
    (state: any) => state.findings.findingListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      findingListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        filterData
      );
    }
    return () => {
      cleanUp();
    };
  }, [
    filterData,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Finding Name (A-Z)", value: "finding_name", order: "asc" },
    { label: "Finding Name (Z-A)", value: "finding_name", order: "desc" },
    { label: "Finding Code (A-Z)", value: "finding_code", order: "asc" },
    { label: "Finding Code (Z-A)", value: "finding_code", order: "desc" },
    { label: "Category (A-Z)", value: "category", order: "asc" },
    { label: "Category (Z-A)", value: "category", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
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
            onPress={() => {
              if (deleteId) {
                deleteFindingHandler(deleteId, (success: boolean) => {
                  if (success) {
                    findingListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      }
                    );
                  }
                });
              }
            }}
          >
            Delete
          </Button>
        </View>
      </Modal>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-text-DEFAULT mb-1"
        >
          Findings
        </Text>
        <Text as="p" className="text-text-light">
          Manage Findings
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
              <Filter
                title="Finding Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="finding_name" placeholder="Finding Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="finding_code" placeholder="Finding Code" />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      placeholder="Select Category"
                      options={categoryOptions}
                      onChange={(e) => {
                        setFilterData({
                          ...filterData,
                          category: e.target.value,
                        });
                      }}
                      required={true}
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      placeholder="Select Status"
                      options={statusOptions}
                      onChange={(e) => {
                        setFilterData({
                          ...filterData,
                          status: e.target.value,
                        });
                      }}
                      required={true}
                    />
                  </View>,
                ]}
              />

              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(FINDINGS_URL + FINDINGS_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Finding
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Finding Name",
            "Finding Code",
            "Category",
            "Status",
            // "Test Description",
            "Actions",
          ]}
          tableData={findingListData?.data?.map((data: any) => [
            // <Link to={FINDINGS_URL + FINDINGS_DETAILS_URL + "/" + data.id}>
            //   {data?.test_name}
            // </Link>,
            // data?.test_description,
            <Link
              to={FINDINGS_URL + FINDINGS_DETAILS_URL + "/" + data.id}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {data?.finding_name}
            </Link>,
            data?.finding_code,
            data?.category,
            <Badge
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status}
            </Badge>,
            <ActionMenu
              onEdit={() =>
                navigate(FINDINGS_URL + FINDINGS_EDIT_URL + "/" + data.id)
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
            filter: (
              <Filter
                title="Finding Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="finding_name" placeholder="Finding Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="finding_code" placeholder="Finding Code" />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      placeholder="Select Category"
                      options={categoryOptions}
                      onChange={(e) => {
                        setFilterData({
                          ...filterData,
                          category: e.target.value,
                        });
                      }}
                      required={true}
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      placeholder="Select Status"
                      options={statusOptions}
                      onChange={(e) => {
                        setFilterData({
                          ...filterData,
                          status: e.target.value,
                        });
                      }}
                      required={true}
                    />
                  </View>,
                ]}
              />
            ),
            action: (
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(FINDINGS_URL + FINDINGS_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Finding
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={findingListData?.current_page}
                last_page={findingListData?.last_page}
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

export default FindingsPage;
