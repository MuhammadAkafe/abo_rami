
export const CLIENT_ROUTES = {
    SIGN_IN: '/client/sign-in',
    HOME: '/',
    ADMIN: {
        DASHBOARD: '/client/Admin/Dashboard',
        SUPPLIERS: '/client/Admin/suppliers',
        TASKS: '/client/Admin/tasks',
    },
    SUPPLIER: {
        SIGN_IN: '/client/User/sign-in',
        DASHBOARD: '/client/User/Dashboard',
        SUPPLIERS: '/client/User/suppliers',
        TASKS: '/client/User/tasks',
    },
    Permission: '/client/Permission',
}

export const AUTH_STORAGE_KEYS = {
    SUPPLIER_TOKEN: 'supplierToken',
    SUPPLIER_DATA: 'supplierData',
    ADMIN_TOKEN: 'adminToken',
    ADMIN_DATA: 'adminData',
}


