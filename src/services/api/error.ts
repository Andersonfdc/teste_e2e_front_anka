// Backend error types
export interface BackendError {
  message: string;
  statusCode: number;
  code: string;
  details?: string;
}

export interface ApiErrorResponse {
  error: BackendError;
}

// Custom error class for API errors
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: string;

  constructor(backendError: BackendError) {
    super(backendError.message);
    this.name = "ApiError";
    this.statusCode = backendError.statusCode;
    this.code = backendError.code;
    this.details = backendError.details;
  }
}
