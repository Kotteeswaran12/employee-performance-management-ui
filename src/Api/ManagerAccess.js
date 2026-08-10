import api from "./api";

export const ManagerDashBorad = (jwt) => {
    return api.get("/manager/dash-board", {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const GetAllTaskAssigned = (jwt, P = 0, S = 10) => {
    return api.get(`/taskAssignment/manager?page=${P}&size=${S}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const GetAllEmployees = (JWT, P = 0, S = 10) => {
    return api.get(`/employee?page=${P}&size=${S}`, {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const countAllTheTaskAssignment = (JWT) => {
    return api.get("/CountAllTaskByStatus", {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const addEmployee = (Jwt, data) => {
    return api.post('/employee', data, {
        headers: {
            Authorization: `Bearer ${Jwt}`
        }
    })
}

export const CreateTask = (jwt, data) => {
    return api.post('/task', data, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const Assigntask = (Jwt, Duedate, empCode, taskId) => {
    return api.post(`/taskAssignment/${taskId}?dueDate=${Duedate}&employeeCode=${empCode}`, null, {
        headers: {
            Authorization: `Bearer ${Jwt}`
        }
    })
}

export const updateLeaveStatus = (Jwt , status) => {
    return api.post(`/leave?id=1&leaveStatus=${status}` , null , {
        headers : {
            Authorization : `Bearer ${Jwt}`
        }
    })
}
