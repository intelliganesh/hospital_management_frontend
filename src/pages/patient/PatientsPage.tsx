import View from "@/components/view";
import Modal from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import { RootState } from "@/actions/store";
import { Plus, Users, UserCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import { usePatient } from "@/actions/calls/patient";
import ActionMenu from "@/components/editDeleteAction";
import PaginationComponent from "@/components/Pagination";
import {
  useNavigate,
  Link,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  PATIENT_TABLE_URL,
  PATIENTS_FORM_URL,
  PATIENT_DETAIL_URL,
} from "@/utils/urls/frontend";
import DataSort, { SortOption } from "@/components/SortData";
import DynamicTable from "@/components/ui/DynamicTable";
import { handleSortChange } from "@/utils/helperFunctions";
import Text from "@/components/text";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import Filter from "@/pages/filter/index";
import Input from "@/components/input";
import BouncingLoader from "@/components/BouncingLoader";
import { clearPatientDetailsSlice } from "@/actions/slices/patient";
import InfoCard from "@/components/ui/infoCard";
import DeleteLoader from "@/components/deleteLoader";
import ImageComponent from "@/components/ui/ImageComponent";
const PatientsPage: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    cleanUp,
    patientListHandler,
    deletePatientHandler,
    getPatientStatsHandler,
  } = usePatient();
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const paginateObj = useSelector(
    (state: RootState) => state.patient.userCompleteObj
  );

  const patientStats = useSelector(
    (state: RootState) => state.patient.patientStatsData
  );

  useEffect(() => {
    getPatientStatsHandler(
      () => {},
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
  }, []);

  useEffect(() => {
    if (location.state?.refresh || searchParams.has("currentPage")) {
      patientListHandler(
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
              : status === "success" && false
          );
        }
      );
    }
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

      deletePatientHandler(deleteId, (success: boolean) => {
        setIsDeleting(false); // Stop loading immediately when we get a response
        if (success) {
          patientListHandler(searchParams?.get("currentPage") ?? 1, () => {
            modalCloseHandler();
            getPatientStatsHandler(() => {});
          });
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
    sortOptions[0]
  );

 
  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      {deleteId && (
        <Modal
          title="Patient Delete"
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
              Patients
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              View and manage all patient information
            </Text>
          </View>
          <Button
            variant="primary"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
            onPress={() => navigate(PATIENT_TABLE_URL + PATIENTS_FORM_URL)}
          >
            <Plus size={20} />
            Add New Patient
          </Button>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total Patients"
          value={patientStats?.total_patients || 0}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Active Patients"
          value={patientStats?.active_patients || 0}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<UserCheck size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        {/* <InfoCard
          label="Inactive Patients"
          value={(paginateObj?.patient?.total || 0) - (paginateObj?.active_patient || 0)}
          valueStyle="!text-orange-600 dark:!text-orange-400"
          icon={<UserX size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Patient Activity"
          value={`${Math.round(((paginateObj?.active_patient || 0) / (paginateObj?.patient?.total || 1)) * 100)}%`}
          valueStyle="!text-purple-600 dark:!text-purple-400"
          icon={<Activity size={20} />}
          iconStyle="!bg-gradient-to-br !from-purple-100 !via-purple-200 !to-purple-300 dark:!from-purple-800/40 dark:!via-purple-700/40 dark:!to-purple-600/40 !text-purple-600 dark:!text-purple-400 !shadow-lg !shadow-purple-500/25 dark:!shadow-purple-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        /> */}
      </View>

      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            "Patient ID",
            // "OPD Number",
            "Name",
            "Age",
            "Phone",
            "Email",
            // "Diatary Preference",
            "Status",
            "Actions",
          ]}
          tableData={paginateObj?.patient?.data?.map((patient: any) => [
            patient.patient_number,
            // patient?.opd_number ?? "NA",
            <View className="flex items-center">
              <View className="h-8 w-8 rounded-full bg-secondary-50 flex items-center justify-center mr-3">
                {patient?.image ? (
                  <ImageComponent
                    src={import.meta.env.VITE_APP_URL + patient?.image}
                    alt={patient?.name}
                    className="rounded-full object-cover h-full"
                  />
                ) : (
                  <Text
                    as="span"
                    className="text-xs font-medium text-secondary-600"
                  >
                    {patient.first_name.charAt(0)}
                    {patient?.last_name ? patient?.last_name.charAt(0) : ""}
                  </Text>
                )}
                {/* <Text
                  as="span"
                  className="text-xs font-medium text-secondary-600"
                >
                  {patient.first_name.charAt(0)}
                  {patient.last_name.charAt(0)}
                </Text> */}
              </View>
              <Link
                to={PATIENT_TABLE_URL + PATIENT_DETAIL_URL + "/" + patient.id}
              >
                <Text
                  as="span"
                  className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
                >
                  {patient.first_name +
                    " " +
                    (patient.last_name ? patient.last_name : "")}
                </Text>
              </Link>
            </View>,
            patient.age || "N/A",
            patient.phone_no === "+91" ? "-" : patient.phone_no,
            patient.email ?? "N/A",
            // patient.dietary_preference,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full `}
              style={getStatusColorScheme(patient?.status)}
            >
              {patient.status}
            </Text>,
            <ActionMenu
              onView={() =>
                navigate(
                  PATIENT_TABLE_URL + PATIENT_DETAIL_URL + "/" + patient.id
                )
              }
              onEdit={() =>
                navigate(
                  PATIENT_TABLE_URL + PATIENTS_FORM_URL + "/" + patient.id
                )
              }
              onDelete={() => {
                setDeleteId(patient.id);
              }}
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
                    { replace: true }
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
                    searchParams
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

                  // <View className="w-full my-4">
                  //   <Input name="phone_no" placeholder="Patient Phone" />
                  // </View>,
                ]}
              />
            ),
            // action: (
            //   <Button
            //     variant="primary"
            //     size="small"
            //     className="flex items-center gap-2 "
            //     onPress={() => navigate(PATIENT_TABLE_URL + PATIENTS_FORM_URL)}
            //   >
            //     <Plus size={16} />
            //     Add Patient
            //   </Button>
            // ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={paginateObj?.patient?.current_page}
                last_page={paginateObj?.patient?.last_page}
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

export default PatientsPage;
