import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip for static / login
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/Login" ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const sid = req.cookies.get("sid")?.value;

  if (!sid) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  try {
    // 1) Get logged-in user
    const userRes = await fetch(
      `${API_BASE_URL}/api/method/frappe.auth.get_logged_user`,
      {
        headers: { Cookie: `sid=${sid}` },
        cache: "no-store",
      }
    );

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    const { message: email } = await userRes.json();

    if (!email || email === "Guest") {
      return NextResponse.redirect(new URL("/Login", req.url));
    }

    // 2) Get roles
    const roleRes = await fetch(
      `${API_BASE_URL}/api/method/frappe.core.doctype.user.user.get_roles?uid=${email}`,
      {
        headers: { Cookie: `sid=${sid}` },
        cache: "no-store",
      }
    );

    if (!roleRes.ok) return NextResponse.next();

    const roleData = await roleRes.json();
    const roles: string[] = roleData.message || [];

    // ===== RULE 1: System Manager → full access =====
    if (roles.includes("System Manager")) {
      return NextResponse.next();
    }

    // Remove default system roles
    const filteredRoles = roles.filter(
      (r) => !["All", "Desk User", "Website User", "Guest"].includes(r)
    );

    // ===== RULE 2: ONLY Interviewer =====
    const isOnlyInterviewer =
      filteredRoles.length === 1 && filteredRoles[0] === "Interviewer";

    if (isOnlyInterviewer) {
      // Allow only interview feedback page
      if (!pathname.startsWith("/candidate-feedback")) {
        return NextResponse.redirect(
          new URL("/candidate-feedback", req.url)
        );
      }
      return NextResponse.next();
    }

    // ===== RULE 3: Others → normal access =====
    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

