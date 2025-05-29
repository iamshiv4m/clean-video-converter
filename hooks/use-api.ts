import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  requestInterceptor,
  responseInterceptor,
  errorInterceptor,
} from "@/lib/react-query";
import axios from "axios";

type ApiConfig = {
  baseURL?: string;
  headers?: Record<string, string>;
};

const defaultConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://stage-api.penpencil.co/",
  headers: {
    "Content-Type": "application/json",
  },
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://stage-api.penpencil.co/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const fetchWithInterceptors = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const config = {
      ...defaultConfig,
      ...options,
      headers: {
        ...defaultConfig.headers,
        ...options.headers,
      },
    };

    try {
      // Apply request interceptor
      const interceptedConfig = await requestInterceptor(config);

      const response = await fetch(
        `${config.baseURL}${url}`,
        interceptedConfig as RequestInit
      );

      // Apply response interceptor
      const interceptedResponse = await responseInterceptor(response);

      if (!interceptedResponse.ok) {
        // Attempt to read response body for more detailed error
        const errorBody = await interceptedResponse.json().catch(() => null);
        const error = new Error(
          `HTTP error! status: ${interceptedResponse.status}`
        );
        // Attach the error body if available
        (error as any).body = errorBody;
        throw error;
      }

      return interceptedResponse.json();
    } catch (error) {
      // Apply error interceptor
      return errorInterceptor(error);
    }
  };

  const useApiQuery = <TData = unknown, TError = unknown>(
    key: string[],
    url: string,
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
  ) => {
    return useQuery<TData, TError>({
      queryKey: key,
      queryFn: () => fetchWithInterceptors(url),
      ...options,
    });
  };

  const useApiMutation = <
    TData = unknown,
    TVariables = unknown,
    TError = unknown
  >(
    url: string,
    options?: Omit<
      UseMutationOptions<TData, TError, TVariables>,
      "mutationFn"
    > & { fetchOptions?: RequestInit }
  ) => {
    const { fetchOptions, ...mutationOptions } = options || {};

    return useMutation<TData, TError, TVariables>({
      mutationFn: (variables) =>
        fetchWithInterceptors(url, {
          method: "POST",
          body: JSON.stringify(variables),
          ...fetchOptions,
        } as RequestInit),
      ...mutationOptions,
    });
  };

  return {
    useApiQuery,
    useApiMutation,
    fetch: fetchWithInterceptors,
  };
};
