
// import React, { useState, useEffect } from "react";

// import View from "@/components/view";
// import Text from "@/components/text";
// import Button from "@/components/button";
// import Input from "@/components/input";
// import SingleSelector from "@/components/SingleSelector";
// import { OnlineAppointment } from "@/types/onlineAppointment.types";
// import { useOnlineAppointments } from "@/actions/calls/onlineAppointments";
// import { useBankDetails } from "@/actions/calls/bankDetails";
// import { useSelector } from "react-redux";
// import { RootState } from "@/actions/store";
// import { Info, Send } from "lucide-react";
// import Sheet from "@/components/ui/Sheet";

// interface SendPaymentDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   appointment: OnlineAppointment | null;
// }

// const SendPaymentDrawer: React.FC<SendPaymentDrawerProps> = ({ 
//   isOpen, 
//   onClose, 
//   appointment 
// }) => {
//   const { sendPaymentLink } = useOnlineAppointments();
//   const { bankDetailsDropdownHandler } = useBankDetails();
//   const bankAccounts = useSelector((state: RootState) => state.bankDetails.bankDetailsDropdownData);
  
//   const [formData, setFormData] = useState<any>({
//     amount: "500", // Default amount
//     bankAccountId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       bankDetailsDropdownHandler(() => {});
//     }
//   }, [isOpen]);

//   // Pre-select first bank account if available
//   useEffect(() => {
//     if (bankAccounts && bankAccounts.length > 0 && !formData.bankAccountId) {
//         setFormData((prev: any )=> ({ ...prev, bankAccountId: bankAccounts[0].id }));
//     }
//   }, [bankAccounts]);

//   const bankOptions = bankAccounts?.map((bank: any) => ({
//     label: `${bank.bank_name} (${bank.account_number})`,
//     value: bank.id,
//   })) || [];

//   const handleInputChange = (name: string, value: any) => {
//     setFormData((prev: any) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!appointment || !formData.bankAccountId) return;

//     setIsSubmitting(true);
//     await sendPaymentLink(appointment.id, formData.amount, formData.bankAccountId);
//     setIsSubmitting(false);
//     onClose();
//   };

//   return (
//     <Sheet
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Send Payment Link"
//       description="Send a WhatsApp payment link with Bank details to the patient."
//       size="md"
//       footer={
//         <View className="flex justify-end gap-3 w-full">
//           <Button variant="outline" onPress={onClose} disabled={isSubmitting}>Cancel</Button>
//           <Button onPress={handleSubmit} loading={isSubmitting} className="gap-2">
//             <Send size={16} /> Send via WhatsApp
//           </Button>
//         </View>
//       }
//     >
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <View className="p-4 bg-primary-50 rounded-lg border border-primary-100 flex gap-3">
//             <Info size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
//             <View>
//                 <Text className="text-sm font-semibold text-primary-900">Patient: {appointment?.patientName}</Text>
//                 <Text className="text-xs text-primary-700">Phone: {appointment?.phone}</Text>
//             </View>
//         </View>

//         <View className="space-y-4">
//           <Input 
//             label="Consultation Fee (₹)" 
//             type="number"
//             value={formData.amount} 
//             onChange={(e) => handleInputChange("amount", e.target.value)}
//             required
//             placeholder="Enter amount"
//           />

//           <View className="space-y-1">
//              <SingleSelector 
//                 label="Select Receiving Bank Account"
//                 name="bankAccountId"
//                 // options={bankOptions}
//                 options={[
//                   {
//                     label: "HDFC Bank",
//                     value: "1",
//                   },
//                   {
//                     label: "ICICI Bank",
//                     value: "2",
//                   },
//                 ]}
//                 value={formData.bankAccountId}
//                 onChange={(val) => handleInputChange("bankAccountId", val)}
//                 required
//              />
//              {bankOptions.length === 0 && (
//                 <Text className="text-[10px] text-red-500 mt-1">
//                     No bank accounts found. Please add them in Bank Details Master.
//                 </Text>
//              )}
//           </View>
//         </View>

//         {formData.bankAccountId && (
//             <View className="p-4 bg-slate-50 rounded-lg border border-slate-200">
//                 <Text className="text-xs font-bold text-slate-400 uppercase mb-2">Preview WhatsApp Message</Text>
//                 <View className="text-sm text-slate-600 space-y-1 bg-white p-3 rounded border border-slate-100 italic">
//                     <Text>Hello {appointment?.patientName},</Text>
//                     <Text>To confirm your appointment with {appointment?.doctorName}, please pay ₹{formData.amount} to the following bank account:</Text>
//                     <Text className="font-bold">Account Holder: [Hospital Name]</Text>
//                     <Text className="font-bold">Bank: {bankOptions.find(b => b.value === formData.bankAccountId)?.label}</Text>
//                     <Text>After payment, please share the screenshot here.</Text>
//                 </View>
//             </View>
//         )}
//       </form>
//     </Sheet>
//   );
// };

// export default SendPaymentDrawer;
