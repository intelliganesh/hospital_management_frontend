/**
 * Generates a WhatsApp message for sending a UPI/Razorpay payment link.
 * ✅ Safe to send via wa.me URL
 */
export const getSendPaymentLinkMessage = (
  name: string,
  amount: string,
  link: string,
) => {
  return `Dear ${name}, please complete your consultation fee payment of ₹${amount} using this link: ${link}. Reply with your transaction ID or screenshot once done.`;
};

/**
 * Generates a GENERIC WhatsApp message for bank transfer.
 * ✅ Safe to send via wa.me URL
 */
export const getBankTransferWhatsAppMessage = (
  name: string,
  amount: string,
  bankDetails: string,
  currencySymbol: string = "₹",
) => {
  return `Dear ${name}, your consultation fee of ${currencySymbol}${amount} is due. Please complete the payment using the following bank details:\n\n${bankDetails}`;
};

/**
 * Generates full bank details message.
 * Formats bank name, full details line by line, and amount due.
 */
export const getBankTransferDetailsPreview = (
  amount: string,
  bankTitle: string,
  bankDetails: string,
  currencySymbol: string = "₹",
) => {
  const formattedDetails = bankDetails
    ? bankDetails
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n")
    : "";

  return `🏦 *CLINIC BANK DETAILS*\n--------------------------\n*Bank Name:* ${bankTitle}${formattedDetails ? `\n${formattedDetails}` : ""}\n*Amount Due:* ${currencySymbol}${amount}\n--------------------------\n_Please share your payment screenshot once done._`;
};

/**
 * Generates a WhatsApp message for confirming an appointment.
 */
export const getAppointmentConfirmedMessage = (
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  // meetingLink: string,
) => {
  return `Dear ${patientName}, your appointment with Dr. ${doctorName} is confirmed on ${date} at ${time} IST.`;
};

/**
 * Generates a WhatsApp message for notifying a doctor about a confirmed appointment.
 */
export const getDoctorAppointmentNotification = (
  doctorName: string,
  patientName: string,
  date: string,
  time: string,
  meetingLink: string,
) => {
  return `Hello Dr. ${doctorName}, you have a confirmed online appointment with ${patientName} on ${date} at ${time} IST. Join the consultation here: ${meetingLink}`;
};

/**
 * Generates a WhatsApp message for rejecting a payment.
 */
export const getPaymentRejectedMessage = (name: string, id: string) => {
  return `Dear ${name}, your payment for appointment #${id} could not be verified. Please contact our front desk for assistance.`;
};

/**
 * Opens WhatsApp with a pre-filled message.
 * ✅ Has guard to block sensitive data from entering the URL
 */
export const openWhatsApp = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, "");

  const encodedMessage = encodeURIComponent(message);
  const cleanPhone12 = cleanPhone.startsWith("91")
    ? cleanPhone
    : `91${cleanPhone}`;

  // ✅ Use api.whatsapp.com instead of wa.me for better new number handling
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone12}&text=${encodedMessage}&type=phone_number&app_absent=0`;

  // ✅ Use window.location.href instead of window.open to avoid popup block
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};
