import React from 'react'
import Navbar from '../../../Components/NavBar/Navbar'
import Sidebar from '../../SideBar/Sidebar'
import './AdminDashboard.css'
import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
const AdminDashBorad = () => {
    return (
        <div className='AdminDashboarOuter'>
            <Sidebar></Sidebar>
            <div className="adminDashInner">
                <Navbar User={[
                    {
                        'name': "kotteeswaran",
                        'role': "Admin"
                    }
                ]} />


                <div className="overAll">
                    <div className="TotalEmp">
                        <FaUsers className='dashboarIcons' />
                        <div className="results">
                            <h4>Total Employees</h4>
                            <h1>45</h1>
                        </div>
                    </div>



                    <div className="TotalManager">
                        <FaUserTie className='dashboarIcons' />
                        <div className="results">
                            <h4>Total Manager</h4>
                            <h1>45</h1>
                        </div>
                    </div>


                    <div className="Totaldept">
                        <MdApartment className='dashboarIcons' />
                        <div className="results">
                            <h4>Total Department</h4>
                            <h1>45</h1>
                        </div>
                    </div>


                    <div className="pendingLeaves">
                        <MdOutlinePendingActions className='dashboarIcons' />
                        <div className="results">
                            <h4>Total Pending Leaves</h4>
                            <h1>45</h1>
                        </div>
                    </div>


                    <div className="completetask">
                        <MdTaskAlt className='dashboarIcons' />
                        <div className="results">
                            <h4>Total Complete Tasks</h4>
                            <h1>45</h1>
                        </div>
                    </div>
                </div>

                <div className="additionDetails">
                    <div className="EmpDept">

                    </div>
                    <div className="leaveRequest">

                    </div>
                </div>
                <div className="Task">

                </div>
            </div>
        </div>
    )
}

export default AdminDashBorad
