import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './Pages/Login/Login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import AdminDashBorad from './Pages/Dashboards/Admin/AdminDashBorad.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>

    {/* <Sidebar></Sidebar> */}
    <BrowserRouter >
        <Routes>
         {/* <Route path='/' element={<Login />} />  */}
         <Route path='/' element={<AdminDashBorad />}/>

        </Routes>
        
      </BrowserRouter> 
    

  </StrictMode>,
)
