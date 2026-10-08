// import { csrfToken } from '@/lib/csrf-cookies';
export const axiosConfig = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // 'X-Frappe-CSRF-Token': csrfToken,
    },
}

export const axiosConfigMultipart = {
    withCredentials: true,
    headers: {
        withCredentials: true,
        // 'X-Frappe-CSRF-Token': csrfToken,
    },
}



