import { useDispatch } from "react-redux";
import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  surgeryListSlice,
  surgeryReportDetailSlice,
  surgeryDropdownSlice,
  prefilledUploadedPdfSlice,
} from "@/actions/slices/ipd/surgeryProcedure/surgeryReport";
import {
  IPD_SURGERY_ADD_URL,
  UPDATE_SURGERY_REPORT_URL,
  SURGERY_REPORT_DETAIL_URL,
  IPD_SURGERY_DELETE_URL,
  IPD_SURGERY_LIST_URL,
  UPDATE_SURGERY_CONSENT_FORM_URL,
  SURGERY_DROPDOWN_URL,
  IPD_PREFILLED_UPLOADED_PDF_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useSurgeryReport = () => {
  const dispatch = useDispatch();

  const addSurgeryReport = async <T>(
    data: T,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        `${IPD_SURGERY_ADD_URL}`,
        (response: any, success: boolean, statusCode: number) => {
          if ((success && statusCode === 200) || statusCode === 201) {
            return callback(true, response);
          } else {
            return callback(false, response);
          }
        },
        data,
      );
    } catch (error) {
      callback(false, error as any);
    }
  };

  const updateSurgeryReport = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        `${UPDATE_SURGERY_REPORT_URL}/${id}`,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else {
            callback(false);
          }
        },
        data,
      );
    } catch (error) {
      callback(false);
    }
  };

  const surgeryReportDetail = async (
    id: string,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.get(
        `${SURGERY_REPORT_DETAIL_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(surgeryReportDetailSlice(response.data));
            callback(true);
          } else {
            callback(false);
          }
        },
      );
    } catch (error) {
      callback(false);
    }
  };

  const deleteSurgery = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      // dispatch(deleteRoomStart());
      await api.delete(
        IPD_SURGERY_DELETE_URL,
        id,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else {
            callback(false);
          }
        },
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      callback(false);
    }
  };

  const getSurgeryList = async (
    ipd_id: string,
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${IPD_SURGERY_LIST_URL}?ipd_id=${ipd_id}&page=${page}${search ? "&search=" + search : ""}${sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(surgeryListSlice(response.data));
            callback(true);
          } else {
            callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      callback(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  const updateConsentForm = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        `${UPDATE_SURGERY_CONSENT_FORM_URL}/${id}`,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else {
            callback(false);
          }
        },
        data,
      );
    } catch (error) {
      callback(false);
    }
  };

  const surgeryDropdownHandler = async (
    callback: ApiCallback,
    ipd_id?: string
  ): Promise<void> => {
    try {
      await api.get(
        `${SURGERY_DROPDOWN_URL}/${ipd_id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(surgeryDropdownSlice(response.data));
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


  const prefilledUploadedPdfHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${IPD_PREFILLED_UPLOADED_PDF_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(prefilledUploadedPdfSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };
  return {
    addSurgeryReport,
    updateSurgeryReport,
    surgeryReportDetail,
    deleteSurgery,
    getSurgeryList,
    cleanUp,
    updateConsentForm,
    surgeryDropdownHandler,
    prefilledUploadedPdfHandler,
  };
};
