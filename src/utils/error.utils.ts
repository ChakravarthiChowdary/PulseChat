import { AxiosError } from "axios";
import { axios } from "../config/axios.config";
import { type ApiError } from "../types/auth.types";

export const ErrorUtils = {
  handleApiError: (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      return (
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred"
      );
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  },
};
