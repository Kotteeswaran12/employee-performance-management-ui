import api from "./api";

export const ManagerDashBorad = (jwt) => {
    return api.get("/manager/dash-board", {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const GetAllTaskAssigned = (jwt ,  P, S) => {
    return api.get(`/taskAssignment/manager?page=${P}&size=${S}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const GetAllEmployees = (JWT, P, S) => {
    return api.get(`/employee?page=${P}&size=${S}`, {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}