import { ApiCallback } from "@/interfaces/api";
import { useDispatch } from "react-redux";
import LaunchApi from "../api";
import { AuthPayload } from "@/interfaces/slices/auth";
import {
  ONLINE_APPOINTMENTS_DELETE_URL,
  ONLINE_APPOINTMENTS_DETAILS_URL,
  ONLINE_APPOINTMENTS_EDIT_URL,
  ONLINE_APPOINTMENTS_GENERATE_LINK_URL_PREFIX,
  ONLINE_APPOINTMENTS_GENERATE_LINK_URL_SUFFIX,
  ONLINE_APPOINTMENTS_LIST_URL,
  ONLINE_APPOINTMENTS_RESEND_LINK_URL_SUFFIX,
  ONLINE_APPOINTMENTS_STATS_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { handleApiError } from "@/utils/errorHandler";
import {
  onlineAppointmentDetailSlice,
  onlineAppointmentListSlice,
  onlineAppointmentStatsSlice,
} from "../slices/onlineAppointments";

const api = new LaunchApi();
export const useOnlineAppointments = () => {
  const dispatch = useDispatch();

  const onlineAppointmentsListHandler = async (
    page: number | string = 1,
    callback: ApiCallback,
    search?: string | null,
    sort_by?: string | null,
    sort_order?: string | null,
    from_date?: string | null,
    to_date?: string | null,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
    // filter?: string | null
  ): Promise<void> => {
    try {
      await api.get(
        `${ONLINE_APPOINTMENTS_LIST_URL}?page=${page}${
          search ? "&search=" + search : ""
        }${sort_by ? "&sort_by=" + sort_by : ""}${
          sort_order ? "&sort_order=" + sort_order : ""
        }${from_date ? "&from_date=" + from_date : ""}${
          // ✅ start_date
          to_date ? "&to_date=" + to_date : "" // ✅ end_date
        }`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(onlineAppointmentListSlice(response.data));
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const onlineAppointmentDetailHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${ONLINE_APPOINTMENTS_DETAILS_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(onlineAppointmentDetailSlice(response.data));
            return callback(true, response?.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };
  const onlineAppointmentStatsHandler = async (
    callback: ApiCallback,
    data?: any,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.get(
        `${ONLINE_APPOINTMENTS_STATS_URL}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            dispatch(onlineAppointmentStatsSlice(response.data));
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const onlineAppointmentEditHandler = async (
    id: string,
    data: any,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        `${ONLINE_APPOINTMENTS_EDIT_URL}/${id}`,
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

  const onlineAppointmentDeleteHandler = async (
    id: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.delete(
        ONLINE_APPOINTMENTS_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        (status) => {
          isLoading?.(status);
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const sendPaymentLink = async (
    id: string,
    amount: string,
    paymentType: "link" | "Bank Transfer",
    bankAccountId?: string,
    razorpayLink?: string,
    callback?: ApiCallback,
    extraData?: any,
  ): Promise<void> => {
    try {
      await api.put<any>(
        `${ONLINE_APPOINTMENTS_EDIT_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback?.(true, response.data);
          } else {
            response && handleApiError(response);
            return callback?.(false);
          }
        },
        {
          status: "Payment Pending",
          amount,
          payment_type: paymentType,
          bank_details_id: bankAccountId,
          payment_info: razorpayLink,
          ...extraData,
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback?.(false);
    }
  };

  const confirmPayment = async (
    id: string,
    amount: string,
    paymentType: "link" | "Bank Transfer",
    transactionId: string,
    paymentDate: string,
    // meetingLink: string,
    visitType?: string,
    callback?: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put<any>(
        `${ONLINE_APPOINTMENTS_EDIT_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback?.(true, response.data);
          } else {
            response && handleApiError(response);
            return callback?.(false);
          }
        },
        {
          status: "Paid",
          amount,
          payment_type: paymentType,
          transaction_id: transactionId,
          payment_date: paymentDate,
          // meeting_link: meetingLink,
          ...(visitType && { visit_type: visitType }),
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback?.(false);
    }
  };

  const rejectPayment = async (
    id: string,
    amount: string,
    paymentType: "link" | "Bank Transfer",
    callback?: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put<any>(
        `${ONLINE_APPOINTMENTS_EDIT_URL}/${id}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback?.(true, response.data);
          } else {
            response && handleApiError(response);
            return callback?.(false);
          }
        },
        {
          status: "Cancelled",
          amount,
          payment_type: paymentType,
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback?.(false);
    }
  };

  const onlineAppointmentGenerateLinkHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    // isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.post(
        `${ONLINE_APPOINTMENTS_GENERATE_LINK_URL_PREFIX}/${id}${ONLINE_APPOINTMENTS_GENERATE_LINK_URL_SUFFIX}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true, response?.data);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        // (status) => {
        //   isLoading?.(status);
        // },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  const onlineAppointmentResendLinkHandler = async (
    id: string,
    callback: ApiCallback,
    data?: any,
    // isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      await api.post(
        `${ONLINE_APPOINTMENTS_GENERATE_LINK_URL_PREFIX}/${id}${ONLINE_APPOINTMENTS_RESEND_LINK_URL_SUFFIX}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            return callback(true);
          } else {
            response && handleApiError(response);
            return callback(false);
          }
        },
        data,
        // (status) => {
        //   isLoading?.(status);
        // },
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
    onlineAppointmentsListHandler,
    onlineAppointmentDetailHandler,
    onlineAppointmentEditHandler,
    onlineAppointmentDeleteHandler,
    onlineAppointmentStatsHandler,
    sendPaymentLink,
    confirmPayment,
    rejectPayment,
    onlineAppointmentGenerateLinkHandler,
    onlineAppointmentResendLinkHandler,
    cleanUp,
  };
};
