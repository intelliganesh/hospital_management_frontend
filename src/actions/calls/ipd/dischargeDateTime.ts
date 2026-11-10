import LaunchApi from "../../api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { GENERIC_ERROR_MESSAGE } from "@/utils/message";
import { handleApiError } from "@/utils/errorHandler";
import { IPD_UPDATE_DISCHARGE_DATETIME_URL } from "@/utils/urls/backend";

const api = new LaunchApi();

/** Roles allowed (by the API) to correct the discharge date & time of a discharged IPD patient. */
export const DISCHARGE_EDIT_ROLES = ["Front Desk User", "Admin", "Super Admin"];

export const useIpdDischargeDateTime = () => {
  /**
   * PUT /ipd_update_discharge_datetime/{ipdId}
   * @param dischargeDateTime "YYYY-MM-DD HH:mm:ss"
   */
  const updateDischargeDateTimeHandler = async (
    ipdId: string,
    dischargeDateTime: string,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.put(
        `${IPD_UPDATE_DISCHARGE_DATETIME_URL}/${ipdId}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true, response?.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
        { discharge_date_time: dischargeDateTime } as any,
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return { updateDischargeDateTimeHandler, cleanUp };
};
