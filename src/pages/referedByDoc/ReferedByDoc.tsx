import { useReferedByDoc } from "@/actions/calls/referedByDoc";
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
import { GenericStatus } from "@/interfaces";
import { handleSortChange } from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  REFERRED_BY_EDIT_FORM_URL,
  REFERRED_BY_FORM_URL,
  REFERRED_BY_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const ReferedByDocPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { referedByDocListHandler, cleanUp, deleteReferedByDoc } =
    useReferedByDoc();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const referedByList = useSelector(
    (state: RootState) => state.referedByDoc.referedByListData
  );

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      referedByDocListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (is_active) => {
          setIsLoading(
            is_active === "pending"
              ? true
              : is_active === "failed"
              ? true
              : is_active === "success" && false
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
      deleteReferedByDoc(
        deleteId,
        (success: boolean) => {
          if (success) {
            modalCloseHandler();
            referedByDocListHandler(
              searchParams?.get("currentPage") ?? 1,
              () => {}
            );
          }
        },
        (is_active) => {
          setIsDeleting(
            is_active === "pending"
              ? true
              : is_active === "failed"
              ? true
              : is_active === "success" && false
          );
        }
      );
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "name", order: "asc" },
    { label: "Name (Z-A)", value: "name", order: "desc" },
    { label: "Status (A-Z)", value: "is_active", order: "asc" },
    { label: "Status (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Referred By Doctor Delete"
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
          <Button
            variant="danger"
            className="flex items-center gap-2"
            onPress={handleDeletePatient}
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
          Referred By Doctor
        </Text>
        <Text as="p" className="text-text-light">
          Manage hospital Referred By Doctor
        </Text>
      </View>

      <Card className="overflow-hidden">
        <DynamicTable
          tableHeaders={["Name", "Status", "Action"]}
          tableData={referedByList?.data?.map((data: any) => [
            data.name,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(
                data?.is_active
                  ? GenericStatus.ACTIVE
                  : GenericStatus.INACTIVE
              )}
            >
              {data?.is_active
                ? GenericStatus.ACTIVE
                : GenericStatus.INACTIVE}
            </Text>,
            <ActionMenu
              onEdit={() =>
                navigate(
                  `${REFERRED_BY_TABLE_URL + REFERRED_BY_EDIT_FORM_URL}/${
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
                onPress={() =>
                  navigate(REFERRED_BY_TABLE_URL + REFERRED_BY_FORM_URL)
                }
              >
                <Plus size={16} /> Add Referred By Doctor
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={referedByList?.current_page}
                last_page={referedByList?.last_page}
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
export default ReferedByDocPage;
