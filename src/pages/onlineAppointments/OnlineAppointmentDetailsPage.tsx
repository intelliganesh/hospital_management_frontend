import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Clock,
  Stethoscope,
  CreditCard,
  History,
  CheckCircle,
  XCircle,
  Edit3,
  Send,
  ExternalLink,
  MessageSquare,
  Video,
  Copy,
  FileText,
  UserCheck,
  Stethoscope as DoctorIcon,
  MessageCircle,
} from "lucide-react";
import getStatusColorScheme from "@/utils/statusColorSchemaDecider";
import { Card } from "@/components/ui/card";
import BouncingLoader from "@/components/BouncingLoader";
import EditAppointmentDrawer from "./components/EditAppointmentDrawer";
import SendPaymentModal from "./components/SendPaymentModal";
import VerifyPaymentModal from "./components/VerifyPaymentModal";
import MeetingLinkModal from "./components/MeetingLinkModal";
import { DATE_FORMAT } from "@/utils/urls/frontend";
import { toast } from "@/utils/custom-hooks/use-toast";
// import {
//   getAppointmentConfirmedMessage,
//   getDoctorAppointmentNotification,
//   openWhatsApp,
// } from "@/utils/whatsappTemplates";
import { useInvoice } from "@/actions/calls/invoice";
// import { clearOnlineAppointmentDetailSlice } from "@/actions/slices/onlineAppointments";

