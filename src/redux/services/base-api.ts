import TagTypes from "@/src/constants/tagTypes.constant";
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface BaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

const handleLogout = async () => {
  // await SecureStore.deleteItemAsync("token");
  // await SecureStore.deleteItemAsync("refreshToken");
};

const baseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  { status: number; data: any }
> = async (args) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const isFormData = args.body instanceof FormData;

    if (isFormData) {
      const response = await fetch(`${BASE_URL}${args.url}`, {
        method: args.method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(args.headers || {}),
        },
        body: args.body,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { status: response.status, data } };
      }

      return { data };
    }

    const result = await axios({
      baseURL: BASE_URL,
      url: args.url,
      method: args.method,
      data: args.body,
      params: args.params,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(args.headers || {}),
      },
    });

    return { data: result.data };
  } catch (err) {
    const error = err as AxiosError;
    return {
      error: {
        status: error.response?.status || 500,
        data:
          error.response?.data || error.message || "Unexpected server error",
      },
    };
  }
};

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

const processQueue = (newToken: string) => {
  pendingRequests.forEach((resolve) => resolve(newToken));
  pendingRequests = [];
};

const baseQueryWithReauth: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  { status: number; data: any }
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (!refreshToken) {
      await handleLogout();
      return result;
    }

    if (isRefreshing) {
      await new Promise<string>((resolve) => {
        pendingRequests.push(resolve);
      });
      return baseQuery(args, api, extraOptions);
    }

    isRefreshing = true;

    try {
      const refreshResult = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      const newAccessToken = refreshResult.data.data.accessToken;
      await SecureStore.setItemAsync("token", newAccessToken);

      processQueue(newAccessToken);

      result = await baseQuery(args, api, extraOptions);
    } catch {
      pendingRequests = [];
      await handleLogout();
    } finally {
      isRefreshing = false;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(TagTypes),
  endpoints: () => ({}),
});
