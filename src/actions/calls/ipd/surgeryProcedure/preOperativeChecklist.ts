import { useDispatch } from "react-redux";
import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { preOperativeChecklistDetailSlice } from "@/actions/slices/ipd/surgeryProcedure/preOperativeChecklist";
import {
  IPD_PRE_OPERATIVE_CHECKLIST_UPDATE_URL,
  IPD_PRE_OPERATIVE_CHECKLIST_DETAILS_URL,
} from "@/utils/urls/backend";

const api = new LaunchApi();

export const usePreOperativeChecklist = () => {
  const dispatch = useDispatch();

  const updatePreOperativeChecklist = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        `${IPD_PRE_OPERATIVE_CHECKLIST_UPDATE_URL}/${id}`,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && (statusCode === 200 || statusCode === 201)) {
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

  const preOperativeChecklistDetail = async (
    id: string,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.get(
        `${IPD_PRE_OPERATIVE_CHECKLIST_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(preOperativeChecklistDetailSlice(response.data));
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

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    updatePreOperativeChecklist,
    preOperativeChecklistDetail,

    cleanUp,
  };
};
