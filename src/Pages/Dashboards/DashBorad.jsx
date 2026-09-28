import Navbar from './Component/Navbar';
import './Dashboard.css';

import OverAll from './Component/OverAll';
import PieChart from './Component/PieChart';
import TableContent from './Component/TableContent';

import { useEffect, useState } from 'react';

import {
    AdminDashBoard,
    getallLeaveRequest,
    getAlltaskAssign,
    countAlltheEmpByDept
} from '../../Api/AdminAccess';

import {
    ManagerDashBorad,
    GetAllTaskAssigned,
    GetAllEmployees,
    countAllTheTaskAssignment
} from '../../Api/ManagerAccess';

import {
    EmployeeDashBoard,
    GetAlltheTaskDetails,
    GetAllAttendanceDetaisl
} from '../../Api/EmployeeAccess';


const Titles = {

    ADMIN: {
        T1: {
            Type: "Leave",
            Tittle: [
                "Employee",
                "LeaveType",
                "From",
                "To",
                "status"
            ]
        },

        T2: {
            Type: "Task",
            Tittle: [
                "Task",
                "AssignTo",
                "DueDate",
                "status"
            ]
        }
    },


    MANAGER: {
        T1: {
            Type: "Task",
            Tittle: [
                "task",
                "assignedTo",
                "dueDate",
                "status"
            ]
        },

        T2: {
            Type: "Employee",
            Tittle: [
                "empcode",
                "firstname",
                "lastname",
                "designation"
            ]
        }
    },


    EMPLOYEE: {
        T1: {
            Type: "Task",
            Tittle: [
                "task",
                "dueDate",
                "status"
            ]
        },

        T2: {
            Type: "Attendance",
            Tittle: [
                "attendanceDate",
                "checkIn",
                "checkOut",
                "WorkingHours"
            ]
        }
    }

};


