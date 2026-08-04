import api from './api';

export const AdminDashBoard = (JWT)=>{
    return api.get("/admin/dash-board" , {
        headers :{
            Authorization : `Bearer ${JWT}`
        }
    })
}


export const getallLeaveRequest= (JWT) => {
    return api.get("/leaves" , {
        headers :{
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const  getAlltaskAssign = (JWT , page , size) => {
    return api.get(`/Tasks?page=${page}&size=${size}` , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const getAllAdminDashboradDetails=(JWT)=>{

    return api.get('/admin/dash-board' , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const countAlltheEmpByDept = (JWT) => {
    return api.get("/CountEmployeeByDept", {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}