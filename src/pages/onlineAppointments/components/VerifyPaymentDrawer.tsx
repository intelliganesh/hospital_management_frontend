// import React, { useState, useRef, useEffect } from "react";
// import dayjs from "dayjs";
// import {
//   getAppointmentConfirmedMessage,
//   getDoctorAppointmentNotification,
//   getPaymentRejectedMessage,
//   openWhatsApp,
// } from "@/utils/whatsappTemplates";
// import View from "@/components/view";
// import Text from "@/components/text";
// import Button from "@/components/button";
// import Input from "@/components/input";
// import Sheet from "@/components/ui/Sheet";
// import { OnlineAppointment } from "@/types/onlineAppointment.types";
// import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
// import { imageUpload } from "@/actions/calls/uesImage";
// import {
//   CheckCircle,
//   CreditCard,
//   ExternalLink,
//   MessageSquare,
//   Link as LinkIcon,
//   Upload,
//   Trash2,
//   Calendar,
//   XCircle,
// } from "lucide-react";

// interface VerifyPaymentDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   appointment: OnlineAppointment | null;
// }

// const VerifyPaymentDrawer: React.FC<VerifyPaymentDrawerProps> = ({
//   isOpen,
//   onClose,
//   appointment,
// }) => {
//   const { confirmPayment, rejectPayment } = useOnlineAppointments();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [transactionId, setTransactionId] = useState("");
//   const [paymentDate, setPaymentDate] = useState("");
//   const [meetingLink, setMeetingLink] = useState("");
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rejectMode, setRejectMode] = useState(false);

//   // Base URL for images
//   const BASE_URL = import.meta.env.VITE_BASE_URL || "";

//   // Sync state when appointment changes
//   useEffect(() => {
//     if (isOpen && appointment) {
//       setTransactionId(appointment.transaction_id || "");
//       setMeetingLink(appointment.meeting_link || "");

//       // Handle payment date prefilling (remove time part if exists)
//       if (
//         appointment.payment_date &&
//         appointment.payment_date !== "0000-00-00 00:00:00"
//       ) {
//         setPaymentDate(appointment.payment_date.split(" ")[0]);
//       } else {
//         setPaymentDate(new Date().toISOString().split("T")[0]);
//       }

//       // Handle screenshot URL construction
//       if (appointment.payment_screenshot) {
//         const imgPath = appointment.payment_screenshot;
//         const fullUrl = imgPath.startsWith("http")
//           ? imgPath
//           : `${BASE_URL}/${imgPath}`;
//         setPreviewUrl(fullUrl);
//       } else {
//         setPreviewUrl(null);
//       }

