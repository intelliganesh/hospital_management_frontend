// import React from "react";
// import View from "@/components/view";
// import Text from "@/components/text";
// import Input from "@/components/input";
// import Textarea from "@/components/Textarea";
// import { Card } from "@/components/ui/card";
// import useForm from "@/utils/custom-hooks/use-form";

// interface SurgeryReportData {
//   surgeryDate?: string;
//   surgeryTime?: string;
//   surgeryDuration?: string;
//   procedurePerformed?: string;
//   surgeonName?: string;
//   assistantSurgeon?: string;
//   anesthetist?: string;
//   anesthesiaType?: string;
//   findings?: string;
//   procedureDetails?: string;
//   complications?: string;
//   specimens?: string;
//   bloodLoss?: string;
//   transfusion?: string;
//   postOpInstructions?: string;
//   condition?: string;
// }

// const SurgeryReport: React.FC = () => {
//   const { values, handleChange } = useForm<SurgeryReportData>({
//     surgeryDate: new Date().toISOString().split('T')[0],
//     surgeryTime: new Date().toTimeString().slice(0, 5)
//   });

//   return (
//     <View className="space-y-6">
//       {/* Surgery Details */}
//       <Card className="p-6">
//         <Text as="h3" className="font-semibold text-lg mb-4">
//           Surgery Details
//         </Text>
        
//         <View className="space-y-4">
//           <View className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Input
//               id="surgeryDate"
//               name="surgeryDate"
//               label="Surgery Date"
//               type="date"
//               value={values?.surgeryDate || ""}
//               onChange={handleChange}
//             />
//             <Input
//               id="surgeryTime"
//               name="surgeryTime"
//               label="Surgery Time"
//               type="time"
//               value={values?.surgeryTime || ""}
//               onChange={handleChange}
//             />
//             <Input
//               id="surgeryDuration"
//               name="surgeryDuration"
//               label="Duration (minutes)"
//               type="number"
//               value={values?.surgeryDuration || ""}
//               onChange={handleChange}
//               placeholder="e.g., 120"
//             />
//           </View>

//           <Input
//             id="procedurePerformed"
//             name="procedurePerformed"
//             label="Procedure Performed"
//             value={values?.procedurePerformed || ""}
//             onChange={handleChange}
//             placeholder="Enter procedure name"
//           />
//         </View>
//       </Card>

//       {/* Medical Team */}
//       <Card className="p-6">
//         <Text as="h3" className="font-semibold text-lg mb-4">
//           Medical Team
//         </Text>
        
//         <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             id="surgeonName"
//             name="surgeonName"
//             label="Primary Surgeon"
//             value={values?.surgeonName || ""}
//             onChange={handleChange}
//             placeholder="Enter surgeon name"
//           />
//           <Input
//             id="assistantSurgeon"
//             name="assistantSurgeon"
//             label="Assistant Surgeon"
//             value={values?.assistantSurgeon || ""}
//             onChange={handleChange}
//             placeholder="Enter assistant surgeon name"
//           />
//           <Input
//             id="anesthetist"
//             name="anesthetist"
//             label="Anesthetist"
//             value={values?.anesthetist || ""}
//             onChange={handleChange}
//             placeholder="Enter anesthetist name"
//           />
//           <Input
//             id="anesthesiaType"
//             name="anesthesiaType"
//             label="Type of Anesthesia"
//             value={values?.anesthesiaType || ""}
//             onChange={handleChange}
//             placeholder="General / Regional / Local"
//           />
//         </View>
//       </Card>

//       {/* Operative Findings */}
//       <Card className="p-6">
//         <Text as="h3" className="font-semibold text-lg mb-4">
//           Operative Findings & Procedure
//         </Text>
        
//         <View className="space-y-4">
//           <Textarea
//             id="findings"
//             name="findings"
//             label="Operative Findings"
//             value={values?.findings || ""}
//             onChange={handleChange}
//             placeholder="Describe operative findings..."
//             rows={4}
//           />

//           <Textarea
//             id="procedureDetails"
//             name="procedureDetails"
//             label="Procedure Details"
//             value={values?.procedureDetails || ""}
//             onChange={handleChange}
//             placeholder="Describe the procedure in detail..."
//             rows={5}
//           />

//           <Textarea
//             id="complications"
//             name="complications"
//             label="Complications (if any)"
//             value={values?.complications || ""}
//             onChange={handleChange}
//             placeholder="Describe any complications..."
//             rows={3}
//           />

//           <Input
//             id="specimens"
//             name="specimens"
//             label="Specimens Sent"
//             value={values?.specimens || ""}
//             onChange={handleChange}
//             placeholder="List specimens sent for analysis"
//           />
//         </View>
//       </Card>

//       {/* Blood Loss & Transfusion */}
//       <Card className="p-6">
//         <Text as="h3" className="font-semibold text-lg mb-4">
//           Blood Loss & Transfusion
//         </Text>
        
//         <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             id="bloodLoss"
//             name="bloodLoss"
//             label="Estimated Blood Loss (ml)"
//             type="number"
//             value={values?.bloodLoss || ""}
//             onChange={handleChange}
//             placeholder="e.g., 200"
//           />
//           <Input
//             id="transfusion"
//             name="transfusion"
//             label="Blood Transfusion"
//             value={values?.transfusion || ""}
//             onChange={handleChange}
//             placeholder="Units / Type (if any)"
//           />
//         </View>
//       </Card>

//       {/* Post-Operative */}
//       <Card className="p-6">
//         <Text as="h3" className="font-semibold text-lg mb-4">
//           Post-Operative Care
//         </Text>
        
//         <View className="space-y-4">
//           <Textarea
//             id="postOpInstructions"
//             name="postOpInstructions"
//             label="Post-Operative Instructions"
//             value={values?.postOpInstructions || ""}
//             onChange={handleChange}
//             placeholder="Enter post-operative care instructions..."
//             rows={4}
//           />

//           <Input
//             id="condition"
//             name="condition"
//             label="Patient Condition"
//             value={values?.condition || ""}
//             onChange={handleChange}
//             placeholder="Stable / Critical / etc."
//           />
//         </View>
//       </Card>
//     </View>
//   );
// };

// export default SurgeryReport;
