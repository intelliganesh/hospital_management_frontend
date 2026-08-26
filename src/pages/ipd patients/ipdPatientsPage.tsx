import View from "@/components/view";
import { Card } from "@/components/ui/card";
import { Users, UserCheck, UserX } from "lucide-react";
import React, { useEffect, useState } from "react";
import ActionMenu from "@/components/editDeleteAction";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  IPD_PATIENTS_URL,
  IPD_PATIENTS_DETAILS_URL,
  IPD_ENROLLMENT_FORM_EDIT_URL,
} from "@/utils/urls/frontend";
import DynamicTable from "@/components/ui/DynamicTable";
import Text from "@/components/text";
import BouncingLoader from "@/components/BouncingLoader";
import InfoCard from "@/components/ui/infoCard";
import { useDispatch, useSelector } from "react-redux";
import { useIpdPatients } from "@/actions/calls/ipd";
import { RootState } from "@/actions/store";
import { clearIpdPatientListSlice } from "@/actions/slices/ipd/ipdEnrollment";
import dayjs from "dayjs";
import SearchBar from "@/components/ui/search-bar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PaginationComponent from "@/components/Pagination";

const IpdPatientsPage: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const { ipdPatientListHandler, cleanUp } = useIpdPatients();

  const ipdEnrollmedPatients = useSelector(
    (state: RootState) => state.ipd.ipdPatientList,
  );
  const ipdpatientallData = useSelector(
    (state: RootState) => state.ipd.ipdEnrollmentData,
  );

  useEffect(() => {
    if (location.state?.refresh || searchParams.has("currentPage")) {
      ipdPatientListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => {},
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        [],
        (status: string) => {
          setIsLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          );
        },
      );
    }
    return () => {
      cleanUp();
      dispatch(clearIpdPatientListSlice());
    };
  }, [
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  return (
    <React.Fragment>
      <BouncingLoader isLoading={isLoading} />
      <View className="mb-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink to="#">IPD</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>IPD Patients</BreadcrumbPage>
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
              IPD Patients
            </Text>
            <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
              View and manage all IPD patient information
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard
          label="Total IPD Patients"
          //   value={patientStats?.total_patients || 0}
          value="0"
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          icon={<Users size={20} />}
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Active IPD Patients"
          //   value={patientStats?.active_patients || 0}
          value={0}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          icon={<UserCheck size={20} />}
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />

        <InfoCard
          label="Discharged Patients"
          value={0}
          //   value={(paginateObj?.patient?.total || 0) - (paginateObj?.active_patient || 0)}
          valueStyle="!text-orange-600 dark:!text-orange-400"
          icon={<UserX size={20} />}
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
          className="hover:scale-[1.02] transition-transform duration-200"
        />
      </View>

      <Card className="overflow-hidden border-0 shadow-medium bg-white dark:bg-slate-800">
        <DynamicTable
          tableHeaders={[
            { label: "IPD Number", key: "ipd_number" },
            { label: "Admission Date", key: "admission_date" },
            { label: "Patient Name", key: "patient_name" },
            { label: "Phone", key: "phone_number" },
            { label: "Ward", key: "ward_id" },
            { label: "Room/Bed", key: "room_id" },
            { label: "Status", key: "status" },
            "Actions",
          ]}
          tableData={
            ipdEnrollmedPatients.length > 0
              ? ipdEnrollmedPatients?.map((ipdPatient: any) => [
                  ipdPatient?.ipd_number,
                  ipdPatient?.admission_date_time
                    ? dayjs(ipdPatient?.admission_date_time).format(
                        "DD-MM-YYYY hh:mm a",
                      )
                    : "",
                  <View className="flex flex-col">
                    <View className="flex items-center">
                      <View className="h-8 w-8 rounded-full bg-secondary-50 flex items-center justify-center mr-3">
                        <Text
                          as="span"
                          className="text-xs font-medium text-secondary-600"
                        >
                          {ipdPatient?.patient?.first_name[0] ||
                            "" + ipdPatient?.patient?.last_name[0] ||
                            ""}
                        </Text>
                      </View>
                      <View className="flex flex-col">
                        <Text as="span" className="font-medium">
                          {ipdPatient?.patient?.first_name ||
                            "" + " " + ipdPatient?.patient?.last_name ||
                            ""}
                        </Text>
                        <Text
                          as="span"
                          className="text-xs text-muted-foreground"
                        >
                          {ipdPatient?.patient_number}
                        </Text>
                      </View>
                    </View>
                  </View>,
                  ipdPatient?.patient?.phone_no,
                  <View className="flex flex-col">
                    <Text as="span">{ipdPatient?.ward_type || "N/A"}</Text>
                    <Text as="span" className="text-xs text-muted-foreground">
                      {ipdPatient?.ward_number || "N/A"}
                    </Text>
                  </View>,
                  (ipdPatient?.room_number || "N/A") +
                    "/" +
                    (ipdPatient?.bed_number || "N/A"),
                  <Text
                    as="span"
                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
                  >
                    {ipdPatient?.status}
                  </Text>,
                  <ActionMenu
                    onView={() =>
                      navigate(
                        `${IPD_PATIENTS_URL}${IPD_PATIENTS_DETAILS_URL}/${ipdPatient?.id}`,
                      )
                    }
                    onEdit={() =>
                      navigate(
                        `${IPD_ENROLLMENT_FORM_EDIT_URL}/${ipdPatient?.patient?.id}/${ipdPatient?.id}`,
                      )
                    }
                    // onDischarge={() => { }}
                  />,
                ])
              : []
          }
          sortBy={searchParams.get("sort_by") || undefined}
          sortOrder={
            (searchParams.get("sort_order") as "asc" | "desc") || undefined
          }
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
                  setSearchParams({
                    ...Object.fromEntries([...searchParams]),
                    currentPage: "1",
                    search: value,
                  });
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
            //     apiCall={() => {
            //       PuaListHandler(() => {});
            //     }}
            //     title="Appointment Filter"
            //     onResetFilter={() => {
            //       setFilterData(null);
            //     }}
            //     onFilterApiCall={(data) => {
            //       setFilterData({
            //         multiple_filter: data,
            //       });
            //     }}
            //     inputFields={[
            //       // <View className="w-full my-4">
            //       //   <Input
            //       //     type="text"
            //       //     onFocus={(e) => (e.target.type = "date")}
            //       //     name="appointment_date"
            //       //     placeholder="Appointment Date"
            //       //   />
            //       // </View>,
            //       <View className="w-full my-4">
            //         {/* <Input name="type" placeholder="Appointment Type" /> */}
            //         <SingleSelector
            //           name="type"
            //           placeholder="Appointment Type"
            //           options={appointmentTypeOptions}
            //         />
            //       </View>,
            //       <View className="w-full my-4">
            //         <SingleSelector
            //           name="status"
            //           placeholder="Status"
            //           options={statusOptions}
            //         />{" "}
            //       </View>,
            //       <View className="w-full my-4">
            //         <SingleSelector
            //           name="referred_to"
            //           placeholder="referred To"
            //           options={doctorsObj}
            //         />{" "}
            //       </View>,
            //       <View className="w-full my-4">
            //         <Input name="referred_by_name" placeholder="Reffered By" />
            //       </View>,
            //       // <View className="w-full my-4">
            //       //   <Input
            //       //     name="appointment_number"
            //       //     placeholder="Appointment Number "
            //       //   />
            //       // </View>,
            //     ]}
            //   />
            // ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={ipdpatientallData?.current_page}
                last_page={ipdpatientallData?.last_page}
                getPageNumberHandler={(page: number) => {
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: page.toString(),
                    },
                    { replace: true },
                  );
                }}
              />
            ),
          }}
        />
      </Card>
    </React.Fragment>
  );
};

export default IpdPatientsPage;
