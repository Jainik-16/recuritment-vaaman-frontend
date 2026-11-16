// export const SITE_HR_ROLES = [
//     "Site HR User",
//     "Site HR Manager",
// ]

// export const SITE_HR_ALLOWED_ROUTES = [
//     "/home",
//     "/job-opening",
//     "/create-job",
//     "/upload-resumes",
//     "/candidates",
//     "/Event",
//     "/interview",
//     "/candidate-feedback",
//     "/feedback",
//     "/document-verify-list",
//     "/document-verify",
//     "/data_bank",
// ]

// export const isSiteHR = (roles: string[]): boolean => {
//     return roles.some((role) =>
//         SITE_HR_ROLES.includes(role)
//     )
// }

// export const canSiteHRAccessRoute = (pathname: string): boolean => {
//     return SITE_HR_ALLOWED_ROUTES.some(
//         (route) =>
//             pathname === route ||
//             pathname.startsWith(`${route}/`)
//     )
// }


export const SITE_HR_ROLES = [
    "Site HR User",
    "Site HR Manager",
]

// NEW: roles that do not give any extra access.
// Keep this in sync with BASIC_ROLES in permissions.py
export const BASIC_ROLES = [
    "User",
    "All",
    "Guest",
    "Desk User",
]

export const SITE_HR_ALLOWED_ROUTES = [
    "/home",
    "/job-opening",
    "/create-job",
    "/upload-resumes",
    "/candidates",
    "/Event",
    "/interview",
    "/candidate-feedback",
    "/feedback",
    "/document-verify-list",
    "/document-verify",
    "/data_bank",
]

export const isSiteHR = (roles: string[]): boolean => {
    return roles.some((role) =>
        SITE_HR_ROLES.includes(role)
    )
}

// NEW: true only when the user has a Site HR role
// and NO other meaningful role (basic roles are ignored).
// If the user has any bigger role, this returns false,
// so the user gets full access.
export const isSiteHROnly = (roles: string[]): boolean => {
    if (!isSiteHR(roles)) {
        return false
    }

    const otherRoles = roles.filter(
        (role) =>
            !SITE_HR_ROLES.includes(role) &&
            !BASIC_ROLES.includes(role)
    )

    return otherRoles.length === 0
}

export const canSiteHRAccessRoute = (pathname: string): boolean => {
    return SITE_HR_ALLOWED_ROUTES.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    )
}
