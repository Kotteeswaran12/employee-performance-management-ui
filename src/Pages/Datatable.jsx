import { useEffect, useState } from 'react'
import { getAlltaskAssign } from '../Api/AdminAccess';
import { getallLeaveRequest } from '../Api/AdminAccess';
import { GetAllEmployees } from '../Api/ManagerAccess';
import { GetAllTaskAssigned } from '../Api/ManagerAccess';
import { GetAlltheTaskDetails } from '../Api/EmployeeAccess';
import { GetAllAttendanceDetaisl } from '../Api/EmployeeAccess';
import { data, useLocation } from 'react-router-dom';
import Sidebar from './SideBar/Sidebar';
import './DataTableOuter.css'

import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";

export const mapperToAdmintLeave = (datas) => {

    return datas.map((d) => ({
        Employee: d.employeName,
        LeaveType: d.reason,
        From: d.startingDate,
        To: d.endingDate,
        status: d.status
    }))

}

export const mapperToAdmintask = (datas) => {

    console.log(datas)

    return datas.map((d) => ({


        Task: d.task,
        AssignTo: d.employeName,
        completedDate: d.completedDate,
        DueDate: d.dueDate,
        status: d.status
    }))

}

export const ManagerGetAllTask = (datas) => {
    return datas.map((d) => ({
        task: d.task,
        assignedTo: d.assignedTo,
        completedDate: d.completedDate,
        dueDate: d.dueDate,
        status: d.status

    }))
}

const ManagerGetAllEmployees = (datas) => {
    return datas.map((d) => ({

        empcode: d.empcode,
        departmentname: d.departmentname,
        firstname: d.firstname,
        lastname: d.lastname,
        designation: d.designation

    }))
}

const EmpGetTaskDetails = (datas) => {
    return datas.map((d) => ({

        task :  d.task  ,
        assignedDate : d.assignedDate ,
        dueDate : d.dueDate,
        status : d.status

    }))
}

const EmpAttendanceDetails = (datas) => {
    return datas.map((d) => ({

        attendanceDate : d.attendanceDate ,
        checkIn : d.checkIn ,
        checkOut : d.checkOut   ,
        WorkingHours : d.WorkingHours
    }))
}



const API = {
    ADMIN: {
        Task: {
            api: getAlltaskAssign,
            tittle: ["Task", "AssignTo", "DueDate", "completedDate", "status"],
            map: mapperToAdmintask

        },
        Leave: {
            api: getallLeaveRequest,
            tittle: ["Employee", "LeaveType", "From", "To", "status"],
            map: mapperToAdmintLeave,
        },

    },
    MANAGER: {
        Task: {
            api: GetAllTaskAssigned,
            tittle: ["task", "assignedTo", "dueDate", "completedDate", "status", ],
            map: ManagerGetAllTask
        },
        Employee: {
            api: GetAllEmployees,
            tittle: ["empcode", "departmentname", "firstname", "lastname", "designation",],
            map: ManagerGetAllEmployees
        },
    },
    EMPLOYEE: {
        Task: {
            api: GetAlltheTaskDetails,
            tittle: ["task","assignedDate" , "dueDate", "status"],
            map: EmpGetTaskDetails
        },
        Attendance: {
            api: GetAllAttendanceDetaisl,
            tittle: ["attendanceDate", "checkIn", "checkOut", "WorkingHours"],
            map: EmpAttendanceDetails
        }

    }
}

const Datatable = () => {

    const location = useLocation();

    const { Type } = location.state;


    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const Role = localStorage.getItem("role");
    const AuthToken = localStorage.getItem("token");

    const Tittle = API[Role][Type].tittle;
    const [finalData, setFinalData] = useState([]);

    useEffect(() => {


        const getData = async () => {


            const api = API[Role][Type].api;

            const getallDatas = await api(AuthToken, page, size);

            console.log(getallDatas.data)

            console.log(API[Role][Type].api)
            const Data = getallDatas.data.content;

            console.log(Data)
            setFinalData(API[Role][Type].map(Data));

        };

        getData();


    }, [page, size])

    // console.log(finalData)
    return (

        <div className="DataTableOuter">
            <Sidebar></Sidebar>

            <div className='LeavReqOuter'>
                <div className="top">
                    <h1>{Type} Datas</h1>
                    {/* <button>View All</button> */}
                </div>

                <div className="LeaveReqDatas">

                    <table >
                        <thead>
                            <tr >
                                {
                                    finalData.length > 0 &&
                                    Tittle.filter((t) => t !== 'id' && t != 'managerName').map((t, i) => {
                                        return (

                                            <th key={i}>{t}</th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>

                        {
                            finalData && finalData.length > 0 ? (
                                <tbody>
                                    {
                                        finalData
                                            .map((d, index) => (
                                                <tr key={index}>

                                                    {
                                                        Tittle
                                                            .map((column) => (

                                                                <td key={column}
                                                                >{
                                                                        column === "status" ? (
                                                                            <span className={d[column]}>{d[column]}</span>
                                                                        )
                                                                            :
                                                                            column === "Action" ? (<> <button><TiTick  size={30}/></button> <button><MdCancel  size={30}/></button> </>) : (
                                                                                d[column] || "-"

                                                                            )

                                                                    }</td>

                                                            ))
                                                    }

                                                </tr>

                                            ))
                                    }
                                </tbody>
                            ) : (
                                <h3>no Records Found !!</h3>
                            )
                        }
                    </table>


                </div>

            {/* <button onClick={()=> setSize( size-1)}>Reduce</button> */}
            </div>

        </div>
    )
}

export default Datatable