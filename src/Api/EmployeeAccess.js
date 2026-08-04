import api from "./api";

export const EmployeeDashBoard = (JWT) => {
    return api.get("/employee/dash-board", {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const GetAlltheTaskDetails = (JWT , p , s) => {
    return api.get(`/taskAssignment/employee?page=${p}&size=${s}` , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const GetAllAttendanceDetaisl = (JWT , p , s) => {
    return api.get(`/attendance/?page=${p}&size=${s}` , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}