
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import AdminDashBorad from './Pages/Dashboards/Admin/AdminDashBorad'
import ProtectedRoute from './Components/Routers/ProtectedRoute'
import ManagerDashBoard from './Pages/Dashboards/Manager/ManagerDashBoard'
import EmployeeDashBoard from './Pages/Dashboards/Employee/EmployeeDashBoard'
const App = () => {



    return (
        <>

            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/Admin-dashBoard'
                    element={
                        <ProtectedRoute allowedRole={"ADMIN"}>
                            <AdminDashBorad />
                        </ProtectedRoute>}
                />
                <Route path='/Manager-dashBoard'
                    element={
                        <ProtectedRoute allowedRole={"MANAGER"}>
                            <ManagerDashBoard />
                        </ProtectedRoute>} />

                <Route path='/Employee-dashBoard'
                    element={
                        <ProtectedRoute allowedRole={"ADMIN"}>
                            <EmployeeDashBoard />
                        </ProtectedRoute>} />

            </Routes>

        </>
    )
}

export default App