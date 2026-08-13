import api from "./api";

export const EmployeeDashBoard = (JWT) => {
    return api.get("/employee/dash-board", {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}

export const GetAlltheTaskDetails = (JWT , p=0 , s=10) => {
    return api.get(`/taskAssignment/employee?page=${p}&size=${s}` , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const GetAllAttendanceDetaisl = (JWT , p=0 , s=10) => {
    return api.get(`/attendance/?page=${p}&size=${s}` , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const PunchIn = (jwt) => {
    return api.post('/attendance/check-in' , null , {
        headers : {
            Authorization : `Bearer ${jwt}`
        }
    })
}

export const PunchOut = (jwt) => {
    return api.post(`/attendance/check-out` , null , {
        headers : {
            Authorization :`Bearer ${jwt}`
        }
    })
}

export const StartTheTask = (jwt  , taskId) => {
    return api.post(`/taskAssignment/start/${taskId}` , null , {
        headers : {
            Authorization : `Bearer ${jwt}`
        }
    })
}

export const CompetedTheTask = (jwt , taskId) => {
    return api.post(`/taskAssignment/complete/${taskId}` , null , {
        headers : {
            Authorization :`Bearer ${jwt}`
        }
    })
}

export const getAllLeaves = (jwt , p=0 , s = 10) =>{
    return api.get(`/leave?page=${p}&size=${s}` , {
        headers : {
            Authorization : `Bearer ${jwt}`
        }
    })
}

export const applyLeave = (jwt   , leave) =>{
    return api.post(`/leave/apply` , leave  , {
        headers : {
            Authorization : `Bearer ${jwt}`
        }
    })
}

export const GetAllFeedback = (jwt , p=0 , s = 10) => {
    return api.get(`/feedback?page=${p}&size=${s}` , {
        headers : {
            Authorization : `Bearer ${jwt}`
        }
    })
}