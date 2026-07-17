import api from "./api";

export const TokenValid = (tokenJWT) => {
    return api.post("/tokenvalid" , {
        headers :{
            Authorization : `Bearer ${tokenJWT}`
        }
    });
}