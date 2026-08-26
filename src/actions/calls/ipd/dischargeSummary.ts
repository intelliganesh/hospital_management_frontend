import { useDispatch } from "react-redux";
import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { DISCHARGE_SUMMARY_DETAIL_URL, UPDATE_DISCHARGE_SUMMARY_URL } from "@/utils/urls/backend";
import { dischargeSummaryDetailSlice } from "@/actions/slices/dischargeSummary";

const api = new LaunchApi();

export const useDischargeSummary = () => {
    const dispatch = useDispatch();

    const updateDischargeSummary = async (
        id: string,
        data: any,
        callback: ApiCallback
    ): Promise<void> => {
        try {
            await api.put(
                `${UPDATE_DISCHARGE_SUMMARY_URL}/${id}`,
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

    const dischargeSummaryDetail = async (
        id: string,
        callback: ApiCallback
    ): Promise<void> => {
        try {
            await api.get(
                `${DISCHARGE_SUMMARY_DETAIL_URL}/${id}`,
                (response: AuthPayload, success: boolean, statusCode: number) => {
                    if (success && statusCode === 200) {
                        dispatch(dischargeSummaryDetailSlice(response.data));
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
        updateDischargeSummary,
        dischargeSummaryDetail,
        cleanUp,
    };
};
