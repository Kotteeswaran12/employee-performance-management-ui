import api from "./api";



export const login = (username , password)=>{
    return api.post('/user/log-in' , {username , password});
} 


export const SignIn = (empid , data)=>{
    return api.post(`/user/signUp/${empid}` , data);
}

export const UpdateUesrInfo = (Jwt , data) => {
    return api.post(`/user/UpdateProfile` ,data ,{
        headers : {
            Authorization : `Bearer ${Jwt}`
        }
    })
}