import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
// import { Card } from "@/components/ui/card";
import {
  UserPlus,
  CalendarCheck,
  Bed,
  Stethoscope,
  Users,
  // ArrowUp,
  // ArrowDown,
  // TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
// import { logoutSlice } from "@/actions/slices/auth";

import { useDashboard } from "@/actions/calls/dashboard";
import View from "@/components/view";
import Text from "@/components/text";
import InfoCard from "@/components/ui/infoCard";
import { Card } from "@/components/ui/card";
import DynamicTable from "@/components/ui/DynamicTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaginationComponent from "@/components/Pagination";
import Input from "@/components/input";
import Select from "@/components/Select";
import DataSort, { SortOption } from "@/components/SortData";
import { handleSortChange } from "@/utils/helperFunctions";
import Filter from "../filter";
import SearchBar from "@/components/ui/search-bar";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import dayjs from "dayjs";
import {
  APPOINTMENT_TABLE_URL,
  CONSULTATION_DETAILS_URL,
  CONSULTATION_TABLE_URL,
  DATE_FORMAT,
  PATIENT_TABLE_URL,
  TIME_FORMAT,
  USER_TABLE_URL,
} from "@/utils/urls/frontend";
import { Link } from "react-router-dom";
import BouncingLoader from "@/components/BouncingLoader";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// Greeting Card Component
const GreetingCard = ({ userName }: { userName: string }) => {
  const greeting = getGreeting();

  return (
    <View className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden h-full">
      {/* Background Pattern */}
      <View className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern
              id="grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </View>

      {/* Medical Icon Illustration */}
      <View className="absolute right-4 top-4 opacity-15">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 10.5V19L13.5 17.5V14.5C13.5 13.1 12.4 12 11 12S8.5 13.1 8.5 14.5V17.5L7 19V10.5L15 10.5ZM7 10V9L1 7V9L7 10Z" />
        </svg>
      </View>

      {/* Stethoscope Icon */}
      <View className="absolute right-2 bottom-4 opacity-10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 8C20.1 8 21 8.9 21 10S20.1 12 19 12 17 11.1 17 10 17.9 8 19 8M19 6C16.8 6 15 7.8 15 10S16.8 14 19 14 23 12.2 23 10 21.2 6 19 6M11 10C11 8.3 9.7 7 8 7S5 8.3 5 10V11C5 12.7 6.3 14 8 14S11 12.7 11 11V10M8 5C10.8 5 13 7.2 13 10V11C13 13.8 10.8 16 8 16S3 13.8 3 11V10C3 7.2 5.2 5 8 5M8 18C8.6 18 9 18.4 9 19S8.6 20 8 20 7 19.6 7 19 7.4 18 8 18Z" />
        </svg>
      </View>

      {/* Content */}
      <View className="relative z-10 h-full flex flex-col justify-center">
        <Text as="p" className="text-white/90 text-sm font-medium mb-1">
          {greeting},
        </Text>
        <Text
          as="h2"
          className="text-white text-lg font-bold mb-2 leading-tight"
        >
          {userName}
        </Text>
        <Text as="p" className="text-white/80 text-xs">
          Welcome back to your dashboard
        </Text>

        {/* Small decorative line */}
        <View className="w-12 h-0.5 bg-white/30 mt-3 rounded-full"></View>
      </View>

      {/* Decorative Elements */}
      <View className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mb-8"></View>
      <View className="absolute top-0 left-0 w-8 h-8 bg-white/5 rounded-full -ml-4 -mt-4"></View>
      <View className="absolute top-1/2 right-0 w-4 h-4 bg-white/10 rounded-full -mr-2"></View>
    </View>
  );
};

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getDashboardDataHandler, cleanUp } = useDashboard();
  const [filterData, setFilterData] = useState<null | Record<string, string>>(
    null
  );

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  // console.log(checkLoadinStatus.isLoading, "isLoading");

  // const consultationListData = useSelector(
  //   (state: any) => state.consultation.consultationListData
  // );
  const dashboardData = useSelector(
    (state: any) => state?.dashboard?.dashboardData
  );

  // Get logged in user details
  const loginUserDetail = useSelector(
    (state: any) => state?.authentication?.loginUserDetail
  );

  // Parse user details if it's a string
  const userDetails =
    typeof loginUserDetail === "string"
      ? JSON.parse(loginUserDetail)
      : loginUserDetail;

  const userName = userDetails?.name || userDetails?.first_name || "User";

  // useEffect(() => {
  //   getDashboardDataHandler(() => {});
  // }, []);

  useEffect(() => {
    getDashboardDataHandler(
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
    return () => {
      cleanUp();
    };
  }, [
    filterData,
    searchParams?.get("currentPage"),
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
  ]);

  const sortOptions: SortOption[] = [
    { label: "Patient ID (A-Z)", value: "patient_id", order: "asc" },
    { label: "Patient ID (Z-A)", value: "patient_id", order: "desc" },
    { label: "Patient Name (A-Z)", value: "patient_name", order: "asc" },
    { label: "Patient Name (Z-A)", value: "patient_name", order: "desc" },
    { label: "Next Visit Date (A-Z)", value: "next_visit_date", order: "asc" },
    { label: "Next Visit Date (Z-A)", value: "next_visit_date", order: "desc" },
    { label: "Status (A-Z)", value: "status", order: "asc" },
    { label: "Status (Z-A)", value: "status", order: "desc" },
    { label: "Payment Status (A-Z)", value: "payment_status", order: "asc" },
    { label: "Payment Status (Z-A)", value: "payment_status", order: "desc" },
  ];
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  return (
    <DashboardLayout>
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <View className="mb-6">
        <Text
          as="h1"
          weight="font-semibold"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
        >
          Dashboard
        </Text>
        <Text as="p" className="text-slate-600 dark:text-slate-400 text-sm">
          Welcome back to {import.meta.env.VITE_HOSPITAL_NAME} Hospital
          Management System
        </Text>
      </View>

      {/* Greeting Card and Stats Grid */}
      <View className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        {/* Greeting Card - Takes full width on mobile, spans 1 column on large screens */}
        <View className="lg:col-span-1">
          <GreetingCard userName={userName} />
        </View>

        {/* Stats Cards - 3 cards per row on large screens */}
        <View className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            label="Total Patients"
            value={dashboardData?.totalPatients ?? "N/A"}
            valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
            icon={<UserPlus size={20} />}
            iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            onClick={() => navigate(PATIENT_TABLE_URL + "?currentPage=1")}
          />

          <InfoCard
            label="Total Appointments"
            value={dashboardData?.totalAppointments ?? "N/A"}
            valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
            icon={<CalendarCheck size={20} />}
            iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            onClick={() => navigate(APPOINTMENT_TABLE_URL + "?currentPage=1")}
          />

          <InfoCard
            label="Total OPD Cases"
            value={dashboardData?.totalOPD ?? "N/A"}
            valueStyle="!text-purple-600 dark:!text-purple-400 !text-2xl"
            icon={<Stethoscope size={20} />}
            iconStyle="!bg-gradient-to-br !from-purple-100 !via-purple-200 !to-purple-300 dark:!from-purple-800/40 dark:!via-purple-700/40 dark:!to-purple-600/40 !text-purple-600 dark:!text-purple-400 !shadow-lg !shadow-purple-500/25 dark:!shadow-purple-400/20"
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            onClick={() => navigate(CONSULTATION_TABLE_URL + "?currentPage=1")}
          />

          <InfoCard
            label="Total IPD Cases"
            value={dashboardData?.totalIPD ?? "N/A"}
            valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
            icon={<Bed size={20} />}
            iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
            className="hover:scale-[1.02] transition-transform duration-200"
          />

          <InfoCard
            label="Beds Occupied"
            value={dashboardData?.noOfBedsOccupied ?? "N/A"}
            valueStyle="!text-red-600 dark:!text-red-400 !text-2xl"
            icon={<Bed size={20} />}
            iconStyle="!bg-gradient-to-br !from-red-100 !via-red-200 !to-red-300 dark:!from-red-800/40 dark:!via-red-700/40 dark:!to-red-600/40 !text-red-600 dark:!text-red-400 !shadow-lg !shadow-red-500/25 dark:!shadow-red-400/20"
            className="hover:scale-[1.02] transition-transform duration-200"
          />

          <InfoCard
            label="Total Users"
            value={dashboardData?.totalUsers ?? "N/A"}
            valueStyle="!text-indigo-600 dark:!text-indigo-400 !text-2xl"
            icon={<Users size={20} />}
            iconStyle="!bg-gradient-to-br !from-indigo-100 !via-indigo-200 !to-indigo-300 dark:!from-indigo-800/40 dark:!via-indigo-700/40 dark:!to-indigo-600/40 !text-indigo-600 dark:!text-indigo-400 !shadow-lg !shadow-indigo-500/25 dark:!shadow-indigo-400/20"
            className="hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            onClick={() => navigate(USER_TABLE_URL + "?currentPage=1")}
          />
        </View>
      </View>
      <View className="mb-6">
        <Text
          as="h2"
          weight="font-semibold"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
        >
          Upcoming Consultations
        </Text>
        <Text as="p" className="text-slate-600 dark:text-slate-400">
          Recent consultation appointments and their status
        </Text>
      </View>
      <Card className="w-full mb-8 overflow-hidden border-0 shadow-medium">
        <DynamicTable
          tableHeaders={[
            "Patient Number",
            "Patient Name",
            "Appointment On",
            "Status",
            "Payment Status",
            // "Actions",
          ]}
          tableData={dashboardData?.consultation?.data?.map((data: any) => [
            <Link
              to={
                CONSULTATION_TABLE_URL +
                CONSULTATION_DETAILS_URL +
                "/" +
                data.id
              }
              className="font-medium text-text-DEFAULT hover:text-primary hover:underline"
            >
              {data?.patient_number}
            </Link>,
            data?.patient_name,
            <View>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${data?.appointment_date} ${data?.appointment_time}`
                ).format(DATE_FORMAT)}
              </Text>
              <Text className="text-sm font-normal">
                {dayjs(
                  `${data?.appointment_date} ${data?.appointment_time}`
                ).format(TIME_FORMAT)}
              </Text>
            </View>,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.status)}
            >
              {data?.status || "N/A"}
            </Text>,
            <Text
              as="span"
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full`}
              style={getStatusColorScheme(data?.payment_status)}
            >
              {data?.payment_status || "N/A"}
            </Text>,
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
                title="Consultation Filter"
                onResetFilter={() => {
                  setFilterData(null);
                }}
                onFilterApiCall={(data) => {
                  setFilterData({
                    multiple_filter: data,
                  });
                  setSearchParams(
                    {
                      ...Object.fromEntries([...searchParams]),
                      currentPage: "1",
                    },
                    { replace: true }
                  );
                }}
                inputFields={[
                  <View className="w-full my-4">
                    <Input name="patient_number" placeholder="Patient Number" />
                  </View>,
                  <View className="w-full my-4">
                    <Input name="patient_name" placeholder="Patient Name" />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Input name="referred_by_name" placeholder="Referred By" />
                  // </View>,
                  // <View className="w-full my-4">
                  //   <Input
                  //     name="appointment_number"
                  //     placeholder="Appointment Number"
                  //   />
                  // </View>,
                  // <View className="w-full my-4">
                  //   <Input name="doctor_name" placeholder="Doctor Name" />
                  // </View>,
                  <View className="w-full my-4">
                    <Select
                      name="status"
                      placeholder="Select Status"
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Completed", value: "Completed" },
                      ]}
                      // error={errorsPaymentStatus}
                    />
                  </View>,
                  <View className="w-full my-4">
                    <Select
                      name="payment_status"
                      placeholder="Select Payment Status"
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Completed", value: "Completed" },
                      ]}
                      // error={errorsPaymentStatus}
                    />
                  </View>,
                  // <View className="w-full my-4">
                  //   <Input
                  //     type="date"
                  //     name="next_visit_date"
                  //     placeholder="Next Visit Date"
                  //     onFocus={(e) => (e.target.type = "date")}
                  //   />
                  // </View>,
                ]}
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={dashboardData?.consultation?.current_page}
                last_page={dashboardData?.consultation?.last_page}
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

      {/* Recent Appointments */}
      {/* <div className="mb-6">
        <RecentAppointmentsCard />
      </div> */}

      {/* Additional Dashboard Content */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-DEFAULT mb-4">Hospital Overview</h3>
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
            <p className="text-text-light">Chart will be displayed here</p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-DEFAULT mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-neutral-200 last:border-0">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary-600">
                    {["JD", "AS", "TB", "MP"][index]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {[
                      "Dr. John added a new patient record",
                      "Appointment rescheduled for Jane Smith",
                      "New prescription created for Tom Brown",
                      "Medical report uploaded for Mary Parker"
                    ][index]}
                  </p>
                  <p className="text-xs text-text-lighter mt-1">
                    {["2 hours ago", "4 hours ago", "Yesterday", "2 days ago"][index]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div> */}
    </DashboardLayout>
  );
};

export default Dashboard;
