
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import DashBorad from './Pages/Dashboards/DashBorad'
import ProtectedRoute from './Components/Routers/ProtectedRoute'
import Datatable from './Pages/Datatable'
import AddDepartment from './Pages/Admin/AddDepartment'
import Sidebar from './Pages/SideBar/Sidebar'

import { useLocation } from 'react-router-dom'
const App = () => {

    const {pathname} = useLocation();

    

    return (
        <div style={{ display: 'flex', position: 'relative' , overflow :'hidden' }} >

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

            </Routes>

        </div>
    )
}

export default App