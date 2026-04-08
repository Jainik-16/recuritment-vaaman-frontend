export const getApiBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002';
};

export const getFrappeBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_FRAPPE_BASE_URL || getApiBaseUrl();
};

export const API_BASE_URL = getApiBaseUrl();
export const FRAPPE_BASE_URL = getFrappeBaseUrl();
