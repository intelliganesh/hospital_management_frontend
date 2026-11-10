import { Printer } from "lucide-react";
import Button from "./button";
import { useReceipt } from "@/actions/calls/receipt";

/** Icon button (printer) that opens the PDF receipt of one payment. */
const ReceiptPrintButton = ({ receiptId }: { receiptId?: string | null }) => {
  const { printReceipt, isReceiptLoading } = useReceipt();
  if (!receiptId || String(receiptId).startsWith("new-")) return null;
  return (
    <Button
      variant="ghost"
      onPress={() => printReceipt(receiptId)}
      loading={isReceiptLoading}
      className="flex items-center w-auto px-2 py-2 text-sm hover:bg-primary-100"
      title="Print receipt"
    >
      <Printer size={18} className=" text-primary" />
    </Button>
  );
};

export default ReceiptPrintButton;
