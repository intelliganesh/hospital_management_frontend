import React from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import { 
  Printer, 
  Download, 
  Share2, 
  ArrowLeft
} from "lucide-react";
import Button from "@/components/button";
import { useNavigate } from "react-router-dom";
import DynamicTable from "@/components/ui/DynamicTable";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import { FileDown } from "lucide-react";
import BouncingLoader from "@/components/BouncingLoader";

const IpdBillViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } = useDownloadIpdPdf();

  const handleDownload = () => {
    if (id) {
      fetchAndDownloadPdf(
        id,
        IPD_GENERATE_PDF_URL,
        "discharge_summary",
        () => {}
      );
    }
  };

  const handleGeneratePdf = () => {
    if (id) {
      fetchAndDownloadPdf(
        id,
        IPD_GENERATE_PDF_URL,
        "discharge_summary",
        () => {}
      );
    }
  };

  // Mock Data
  const billData = {
    billNo: "IPD-2026-0001",
    billDate: "05 Feb 2026",
    mrNo: "MR-2024-001",
    patientName: "Rahul Sharma",
    ageGender: "45 / Male",
    doctor: "Dr. Rajesh Kumar",
    anaesthetist: "Dr. Anil Mehta",
    admissionDate: "02 Feb 2026 10:30",
    dischargeDate: "Not Discharged",
    wardRoom: "Private Room - 301",
    diagnosis: "Appendicitis - Post Surgery"
  };

  const chargesSummary = [
    { particulars: "Registration", rate: 500, daysCount: 1, amount: 500 },
    { particulars: "Ward", rate: 9000, daysCount: 1, amount: 9000 },
    { particulars: "Nursing", rate: 2400, daysCount: 1, amount: 2400 },
    { particulars: "OT", rate: 15000, daysCount: 1, amount: 15000 },
    { particulars: "Anaesthetist", rate: 5000, daysCount: 1, amount: 5000 },
    { particulars: "Professional", rate: 2000, daysCount: 1, amount: 2000 },
    { particulars: "Pharmacy", rate: 2500, daysCount: 1, amount: 2500 },
    { particulars: "Lab", rate: 1800, daysCount: 1, amount: 1800 }
  ];

  const subTotal = 38200;
  const advancePaid = 20000;
  const amountReceived = 0;
  const balanceDue = 18200;

  const receipts = [
    { receiptNo: "RCP-2026-0001", date: "02 Feb 2026", type: "Advance", mode: "Cash", amount: 20000 }
  ];

  return (
    <View className="mx-auto space-y-6 pb-20 pt-4">
      {/* Top Actions */}
      <View className="flex flex-row justify-between items-center print:hidden">
        <Button variant="ghost" size="small" onPress={() => navigate(-1)} className="flex items-center gap-2 text-slate-600">
          <ArrowLeft size={16} /> <Text weight="font-medium" className="text-sm">Back</Text>
        </Button>
        <View className="flex flex-row gap-3">
          <Button 
            variant="outline" 
            size="small" 
            className="flex items-center gap-2 border-slate-200 text-slate-700"
            onPress={handleGeneratePdf}
            disabled={isPdfDownloading}
          >
            {isPdfDownloading ? <BouncingLoader isLoading={isPdfDownloading} /> : <FileDown size={16} />} Generate PDF
          </Button>
          <Button variant="outline" size="small" className="flex items-center gap-2 border-slate-200 text-slate-700">
            <Share2 size={16} /> WhatsApp Bill
          </Button>
          <Button variant="outline" size="small" className="flex items-center gap-2 border-slate-200 text-slate-700" onPress={() => window.print()}>
            <Printer size={16} /> Print
          </Button>
          <Button 
            variant="primary" 
            size="small" 
            className="bg-[#2a9d8f] hover:bg-[#21867a] border-none flex items-center gap-2 text-white"
            onPress={handleDownload}
            disabled={isPdfDownloading}
          >
            {isPdfDownloading ? <BouncingLoader isLoading={isPdfDownloading} /> : <Download size={16} />} Download PDF
          </Button>
        </View>
      </View>

      {/* Bill Document */}
      <Card className="max-w-4xl mx-auto bg-white dark:bg-card p-12 space-y-10 shadow-lg border-slate-100 dark:border-slate-800 print:shadow-none print:border-0 rounded-xl">
        {/* Hospital Header */}
        <View className="text-center space-y-2">
          {/* <Text weight="font-bold" className="text-3xl text-[#2a9d8f] tracking-tight">City General Hospital</Text>
          <Text className="text-slate-500 text-sm max-w-md mx-auto">123 Healthcare Avenue, Medical District</Text>
          <Text className="text-slate-500 text-sm">Phone: 1800-123-4567 | Email: billing@cityhospital.com</Text> */}
          <View className="mt-4">
            <Text as="h2" weight="font-bold" className="!text-lg inline-block px-4 py-1 bg-[#2a9d8f]/10 text-[#2a9d8f] font-bold rounded-md uppercase tracking-widest border border-[#2a9d8f]/20">Final IPD Bill</Text>
          </View>
        </View>

        {/* Bill Meta */}
        <View className="flex flex-row justify-between items-end border-b border-dashed border-slate-200 pb-4">
          <View className="space-y-1">
            <View className="flex flex-row gap-2"><Text className="text-slate-400 text-sm">Bill No:</Text><Text weight="font-bold" className="text-sm">{billData.billNo}</Text></View>
            <View className="flex flex-row gap-2"><Text className="text-slate-400 text-sm">Bill Date:</Text><Text weight="font-bold" className="text-sm">{billData.billDate}</Text></View>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <Text className="text-slate-400 text-sm">MR No:</Text>
            <Text weight="font-bold">{billData.mrNo}</Text>
          </View>
        </View>

        {/* Patient Details Boxed Area */}
        <Card className="bg-primary-10 p-6 border-primary-200 space-y-6 dark:bg-slate-700 dark:border-slate-800">
          <Text weight="font-bold" className="text-slate-700 dark:text-white text-md border-b border-slate-200 pb-2">Patient Details</Text>
          <View className="grid grid-cols-2 gap-x-12 gap-y-4">
            <View className="space-y-3">
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Patient Name:</Text><Text weight="font-bold" className="text-xs">{billData.patientName}</Text></View>
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Age/Gender:</Text><Text weight="font-bold" className="text-xs">{billData.ageGender}</Text></View>
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Doctor:</Text><Text weight="font-bold" className="text-xs">{billData.doctor}</Text></View>
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Anaesthetist:</Text><Text weight="font-bold" className="text-xs">{billData.anaesthetist}</Text></View>
            </View>
            <View className="space-y-3">
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Admission:</Text><Text weight="font-bold" className="text-xs">{billData.admissionDate}</Text></View>
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Discharge:</Text><Text weight="font-bold" className="text-xs">{billData.dischargeDate}</Text></View>
              <View className="flex justify-between items-center"><Text className="text-slate-400 text-xs text-nowrap">Ward/Room:</Text><Text weight="font-bold" className="text-xs">{billData.wardRoom}</Text></View>
              <View className="flex justify-between items-center text-right"><Text className="text-slate-400 text-xs text-nowrap">Diagnosis:</Text><Text weight="font-bold" className="text-xs">{billData.diagnosis}</Text></View>
            </View>
          </View>
        </Card>

        {/* Charges Summary Table */}
        <View className="space-y-4">
          <Text weight="font-bold" className="text-slate-700 dark:text-white text-md border-b border-slate-200 pb-2">Charges Summary</Text>
          <DynamicTable
            tableHeaders={["Particulars", "Rate/Day (₹)", "Days Count", "Amount (₹)"]}
            tableData={[
              ...chargesSummary.map(c => [c.particulars, c.rate, c.daysCount, <View className="text-right">{c.amount.toLocaleString()}</View>]),
              [<Text weight="font-bold">Sub Total</Text>, "", "", <Text weight="font-bold" className="text-right">{subTotal.toLocaleString()}</Text>]
            ]}
          />
          <View className="p-4 bg-slate-50 dark:bg-slate-700 flex flex-row justify-between items-center rounded-lg">
            <Text weight="font-bold" className="text-slate-700 dark:text-white">Total Amount</Text>
            <Text weight="font-bold" className="text-xl">₹{subTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Summary Box */}
        <Card className="bg-slate-50/30 dark:bg-background p-6 border-slate-100 space-y-4">
          <Text weight="font-bold" className="text-slate-700 dark:text-white text-md">Payment Summary</Text>
          <View className="space-y-2">
            <View className="flex justify-between items-center text-sm"><Text className="text-slate-500">Total Amount</Text><Text weight="font-medium">₹{subTotal.toLocaleString()}</Text></View>
            <View className="flex justify-between items-center text-sm"><Text className="text-slate-500">Net Bill Amount R/O</Text><Text weight="font-medium">₹{subTotal.toLocaleString()}</Text></View>
            <View className="flex justify-between items-center text-sm"><Text className="text-[#2a9d8f]">Less: Advance Paid</Text><Text weight="font-medium" className="text-[#2a9d8f]">₹{advancePaid.toLocaleString()}</Text></View>
            <View className="flex justify-between items-center text-sm"><Text className="text-[#2a9d8f]">Less: Amount Received</Text><Text weight="font-medium" className="text-[#2a9d8f]">₹{amountReceived.toLocaleString()}</Text></View>
            <Separator className="my-2" />
            <View className="flex justify-between items-center"><Text weight="font-bold" className="text-slate-800 dark:text-white">Balance</Text><Text weight="font-bold" className="text-xl text-[#e76f51]">₹{balanceDue.toLocaleString()}</Text></View>
          </View>
        </Card>

        {/* Receipt Details Table */}
        <View className="space-y-4">
          <Text weight="font-bold" className="text-slate-700 dark:text-white text-md border-b border-slate-200 pb-2">Receipt Details</Text>
          <DynamicTable
            tableHeaders={["Receipt No", "Date", "Type", "Mode", "Amount (₹)"]}
            tableData={receipts.map(r => [
              r.receiptNo,
              r.date,
              r.type,
              r.mode,
              <View className="">{r.amount.toLocaleString()}</View>
            ])}
          />
        </View>

        {/* Footer */}
        <View className="pt-20 text-center space-y-4">
          <Text className="text-[10px] text-slate-400 uppercase tracking-tighter">This is a computer-generated bill. No signature required.</Text>
          <Text className="text-xs text-slate-500">Thank you for choosing City General Hospital. Get well soon!</Text>
        </View>
      </Card>
    </View>
  );
};

export default IpdBillViewPage;