// Timeline Component
const Timeline: React.FC<{ events: any[] }> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) =>
    dayjs(b.timestamp).diff(dayjs(a.timestamp)),
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT_REQUESTED":
        return <MessageSquare size={14} />;
      case "PAYMENT_LINK_SENT":
        return <Send size={14} />;
      case "PAYMENT_VERIFIED":
        return <CheckCircle size={14} />;
      case "APPOINTMENT_CONFIRMED":
        return <CheckCircle size={14} />;
      case "APPOINTMENT_REJECTED":
        return <XCircle size={14} />;
      case "DETAILS_UPDATED":
        return <Edit3 size={14} />;
      default:
        return <History size={14} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "APPOINTMENT_CONFIRMED":
      case "PAYMENT_VERIFIED":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "APPOINTMENT_REJECTED":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "PAYMENT_LINK_SENT":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <View className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
      {sortedEvents.map((event) => (
        <View key={event.id} className="relative flex items-start gap-4 pl-4">
          <View
            className={`absolute left-0 mt-1.5 h-8 w-8 rounded-full border-4 border-white dark:border-card flex items-center justify-center z-10 ${getEventColor(event.type)}`}
          >
            {getEventIcon(event.type)}
          </View>
          <View className="flex flex-col gap-1 ml-6 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm w-full">
            <View className="flex justify-between items-start">
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                {event.description}
              </Text>
              <Text className="text-[10px] text-slate-400 whitespace-nowrap">
                {dayjs(event.timestamp).format("DD MMM, HH:mm")}
              </Text>
            </View>
            {event.performedBy && (
              <Text className="text-[11px] text-slate-500 font-medium italic">
                By {event.performedBy}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const OnlineAppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    onlineAppointmentDetailHandler,
    onlineAppointmentResendLinkHandler,
    cleanUp,
  } = useOnlineAppointments();

  const { downloadInvoiceHandler } = useInvoice();

  const appointment = useSelector(
    (state: RootState) => state.onlineAppointments.appointmentDetail,
  );
  const loading = useSelector(
    (state: RootState) => state.onlineAppointments.loading,
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSendPaymentOpen, setIsSendPaymentOpen] = useState(false);
  const [isVerifyPaymentOpen, setIsVerifyPaymentOpen] = useState(false);
  const [isMeetingLinkOpen, setIsMeetingLinkOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      onlineAppointmentDetailHandler(
        id,
        () => {},
        [],
        (status) =>
          setIsDataLoading(
            status === "pending"
              ? true
              : status === "failed"
                ? true
                : status === "success" && false,
          ),
      );
    }
    return () => {
      cleanUp();
    };
  }, [id]);

  if ((loading || isDataLoading) && !appointment)
    return <BouncingLoader isLoading={true} />;
  // if (!appointment)
  //   return (
  //     <View className="p-10 text-center flex flex-col items-center gap-4">
  //       <XCircle size={48} className="text-slate-300" />
  //       <Text className="text-slate-500">Appointment request not found.</Text>
  //       <Button onPress={() => navigate(-1)}>Go Back</Button>
  //     </View>
  //   );

  const statusColors = getStatusColorScheme(appointment?.status as any);

  const hasMeetingLink = !!appointment?.meeting_link;

  const handleCopyMeetingLink = () => {
    if (!appointment?.meeting_link) return;
    navigator.clipboard
      .writeText(appointment.meeting_link)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Meeting link copied to clipboard.",
          variant: "success",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link.",
          variant: "destructive",
        });
      });
  };

  const handleShareMeetingLinkWithPatient = () => {
    if (!appointment?.meeting_link || !appointment?.phone) return;

    const phone = appointment.phone.replace(/\D/g, "");

    const message = `
Meeting link :

${appointment.meeting_link}
`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleShareMeetingLinkWithDoctor = () => {
    if (!appointment?.meeting_link || !appointment?.doctor?.phone) return;

    const phone = appointment.doctor.phone.replace(/\D/g, "");

    const message = `
Meeting link:
${appointment.meeting_link}

`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleResendToPatient = () => {
    if (!appointment?.id) return;
    onlineAppointmentResendLinkHandler(
      appointment?.id,
      (success) => {
        if (success) {
          toast({
            variant: "success",
            title: "Success",
            description: "Meeting link resent successfully for Patient!",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed",
            description: "Failed to resend meeting link for Patient!",
          });
        }
      },
      { to: "patient" },
    );
  };

  const handleResendToDoctor = () => {
    if (!appointment?.id) return;
    onlineAppointmentResendLinkHandler(
      appointment?.id,
      (success) => {
        if (success) {
          toast({
            variant: "success",
            title: "Success",
            description: "Meeting link resent successfully for doctor!",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Failed",
            description: "Failed to resend meeting link for doctor!",
          });
        }
      },
      { to: "doctor" },
    );
  };

  const handleDownloadInvoice = (id: string | undefined) => {
    if (id) {
      setIsLoading(true);
      downloadInvoiceHandler(id, async (success: boolean) => {
        if (success) {
          toast({
            title: "Success!",
            description: "Successfully downloaded Invoice",
            variant: "success",
          });
          setIsLoading(false);
        } else {
          // toast({
          //   title: "Error",
          //   description: "Failed to download Invoice",
          //   variant: "destructive",
          // });
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <View className="p-6 space-y-6 bg-background min-h-screen">
      <View className="fixed top-4 left-0 w-full z-50">
        <BouncingLoader isLoading={isDataLoading || isLoading} />
      </View>

      {/* ── Header row: back + title + copy meeting link ─────────── */}
      <View className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="p-2 h-10 w-10"
          onPress={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <View className="flex-1 min-w-0">
          <View className="flex items-center gap-2">
            <Text
              as="h1"
              className="text-2xl font-bold text-slate-900 dark:text-slate-100"
            >
              {/* {appointment?.name || "N/A"} */}
              Online Appointment Details
            </Text>
            {/* <View
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
              style={{
                backgroundColor: statusColors.background,
                color: statusColors.color,
              }}
            >
              {appointment?.status?.replace(/_/g, " ") || "N/A"}
            </View> */}
          </View>
          {/* <Text className="text-slate-500 text-sm">
            Ref-No: {appointment?.appointment_reference_number} •{" "}
            {appointment?.appointment_type} Source
          </Text> */}
        </View>
        {/* Copy Meeting Link */}
        {hasMeetingLink && (
          <View className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleCopyMeetingLink}
              title={appointment?.meeting_link}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border"
            >
              <Copy size={15} />
              {/* <span>Copy Meeting Link</span> */}
            </Button>

            <Button
              type="button"
              onClick={handleShareMeetingLinkWithPatient}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle size={15} />
              <span>Send Link to Patient</span>
            </Button>

            <Button
              type="button"
              onClick={handleShareMeetingLinkWithDoctor}
              disabled={!appointment?.doctor?.phone}
              title={
                appointment?.doctor?.phone
                  ? undefined
                  : "Doctor phone number is not available"
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <DoctorIcon size={15} />
              <span>Send Link to Doctor</span>
            </Button>
          </View>
        )}
      </View>

      {/* ── Full-width Patient Info + Actions card ───────────────── */}
      <Card className="overflow-hidden">
        <View className="flex flex-col lg:flex-row">
          {/* Left — patient info */}
          <View className="flex-1 lg:border-r border-slate-200 dark:border-slate-700">
            {/* Gradient header */}
            <View className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 pt-5 pb-4 flex items-center gap-4">
              <View className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border-2 border-primary/20 shrink-0">
                {appointment?.name?.slice(0, 2).toUpperCase() || "?"}
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-xl font-bold text-primary leading-tight truncate">
                  {appointment?.name || "N/A"}
                </Text>
                <Text className="text-sm text-slate-500 mt-0.5">
                  Appointment Ref-no:{" "}
                  {appointment?.appointment_reference_number || "N/A"}
                  {appointment?.appointment_type &&
                    " | " + appointment?.appointment_type + " Source"}
                </Text>
              </View>
              <View
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0"
                style={{
                  backgroundColor: statusColors.background,
                  color: statusColors.color,
                }}
              >
                {appointment?.status?.replace(/_/g, " ") || "N/A"}
              </View>
            </View>

            {/* Data grid */}
            <View className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm">
              <View className="space-y-1">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Full Name
                </Text>
                <Text className="font-medium text-slate-900 dark:text-slate-100">
                  {appointment?.name || "N/A"}
                </Text>
              </View>
              <View className="space-y-1">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Gender / Age
                </Text>
                <Text className="font-medium text-slate-900 dark:text-slate-100">
                  {appointment?.gender || "N/A"} / {appointment?.age || "N/A"}{" "}
                  yrs
                </Text>
              </View>
              <View className="space-y-1">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Contact
                </Text>
                <View className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
                  <Phone size={14} />
                  <Text>{appointment?.phone || "N/A"}</Text>
                </View>
              </View>
              <View className="space-y-1">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Email
                </Text>
                <View className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
                  <Mail size={14} />
                  <Text className="truncate">
                    {appointment?.email || "N/A"}
                  </Text>
                </View>
              </View>
              <View className="space-y-1">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Visit Type
                </Text>
                <Text className="font-medium text-slate-900 dark:text-slate-100">
                  {appointment?.visit_type || appointment?.visti_type || "N/A"}
                </Text>
              </View>
              <View className="space-y-1">
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned Doctor
                </Text>
                <View className="flex items-center gap-2 font-medium">
                  <Stethoscope
                    size={14}
                    className="text-success-600 shrink-0"
                  />
                  <Text>{appointment?.doctor?.name || "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right — Action panel */}
          <View className="w-full lg:w-72 xl:w-80 shrink-0 p-4 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col gap-2">
            <Text className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 px-1">
              Actions
            </Text>

            {/* a. Send Payment Details */}

            {/* {appointment?.status !== "Paid" && ( */}
            <button
              type="button"
              onClick={() => setIsSendPaymentOpen(true)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors ${appointment?.status === "Paid" && "bg-primary-200 cursor-not-allowed"}`}
              disabled={appointment?.status === "Paid"}
            >
              <Send size={15} className="shrink-0" /> Send Payment Details
            </button>
            {/* )} */}

            {/* b. Verify Payment */}

            {/* {appointment?.status !== "Paid" && ( */}
            <button
              type="button"
              onClick={() => setIsVerifyPaymentOpen(true)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors ${appointment?.status === "Paid" && "!bg-green-200 cursor-not-allowed"}`}
              disabled={appointment?.status === "Paid"}
            >
              <CheckCircle size={15} className="shrink-0" /> Verify Payment
            </button>
            {/* )} */}

            {/* c. Create Meeting Link */}
            {appointment?.status === "Paid" && (
              <>
                <button
                  type="button"
                  onClick={() => setIsMeetingLinkOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <Video size={15} className="shrink-0" /> Create Meeting Link
                </button>

                {/* d. Resend Meeting Link to Patient */}
                {hasMeetingLink && (
                  <button
                    type="button"
                    onClick={handleResendToPatient}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <UserCheck size={15} className="shrink-0 text-primary" />{" "}
                    Resend Meeting Link to Patient
                  </button>
                )}

                {/* e. Resend Meeting Link to Doctor */}
                {hasMeetingLink && (
                  <button
                    type="button"
                    onClick={handleResendToDoctor}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <DoctorIcon size={15} className="shrink-0 text-primary" />{" "}
                    Resend Meeting Link to Doctor
                  </button>
                )}
              </>
            )}

            {/* f. Edit Details */}
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Edit3 size={15} className="shrink-0 text-amber-500" /> Edit
              Details
            </button>

            {/* g. View & Download Invoice */}
            {appointment?.status === "Paid" && (
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                disabled={appointment?.status !== "Paid"}
                onClick={() =>
                  handleDownloadInvoice(appointment?.consultation?.id)
                }
              >
                <FileText size={15} className="shrink-0 text-slate-400" />{" "}
                Download Invoice
              </button>
            )}
          </View>
        </View>
      </Card>

      {/* ── Lower grid: Appointment Details · Payment Info · Timeline ─── */}
      <View className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col: Appointment Details */}
        <View className="lg:col-span-2 space-y-5">
          <Card className="p-6">
            <Text className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-700 dark:text-primary-400">
              <Calendar size={20} /> Appointment Details
            </Text>
            <View className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <View className="space-y-1">
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Assigned Doctor
                </Text>
                <View className="flex items-center gap-2 font-medium">
                  <Stethoscope size={16} className="text-success-600" />
                  <Text>{appointment?.doctor?.name || "N/A"}</Text>
                </View>
              </View>
              <View className="space-y-1">
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Requested Date & Time
                </Text>
                <View className="flex items-center gap-2 font-medium">
                  <Clock size={16} className="text-amber-600" />
                  <Text>
                    {appointment?.appointment_datetime
                      ? dayjs(appointment.appointment_datetime).format(
                          "DD MMM, YYYY hh:mm A",
                        )
                      : "N/A"}{" "}
                    (Requested Slot)
                  </Text>
                </View>
              </View>
              <View className="md:col-span-2 space-y-2">
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Complaints / Symptoms
                </Text>
                <View className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 italic text-slate-700 dark:text-slate-300">
                  {appointment?.symptoms || "N/A"}
                </View>
              </View>
            </View>
          </Card>

          <Card className="p-6">
            <Text className="text-lg font-bold mb-6 flex items-center gap-2 text-primary-700 dark:text-primary-400">
              <History size={20} /> Activity Timeline
            </Text>
            <Timeline events={appointment?.timeline || []} />
          </Card>
        </View>

        {/* Right col: Payment Info + Timeline */}
        <View className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-slate-900">
            <Text className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-700 dark:text-primary-400">
              <CreditCard size={20} /> Payment Info
            </Text>
            <View className="space-y-4">
              <View className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <Text className="text-slate-500 text-sm">Status</Text>
                <View
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{
                    backgroundColor: statusColors.background,
                    color: statusColors.color,
                  }}
                >
                  {appointment?.status?.replace(/_/g, " ")}
                </View>
              </View>
              {appointment?.amount && (
                <View className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <Text className="text-slate-500 text-sm">Amount</Text>
                  <Text
                    weight="font-bold"
                    className="text-xl text-slate-900 dark:text-slate-100"
                  >
                    {appointment?.currency}
                    {appointment?.amount || 0}
                  </Text>
                </View>
              )}
              {appointment?.transaction_id && (
                <View className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                  <Text className="text-slate-500 text-sm">Transaction ID</Text>
                  <Text className="font-mono text-xs">
                    {appointment.transaction_id}
                  </Text>
                </View>
              )}
              {appointment?.payment_date &&
                appointment.payment_date !== "0000-00-00 00:00:00" && (
                  <View className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                    <Text className="text-slate-500 text-sm">Payment Date</Text>
                    <Text className="font-medium text-slate-900 dark:text-slate-100">
                      {dayjs(appointment.payment_date).format(DATE_FORMAT)}
                    </Text>
                  </View>
                )}
              {appointment?.payment_screenshot && (
                <View className="space-y-2">
                  <Text className="text-slate-500 text-sm">Payment Proof</Text>
                  <View className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={
                        appointment.payment_screenshot.startsWith("http")
                          ? appointment.payment_screenshot
                          : `${import.meta.env.VITE_APP_URL}/${appointment.payment_screenshot}`
                      }
                      alt="Payment Proof"
                      className="w-full h-40 object-contain bg-slate-900"
                    />
                    <View className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={
                          appointment.payment_screenshot.startsWith("http")
                            ? appointment.payment_screenshot
                            : `${import.meta.env.VITE_APP_URL}/${appointment.payment_screenshot}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" className="text-white">
                          <ExternalLink size={20} />
                        </Button>
                      </a>
                    </View>
                  </View>
                </View>
              )}
              {!appointment?.paidAmount && (
                <View className="py-4 text-center">
                  <CreditCard
                    size={32}
                    className="mx-auto text-slate-200 dark:text-slate-600 mb-2"
                  />
                  <Text className="text-xs text-slate-400">
                    No payment details recorded yet.
                  </Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </View>

      <EditAppointmentDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        appointment={appointment}
      />
      <MeetingLinkModal
        isOpen={isMeetingLinkOpen}
        onClose={() => setIsMeetingLinkOpen(false)}
        appointment={appointment}
        onSuccess={() => id && onlineAppointmentDetailHandler(id, () => {}, [])}
      />
      <SendPaymentModal
        isOpen={isSendPaymentOpen}
        onClose={() => setIsSendPaymentOpen(false)}
        appointment={appointment}
      />
      <VerifyPaymentModal
        isOpen={isVerifyPaymentOpen}
        onClose={() => setIsVerifyPaymentOpen(false)}
        appointment={appointment}
      />
    </View>
  );
};

export default OnlineAppointmentDetailsPage;
