import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './Pages/Login/Login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Sidebar from './Pages/SideBar/Sidebar.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>

    {/* <Sidebar></Sidebar> */}
     <BrowserRouter >
        <Routes>
         <Route path='/' element={<Login />} /> 

        </Routes>
        
      </BrowserRouter> 
    

  </StrictMode>,
)
