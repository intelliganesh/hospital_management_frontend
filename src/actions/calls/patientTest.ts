import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  PATIENT_TEST_ADD_URL,
  PATIENT_TEST_DELETE_URL,
  PATIENT_TEST_DETAILS_URL,
  PATIENT_TEST_EDIT_URL,
  PATIENT_TEST_LIST_URL,
} from "@/utils/urls/backend";
import {
  patientTestDetailSlice,
  patientTestListSlice,
} from "../slices/patientTest";
import { LoadingStatus } from "@/interfaces";

const api = new LaunchApi();

export const usePatientTest = () => {
  const dispatch = useDispatch();

  const addPatientTestHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        PATIENT_TEST_ADD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      callback(false);
    }
  };

  const patientTestListHandler = async (
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
        `${PATIENT_TEST_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(patientTestListSlice(response?.data));
            return callback(true);
          } else {
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  const patientTestDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        PATIENT_TEST_DETAILS_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(patientTestDetailSlice(response.data));
            return callback(true);
          } else {
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  const patientTestEditHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        PATIENT_TEST_EDIT_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      callback(false);
    }
  };

  const patientTestDeleteHandler = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.delete(
        PATIENT_TEST_DELETE_URL,
        id,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            return callback(false);
          }
        }
      );
    } catch (error) {
      callback(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addPatientTestHandler,
    patientTestListHandler,
    patientTestDetailHandler,
    patientTestEditHandler,
    patientTestDeleteHandler,
  };
};
