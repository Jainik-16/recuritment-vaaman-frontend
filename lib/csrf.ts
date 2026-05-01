import { API_BASE_URL } from "./api-config";
export async function getFrappeCSRF() {
    const res = await fetch(`${API_BASE_URL}/api/method/resume.api.csrf.get_csrf_token`, {
        method: "GET",
        credentials: "include",
    });
    const csrf = await res.json();

    if (!res.ok) {
        throw new Error(csrf?.exception || "Failed to fetch CSRF token");
    }

    return csrf.message;
}