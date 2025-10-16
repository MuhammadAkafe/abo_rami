
export const CLIENT_ROUTES = {
    SIGN_IN: '/client/sign-in',
    CHECK_ROLE: '/client/CheckRole',
    ADMIN: {
        DASHBOARD: '/client/ADMIN/AdminDashboard',
        SUPPLIERS: '/client/ADMIN/suppliers',
        TASKS: '/client/ADMIN/tasks',
    },
    USER: {
        DASHBOARD: '/client/USER/UserDashboard',
        SUPPLIERS: '/client/USER/suppliers',
        TASKS: '/client/USER/tasks',
    },
    UNAUTHORIZED: '/client/Unauthorized',
}