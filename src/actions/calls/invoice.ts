import { ApiCallback } from "@/interfaces/api";
import { useDispatch } from "react-redux";
import {
  invoiceDetailSlice,
  invoiceListSlice,
  paymentDetailSlice,
} from "../slices/invoice";
import { AuthPayload } from "@/interfaces/slices/auth";
import LaunchApi from "../api";
import {
  AMOUNT_INCLUDE_IN_INVOICE,
  CONSULTATION_REPORT_URL,
  INVOICE_DETAILS_URL,
  INVOICE_DOWNLOAD_URL,
  INVOICE_LIST_URL,
  INVOICE_PAYMENT_DETAILS_URL,
  INVOICE_PAYMENT_URL,
  PRESCRIPTION_DOWNLOAD_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useInvoice = () => {
  const dispatch = useDispatch();

  const getInvoiceListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    from_date?: string | null,
    to_date?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${INVOICE_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}
        ${from_date ? "&from_date=" + from_date : ""}${
          to_date ? "&to_date=" + to_date : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(invoiceListSlice(response));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const invoicePayment = async (data: any, callback: ApiCallback) => {
    try {
      await api.post(
        `${INVOICE_PAYMENT_URL}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const getInvoiceDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${INVOICE_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(invoiceDetailSlice(response.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const getPaymentDetailHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${INVOICE_PAYMENT_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(paymentDetailSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const amountIncludeInInvoice = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        AMOUNT_INCLUDE_IN_INVOICE,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else if (statusCode && statusCode !== 204) {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const downloadInvoiceHandler = async <T>(
    id: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}${INVOICE_DOWNLOAD_URL}/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        response && handleApiError(response);
        throw new Error(`Failed to fetch download link: ${response.status}`);
      }

      const data = await response.json();

      if (data.data.url) {
        // Create a temporary download link
        // const link = document.createElement("a");
        // link.href = data.data.url;
        // link.setAttribute("download", `invoice-${id}.pdf`);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        window.open(data.data.url, "_blank");

        callback(true);
      } else {
        console.error("No download URL returned by backend");

        callback(false, { success: false, error: "Download URL missing" });
      }
    } catch (error) {
      error && handleApiError(error);
      console.error("Download error:", error);
      callback(false, { success: false, error: "Unexpected error" });
    }
  };

  // const downloadInvoiceHandler = async <T>(
  //   id: T,
  //   // path: string,
  //   callback: ApiCallback
  // ): Promise<void> => {
  //   try {
  //     // Get your base URL and auth token
  //     const baseUrl = import.meta.env.VITE_BASE_URL;
  //     const token = localStorage.getItem("token"); // Your method to get auth token

  //     // Use XMLHttpRequest for direct binary handling
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("GET", `${baseUrl}${INVOICE_DOWNLOAD_URL}/${id}`, true);

  //     // Set response type to arraybuffer for binary data
  //     xhr.responseType = "arraybuffer";

  //     // Add authorization header if needed
  //     if (token) {
  //       xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  //     }

  //     xhr.onload = function () {
  //       if (this.status === 200) {
  //         // Create blob directly from arraybuffer
  //         const blob = new Blob([this.response], { type: "application/pdf" });
  //         const url = window.URL.createObjectURL(blob);

  //         // Open in new tab
  //         // window.open(url, "_blank");
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", `invoice-${id}.pdf`);
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         // Clean up URL object after delay
  //         // setTimeout(() => window.URL.revokeObjectURL(url), 1000);

  //         callback(true);
  //       } else {
  //         console.error("Failed to download PDF:", this.status);
  //         callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //       }
  //     };

  //     xhr.onerror = function () {
  //       console.error("XHR error occurred");
  //       callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //     };

  //     xhr.send();
  //   } catch (error) {
  //     console.error("Download error:", error);
  //     callback(false, { success: false });
  //   }
  // };
  const downloadConsultationHandler = async <T>(
    id: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}${CONSULTATION_REPORT_URL}/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        response && handleApiError(response);
        throw new Error(`Failed to fetch download link: ${response.status}`);
      }

      const data = await response.json();

      if (data.data.url) {
        // Create a temporary download link
        // const link = document.createElement("a");
        // link.href = data.data.url;
        // link.setAttribute("download", `invoice-${id}.pdf`);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        window.open(data.data.url, "_blank");

        callback(true);
      } else {
        console.error("No download URL returned by backend");
        callback(false, { success: false, error: "Download URL missing" });
      }
    } catch (error) {
      error && handleApiError(error);
      console.error("Download error:", error);
      callback(false, { success: false, error: "Unexpected error" });
    }
  };
  // const downloadConsultationHandler = async <T>(
  //   id: T,
  //   callback: ApiCallback
  // ): Promise<void> => {
  //   try {
  //     const baseUrl = import.meta.env.VITE_BASE_URL;
  //     const token = localStorage.getItem("token"); // Your method to get auth token

  //     const xhr = new XMLHttpRequest();
  //     xhr.open("GET", `${baseUrl}${CONSULTATION_REPORT_URL}/${id}`, true);

  //     xhr.responseType = "arraybuffer";

  //     if (token) {
  //       xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  //     }

  //     xhr.onload = function () {
  //       if (this.status === 200) {
  //         const blob = new Blob([this.response], { type: "application/pdf" });
  //         const url = window.URL.createObjectURL(blob);

  //         window.open(url, "_blank");

  //         setTimeout(() => window.URL.revokeObjectURL(url), 1000);

  //         callback(true);
  //       } else {
  //         console.error("Failed to download PDF:", this.status);
  //         callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //       }
  //     };

  //     xhr.onerror = function () {
  //       console.error("XHR error occurred");
  //       callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //     };

  //     xhr.send();
  //   } catch (error) {
  //     console.error("Download error:", error);
  //     callback(false, { success: false });
  //   }
  // };

  const downloadPrescroriptionHandler = async <T>(
    id: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}${PRESCRIPTION_DOWNLOAD_URL}/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        response && handleApiError(response);
        throw new Error(`Failed to fetch download link: ${response.status}`);
      }

      const data = await response.json();
      if (data.data.url) {
        // Create a temporary download link
        // const link = document.createElement("a");
        // link.href = data.data.url;
        // link.setAttribute("download", `invoice-${id}.pdf`);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);

        window.open(data.data.url, "_blank");

        callback(true);
      } else {
        console.error("No download URL returned by backend");
        callback(false, { success: false, error: "Download URL missing" });
      }
    } catch (error) {
      error && handleApiError(error);
      console.error("Download error:", error);
      callback(false, { success: false, error: "Unexpected error" });
    }
  };
  // const downloadPrescroriptionHandler = async <T>(
  //   id: T,
  //   // path: string,
  //   callback: ApiCallback
  // ): Promise<void> => {
  //   try {
  //     // Get your base URL and auth token
  //     const baseUrl = import.meta.env.VITE_BASE_URL;
  //     const token = localStorage.getItem("token"); // Your method to get auth token

  //     // Use XMLHttpRequest for direct binary handling
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("GET", `${baseUrl}${PRESCRIPTION_DOWNLOAD_URL}/${id}`, true);

  //     // Set response type to arraybuffer for binary data
  //     xhr.responseType = "arraybuffer";

  //     // Add authorization header if needed
  //     if (token) {
  //       xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  //     }

  //     xhr.onload = function () {
  //       if (this.status === 200) {
  //         // Create blob directly from arraybuffer
  //         const blob = new Blob([this.response], { type: "application/pdf" });
  //         const url = window.URL.createObjectURL(blob);

  //         // Open in new tab
  //         window.open(url, "_blank");

  //         // Clean up URL object after delay
  //         setTimeout(() => window.URL.revokeObjectURL(url), 1000);

  //         callback(true);
  //       } else {
  //         console.error("Failed to download PDF:", this.status);
  //         callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //       }
  //     };

  //     xhr.onerror = function () {
  //       console.error("XHR error occurred");
  //       callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //     };

  //     xhr.send();
  //   } catch (error) {
  //     console.error("Download error:", error);
  //     callback(false, { success: false });
  //   }
  // };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    invoicePayment,
    getInvoiceListHandler,
    downloadInvoiceHandler,
    getPaymentDetailHandler,
    getInvoiceDetailHandler,
    downloadConsultationHandler,
    downloadPrescroriptionHandler,
    amountIncludeInInvoice,
    cleanUp,
  };
};
