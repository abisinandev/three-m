import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown, defaultMessage: string) => {
    if (isAxiosError(error) && error.response?.data?.message) {
        return error.response.data.message as string;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};