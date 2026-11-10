import { useShloka } from "@/actions/calls/shloka";
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
  SHLOKA_DETAILS_URL,
  SHLOKA_EDIT_URL,
  SHLOKA_FORM_URL,
  SHLOKA_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const ShlokaPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { shlokaListHandler, cleanUp, deleteShlokaHandler } =
    useShloka();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const shlokaData = useSelector(
    (state: RootState) => state?.shloka?.shlokaListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      shlokaListHandler(
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
      deleteShlokaHandler(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          shlokaListHandler(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
      );
    }
  };
  const sortOptions: SortOption[] = [
    { label: "Title (A-Z)", value: "title", order: "asc" },
    { label: "Title (Z-A)", value: "title", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
       <BouncingLoader  isLoading={isLoading} />
      <Modal
        title="Shloka Delete"
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
          Shlokas
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Shlokas
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={["Title", "Verse", "Status", "Action"]}
          tableData={shlokaData?.data?.map((data: any) => [
            <Link
              to={`${SHLOKA_TABLE_URL + SHLOKA_DETAILS_URL}/${data.id}`}
            >
              <Text as="span" className="font-medium text-text-DEFAULT">
                {data.title || "N/A"}
              </Text>
            </Link>,
            <Text as="span" className="line-clamp-2 max-w-md">
              {data.verse_text || "N/A"}
            </Text>,
            <Text
              as="span"
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              style={getStatusColorScheme(data.status)}
            >
              {data.status}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  `${SHLOKA_TABLE_URL + SHLOKA_EDIT_URL}/${data.id}`
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
                className={commanButtonStyle}
                onPress={() =>
                  navigate(SHLOKA_TABLE_URL + SHLOKA_FORM_URL)
                }
              >
                <Plus size={16} /> Add New Shloka
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={shlokaData?.current_page}
                last_page={shlokaData?.last_page}
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
export default ShlokaPage;
