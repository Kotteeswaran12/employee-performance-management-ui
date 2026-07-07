import { useEffect, useState } from 'react'
import "./Sidebar.css";
import { HiOutlineUsers } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import SidebarImg1 from "../../assets/sidebarImgs/SidebarImg1.png";
import { MdOutlineApartment } from "react-icons/md";
import { RiUserStarLine } from "react-icons/ri";
import { TbCalendarTime } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";
const Sidebar = () => {

  const [active, setActive] = useState({ "btn": "dashboard" });
  const { btn } = active;
  const ButtonOnActive = {
    "transition": "all 500ms ease",
    "background": "linear-gradient(90deg,#1D5BFF,#2F80FF)",
    "color": "#FFFFFF",
    "borderRadius": "10px",
    "boxShadow": "0 8px 20px rgba(29,91,255,.35)",

  }
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    console.log(window.innerWidth)
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [windowWidth])

  const [mobileSidebar, setMobileSidebar] = useState(false)
  function handelActive(btnName) {
    setActive(prev => ({
      ...prev,
      btn: btnName
    }));
  }

  function handelMobileSidebar() {

    setMobileSidebar(prev => !prev);
  }

  const SlidebarAnimation = {
    // "width" : "00px" ,
    // "height" : "auto" ,
    // "color": "red",
    // "backgroundColor": "red",
    "opacity": "1",
    "transition": "all 1s ease"
  }

  return (
    <div className='SiderbarMain'>

      {
        windowWidth > 900 ? (<>
          <div className="SideBarOuter">
            <div className="SidebarTitle">
              <h1> <RiTeamLine className='DashboarIcon' /> EMP System</h1>
            </div>

            <div className="SidebarActions">
              <ul>
                <li style={btn == "dashboard" ? ButtonOnActive : {}} onClick={() => handelActive("dashboard")} > <LuLayoutDashboard className='DashboarIcon' /> Dashboard</li>
                <li style={btn == "employee" ? ButtonOnActive : {}} onClick={() => handelActive("employee")} > < HiOutlineUsers className='DashboarIcon' />  Employee</li>
                <li style={btn == "department" ? ButtonOnActive : {}} onClick={() => handelActive("department")} > <MdOutlineApartment className='DashboarIcon' /> Department</li>
                <li style={btn == "manager" ? ButtonOnActive : {}} onClick={() => handelActive("manager")} > <RiUserStarLine className='DashboarIcon' /> Manager</li>
                <li style={btn == "leaveRequest" ? ButtonOnActive : {}} onClick={() => handelActive("leaveRequest")} > <TbCalendarTime className='DashboarIcon' /> Leave Request</li>
                <li style={btn == "settings" ? ButtonOnActive : {}} onClick={() => handelActive("settings")} > <FiSettings className='DashboarIcon' /> Settings</li>
              </ul>
            </div>

          </div>
          <img src={SidebarImg1} alt="" width={"200px"} />
        </>) : <>

          <div className="MobileSidebarOuter">

            <div className="MsideBarLOGO" onClick={handelMobileSidebar}>
              <h1>EMPS</h1>
              {/* <RiTeamLine className='MobileLogo' /> */}
            </div>

            {
              mobileSidebar ? (<>
                <div className="MobileSidebarActions" >
                  <ul style={mobileSidebar ? SlidebarAnimation : {}}>
                    <li  >
                      <LuLayoutDashboard className='DashboarIcon' />
                      Dashboard</li>
                    <li>
                      < HiOutlineUsers className='DashboarIcon' />
                      Employee</li>
                    <li  >
                      <MdOutlineApartment className='DashboarIcon' />
                      Department</li>
                    <li >                 <RiUserStarLine className='DashboarIcon' />
                      Manager</li>
                    <li >
                      <TbCalendarTime className='DashboarIcon' />
                      Leave Request</li>
                    <li >
                      <FiSettings className='DashboarIcon' />
                      Settings</li>
                  </ul>
                </div>
              </>) : <></>
            }

          </div>

        </>
      }
    </div>
  )
}

export default Sidebar;