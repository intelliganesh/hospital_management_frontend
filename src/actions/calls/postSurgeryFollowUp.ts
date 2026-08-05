import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  POST_SURGERY_ADD_URL,
  POST_SURGERY_LIST_URL,
  POST_SURGERY_EDIT_URL,
  POST_SURGERY_DELETE_URL,
  POST_SURGERY_DETAILS_URL,
  POST_SURGERY_FOLLOW_UP_DETAILS_LIST_DROPDOWN_URL,
  POST_SURGERY_CREATION_URL,
  POST_SURGERY_FOLLOW_UP_DOWNLOAD,
  POST_SURGERY_FOLLOW_UP_DOWNLOAD_PDF,
  //   POST_SURGERY_DROPDOWN_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import {
  postSurgeryDetailSlice,
  postSurgeryFollowUpDetailDropdownSlice,
  postSurgeryListSlice,
} from "../slices/postSurgery";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const usePostSurgery = () => {
  const dispatch = useDispatch();

  const addpostSurgeryHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        POST_SURGERY_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
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

  const postSurgeryListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    // search?: string | null,
    // sort_by?: string | null,
    // sort_order?: string | null,
    post_surgery_id?: string | null,
    consultation_id?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      // ${
      //   search ? "&search=" + search : ""
      // }${sort_by ? "&sort_by=" + sort_by : ""}${
      //   sort_order ? "&sort_order=" + sort_order : ""}
      await api.get(
        `${POST_SURGERY_LIST_URL}?page=${page}${post_surgery_id ? "&post_surgery_id=" + post_surgery_id : ""}${consultation_id ? "&consultation_id=" + consultation_id : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(postSurgeryListSlice(response?.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const postSurgeryDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        POST_SURGERY_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(postSurgeryDetailSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const postSurgeryEditHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        POST_SURGERY_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
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

  const postSurgeryDeleteHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        POST_SURGERY_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const postSurgeryFollowUpCreationHandler = async (
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        POST_SURGERY_CREATION_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
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

  const postSurgeryFollowUpDetailDropdownHandler = async (
    patient_id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${POST_SURGERY_FOLLOW_UP_DETAILS_LIST_DROPDOWN_URL}?patient_id=${patient_id ?? ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(postSurgeryFollowUpDetailDropdownSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const postSurgeryFollowUpDownload = async<T>(
    post_surgery_details_id: T,
    callback: ApiCallback,
  ): Promise<void> => {
   try {
         const baseUrl = import.meta.env.VITE_BASE_URL;
         const token = localStorage.getItem("token");
   
         const response = await fetch(`${baseUrl}${POST_SURGERY_FOLLOW_UP_DOWNLOAD}?post_surgery_details_id=${post_surgery_details_id}`, {
           method: "GET",
           headers: {
             Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
             ...(token ? { Authorization: `Bearer ${token}` } : {}),
           },
         });
   
         if (!response.ok) {
          response && handleApiError(response);
           throw new Error(`Failed to fetch download link: ${response.status}`);
         }
   
         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
   
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", "post-surgery-follow-ups.xlsx");
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
   
         window.URL.revokeObjectURL(url);
       } catch (error) {
        error && handleApiError(error);
         console.error("Download error:", error);
         callback(false, { success: false, error: "Unexpected error" });
       }
      
  }

  const downloadPostSurgeryFollowUpPdfHandler = async <T>(
      id: T,
      callback: ApiCallback
    ): Promise<void> => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const token = localStorage.getItem("token");
  
        const response = await fetch(`${baseUrl}${POST_SURGERY_FOLLOW_UP_DOWNLOAD_PDF}/${id}`, {
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
  

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addpostSurgeryHandler,
    postSurgeryListHandler,
    postSurgeryDetailHandler,
    postSurgeryEditHandler,
    postSurgeryDeleteHandler,
    postSurgeryFollowUpCreationHandler,
    postSurgeryFollowUpDetailDropdownHandler,
    postSurgeryFollowUpDownload,
    downloadPostSurgeryFollowUpPdfHandler
  };
};
