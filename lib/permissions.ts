export const SITE_HR_ROLES = [
    "Site HR User",
    "Site HR Manager",
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

export const canSiteHRAccessRoute = (pathname: string): boolean => {
    return SITE_HR_ALLOWED_ROUTES.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    )
}