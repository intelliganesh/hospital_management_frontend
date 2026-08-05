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
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${baseUrl}${url}/${id}?type=${type}${surgery_id ? `&ipd_surgery_id=${surgery_id}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      if (!response.ok) {
        handleApiError(response);
        throw new Error(`Failed to fetch download link: ${response.status}`);
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
