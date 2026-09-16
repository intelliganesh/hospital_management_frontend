import LaunchApi from "../../../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  IPD_ANAESTHESIA_RECOVERY_OBSERVATION_DETAILS,
  IPD_ANAESTHESIA_RECOVERY_OBSERVATION_ADD,
  IPD_ANAESTHESIA_RECOVERY_OBSERVATION_UPDATE,
} from "@/utils/urls/backend";
import { anaesthesiaRecoveryObservationDetailsSlice } from "@/actions/slices/ipd/anaesthesia/anaesthesiaRecoveryObservation";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
const api = new LaunchApi();

export const useAnaesthesiaRecoveryObservation = () => {
  const dispatch = useDispatch();

  const addAnaesthesiaRecoveryObservationHandler = async <T>(
    data: T,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.post(
        IPD_ANAESTHESIA_RECOVERY_OBSERVATION_ADD,
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

  const anaesthesiaRecoveryObservationDetailsHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        IPD_ANAESTHESIA_RECOVERY_OBSERVATION_DETAILS + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(anaesthesiaRecoveryObservationDetailsSlice(response.data));
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

  const editanaesthesiaRecoveryObservationHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        IPD_ANAESTHESIA_RECOVERY_OBSERVATION_UPDATE + "/" + id,
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

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    addAnaesthesiaRecoveryObservationHandler,
    anaesthesiaRecoveryObservationDetailsHandler,
    editanaesthesiaRecoveryObservationHandler,
  };
};
