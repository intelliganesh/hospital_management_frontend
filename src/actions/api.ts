import axios, { AxiosResponse } from "axios";
import { ConfigProps, Headers } from "@/interfaces/api";
import { REFRESH_TOKEN_URL } from "@/utils/urls/backend";
import { LoadingStatus } from "@/interfaces";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 65000,
});

/* class of hospital management (Parent) */
class HospitalManagement {
  private isSystemActive: boolean;
  private isOnline: boolean = navigator.onLine;
  constructor() {
    this.isSystemActive = false;
    window.addEventListener("online", () => this.updateOnlineStatus(true));
    window.addEventListener("offline", () => this.updateOnlineStatus(false));
  }

  /** Cleans up event listeners */
  public cleanup(): void {
    window.removeEventListener("online", () => this.updateOnlineStatus(true));
    window.removeEventListener("offline", () => this.updateOnlineStatus(false));
  }

  // Update online status based on browser events
  private updateOnlineStatus(status: boolean): void {
    this.isOnline = status;
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public activateSystem(): void {
    this.isSystemActive = true;
  }

  public isActive(): boolean {
    return this.isSystemActive;
  }
}

/* class for system requirement */
class SystemRequrements extends HospitalManagement {
  constructor() {
    super();
  }
  public checkSystemStatus(): boolean {
    return this.getOnlineStatus();
  }
}

/* class of api (Child) */
class LaunchApi extends HospitalManagement {
  private controllers: { [key: string]: AbortController };
  private interceptorId: number | null = null;
  private refreshPromise: Promise<void> | null = null;
  private isRefreshing: boolean = false;

  constructor() {
    super();
    this.controllers = {};
    this.setupTokenRefreshInterceptor();
  }

  /*
   * setupTokenRefreshInterceptor
   * Setup interceptor to refresh token before API calls if token is near expiration
   */
  // In the setupTokenRefreshInterceptor method, replace the token expiration check section:

  // In the setupTokenRefreshInterceptor method, replace the token expiration check section:

