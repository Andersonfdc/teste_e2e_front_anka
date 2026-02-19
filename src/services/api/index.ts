import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/env";
import { getCookie, setCookie } from "cookies-next";

let api: AxiosInstance;
let publicApi: AxiosInstance;

switch (env.NEXT_PUBLIC_ENV) {
  case "prod":
    api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL_PROD });
    publicApi = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL_PROD });
    break;
  case "dev":
    api = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL_DEV });
    publicApi = axios.create({ baseURL: env.NEXT_PUBLIC_API_URL_DEV });
    break;
  default:
    api = axios.create({ baseURL: "http://localhost:3333/api/v1/dev" });
    publicApi = axios.create({ baseURL: "http://localhost:3333/api/v1/dev" });
}

// ===== REQUEST INTERCEPTOR — add token =====
api.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    } else {
      const token = getCookie("token");

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== REQUEST INTERCEPTOR — add api key to public endpoints =====
publicApi.interceptors.request.use(
  (config) => {
    console.log("publicApi.interceptors.request: adding api key");
    config.headers["x-api-key"] = env.NEXT_PUBLIC_API_KEY;
    return config;
  },
  (error) => Promise.reject(error),
);

type FailedRequestQueueItem = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

let isRefreshing = false;
const failedRequestQueue: FailedRequestQueueItem[] = [];

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      let refreshToken: string | undefined;
      let userId: string | undefined;

      // Handle server vs client side cookie retrieval
      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        refreshToken = cookieStore.get("refreshToken")?.value;
        userId = cookieStore.get("userId")?.value;
      } else {
        refreshToken = getCookie("refreshToken") as string;
        userId = getCookie("userId") as string;
      }

      // Don't attempt token refresh for login requests
      if (error.config?.url?.includes("/auth/login")) {
        throw error;
      }

      // If there's no refresh token or userId, reject immediately to allow consumers to handle auth
      if (!refreshToken || !userId) {
        console.log(
          "api.interceptors.response: 401 without refreshToken/userId, rejecting error",
        );
        throw error;
      }

      if (!isRefreshing && refreshToken && userId) {
        isRefreshing = true;

        publicApi
          .post("/auth/refresh-token", {
            token: refreshToken,
            userId: userId,
          })
          .then((response) => {
            // Handle server vs client side cookie setting
            if (typeof window === "undefined") {
              // Server side - cookies will be set by the response headers
              // The server will handle setting cookies via Set-Cookie headers
            } else {
              // Client side - set cookies directly
              setCookie("token", response.data.token);
            }

            api.defaults.headers.authorization = `Bearer ${response.data.token}`;

            failedRequestQueue.forEach((request) => {
              request.onSuccess(response.data.token);
            });
            failedRequestQueue.length = 0;
          })
          .catch((err) => {
            failedRequestQueue.forEach((request) => {
              request.onFailure(err);
            });
            failedRequestQueue.length = 0;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: (token: string) => {
            if (error.config) {
              error.config.headers.set("Authorization", `Bearer ${token}`);
              resolve(api(error.config));
            }
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    } else {
      throw error;
    }
  },
);

export default api;
export { publicApi };
