
import Navbar from './Component/Navbar'
import Sidebar from '../SideBar/Sidebar'
import './Dashboard.css'
import OverAll from './Component/OverAll'
import PieChart from './Component/PieChart'
import { useEffect, useState } from 'react'
import { AdminDashBoard } from '../../Api/AdminAccess'
import TableContent from './Component/TableContent'
import { getallLeaveRequest } from '../../Api/AdminAccess'
import { getAlltaskAssign } from '../../Api/AdminAccess'
import { countAllTheTaskAssignment, ManagerDashBorad } from '../../Api/ManagerAccess'
import { GetAllTaskAssigned } from '../../Api/ManagerAccess'
import { GetAllEmployees } from '../../Api/ManagerAccess'
import { EmployeeDashBoard } from '../../Api/EmployeeAccess'
import { countAlltheEmpByDept } from '../../Api/AdminAccess'
import { GetAlltheTaskDetails } from '../../Api/EmployeeAccess'
import { GetAllAttendanceDetaisl } from '../../Api/EmployeeAccess'



const Titles = {

    ADMIN: {
        T1: {
            Type: "Leave",
            Tittle: ["Employee", "LeaveType", "From", "To", "status"]
        },
        T2: {
            Type: "Task",
            Tittle: ["Task", "AssignTo", "DueDate", "status"]
        }


    },

    MANAGER: {
        T1: {
            Type: "Task",
            Tittle: ["task", "assignedTo", "dueDate", "status"]
        },
        T2: {
            Type: "Employee",
            Tittle: ["empcode", "firstname", "lastname", "designation"]
        },

    },
    EMPLOYEE: {
        T1: {
            Type: "Task",
            Tittle: ["task", "dueDate", "status"]
        },
        T2: {
            Type: "Attendance",
            Tittle: ["attendanceDate", "checkIn", "checkOut", "WorkingHours"]
        },
       
    }
}



const DashBorad = () => {
    const Role = localStorage.getItem("role");

    const [tableContent01, SetTableContent01] = useState([]);

    const [DashBoradDetails, setDashBoardDatas] = useState([]);

    const [tableContent02, SetTableContent02] = useState([]);

    const [PiChartdata, setPiChartData] = useState([]);







    useEffect(() => {

        const getDetails = async () => {

            const AuthToken = localStorage.getItem('token');
            try {

                if (Role == "ADMIN") {
                    const response = await AdminDashBoard(AuthToken);
                    const LeaveReq = await getallLeaveRequest(AuthToken);
                    const taskData = await getAlltaskAssign(AuthToken, 0, 3);
                    const countalltheEmp = await countAlltheEmpByDept(AuthToken)


                    const TaskAssignData = taskData.data.content.map((T) => ({
                        Task: T.task,
                        AssignTo: T.assignedTo,
                        DueDate: T.dueDate,
                        status: T.status

                    }))


                    const LeaveData = LeaveReq.data.content.map((d) => ({
                        Employee: d.employeName,
                        LeaveType: d.reason,
                        From: d.startingDate,
                        To: d.endingDate,
                        status: d.status

                    }))
                    setPiChartData(countalltheEmp.data)
                    SetTableContent02(TaskAssignData);
                    SetTableContent01(LeaveData);
                    setDashBoardDatas(response.data);
                }

                else if (Role == "MANAGER") {
                    const response = await ManagerDashBorad(AuthToken);
                    const Employees = await GetAllEmployees(AuthToken, 0, 2);
                    const taskData = await GetAllTaskAssigned(AuthToken, 0, 3);
                    const countAllTheTaskAssignments = await countAllTheTaskAssignment(AuthToken);

                    setPiChartData(countAllTheTaskAssignments.data)
                    SetTableContent01(taskData.data.content);
                    SetTableContent02(Employees.data.content);
                    setDashBoardDatas(response.data);

                    console.log(Employees.data)
                }
                else {
                    const EmployeeDashBoradData = await EmployeeDashBoard(AuthToken);
                    const TaskDetails = await GetAlltheTaskDetails(AuthToken, 0, 3);
                    const AttendaceDetails = await GetAllAttendanceDetaisl(AuthToken, 0, 3);

                    SetTableContent02(AttendaceDetails.data.content)
                    SetTableContent01(TaskDetails.data.content);
                    setDashBoardDatas(EmployeeDashBoradData.data);
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


                    <PieChart datas={[PiChartdata]} />



                    <div className="leaveRequest">
                        <TableContent Heading={Role == "ADMIN" ? "Recent Leave Request" : Role == "MANAGER" ? 'Team Leave Request' : "My Task"} data={tableContent01} Title={Titles[Role].T1.Tittle} Type={Titles[Role].T1.Type} />
                    </div>
                </div>
                <div className="Task">
                    <TableContent Heading={Role == "ADMIN" ? "Recent Task Assigned" : Role == "MANAGER" ? "My Team Members" : "Attendace Details"} data={tableContent02} Title={Titles[Role].T2.Tittle} Type={Titles[Role].T2.Type} />
                </div>
            </div>
        </div>
    )
}

export default DashBorad
