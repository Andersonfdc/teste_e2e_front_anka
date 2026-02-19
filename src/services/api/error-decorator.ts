import { AxiosError } from "axios";
import { BackendError, ApiError, ApiErrorResponse } from "./error";

/**
 * Handles API errors by parsing backend error responses and throwing ApiError instances
 * @param error - The error caught from an API call
 * @throws {ApiError} - Structured error with backend error details
 */
function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    // Check if the error response has the backend error structure
    if (error.response?.data) {
      const errorData = error.response.data;

      // Handle different backend error response formats
      if (errorData.message && errorData.code) {
        // Direct backend error format
        const backendError: BackendError = {
          message: errorData.message,
          statusCode: error.response.status,
          code: errorData.code,
          details: errorData.details,
        };
        throw new ApiError(backendError);
      } else if (errorData.error) {
        // Wrapped backend error format
        const apiErrorResponse = errorData as ApiErrorResponse;
        throw new ApiError(apiErrorResponse.error);
      } else if (typeof errorData === "string") {
        // String error message
        const backendError: BackendError = {
          message: errorData,
          statusCode: error.response.status,
          code: "UNKNOWN_ERROR",
          details: undefined,
        };
        throw new ApiError(backendError);
      }
    }

    // Fallback for axios errors without structured backend errors
    const backendError: BackendError = {
      message: error.message || "Erro de conexão com o servidor",
      statusCode: error.response?.status || 500,
      code: "NETWORK_ERROR",
      details: undefined,
    };
    throw new ApiError(backendError);
  }

  // Fallback for non-axios errors
  const backendError: BackendError = {
    message: error instanceof Error ? error.message : "Erro desconhecido",
    statusCode: 500,
    code: "UNKNOWN_ERROR",
    details: undefined,
  };
  throw new ApiError(backendError);
}

/**
 * Method decorator that wraps service methods to handle API errors consistently
 */
export function HandleApiErrors<T extends object, K extends keyof T>(
  target: T,
  propertyKey: K,
  descriptor: TypedPropertyDescriptor<T[K]>,
): TypedPropertyDescriptor<T[K]> | void {
  if (typeof descriptor.value !== "function") {
    return;
  }

  const originalMethod = descriptor.value as unknown as (
    ...args: unknown[]
  ) => Promise<unknown>;

  descriptor.value = async function (this: T, ...args: unknown[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      handleApiError(error);
    }
  } as unknown as T[K];

  return descriptor;
}

export { handleApiError };
