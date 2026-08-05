import LaunchApi from "@/actions/api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  GET_SYSTEM_SETTINGS_URL,
  ADD_SYSTEM_SETTING_URL,
  ADD_OR_EDIT_SYSTEM_SETTING_URL,
} from "@/utils/urls/backend";
import {
  getSystemSettingsStart,
  getSystemSettingsSuccess,
  addSystemSettingStart,
  // addSystemSettingSuccess,
  editSystemSettingStart,
  // editSystemSettingSuccess,
} from "../slices/systemSettingsSlice";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useSystemSettings = () => {
  const dispatch = useDispatch();

  const getSystemSettings = async (callback?: ApiCallback): Promise<void> => {
    dispatch(getSystemSettingsStart());
    try {
      await api.get(
        GET_SYSTEM_SETTINGS_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(getSystemSettingsSuccess(response));
            const {bg_primary_color,
              bg_secondary_color,
              bg_tertiary_color,
              primary_color,
              secondary_color,
              tertiary_color,
              text_primary_color,
              text_secondary_color,
              text_tertiary_color,
            } = response?.data?.settings[0];

            const colorData = {
              primary_color,
              tertiary_color,
              secondary_color,
              bg_primary_color,
              bg_tertiary_color,
              bg_secondary_color,
              text_primary_color,
              text_tertiary_color,
              text_secondary_color,
            };

            localStorage.setItem(
              "colors",
              JSON.stringify(colorData)
            );
            if (callback)
              callback(true, { success: true, data: response.data });
          } else {
             response && handleApiError(response);
            // dispatch(getSystemSettingsFailure(response.error || GENERIC_ERROR_MESSAGE));
            if (callback) callback(false, { success: false });
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      //   dispatch(getSystemSettingsFailure(GENERIC_ERROR_MESSAGE));
      if (callback) callback(false, { success: false });
    }
  };

  const addSystemSetting = async <T>(
    data: T,
    callback?: ApiCallback
  ): Promise<void> => {
    dispatch(addSystemSettingStart());
    try {
      await api.post(
        ADD_SYSTEM_SETTING_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(addSystemSettingSuccess(response.data));
            if (callback) callback(true, { success: true });
          } else {
            response && handleApiError(response);
            // dispatch(addSystemSettingFailure(response.error || GENERIC_ERROR_MESSAGE));
            if (callback) callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      //   dispatch(addSystemSettingFailure(GENERIC_ERROR_MESSAGE));
      if (callback) callback(false, { success: false });
    }
  };

  const editOrAddSystemSetting = async <T>(
    data: T,
    callback?: ApiCallback
  ): Promise<void> => {
    try {
      dispatch(editSystemSettingStart());

      await api.post(
        ADD_OR_EDIT_SYSTEM_SETTING_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            const responseData = response.data;
            try {
              // dispatch(editSystemSettingSuccess(responseData));
            } catch (error) {
              error && handleApiError(error);
              console.error("Dispatch error:", error);
            }

            if (callback) {
              callback(true, { success: true, data: responseData });
            }
          } else {
            response && handleApiError(response);
            // dispatch(editSystemSettingFailure(response.error || GENERIC_ERROR_MESSAGE));
            if (callback) callback(false, { success: false });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      //   dispatch(editSystemSettingFailure(GENERIC_ERROR_MESSAGE));
      if (callback) callback(false, { success: false });
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    getSystemSettings,
    addSystemSetting,
    editOrAddSystemSetting,
  };
};
