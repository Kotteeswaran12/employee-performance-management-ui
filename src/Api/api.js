import axios from "axios";

const api = axios.create({
    baseURL:"https://employee-performance-api-nxav.onrender.com/api",
    headers:{
        "Content-Type" : "application/json"
    }
}) ;

export default api ;

// https://employee-performance-api-nxav.onrender.com/api