import { useComorbidity } from "@/actions/calls/comorbidities";
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
  COMORBIDITIES_DETAILS_URL,
  COMORBIDITIES_EDIT_URL,
  COMORBIDITIES_FORM_URL,
  COMORBIDITIES_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

const ComorbiditiesPage = () => {
  const navigate = useNavigate();
  const { comorbidityList, comobidityDelete, cleanUp } = useComorbidity();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const comorbidityListData = useSelector(
    (state: any) => state?.comorbidities?.comorbidityList
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      comorbidityList(
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

  const handleDeleteComorbidity = () => {
    if (deleteId) {
      comobidityDelete(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          comorbidityList(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
    );
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Comorbidity Name (A-Z)", value: "name", order: "asc" },
    { label: "Comorbidity Name (Z-A)", value: "name", order: "desc" },
    { label: "Department Type (A-Z)", value: "department_type", order: "asc" },
    { label: "Department Type (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "is_active", order: "asc" },
    { label: "Status (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <>
      <React.Fragment>
        <BouncingLoader isLoading={isLoading} />
        <Modal
          title="Comorbidity Delete"
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
            <Button variant="danger" className="flex items-center gap-2" onPress={handleDeleteComorbidity}>
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
            Comorbidities
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all Comorbidities
          </Text>
        </View>

        <Card className={dynamicTableCardStyle}>
          <DynamicTable
            tableHeaders={[
              "Comorbidity Name",
              "Department Type",
              "Status",
              "Action",
            ]}
            tableData={comorbidityListData?.data?.map((data: any) => [
              <Link
                to={`${COMORBIDITIES_TABLE_URL + COMORBIDITIES_DETAILS_URL}/${
                  data.id
                }`}
              >
                {data.name || "N/A"}
              </Link>,
              data.department_type || "N/A",
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
                    `${COMORBIDITIES_TABLE_URL + COMORBIDITIES_EDIT_URL}/${
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
                    navigate(COMORBIDITIES_TABLE_URL + COMORBIDITIES_FORM_URL)
                  }
                >
                  <Plus size={16} /> Add New Comorbidity
                </Button>
              ),
            }}
            footer={{
              pagination: (
                <PaginationComponent
                  current_page={comorbidityListData?.current_page}
                  last_page={comorbidityListData?.last_page}
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
    </>
  );
};
export default ComorbiditiesPage;
