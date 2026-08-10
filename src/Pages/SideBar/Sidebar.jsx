import { useState } from "react";
import "./Sidebar.css";

import { HiOutlineUsers } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineApartment } from "react-icons/md";
import { RiUserStarLine, RiTeamLine } from "react-icons/ri";
import { TbCalendarTime } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdFeedback } from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";

import SidebarImg1 from "../../assets/sidebarImgs/SidebarImg1.png";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const Role = localStorage.getItem('role');

  const [mobileSidebar, setMobileSidebar] = useState(false);


  /* =====================================================
     MENU ITEMS
  ===================================================== */
  const Data = {
    ADMIN: [
      {
        name: "Dashboard",
        path: "/dashBoard",
        icon: <LuLayoutDashboard />
      },
      {
        name: "Employee",
        path: "/allEmp",
        icon: <HiOutlineUsers />
      },
      {
        name: "Department",
        path: "/addDepartment",
        icon: <MdOutlineApartment />
      },
      {
        name: "Manager",
        path: "/addManager",
        icon: <RiUserStarLine />
      },
      {
        name: "Leave Request",
        path: "/allLeaveReq",
        icon: <TbCalendarTime />
      },
      {
        name: "Settings",
        path: "/UserInfo",
        icon: <FiSettings />
      }
    ],
    MANAGER: [{
      name: "Dashboard",
      path: "/dashBoard",
      icon: <LuLayoutDashboard />
    },
    {
      name: "Add Employee",
      path: "/addEmployee",
      icon: <IoPersonAddOutline />
    },
    {
      name: "Task",
      path: "/task",
      icon: <MdOutlineTaskAlt />
    },
    {
      name: "Review",
      path: "/review",
      icon: <MdOutlineRateReview />
    },
    {
      name: "Leave",
      path: "/leave",
      icon: <TbCalendarTime />
    },
    {
      name: "Department",
      path: "/department",
      icon: <MdOutlineApartment />
    },
    {
      name: "Settings",
      path: "/UserInfo",
      icon: <FiSettings />
    }],
    EMPLOYEE: [{
      name: "Dashboard",
      path: "/dashBoard",
      icon: <LuLayoutDashboard />
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <FaRegCalendarCheck />
    },
    {
      name: "Task",
      path: "/task",
      icon: <MdOutlineTaskAlt />
    },
    {
      name: "Leave",
      path: "/leave",
      icon: <TbCalendarTime />
    },
    {
      name: "Department",
      path: "/department",
      icon: <MdOutlineApartment />
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: <MdFeedback />
    },
    {
      name: "Settings",
      path: "/UserInfo",
      icon: <FiSettings />
    }
    ]
  }

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashBoard",
      icon: <LuLayoutDashboard />
    },
    {
      name: "Employee",
      path: "/allEmp",
      icon: <HiOutlineUsers />
    },
    {
      name: "Department",
      path: "/addDepartment",
      icon: <MdOutlineApartment />
    },
    {
      name: "Manager",
      path: "/addManager",
      icon: <RiUserStarLine />
    },
    {
      name: "Leave Request",
      path: "/allLeaveReq",
      icon: <TbCalendarTime />
    },
    {
      name: "Settings",
      path: "/UserInfo",
      icon: <FiSettings />
    }
  ];


  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavigation = (path) => {

    navigate(path);

    // Close mobile menu after navigation
    setMobileSidebar(false);
  };


  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const handelMobileSidebar = () => {
    setMobileSidebar(prev => !prev);
  };


  return (

    <div className="SiderbarMain">


      {/* =================================================
                DESKTOP SIDEBAR
            ================================================= */}

      <div className="SideBarOuter">


        {/* ---------------- TITLE ---------------- */}

        <div className="SidebarTitle">

          <h1>

            <RiTeamLine className="DashboarIcon" />

            EMP System

          </h1>

        </div>


        {/* ---------------- MENU ---------------- */}

        <div className="SidebarActions">

          <ul>

            {Data[Role].map((item) => {

              const isActive =
                location.pathname === item.path;

              return (

                <li
                  key={item.name}
                  className={
                    isActive
                      ? "activeMenu"
                      : ""
                  }
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                >

                  <span className="DashboarIcon">

                    {item.icon}

                  </span>

                  <span>

                    {item.name}

                  </span>

                </li>

              );

            })}

          </ul>

        </div>

      </div>


      {/* =================================================
                SIDEBAR IMAGE
            ================================================= */}

      <img
        src={SidebarImg1}
        alt="Employee Management"
      />


      {/* =================================================
                MOBILE NAVBAR
            ================================================= */}

      <div className="MobileSidebarOuter">


        {/* ---------------- HAMBURGER ---------------- */}

        <div
          className="MsideBarLOGO"
          onClick={handelMobileSidebar}
        >

          <GiHamburgerMenu />

        </div>


        {/* ---------------- MOBILE TITLE ---------------- */}

        <h1>
          EMP System
        </h1>


        {/* =================================================
                    MOBILE MENU
                ================================================= */}

        <div className="MobileSidebarActions">

          <ul
            className={
              mobileSidebar
                ? "mobileMenuOpen"
                : ""
            }
          >

            {Data[Role].map((item) => {

              const isActive =
                location.pathname === item.path;

              return (

                <li
                  key={item.name}
                  className={
                    isActive
                      ? "activeMenu"
                      : ""
                  }
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                >

                  <span className="DashboarIcon">

                    {item.icon}

                  </span>

                  <span>

                    {item.name}

                  </span>

                </li>

              );

            })}

          </ul>

        </div>

      </div>

    </div>
  );
};

export default Sidebar;