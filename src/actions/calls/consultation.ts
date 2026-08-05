import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import {
  CONSULTATION_ADD_URL,
  CONSULTATION_DATES_URL,
  CONSULTATION_DELETE_URL,
  CONSULTATION_DETAIL_URL,
  CONSULTATION_DROPDOWN_URL,
  CONSULTATION_EDIT_URL,
  CONSULTATION_LIST_URL,
  CONSULTATION_PRESCRIPTION_URL,
  CONSULTATION_STATS_URL,
} from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  consultationDetailSlice,
  consultationDropdownSlice,
  consultationListSlice,
  consultationStatsSlice,
} from "../slices/consultation";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useConsultation = () => {
  const dispatch = useDispatch();

  const extractReportPreview = (data: any) => {
    const payload = data?.data || data;
    return {
      html:
        payload?.html_data ||
        payload?.html ||
        payload?.report_html ||
        payload?.consultation_html ||
        payload?.content ||
        (typeof payload === "string" && payload.trim().startsWith("<")
          ? payload
          : ""),
      url:
        payload?.url ||
        payload?.report_url ||
        payload?.download_url ||
        (typeof payload === "string" && !payload.trim().startsWith("<")
          ? payload
          : ""),
    };
  };

  const addConsultationHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        CONSULTATION_ADD_URL,
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

  const consultationListHandler = async (
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
        `${CONSULTATION_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }${from_date ? "&from_date=" + from_date : ""}${
          to_date ? "&to_date=" + to_date : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(consultationListSlice(response.data));
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

  const consultationDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        CONSULTATION_DETAIL_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(consultationDetailSlice(response.data));
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

  const consultationEditHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        CONSULTATION_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, { success: true, data: response.data });
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

  const consultationDeleteHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        CONSULTATION_DELETE_URL,
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

  const consultationDropdownHandler = async (
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        CONSULTATION_DROPDOWN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(consultationDropdownSlice(response.data));
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

  const consultationStatsHandler = async (
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        CONSULTATION_STATS_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(consultationStatsSlice(response.data));
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

  const consultationDatesHandler = async (
    patientId: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${CONSULTATION_DATES_URL}/${patientId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        undefined,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const consultationReportPreviewHandler = async (
    appointmentId: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}${CONSULTATION_PRESCRIPTION_URL}/${appointmentId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, text/html",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        response && handleApiError(response);
        return callback(false);
      }

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        const html = await response.text();
        return callback(true, { success: true, data: { html } });
      }

      const data = await response.json();
      return callback(true, { success: true, data: extractReportPreview(data) });
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addConsultationHandler,
    consultationEditHandler,
    consultationListHandler,
    consultationDetailHandler,
    consultationDeleteHandler,
    consultationDropdownHandler,
    consultationStatsHandler,
    consultationDatesHandler,
    consultationReportPreviewHandler,
  };
};
