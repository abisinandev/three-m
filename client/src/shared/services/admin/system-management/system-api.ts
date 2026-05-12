import adminApi from "@/lib/axios-admin";
import { SYSTEM_LOGS } from "@/shared/constants/adminConstants";

export interface IJobLog {
    id: string;
    jobName: string;
    status: 'RUNNING' | 'SUCCESS' | 'FAILED';
    startTime: string;
    endTime?: string;
    duration?: number;
    processedCount: number;
    failedCount: number;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface IJobLogsResponse {
    logs: IJobLog[];
    total: number;
}

export const getJobLogs = async (params: { jobName?: string; status?: string; page?: number; limit?: number }) => {
    const { data } = await adminApi.get(SYSTEM_LOGS, { params });
    return data.data as IJobLogsResponse;
};

export const getJobLogDetail = async (id: string) => {
    const { data } = await adminApi.get(`${SYSTEM_LOGS}/${id}`);
    return data.data as IJobLog;
};
