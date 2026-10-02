import axios from "axios";

const api = axios.create({
    // baseURL:"https://employee-performance-api-nxav.onrender.com/api",
    // baseURL: "http://localhost:8080/api",
    baseURL : import.meta.env.API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;

// https://employee-performance-api-nxav.onrender.com/api