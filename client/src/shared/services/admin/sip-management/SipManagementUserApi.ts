import api from "@lib/axiosUser";

export const PauseSipStatus = async (sipId: string) => {
    const response = await api.patch(`/user/mutual-funds/sip/pause/${sipId}`);
    return response.data;
}
export const ResumeSipStatus = async (sipId: string) => {
    const response = await api.patch(`/user/mutual-funds/sip/resume/${sipId}`);
    return response.data;
}
export const CancelSipStatus = async (sipId: string) => {
    const response = await api.patch(`/user/mutual-funds/sip/cancel/${sipId}`);
    return response.data;
}