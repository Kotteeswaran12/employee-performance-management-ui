import api from "./api";



export const login = (username , password)=>{
    return api.post('/user/log-in' , {username , password});
} 


export const signin = (data)=>{
    return api.post('user/sign-in' , data);
}