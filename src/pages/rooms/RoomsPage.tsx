import { useRoom } from "@/actions/calls/room";
import { RootState } from "@/actions/store";
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
import { handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  ROOMS_DETAIL_URL,
  ROOMS_FORM_URL,
  ROOMS_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const RoomsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { getRoomList, cleanUp, deleteRoom } = useRoom();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const roomsData = useSelector((state: RootState) => state?.room?.rooms);

  useEffect(() => {
    getRoomList(
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

  const handleDeletePatient = () => {
    if (deleteId) {
      deleteRoom(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          getRoomList(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
    );
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "name", order: "asc" },
    { label: "Name (Z-A)", value: "name", order: "desc" },
    { label: "Room Type (A-Z)", value: "room_type", order: "asc" },
    { label: "Room Type (Z-A)", value: "room_type", order: "desc" },
    { label: "Room Number (A-Z)", value: "room_number", order: "asc" },
    { label: "Room Number (Z-A)", value: "room_number", order: "desc" },
    { label: "Ward (A-Z)", value: "ward_id", order: "asc" },
    { label: "Ward (Z-A)", value: "ward_id", order: "desc" },
    { label: "Bed Count (A-Z)", value: "bed_count", order: "asc" },
    { label: "Bed Count (Z-A)", value: "bed_count", order: "desc" },
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
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Room Delete"
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
          <Button variant="danger" className="flex items-center gap-2" onPress={handleDeletePatient}>
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
          Rooms
        </Text>
        <Text as="p" className="text-text-light">
          Manage hospital rooms
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
            "Room Type",
            "Room Number",
            "Ward",
            "Bed Count",
            "Floor",
            "Status",
            "Action",
          ]}
          tableData={roomsData?.data?.map((room: any) => [
            <Link to={`${ROOMS_TABLE_URL + ROOMS_DETAIL_URL}/${room.id}`}>
              <Text as="span" className="font-medium text-text-DEFAULT">
                {room.name}
              </Text>
            </Link>,
            room.room_type || "N/A",
            room.room_number || "N/A",
            room.ward?.name || room.ward_name || room.ward_id || "N/A",
            room.bed_count || "N/A",
            room.floor,
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(room.status)}
            >
              {room.status}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(`${ROOMS_TABLE_URL + ROOMS_FORM_URL}/${room.id}`)
              }
              onDelete={() => setDeleteId(room.id)}
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
                onPress={() => navigate(ROOMS_TABLE_URL + ROOMS_FORM_URL)}
              >
                <Plus size={16} /> Add Rooms
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={roomsData?.current_page}
                last_page={roomsData?.last_page}
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
export default RoomsPage;
