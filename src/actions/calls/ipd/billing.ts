import LaunchApi from "../../api";
import { useDispatch } from "react-redux";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  IPD_BILLING_LIST_URL,
  IPD_BILLING_DETAILS_URL,
  IPD_BILLING_UPDATE_CHARGES_URL,
  IPD_BILLING_ADD_PAYMENT_URL,
  IPD_BILLING_ADD_CHARGES_URL,
  IPD_BILLING_PAYMENT_DETAILS_URL,
  IPD_BILLING_DELETE_CHARGES_URL,
  IPD_FINALBILLING_DISCHARGE_URL,
} from "@/utils/urls/backend";
import {
  ipdBillingListSlice,
  ipdBillingDetailSlice,
  ipdBillingPaymentDetailSlice,
} from "@/actions/slices/ipd/billing";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();

export const useIpdBilling = () => {
  const dispatch = useDispatch();

  // Get IPD billing list
  const getIpdBillingList = async (
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
        `${IPD_BILLING_LIST_URL}?page=${page}${search ? "&search=" + search : ""}${sort_by ? "&sort_by=" + sort_by : ""
        }${sort_order ? "&sort_order=" + sort_order : ""}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(ipdBillingListSlice(response?.data || []));
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

  // Get IPD billing details by IPD ID
  const getIpdBillingDetails = async (
    ipdId: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${IPD_BILLING_DETAILS_URL}/${ipdId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(ipdBillingDetailSlice(response?.data || {}));
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

  // Update IPD billing charge
  const updateIpdBillingCharges = async (
    chargeId: string,
    data: any,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.put(
        `${IPD_BILLING_UPDATE_CHARGES_URL}/${chargeId}`,
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

  // Add IPD billing payment
  const addIpdBillingPayment = async <T>(
    ipdId: string,
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        `${IPD_BILLING_ADD_PAYMENT_URL}/${ipdId}`,
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

  const IpdFinalBillingDischarge = async <T>(
    ipdId: string,
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        `${IPD_FINALBILLING_DISCHARGE_URL}/${ipdId}`,
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

  // Add IPD billing charge
  const addIpdBillingCharges = async <T>(
    ipdId: string,
    data: T,
    callback: ApiCallback
  ): Promise<void> => {
    try {
      await api.post(
        `${IPD_BILLING_ADD_CHARGES_URL}/${ipdId}`,
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

  // Delete IPD billing charge
  const deleteIpdBillingcharges = async (
    chargeId: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.delete(
        IPD_BILLING_DELETE_CHARGES_URL,
        chargeId,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else {
            response && handleApiError(response);
            callback(false);
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

  // Get IPD billing payment details
  const getIpdBillingPaymentDetails = async (
    ipdId: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void
  ): Promise<void> => {
    try {
      await api.get(
        `${IPD_BILLING_PAYMENT_DETAILS_URL}/${ipdId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(ipdBillingPaymentDetailSlice(response?.data || []));
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

  // Clean up active API requests
  const cleanUp = () => {
    api.cleanup();
  };

  return {
    getIpdBillingList,
    getIpdBillingDetails,
    updateIpdBillingCharges,
    deleteIpdBillingcharges,
    addIpdBillingPayment,
    addIpdBillingCharges,
    getIpdBillingPaymentDetails,
    IpdFinalBillingDischarge,
    cleanUp,
  };
};