  // Add this helper function to decode JWT
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  private setupTokenRefreshInterceptor() {
    this.interceptorId = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = localStorage.getItem("token");

          if (token) {
            // Decode token to get actual expiration
            const decodedToken = this.decodeToken(token);

            if (decodedToken && decodedToken.exp) {
              const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
              const expiresAt = decodedToken.exp; // Token expiry in seconds
              // console.log("Token expires at asdsada:", expiresAt);
              const timeUntilExpiry = expiresAt - currentTime;
              // console.log("Time until expiry:", timeUntilExpiry , currentTime);
              const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);
              // console.log("Minutes until expiry:", minutesUntilExpiry);

              // Refresh token 10 minutes before it expires
              const SAFETY_BUFFER_MINUTES = 15;

              // console.log("Token expires in:", minutesUntilExpiry, "minutes");
              // console.log(
              //   "Current time:",
              //   new Date(currentTime * 1000).toISOString()
              // );
              // console.log(
              //   "Token expiry time:",
              //   new Date(expiresAt * 1000).toISOString()
              // );

              if (minutesUntilExpiry <= SAFETY_BUFFER_MINUTES) {
                // console.log(
                //   "%c[TOKEN REFRESH] Token expiring soon, refreshing...",
                //   "color: orange"
                // );
                await this.refreshToken();

                const newToken = localStorage.getItem("token");
                if (newToken && config.headers) {
                  config.headers.Authorization = "Bearer " + newToken;
                }
              }
            } else {
              console.error("Failed to decode token or no exp claim found");
            }
          }
        } catch (error) {
          console.error("[INTERCEPTOR ERROR] Token refresh failed:", error);
          this.handleAuthError();
          return Promise.reject(error);
        }
        return config;
      },
      (error) => {
        console.error("[INTERCEPTOR ERROR] Request error:", error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh the authentication token
   */
  private async refreshToken(): Promise<void> {
    // console.log("%c[REFRESH] Refresh function entered", "color: yellow");

    if (this.isRefreshing && this.refreshPromise) {
      // console.log(
      //   "%c[REFRESH] Already refreshing → return existing promise",
      //   "color: gray"
      // );
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("[REFRESH] Old token:", token);

        if (!token) {
          console.error("[REFRESH] ERROR: No token found");
          throw new Error("No token found");
        }

        // console.log(
        //   "[REFRESH] Sending refresh request to:",
        //   import.meta.env.VITE_BASE_URL + REFRESH_TOKEN_URL
        // );

        const response = await axios({
          method: "POST",
          url: import.meta.env.VITE_BASE_URL + REFRESH_TOKEN_URL,
          headers: { "Content-Type": "application/json" },
          data: { token },
        });

        // console.log("[REFRESH RESPONSE] Status:", response.status);
        // console.log("[REFRESH RESPONSE] RAW:", response.data);

        const tokenData = response?.data?.data?.token?.api_key?.original;

        // console.log("[REFRESH TOKEN DATA]", tokenData);

        if (tokenData?.token) {
          const currentDate = new Date().toString();
          const decodedToken = this.decodeToken(tokenData.token);

          localStorage.setItem("date", currentDate);
          localStorage.setItem("token", tokenData.token);

          // Store actual expiration from decoded token, not from response
          if (decodedToken?.exp) {
            const actualExpiresInMinutes = Math.floor(
              (decodedToken.exp - Math.floor(Date.now() / 1000)) / 60
            );
            localStorage.setItem(
              "expires_in",
              actualExpiresInMinutes.toString()
            );
          }

          // console.log("%c[REFRESH SUCCESS] Token updated!", "color: green");
        } else {
          console.error("[REFRESH ERROR] Invalid refresh structure");
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("%c[REFRESH FAILED]", "color: red", error);
        this.handleAuthError();
        throw error;
      } finally {
        console.log("%c[REFRESH] Refresh completed", "color: lightblue");
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * cleanup for duplicate axios instance.
   * super.cleanup() same feature for parent class.
   */
  public cleanup(): void {
    if (this.interceptorId !== null) {
      axiosInstance.interceptors.request.eject(this.interceptorId);
      this.interceptorId = null;
    }
    for (const path in this.controllers) {
      this.controllers[path].abort();
      delete this.controllers[path];
    }
    super.cleanup();
  }

  /**
   * getHeaders Performs setting header for api.
   * @param path - The API endpoint path
   */
  private getHeaders(
    path: string,
    type: "application/json" | "multipart/form-data" = "application/json"
  ): Headers {
    const contentType: Headers["Content-Type"] = type;
    let headers: Headers = {
      "Content-Type": contentType,
    };
    if (path !== "/login") {
      const token = localStorage.getItem("token");
      let date: any = new Date().toString();
      headers = {
        ...headers,
        Authorization: "Bearer " + token,
        TimeZone: date.match(/\(([A-Za-z\s].*)\)/)[1],
        IpAddress: "",
      };
    }

    return headers;
  }

  private handleAuthError() {
    localStorage.clear();
    window.location.href = "/";    
  }

  private catchBlock(
    error: any,
    path: string,
    callback: (data: any, success: boolean, statusCode: number) => void
  ) {
    const { status, data } = error?.response || {};
    switch (status) {
      case 401:
        if (localStorage.getItem("token")) {
          this.handleAuthError();
        }
        break;
      case 403:
        if (path !== "login") {
          this.handleAuthError();
        }
        break;
      case 500:
        callback(data, false, status);
        break;
      default:
        callback(data, false, status);
        break;
    }
  }

  /**
   * getController Performs to cancel api request.
   * @param path - The API endpoint path
   */
  private getController(path: string): AbortController {
    if (this.controllers[path]) {
      this.controllers[path].abort();
    }
    const controller = new AbortController();
    this.controllers[path] = controller;
    return controller;
  }

  private clearController(path: string): void {
    delete this.controllers[path];
  }

  multiformData<T>(
    path: string,
    data: {
      id: string;
      image: File;
      modal_type: string;
      file_name: string;
      folder_name: string;
    },
    callback: (data: T, success: boolean, statusCode: number) => void
  ) {
    if (!this.getOnlineStatus()) {
      console.warn("System is offline, POST request aborted");
      callback(null as any, false, 0);
      return;
    }

    const controller = this.getController(path);

    const config: ConfigProps = {
      url: path,
      method: "post",
      headers: this.getHeaders(path, "multipart/form-data"),
      data: data,
      signal: controller.signal,
      withCredentials: true,
    };

    axiosInstance
      .request(config)
      .then((res: AxiosResponse<T>) => {
        callback(res.data as T, true, res.status);
        this.clearController(path);
      })
      .catch((error) => {
        this.catchBlock(error, path, (data, success, statusCode) => {
          callback(data, success, statusCode);
          this.clearController(path);
        });
      });
  }

  /**
   * Performs a GET request to the specified path.
   * @param path - The API endpoint path
   * @param callback - Callback function to handle the response
   * @param params - Optional query parameters
   */
  get<T>(
    path: string,
    callback: (data: T, success: boolean, statusCode: number) => void,
    params?: string,
    isLoading?: (status: LoadingStatus) => void
  ) {
    if (!this.getOnlineStatus()) {
      console.warn("System is offline, GET request aborted");
      callback(null as any, false, 0);
      return;
    }
    const controller = this.getController(path);
    let config: ConfigProps = {
      url: path,
      method: "get",
      headers: this.getHeaders(path, "application/json"),
      signal: controller.signal,
      withCredentials: true,
    };
    if (params !== undefined) {
      config["params"] = params;
    }
    isLoading?.("pending");
    axiosInstance
      .request(config)
      .then((res: AxiosResponse<T>) => {
        callback(res.data as T, true, res.status);
        this.clearController(path);
        isLoading?.("success");
      })
      .catch((error) => {
        this.catchBlock(error, path, (data, success, statusCode) => {
          callback(data, success, statusCode);
          this.clearController(path);
          isLoading?.("failed");
        });
      });
  }

  /**
   * Performs a POST request to the specified path.
   * @param path - The API endpoint path
   * @param callback - Callback function to handle the response
   * @param data - Payload
   */
  post<TResponse, TRequest = unknown>(
    path: string,
    callback: (data: TResponse, success: boolean, statusCode: number) => void,
    data?: TRequest
  ) {
    if (!this.getOnlineStatus()) {
      console.warn("System is offline, POST request aborted");
      callback(null as any, false, 0);
      return;
    }
    const controller = this.getController(path);
    let config: ConfigProps = {
      url: path,
      data: data,
      method: "post",
      headers: this.getHeaders(path),
      signal: controller.signal,
      withCredentials: true,
    };
    axiosInstance
      .request(config)
      .then((res: AxiosResponse<TResponse>) => {
        callback(res.data as TResponse, true, res.status);
        this.clearController(path);
      })
      .catch((error) => {
        this.catchBlock(error, path, (data, success, statusCode) => {
          callback(data, success, statusCode);
          this.clearController(path);
        });
      });
  }

  /**
   * Performs a PUT request to the specified path.
   * @param path - The API endpoint path
   * @param callback - Callback function to handle the response
   * @param data - Payload
   */
  put<T>(
    path: string,
    callback: (data: T, success: boolean, statusCode: number) => void,
    data: T
  ) {
    if (!this.getOnlineStatus()) {
      console.warn("System is offline, PUT request aborted");
      callback(null as any, false, 0);
      return;
    }
    const controller = this.getController(path);
    let config: ConfigProps = {
      url: path,
      data: data,
      method: "put",
      headers: this.getHeaders(path),
      signal: controller.signal,
      withCredentials: true,
    };
    axiosInstance
      .request(config)
      .then((res: AxiosResponse<T>) => {
        callback(res.data as T, true, res.status);
        this.clearController(path);
      })
      .catch((error) => {
        this.catchBlock(error, path, (data, success, statusCode) => {
          callback(data, success, statusCode);
          this.clearController(path);
        });
      });
  }

  /**
   * Performs a PATCH request to the specified path.
   * @param path - The API endpoint path
   * @param callback - Callback function to handle the response
   * @param data - Payload
   */
  patch<T>(
    path: string,
    callback: (data: T, success: boolean, statusCode: number) => void,
    data: T
  ) {
    if (!this.getOnlineStatus()) {
      console.warn("System is offline, PATCH request aborted");
      callback(null as any, false, 0);
      return;
    }
    const controller = this.getController(path);
    let config: ConfigProps = {
      url: path,
      data: data,
      method: "put",
      headers: this.getHeaders(path),
      signal: controller.signal,
      withCredentials: true,
    };
    axiosInstance
      .request(config)
      .then((res: AxiosResponse<T>) => {
        callback(res.data as T, true, res.status);
        this.clearController(path);
      })
      .catch((error) => {
        this.catchBlock(error, path, (data, success, statusCode) => {
          callback(data, success, statusCode);
          this.clearController(path);
        });
      });
  }

  /**
   * Performs a DELETE request to the specified path.
   * @param path - The API endpoint path
   * @param id - Id of the row
   * @param callback - Callback function to handle the response
   */
  delete<T>(
    path: string,
    id: string,
    callback: (data: T, success: boolean, statusCode: number) => void,
    isLoading?: (status: LoadingStatus) => void
  ) {
    if (!this.getOnlineStatus()) {
      console.warn("System is offline, DELETE request aborted");
      callback(null as any, false, 0);
      return;
    }
    const controller = this.getController(path);
    let config: ConfigProps = {
      method: "delete",
      url: id ? `${path}/${id}` : path,
      headers: this.getHeaders(path),
      signal: controller.signal,
      withCredentials: true,
    };
    isLoading?.("pending");
    axiosInstance
      .request(config)
      .then((res: AxiosResponse<T>) => {
        callback(res.data as T, true, res.status);
        this.clearController(path);
        isLoading?.("success");
      })
      .catch((error) => {
        this.catchBlock(error, path, (data, success, statusCode) => {
          callback(data, success, statusCode);
          this.clearController(path);
          isLoading?.("failed");
        });
      });
  }
}

export default LaunchApi;
export { SystemRequrements };
