import Button from "@/components/button";
import Modal from "@/components/Modal";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import {
  MEDICINE_FORM_URL,
  MEDICINE_TABLE_URL,
  MEDICINE_DETAILS_URL,
  // DATE_FORMAT,
} from "@/utils/urls/frontend";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import PaginationComponent from "@/components/Pagination";
import ActionMenu from "@/components/editDeleteAction";
import { Link } from "react-router-dom";
import { commanButtonStyle, dynamicTableCardStyle, handleSortChange } from "@/utils/helperFunctions";
import { useMedicine } from "@/actions/calls/medicine";
// import dayjs from "dayjs";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import DeleteLoader from "@/components/deleteLoader";

export const MedicinesPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const { medicineListHandler, deleteMedicineHandler, cleanUp } = useMedicine();
  const [isLoading, setIsLoading] = useState(false);
  

  // const currentSymbol = useSelector(
  //   (state: RootState) => state.systemSettings.settings.currency_symbol
  // );

  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      medicineListHandler(
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
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    { label: "Medicine Name (A-Z)", value: "medicine_name", order: "asc" },
    { label: "Medicine Name (Z-A)", value: "medicine_name", order: "desc" },
    {
      label: "Generic Name (A-Z)",
      value: "generic_name",
      order: "asc",
    },
    {
      label: "Generic Name (Z-A)",
      value: "generic_name",
      order: "desc",
    },
    {
      label: "Manufacturer (A-Z)",
      value: "manufacturer",
      order: "asc",
    },
    {
      label: "Manufacturer (Z-A)",
      value: "manufacturer",
      order: "desc",
    },



    // {
    //   label: "Dosage (A-Z)",
    //   value: "dosage_form",
    //   order: "asc",
    // },
    // {
    //   label: "Dosage (Z-A)",
    //   value: "dosage_form",
    //   order: "desc",
    // },
    // { label: "Srength (A-Z)", value: "strength", order: "asc" },
    // { label: "Srength (Z-A)", value: "strength", order: "desc" },
    // { label: "Stength Unit (A-Z)", value: "strength_unit", order: "asc" },
    // { label: "Stength Unit (Z-A)", value: "strength_unit", order: "desc" },
    // { label: "Department (A-Z)", value: "department_type", order: "asc" },
    // { label: "Department (Z-A)", value: "department_type", order: "desc" },
    { label: "Status (A-Z)", value: "is_active", order: "asc" },
    { label: "Status (Z-A)", value: "is_active", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  // const paginateObj = useSelector(
  //   (state: RootState) => state.examinations.userCompleteObj
  // );
  const paginateObj = useSelector(
    (state: RootState) => state.medicines.medicineListData
  );

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <Modal
        title="Medicine Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this Data? This action cannot be undone and will permanently remove the data from the system."
      >
        <View className="flex justify-end gap-2">
          <Button variant="outline" onPress={modalCloseHandler}>
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex items-center gap-2"
            onPress={() => {
              if (deleteId) {
                deleteMedicineHandler(deleteId, (_: boolean) => {
                  // if (success) {
                  medicineListHandler(
                    searchParams?.get("currentPage") ?? 1,
                    () => {
                      modalCloseHandler();
                    }
                  );
                  // }
                },
                (status) => {
                  setIsDeleting(status === "pending" ? true : false);
                }
              );
              }
            }}
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
          Medicines
        </Text>
        <Text as="p" className="text-text-light">
          View and manage all Medicines
        </Text>
      </View>

      <Card className={dynamicTableCardStyle}>
        {/* <View className="p-4 border-b border-neutral-200 bg-card flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center  dark:border-none">
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
                  navigate(MEDICINE_TABLE_URL + MEDICINE_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Medicine
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Medicine Name",
            "Generic Name",
            "Manufacturer",
            // "Dosage",
            // "Department",
            // "Stength",
            // "Stength Unit",
            "Status",
            "Actions",
          ]}
          tableData={paginateObj?.data?.map((medicine: any) => [
            <Link
              to={`${MEDICINE_TABLE_URL}${MEDICINE_DETAILS_URL}/${medicine.id}`}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {medicine?.medicine_name || "N/A"}
            </Link>,
            medicine?.manufacturer || "N/A",
            medicine?.generic_name || "N/A",
            // medicine?.dosage_form || "N/A",
            // medicine?.department_type || "N/A",
            // medicine?.strength || "N/A",
            // medicine?.strength_unit || "N/A",
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(
                medicine?.is_active
                  ? GenericStatus.ACTIVE
                  : GenericStatus.INACTIVE
              )}
            >
              {medicine?.is_active
                ? GenericStatus.ACTIVE
                : GenericStatus.INACTIVE}
            </Text>,

            <ActionMenu
              onEdit={() =>
                navigate(
                  MEDICINE_TABLE_URL + MEDICINE_FORM_URL + "/" + medicine.id
                )
              }
              onDelete={() => {
                setDeleteId(medicine.id);
              }}
            />,
          ])}
          header={{
            search: (
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
                onPress={() => {
                  navigate(MEDICINE_TABLE_URL + MEDICINE_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add Medicine
              </Button>
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={paginateObj?.current_page}
                last_page={paginateObj?.last_page}
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
            setSearchParams({
              ...Object.fromEntries([...searchParams]),
              currentPage: `${page}`,
            });
          }}
          last_page={paginateObj?.last_page}
          current_page={paginateObj?.current_page}
        /> */}
      </Card>
    </React.Fragment>
  );
};
