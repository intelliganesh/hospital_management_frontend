import LaunchApi from "../api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { useDispatch } from "react-redux";
import {
  fistulaDetailSlice,
  fistulaListSlice,
  fistulaDropdownSlice,
  patientFistulaListSlice,
  patientFistulaDetailSlice,
} from "@/actions/slices/fistula";
import { LoadingStatus } from "@/interfaces";
import {
  FISTULA_ADD_URL,
  FISTULA_DELETE_URL,
  FISTULA_DETAILS_URL,
  FISTULA_DROPDOWN_URL,
  FISTULA_EDIT_URL,
  FISTULA_LIST_URL,
  PATIENT_FISTULA_ADD_URL,
  PATIENT_FISTULA_DELETE_URL,
  PATIENT_FISTULA_DETAIL_URL,
  PATIENT_FISTULA_EDIT_URL,
  PATIENT_FISTULA_LIST_URL,
} from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useFistula = () => {
  const dispatch = useDispatch();

  const fistulaDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        FISTULA_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(fistulaDetailSlice(response.data));
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

  const fistulaListHandler = async (
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
        `${FISTULA_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(fistulaListSlice(response.data));
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

  const addFistulaHandler = async (
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        FISTULA_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };
  const editFistulaHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        FISTULA_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };
  const deleteFistulaHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.delete(
        FISTULA_DELETE_URL,
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
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const fistulaDropdownHandler = async (
    callback: ApiCallback,
    departmentValue?: string,
  ): Promise<void> => {
    try {
      await api.get(
        `${FISTULA_DROPDOWN_URL}/${departmentValue ?? "All"}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(fistulaDropdownSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  const patientFistulaListHandler = async (
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
        `${PATIENT_FISTULA_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(patientFistulaListSlice(response.data));
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

  const addPatientFistulaHandler = async (
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        PATIENT_FISTULA_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const editPatientFistulaHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        PATIENT_FISTULA_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const patientFistulaDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        PATIENT_FISTULA_DETAIL_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(patientFistulaDetailSlice(response.data));
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

  const deletePatientFistulaHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.delete(
        PATIENT_FISTULA_DELETE_URL,
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
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  return {
    cleanUp,
    addFistulaHandler,
    editFistulaHandler,
    deleteFistulaHandler,
    fistulaDetailHandler,
    fistulaListHandler,
    fistulaDropdownHandler,
    patientFistulaListHandler,
    addPatientFistulaHandler,
    editPatientFistulaHandler,
    patientFistulaDetailHandler,
    deletePatientFistulaHandler
  };
};
