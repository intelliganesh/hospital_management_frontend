import Button from "@/components/button";
import Modal from "@/components/Modal";
import DataSort, { SortOption } from "@/components/SortData";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import View from "@/components/view";
import {
  APPOINTMENT_DETAILS_URL,
  APPOINTMENT_FORM_URL,
  APPOINTMENT_TABLE_URL,
  DATE_FORMAT,
  TIME_FORMAT,
  // TIME_FORMAT,
} from "@/utils/urls/frontend";
import { Calendar, CheckCircle, Clock, Plus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppointments } from "@/actions/calls/appointments";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import PaginationComponent from "@/components/Pagination";
import ActionMenu from "@/components/editDeleteAction";
import { toast } from "@/utils/custom-hooks/use-toast";
import { Link } from "react-router-dom";
import {
  commanButtonStyle,
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import FollowUpModal from "@/components/FollowUpModal";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import Filter from "../filter";
import Input from "@/components/input";
import {
  appointmentTypeOptions,
  statusOptions,
} from "../forms/appointmentsForm/appointmentFormOptions";
import { useOpd } from "@/actions/calls/opd";
import SingleSelector from "@/components/SingleSelector";
import DateRangePicker from "@/components/DateRangePicker";
import { GenericStatus } from "@/interfaces";
import BouncingLoader from "@/components/BouncingLoader";
import InfoCard from "@/components/ui/infoCard";
import DeleteLoader from "@/components/deleteLoader";
import dayjs from "dayjs";

// import { useOpd } from "@/actions/calls/opd";

export const AppointmentPage = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    appointmentListHandler,
    deleteAppointmentHandler,
    cleanUp,
    editAppointmentHandler,
    appointmentFeesHandler,
    appointmentStatsHandler,
  } = useAppointments();
  // const {PuaListHandler} = useOpd();

  // const patients = useSelector((state: RootState) => state.opd.patientList);
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );

  const doctors = useSelector((state: RootState) => state.opd.userList);
  const doctorsObj = doctors?.map((doctor: any) => ({
    id: doctor.id,
    label: doctor.name,
    value: doctor.id,
  }));
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [followUpModalData, setFollowUpModalData] = useState<{
    id: string;
    number: string;
  } | null>(null);

  const { PuaListHandler } = useOpd();

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      appointmentListHandler(
        filterData ? 1 : searchParams?.get("currentPage") ?? 1,
        () => { },
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        searchParams?.get("from_date") ?? null,
        searchParams?.get("to_date") ?? null,
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
    };
  }, [
    filterData,
    searchParams?.get("from_date"),
    searchParams?.get("to_date"),
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  useEffect(() => {
    appointmentStatsHandler(() => { });
  }, []);

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    {
      label: "Appointment Number (A-Z)",
      value: "appointment_number",
      order: "asc",
    },
    {
      label: "Appointment Number (Z-A)",
      value: "appointment_number",
      order: "desc",
    },
    {
      label: "Patient Name (A-Z)",
      value: "patient_name",
      order: "asc",
    },
    {
      label: "Patient Name (Z-A)",
      value: "patient_name",
      order: "desc",
    },
    {
      label: "Phone Number (A-Z)",
      value: "patient_phone",
      order: "asc",
    },
    {
      label: "Phone Number (Z-A)",
      value: "patient_phone",
      order: "desc",
    },
    { label: "Appointment Type (A-Z)", value: "type", order: "asc" },
    { label: "Appointment Type (Z-A)", value: "type", order: "desc" },
    {
      label: "Appointment Date (A-Z)",
      value: "appointment_date",
      order: "asc",
    },
    {
      label: "Appointment Date (Z-A)",
      value: "appointment_date",
      order: "desc",
    },
    {
      label: "Appointment Time (A-Z)",
      value: "appointment_time",
      order: "asc",
    },
    {
      label: "Appointment Time (Z-A)",
      value: "appointment_time",
      order: "desc",
    },
    {
      label: "Department Type (A-Z)",
      value: "department_type",
      order: "asc",
    },
    {
      label: "Department Type (Z-A)",
      value: "department_type",
      order: "desc",
    },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
  ];

  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  const paginateObj = useSelector(
    (state: RootState) => state.appointment.userCompleteObj
  );

  const statsObj = useSelector(
    (state: RootState) => state.appointment.appointmentStatsData
  );

  return (
    <React.Fragment>
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <Modal
        title="Appointment Delete"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this appointment? This action cannot be undone and will permanently remove the data from the system."
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
                deleteAppointmentHandler(
                  deleteId,
                  (_: boolean) => {
                    // if (success) {
                    appointmentListHandler(
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
      {/* follow up modal */}
      <FollowUpModal
        isOpen={!!followUpModalData}
        onClose={() => setFollowUpModalData(null)}
        appointment_number={followUpModalData?.number ?? ""}
        onSubmit={(amount) => {
          if (followUpModalData) {
            const payload = {
              appointment_number: followUpModalData.number,
              amount,
            };

            appointmentFeesHandler(payload, (success: boolean) => {
              if (success) {
                editAppointmentHandler(
                  followUpModalData.id,
                  { type: "Follow-up" },
                  (success: boolean) => {
                    if (success) {
                      toast({
                        title: "Success!",
                        description: "Appointment updated with follow-up fees.",
                        variant: "success",
                      });
                      appointmentListHandler(
                        searchParams?.get("currentPage") ?? 1,
                        () => null
                      );
                      setFollowUpModalData(null);
                    } else {
                      toast({
                        title: "Error!",
                        description: "Failed to update appointment type.",
                        variant: "destructive",
                      });
                    }
                  }
                );
              } else {
                toast({
                  title: "Error!",
                  description: "Failed to submit fees.",
                  variant: "destructive",
                });
              }
            });
          }
        }}
      />

      <View className="mb-6 flex justify-between items-center">
        <View>
          <Text
            as="h1"
            weight="font-semibold"
            className="text-2xl font-bold text-text-DEFAULT mb-1"
          >
            Appointments
          </Text>
          <Text as="p" className="text-text-light">
            View and manage all Appointments
          </Text>
        </View>
        <View>
          <Text
            as="label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Select Date Range
          </Text>
          <DateRangePicker
            // onDateChange={handleDateChange}
            placeholder="Choose your dates"
          />
        </View>
      </View>

      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total Appointments"
          value={statsObj?.total_appointments || 0}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Calendar size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Today's Appointments"
          value={statsObj?.todays_appointments || 0}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<Clock size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Completed Today"
          value={statsObj?.completed_appointments || 0}
          valueStyle="!text-green-600 dark:!text-green-400 !text-2xl"
          icon={<CheckCircle size={20} />}
          iconStyle="!bg-gradient-to-br !from-green-100 !via-green-200 !to-green-300 dark:!from-green-800/40 dark:!via-green-700/40 dark:!to-green-600/40 !text-green-600 dark:!text-green-400 !shadow-lg !shadow-green-500/25 dark:!shadow-green-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Pending Today"
          value={statsObj?.pending_appointments || 0}
          valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
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
              <Filter
                title="Patient Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="type" placeholder="Type" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="status" placeholder="Status" />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="appointment_time"
                      placeholder="Appointment Time"
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      name="appointment_number"
                      placeholder="Appointment Number "
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Input
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      name="appointment_date"
                      placeholder="Appointment Date"
                    />
                  </View>,
                ]}
              />
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(APPOINTMENT_TABLE_URL + APPOINTMENT_FORM_URL);
                }}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Appointment
              </Button>
            </View>
          </View>
        </View> */}
        {/* Table */}
        <DynamicTable
          tableHeaders={[
            "Appointment Number",
            "Patient Name",
            "Phone",
            "Appointment Type",
            "Consultation Type",
            "Appointment On",
            "Doctor Name",
            // "Appointment Date",
            // "Appointment Time",
            "Department Type",
            "Status",
            "Actions",
          ]}
          tableData={paginateObj?.data.map((appointment: any) => [
            <Link
              to={`${APPOINTMENT_TABLE_URL}${APPOINTMENT_DETAILS_URL}/${appointment.id}`}
              className="font-medium text-text-DEFAULT hover:text-secondary hover:underline"
            >
              {appointment?.appointment_number || "N/A"}
            </Link>,
            appointment?.patient_name || "-",
            appointment?.patient_phone || "-",
            appointment?.type,
            appointment?.consultation_type,
            // <Select
            //   options={appointmentTypeOptions}
            //   value={appointment?.type}
            //   onChange={(e) => {
            //     const selectedType = e.target.value;

            //     if (appointment?.type !== e.target.value) {
            //       if (selectedType === "Follow-up") {
            //         setFollowUpModalData({
            //           id: appointment.id,
            //           number: appointment?.appointment_number,
            //         });
            //       } else {
            //         editAppointmentHandler(
            //           appointment.id,
            //           { type: e.target.value },
            //           (success: boolean) => {
            //             if (success) {
            //               toast({
            //                 title: "Success!",
            //                 description:
            //                   "Appointment type updated successfully.",
            //                 variant: "success",
            //               });
            //               appointmentListHandler(
            //                 searchParams?.get("currentPage") ?? 1,
            //                 () => {
            //                   null;
            //                 }
            //               );
            //             } else {
            //               toast({
            //                 title: "Error!",
            //                 description: "Something went wrong.",
            //                 variant: "destructive",
            //               });
            //             }
            //           }
            //         );
            //       }
            //     }
            //   }}
            // />,
            // appointment?.appointment_date || "N/A",
            // formatTime(appointment?.appointment_time),
            <View>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${appointment.appointment_date} ${appointment.appointment_time}`
                ).format(DATE_FORMAT)}
              </Text>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${appointment.appointment_date} ${appointment.appointment_time}`
                ).format(TIME_FORMAT)}
              </Text>
            </View>,
            appointment?.doctor_name,
            appointment?.consultation_only_department_type?.department_type ||
            "N/A",
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(appointment?.status)}
            >
              {appointment.status || "N/A"}
            </Text>,
            // appointment?.status || "N/A",
            <ActionMenu
              onEdit={
                appointment.status === GenericStatus.COMPLETED
                  ? undefined
                  : () =>
                    navigate(
                      APPOINTMENT_TABLE_URL +
                      APPOINTMENT_FORM_URL +
                      "/" +
                      appointment.id
                    )
              }
              onDelete={
                appointment.status === GenericStatus.COMPLETED
                  ? undefined
                  : () => {
                    setDeleteId(appointment.id);
                  }
              }
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
            filter: (
              <Filter
                apiCall={() => {
                  PuaListHandler(() => { });
                }}
                title="Appointment Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                }}
                inputFields={[
                  // <View className="w-full my-4">
                  //   <Input
                  //     type="text"
                  //     onFocus={(e) => (e.target.type = "date")}
                  //     name="appointment_date"
                  //     placeholder="Appointment Date"
                  //   />
                  // </View>,
                  <View className="w-full my-4">
                    {/* <Input name="type" placeholder="Appointment Type" /> */}
                    <SingleSelector
                      name="type"
                      placeholder="Appointment Type"
                      options={appointmentTypeOptions}
                    />
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      name="status"
                      placeholder="Status"
                      options={statusOptions}
                    />{" "}
                  </View>,
                  <View className="w-full my-4">
                    <SingleSelector
                      name="referred_to"
                      placeholder="referred To"
                      options={doctorsObj}
                    />{" "}
                  </View>,
                  <View className="w-full my-4">
                    <Input name="referred_by_name" placeholder="Reffered By" />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Input
                  //     name="appointment_number"
                  //     placeholder="Appointment Number "
                  //   />
                  // </View>,
                ]}
              />
            ),
            action: (
              <Button
                variant="primary"
                size="small"
                onPress={() => {
                  navigate(APPOINTMENT_TABLE_URL + APPOINTMENT_FORM_URL);
                }}
                className={commanButtonStyle}
              >
                <Plus size={16} />
                Add Appointment
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
