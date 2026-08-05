import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { GENERIC_ERROR_MESSAGE } from "@/utils/message";
import {
  patientListSlice,
  patientDetailSlice,
  getPatientConsultationSlice,
  getPatientStatsSlice,
  // deletePatientSuccess,
} from "../slices/patient";
import {
  ADD_PATIENT_URL,
  PATIENT_LIST_URL,
  EDIT_PATIENT_URL,
  DELETE_PATIENT_URL,
  PATIENT_DETAIL_URL,
  PATIENT_CONSULTATION_LIST_URL,
  PATIENT_STATS_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
import { toast } from "@/utils/custom-hooks/use-toast";

const api = new LaunchApi();

export const usePatient = () => {
  const dispatch = useDispatch();

  const patientDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        PATIENT_DETAIL_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(patientDetailSlice(response));
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
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };
  const patientListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${PATIENT_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(patientListSlice(response?.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(true, { success: false });
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };
  const getPatientConsultationHandler = async (
    patient_id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${PATIENT_CONSULTATION_LIST_URL}?patient_id=${patient_id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getPatientConsultationSlice(response));
            return callback(true);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };
  const addPatientHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        ADD_PATIENT_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(addPatientSlice());
            // callback(true, response.data);
            callback(true, { success: true, data: response.data });
          } else {
            response && handleApiError(response);
            callback(false);
            // callback(false, Object.values(response.errors)[0]);
            // callback(false, { success: false, message: response.data.message  });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };
  const editPatientHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        EDIT_PATIENT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, {
              success: true,
              data: response?.data,
            });
          } else if (success && statusCode !== 204) {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };
  
  const deletePatientHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        DELETE_PATIENT_URL,
        id,
        (response: any, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(deletePatientSuccess(id));
            callback(true);
          } else {
            // Extract the error message safely
            const errorMessage =
              response?.message ||
              response?.errors?.[0] ||
              "Failed to delete patient";

            // Show toast right here (no callback changes)
            toast({
              title: "Delete Failed",
              description: errorMessage,
              variant: "destructive",
            });

            response && handleApiError(response);
            callback(false); // keep same shape → no effect on other places
          }
        },
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      return callback(false, { success: false });
    }
  };
  // const downloadPatientHandler = async <T>(
  //   id: T,
  //   callback: ApiCallback<AuthPayload>
  // ): Promise<void> => {
  //   try {
  //     await api.get(
  //       `${DOWNLOAD_PATIENT_URL}/${id}/download`,
  //       (response: AuthPayload, success: boolean, statusCode: number) => {
  //         if (success && statusCode === 200) {
  //           // dispatch(downloadPatientSlice());
  //           const blob =  response?.data?.blob(); // Convert response to blob
  //           const url = window.URL.createObjectURL(blob); // Create an object URL
  //           window.open(url, "_blank"); // Open PDF in a new tab
  //           window.URL.revokeObjectURL(url); // Clean up the object URL after use
  //           return callback(true);
  //         } else {

  //           callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     callback(false, { success: false });
  //   }
  // };

  // const downloadPatientHandler = async <T>(
  //   id: T,
  //   callback: ApiCallback<AuthPayload>
  // ): Promise<void> => {
  //   try {
  //     await api.get(
  //       `${DOWNLOAD_PATIENT_URL}/${id}/download`, // Request blob response type
  //       (response: AuthPayload, success: boolean, statusCode: number) => {
  //         // In downloadPatientHandler
  //         if (success && statusCode === 200) {
  //           // window.open(response.data, "_blank");
  //           // Check what type of data you're getting
  //           const responseData = response?.data;

  //           // If it's already a Blob
  //           if (responseData instanceof Blob) {
  //             const url = window.URL.createObjectURL(responseData);
  //             window.open(url, "_blank");
  //             window.URL.revokeObjectURL(url);
  //             return callback(true);
  //           }
  //           // If it's binary data that needs to be converted to Blob
  //           else {
  //             const blob = new Blob([responseData], {
  //               type: "application/pdf",
  //             });
  //             const url = window.URL.createObjectURL(blob);
  //             window.open(url, "_blank");
  //             window.URL.revokeObjectURL(url);
  //             return callback(true);
  //           }
  //         } else {
  //           callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     callback(false, { success: false });
  //   }
  // };

  const downloadPatientHandler = async <T>(
    id: T,
    path: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseUrl}patients/${id}${path}`, {
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
    // try {
    //   // Get your base URL and auth token
    //   const baseUrl = import.meta.env.VITE_BASE_URL;
    //   const token = localStorage.getItem("token"); // Your method to get auth token

    //   // Use XMLHttpRequest for direct binary handling
    //   const xhr = new XMLHttpRequest();
    //   xhr.open("GET", `${baseUrl}patients/${id}${path}`, true);

    //   // Set response type to arraybuffer for binary data
    //   xhr.responseType = "arraybuffer";

    //   // Add authorization header if needed
    //   if (token) {
    //     xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    //   }

    //   xhr.onload = function () {
    //     if (this.status === 200) {
    //       // Create blob directly from arraybuffer
    //       const blob = new Blob([this.response], { type: "application/pdf" });
    //       const url = window.URL.createObjectURL(blob);

    //       // Open in new tab
    //       window.open(url, "_blank");

    //       // Clean up URL object after delay
    //       setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    //       callback(true);
    //     } else {
    //       console.error("Failed to download PDF:", this.status);
    //       callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
    //     }
    //   };

    //   xhr.onerror = function () {
    //     console.error("XHR error occurred");
    //     callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
    //   };

    //   xhr.send();
    // } catch (error) {
    //   console.error("Download error:", error);
    //   callback(false, { success: false });
    // }
  };

  const getPatientStatsHandler = async (
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${PATIENT_STATS_URL}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getPatientStatsSlice(response));
            return callback(true);
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
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addPatientHandler,
    editPatientHandler,
    patientListHandler,
    deletePatientHandler,
    patientDetailHandler,
    downloadPatientHandler,
    getPatientConsultationHandler,
    getPatientStatsHandler,
  };
};
