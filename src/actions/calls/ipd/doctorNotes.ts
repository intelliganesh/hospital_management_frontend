import LaunchApi from "../../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
 DOCTOR_NOTES_LIST_URL,
 DOCTOR_NOTES_DETAIL_URL,
 DOCTOR_NOTES_DELETE_URL,
 ADD_DOCTOR_NOTES_URL,
 UPDATE_DOCTOR_NOTES_URL,
} from "@/utils/urls/backend";
import {
  doctorNotesDetailSlice,
  doctorNotesListSlice,
} from "@/actions/slices/ipd/doctorNotes";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
const api = new LaunchApi();

export const useDoctorNotes = () => {
  const dispatch = useDispatch();

  const addDoctorNotesHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        ADD_DOCTOR_NOTES_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
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

  const doctorNotesListHandler = async (
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
        `${DOCTOR_NOTES_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
           
          if (success && statusCode === 200) {
            dispatch(doctorNotesListSlice(response?.data || []));
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

  const doctorNotesDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        DOCTOR_NOTES_DETAIL_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(doctorNotesDetailSlice(response.data));
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

  const editDoctorNotesHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        UPDATE_DOCTOR_NOTES_URL + "/" + id,
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

  const deleteDoctorNotesHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        DOCTOR_NOTES_DELETE_URL,
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

//   const nurseNotesDropdownHandler = async (
//     callback: ApiCallback,
//     // departmentValue?: string
//   ): Promise<void> => {
//     try {
//       await api.get(
//         `${NURSE_NOTES_DROPDOWN_URL}/All`,
//         (response: AuthPayload, success: boolean, statusCode: number) => {
//           if (success && statusCode === 200) {
//             dispatch(nurseNotesDropdownSlice(response.data));
//             return callback(true);
//           } else {
//             response && handleApiError(response);
//             return callback(false);
//           }
//         }
//         );
//     } catch (error) {
//       error && handleApiError(error);
//       callback(false);
//     }
//   };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addDoctorNotesHandler,
    doctorNotesListHandler,
    doctorNotesDetailHandler,
    editDoctorNotesHandler,
    deleteDoctorNotesHandler,
  };
};
