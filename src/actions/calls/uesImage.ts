import LaunchApi from "@/actions/api";
import { ApiCallback } from "@/interfaces/api";
import { IMAGES_URL } from "@/utils/urls/backend";
import { AuthPayload } from "@/interfaces/slices/auth";
import { handleApiError } from "@/utils/errorHandler";

const api = new LaunchApi();
export const imageUpload = async (
  data: any,
  callback: ApiCallback
): Promise<void> => {
  try {
    await api.multiformData(
      IMAGES_URL,
      data,
      (response: AuthPayload, success: boolean, statusCode: number) => {
        if (success && statusCode === 200) {
          return callback(true, { success: true });
        } else if (statusCode && statusCode !== 204) {
          handleApiError(response);
          return callback(false, { success: false });
        }
      }
    );
  } catch (error) {
    // console.error(error);
    handleApiError(error);
    callback(false, { success: false });
  }
};