const DashBorad = () => {

    const Role = localStorage.getItem("role");

    const [tableContent01, SetTableContent01] =
        useState([]);

    const [DashBoradDetails, setDashBoardDatas] =
        useState([]);

    const [tableContent02, SetTableContent02] =
        useState([]);

    const [PiChartdata, setPiChartData] =
        useState([]);

    const [piChartTittle, setPichartTitte] =
        useState('');

    // Loading State
    const [loading, setLoading] =
        useState(true);

    // Error State
    const [error, setError] =
        useState(null);

    // Retry State
    const [retryCount, setRetryCount] =
        useState(0);


    const handleRetry = () => {

        setError(null);

        setRetryCount(
            (previous) => previous + 1
        );

    };


    useEffect(() => {

        let isMounted = true;


        const safeArray = (data) => {

            return Array.isArray(data)
                ? data
                : [];

        };


        const safeContent = (response) => {

            return safeArray(
                response?.data?.content
            );

        };


        const getErrorMessage = (error) => {

            const status =
                error?.response?.status;


            if (status === 401) {

                return "Your session has expired. Please login again.";

            }


            if (status === 403) {

                return "You do not have permission to access this dashboard.";

            }


            if (status === 404) {

                return "Dashboard data was not found.";

            }


            if (status >= 500) {

                return "Server error. Please try again later.";

            }


            if (
                error?.code === "ERR_NETWORK"
            ) {

                return "Network error. Please check your internet connection.";

            }


            return (
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while loading the dashboard."
            );

        };


        const getDetails = async () => {

            if (isMounted) {

                setLoading(true);

                setError(null);

            }


            const AuthToken =
                localStorage.getItem('token');


            // Missing Token
            if (!AuthToken) {

                if (isMounted) {

                    setError(
                        "Authentication token is missing. Please login again."
                    );

                    setLoading(false);

                }

                return;

            }


            // Invalid Role
            if (
                !Role ||
                !Titles[Role]
            ) {

                if (isMounted) {

                    setError(
                        "Invalid user role. Please login again."
                    );

                    setLoading(false);

                }

                return;

            }


            try {


                // ===============================
                // ADMIN
                // ===============================

                if (Role === "ADMIN") {

                    const results =
                        await Promise.allSettled([

                            AdminDashBoard(
                                AuthToken
                            ),

                            getallLeaveRequest(
                                AuthToken
                            ),

                            getAlltaskAssign(
                                AuthToken,
                                0,
                                3
                            ),

                            countAlltheEmpByDept(
                                AuthToken
                            )

                        ]);


                    const [
                        dashboardResult,
                        leaveResult,
                        taskResult,
                        employeeCountResult
                    ] = results;


                    // Dashboard
                    if (
                        dashboardResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            setDashBoardDatas(
                                dashboardResult.value?.data ?? []
                            );

                        }

                    }


                    // Leave Request
                    if (
                        leaveResult.status === "fulfilled"
                    ) {

                        const LeaveData =
                            safeContent(
                                leaveResult.value
                            ).map((d) => ({

                                Employee:
                                    d?.employeName ??
                                    "N/A",

                                LeaveType:
                                    d?.reason ??
                                    "N/A",

                                From:
                                    d?.startingDate ??
                                    "N/A",

                                To:
                                    d?.endingDate ??
                                    "N/A",

                                status:
                                    d?.status ??
                                    "N/A"

                            }));


                        if (isMounted) {

                            SetTableContent01(
                                LeaveData
                            );

                        }

                    }


                    // Task
                    if (
                        taskResult.status === "fulfilled"
                    ) {

                        const TaskAssignData =
                            safeContent(
                                taskResult.value
                            ).map((T) => ({

                                Task:
                                    T?.task ??
                                    "N/A",

                                AssignTo:
                                    T?.assignedTo ??
                                    "N/A",

                                DueDate:
                                    T?.dueDate ??
                                    "N/A",

                                status:
                                    T?.status ??
                                    "N/A"

                            }));


                        if (isMounted) {

                            SetTableContent02(
                                TaskAssignData
                            );

                        }

                    }


                    // Pie Chart
                    if (
                        employeeCountResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            setPiChartData(
                                employeeCountResult.value?.data ?? []
                            );

                        }

                    }


                    if (isMounted) {

                        setPichartTitte(
                            "Employees by Department"
                        );

                    }


                    // All API calls failed
                    const allFailed =
                        results.every(
                            (result) =>
                                result.status === "rejected"
                        );


                    if (
                        allFailed &&
                        isMounted
                    ) {

                        setError(
                            "Unable to load dashboard data. Please try again."
                        );

                    }

                }


                // ===============================
                // MANAGER
                // ===============================

                else if (Role === "MANAGER") {

                    const results =
                        await Promise.allSettled([

                            ManagerDashBorad(
                                AuthToken
                            ),

                            GetAllEmployees(
                                AuthToken,
                                0,
                                2
                            ),

                            GetAllTaskAssigned(
                                AuthToken,
                                0,
                                3
                            ),

                            countAllTheTaskAssignment(
                                AuthToken
                            )

                        ]);


                    const [
                        dashboardResult,
                        employeeResult,
                        taskResult,
                        taskCountResult
                    ] = results;


                    // Dashboard
                    if (
                        dashboardResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            setDashBoardDatas(
                                dashboardResult.value?.data ?? []
                            );

                        }

                    }


                    // Tasks
                    if (
                        taskResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            SetTableContent01(
                                safeContent(
                                    taskResult.value
                                )
                            );

                        }

                    }


                    // Employees
                    if (
                        employeeResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            SetTableContent02(
                                safeContent(
                                    employeeResult.value
                                )
                            );

                        }

                    }


                    // Pie Chart
                    if (
                        taskCountResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            setPiChartData(
                                taskCountResult.value?.data ?? []
                            );

                        }

                    }


                    if (isMounted) {

                        setPichartTitte(
                            "Task Overview"
                        );

                    }


                    const allFailed =
                        results.every(
                            (result) =>
                                result.status === "rejected"
                        );


                    if (
                        allFailed &&
                        isMounted
                    ) {

                        setError(
                            "Unable to load dashboard data. Please try again."
                        );

                    }

                }


                // ===============================
                // EMPLOYEE
                // ===============================

                else if (Role === "EMPLOYEE") {

                    const results =
                        await Promise.allSettled([

                            EmployeeDashBoard(
                                AuthToken
                            ),

                            GetAlltheTaskDetails(
                                AuthToken,
                                0,
                                3
                            ),

                            GetAllAttendanceDetaisl(
                                AuthToken,
                                0,
                                3
                            )

                        ]);


                    const [
                        dashboardResult,
                        taskResult,
                        attendanceResult
                    ] = results;


                    // Dashboard
                    if (
                        dashboardResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            setDashBoardDatas(
                                dashboardResult.value?.data ?? []
                            );

                            setPiChartData(
                                dashboardResult.value?.data ?? []
                            );

                        }

                    }


                    // Tasks
                    if (
                        taskResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            SetTableContent01(
                                safeContent(
                                    taskResult.value
                                )
                            );

                        }

                    }


                    // Attendance
                    if (
                        attendanceResult.status === "fulfilled"
                    ) {

                        if (isMounted) {

                            SetTableContent02(
                                safeContent(
                                    attendanceResult.value
                                )
                            );

                        }

                    }


                    if (isMounted) {

                        setPichartTitte(
                            "Performance Overview"
                        );

                    }


                    const allFailed =
                        results.every(
                            (result) =>
                                result.status === "rejected"
                        );


                    if (
                        allFailed &&
                        isMounted
                    ) {

                        setError(
                            "Unable to load dashboard data. Please try again."
                        );

                    }

                }


            } catch (err) {

                console.error(
                    "Dashboard Error:",
                    err
                );


                if (isMounted) {

                    setError(
                        getErrorMessage(err)
                    );

                }

            } finally {

                if (isMounted) {

                    setLoading(false);

                }

            }

        };


        getDetails();


        return () => {

            isMounted = false;

        };


    }, [Role, retryCount]);


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (

            <div className="adminDashInner">

                <div className="dashboardState">

                    <div className="dashboardStateContent">

                        <div className="dashboardLoading">

                            <div className="dashboardLoader"></div>

                            <p>
                                Loading Dashboard...
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {

        return (

            <div className="adminDashInner">

                <div className="dashboardState">

                    <div className="dashboardStateContent">

                        <div className="dashboardError">

                            <div className="dashboardErrorIcon">
                                !
                            </div>

                            <h3>
                                Something went wrong
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                className="dashboardRetryButton"
                                onClick={handleRetry}
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    // ==========================================
    // NORMAL DASHBOARD
    // ==========================================

    return (

        <div className="adminDashInner">


            <Navbar
                User={[
                    {
                        name:
                            localStorage.getItem(
                                "username"
                            ) || "User",

                        role:
                            Role || "UNKNOWN"
                    }
                ]}
            />


            {/* OVERALL CARDS */}

            <OverAll
                datas={
                    DashBoradDetails || []
                }
            />


            {/* MAIN DASHBOARD SECTION */}

            <div className="additionDetails">


                <PieChart
                    datas={[
                        PiChartdata || []
                    ]}

                    Tittle={
                        piChartTittle
                    }

                    role={
                        Role
                    }
                />


                <div className="leaveRequest">

                    <TableContent

                        Heading={
                            Role === "ADMIN"
                                ? "Recent Leave Request"
                                : Role === "MANAGER"
                                    ? "Tasks"
                                    : "My Task"
                        }

                        data={
                            tableContent01 || []
                        }

                        Title={
                            Titles[Role]?.T1?.Tittle || []
                        }

                        Type={
                            Titles[Role]?.T1?.Type || ""
                        }

                    />

                </div>

            </div>


            {/* BOTTOM SECTION */}

            <div className="Task">

                <TableContent

                    Heading={
                        Role === "ADMIN"
                            ? "Recent Task Assigned"
                            : Role === "MANAGER"
                                ? "My Team Members"
                                : "Attendance Details"
                    }

                    data={
                        tableContent02 || []
                    }

                    Title={
                        Titles[Role]?.T2?.Tittle || []
                    }

                    Type={
                        Titles[Role]?.T2?.Type || ""
                    }

                />

            </div>


        </div>

    );

};


export default DashBorad;