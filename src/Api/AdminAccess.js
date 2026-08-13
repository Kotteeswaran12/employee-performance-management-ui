import api from './api';

export const AdminDashBoard = (JWT) => {
    return api.get("/admin/dash-board", {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}


export const getallLeaveRequest = (JWT , p=0 , s=3) => {
    return api.get(`/leaves?page=${p}&size=${s}`, {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const getAlltaskAssign = (JWT, page, size) => {
    return api.get(`/Tasks?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const getAllAdminDashboradDetails = (JWT) => {

    return api.get('/admin/dash-board', {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const countAlltheEmpByDept = (JWT) => {
    return api.get("/CountEmployeeByDept", {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const getAlltheDepartments = (JWT, p = 0, s = 5) => {
    return api.get(`/department?page=${p}&size=${s}`, {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    }
    )
}

export const addDepartment = (Jwt, data) => {
    return api.post(`/department`, data, {
        headers: {
            Authorization: `Bearer ${Jwt}`
        }

    })
}

export const DeleteDept = (Jwt, id) => {
    return api.delete(`/department/${id}`, {
        headers: {
            Authorization: `Bearer ${Jwt}`
        }
    })
}

export const getDeptbyId = (jwt, id) => {
    return api.get(`/department/${id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const updateDeptname = (jwt, name, id) => {
    return api.put(`/updateDept/${name}?id=${id}`, null, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const addManager = (Jwt, mangerDetails, DeptId) => {
    return api.post(`employee/manager/${DeptId}`, mangerDetails, {
        headers: {
            Authorization: `Bearer ${Jwt}`
        }
    }
    )
}

export const getAllEmployees = (jwt, p, s) => {
    return api.get(`employees/getall?page=${p}&size=${s}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}

export const getUserInfo = (jwt, name) => {
    return api.get(`/user/get-userByName?username=${name}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
}