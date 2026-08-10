
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import DashBorad from './Pages/Dashboards/DashBorad'
import ProtectedRoute from './Components/Routers/ProtectedRoute'
import Datatable from './Pages/Datatable'
import AddDepartment from './Pages/Admin/AddDepartment'
import Sidebar from './Pages/SideBar/Sidebar'

import { useLocation } from 'react-router-dom'
import AddManager from './Pages/Admin/AddManager'
import AllEmployees from './Pages/Admin/AllEmployees'
import LeaveReq from './Pages/Admin/LeaveReq'
import Settings from './Pages/settings/Settings'
import './App.css';
import AddEmployee from './Pages/Manager/AddEmployee'
import Task from './Pages/Manager/Task'
const App = () => {

    const { pathname } = useLocation();



    return (
        <div className='AppOuter'>

            {
                pathname != '/' && (
                    <Sidebar></Sidebar>
                )
            }

            <Routes>
                <Route path='/' element={<Login />} />

                <Route path='/dashBoard'
                    element={
                        <ProtectedRoute allowedRole={["ADMIN", "MANAGER", "EMPLOYEE"]}>
                            <DashBorad />
                        </ProtectedRoute>}
                />

                <Route path='/addDepartment' element={
                    <ProtectedRoute allowedRole={"ADMIN"}>
                        <AddDepartment></AddDepartment>
                    </ProtectedRoute>
                }></Route>

                <Route path='/all' element={
                    <Datatable />
                }>
                </Route>

                <Route path='/addManager' element={
                    <AddManager />
                } />

                <Route path='/allEmp' element={<AllEmployees />} />
                <Route path='/allLeaveReq' element={<LeaveReq />} />
                <Route path='/UserInfo' element={<Settings />} />


                {/* Manager Routes */}
                <Route path='/addEmployee' element={<AddEmployee />} />
                <Route path='/task' element={<Task />} />

            </Routes>

        </div>
    )
}

export default App