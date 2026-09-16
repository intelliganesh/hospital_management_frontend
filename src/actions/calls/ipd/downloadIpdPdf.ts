import React from "react";
import { ApiCallback } from "@/interfaces/api";
import { handleApiError } from "@/utils/errorHandler";
import LaunchApi from "@/actions/api";

const api = new LaunchApi();

export const useDownloadIpdPdf = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAndDownloadPdf = async <T>(
    id: T,
    url: string,
    type: string,
    callback: ApiCallback,
    surgery_id?: string,
    payload?: Record<string, string | number | undefined | null>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const queryParams = new URLSearchParams({ type });

      if (surgery_id) {
        queryParams.append("ipd_surgery_id", surgery_id);
      }

      Object.entries(payload || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(
        `${baseUrl}${url}/${id}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, application/pdf",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok) {
        handleApiError(response);
        throw new Error(`Failed to fetch download link: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/pdf")) {
        const blob = await response.blob();
        const fileUrl = window.URL.createObjectURL(blob);
        const opened = window.open(fileUrl, "_blank");

        if (!opened) {
          callback(false, { success: false, error: "Unable to open PDF" });
          window.URL.revokeObjectURL(fileUrl);
          return;
        }

        setTimeout(() => window.URL.revokeObjectURL(fileUrl), 60_000);
        callback(true);
        return;
      }

      const data = await response.json();

      if (data?.data?.url) {
        window.open(data.data.url, "_blank");
        callback(true);
      } else {
        callback(false, { success: false, error: "Download URL missing" });
      }
    } catch (error) {
      handleApiError(error);
      callback(false, { success: false, error: "Unexpected error" });
    } finally {
      setIsLoading(false);
    }
  };

  const cleanUp = () => {
    api.cleanup();
  };

  return {
    fetchAndDownloadPdf,
    isLoading,
    cleanUp,
  };
};
