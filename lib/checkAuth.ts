import { API_BASE_URL } from "./api-config";
export async function checkAuth() {
  const res = await fetch(`${API_BASE_URL}/api/method/frappe.auth.get_logged_user`, {
    credentials: "include",
    cache: "no-store"
  });

  console.log(res);

  if (!res.ok) return null;

  const data = await res.json();
  console.log('hello1', data);

  return data.message;
}
