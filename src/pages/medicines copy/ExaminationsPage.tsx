import Button from "@/components/button";
import Modal from "@/components/Modal";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import {
  EXAMINATION_DETAILS_URL,
  EXAMINATION_FORM_URL,
  EXAMINATION_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import PaginationComponent from "@/components/Pagination";
import ActionMenu from "@/components/editDeleteAction";
import { Link } from "react-router-dom";
import { handleSortChange } from "@/utils/helperFunctions";
import { useExaminations } from "@/actions/calls/examination";

export const ExaminationsPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const { examinationListHandler, deleteExaminationHandler, cleanUp } =
    useExaminations();

  const [deleteId, setDeleteId] = useState<null | string>(null);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      examinationListHandler(
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
    { label: "Patient Number (A-Z)", value: "patient_number", order: "asc" },
    { label: "Patient Number (Z-A)", value: "patient_number", order: "desc" },
    {
      label: "Temperature (Ascending)",
      value: "temperature",
      order: "asc",
    },
    {
      label: "Temperature (Descending)",
      value: "temperature",
      order: "desc",
    },

    {
      label: "BP (Ascending)",
      value: "bp",
      order: "asc",
    },
    {
      label: "BP (Descending)",
      value: "bp",
      order: "desc",
    },
    {
      label: "Pulse (Ascending)",
      value: "pulse",
      order: "asc",
    },
    {
      label: "Pulse (Descending)",
      value: "pulse",
      order: "desc",
    },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  const paginateObj = useSelector(
    (state: RootState) => state.examinations.userCompleteObj
  );


  return (
    <React.Fragment>
      <Modal
        title="Examination Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this Examination? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={modalCloseHandler}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onPress={() => {
              if (deleteId) {
                deleteExaminationHandler(deleteId, (_: boolean) => {
                  // if (success) {
                  examinationListHandler(
                    searchParams?.get("currentPage") ?? 1,
                    () => {
                      modalCloseHandler();
                    }
                  );
                  // }
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
          Examinations
        </Text>
        <Text as="p" className="text-text-light">
          Manage hospital Examinations
        </Text>
      </View>

      <Card className="overflow-hidden">
        <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:boder-border">
          <View className="flex gap-2 w-full  justify-between items-center ">
            <SearchBar
              onSearch={(value: string) => {
                setSearchParams({
                  ...Object.fromEntries([...searchParams]),
                  currentPage: "1",
                  search: value,
                });
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
                  navigate(EXAMINATION_TABLE_URL + EXAMINATION_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Examination
              </Button>
            </View>
          </View>
        </View>
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Patient Number",
            "Temperature",
            "BP",
            "Pulse",
            "Actions",
          ]}
          tableData={paginateObj?.data.map((examination: any) => [
            <Link
              to={`${EXAMINATION_TABLE_URL}${EXAMINATION_DETAILS_URL}/${examination.id}`}
            >
              {examination?.patient_number || "N/A"}
            </Link>,
            examination?.temperature || "N/A",
            examination?.bp || "N/A",
            examination?.pulse || "N/A",
            <ActionMenu
              onEdit={() =>
                navigate(
                  EXAMINATION_TABLE_URL +
                    EXAMINATION_FORM_URL +
                    "/" +
                    examination.id
                )
              }
              onDelete={() => {
                setDeleteId(examination.id);
              }}
            />,
          ])}
        />
        <PaginationComponent
          getPageNumberHandler={(page) => {
            setSearchParams({
              ...Object.fromEntries([...searchParams]),
              currentPage: `${page}`,
            });
          }}
          last_page={paginateObj?.last_page}
          current_page={paginateObj?.current_page}
        />
      </Card>
    </React.Fragment>
  );
};