//       setSelectedFile(null);
//       setRejectMode(false);
//     }
//   }, [isOpen, appointment, BASE_URL]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     if (appointment?.payment_screenshot) {
//       const imgPath = appointment.payment_screenshot;
//       setPreviewUrl(
//         imgPath.startsWith("http") ? imgPath : `${BASE_URL}/${imgPath}`,
//       );
//     } else {
//       setPreviewUrl(null);
//     }
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleVerify = async () => {
//     if (!appointment || !meetingLink) return;

//     setIsSubmitting(true);

//     // 1. Confirm Payment details
//     await confirmPayment(
//       appointment.id,
//       appointment.amount || "0",
//       appointment.payment_type === "Bank Transfer" ? "Bank Transfer" : "link",
//       transactionId,
//       paymentDate,
//       meetingLink,
//       undefined,
//       async (success: any) => {
//         if (success) {
//           // 2. Upload Screenshot if selected
//           if (selectedFile) {
//             const uploadData = {
//               id: appointment.id,
//               modal_type: "external_appointment",
//               file_name: "payment_screenshot",
//               folder_name: "payment_screenshot",
//               image: selectedFile,
//             };

//             await imageUpload(uploadData, (uploadSuccess) => {
//               if (uploadSuccess) {
//                 console.log("Screenshot uploaded successfully");
//               }
//             });
//           }

//           const appointmentDate = appointment.appointment_datetime ? dayjs(appointment.appointment_datetime).format("DD MMM YYYY") : "TBA";
//           const appointmentTime = appointment.appointment_datetime ? dayjs(appointment.appointment_datetime).format("hh:mm A") : "TBA";

//           const message = getAppointmentConfirmedMessage(
//             appointment.name,
//             appointment.doctor?.name || "Doctor",
//             appointmentDate,
//             appointmentTime,
//             meetingLink,
//           );
//           openWhatsApp(appointment.phone, message);
//           onClose();
//         }
//         setIsSubmitting(false);
//       },
//     );
//   };

//   const handleReject = async () => {
//     if (!appointment) return;

//     setIsSubmitting(true);
//     await rejectPayment(
//       appointment.id,
//       appointment.amount || "0",
//       appointment.payment_type === "Bank Transfer" ? "Bank Transfer" : "link",
//       (success) => {
//         if (success) {
//           const message = getPaymentRejectedMessage(
//             appointment.name,
//             appointment.id,
//           );
//           openWhatsApp(appointment.phone, message);
//           onClose();
//         }
//         setIsSubmitting(false);
//       },
//     );
//   };

//   return (
//     <Sheet
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Verify Payment"
//       description="Review the payment screenshot and confirm the appointment."
//       size="lg"
//       footer={
//         <View className="flex justify-between items-center w-full">
//           {!rejectMode ? (
//             <>
//               <Button
//                 variant="outline"
//                 className="text-red-500 border-red-200 hover:bg-red-50 text-xs font-black uppercase tracking-widest"
//                 onPress={() => setRejectMode(true)}
//                 disabled={isSubmitting}
//               >
//                 Reject Payment
//               </Button>
//               <View className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onPress={onClose}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onPress={handleVerify}
//                   loading={isSubmitting}
//                   className="gap-2 bg-green-600 hover:bg-green-700 border-none text-white font-bold h-11 px-6 shadow-md"
//                   disabled={!meetingLink}
//                 >
//                   <CheckCircle size={18} /> Confirm & Verify
//                 </Button>
//               </View>
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="ghost"
//                 onPress={() => setRejectMode(false)}
//                 disabled={isSubmitting}
//               >
//                 Back to Verify
//               </Button>
//               <Button
//                 onPress={handleReject}
//                 loading={isSubmitting}
//                 className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
//               >
//                 Confirm Rejection
//               </Button>
//             </>
//           )}
//         </View>
//       }
//     >
//       <View className="space-y-6 pb-6">
//         {/* Header Summary Bar */}
//         <View className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-end">
//           <View className="space-y-1">
//             <Text className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
//               Patient Name
//             </Text>
//             <Text className="text-lg font-black text-slate-900 dark:text-white leading-none">
//               {appointment?.name}
//             </Text>
//             <Text className="text-xs font-bold text-primary-600 italic">
//               ID: #{appointment?.id} • {appointment?.phone}
//             </Text>
//           </View>
//           <View className="text-right">
//             <Text className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">
//               Fee
//             </Text>
//             <Text className="text-2xl font-black text-primary-700 leading-none">
//               ₹{appointment?.amount || "0.00"}
//             </Text>
//           </View>
//         </View>

//         <View className="grid grid-cols-1 gap-8">
//           {/* Form Section */}
//           <View className="space-y-6">
//             <View className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//               <View className="space-y-2">
//                 <Text
//                   as="label"
//                   weight="font-semibold"
//                   className="text-[11px] uppercase text-muted-foreground ml-1 flex  items-center gap-2"
//                 >
//                   <CreditCard size={12} className="text-primary-600" />{" "}
//                   Transaction ID
//                 </Text>
//                 <View className="relative">
//                   <Input
//                     value={transactionId}
//                     onChange={(e) => setTransactionId(e.target.value)}
//                     placeholder="UTR / Transaction No."
//                     className="pl-10 h-12 shadow-sm text-sm"
//                   />
//                   <View className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                     <CreditCard size={18} />
//                   </View>
//                 </View>
//               </View>

//               <View className="space-y-2">
//                 <label className="text-[11px] uppercase font-black text-slate-400 tracking-widest ml-1 flex items-center gap-2">
//                   <Calendar size={12} className="text-primary-600" /> Payment
//                   Date
//                 </label>
//                 <Input
//                   type="date"
//                   value={paymentDate}
//                   onChange={(e) => setPaymentDate(e.target.value)}
//                   className="h-12 shadow-sm text-sm"
//                 />
//               </View>
//             </View>

//             <View className="space-y-2">
//               <label className="text-[11px] uppercase font-black text-slate-400 tracking-widest ml-1 flex items-center gap-2">
//                 <LinkIcon size={12} className="text-primary-600" /> Meeting /
//                 Consultation Link
//               </label>
//               <View className="relative">
//                 <Input
//                   value={meetingLink}
//                   onChange={(e) => setMeetingLink(e.target.value)}
//                   placeholder="e.g. Google Meet link"
//                   className="pl-10 h-12 shadow-sm text-sm font-bold text-primary-700"
//                   required
//                 />
//                 <View className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                   <LinkIcon size={18} />
//                 </View>
//               </View>
//               {!meetingLink && (
//                 <Text className="text-[10px] text-amber-600 font-black ml-1 uppercase tracking-tighter mt-1">
//                   ⚠️ Required to confirm appointment
//                 </Text>
//               )}
//             </View>

//             {/* Screenshot View */}
//             <View className="space-y-3">
//               <View className="flex justify-between items-center px-1">
//                 <Text className="text-[11px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-2">
//                   <ExternalLink size={14} className="text-primary-600" />{" "}
//                   Payment Screenshot
//                 </Text>
//                 {selectedFile && (
//                   <Button
//                     variant="ghost"
//                     className="h-8 p-0 text-red-500 text-[10px] gap-1 hover:bg-red-50 transition-colors uppercase font-black"
//                     onPress={removeFile}
//                   >
//                     <Trash2 size={14} /> Clear NEW
//                   </Button>
//                 )}
//               </View>

//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleFileChange}
//               />

//               {previewUrl ? (
//                 <View className="relative group rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl aspect-video bg-slate-100 dark:bg-slate-900">
//                   <img
//                     src={previewUrl}
//                     alt="Payment Screenshot"
//                     className="w-full h-full object-contain"
//                   />
//                   <View className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
//                     <Button
//                       variant="outline"
//                       className="text-white border-white hover:bg-white hover:text-black transition-all h-9 px-6 font-bold shadow-lg"
//                       onPress={() => fileInputRef.current?.click()}
//                     >
//                       <Upload size={16} className="mr-2" /> Replace Proof
//                     </Button>
//                     <a
//                       href={previewUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs text-white underline font-bold tracking-wide hover:text-primary-300 transition-colors"
//                     >
//                       Open Full Size
//                     </a>
//                   </View>
//                   {selectedFile && (
//                     <View className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full shadow-lg">
//                       NEW PREVIEW
//                     </View>
//                   )}
//                 </View>
//               ) : (
//                 <View
//                   className="aspect-video w-full bg-slate-50 dark:bg-slate-800/20 rounded-3xl flex flex-col items-center justify-center border-4 border-dashed border-slate-200 dark:border-slate-700/50 space-y-3 hover:bg-slate-100 transition-all cursor-pointer group shadow-inner"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Upload
//                     size={32}
//                     className="text-slate-300 group-hover:text-primary-500 transition-colors"
//                   />
//                   <Text className="text-slate-400 font-black text-[10px] uppercase tracking-widest text-center">
//                     No payment screenshot available.
//                     <br />
//                     Click to upload manually.
//                   </Text>
//                 </View>
//               )}
//             </View>

//             {/* WhatsApp Bubble Preview */}
//             <View className="space-y-3">
//               <label className="text-[11px] uppercase font-black text-slate-400 tracking-widest ml-1 flex items-center gap-2">
//                 <MessageSquare size={12} className="text-green-600" /> WhatsApp
//                 Notification Preview
//               </label>
//               <View className="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
//                 <View className="max-w-[90%] bg-white dark:bg-[#075e54] shadow-md rounded-tr-xl rounded-bl-xl rounded-br-xl p-3 relative ml-2">
//                   <View className="absolute left-[-8px] top-0 w-0 h-0 border-t-[10px] border-t-white dark:border-t-[#075e54] border-l-[10px] border-l-transparent" />
//                   <Text className="text-xs text-slate-800 dark:text-white leading-relaxed">
//                     {!rejectMode
//                       ? appointment && meetingLink
//                         ? getAppointmentConfirmedMessage(
//                             appointment.name,
//                             appointment.doctor?.name || "Doctor",
//                             appointment.appointment_datetime ? dayjs(appointment.appointment_datetime).format("DD MMM YYYY") : "TBA",
//                             appointment.appointment_datetime ? dayjs(appointment.appointment_datetime).format("hh:mm A") : "TBA",
//                             meetingLink,
//                           )
//                         : "Please enter meeting link..."
//                       : appointment
//                         ? getPaymentRejectedMessage(
//                             appointment.name,
//                             appointment.id,
//                           )
//                         : "..."}
//                   </Text>
//                   <View className="text-[9px] text-slate-400 text-right mt-1">
//                     11:32 AM ✓✓
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Sheet>
//   );
// };

// export default VerifyPaymentDrawer;
