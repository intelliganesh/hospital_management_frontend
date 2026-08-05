import React, { useEffect } from "react";
import View from "@/components/view";
import Text from "@/components/text";
import { Card } from "@/components/ui/card";
import {
  User,
  Hospital,
  Stethoscope,
  Plus,
  RotateCcw,
  CreditCard,
  ChevronLeft,
  Edit2,
  Trash2,
} from "lucide-react";
import Button from "@/components/button";
import TabView from "@/components/Tabs";
import DynamicTable from "@/components/ui/DynamicTable";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { FileDown } from "lucide-react";
import { useDownloadIpdPdf } from "@/actions/calls/ipd/downloadIpdPdf";
import { IPD_GENERATE_PDF_URL } from "@/utils/urls/backend";
import BouncingLoader from "@/components/BouncingLoader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useColors from "@/utils/custom-hooks/use-colors";
import Modal from "@/components/Modal";
import DeleteLoader from "@/components/deleteLoader";
import Input from "@/components/input";
// import { IPD_BILL_VIEW_URL } from "@/routes/urls";
import { Separator } from "@/components/ui/separator";
import SingleSelector from "@/components/SingleSelector";
import { useIpdBilling } from "@/actions/calls/ipd/billing";

const chargeCategories = [
  { name: "Registration" },
  { name: "Ward" },
  { name: "Nursing" },
  { name: "OT" },
  { name: "Anaesthetist" },
  { name: "Professional" },
  { name: "Pharmacy" },
  { name: "Lab" },
];

const chargeCategoryOptions = chargeCategories.map((category) => ({
  label: category.name,
  value: category.name,
}));

const defaultChargeCategory = chargeCategories[0]?.name || "";

const getChargeCategoryName = (category: string) =>
  chargeCategories.find(
    (option) => option.name.toLowerCase() === category?.toLowerCase(),
  )?.name ||
  category ||
  defaultChargeCategory;

const IpdBillDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getColor } = useColors();
  const {
    addIpdBillingCharges,
    getIpdBillingDetails,
    addIpdBillingPayment,
    getIpdBillingPaymentDetails,
    updateIpdBillingCharges,
    deleteIpdBillingcharges,
    IpdFinalBillingDischarge,
    cleanUp,
  } = useIpdBilling();
  const { fetchAndDownloadPdf, isLoading: isPdfDownloading } =
    useDownloadIpdPdf();
  useEffect(() => {
    if (id) {
      getIpdBillingDetails(id, () => {});
    }
    return () => {
      cleanUp();
      //  dispatch(clearIpdBillingDetailSlice());
    };
  }, []);
  const handleGeneratePdf = () => {
    if (id) {
      fetchAndDownloadPdf(
        id,
        IPD_GENERATE_PDF_URL,
        "billing_invoice",
        () => {},
      );
    }
  };

  const ipdBillingDetailsData = useSelector(
    (state: any) => state?.ipdBilling?.ipdBillingDetailData,
  );
  const rawCategories = ipdBillingDetailsData?.invoice_items || [];
  const categories = React.useMemo(() => {
    const grouped: {
      [key: string]: { service_category: string; items: any[] };
    } = {};
    rawCategories.forEach((cat: any) => {
      const key = cat.service_category?.trim().toUpperCase() || "";
      if (!grouped[key]) {
        grouped[key] = {
          service_category: cat.service_category,
          items: [],
        };
      }
      if (cat.items && Array.isArray(cat.items)) {
        grouped[key].items.push(...cat.items);
      }
    });
    return Object.values(grouped);
  }, [rawCategories]);

  // Modal States
  const [isReceivePaymentOpen, setIsReceivePaymentOpen] = React.useState(false);
  const [isDischargeOpen, setIsDischargeOpen] = React.useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = React.useState(false);
  const [editingCharge, setEditingCharge] = React.useState<{
    category: string;
    index: number;
    data: any;
  } | null>(null);
  const [deleteChargeId, setDeleteChargeId] = React.useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [isDischarging, setIsDischarging] = React.useState<boolean>(false);

  // Form States
  const [paymentForm, setPaymentForm] = React.useState({
    amount: 0,
    currency: "INR",
    date: dayjs().format("YYYY-MM-DD"),
    payment_type: "Cash",
    transaction_id: "",
    status: "Completed",
    notes: "",
  });
  const [chargeForm, setChargeForm] = React.useState({
    category: defaultChargeCategory,
    description: "",
    rate: 0,
    tax: 0,
    currency: "INR",
  });

  const loginUserDetail = useSelector(
    (state: any) => state?.authentication?.loginUserDetail,
  );
  const parsedUserDetail =
    typeof loginUserDetail === "string"
      ? JSON.parse(loginUserDetail)
      : loginUserDetail;

  const ipdBillingPaymentDetailData = useSelector(
    (state: any) => state?.ipdBilling?.ipdBillingPaymentDetailData || [],
  );

  React.useEffect(() => {
    if (id) {
      getIpdBillingPaymentDetails(id, () => {});
    }
  }, [id]);

  const handleAddChargeSubmit = () => {
    if (!id) return;
    const payload = {
      amount: Number(chargeForm.rate) || 0,
      front_desk_user_id: parsedUserDetail?.id || 1,
      service_category: chargeForm.category,
      currency: chargeForm.currency,
      description: chargeForm.description,
      tax_percent: Number(chargeForm.tax) || 0,
      service_date: dayjs().format("YYYY-MM-DD"),
    };

    if (editingCharge) {
      updateIpdBillingCharges(editingCharge.data.id, payload, (success) => {
        if (success) {
          setIsChargeModalOpen(false);
          setEditingCharge(null);
          getIpdBillingDetails(id, () => {});
        }
      });
    } else {
      addIpdBillingCharges(id, payload, (success) => {
        if (success) {
          setIsChargeModalOpen(false);
          getIpdBillingDetails(id, () => {});
        }
      });
    }
  };

  const handleReceivePaymentSubmit = () => {
    if (!id) return;
    const payload = {
      amount: Number(paymentForm.amount) || 0,
      currency: paymentForm.currency,
      date: paymentForm.date,
      payment_type: paymentForm.payment_type,
      transaction_id: paymentForm.transaction_id,
      status: paymentForm.status,
      notes: paymentForm.notes,
    };

    addIpdBillingPayment(id, payload, (success) => {
      if (success) {
        setIsReceivePaymentOpen(false);
        // Reset the form
        setPaymentForm({
          amount: 0,
          currency: "INR",
          date: dayjs().format("YYYY-MM-DD"),
          payment_type: "Cash",
          transaction_id: "",
          status: "Completed",
          notes: "",
        });
        // Reload payments and details data
        getIpdBillingPaymentDetails(id, () => {});
        getIpdBillingDetails(id, () => {});
      }
    });
  };

  const handleConfirmDischarge = () => {
    if (!id) return;

    setIsDischarging(true);
    IpdFinalBillingDischarge(
      id,
      { ipd_billing_status: "Completed" },
      (success) => {
        setIsDischarging(false);

        if (success) {
          handleGeneratePdf();
          setIsDischargeOpen(false);
          getIpdBillingDetails(id, () => {});
          getIpdBillingPaymentDetails(id, () => {});
        }
      },
    );
  };

  const handleOpenEdit = (category: string, index: number, data: any) => {
    setEditingCharge({ category, index, data });
    setChargeForm({
      category: getChargeCategoryName(category),
      description: data.description,
      rate: Number(data.amount) || 0,
      tax: Number(data.tax_percent) || 0,
      currency: data.currency || "INR",
    });
    setIsChargeModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCharge(null);
    setChargeForm({
      category: defaultChargeCategory,
      description: "",
      rate: 0,
      tax: 0,
      currency: "INR",
    });
    setIsChargeModalOpen(true);
  };

  const handleDeleteCharge = (chargeId: string) => {
    if (!id || !chargeId) return;
    setDeleteChargeId(chargeId);
  };

  const confirmDeleteCharge = () => {
    if (!id || !deleteChargeId) return;
    deleteIpdBillingcharges(
      deleteChargeId,
      (success) => {
        if (success) {
          setDeleteChargeId(null);
          getIpdBillingDetails(id, () => {});
        }
      },
      (status) => {
        setIsDeleting(status === "pending");
      },
    );
  };

  const billItemsContent = (
    <View className="space-y-8">
      {categories.map((category: any, cIndex: number) => (
        <View key={cIndex} className="space-y-3">
          <View className="flex flex-row justify-between items-center px-2">
            <Text
              as="h4"
              weight="font-semibold"
              className="text-slate-700 dark:text-muted-foreground uppercase tracking-wide border-l-4 pl-2"
              style={{ borderLeftColor: getColor(cIndex) }}
            >
              {category.service_category}
            </Text>

            {/* <View className="flex items-center gap-2">
              <Text className="text-sm font-bold text-slate-400 uppercase tracking-tighter">
                Daily Auto-Create
              </Text>
              <Switch checked />
            </View> */}
          </View>

          <Card className="overflow-hidden border-slate-100 shadow-sm">
            <DynamicTable
              tableHeaders={[
                { label: "Description", key: "" },
                { label: "Rate", key: "" },
                { label: "Tax %", key: "" },
                { label: "Amount", key: "" },
                { label: "Actions", key: "" },
              ]}
              tableData={category.items.map((item: any, index: number) => [
                <View className="flex flex-row items-center gap-3">
                  <Text className="text-sm">{item.description || "-"}</Text>
                </View>,

                <Text className="text-sm">
                  {item.currency} {item.amount}
                </Text>,

                <Text className="text-sm">{item.tax_percent}%</Text>,

                <Text weight="font-bold" className="text-sm">
                  {item.currency} {item.amount}
                </Text>,

                <View className="flex flex-row gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    className="p-1 h-8 w-8 text-slate-400 hover:text-primary"
                    onPress={() =>
                      handleOpenEdit(category.service_category, index, item)
                    }
                  >
                    <Edit2 size={14} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className="p-1 h-8 w-8 text-slate-400 hover:text-rose-500"
                    onPress={() => handleDeleteCharge(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </View>,
              ])}
            />
          </Card>
        </View>
      ))}

      <Card className="flex justify-end p-4">
        <View className="text-right">
          <Text weight="font-bold" className="text-lg">
            Subtotal
          </Text>

          <Text weight="font-bold" className="!text-3xl !text-primary">
            ₹{ipdBillingDetailsData?.summary?.total_amount}
          </Text>
        </View>
      </Card>
    </View>
  );

  const paymentsContent = (
    <Card className="overflow-hidden border-slate-100 shadow-sm">
      {ipdBillingPaymentDetailData.length > 0 ? (
        <DynamicTable
          tableHeaders={[
            { label: "Date", key: "date" },
            { label: "Transaction ID", key: "transaction_id" },
            { label: "Payment Mode", key: "payment_type" },
            { label: "Status", key: "status" },
            { label: "Notes", key: "notes" },
            { label: "Amount", key: "amount" },
          ]}
          tableData={ipdBillingPaymentDetailData.map(
            (payment: any, pIndex: number) => [
              <Text className="text-sm" key={`date-${pIndex}`}>
                {dayjs(payment.date).format("DD MMM YYYY")}
              </Text>,
              <Text className="text-sm" key={`txn-${pIndex}`}>
                {payment.transaction_id || "-"}
              </Text>,
              <Text className="text-sm" key={`mode-${pIndex}`}>
                {payment.payment_type || "-"}
              </Text>,
              <View key={`status-${pIndex}`}>
                <Text
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full border inline-block ${
                    payment.status?.toLowerCase() === "completed"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : payment.status?.toLowerCase() === "pending"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                  }`}
                >
                  {payment.status?.toUpperCase() || "COMPLETED"}
                </Text>
              </View>,
              <Text className="text-sm" key={`notes-${pIndex}`}>
                {payment.notes || "-"}
              </Text>,
              <Text
                weight="font-bold"
                className="text-sm text-primary"
                key={`amount-${pIndex}`}
              >
                {payment.currency || "INR"} {payment.amount}
              </Text>,
            ],
          )}
        />
      ) : (
        <View className="p-12 text-center text-slate-400">
          No payments made yet.
        </View>
      )}
    </Card>
  );

  const tabs = [
    { value: "bill-items", label: "Bill Items", content: billItemsContent },
    { value: "payments", label: "Payments", content: paymentsContent },
  ];

  return (
    <View className="space-y-6">
      <View className="flex flex-row items-center justify-between">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink to="/ipd/bills">IPD Bills</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bill No</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Back Header */}
        <View className="flex items-center">
          <Button
            variant="ghost"
            size="small"
            onPress={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-black"
          >
            <ChevronLeft size={16} />{" "}
            <Text weight="font-medium" className="text-sm">
              Back to Bills
            </Text>
          </Button>
        </View>
      </View>

      {/* Top Cards Grid */}
      <View className="grid grid-cols-3 gap-6">
        <Card className="p-4 space-y-4">
          <View className="flex flex-row items-center gap-2 border-b border-slate-100 pb-2">
            <User size={16} className="text-primary" />
            <Text weight="font-semibold" className="text-muted-foreground">
              Patient Information
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Name</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.patient_name}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">IPD No</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.ipd_number}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Age</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.patient_age}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Phone</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.patient_phone}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="p-4 space-y-4">
          <View className="flex flex-row items-center gap-2 border-b border-slate-100 pb-2">
            <Hospital size={16} className="text-primary" />
            <Text weight="font-semibold" className="text-muted-foreground">
              Admission Details
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Ward</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.ward_name}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Room</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.room_name}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Admitted</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.admission_date_time}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-400 text-sm">Status</Text>
              <Text className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                {ipdBillingDetailsData?.ipd?.status}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="p-4 space-y-4">
          <View className="flex flex-row items-center gap-2 border-b border-slate-100 pb-2">
            <Stethoscope size={16} className="text-primary" />
            <Text weight="font-semibold" className="text-muted-foreground">
              Medical Team
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex justify-between items-start">
              <Text className="text-slate-400 text-sm">Doctor</Text>
              <Text weight="font-bold" className="text-sm">
                {ipdBillingDetailsData?.ipd?.doctor_name}
              </Text>
            </View>
            {/* <View className="flex justify-between items-start"><Text className="text-slate-400 text-sm">Specialization</Text><Text weight="font-bold" className="text-sm">{medicalTeam.specialization}</Text></View>
            <View className="flex justify-between items-start"><Text className="text-slate-400 text-sm">Anaesthetist</Text><Text weight="font-bold" className="text-sm">{medicalTeam.anaesthetist}</Text></View>
            <View className="flex justify-between items-start gap-4"><Text className="text-slate-400 text-sm">Diagnosis</Text><Text weight="font-bold" className="text-right text-sm">{medicalTeam.diagnosis}</Text></View> */}
          </View>
        </Card>
      </View>

      {/* Financial Summary Strip */}
      <Card className="bg-primary-20 dark:bg-card p-6 border border-primary-200 dark:border-primary-500 shadow-lg flex flex-row justify-between items-center text-white">
        <View className="flex flex-row gap-12">
          <View>
            <Text
              weight="font-semibold"
              className="text-black dark:text-muted-foreground uppercase tracking-wider mb-1 text-sm"
            >
              Total Bill
            </Text>
            <Text
              weight="font-bold"
              className="!text-3xl text-black dark:text-white"
            >
              ₹{ipdBillingDetailsData?.summary?.total_amount}
            </Text>
          </View>
          <View>
            <Text
              weight="font-semibold"
              className="text-black dark:text-muted-foreground uppercase tracking-wider mb-1 text-sm"
            >
              Paid
            </Text>
            <Text weight="font-bold" className="!text-3xl text-emerald-400">
              ₹{ipdBillingDetailsData?.summary?.paid_amount}
            </Text>
          </View>
          <View>
            <Text
              weight="font-semibold"
              className="text-black dark:text-muted-foreground uppercase tracking-wider mb-1 text-sm"
            >
              Balance
            </Text>
            <Text weight="font-bold" className="!text-3xl text-amber-500">
              ₹{ipdBillingDetailsData?.summary?.balance_amount}
            </Text>
          </View>
        </View>
        <View className="flex flex-row gap-3">
          {ipdBillingDetailsData?.invoice?.ipd_billing_status ===
            "Completed" && (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-slate-200 text-slate-700"
              onPress={handleGeneratePdf}
              disabled={isPdfDownloading}
            >
              {isPdfDownloading ? (
                <BouncingLoader isLoading={isPdfDownloading} />
              ) : (
                <FileDown size={18} />
              )}{" "}
              Generate PDF
            </Button>
          )}
          {ipdBillingDetailsData?.invoice?.ipd_billing_status ===
          "Completed" ? (
            ""
          ) : (
            <Button
              variant="primary"
              className=" flex items-center gap-2"
              onPress={() => setIsReceivePaymentOpen(true)}
            >
              <CreditCard size={18} /> Receive Payment
            </Button>
          )}
          {ipdBillingDetailsData?.invoice?.ipd_billing_status ===
          "Completed" ? (
            ""
          ) : (
            <Button
              variant="secondary"
              className="bg-[#e76f51] hover:bg-[#d45d3e] border-[#e76f51] flex items-center gap-2"
              onPress={() => setIsDischargeOpen(true)}
            >
              <RotateCcw size={18} /> Discharge & Final Bill
            </Button>
          )}
        </View>
      </Card>

      {/* Tabs with Add Charge */}
      <View className="relative">
        <TabView tabs={tabs} defaultValue="bill-items" />
        <View className="absolute top-0 right-0">
          {ipdBillingDetailsData?.invoice?.ipd_billing_status ===
          "Completed" ? (
            ""
          ) : (
            <Button
              variant="primary"
              className="bg-[#2a9d8f] hover:bg-[#21867a] border-none flex items-center gap-2 px-4 py-2 text-white"
              onPress={handleOpenAdd}
            >
              <Plus size={18} /> Add Charge
            </Button>
          )}
        </View>
      </View>

      {/* MODALS */}

      {/* Receive Payment Modal */}
      <Modal
        isOpen={isReceivePaymentOpen}
        onClose={() => setIsReceivePaymentOpen(false)}
        title="Receive Payment"
        description="Record a new payment against this bill."
      >
        <View className="space-y-4">
          <View className="grid grid-cols-2 gap-4">
            <View className="space-y-2">
              <Input
                label="Amount"
                type="number"
                placeholder="0"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    amount: Number(e.target.value),
                  })
                }
                required
              />
            </View>
            <View className="space-y-2">
              <SingleSelector
                label="Currency"
                options={[
                  { label: "INR (₹)", value: "INR" },
                  { label: "USD ($)", value: "USD" },
                  { label: "EUR (€)", value: "EUR" },
                  { label: "GBP (£)", value: "GBP" },
                  { label: "AED (AED)", value: "AED" },
                ]}
                value={paymentForm.currency}
                onChange={(value) =>
                  setPaymentForm({ ...paymentForm, currency: value })
                }
                required
              />
            </View>
          </View>
          <View className="grid grid-cols-2 gap-4">
            <View className="space-y-2">
              <Input
                label="Date"
                type="date"
                value={paymentForm.date}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, date: e.target.value })
                }
                required
              />
            </View>
            <View className="space-y-2">
              <SingleSelector
                label="Payment Mode"
                options={[
                  { label: "Cash", value: "Cash" },
                  { label: "UPI", value: "UPI" },
                  { label: "Card", value: "Card" },
                  { label: "Cheque", value: "Cheque" },
                ]}
                value={paymentForm.payment_type}
                onChange={(value) =>
                  setPaymentForm({ ...paymentForm, payment_type: value })
                }
                required
              />
            </View>
          </View>
          <View className="grid grid-cols-2 gap-4">
            <View className="space-y-2">
              <Input
                label="Transaction ID (Optional)"
                placeholder="TXN12345"
                value={paymentForm.transaction_id}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    transaction_id: e.target.value,
                  })
                }
              />
            </View>
            <View className="space-y-2">
              <SingleSelector
                label="Status"
                options={[
                  { label: "Completed", value: "Completed" },
                  { label: "Pending", value: "Pending" },
                  { label: "Failed", value: "Failed" },
                ]}
                value={paymentForm.status}
                onChange={(value) =>
                  setPaymentForm({ ...paymentForm, status: value })
                }
                required
              />
            </View>
          </View>
          <View className="space-y-2">
            <Input
              label="Notes (Optional)"
              placeholder="e.g. Advance payment"
              value={paymentForm.notes}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, notes: e.target.value })
              }
            />
          </View>
          <View className="flex flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              className="px-6"
              onPress={() => setIsReceivePaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-[#2a9d8f]/50 hover:bg-[#2a9d8f] border-none text-white px-6"
              onPress={handleReceivePaymentSubmit}
            >
              Record Payment
            </Button>
          </View>
        </View>
      </Modal>

      {/* Confirm Discharge Modal */}
      <Modal
        isOpen={isDischargeOpen}
        onClose={() => setIsDischargeOpen(false)}
        title="Confirm Discharge"
        description="This will finalize all charges and generate the final bill."
      >
        <View className="space-y-6">
          <Card className="bg-slate-50/50 dark:bg-background p-6 space-y-4 border-none">
            <View className="flex justify-between items-center">
              <Text className="text-slate-600">Total Bill Amount</Text>
              <Text weight="font-bold" className="text-lg">
                ₹{ipdBillingDetailsData?.summary?.total_amount}
              </Text>
            </View>
            <View className="flex justify-between items-center">
              <Text className="text-slate-600">Amount Paid</Text>
              <Text weight="font-bold" className="text-lg text-emerald-500">
                ₹{ipdBillingDetailsData?.summary?.paid_amount}
              </Text>
            </View>
            <Separator className="bg-slate-200" />
            <View className="flex justify-between items-center">
              <Text className="text-slate-600">Balance</Text>
              <Text weight="font-bold" className="text-xl text-amber-500">
                ₹{ipdBillingDetailsData?.summary?.balance_amount}
              </Text>
            </View>
          </Card>
          <View className="flex flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              className="px-6"
              onPress={() => setIsDischargeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-[#2a9d8f] hover:bg-[#21867a] border-none text-white px-6"
              onPress={handleConfirmDischarge}
              disabled={isDischarging}
            >
              {isDischarging ? "Discharging..." : "Confirm Discharge"}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Add / Edit Charge Modal */}
      <Modal
        isOpen={isChargeModalOpen}
        onClose={() => setIsChargeModalOpen(false)}
        title={editingCharge ? "Edit Charge" : "Add New Charge"}
        description={
          editingCharge
            ? "Modify the existing charge details."
            : "Add a manual charge to the running bill."
        }
      >
        <View className="space-y-4">
          <View className="grid grid-cols-2 gap-4">
            <View className="space-y-2">
              <SingleSelector
                label="Category"
                options={chargeCategoryOptions}
                value={chargeForm.category}
                onChange={(value) =>
                  setChargeForm({ ...chargeForm, category: value })
                }
              />
            </View>
            <View className="space-y-2">
              <SingleSelector
                label="Currency"
                options={[
                  { label: "INR (₹)", value: "INR" },
                  { label: "USD ($)", value: "USD" },
                  { label: "EUR (€)", value: "EUR" },
                  { label: "GBP (£)", value: "GBP" },
                  { label: "AED (AED)", value: "AED" },
                ]}
                value={chargeForm.currency}
                onChange={(value) =>
                  setChargeForm({ ...chargeForm, currency: value })
                }
                required
              />
            </View>
          </View>
          <View className="space-y-2">
            <Input
              label="Description"
              placeholder="e.g., Paracetamol 500mg x 10"
              value={chargeForm.description}
              onChange={(e) =>
                setChargeForm({ ...chargeForm, description: e.target.value })
              }
            />
          </View>
          <View className="grid grid-cols-2 gap-4">
            <View className="space-y-2">
              <Input
                label="Rate"
                type="number"
                placeholder="0"
                value={Number(chargeForm.rate) || 0}
                onChange={(e) =>
                  setChargeForm({
                    ...chargeForm,
                    rate: Number(e.target.value) || 0,
                  })
                }
              />
            </View>
            <View className="space-y-2">
              <Input
                label="Tax %"
                type="number"
                placeholder="0"
                value={Number(chargeForm.tax) || 0}
                onChange={(e) =>
                  setChargeForm({
                    ...chargeForm,
                    tax: Number(e.target.value) || 0,
                  })
                }
              />
            </View>
          </View>
          <View className="p-4 bg-slate-50 dark:bg-background flex flex-row justify-between items-center rounded-lg">
            <Text className="text-slate-600 dark:text-muted-foreground">
              Amount ({chargeForm.currency})
            </Text>
            <Text weight="font-bold" className="text-lg ">
              {(
                chargeForm.rate +
                (chargeForm.rate * chargeForm.tax) / 100
              ).toFixed(2)}
            </Text>
          </View>
          <View className="flex flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              className="px-6"
              onPress={() => setIsChargeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-[#2a9d8f]/50 hover:bg-[#2a9d8f] border-none text-white px-6"
              onPress={handleAddChargeSubmit}
            >
              {editingCharge ? "Update Charge" : "Add Charge"}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Delete Charge Modal */}
      <Modal
        isOpen={deleteChargeId ? true : false}
        onClose={() => setDeleteChargeId(null)}
        title="Charge Delete"
        description="Are you sure you want to delete this charge? This action cannot be undone and will permanently remove the charge from the bill."
      >
        <View className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="text-black"
            onPress={() => setDeleteChargeId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex items-center gap-2"
            onPress={confirmDeleteCharge}
            disabled={isDeleting}
          >
            Delete <DeleteLoader isDeleting={isDeleting} />
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default IpdBillDetailsPage;
