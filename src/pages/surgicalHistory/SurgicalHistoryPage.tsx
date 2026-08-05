import { useSurgicalHistory } from "@/actions/calls/surgicalHistory";
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
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  SURGICAL_HISTORY_EDIT_URL,
  SURGICAL_HISTORY_FORM_URL,
  SURGICAL_HISTORY_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const SurgicalHistoryPage = () => {
  const navigate = useNavigate();
  const {
    surgicalHistoryList,
    surgicalHistoryDelete,
    surgicalHistoryDetail,
    cleanUp,
  } = useSurgicalHistory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const [description, setDescription] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const surgicalHistoryData = useSelector(
    (state: RootState) => state?.surgicalHistory?.surgicalHistoryListData
  );
  // const surgicalDetail = useSelector(
  //   (state: RootState) => state?.surgicalHistory?.surgicalHistoryDetailData
  // );
  const surgicalHistoryListFullData = useSelector(
    (state: RootState) => state?.surgicalHistory?.surgicalHistoryListFullData
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      surgicalHistoryList(
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
      surgicalHistoryDelete(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          surgicalHistoryList(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : false);
      }
    );
    }
  };

  const modalDescriptionCloseHandler = () => {
    setDescription(null);
  };

  const handleDescription = (id: string) => {
    surgicalHistoryDetail(id, (success, data: any) => {
      if (success) {
        setDescription(data?.description || "No description available");
      } else {
        setDescription("Failed to fetch description");
      }
    });
  };
  const sortOptions: SortOption[] = [
    { label: "Surgery Name (A-Z)", value: "surgery_name", order: "asc" },
    { label: "Surgery Name (Z-A)", value: "surgery_name", order: "desc" },
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
        title="Surgery Description"
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
        title="Surgical History Delete"
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
          Surgical History
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all surgical history
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={["Surgery Name", "Department Type", "Status", "Action"]}
          tableData={surgicalHistoryData?.data?.map((data: any) => [
            // <Link
            //   to={`${
            //     SURGICAL_HISTORY_TABLE_URL + SURGICAL_HISTORY_DETAILS_URL
            //   }/${data.id}`}
            // >
            // <Text as="span" className="font-medium text-text-DEFAULT">
            <Button
              variant="ghost"
              onClick={() => handleDescription(data.id)}
              className="text-left hover:text-primary underline"
            >
              {data.surgery_name}
            </Button>,
            data.department_type,
            // </Text>
            // </Link>,
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(data.is_active)}
            >
              {data.is_active}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  `${SURGICAL_HISTORY_TABLE_URL + SURGICAL_HISTORY_EDIT_URL}/${
                    data.id
                  }`
                )
              }
              onDelete={() => setDeleteId(data.id)}
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
                className={commanButtonStyle}
                onPress={() =>
                  navigate(
                    SURGICAL_HISTORY_TABLE_URL + SURGICAL_HISTORY_FORM_URL
                  )
                }
              >
                <Plus size={16} /> Add New Surgical History
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={surgicalHistoryListFullData?.current_page}
                last_page={surgicalHistoryListFullData?.last_page}
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

export default SurgicalHistoryPage;
