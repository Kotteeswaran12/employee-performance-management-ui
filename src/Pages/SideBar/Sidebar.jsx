import{ useState } from 'react'
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

  const [active, setActive] = useState({ "btn": "dashboard"});
  const { btn} = active;
  const ButtonOnActive = {
    "transition": "all 500ms ease",
    "background": "linear-gradient(90deg,#1D5BFF,#2F80FF)",
    "color": "#FFFFFF",
    "borderRadius": "10px",
    "boxShadow": "0 8px 20px rgba(29,91,255,.35)",
   
  }
  function handelActive(btnName) {
    setActive(prev => ({
      ...prev,
      btn: btnName
    }));
  }

  return (
    <div className='SiderbarMain'>

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
    </div>
  )
}

export default Sidebar;