import LaunchApi from "../../../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  IPD_PRE_OP_ANAESTHESIA_EVAL_ADD,
  IPD_PRE_OP_ANAESTHESIA_EVAL_UPDATE,
  IPD_PRE_OP_ANAESTHESIA_EVAL_DETAILS,
} from "@/utils/urls/backend";
import { preOpAnaesthesiaEvalDetailSlice } from "@/actions/slices/ipd/anaesthesia/pre-opAnaesthesiaEvaluation";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
const api = new LaunchApi();

export const usePreOpAnaesthesiaEval = () => {
  const dispatch = useDispatch();

  const addPreOpAnaesthesiaEvalHandler = async <T>(
    data: T,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        IPD_PRE_OP_ANAESTHESIA_EVAL_ADD,
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

  // const anaesthesiaListHandler = async (
  //   page: number | string = 1,
  //   callback: ApiCallback,
  //   search?: string | null,
  //   sort_by?: string | null,
  //   sort_order?: string | null,
  //   data?: any,
  //   isLoading?: (status: LoadingStatus) => void,
  // ): Promise<void> => {
  //   try {
  //     await api.get(
  //       `${ANAESTHESIA_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${
  //         sort_by ? "&sort_by=" + sort_by : ""
  //       }${sort_order ? "&sort_order=" + sort_order : ""}`,
  //       (response: AuthPayload, success: boolean, statusCode: number) => {
  //         if (success && statusCode === 200) {
  //           dispatch(anaesthesiaListSlice(response?.data || []));
  //           return callback(true);
  //         } else {
  //           response && handleApiError(response);
  //           return callback(false);
  //         }
  //       },
  //       data,
  //       (status) => {
  //         isLoading?.(status);
  //       },
  //     );
  //   } catch (error) {
  //     error && handleApiError(error);
  //     callback(false);
  //   }
  // };

  const preOpAnaesthesiaEvalDetailsHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        IPD_PRE_OP_ANAESTHESIA_EVAL_DETAILS + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(preOpAnaesthesiaEvalDetailSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status: any) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const editPreOpAnaesthesiaEvalHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        IPD_PRE_OP_ANAESTHESIA_EVAL_UPDATE + "/" + id,
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

  // const deleteAnaesthesiaHandler = async (
  //   id: string,
  //   callback: ApiCallback,
  //   isLoading?: (status: LoadingStatus) => void,
  // ): Promise<void> => {
  //   try {
  //     await api.delete(
  //       ANAESTHESIA_DELETE_URL,
  //       id,
  //       (response: AuthPayload, success: boolean, statusCode: number) => {
  //         if (success && statusCode === 200) {
  //           return callback(true);
  //         } else {
  //           response && handleApiError(response);
  //           return callback(false);
  //         }
  //       },
  //       (status) => {
  //         isLoading?.(status);
  //       },
  //     );
  //   } catch (error) {
  //     error && handleApiError(error);
  //     callback(false);
  //   }
  // };

  //   const anaesthesiaDropdownHandler = async (
  //     callback: ApiCallback,
  //     // departmentValue?: string
  //   ): Promise<void> => {
  //     try {
  //       await api.get(
  //         `${ANAESTHESIA_DROPDOWN_URL}/All`,
  //         (response: AuthPayload, success: boolean, statusCode: number) => {
  //           if (success && statusCode === 200) {
  //             dispatch(anaesthesiaDropdownSlice(response.data));
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
    addPreOpAnaesthesiaEvalHandler,
    preOpAnaesthesiaEvalDetailsHandler,
    editPreOpAnaesthesiaEvalHandler,
  };
};
