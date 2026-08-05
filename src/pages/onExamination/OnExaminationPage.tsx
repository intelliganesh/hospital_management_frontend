import { useOnExamination } from "@/actions/calls/onExamination";
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
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import {
  ON_EXAMINATION_EDIT_URL,
  ON_EXAMINATION_FORM_URL,
  ON_EXAMINATION_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const OnExaminationPage = () => {
  const navigate = useNavigate();
  const { onExaminationList, deleteOnExamination, cleanUp } =
    useOnExamination();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onExaminationListData = useSelector(
    (state: any) => state?.onExamination?.onExaminationListData
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      onExaminationList(
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

  const handleDeleteOnExamination = () => {
    if (deleteId) {
      deleteOnExamination(
        deleteId,
        (success: boolean) => {
          if (success) {
            modalCloseHandler();
            onExaminationList(searchParams?.get("currentPage") ?? 1, () => {});
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
  };

  const sortOptions: SortOption[] = [
    { label: "Finding (A-Z)", value: "finding", order: "asc" },
    { label: "Finding (Z-A)", value: "finding", order: "desc" },
    { label: "Normal Range (A-Z)", value: "normal_range", order: "asc" },
    { label: "Normal Range (Z-A)", value: "normal_range", order: "desc" },
    {
      label: "Examination Type (A-Z)",
      value: "examination_type",
      order: "asc",
    },
    {
      label: "Examination Type (Z-A)",
      value: "examination_type",
      order: "desc",
    },
    { label: "department_type (A-Z)", value: "department_type", order: "asc" },
    { label: "department_type (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "is_active", order: "asc" },
    { label: "Status (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="On Examination Delete"
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
            onPress={handleDeleteOnExamination}
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
          On Examination
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all On Examination
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={[
            "Findings",
            "Normal Range",
            "Examination Type",
            "department_type",
            "Status",
            "Action",
          ]}
          tableData={onExaminationListData?.data?.map((data: any) => [
            data.finding || "N/A",
            data.normal_range || "N/A",
            data.examination_type || "N/A",
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
                  `${ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_EDIT_URL}/${
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
                  navigate(ON_EXAMINATION_TABLE_URL + ON_EXAMINATION_FORM_URL)
                }
              >
                <Plus size={16} /> Add New Examination
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={onExaminationListData?.current_page}
                last_page={onExaminationListData?.last_page}
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
export default OnExaminationPage;
