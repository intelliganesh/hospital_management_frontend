import React, { useState } from "react";
import dayjs from "dayjs";
import {
  getAppointmentConfirmedMessage,
  getPaymentRejectedMessage,
  openWhatsApp,
} from "@/utils/whatsappTemplates";

import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import Modal from "@/components/Modal";
import Upload from "@/components/Upload";
import { OnlineAppointment } from "@/types/onlineAppointment.types";
import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
import { imageUpload } from "@/actions/calls/uesImage";
import {
  CheckCircle,
  CreditCard,
  ExternalLink,
  MessageCircle,
  // MessageSquare,
  // Link as LinkIcon,
  Calendar,
  // Wand2,
} from "lucide-react";
import SingleSelector from "@/components/SingleSelector";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { toast } from "@/utils/custom-hooks/use-toast";

interface VerifyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: OnlineAppointment | null;
}

const VerifyPaymentModal: React.FC<VerifyPaymentModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const {
    confirmPayment,
    rejectPayment,
    onlineAppointmentGenerateLinkHandler,
  } = useOnlineAppointments();

  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  // const [meetingLink, setMeetingLink] = useState("");
  const [visitType, setVisitType] = useState("First Visit");
  const [selectedFileList, setSelectedFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedAppointment, setVerifiedAppointment] =
    useState<OnlineAppointment | null>(null);
  const whatsappNotificationEnabled = useSelector((state: RootState) =>
    Boolean(state.systemSettings?.settings?.whatsapp_notification),
  );

  const navigate = useNavigate();
  // const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  // const generateMeetingLink = () => {
  //   setIsGeneratingLink(true);
  //   setTimeout(() => {
  //     const isGoogleMeet = Math.random() > 0.5;
  //     let link = "";
  //     if (isGoogleMeet) {
  //       const p1 = Math.random().toString(36).substring(2, 5);
  //       const p2 = Math.random().toString(36).substring(2, 6);
  //       const p3 = Math.random().toString(36).substring(2, 5);
  //       link = `https://meet.google.com/${p1}-${p2}-${p3}`;
  //     } else {
  //       const meetingId = Math.floor(1000000000 + Math.random() * 9000000000);
  //       const pwd = Math.random().toString(36).substring(2, 10);
  //       link = `https://zoom.us/j/${meetingId}?pwd=${pwd}`;
  //     }
  //     setMeetingLink(link);
  //     setIsGeneratingLink(false);
  //   }, 800);
  // };

  const BASE_URL = import.meta.env.VITE_BASE_URL || "";

  React.useEffect(() => {
    if (isOpen && appointment) {
      setTransactionId(appointment.transaction_id || "");
      // setMeetingLink(appointment.meeting_link || "");

      if (
        appointment.payment_date &&
        appointment.payment_date !== "0000-00-00 00:00:00"
      ) {
        setPaymentDate(appointment.payment_date.split(" ")[0]);
      } else {
        setPaymentDate(new Date().toISOString().split("T")[0]);
      }

      setVisitType(
        appointment.visit_type || appointment.visti_type || "First Visit",
      );
      setSelectedFileList([]);
      setIsVerified(false);
      setVerifiedAppointment(null);
    }
  }, [isOpen, appointment]);

  const getMeetingLinkFromResponse = (data: any) => {
    if (!data) return "";

    return (
      data?.meeting_link ||
      data?.data?.meeting_link ||
      data?.appointment?.meeting_link ||
      data?.data?.appointment?.meeting_link ||
      (typeof data === "string" ? data : "")
    );
  };

  const getManualWhatsAppMessage = (appointmentWithLink?: OnlineAppointment) => {
    const sourceAppointment =
      appointmentWithLink || verifiedAppointment || appointment;
    if (!sourceAppointment) return "";

    const appointmentDate = sourceAppointment.appointment_datetime
      ? dayjs(sourceAppointment.appointment_datetime).format("DD MMM YYYY")
      : "TBA";
    const appointmentTime = sourceAppointment.appointment_datetime
      ? dayjs(sourceAppointment.appointment_datetime).format("hh:mm A")
      : "TBA";

    const doctorName =
      sourceAppointment.doctor?.name ||
      appointment?.doctor?.name ||
      (sourceAppointment as any)?.doctor_name ||
      (sourceAppointment as any)?.doctorName ||
      (sourceAppointment as any)?.assigned_doctor?.name ||
      "Doctor";

    const confirmationMessage = getAppointmentConfirmedMessage(
      sourceAppointment.name,
      doctorName,
      appointmentDate,
      appointmentTime,
    );

    return sourceAppointment.meeting_link
      ? `${confirmationMessage}\nMeeting link: ${sourceAppointment.meeting_link}`
      : confirmationMessage;
  };

  const handleSendLinkViaWhatsApp = async () => {
    const sourceAppointment = verifiedAppointment || appointment;
    if (!sourceAppointment?.phone) return;

    if (sourceAppointment.meeting_link) {
      openWhatsApp(sourceAppointment.phone, getManualWhatsAppMessage());
      onClose();
      return;
    }

    setIsSendingWhatsApp(true);
    await onlineAppointmentGenerateLinkHandler(
      sourceAppointment.id,
      (success, data) => {
        if (success) {
          const meetingLink = getMeetingLinkFromResponse(data);

          if (meetingLink) {
            const appointmentWithLink = {
              ...appointment,
              ...sourceAppointment,
              doctor: sourceAppointment.doctor || appointment?.doctor,
              meeting_link: meetingLink,
            } as OnlineAppointment;

            setVerifiedAppointment(appointmentWithLink);
            openWhatsApp(
              appointmentWithLink.phone,
              getManualWhatsAppMessage(appointmentWithLink),
            );
            onClose();
          } else {
            toast({
              title: "Meeting link unavailable",
              description: "The meeting link was not returned by the server.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Failed",
            description: "Failed to generate meeting link.",
            variant: "destructive",
          });
        }

        setIsSendingWhatsApp(false);
      },
      { whatsapp_notification: false },
    );
  };

  const handleVerify = async () => {
    // if (!appointment || !meetingLink) return;
    if (!appointment) return;

    setIsSubmitting(true);

    await confirmPayment(
      appointment.id,
      appointment.amount || "0",
      appointment.payment_type === "Bank Transfer" ? "Bank Transfer" : "link",
      transactionId,
      paymentDate,
      // meetingLink,
      visitType,
      async (success: any, data?: any) => {
        if (success) {
          setVerifiedAppointment({
            ...appointment,
            ...(data as Partial<OnlineAppointment>),
            doctor: (data as OnlineAppointment)?.doctor || appointment.doctor,
          });
          const newFile = selectedFileList.find((f) => !f.isExisting)?.file;
          if (newFile) {
            const uploadData = {
              id: appointment.id,
              modal_type: "external_appointment",
              file_name: "payment_screenshot",
              folder_name: "payment_screenshot",
              image: newFile,
            };
            imageUpload(uploadData, (uploadSuccess) => {
              if (uploadSuccess)
                console.log("Screenshot uploaded successfully");
            });
          }

          if (whatsappNotificationEnabled) {
            navigate("/online-appointments/" + appointment?.id);
          } else {
            setIsVerified(true);
          }
          // const appointmentDate = appointment.appointment_datetime
          //   ? dayjs(appointment.appointment_datetime).format("DD MMM YYYY")
          //   : "TBA";
          // const appointmentTime = appointment.appointment_datetime
          //   ? dayjs(appointment.appointment_datetime).format("hh:mm A")
          //   : "TBA";

          // const message = getAppointmentConfirmedMessage(
          //   appointment.name,
          //   appointment.doctor?.name || "Doctor",
          //   appointmentDate,
          //   appointmentTime,
          //   // meetingLink,
          // );
          // openWhatsApp(appointment.phone, message);
          // onClose();
        }
        setIsSubmitting(false);
      },
      { whatsapp_notification: whatsappNotificationEnabled },
    );
  };

  // const handleGenerateLink = async () => {
  //   if (!appointment) return;
  //   setIsGeneratingLink(true);
  //   await onlineAppointmentGenerateLinkHandler(
  //     appointment?.id,
  //     (success, data) => {
  //       if (success && data) {
  //         const link =
  //           data?.data?.meeting_link || (typeof data === "string" ? data : "");
  //         if (link) setMeetingLink(link);
  //       }
  //       setIsGeneratingLink(false);
  //     },
  //   );
  // };

  const handleReject = async () => {
    if (!appointment) return;

    setIsSubmitting(true);
    await rejectPayment(
      appointment.id,
      appointment.amount || "0",
      appointment.payment_type === "Bank Transfer" ? "Bank Transfer" : "link",
      (success) => {
        if (success) {
          const message = getPaymentRejectedMessage(
            appointment.name,
            appointment.id,
          );
          openWhatsApp(appointment.phone, message);
          onClose();
        }
        setIsSubmitting(false);
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Payment"
      description="Review the payment screenshot and confirm the appointment."
      size="xl"
      closeOnOutsideClick={false}
      closeOnEsc={false}
      footer={
        <View className="flex justify-between items-center w-full">
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            onPress={handleReject}
            disabled={isSubmitting}
          >
            Reject Transaction
          </Button>
          <View className="flex gap-3">
            <Button variant="outline" onPress={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onPress={handleVerify}
              loading={isSubmitting}
              className="gap-2 flex flex-row items-center bg-green-600 hover:bg-green-700 border-none text-white font-bold h-11 px-6 shadow-md"
              disabled={isVerified}
            >
              <CheckCircle size={18} /> Confirm & Verify
            </Button>
            {!whatsappNotificationEnabled && isVerified && (
              <Button
                onPress={handleSendLinkViaWhatsApp}
                loading={isSendingWhatsApp}
                disabled={isSendingWhatsApp}
                className="gap-2 flex flex-row items-center bg-emerald-600 hover:bg-emerald-700 border-none text-white font-bold h-11 px-6 shadow-md"
              >
                <MessageCircle size={18} /> Send Link via WhatsApp
              </Button>
            )}
          </View>
        </View>
      }
    >
      <View className="space-y-6">
        {/* Patient Summary Strip */}
        <View className="px-5 py-4 bg-muted/40 rounded-xl border border-border flex justify-between items-center">
          <View className="flex gap-3 items-center">
            <View className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {appointment?.name?.slice(0, 2).toUpperCase()}
            </View>
            <View>
              <Text className="text-base font-semibold text-foreground leading-none">
                {appointment?.name}
              </Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Phone:{" "}
                <span className="text-primary font-mono">
                  {appointment?.phone}
                </span>
              </Text>
            </View>
          </View>
          <View className="text-right">
            <Text className="text-2xl font-bold text-foreground">
              {appointment?.currency}
              {appointment?.amount || "0.00"}
            </Text>
            <View className="flex flex-row items-center gap-1.5 mt-1 justify-end">
              <View
                className={`h-1.5 w-1.5 rounded-full ${
                  appointment?.payment_type === "Bank Transfer"
                    ? "bg-amber-500"
                    : "bg-indigo-500"
                }`}
              />
              <Text className="text-[10px] uppercase font-semibold text-muted-foreground tracking-tight">
                via{" "}
                {appointment?.payment_type === "Bank Transfer"
                  ? "Bank Transfer"
                  : "UPI / Razorpay Link"}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferred Appointment Slot strip */}
        <View className="px-5 py-3.5 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-xl border border-emerald-100 dark:border-emerald-900/50 flex flex-row items-center gap-3">
          <Calendar
            size={18}
            className="text-emerald-600 dark:text-emerald-400 shrink-0"
          />
          <View>
            <Text className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              Preferred Appointment Slot
            </Text>
            <Text className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
              {appointment?.appointment_datetime
                ? dayjs(appointment.appointment_datetime).format(
                    "DD MMM YYYY, hh:mm A",
                  ) + " IST"
                : "TBA"}
            </Text>
          </View>
        </View>

        <View className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Form */}
          <View className="md:col-span-7 space-y-4">
            {/* Visit Type */}
            <View className="space-y-1.5">
              <Text
                as="label"
                weight="font-semibold"
                className="text-[11px] uppercase text-muted-foreground"
              >
                Visit Type
              </Text>
              <SingleSelector
                value={visitType}
                onChange={(value: string) => setVisitType(value)}
                options={[
                  { label: "First Visit", value: "First Visit" },
                  { label: "Follow-up", value: "Follow-up" },
                  {
                    label: "Post Surgery Follow up",
                    value: "Post Surgery Follow up",
                  },
                ]}
                className="h-10 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 bg-background w-full"
              />
            </View>

            {/* Row 1: Transaction ID + Payment Date + Visit Type */}
            <View className="grid grid-cols-2 gap-3">
              {/* Transaction ID */}
              <View className="space-y-1.5">
                <Text
                  as="label"
                  weight="font-semibold"
                  className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"
                >
                  <CreditCard size={11} className="text-primary" />
                  Transaction ID
                </Text>
                <View>
                  <Input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="UTR / Transaction No."
                    className="pl-9 h-10 text-sm border-border focus:ring-2 focus:ring-primary/20 bg-background shadow-none"
                  />
                </View>
              </View>

              {/* Payment Date */}
              <View className="space-y-1.5">
                <Text
                  as="label"
                  weight="font-semibold"
                  className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"
                >
                  <Calendar size={11} className="text-primary" />
                  Payment Date
                </Text>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-10 text-sm border-border focus:ring-2 focus:ring-primary/20 bg-background shadow-none"
                />
              </View>
            </View>

            {/* Row 2: Meeting Link — full width */}
            {/* <View className="space-y-1.5">
              <Text
                as="label"
                weight="font-semibold"
                className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"
              >
                <LinkIcon size={11} className="text-primary" />
                Meeting / Consultation Link
              </Text>
              <View className="flex gap-2 w-full">
                <View className="flex-1">
                  <Input
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="e.g. https://meet.google.com/..."
                    className="pl-9 h-10 text-sm border-border focus:ring-2 focus:ring-primary/20 bg-background shadow-none font-medium text-primary w-full"
                    required
                  />
                </View>
                <Button
                  variant="outline"
                  // onPress={generateMeetingLink}
                  loading={isGeneratingLink}
                  disabled={isGeneratingLink}
                  className="h-10 px-4 text-xs font-bold shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                >
                  Generate Link
                </Button>
              </View>
              {!meetingLink && (
                <Text className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                  ⚠️ Link is required to confirm appointment
                </Text>
              )}
            </View> */}

            {/* WhatsApp Preview */}
            {/* <View className="space-y-2">
              <Text
                as="label"
                weight="font-semibold"
                className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5"
              >
                <MessageSquare size={11} className="text-green-600" />
                WhatsApp Notification Preview
              </Text>
              <View className="p-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat rounded-xl border border-border">
                <View className="max-w-[85%] bg-white dark:bg-[#075e54] shadow-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-3 relative ml-1">
                  <View className="absolute left-[-7px] top-0 w-0 h-0 border-t-[9px] border-t-white dark:border-t-[#075e54] border-l-[9px] border-l-transparent" />
                  <Text className="text-xs text-slate-800 dark:text-white leading-relaxed">
                    {appointment
                      ? getAppointmentConfirmedMessage(
                          appointment.name,
                          appointment.doctor?.name || "Doctor",
                          appointment.appointment_datetime
                            ? dayjs(appointment.appointment_datetime).format(
                                "DD MMM YYYY",
                              )
                            : "TBA",
                          appointment.appointment_datetime
                            ? dayjs(appointment.appointment_datetime).format(
                                "hh:mm A",
                              )
                            : "TBA",
                          // meetingLink,
                        )
                      : "Please enter a meeting link to see preview..."}
                  </Text>
                  <View className="text-[9px] text-slate-400 text-right mt-1">
                    11:32 AM ✓✓
                  </View>
                </View>
              </View>
            </View> */}
          </View>

          {/* Right Column: Screenshot */}
          <View className="md:col-span-5 space-y-2">
            <Text className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
              <ExternalLink size={11} className="text-primary" />
              Payment Screenshot
            </Text>
            <Upload
              label=""
              accept="image/*"
              maxCount={1}
              onChange={(files) => setSelectedFileList(files)}
              existingFiles={
                appointment?.payment_screenshot
                  ? appointment.payment_screenshot.startsWith("http")
                    ? appointment.payment_screenshot
                    : `${BASE_URL}/${appointment.payment_screenshot}`
                  : ""
              }
              browseText="Upload Screenshot"
              className="border-none p-0"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyPaymentModal;
