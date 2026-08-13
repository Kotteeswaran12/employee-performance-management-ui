
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
import ManagerLeave from './Pages/Manager/ManagerLeave'
import Review from './Pages/Manager/Review'
import Attendance from './Pages/Employee/Attendance'
import Department from './Pages/Manager/Department'
import MyTask from './Pages/Employee/MyTask';
import MyFeedback from './Pages/Employee/MyFeedback'
import MyLeave from './Pages/Employee/MyLeave'
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
                <Route path='/leave' element={<ManagerLeave />} />
                <Route path='/review' element={<Review />} />
                <Route path='/department' element={<Department />} />



                {/* Employee Routes */}
                <Route path='/MYattendance' element={
                    <ProtectedRoute allowedRole={"EMPLOYEE"}>
                        <Attendance></Attendance>
                    </ProtectedRoute>
                } />
                <Route path='/MYtask' element={
                    <ProtectedRoute allowedRole={"EMPLOYEE"}>
                        <MyTask></MyTask>
                    </ProtectedRoute>
                } />
                <Route path='/feedback' element={
                    <ProtectedRoute allowedRole={"EMPLOYEE"}>
                        <MyFeedback></MyFeedback>
                    </ProtectedRoute>
                } />
                <Route path='/MYleave' element={
                    <ProtectedRoute allowedRole={"EMPLOYEE"}>
                        <MyLeave></MyLeave>
                    </ProtectedRoute>
                } />


            </Routes>

        </div>
    )
}

export default App