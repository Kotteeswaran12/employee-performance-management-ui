import api from "./api";

export const EmployeeDashBoard = (JWT) => {
    return api.get("/employee/dash-board", {
        headers: {
            Authorization: `Bearer ${JWT}`
        }
    })
}