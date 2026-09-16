// import { useRoom } from "@/actions/calls/rooms";
import { useWards } from "@/actions/calls/wards";
import { RootState } from "@/actions/store";
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
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  WARD_DETAILS_URL,
  WARD_EDIT_URL,
  WARD_FORM_URL,
  WARD_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const WardsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { wardListHandler, cleanUp, deleteWardHandler } = useWards();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const wardsData = useSelector((state: RootState) => state?.wards?.wardListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      wardListHandler(
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
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("currentPage"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const handleDeleteWard = () => {
    if (deleteId) {
      deleteWardHandler(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          wardListHandler(searchParams?.get("currentPage") ?? 1, () => {});
        }
      });
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "name", order: "asc" },
    { label: "Name (Z-A)", value: "name", order: "desc" },
    { label: "Ward Number (A-Z)", value: "ward_number", order: "asc" },
    { label: "Ward Number (Z-A)", value: "ward_number", order: "desc" },
    { label: "Type (A-Z)", value: "type", order: "asc" },
    { label: "Type (Z-A)", value: "type", order: "desc" },
    { label: "Floor (A-Z)", value: "floor", order: "asc" },
    { label: "Floor (Z-A)", value: "floor", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  // const handleSortChange = (option: SortOption) => {
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
        title="Ward Delete"
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
          <Button variant="danger" onPress={handleDeleteWard}>
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
          Wards
        </Text>
        <Text as="p" className="text-text-light">
          Manage hospital wards
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
                  navigate(ROOMS_TABLE_URL + ROOMS_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Rooms
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Name",
            "Ward Number",
            "Type",
            "Floor",
            "Status",
            "Action",
          ]}
          tableData={wardsData?.data?.map((ward: any) => [
            <Link to={`${WARD_TABLE_URL + WARD_DETAILS_URL}/${ward?.id}`}>
              <Text as="span" className="font-medium text-text-DEFAULT hover:text-secondary hover:underline">
                {ward.name}
              </Text>
            </Link>,
            ward?.ward_number,
            ward?.type,
            ward?.floor,
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(ward?.status)}
            >
              {ward.status}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(`${WARD_TABLE_URL + WARD_EDIT_URL}/${ward?.id}`)
              }
              onDelete={() => setDeleteId(ward?.id)}
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
                    searchParams
                  )
                }
              />
            ),
            action: (
              <Button
                variant="primary"
                size="small"
                className="flex items-center gap-2"
                onPress={() => navigate(WARD_TABLE_URL + WARD_FORM_URL)}
              >
                <Plus size={16} /> Add Ward
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={wardsData?.current_page}
                last_page={wardsData?.last_page}
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
          last_page={roomsData?.last_page}
          current_page={roomsData?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};
export default WardsPage;
