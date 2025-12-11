import { API_BASE_URL } from "./api-config";
export async function getFrappeCSRF() {
    // 1. Fetch the root URL (or /app) to get the HTML
    const res = await fetch(`${API_BASE_URL}/api/method/resume.api.csrf.get_csrf_token`, {
        method: "GET",
        credentials: "include", // Essential: sends the 'sid' cookie
    });
    const csrf = await res.json();

    if (!res.ok) {
        throw new Error("Failed to fetch Frappe application page");
    }

    return csrf.message;
}