import LaunchApi from "../../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
 NURSE_NOTES_LIST_URL,
 NURSE_NOTES_DETAIL_URL,
 NURSE_NOTES_DELETE_URL,
 ADD_NURSE_NOTES_URL,
 UPDATE_NURSE_NOTES_URL,
} from "@/utils/urls/backend";
import {
  nurseNotesDetailSlice,
  nurseNotesListSlice,
} from "@/actions/slices/ipd/nurseNotes";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
const api = new LaunchApi();

export const useNurseNotes = () => {
  const dispatch = useDispatch();

  const addNurseNotesHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        ADD_NURSE_NOTES_URL,
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

  const nurseNotesListHandler = async (
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
        `${NURSE_NOTES_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
          sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
           
          if (success && statusCode === 200) {
            dispatch(nurseNotesListSlice(response?.data || []));
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

  const nurseNotesDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        NURSE_NOTES_DETAIL_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(nurseNotesDetailSlice(response.data));
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

  const editNurseNotesHandler = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        UPDATE_NURSE_NOTES_URL + "/" + id,
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

  const deleteNurseNotesHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        NURSE_NOTES_DELETE_URL,
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
    addNurseNotesHandler,
    nurseNotesListHandler,
    nurseNotesDetailHandler,
    editNurseNotesHandler,
    deleteNurseNotesHandler,
  };
};
