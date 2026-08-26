import { useBeds } from "@/actions/calls/beds";
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
  BED_DETAILS_URL,
  // BED_EDIT_URL,
  BED_FORM_URL,
  BED_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const BedsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { bedListHandler, deleteBedHandler, cleanUp } = useBeds();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const bedsData = useSelector((state: RootState) => state?.beds?.bedListData);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      bedListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
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

  const handleDeleteDepartment = () => {
    if (deleteId) {
      deleteBedHandler(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          bedListHandler(searchParams?.get("currentPage") ?? 1, () => {});
        }
      });
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Bed No (A-Z)", value: "bed_number", order: "asc" },
    { label: "Bed No (Z-A)", value: "bed_number", order: "desc" },
    { label: "Bed Type (A-Z)", value: "bed_type", order: "asc" },
    { label: "Bed Type (Z-A)", value: "bed_type", order: "desc" },
    { label: "Room (A-Z)", value: "room_id", order: "asc" },
    { label: "Room (Z-A)", value: "room_id", order: "desc" },
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
        title="Delete Bed"
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
          <Button variant="danger" onPress={handleDeleteDepartment}>
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
          Beds
        </Text>
        <Text as="p" className="text-text-light">
          Manage hospital Beds
        </Text>
      </View>

      <Card className="overflow-hidden">
        <DynamicTable
          tableHeaders={[
            "Bed No",
            "Bed Type",
            "Room Name / Room Number",
            "Status",
            "Action",
          ]}
          tableData={bedsData?.data?.map((bed: any) => [
            <Link to={`${BED_TABLE_URL + BED_DETAILS_URL}/${bed.id}`}>
              <Text as="span" className="font-medium text-text-DEFAULT">
                {bed.bed_number}
              </Text>
            </Link>,
            bed.bed_type,
            `${bed?.room?.name || "N/A"} / ${bed?.room?.room_number || "N/A"}`,
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(bed.status)}
            >
              {bed?.status || "N/A"}
            </Text>,
            // bed.status ?
            // (
            //   <Text
            //   as="span"
            //   className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
            //   style={getStatusColorScheme(bed.status)}
            // >
            //   Yes
            // </Text>
            // ) : (
            //   <Text
            //   as="span"
            //   className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
            //   style={getStatusColorScheme(bed.status)}
            // >
            //   No
            // </Text>
            // ),
            <ActionMenu
              // onEdit={() =>
              //   navigate(`${BED_TABLE_URL + BED_EDIT_URL}/${bed.id}`)
              // }
              onDelete={() => setDeleteId(bed.id)}
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
                    searchParams,
                  )
                }
              />
            ),
            action: (
              <Button
                variant="primary"
                size="small"
                className="flex items-center gap-2"
                onPress={() => navigate(BED_TABLE_URL + BED_FORM_URL)}
              >
                <Plus size={16} /> Add Bed
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={bedsData?.current_page}
                last_page={bedsData?.last_page}
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
      </Card>
    </React.Fragment>
  );
};
export default BedsPage;
