import { useDispatch } from "react-redux";
import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { preliminaryNotesDetailSlice } from "@/actions/slices/ipd/preliminaryNotes";

import {
  ADD_PRELIMINARY_NOTES_URL,
  PRELIMINARY_NOTES_DETAIL_URL,
  UPDATE_PRELIMINARY_NOTES_URL,
} from "@/utils/urls/backend";

const api = new LaunchApi();

export const usePreliminaryNotes = () => {
  const dispatch = useDispatch();

  const addPreliminaryNotes = async <T>(
    ipdId: string,
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        `${ADD_PRELIMINARY_NOTES_URL}/${ipdId}`,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200 || statusCode === 201) {
            return callback(true);
          } else if (statusCode && statusCode !== 204) {
            return callback(false);
          }
        },
        data
      );
    } catch (error) {
      //   dispatch(addRoomFailure(GENERIC_ERROR_MESSAGE));
      callback(false);
    }
  };

  const updatePreliminaryNotes = async (
    id: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${UPDATE_PRELIMINARY_NOTES_URL}/${id}`,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else if (statusCode && statusCode !== 204) {
            callback(false);
          }
        },
        data
      );
    } catch (error) {
      callback(false);
    }
  };

  const preliminaryNotesDetail = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        `${PRELIMINARY_NOTES_DETAIL_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(preliminaryNotesDetailSlice(response.data));
            callback(true);
          } else {
            callback(false);
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
    addPreliminaryNotes,
    updatePreliminaryNotes,
    preliminaryNotesDetail,
    cleanUp,
  };
};
