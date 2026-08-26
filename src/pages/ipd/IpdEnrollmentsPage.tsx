import View from "@/components/view";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import { Card } from "@/components/ui/card";
import { Plus, Hospital, UserPlus, MoveLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ActionMenu from "@/components/editDeleteAction";
import PaginationComponent from "@/components/Pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  DATE_FORMAT,
  IPD_ENROLLMENT_FORM_URL,
  TIME_FORMAT,
} from "@/utils/urls/frontend";
import DynamicTable from "@/components/ui/DynamicTable";
import Text from "@/components/text";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import SingleSelector from "@/components/SingleSelector";
import { useIpdPatients } from "@/actions/calls/ipd";
import { useDispatch, useSelector } from "react-redux";
import { clearIpdEnrollmentSlice } from "@/actions/slices/ipd/ipdEnrollment";
import { RootState } from "@/actions/store";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import BouncingLoader from "@/components/BouncingLoader";
import IpdEnrollmentForm from "../forms/ipdForm/IpdEnrollmentForm";
import { useOpd } from "@/actions/calls/opd";
import DeleteLoader from "@/components/deleteLoader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const IpdEnrollmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null)

  const [showEnrollmentModel, setShowEnrollmentModel] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { PuaListHandler } = useOpd();

  const { ipdEnrollmentPatientListHandler, deleteIpdPatientEnrollmentHandler, cleanUp } = useIpdPatients();

  const ipdEnrollmentData = useSelector((state: RootState) => state.ipd.ipdEnrollmentData);

  useEffect(() => {
    if (location.state?.refresh || searchParams.has("currentPage")) {
      ipdEnrollmentPatientListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => { },
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
      dispatch(clearIpdEnrollmentSlice());
    };
  }, [
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  useEffect(() => {
    PuaListHandler(() => { });
  }, []);

  const patients = useSelector((state: RootState) => state.opd.patientList)?.map((patient: any) => ({
    // id: patient.id,
    label:
      patient.patient_number +
      "(" +
      patient.first_name +
      " " +
      patient.last_name +
      ")",
    value: patient.id,
  }));

  const modalCloseHandler = () => {
    setDeleteId("");
  };

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      {deleteId && (
        <Modal
          title="Delete IPD Enrollment"
          isOpen={deleteId ? true : false}
          onClose={modalCloseHandler}
          closeOnOutsideClick={false}
          description="Are you sure you want to delete this IPD enrollment? This action cannot be undone."
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
                  deleteIpdPatientEnrollmentHandler(
                    deleteId,
                    (_: boolean) => {
                      // if (success) {
                      ipdEnrollmentPatientListHandler(
                        searchParams?.get("currentPage") ?? 1,
                        () => {
                          modalCloseHandler();
                        }
                      );
                      // }
                    },
                    (status) => {
                      setIsDeleting(
                        status === "pending"
                          ? true
                          : status === "failed"
                            ? false
                            : status === "success" && false
                      );
                    }
                  );
                }
              }}
            >
              Delete <DeleteLoader isDeleting={isDeleting} />
            </Button>
          </View>
        </Modal>
      )}

      {showEnrollmentModel && (
        <Modal
          title={showEnrollmentForm ? "New IPD Patient with Enrollment" : "Enroll IPD Patient"}
          isOpen={showEnrollmentModel}
          onClose={() => {
            setShowEnrollmentModel(false)
            setShowEnrollmentForm(false)
          }}
          closeOnOutsideClick={false}
          size={showEnrollmentForm ? "full" : "lg"}
        >
          {
            !showEnrollmentForm ? (
              <View className="flex flex-col gap-6">
                <View className="flex flex-col gap-2">
                  <SingleSelector
                    name="patient_id"
                    value={selectedPatient}
                    onChange={(value) => setSelectedPatient(value)}
                    label="Select Patient"
                    placeholder="Search Patient"
                    options={patients}
                  />
                  <Button variant="primary" className="px-6 py-3" onPress={() => navigate(IPD_ENROLLMENT_FORM_URL + "/" + selectedPatient)}>
                    Enroll Patient to IPD
                  </Button>
                </View>

                <View className="flex items-center gap-2">
                  <View className="h-[1px] w-full bg-border"></View>
                  <View className="flex items-center">
                    <Text className="text-text-lighter" weight="font-bold">OR</Text>
                  </View>
                  <View className="h-[1px] w-full bg-border"></View>
                </View>

                <View className="flex justify-center gap-2">
                  <Button variant="outline" className="px-6 py-3 flex items-center" onPress={() => setShowEnrollmentForm(true)}>
                    <UserPlus className="mr-2 h-5 w-5" /> Add New IPD Patient
                  </Button>
                </View>

              </View>
            ) : (
              <View>

                <IpdEnrollmentForm formType="addPatientWithEnrollment" />
                <View className="flex justify-center mt-4">
                  <Button variant="ghost" className="px-6 py-3 flex items-center" onPress={() => setShowEnrollmentForm(false)}>
                    <MoveLeft className="mr-2 h-5 w-5 text-primary animate-pulse  " /> Enroll Existing Patient to IPD
                  </Button>
                </View>
              </View>
            )
          }
        </Modal>
      )}

      <View className="mb-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>IPD</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <View className="flex justify-between items-center gap-4">
          <View>
            <Text
              as="h1"
              weight="font-semibold"
              className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
            >
              IPD Enrollments
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              Manage in-patient department enrollments
            </Text>
          </View>
          <Button
            variant="primary"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-200"
            onPress={() => setShowEnrollmentModel(true)}
          >
            <Plus size={20} />
            Enroll IPD Patient
          </Button>
        </View>
      </View>

      {/* Stats Cards */}
      {/* <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total IPD Patients"
          value={mockStats.total_patients || 0}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Active Admissions"
          value={mockStats.active_patients || 0}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<UserCheck size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View> */}

      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            { label: "Appt No", key: "appointment_number" },
            { label: "Patient", key: "patient_name" },
            { label: "Doctor", key: "doctor_name" },
            { label: "Department", key: "department_type" },
            { label: "Appointment On", key: "appointment_date" },
            { label: "Status", key: "status" },
            { label: "Created At", key: "created_at" },
            "Actions",
          ]}
          tableData={ipdEnrollmentData?.data?.map((patient: any) => [
            <Link to={`/appointment-list/appointment-details/${patient.appointment_id}`} className="font-medium">{patient.appointment_number}</Link>,
            <View className="flex items-center">
              <View className="h-8 w-8 rounded-full bg-secondary-50 flex items-center justify-center mr-3">
                <Text
                  as="span"
                  className="text-xs font-medium text-secondary-600"
                >
                  {patient.patient_name?.charAt(0)}
                </Text>
              </View>
              <View>
                <Text
                  as="span"
                  className="font-medium text-text-DEFAULT block"
                >
                  {patient.patient_name}
                </Text>
                <Text
                  as="span"
                  className="text-xs text-slate-500"
                >
                  {patient.patient_number}
                </Text>
              </View>
            </View>,
            <View className="flex items-center">
              <View className="h-8 w-8 rounded-full bg-secondary-50 flex items-center justify-center mr-3">
                <Text
                  as="span"
                  className="text-xs font-medium text-secondary-600"
                >
                  {patient.doctor_name?.charAt(0)}
                </Text>
              </View>
              <View>
                <Text
                  as="span"
                  className="font-medium text-text-DEFAULT block"
                >
                  {patient.doctor_name}
                </Text>
                {/* <Text
                  as="span"
                  className="text-xs text-slate-500"
                >
                  {patient.doctor_id}
                </Text> */}
              </View>
            </View>,
            patient.type || "N/A",
            <View>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${patient.appointment_date} ${patient.appointment_time}`
                ).format(DATE_FORMAT)}
              </Text>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${patient.appointment_date} ${patient.appointment_time}`
                ).format(TIME_FORMAT)}
              </Text>
            </View>,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full `}
              style={getStatusColorScheme(patient?.status)}
            >
              {patient.status}
            </Text>,
            <View>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${patient.created_at}`
                ).format(DATE_FORMAT)}
              </Text>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${patient.created_at}`
                ).format(TIME_FORMAT)}
              </Text>
            </View>,

            <View className="flex items-center gap-1">

              <Button
                variant="ghost"
                onPress={() =>
                  navigate(`${IPD_ENROLLMENT_FORM_URL}/${patient?.patient_id}/${patient?.id}`)
                }
                className="flex items-center w-auto px-2 py-2 text-sm text-primary-700 hover:bg-primary-100"
                title="Enroll Patient to IPD"
              >
                <Hospital size={18} className="text-primary animate-pulse" />
              </Button>
              <ActionMenu
                editTitle="Edit Patient"
                // onView={() =>
                //   navigate(`${IPD_ENROLLMENT_DETAILS_URL}/${patient.id}`)
                // }
                deleteTitle="Delete Patient Enrollment"
                onDelete={() => {
                  setDeleteId(patient.id);
                }}
              />
            </View>,
          ]) || []}
          sortBy={searchParams.get("sort_by") || undefined}
          sortOrder={searchParams.get("sort_order") as "asc" | "desc" || undefined}
          onSort={(key, order) => {
            setSearchParams({
              ...Object.fromEntries([...searchParams]),
              sort_by: key,
              sort_order: order,
            });
          }}
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
            // sort: (
            //   <DataSort
            //     sortOptions={sortOptions}
            //     onSort={(option) =>
            //       handleSortChange(
            //         option,
            //         setActiveSort,
            //         setSearchParams,
            //         searchParams
            //       )
            //     }
            //     activeSort={activeSort ?? undefined}
            //   />
            // ),
            // filter: (
            //   <Filter
            //     onResetFilter={() => {}}
            //     title="IPD Enrollment Filter"
            //     onFilterApiCall={(data) => {
            //       console.log("Filter data:", data);
            //     }}
            //     inputFields={[
            //       <View className="w-full my-4">
            //         <Input name="patient_name" placeholder="Patient Name" />
            //       </View>,
            //       <View className="w-full my-4">
            //         <Input name="doctor_name" placeholder="Doctor Name" />
            //       </View>,
            //     ]}
            //   />
            // ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={ipdEnrollmentData?.current_page || 1}
                last_page={ipdEnrollmentData?.last_page || 1}
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

export default IpdEnrollmentsPage;
