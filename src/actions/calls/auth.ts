import LaunchApi from "@/actions/api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { loginSlice, logoutSlice, refreshTokenSlice } from "../slices/auth";
import { GENERIC_ERROR_MESSAGE, TRYBLOCK_ERROR_MESSAGE } from "@/utils/message";
import {
  LOGIN_URL,
  LOGOUT_URL,
  REGISTRATION_URL,
  REFRESH_TOKEN_URL,
  RESET_PASSWORD_URL,
  FORGOT_PASSWORD_URL,
  VERIFY_PASSWORD_URL,
} from "@/utils/urls/backend";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useAuth = () => {
  const dispatch = useDispatch();
  const loginHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        LOGIN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(loginSlice(response));
            return callback(true, { success: true });
          } else {
            response && handleApiError(response);
            return callback(false, {
              success: false,
            });
          }
        },
        data
      );
    } catch (error) {
      error && handleApiError(error);
      console.log(error, "Error");
      
      callback(true, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };
  const verifyPassword = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        VERIFY_PASSWORD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(loginSlice(response));
            return callback(true);
          } else {
            return callback(false, {
              success: false,
            });
          }
        },
        data
      );
    } catch (error) {
      callback(true, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const registrationHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        REGISTRATION_URL,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(registrationSlice(response));
            return callback(true, { success: true });
          } else {
            return callback(true, {
              success: true,
            });
          }
        },
        data
      );
    } catch (error) {
      callback(true, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const refreshTokenHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        REFRESH_TOKEN_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(refreshTokenSlice(response));
            return callback(true, { success: true });
          } else {
            return callback(true, {
              success: true,
              error: TRYBLOCK_ERROR_MESSAGE,
            });
          }
        },
        data
      );
    } catch (error) {
      callback(true, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const logoutHandler = async (callback: ApiCallback): Promise<void> => {
    try {
      await api.get(
        LOGOUT_URL,
        (_: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(logoutSlice());
            return callback(true, { success: true });
          } else {
            return callback(true, {
              success: false,
              error: TRYBLOCK_ERROR_MESSAGE,
            });
          }
        }
      );
    } catch (error) {
      callback(true, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const forgotPasswordHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        FORGOT_PASSWORD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(forgotPasswordSlice());
            return callback(true);
          } else {
            return callback(false, {
              success: true,
              message: response?.data?.message,
            });
          }
        },
        data
      );
    } catch (error) {
      console.error(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const resetPasswordHandler = async <T>(
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        RESET_PASSWORD_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            // dispatch(resetPasswordSlice(response));
            return callback(true, {
              success: true,
              message: response?.data?.message,
            });
          } else {
            callback(false, { success: false, error: TRYBLOCK_ERROR_MESSAGE });
          }
        },
        data
      );
    } catch (error) {
      callback(true, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    loginHandler,
    logoutHandler,
    verifyPassword,
    registrationHandler,
    refreshTokenHandler,
    resetPasswordHandler,
    forgotPasswordHandler,
  };
};
