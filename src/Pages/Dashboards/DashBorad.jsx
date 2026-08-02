
import Navbar from './Component/Navbar'
import Sidebar from '../SideBar/Sidebar'
import './Dashboard.css'
import OverAll from './Component/OverAll'
import PieChart from './Component/PieChart'
import { useEffect, useState } from 'react'
import { AdminDashBoard } from '../../Api/AdminAccess'
import LeaveRequest from './Component/LeaveRequest'
import { getallLeaveRequest } from '../../Api/AdminAccess'
import { getAlltaskAssign } from '../../Api/AdminAccess'
import { ManagerDashBorad } from '../../Api/ManagerAccess'
import { GetAllTaskAssigned } from '../../Api/ManagerAccess'
import { GetAllEmployees } from '../../Api/ManagerAccess'
import EmployeeDashBoard from './Employee/EmployeeDashBoard'


const Titles = {

    ADMIN: {
        T1: ["Employee", "LeaveType", "From", "To", "status"],
        T2: ["Task", "AssignTo", "DueDate", "status"]
    },

    MANAGER: {
        T1: ["task", "assignedTo", "dueDate", "status"],
        T2: ["empcode", "firstname", "lastname", "designation"]
    },
    EMPLOYEE: {
        T1: ["task", "assignedTo", "dueDate", "status"],
        T2: ["empcode", "firstname", "lastname", "designation"]
    }
}



const DashBorad = () => {
    const Role = localStorage.getItem("role");

    const [leaveRequestdata, SetLeaveReqdata] = useState([]);

    const [DashBoradDetails, setDashBoardDatas] = useState([]);

    const [TaskAssignData, setTaskAssignData] = useState([]);


    useEffect(() => {

        const getDetails = async () => {

            const AuthToken = localStorage.getItem('token');
            try {

                if (Role == "ADMIN") {
                    const response = await AdminDashBoard(AuthToken);
                    const LeaveReq = await getallLeaveRequest(AuthToken);
                    const taskData = await getAlltaskAssign(AuthToken, 0, 3);

                    const TaskAssignData = taskData.data.content.map((T) => ({
                        Task: T.task,
                        AssignTo: T.assignedTo,
                        DueDate: T.dueDate,
                        status: T.status

                    }))

                    console.log(taskData)
                    const LeaveData = LeaveReq.data.content.map((d) => ({
                        Employee: d.employeName,
                        LeaveType: d.reason,
                        From: d.startingDate,
                        To: d.endingDate,
                        status: d.status

                    }))

                    setTaskAssignData(TaskAssignData);
                    SetLeaveReqdata(LeaveData);
                    setDashBoardDatas(response.data);
                }

                else if (Role == "MANAGER") {
                    const response = await ManagerDashBorad(AuthToken);

                    const Employees = await GetAllEmployees(AuthToken, 0, 2);
                    const taskData = await GetAllTaskAssigned(AuthToken, 0, 3);
                    SetLeaveReqdata(taskData.data.content);
                    setTaskAssignData(Employees.data);
                    setDashBoardDatas(response.data);

                    console.log(Employees.data)
                }
                else {
                    const EmployeeDashBoradData = await EmployeeDashBoard(AuthToken);

                    setDashBoardDatas(EmployeeDashBoradData.data);
                    console.log(EmployeeDashBoradData)
                    console.log("Sorry")
                }

            } catch (e) {
                console.log(e)
            }

        }

        getDetails()

    }, [Role])

    return (
        <div className='AdminDashboarOuter'>
            <Sidebar></Sidebar>
            <div className="adminDashInner">
                <Navbar User={[
                    {
                        'name': localStorage.getItem("username"),
                        'role': localStorage.getItem("role")
                    }
                ]} />


                <OverAll datas={DashBoradDetails} />

                <div className="additionDetails">


                    <PieChart data={[DashBoradDetails]} />



                    {/* <div className="leaveRequest">
                        <LeaveRequest Heading={Role == "ADMIN" ? "Recent Leave Request" : Role == "MANAGER" ? 'Team Leave Request' : ""} data={leaveRequestdata} Title={Titles[Role].T1} />
                    </div> */}
                </div>
                {/* <div className="Task">
                    <LeaveRequest Heading={Role == "ADMIN" ? "Recent Task Assigned" : Role == "MANAGER" ? "All Employees" : ""} data={TaskAssignData} Title={Titles[Role].T2} />
                </div> */}
            </div>
        </div>
    )
}

export default DashBorad
