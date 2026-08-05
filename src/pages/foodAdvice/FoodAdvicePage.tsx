import { useFoodAdvice } from "@/actions/calls/foodAdvice";
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
  FOOD_ADVICE_EDIT_URL,
  FOOD_ADVICE_FORM_URL,
  FOOD_ADVICE_TABLE_URL,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const FoodAdvicePage = () => {
  const navigate = useNavigate();
  const { foodAdviceList, deleteFoodAdvice, cleanUp } = useFoodAdvice();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const foodAdviceListData = useSelector(
    (state: any) => state?.foodAdvice?.foodAdviceList
  );
  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      foodAdviceList(
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
      deleteFoodAdvice(deleteId, (success: boolean) => {
        if (success) {
          modalCloseHandler();
          foodAdviceList(searchParams?.get("currentPage") ?? 1, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending" ? true : status === "failed" ? true : status === "success" && false);
      }
    );
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Food Advice (A-Z)", value: "advice_text", order: "asc" },
    { label: "Food Advice (Z-A)", value: "advice_text", order: "desc" },
    { label: "Timings (A-Z)", value: "meal_times", order: "asc" },
    { label: "Timings (Z-A)", value: "meal_times", order: "desc" },
    { label: "Department Type (A-Z)", value: "department_type", order: "asc" },
    { label: "Department Type (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <>
      <React.Fragment>
        <BouncingLoader isLoading={isLoading} />
        <Modal
          title="Food Advice Delete"
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
            Food Advice
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all Food Advice
          </Text>
        </View>

        <Card className={dynamicTableCardStyle}>
          <DynamicTable
            tableHeaders={[
              "Food Advice",
              "Timings",
              "Department Type",
              "Status",
              "Action",
            ]}
            tableData={foodAdviceListData?.data?.map((data: any) => [
              data?.advice_text || "N/A",
              data?.meal_times || "N/A",
              data?.department_type || "N/A",
              <Text
                as="span"
                className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                style={getStatusColorScheme(data.status)}
              >
                {data.status || "N/A"}
              </Text>,
              <ActionMenu
                onEdit={() =>
                  navigate(
                    `${FOOD_ADVICE_TABLE_URL + FOOD_ADVICE_EDIT_URL}/${data.id}`
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
                    navigate(FOOD_ADVICE_TABLE_URL + FOOD_ADVICE_FORM_URL)
                  }
                >
                  <Plus size={16} /> Add New Food Advice
                </Button>
              ),
            }}
            footer={{
              pagination: (
                <PaginationComponent
                  current_page={foodAdviceListData?.current_page}
                  last_page={foodAdviceListData?.last_page}
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
export default FoodAdvicePage;
