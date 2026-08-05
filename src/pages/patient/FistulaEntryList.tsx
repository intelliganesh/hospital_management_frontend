import View from "@/components/view";
import Modal from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import { RootState } from "@/actions/store";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ActionMenu from "@/components/editDeleteAction";
import PaginationComponent from "@/components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FISTULA_ENTRY_LIST_URL,
  FISTULA_ENTRY_FORM_URL,
} from "@/utils/urls/frontend";
import DataSort, { SortOption } from "@/components/SortData";
import DynamicTable from "@/components/ui/DynamicTable";
import { handleSortChange } from "@/utils/helperFunctions";
import Text from "@/components/text";
import Filter from "@/pages/filter/index";
import Input from "@/components/input";
import BouncingLoader from "@/components/BouncingLoader";
import { clearPatientDetailsSlice } from "@/actions/slices/patient";
import DeleteLoader from "@/components/deleteLoader";
import { useFistula } from "@/actions/calls/fistula";
import dayjs from "dayjs";
const FistulaEntryList: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { cleanUp, patientFistulaListHandler, deletePatientFistulaHandler } =
    useFistula();
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null,
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const patientFistulaList = useSelector(
    (state: RootState) => state.fistula.patientFistulaListData,
  );

  useEffect(() => {
    // if (location.state?.refresh || searchParams.has("currentPage")) {
    patientFistulaListHandler(
      searchParams?.get("currentPage") ?? 1,
      () => {},
      searchParams.get("search") ?? null,
      searchParams.get("sort_by") ?? null,
      searchParams.get("sort_order") ?? null,
      filterData,
      (status) => {
        setIsLoading(
          status === "pending"
            ? true
            : status === "failed"
              ? true
              : status === "success" && false,
        );
      },
    );
    // }
    return () => {
      cleanUp();
      dispatch(clearPatientDetailsSlice());
    };
  }, [
    filterData,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const modalCloseHandler = () => {
    setDeleteId(null);
    setIsDeleting(false);
  };

  const handleDeletePatient = () => {
    if (deleteId) {
      setIsDeleting(true); // Set loading immediately when delete starts

      deletePatientFistulaHandler(deleteId, (success: boolean) => {
        setIsDeleting(false); // Stop loading immediately when we get a response
        if (success) {
          patientFistulaListHandler(
            searchParams?.get("currentPage") ?? 1,
            () => {
              modalCloseHandler();
            },
          );
        }
      });
      setIsDeleting(false);
      modalCloseHandler();
    }
  };

  const sortOptions: SortOption[] = [
    { label: "Name (A-Z)", value: "first_name", order: "asc" },
    { label: "Name (Z-A)", value: "first_name", order: "desc" },
    { label: "PatientID (A-Z)", value: "patient_number", order: "asc" },
    { label: "PatientID (Z-A)", value: "patient_number", order: "desc" },
    { label: "Age (A-Z)", value: "age", order: "asc" },
    { label: "Age (Z-A)", value: "age", order: "desc" },
    { label: "Phone (A-Z)", value: "phone_no", order: "asc" },
    { label: "Phone (Z-A)", value: "phone_no", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(
    sortOptions[0],
  );

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      {deleteId && (
        <Modal
          title="Confirm Delete"
          isOpen={deleteId ? true : false}
          onClose={modalCloseHandler}
          description="Are you sure you want to delete this Patient? This action cannot be undone and will permanently remove the patient's data from the system."
        >
          <View className="flex justify-end gap-2">
            <Button variant="outline" onPress={modalCloseHandler}>
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
      )}
      <View className="mb-8">
        <View className="flex justify-between items-center gap-4">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
            >
              Fistula List
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              View and manage all fistula patient information
            </Text>
          </View>
          <Button
            variant="primary"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
            onPress={() =>
              navigate(FISTULA_ENTRY_LIST_URL + FISTULA_ENTRY_FORM_URL)
            }
          >
            <Plus size={20} />
            Add New Fistula
          </Button>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* <InfoCard
          label="Total Patients"
          value={patientStats?.total_patients || 0}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        /> */}
      </View>

      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            "Fistula ID",
            "Patient",
            "No. of Fistula",
            "Recurrence",
            "Surgeries",
            "Sonologist",
            "Entry Date",
            "Actions",
          ]}
          tableData={patientFistulaList?.data?.map((data: any) => [
            data.id,
            data.patient_name,
            data.no_of_fistula,
            data.fistula_recurrence === "yes" ? "Recurrence" : "New",
            data.fistula_recurrence_surgery_count ?? "-",
            data.sonologist ?? "-",
            dayjs(data.created_at).format("DD MMM YYYY"),
            <ActionMenu
              onEdit={() =>
                navigate(
                  FISTULA_ENTRY_LIST_URL +
                    FISTULA_ENTRY_FORM_URL +
                    "/" +
                    data.id,
                )
              }
              onDelete={() => setDeleteId(data.id)}
            />,
          ])}
          header={{
            search: (
              <SearchBar
                onSearch={(value: string) => {
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: "1",
                      search: value,
                    },
                    { replace: true },
                  );
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
                    searchParams,
                  )
                }
                activeSort={activeSort ?? undefined}
              />
            ),
            filter: (
              <Filter
                onResetFilter={() => {
                  setFilterData(null);
                }}
                title="Patient Filter"
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="first_name" placeholder="Patient First Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="last_name" placeholder="Patient Last Name" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="gender" placeholder="Gender" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="age" placeholder="Age" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="country" placeholder="Country" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="created_at"
                      type="date"
                      placeholder="Created Date"
                    />
                  </View>,
                ]}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={patientFistulaList?.patient?.current_page}
                last_page={patientFistulaList?.patient?.last_page}
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

export default FistulaEntryList;
