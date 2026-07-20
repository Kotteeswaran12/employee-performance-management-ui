import api from './api';

export const AdminDashBoard = (JWT)=>{
    return api.get("/admin/dash-board" , {
        headers :{
            Authorization : `Bearer ${JWT}`
        }
    })
}


export const getallLeaveRequest= (JWT) => {
    return api.get("/leave" , {
        headers :{
            Authorization : `Bearer ${JWT}`
        }
    })
}

export const  getAlltaskAssign = (JWT) => {
    return api.get("/tasks" , {
        headers : {
            Authorization : `Bearer ${JWT}`
        }
    })
}