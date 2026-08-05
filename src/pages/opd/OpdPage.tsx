import { useOpd } from "@/actions/calls/opd";
import Button from "@/components/button";
import ActionMenu from "@/components/editDeleteAction";
import Modal from "@/components/Modal";
import PaginationComponent from "@/components/Pagination";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import { handleSortChange } from "@/utils/helperFunctions";
import {
  EDIT_OPD_URL,
  OPD_DETAIL_URL,
  OPD_FORM_URL,
  OPD_TABLE_URL,
} from "@/utils/urls/frontend";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const OpdPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { opdListHandler, OpdDeleteHandler, cleanUp } = useOpd();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const opdListData = useSelector((state: any) => state.opd.opdListData);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      opdListHandler(
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
    { label: "Opd Number (A-Z)", value: "opd_no", order: "asc" },
    { label: "Opd Number (Z-A)", value: "opd_no", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
    { label: "Visit Date (A-Z)", value: "date", order: "asc" },
    { label: "Visit Date (Z-A)", value: "date", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  // const handleSortChange = (option: SortOption, setActiveSort: React.Dispatch<React.SetStateAction<SortOption | null>>, setSearchParams: unknown, searchParams: URLSearchParams) => {
  //   setActiveSort(option);
  //   setSearchParams(
  //     {
  //       ...Object.fromEntries([...searchParams]),
  //       currentPage: "1",
  //       sort_by: option.value.split("_")[0],
  //       sort_order: option.value.split("_")[1],
  //     },
  //     { replace: true }
  //   );
  // };

  return (
    <React.Fragment>
      <Modal
        title="OPD Delete"
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
                OpdDeleteHandler(deleteId, (success: boolean) => {
                  if (success) {
                    opdListHandler(
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
        <Text as="h1" className="text-2xl font-bold text-text-DEFAULT mb-1">
          OPD Patients
        </Text>
        <Text as="p" className="text-text-light">
          View and manage outpatient records
        </Text>
      </View>

      <Card className="overflow-hidden">
        <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:boder-border">
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
                  navigate(OPD_TABLE_URL + OPD_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add OPD User
              </Button>
            </View>
          </View>
        </View>
        {/* Table */}
        <DynamicTable
          tableHeaders={["OPD Number", "Status", "Visit Date", "Actions"]}
          tableData={opdListData?.data?.map((item: any) => [
            <Link to={OPD_TABLE_URL + OPD_DETAIL_URL + "/" + item.id}>
              {item.opd_number}
            </Link>,
            item.status,
            dayjs(item.visit_date).format("YYYY-MM-DD HH:mm:ss"),
            <ActionMenu
              onEdit={() =>
                navigate(OPD_TABLE_URL + EDIT_OPD_URL + "/" + item.id)
              }
              onDelete={() => setDeleteId(item.id)}
            />,
          ])}
        />
        <PaginationComponent
          getPageNumberHandler={(page) => {
            setSearchParams(
              {
                ...Object.fromEntries([...searchParams]),
                currentPage: `${page}`,
              },
              { replace: true }
            );
          }}
          last_page={opdListData?.last_page}
          current_page={opdListData?.current_page}
        />
      </Card>
    </React.Fragment>
  );
};
export default OpdPage;
