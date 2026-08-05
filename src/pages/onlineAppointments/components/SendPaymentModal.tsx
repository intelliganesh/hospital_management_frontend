import React, { useState, useEffect } from "react";
import {
  getSendPaymentLinkMessage,
  getBankTransferWhatsAppMessage,
  getBankTransferDetailsPreview,
  openWhatsApp,
} from "@/utils/whatsappTemplates";
import View from "@/components/view";
import Text from "@/components/text";
import Button from "@/components/button";
import Input from "@/components/input";
import SingleSelector from "@/components/SingleSelector";
import RadioGroup from "@/components/RadioGroup";
import Modal from "@/components/Modal";
import { OnlineAppointment } from "@/types/onlineAppointment.types";
import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
import { useBankDetails } from "@/actions/calls/bankDetails";
import { useSystemSettings } from "@/actions/calls/systemSettings";
import { useSelector } from "react-redux";
import { RootState } from "@/actions/store";
import { Landmark, Info, Send, CreditCard, MessageSquare, QrCode } from "lucide-react";

interface SendPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: OnlineAppointment | null;
}

const SendPaymentModal: React.FC<SendPaymentModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const { sendPaymentLink } = useOnlineAppointments();
  const { bankDetailsDropdownHandler } = useBankDetails();
  const { getSystemSettings } = useSystemSettings();
  const bankAccounts = useSelector(
    (state: RootState) => state.bankDetails.bankDetailsDropdownData,
  );
  const systemSettings = useSelector(
    (state: RootState) => state.systemSettings?.settings
  );
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "UPI_QR",
    bankAccountId: "",
    razorpayLink: "",
    appointment_type: "ONLINE",
    currency: "INR",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "AED": return "AED ";
      default: return "₹";
    }
  };

  const systemQrCode = systemSettings?.qr_code
    ? import.meta.env.VITE_APP_URL + systemSettings.qr_code
    : null;

  useEffect(() => {
    if (isOpen && appointment) {
      bankDetailsDropdownHandler(() => { });
      getSystemSettings();

      const isBank = appointment.payment_type === "Bank Transfer";
      const isRazorpay = (appointment.payment_info || "").includes("rzp.io") || (appointment.payment_info || "").includes("razorpay");

      setFormData((prev) => ({
        ...prev,
        amount: appointment.amount
          ? parseFloat(appointment.amount).toString()
          : "500",
        razorpayLink: isRazorpay ? (appointment.payment_info || "").replace(/\\/g, "") : "",
        paymentMethod: isBank ? "BANK" : isRazorpay ? "RAZORPAY" : "UPI_QR",
        appointment_type: appointment.appointment_type || "ONLINE",
        currency: (() => {
          const rawCurrency = appointment.currency || "";
          if (rawCurrency === "$" || rawCurrency.toUpperCase() === "USD") return "USD";
          if (rawCurrency === "₹" || rawCurrency.toUpperCase() === "INR") return "INR";
          if (rawCurrency === "€" || rawCurrency.toUpperCase() === "EUR") return "EUR";
          if (rawCurrency === "£" || rawCurrency.toUpperCase() === "GBP") return "GBP";
          if (rawCurrency.toUpperCase() === "AED") return "AED";
          return "INR";
        })(),
      }));

      if (appointment.appointment_datetime) {
        const dt = appointment.appointment_datetime.replace(" ", "T");
        const dateObj = new Date(dt);
        if (!isNaN(dateObj.getTime())) {
          setAppointmentDate(dt.split("T")[0]);
          const hh = String(dateObj.getHours()).padStart(2, "0");
          const mm = String(dateObj.getMinutes()).padStart(2, "0");
          setAppointmentTime(`${hh}:${mm}`);
        }
      }


    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (bankAccounts && bankAccounts.length > 0 && !formData.bankAccountId) {
      setFormData((prev) => ({ ...prev, bankAccountId: bankAccounts[0].id }));
    }
  }, [bankAccounts, formData.paymentMethod]);

  const bankOptions =
    bankAccounts?.map((bank: any) => ({
      label: `${bank.title}${bank.details ? ` (${bank.details.replace(/\n/g, " ").substring(0, 35)}...)` : ""}`,
      value: bank.id,
    })) || [];

  const selectedBank = bankAccounts?.find(
    (b: any) => b.id === formData.bankAccountId,
  );

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = () => {
    if (!appointment) return "";

    const currencySymbol = getCurrencySymbol(formData.currency);

    if (formData.paymentMethod === "UPI_QR") {
      if (!systemQrCode) {
        return "QR Code is not uploaded in system settings. Please configure it in settings to send payment details.";
      }
      return `Dear ${appointment.name}, please complete your consultation fee payment of ${currencySymbol}${formData.amount} by scanning this UPI QR code:\n${systemQrCode}\n\nReply with your transaction ID or screenshot once done.`;
    } else if (formData.paymentMethod === "RAZORPAY") {
      return getSendPaymentLinkMessage(
        appointment.name,
        formData.amount,
        formData.razorpayLink,
      );
    } else {
      if (!selectedBank) return "";
      const bankDetails = getBankTransferDetailsPreview(
        formData.amount,
        selectedBank.title,
        selectedBank.details,
        currencySymbol,
      );
      return getBankTransferWhatsAppMessage(
        appointment.name,
        formData.amount,
        bankDetails,
        currencySymbol,
      );
    }
  };

  const getWhatsAppSendMessage = () => {
    if (!appointment) return "";

    const currencySymbol = getCurrencySymbol(formData.currency);

    if (formData.paymentMethod === "UPI_QR") {
      if (!systemQrCode) return "";
      return `Dear ${appointment.name}, please complete your consultation fee payment of ${currencySymbol}${formData.amount} by scanning this UPI QR code:\n${systemQrCode}\n\nReply with your transaction ID or screenshot once done.`;
    } else if (formData.paymentMethod === "RAZORPAY") {
      return getSendPaymentLinkMessage(
        appointment.name,
        formData.amount,
        formData.razorpayLink,
      );
    } else {
      if (!selectedBank) return "";
      const bankDetails = getBankTransferDetailsPreview(
        formData.amount,
        selectedBank.title,
        selectedBank.details,
        currencySymbol,
      );
      return getBankTransferWhatsAppMessage(
        appointment.name,
        formData.amount,
        bankDetails,
        currencySymbol,
      );
    }
  };

  const handleCopyDetails = () => {
    if (!selectedBank) return;
    const currencySymbol = getCurrencySymbol(formData.currency);
    const details = getBankTransferDetailsPreview(
      formData.amount,
      selectedBank.title,
      selectedBank.details,
      currencySymbol,
    );
    navigator.clipboard.writeText(details).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
    console.log("Bank details copied to clipboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    if (formData.paymentMethod === "RAZORPAY" && !formData.razorpayLink) return;
    if (formData.paymentMethod === "BANK" && !formData.bankAccountId) return;
    if (formData.paymentMethod === "UPI_QR" && !systemQrCode) return;

    setIsSubmitting(true);

    const bankInfoString = selectedBank
      ? `${selectedBank.title}: ${selectedBank.details}`
      : "";

    const paymentInfoVal =
      formData.paymentMethod === "BANK"
        ? bankInfoString
        : formData.paymentMethod === "UPI_QR"
          ? systemQrCode
          : formData.razorpayLink;

    await sendPaymentLink(
      appointment.id,
      formData.amount,
      formData.paymentMethod === "BANK" ? "Bank Transfer" : "link",
      formData.paymentMethod === "BANK" ? formData.bankAccountId : undefined,
      paymentInfoVal,
      (success) => {
        if (success) {
          const message = getWhatsAppSendMessage();
          openWhatsApp(appointment.phone, message);
          onClose();
        }
        setIsSubmitting(false);
      },
      {
        appointment_type: formData.appointment_type,
        currency: getCurrencySymbol(formData.currency),
        appointment_datetime: `${appointmentDate} ${appointmentTime}:00`,
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Payment Options"
      description="Select the preferred payment method to notify the patient."
      size="xl"
      closeOnOutsideClick={false}
      closeOnEsc={false}
      footer={
        <View className="flex justify-between items-center w-full">
          <Button variant="outline" onPress={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <View className="flex flex-col items-end gap-1">
            {/* ✅ Show copied confirmation */}
            {copied && (
              <Text className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                ✅ Bank details copied to clipboard!
              </Text>
            )}
            <Button
              onPress={handleSubmit}
              loading={isSubmitting}
              className="gap-2 flex flex-row items-center bg-green-600 hover:bg-green-700 border-none text-white font-bold h-11 px-6 shadow-md"
              disabled={
                formData.paymentMethod === "UPI_QR"
                  ? !systemQrCode
                  : formData.paymentMethod === "RAZORPAY"
                    ? !formData.razorpayLink
                    : !formData.bankAccountId
              }
            >
              <Send size={18} />
              Send via WhatsApp
            </Button>
          </View>
        </View>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Summary Header */}
        <View className="p-5 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/50 flex justify-between items-center shadow-sm">
          <View className="flex gap-4 items-center">
            <View className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary-600 shadow-sm">
              <Info size={28} />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Fee Payment
              </Text>
              <Text className="text-xl font-black text-slate-900 dark:text-white leading-none">
                {appointment?.name}
              </Text>
              <View className="flex flex-row items-center gap-2 mt-2">
                {/* <Text className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700">#{appointment?.id}</Text> */}
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 italic">
                  Mob:{" "}
                  <span className="text-primary-600 dark:text-primary-400 font-mono">
                    {appointment?.phone}
                  </span>
                </Text>
              </View>
            </View>
          </View>
          <View className="text-right">
            <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Visit Type
            </Text>
            <Text className="text-base font-black text-primary-700 dark:text-primary-400">
              {appointment?.visit_type || appointment?.visti_type || "N/A"}
            </Text>
          </View>
        </View>

        {/* Edit Appointment Date & Time */}
        <View className="flex flex-col md:flex-row gap-6">
          <View className="flex-1 space-y-2">
            <Text
              as="label"
              weight="font-semibold"
              className="text-[11px] uppercase text-muted-foreground ml-1"
            >
              Appointment Date
            </Text>

            <Input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="h-12 w-full border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-slate-900 shadow-sm text-sm font-bold"
            />
          </View>

          <View className="flex-1 space-y-2">
            <Text
              as="label"
              weight="font-semibold"
              className="text-[11px] uppercase text-muted-foreground ml-1"
            >
              Appointment Time
            </Text>

            <Input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
              className="h-12 w-full border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-slate-900 shadow-sm text-sm font-bold"
            />
          </View>
        </View>

        <View className="space-y-6">
          <View className="space-y-3">
            <Text
              as="label"
              weight="font-semibold"
              className="text-[11px] uppercase text-muted-foreground ml-1 flex  items-center gap-2"
            >
              <CreditCard size={12} className="text-primary-600" /> Select
              Payment Method
            </Text>
            <RadioGroup
              label=""
              name="paymentMethod"
              variant="card"
              value={formData.paymentMethod}
              onChange={(val) => handleInputChange("paymentMethod", val)}
              options={[
                {
                  value: "UPI_QR",
                  label: "UPI QR Code",
                  description: "Show clinic UPI QR scanner",
                },
                {
                  value: "RAZORPAY",
                  label: "Razorpay Link",
                  description: "Share dynamic payment link",
                },
                {
                  value: "BANK",
                  label: "Bank Transfer",
                  description: "Share clinic bank details",
                },
              ]}
            />
          </View>

          <View className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Appointment Type */}
            <View className="md:col-span-4 space-y-2">
              <Text
                as="label"
                weight="font-semibold"
                className="text-[11px] uppercase text-muted-foreground ml-1 flex items-center gap-2"
              >
                Appointment Type
              </Text>
              <SingleSelector
                options={[
                  { label: "Online", value: "ONLINE" },
                  { label: "Offline", value: "OFFLINE" },
                ]}
                value={formData.appointment_type}
                onChange={(val) => handleInputChange("appointment_type", val)}
                required
                className="h-12 shadow-sm"
              />
            </View>

            {/* Currency */}
            <View className="md:col-span-4 space-y-2">
              <Text
                as="label"
                weight="font-semibold"
                className="text-[11px] uppercase text-muted-foreground ml-1 flex items-center gap-2"
              >
                Currency
              </Text>
              <SingleSelector
                options={[
                  { label: "INR (₹)", value: "INR" },
                  { label: "USD ($)", value: "USD" },
                  { label: "EUR (€)", value: "EUR" },
                  { label: "GBP (£)", value: "GBP" },
                  { label: "AED (AED)", value: "AED" },
                ]}
                value={formData.currency}
                onChange={(val) => handleInputChange("currency", val)}
                required
                className="h-12 shadow-sm"
              />
            </View>

            {/* Amount */}
            <View className="md:col-span-4 space-y-2">
              <Text
                as="label"
                weight="font-semibold"
                className="text-[11px] uppercase text-muted-foreground ml-1 flex items-center gap-2"
              >
                Amount ({formData.currency})
              </Text>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
                placeholder="500"
                className="h-12 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-slate-900 shadow-sm transition-all text-sm font-bold text-primary-700 dark:text-primary-400"
              />
            </View>
          </View>

          {/* Dynamic Payment Method Details */}
          {formData.paymentMethod !== "UPI_QR" && (
            <View className="space-y-2">
              {formData.paymentMethod === "RAZORPAY" ? (
                <>
                  <Text
                    as="label"
                    weight="font-semibold"
                    className="text-[11px] uppercase text-muted-foreground ml-1 flex items-center gap-2"
                  >
                    Razorpay Payment Link
                  </Text>
                  <Input
                    value={formData.razorpayLink}
                    onChange={(e) =>
                      handleInputChange("razorpayLink", e.target.value)
                    }
                    placeholder="e.g. https://rzp.io/rzp/demo123"
                    required
                    className="h-12 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-slate-900 shadow-sm transition-all text-sm font-bold text-slate-800 dark:text-white"
                  />
                </>
              ) : (
                <>
                  <Text
                    as="label"
                    weight="font-semibold"
                    className="text-[11px] uppercase text-muted-foreground ml-1 flex  items-center gap-2"
                  >
                    Receiving Bank Account
                  </Text>
                  <SingleSelector
                    options={bankOptions}
                    value={formData.bankAccountId}
                    onChange={(val) => handleInputChange("bankAccountId", val)}
                    required
                    className="h-12 shadow-sm"
                  />
                </>
              )}
            </View>
          )}

          {formData.paymentMethod === "UPI_QR" && (
            <View className="space-y-4">
              <View className="flex justify-between items-center">
                <Text
                  as="label"
                  weight="font-semibold"
                  className="text-[11px] uppercase text-muted-foreground ml-1 flex items-center gap-2"
                >
                  <QrCode size={12} className="text-primary-600" /> UPI QR Code Preview
                </Text>
              </View>

              <View className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                {systemQrCode ? (
                  <View className="bg-white p-4 rounded-xl shadow-md border-2 border-emerald-500 flex flex-col items-center justify-center">
                    <img
                      src={systemQrCode}
                      alt="Uploaded Clinic QR Code"
                      className="w-40 h-40 object-contain"
                    />

                    <Text className="text-[18px] font-extrabold text-emerald-600 mt-2 leading-none">
                      {getCurrencySymbol(formData.currency)}{formData.amount || "0.00"}
                    </Text>
                  </View>
                ) : (
                  <View className="flex flex-col items-center justify-center p-4 text-center">
                    <Text className="text-sm font-semibold text-red-500">
                      QR Code is not uploaded in system settings.
                    </Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Please upload the QR Code in System Settings to use this payment method.
                    </Text>
                  </View>
                )}
                {systemQrCode && (
                  <Text className="text-[10px] text-slate-400 mt-3 text-center italic max-w-[80%]">
                    clinic's uploaded QR code image.
                  </Text>
                )}
              </View>
            </View>
          )}

          {formData.paymentMethod === "BANK" && selectedBank && (
            <>
              <View className="flex space-x-4">
                <Text
                  as="label"
                  weight="font-semibold"
                  className="text-[11px] uppercase text-muted-foreground ml-1 flex  items-center gap-2"
                >
                  <View className="flex flex-row items-center gap-2">
                    <Landmark size={12} className="text-primary-600" /> Bank
                    Transfer Preview
                  </View>
                </Text>
                <Button
                  variant="ghost"
                  size="small"
                  className="h-6 px-2 text-[9px] font-black uppercase text-primary-600 hover:bg-primary-50 gap-1 flex items-center"
                  onPress={handleCopyDetails}
                >
                  Copy Details
                </Button>
              </View>
              <View className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-1 duration-300 shadow-inner">
                <View className="flex flex-row items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <View className="h-10 w-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm border border-slate-100 dark:border-slate-600">
                    <Landmark size={20} />
                  </View>
                  <View>
                    <Text className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
                      Bank Name
                    </Text>
                    <Text className="text-base font-extrabold text-slate-900 dark:text-white">
                      {selectedBank.title}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2">
                  <Text className="text-[9px] font-black text-slate-400 uppercase leading-none">
                    Bank Details
                  </Text>
                  <View className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    {selectedBank.details ? (
                      selectedBank.details
                        .split("\n")
                        .map((line: string, idx: number) => (
                          <Text
                            key={idx}
                            className="text-sm font-semibold text-slate-800 dark:text-slate-200 block"
                          >
                            {line}
                          </Text>
                        ))
                    ) : (
                      <Text className="text-sm font-semibold text-slate-400 italic">
                        No details provided
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}

          {/* WhatsApp Bubble Preview */}
          <View className="space-y-3">
            <Text
              as="label"
              weight="font-semibold"
              className="text-[11px] uppercase text-muted-foreground ml-1 flex  items-center gap-2"
            >
              <MessageSquare size={12} className="text-green-600" /> WhatsApp
              Notification Preview
            </Text>
            <View className="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
              <View className="max-w-[85%] bg-white dark:bg-[#075e54] shadow-md rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-3 relative ml-2">
                <View className="absolute left-[-8px] top-0 w-0 h-0 border-t-[10px] border-t-white dark:border-t-[#075e54] border-l-[10px] border-l-transparent" />
                <View className="text-xs text-slate-800 dark:text-white leading-relaxed font-medium">
                  {generateWhatsAppMessage() ? (
                    generateWhatsAppMessage()
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <View key={idx} className={line.trim() === "" ? "h-2" : ""}>
                          {line}
                        </View>
                      ))
                  ) : (
                    "Select a payment method to see preview..."
                  )}
                </View>
                <View className="text-[9px] text-slate-400 text-right mt-1">
                  10:45 AM ✓✓
                </View>
              </View>
            </View>
          </View>
        </View>
      </form>
    </Modal>
  );
};

export default SendPaymentModal;
