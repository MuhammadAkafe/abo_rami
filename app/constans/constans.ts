
export const CLIENT_ROUTES = {
    AdminSignIn: '/client/AdminLogin',
    HOME: '/',
    ADMIN: {
        DASHBOARD: '/client/Admin/Dashboard',
        SUPPLIERS: '/client/Admin/suppliers',
        TASKS: '/client/Admin/tasks',
    },
    USER: {
        SIGN_IN: '/client/UserLogin',
        DASHBOARD: '/client/User/Dashboard',
        SUPPLIERS: '/client/User/suppliers',
        TASKS: '/client/User/tasks',
    },
    Permission: '/client/Permission',
}


export const API_ROUTES = {
    ADMIN: {
        ADD_SUPPLIER: '/api/ADMIN/AddSupplier',
        ADD_TASK: '/api/ADMIN/AddTask',
        DELETE_TASK: '/api/ADMIN/DeleteTask',
    },
    USER: {
        updateTask: '/api/USER/UpdateTask',
    },
    Packages: {
        FILTER_TASKS: '/api/tasks/FillterTasks',
        GET_TASK: '/api/tasks',
    },
}
