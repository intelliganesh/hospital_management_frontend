import { useState } from "react";
import { toast } from "@/utils/custom-hooks/use-toast";
import {
  RECEIPT_DOWNLOAD_URL,
  RECEIPT_DOWNLOAD_BY_EXTERNAL_APPOINTMENT_URL,
} from "@/utils/urls/backend";

/**
 * Receipt printing. The API returns {data:{url}} of a generated A5 PDF.
 * A blank tab is opened synchronously (inside the click) so popup blockers allow it,
 * then pointed at the PDF once it is ready.
 */
const openReceipt = async (path: string): Promise<boolean> => {
  const win = window.open("", "_blank");
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("token");
    const response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json().catch(() => null);
    const url = data?.data?.url;
    if (!response.ok || !url) {
      throw new Error(data?.message || "Receipt could not be generated");
    }
    if (win) {
      win.location.href = url;
    } else {
      window.open(url, "_blank");
    }
    return true;
  } catch (error: any) {
    win?.close();
    toast({
      title: "Error",
      description: error?.message || "Receipt could not be generated",
      variant: "destructive",
    });
    return false;
  }
};

export const useReceipt = () => {
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);

  const run = async (path: string) => {
    setIsReceiptLoading(true);
    try {
      return await openReceipt(path);
    } finally {
      setIsReceiptLoading(false);
    }
  };

  const printReceipt = (receiptId: string) =>
    run(`${RECEIPT_DOWNLOAD_URL}/${receiptId}`);

  const printExternalAppointmentReceipt = (externalAppointmentId: string) =>
    run(`${RECEIPT_DOWNLOAD_BY_EXTERNAL_APPOINTMENT_URL}/${externalAppointmentId}`);

  return { printReceipt, printExternalAppointmentReceipt, isReceiptLoading };
};
