import LaunchApi from "../api";
import { useDispatch } from "react-redux";
import {
  citySlice,
  stateSlice,
  countriesSlice,
} from "@/actions/slices/geography";
import {
  CITY_LIST_URL,
  COUNTRY_LIST_URL,
  STATE_LIST_URL,
} from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";
import { ApiCallback } from "@/interfaces/api";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useGeography = () => {
  const dispatch = useDispatch();

  const countriesArray = async (
    callback: ApiCallback,
    id?: string
  ): Promise<void> => {
    try {
      await api.get(
        id ? COUNTRY_LIST_URL + "/" + id : COUNTRY_LIST_URL,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(countriesSlice(response));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const stateArray = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        STATE_LIST_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(stateSlice(response));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };

  const citiesArray = async (
    id: string,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.get(
        CITY_LIST_URL + "/" + id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(citySlice(response));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false, { success: false });
          }
        }
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false });
    }
  };
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    cleanUp,
    stateArray,
    citiesArray,
    countriesArray,
  };
};
