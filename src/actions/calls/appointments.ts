import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { GENERIC_ERROR_MESSAGE, TRYBLOCK_ERROR_MESSAGE } from "@/utils/message";
import {
  appointmentListSlice,
  appointmentDetailSlice,
  appointmentStatsSlice,
  // deletePatientSuccess,
} from "../slices/appointments";
import {
  APPOINTMENTS_ADD_URL,
  APPOINTMENTS_LIST_URL,
  APPOINTMENTS_EIDT_URL,
  APPOINTMENTS_DELETE_URL,
  APPOINTMENT_DETAILS_URL,
  APPOINTMENT_FEES_URL,
  APPOINTMENT_STATS_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useAppointments = () => {
  const dispatch = useDispatch();

  const appointmentDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        APPOINTMENT_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(appointmentDetailSlice(response));
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
  const appointmentListHandler = async (
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
        `${APPOINTMENTS_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }${from_date ? "&from_date=" + from_date : ""}${
          to_date ? "&to_date=" + to_date : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(appointmentListSlice(response?.data));
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
  const addAppointmentHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        APPOINTMENTS_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(addPatientSlice());
            callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };
  const editAppointmentHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        APPOINTMENTS_EIDT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, {
              success: true,
              message: response.data?.message,
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
  const deleteAppointmentHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        APPOINTMENTS_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(deletePatientSuccess(id));
            return callback(true, {
              success: true,
              message: response.data.message,
            });
          } else {
            response && handleApiError(response);
            return callback(false, {
              success: false,
              error: TRYBLOCK_ERROR_MESSAGE,
            });
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

  const appointmentFeesHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        APPOINTMENT_FEES_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true, response.data);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const appointmentStatsHandler = async (
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        APPOINTMENT_STATS_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(appointmentStatsSlice({ data: response?.data }));
            // return callback(true, response.data);
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

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addAppointmentHandler,
    editAppointmentHandler,
    appointmentListHandler,
    deleteAppointmentHandler,
    appointmentDetailHandler,
    appointmentFeesHandler,
    appointmentStatsHandler,
  };
};
