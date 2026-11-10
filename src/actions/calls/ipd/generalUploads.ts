import LaunchApi from "../../api";
import { ApiCallback } from "@/interfaces/api";
import { AuthPayload } from "@/interfaces/slices/auth";
import { GENERIC_ERROR_MESSAGE } from "@/utils/message";
import { handleApiError } from "@/utils/errorHandler";
import {
  IPD_GENERAL_UPLOAD_ADD_URL,
  IPD_GENERAL_UPLOAD_LIST_URL,
  IPD_GENERAL_UPLOAD_FILE_URL,
  IPD_GENERAL_UPLOAD_DELETE_URL,
} from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";
import { IpdGeneralUpload } from "@/interfaces/ipd/generalUploads";

const api = new LaunchApi();

export const useIpdGeneralUploads = () => {
  const listHandler = async (
    ipdId: string,
    category: string,
    callback: ApiCallback,
    isLoading?: (status: LoadingStatus) => void,
  ): Promise<void> => {
    try {
      const query = category ? `?category=${encodeURIComponent(category)}` : "";
      await api.get(
        `${IPD_GENERAL_UPLOAD_LIST_URL}/${ipdId}${query}`,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true, {
              success: true,
              data: (response?.data ?? []) as IpdGeneralUpload[],
            });
          } else {
            response && handleApiError(response);
            callback(false, { success: false, data: [] });
          }
        },
        undefined,
        (status) => isLoading?.(status),
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, data: [] });
    }
  };

  /** multipart POST: ipd_id, category, title, description, files[] */
  const uploadHandler = async (
    formData: FormData,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      // LaunchApi.multiformData forwards the data untouched with a multipart header (typed for imageUpload only)
      api.multiformData(
        IPD_GENERAL_UPLOAD_ADD_URL,
        formData as any,
        (response: any, success: boolean, statusCode: number) => {
          if (success && (statusCode === 200 || statusCode === 201)) {
            callback(true, response?.data);
          } else {
            response && handleApiError(response);
            callback(false, { success: false });
          }
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false, { success: false, error: GENERIC_ERROR_MESSAGE });
    }
  };

  const deleteHandler = async (
    id: string,
    callback: ApiCallback,
  ): Promise<void> => {
    try {
      await api.delete(
        IPD_GENERAL_UPLOAD_DELETE_URL,
        id,
        (response: AuthPayload, success: boolean, statusCode: number) => {
          if (success && statusCode === 200) {
            callback(true);
          } else {
            response && handleApiError(response);
            callback(false);
          }
        },
      );
    } catch (error) {
      error && handleApiError(error);
      callback(false);
    }
  };

  /**
   * Authenticated fetch of the stored file as a Blob (view in new tab / download).
   * Raw fetch because LaunchApi has no blob support (same approach as downloadIpdPdf).
   */
  const fetchFileBlob = async (id: string, download = false): Promise<Blob> => {
    const base = String(import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${base}${IPD_GENERAL_UPLOAD_FILE_URL}/${id}${download ? "?download=1" : ""}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    );
    if (!response.ok) {
      throw new Error(`Unable to load the file (${response.status})`);
    }
    return response.blob();
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return { listHandler, uploadHandler, deleteHandler, fetchFileBlob, cleanUp };
};
