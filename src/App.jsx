
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import DashBorad from './Pages/Dashboards/DashBorad'
import ProtectedRoute from './Components/Routers/ProtectedRoute'
import Datatable from './Pages/Datatable'

const App = () => {



    return (
        <>

            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/Admin-dashBoard'
                    element={
                        <ProtectedRoute allowedRole={"ADMIN"}>
                            <DashBorad />
                        </ProtectedRoute>}
                />
                <Route path='/Manager-dashBoard'
                    element={
                        <ProtectedRoute allowedRole={"MANAGER"}>
                            <DashBorad />
                        </ProtectedRoute>} />

                <Route path='/Employee-dashBoard'
                    element={
                        <ProtectedRoute allowedRole={"ADMIN"}>
                            <DashBorad />
                        </ProtectedRoute>} />

                <Route path='/all' element={
                    <Datatable />
                }>

                </Route>

            </Routes>

        </>
    )
}

export default App