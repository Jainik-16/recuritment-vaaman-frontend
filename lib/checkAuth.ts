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



// import { API_BASE_URL } from "./api-config";
// export async function checkAuth() {
//   const res = await fetch(`${API_BASE_URL}/api/method/frappe.auth.get_logged_user`, {
//     credentials: "include",
//     cache: "no-store"
//   });
//   // const res = await fetch(`${API_BASE_URL}/api/method/frappe.auth.get_logged_user`, {
//   //   credentials: "include",
//   //   cache: "no-store"
//   // });

//   console.log(res);

//   if (!res.ok) return null;

//   const data = await res.json();
//   console.log('hello1', data);

//   return data.message;
// }
// checkAuth.ts

// export const checkAuth = async () => {
//   const getAuthHeaders = () => ({
//       'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
//     })
//   try {
//     const response = await fetch('/api/method/frappe.auth.get_logged_user', {
//       method: 'GET',
//       // credentials: 'include', // Crucial for sending the cookie
//       headers: {
//         'Content-Type': 'application/json',
//         ...getAuthHeaders() // Include auth headers if needed
//       }
//     });

//     // 1. DEFENSIVE CHECK: Did we get redirected to the login page?
//     if (response.redirected && response.url.includes('/Login')) {
//       console.warn("User is not authenticated. Redirected to Login.");
//       // Handle the unauthenticated state here (e.g., return null or push to router)
//       return null; 
//     }

//     // 2. DEFENSIVE CHECK: Is the response actually JSON?
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       console.error("Expected JSON but received HTML. Auth check failed.");
//       return null;
//     }

//     // 3. SAFE TO PARSE: We know it's JSON now
//     if (response.ok) {
//       const data = await response.json();
//       return data.message; // Frappe wraps successful responses in a "message" object
//     } else {
//        // Handle 401/403 Unauthorized errors from Frappe
//        return null;
//     }

//   } catch (error) {
//     console.error("Auth Fetch Error:", error);
//     return null;
//   }
// };