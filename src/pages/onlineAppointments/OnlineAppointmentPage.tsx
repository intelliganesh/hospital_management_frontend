import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
// import { GenericStatus } from "@/interfaces";
import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
import { useOpd } from "@/actions/calls/opd";
import DynamicTable from "@/components/ui/DynamicTable";
import SearchBar from "@/components/ui/search-bar";
import { ONLINE_APPOINTMENT_DETAILS_URL } from "@/utils/urls/frontend";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import {
  Edit,
  Send,
  CheckCircle,
  Eye,
  CalendarRange,
  Phone,
  Smartphone,
  Users,
  Clock,
  Calendar,
  X,
  Check,
  Trash,
  PersonStanding,
} from "lucide-react";
import InfoCard from "@/components/ui/infoCard";
import DateRangePicker from "@/components/DateRangePicker";
import { OnlineAppointment } from "@/types/onlineAppointment.types";
import EditAppointmentDrawer from "./components/EditAppointmentDrawer";
import SendPaymentModal from "./components/SendPaymentModal";
import VerifyPaymentModal from "./components/VerifyPaymentModal";
import DataSort, { SortOption } from "@/components/SortData";
import {
  dynamicTableCardStyle,
  handleSortChange,
} from "@/utils/helperFunctions";
import { Card } from "@/components/ui/card";
import BouncingLoader from "@/components/BouncingLoader";
import Modal from "@/components/Modal";
import DeleteLoader from "@/components/deleteLoader";
import PaginationComponent from "@/components/Pagination";

const OnlineAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const {
    onlineAppointmentsListHandler,
    cleanUp,
    onlineAppointmentStatsHandler,
    onlineAppointmentDetailHandler,
    onlineAppointmentDeleteHandler,
  } = useOnlineAppointments();
  const { PuaListHandler } = useOpd();

  const onlineAppointments = useSelector(
    (state: RootState) => state.onlineAppointments.onlineAppointmentsList,
  );
  const onlineAppointmentsStats = useSelector(
    (state: RootState) => state.onlineAppointments.onlineAppointmentStats,
  );
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<OnlineAppointment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSendPaymentOpen, setIsSendPaymentOpen] = useState(false);
  const [isVerifyPaymentOpen, setIsVerifyPaymentOpen] = useState(false);

  useEffect(() => {
    if (searchParams?.has("currentPage")) {
      onlineAppointmentsListHandler(
        searchParams?.get("currentPage") ?? 1,
        () => { },
        searchParams.get("search") ?? null,
        searchParams.get("sort_by") ?? null,
        searchParams.get("sort_order") ?? null,
        searchParams.get("from_date") ?? null,
        searchParams.get("to_date") ?? null,
        [],
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
    }
    PuaListHandler(() => { });
    onlineAppointmentStatsHandler(() => { });
    return () => {
      cleanUp();
    };
  }, [
    searchParams.get("search"),
    searchParams.get("sort_by"),
    searchParams.get("sort_order"),
    searchParams?.get("currentPage"),
    searchParams.get("from_date"),
    searchParams.get("to_date"),
  ]);

  const refreshList = () => {
    onlineAppointmentsListHandler(
      searchParams.get("currentPage") ?? 1,
      () => { },
      searchParams.get("search") ?? null,
      searchParams.get("sort_by") ?? null,
      searchParams.get("sort_order") ?? null,
      searchParams.get("from_date") ?? null,
      searchParams.get("to_date") ?? null,
      [],
      () => { },
    );
    onlineAppointmentStatsHandler(() => { });
  };
  const handleEdit = (row: OnlineAppointment) => {
    setSelectedAppointment(row);
    setIsEditOpen(true);
  };
  const handleDelete = (row: OnlineAppointment) => {
    setDeleteId(row?.id);
  };

  const handleSendPayment = (row: OnlineAppointment) => {
    setSelectedAppointment(row);
    setIsSendPaymentOpen(true);

    onlineAppointmentDetailHandler(row.id, () => { });
  };

  const handleVerifyPayment = (row: OnlineAppointment) => {
    setSelectedAppointment(row);
    setIsVerifyPaymentOpen(true);

    onlineAppointmentDetailHandler(row.id, () => { });
  };

  // const handleNotifyDoctor = (row: OnlineAppointment) => {
  //   const appointmentDate = row.appointment_datetime
  //     ? dayjs(row.appointment_datetime).format("DD MMM YYYY")
  //     : "TBA";
  //   const appointmentTime = row.appointment_datetime
  //     ? dayjs(row.appointment_datetime).format("hh:mm A")
  //     : "TBA";

  //   const message = getDoctorAppointmentNotification(
  //     row.doctor?.name || "Doctor",
  //     row.name,
  //     appointmentDate,
  //     appointmentTime,
  //     row.meeting_link || "",
  //   );

  //   if (row?.doctor?.phone) {
  //     openWhatsApp(row?.doctor?.phone, message);
  //   } else {
  //     alert("Doctor's phone number not found.");
  //   }
  // };

  const modalCloseHandler = () => {
    setDeleteId(null);
  };

  const sortOptions: SortOption[] = [
    {
      label: "Appointment Date & Time (A-Z)",
      value: "appointment_datetime",
      order: "asc",
    },
    {
      label: "Appointment Date & Time (Z-A)",
      value: "appointment_datetime",
      order: "desc",
    },
  ];

  const tableHeaders = [
    "Appointment Ref-No",
    "Patient Details",
    "Doctor / Slot",
    "Source",
    "Status",
    "Actions",
  ];

  const tableData = useMemo(() => {
    return (onlineAppointments?.data ?? []).map((row: any) => [
      row,
      row,
      row,
      row,
      row,
      row,
    ]);
  }, [onlineAppointments]);

  const renderCell = (
    _rowIndex: number,
    colIndex: number,
    row: OnlineAppointment,
  ) => {
    switch (colIndex) {
      case 0:
        return (
          <Text className="font-medium text-primary-700">
            {row?.appointment_reference_number || "N/A"}
          </Text>
        );

      case 1:
        return (
          <View className="flex flex-col">
            <Text className="font-semibold">{row.name}</Text>{" "}
            {/* was row.patientName */}
            <View className="flex items-center gap-1 text-xs text-slate-500">
              <Phone size={12} />
              <Text>{row.phone}</Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="flex flex-col">
            <Text className="text-sm font-medium">{row.doctor?.name}</Text>{" "}
            {/* was row.doctorName */}
            <Text className="text-xs text-slate-500">
              {row.appointment_datetime
                ? dayjs(row.appointment_datetime).format("DD MMM, YYYY hh:mm A")
                : "N/A"}{" "}
              {/* was row.appointmentDate */}
            </Text>
          </View>
        );

      case 3:
        return (
          <View className="flex items-center gap-1">
            {row.appointment_type === "online" ||
              row.appointment_type === "ONLINE" ? (
              <Smartphone size={14} className="text-blue-500" />
            ) : (
              <PersonStanding size={14} className="text-purple-500" />
            )}
            <Text className="text-xs capitalize">
              {row.appointment_type} {/* was row.source */}
            </Text>
          </View>
        );
      case 4: {
        const colors = getStatusColorScheme(row.status as any);
        return (
          <View
            className="px-2 py-1 rounded-full text-[10px] font-bold inline-block text-center uppercase"
            style={{
              backgroundColor: colors.background,
              color: colors.color,
              border: `1px solid ${colors.color}20`,
            }}
          >
            {row.status.replace(/_/g, " ")}
          </View>
        );
      }

      case 5:
        return (
          <View className="flex items-center gap-1">
            <Button
              variant="ghost"
              title="View Details"
              className="py-1 text-slate-500 hover:text-primary-600"
              onPress={() =>
                navigate(ONLINE_APPOINTMENT_DETAILS_URL.replace(":id", row.id))
              }
            >
              <Eye size={18} />
            </Button>
            <Button
              variant="ghost"
              title="Edit Request"
              className="py-1 text-slate-500 hover:text-primary-600"
              onPress={() => handleEdit(row)}
            >
              <Edit size={18} />
            </Button>
            <Button
              variant="ghost"
              title="Delete Request"
              className="py-1 text-slate-500 hover:text-primary-600"
              onPress={() => handleDelete(row)}
            >
              <Trash size={18} className="text-red-500" />
            </Button>
            {/* {row.status === GenericStatus.PENDING && ( */}
            <Button
              variant="ghost"
              title="Send Payment Link"
              disabled={row.status === "Paid"}
              className={`py-1 text-slate-500 hover:text-primary-600 ${row.status === "Paid" && "opacity-50 cursor-not-allowed pointer-events-none"}`}
              onPress={() => handleSendPayment(row)}
            >
              <Send size={18} />
            </Button>
            {/* )}  */}

            {/* {row.status === GenericStatus.PAYMENT_PENDING && ( */}
            <Button
              variant="ghost"
              title="Verify Payment"
              disabled={row.status === "Paid"}
              className={`py-1 text-success-600 hover:bg-success-50 ${row.status === "Paid" && "opacity-50 cursor-not-allowed pointer-events-none"}`}
              onPress={() => handleVerifyPayment(row)}
            >
              <CheckCircle size={18} />
            </Button>
            {/* )} */}

            {/* {row.status === "Paid" && (
              <Button
                variant="ghost"
                title="Notify Doctor"
                className="p-1 text-green-600 hover:bg-green-50"
                onPress={() => handleNotifyDoctor(row)}
              >
                <MessageSquare size={18} />
              </Button>
            )} */}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="p-6 bg-background min-h-screen">
      <View className="fixed top-4 left-0  w-full z-50">
        <BouncingLoader isLoading={isLoading} />
      </View>
      <Modal
        title="Delete Appointment Request"
        isOpen={deleteId ? true : false}
        onClose={modalCloseHandler}
        description="Are you sure you want to delete this appointment request? This action cannot be undone and will permanently remove the data from the system."
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
                onlineAppointmentDeleteHandler(
                  deleteId,
                  (_: boolean) => {
                    // if (success) {
                    onlineAppointmentsListHandler(
                      searchParams?.get("currentPage") ?? 1,
                      () => {
                        modalCloseHandler();
                      },
                      searchParams.get("search") ?? null,
                      searchParams.get("sort_by") ?? null,
                      searchParams.get("sort_order") ?? null,
                      searchParams.get("from_date") ?? null,
                      searchParams.get("to_date") ?? null,
                      [],
                    );
                    // }
                  },
                  (status) => {
                    setIsDeleting(
                      status === "pending"
                        ? true
                        : status === "failed"
                          ? false
                          : status === "success" && false,
                    );
                  },
                );
              }
            }}
          >
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>
      <View className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <View className="flex items-center gap-3">
          <View className="p-2 !bg-gradient-to-br !from-primary-100 !via-primary-200 !to-primary-300 dark:!from-primary-800/40 dark:!via-primary-700/40 dark:!to-primary-600/40 !text-primary-600 dark:!text-primary-400 !shadow-lg !shadow-primary-500/25 dark:!shadow-primary-400/20 rounded-lg text-primary-600">
            <CalendarRange size={24} />
          </View>
          <View>
            <Text as="h1" className="text-2xl font-bold text-slate-900">
              Online Appointments
            </Text>
            <Text className="text-slate-500 text-sm">
              Manage external patient requests and payments
            </Text>
          </View>
        </View>
        <DateRangePicker placeholder="Choose your dates" />
      </View>

      <View className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 mb-6">
        <InfoCard
          label="Total Online Appointments"
          value={onlineAppointmentsStats?.total_appointments}
          icon={<Users className="text-orange-500 w-5 h-5" />}
          valueStyle="!text-orange-600 dark:!text-orange-400 !text-2xl"
          iconStyle="!bg-gradient-to-br !from-orange-100 !via-orange-200 !to-orange-300 dark:!from-orange-800/40 dark:!via-orange-700/40 dark:!to-orange-600/40 !text-orange-600 dark:!text-orange-400 !shadow-lg !shadow-orange-500/25 dark:!shadow-orange-400/20"
        />
        <InfoCard
          label="Pending Appointments"
          value={onlineAppointmentsStats?.pending_appointments}
          icon={<Clock className="text-blue-500  w-5 h-5" />}
          valueStyle="!text-blue-600 dark:!text-blue-400 !text-2xl"
          iconStyle="!bg-gradient-to-br !from-blue-100 !via-blue-200 !to-blue-300 dark:!from-blue-800/40 dark:!via-blue-700/40 dark:!to-blue-600/40 !text-blue-600 dark:!text-blue-400 !shadow-lg !shadow-blue-500/25 dark:!shadow-blue-400/20"
        />
        <InfoCard
          label="Payment Pending Appointments"
          value={onlineAppointmentsStats?.payment_pending_appointments}
          icon={<Clock className="text-yellow-500  w-5 h-5" />}
          valueStyle="!text-yellow-600 dark:!text-yellow-400 !text-2xl"
          iconStyle="!bg-gradient-to-br !from-yellow-100 !via-yellow-200 !to-yellow-300 dark:!from-yellow-800/40 dark:!via-yellow-700/40 dark:!to-yellow-600/40 !text-yellow-600 dark:!text-yellow-400 !shadow-lg !shadow-yellow-500/25 dark:!shadow-yellow-400/20"
        />
        <InfoCard
          label="Paid Appointments"
          value={onlineAppointmentsStats?.paid_appointments}
          icon={<Check className="text-emerald-500  w-5 h-5" />}
          valueStyle="!text-emerald-600 dark:!text-emerald-400 !text-2xl"
          iconStyle="!bg-gradient-to-br !from-emerald-100 !via-emerald-200 !to-emerald-300 dark:!from-emerald-800/40 dark:!via-emerald-700/40 dark:!to-emerald-600/40 !text-emerald-600 dark:!text-emerald-400 !shadow-lg !shadow-emerald-500/25 dark:!shadow-emerald-400/20"
        />
        <InfoCard
          label="Canceled Appointments"
          value={onlineAppointmentsStats?.cancelled_appointments}
          icon={<X className="text-red-500  w-5 h-5" />}
          valueStyle="!text-red-600 dark:!text-red-400 !text-2xl"
          iconStyle="!bg-gradient-to-br !from-red-100 !via-red-200 !to-red-300 dark:!from-red-800/40 dark:!via-red-700/40 dark:!to-red-600/40 !text-red-600 dark:!text-red-400 !shadow-lg !shadow-red-500/25 dark:!shadow-red-400/20"
        />
        <InfoCard
          label="Upcoming Appointments"
          value={onlineAppointmentsStats?.upcoming_appointments}
          icon={<Calendar className="text-indigo-500  w-5 h-5" />}
          valueStyle="!text-indigo-600 dark:!text-indigo-400 !text-2xl"
          iconStyle="!bg-gradient-to-br !from-indigo-100 !via-indigo-200 !to-indigo-300 dark:!from-indigo-800/40 dark:!via-indigo-700/40 dark:!to-indigo-600/40 !text-indigo-600 dark:!text-indigo-400 !shadow-lg !shadow-indigo-500/25 dark:!shadow-indigo-400/20"
        />
      </View>

      <Card className={dynamicTableCardStyle}>
        <DynamicTable
          tableHeaders={tableHeaders}
          tableData={tableData}
          renderCell={renderCell}
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
                activeSort={activeSort ?? undefined}
                onSort={(option) =>
                  handleSortChange(
                    option,
                    setActiveSort,
                    setSearchParams,
                    searchParams,
                  )
                }
              />
            ),
          }}
          footer={{
            pagination: (
              <PaginationComponent
                current_page={onlineAppointments?.current_page}
                last_page={onlineAppointments?.last_page}
                getPageNumberHandler={(page: number) =>
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

      <EditAppointmentDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        appointment={selectedAppointment}
      />

      <SendPaymentModal
        isOpen={isSendPaymentOpen}
        onClose={() => {
          setIsSendPaymentOpen(false);
          refreshList();
        }}
        appointment={selectedAppointment}
      />

      <VerifyPaymentModal
        isOpen={isVerifyPaymentOpen}
        onClose={() => {
          setIsVerifyPaymentOpen(false);
          refreshList();
        }}
        appointment={selectedAppointment}
      />
    </View>
  );
};

export default OnlineAppointmentPage;
