
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    getAlltaskAssign,
    getallLeaveRequest
} from "../Api/AdminAccess";

import {
    GetAllEmployees,
    GetAllTaskAssigned
} from "../Api/ManagerAccess";

import {
    GetAlltheTaskDetails,
    GetAllAttendanceDetaisl
} from "../Api/EmployeeAccess";

import {
    FiSearch,
    FiRefreshCw,
    FiChevronUp,
    FiChevronDown,
    FiX,
    FiAlertCircle
} from "react-icons/fi";

import "./DataTableOuter.css";

import { TiTick } from "react-icons/ti";
import { MdCancel } from "react-icons/md";



/* =====================================================
   ADMIN - LEAVE
===================================================== */

const mapperToAdmintLeave = (datas) => {

    return datas.map((d) => ({
        Employee: d.employeName,
        LeaveType: d.reason,
        From: d.startingDate,
        To: d.endingDate,
        status: d.status
    }));

};



/* =====================================================
   ADMIN - TASK
===================================================== */

const mapperToAdmintask = (datas) => {

    return datas.map((d) => ({
        Task: d.task,
        AssignTo: d.assignedTo,
        completedDate: d.completedDate,
        DueDate: d.dueDate,
        status: d.status
    }));

};



/* =====================================================
   MANAGER - TASK
===================================================== */

const ManagerGetAllTask = (datas) => {

    return datas.map((d) => ({
        task: d.task,
        assignedTo: d.assignedTo,
        completedDate: d.completedDate,
        dueDate: d.dueDate,
        status: d.status
    }));

};



/* =====================================================
   MANAGER - EMPLOYEE
===================================================== */

const ManagerGetAllEmployees = (datas) => {

    return datas.map((d) => ({
        empcode: d.empcode,
        departmentname: d.departmentname,
        firstname: d.firstname,
        lastname: d.lastname,
        designation: d.designation
    }));

};



/* =====================================================
   EMPLOYEE - TASK
===================================================== */

const EmpGetTaskDetails = (datas) => {

    return datas.map((d) => ({
        task: d.task,
        assignedDate: d.assignedDate,
        dueDate: d.dueDate,
        status: d.status
    }));

};



/* =====================================================
   EMPLOYEE - ATTENDANCE
===================================================== */

const EmpAttendanceDetails = (datas) => {

    return datas.map((d) => ({
        attendanceDate: d.attendanceDate,
        checkIn: d.checkIn,
        checkOut: d.checkOut,
        WorkingHours: d.WorkingHours
    }));

};



/* =====================================================
   API CONFIGURATION
===================================================== */

const API = {

    ADMIN: {

        Task: {
            api: getAlltaskAssign,
            tittle: [
                "Task",
                "AssignTo",
                "DueDate",
                "completedDate",
                "status"
            ],
            map: mapperToAdmintask
        },

        Leave: {
            api: getallLeaveRequest,
            tittle: [
                "Employee",
                "LeaveType",
                "From",
                "To",
                "status"
            ],
            map: mapperToAdmintLeave
        }

    },


    MANAGER: {

        Task: {
            api: GetAllTaskAssigned,
            tittle: [
                "task",
                "assignedTo",
                "dueDate",
                "completedDate",
                "status"
            ],
            map: ManagerGetAllTask
        },

        Employee: {
            api: GetAllEmployees,
            tittle: [
                "empcode",
                "departmentname",
                "firstname",
                "lastname",
                "designation"
            ],
            map: ManagerGetAllEmployees
        }

    },


    EMPLOYEE: {

        Task: {
            api: GetAlltheTaskDetails,
            tittle: [
                "task",
                "assignedDate",
                "dueDate",
                "status"
            ],
            map: EmpGetTaskDetails
        },

        Attendance: {
            api: GetAllAttendanceDetaisl,
            tittle: [
                "attendanceDate",
                "checkIn",
                "checkOut",
                "WorkingHours"
            ],
            map: EmpAttendanceDetails
        }

    }

};



const Datatable = () => {

    const location = useLocation();


    /* =====================================================
       LOCATION DATA
    ===================================================== */

    const Type = location.state?.Type;

    const Role = localStorage.getItem("role");

    const AuthToken = localStorage.getItem("token");


    /* =====================================================
       PAGINATION
    ===================================================== */

    const [page, setPage] = useState(0);

    const [size] = useState(10);

    const [totalPages, setTotalPages] = useState(1);


    /* =====================================================
       DATA
    ===================================================== */

    const [finalData, setFinalData] = useState([]);


    /* =====================================================
       SEARCH
    ===================================================== */

    const [search, setSearch] = useState("");


    /* =====================================================
       SORT
    ===================================================== */

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });


    /* =====================================================
       LOADING / ERROR
    ===================================================== */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* =====================================================
       TITLE
    ===================================================== */

    const Tittle =
        API[Role]?.[Type]?.tittle || [];


    /* =====================================================
       API FUNCTION
    ===================================================== */

    const selectedApi =
        API[Role]?.[Type]?.api;


    const selectedMapper =
        API[Role]?.[Type]?.map;


    /* =====================================================
       FETCH DATA
    ===================================================== */

    const getData = async (requestedPage = page) => {

        if (!selectedApi) {

            setError(
                "Unable to identify the requested data."
            );

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await selectedApi(
                AuthToken,
                requestedPage,
                size
            );


            console.log(
                "API RESPONSE:",
                response.data
            );


            /*
            -------------------------------------------------
            Spring Boot Page<T>

            response.data.content

            -------------------------------------------------
            */

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.content || [];


            const mappedData =
                selectedMapper(data);


            setFinalData(mappedData);


            /*
            -------------------------------------------------
            Pagination
            -------------------------------------------------
            */

            if (!Array.isArray(response.data)) {

                setTotalPages(
                    response.data?.totalPages || 1
                );

            } else {

                setTotalPages(1);

            }


        } catch (e) {

            console.error(
                "DataTable API Error:",
                e
            );


            if (e.response?.status === 403) {

                setError(
                    "You don't have permission to view this data."
                );

            } else if (e.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else {

                setError(
                    "Unable to load data. Please try again."
                );

            }


            setFinalData([]);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL / PAGE CHANGE
    ===================================================== */

    useEffect(() => {

        getData(page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        page,
        Role,
        Type
    ]);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredData = useMemo(() => {

        const value =
            search.trim().toLowerCase();


        if (!value) {

            return finalData;

        }


        return finalData.filter((row) => {

            return Tittle.some((column) => {

                return row[column]
                    ?.toString()
                    .toLowerCase()
                    .includes(value);

            });

        });

    }, [
        finalData,
        search,
        Tittle
    ]);


    /* =====================================================
       SORT
    ===================================================== */

    const sortedData = useMemo(() => {

        const data = [...filteredData];


        if (!sortConfig.key) {

            return data;

        }


        data.sort((a, b) => {

            const valueA =
                a[sortConfig.key]
                    ?.toString()
                    .toLowerCase() || "";


            const valueB =
                b[sortConfig.key]
                    ?.toString()
                    .toLowerCase() || "";


            if (valueA < valueB) {

                return sortConfig.direction === "asc"
                    ? -1
                    : 1;

            }


            if (valueA > valueB) {

                return sortConfig.direction === "asc"
                    ? 1
                    : -1;

            }


            return 0;

        });


        return data;

    }, [
        filteredData,
        sortConfig
    ]);


    /* =====================================================
       SORT HANDLER
    ===================================================== */

    const handleSort = (column) => {

        setSortConfig((previous) => {

            if (previous.key === column) {

                return {

                    key: column,

                    direction:
                        previous.direction === "asc"
                            ? "desc"
                            : "asc"

                };

            }


            return {

                key: column,

                direction: "asc"

            };

        });

    };


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {

        getData(page);

    };


    /* =====================================================
       PAGINATION
    ===================================================== */

    const handlePrevious = () => {

        if (page <= 0) {

            return;

        }


        setPage((previous) =>
            previous - 1
        );

    };


    const handleNext = () => {

        if (page >= totalPages - 1) {

            return;

        }


        setPage((previous) =>
            previous + 1
        );

    };


    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    const clearSearch = () => {

        setSearch("");

    };


    /* =====================================================
       COLUMN LABEL
    ===================================================== */

    const getColumnLabel = (column) => {

        const labels = {

            empcode: "Employee Code",

            departmentname: "Department",

            firstname: "First Name",

            lastname: "Last Name",

            designation: "Designation",

            assignedTo: "Assigned To",

            assignedDate: "Assigned Date",

            completedDate: "Completed Date",

            dueDate: "Due Date",

            attendanceDate: "Attendance Date",

            checkIn: "Check In",

            checkOut: "Check Out",

            WorkingHours: "Working Hours",

            LeaveType: "Leave Type"

        };


        return (
            labels[column] ||
            column
        );

    };


    /* =====================================================
       INVALID ROLE / TYPE
    ===================================================== */

    if (!API[Role]?.[Type]) {

        return (

            <div className="DataTableOuter">

                <div className="LeavReqOuter">

                    <div className="top">

                        <h1>
                            Invalid Data Type
                        </h1>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="DataTableOuter">

            <div className="LeavReqOuter">


                {/* =========================================
                    TOP
                ========================================= */}

                <div className="top">

                    <div className="dataTableHeading">

                        <h1>
                            {Type} Datas
                        </h1>

                        <span>
                            {finalData.length} Records
                        </span>

                    </div>


                    <button
                        className="dataRefresh"
                        onClick={handleRefresh}
                        disabled={loading}
                    >

                        <FiRefreshCw
                            className={
                                loading
                                    ? "dataRefreshSpin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* =========================================
                    SEARCH
                ========================================= */}

                <div className="dataTableTools">

                    <div className="dataTableSearch">

                        <FiSearch />

                        <input
                            type="text"
                            placeholder={`Search ${Type}...`}
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />


                        {search && (

                            <button
                                onClick={clearSearch}
                                className="clearDataSearch"
                            >

                                <FiX />

                            </button>

                        )}

                    </div>

                </div>


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (

                    <div className="dataTableError">

                        <FiAlertCircle />

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                getData(page)
                            }
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =========================================
                    TABLE
                ========================================= */}

                <div className="LeaveReqDatas">

                    <table>

                        <thead>

                            <tr>

                                {Tittle.map(
                                    (column) => (

                                        <th
                                            key={column}
                                            onClick={() =>
                                                handleSort(
                                                    column
                                                )
                                            }
                                        >

                                            <div className="dataTableHeaderCell">

                                                {getColumnLabel(
                                                    column
                                                )}

                                                <span>

                                                    {sortConfig.key === column ? (

                                                        sortConfig.direction === "asc"
                                                            ? <FiChevronUp />
                                                            : <FiChevronDown />

                                                    ) : (

                                                        <FiChevronDown />

                                                    )}

                                                </span>

                                            </div>

                                        </th>

                                    )
                                )}

                            </tr>

                        </thead>


                        {/* =================================
                            LOADING
                        ================================= */}

                        {loading ? (

                            <tbody>

                                <tr>

                                    <td
                                        colSpan={
                                            Tittle.length
                                        }
                                        className="dataTableLoading"
                                    >

                                        <div className="dataTableLoader"></div>

                                        Loading {Type}...

                                    </td>

                                </tr>

                            </tbody>

                        ) : sortedData.length > 0 ? (

                            /* =============================
                               DATA
                            ============================= */

                            <tbody>

                                {sortedData.map(
                                    (d, index) => (

                                        <tr
                                            key={index}
                                            className="dataTableRow"
                                        >

                                            {Tittle.map(
                                                (column) => (

                                                    <td
                                                        key={column}
                                                    >

                                                        {column === "status" ? (

                                                            <span
                                                                className={`dataStatus ${d[column]
                                                                    ?.toString()
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        /\s+/g,
                                                                        "-"
                                                                    )}`}
                                                            >

                                                                <span className="statusDot"></span>

                                                                {d[column] || "-"}

                                                            </span>

                                                        ) : column === "Action" ? (

                                                            <>

                                                                <button className="dataApprove">

                                                                    <TiTick
                                                                        size={20}
                                                                    />

                                                                </button>


                                                                <button className="dataCancel">

                                                                    <MdCancel
                                                                        size={20}
                                                                    />

                                                                </button>

                                                            </>

                                                        ) : (

                                                            d[column] || "-"

                                                        )}

                                                    </td>

                                                )
                                            )}

                                        </tr>

                                    )
                                )}

                            </tbody>

                        ) : (

                            /* =============================
                               EMPTY
                            ============================= */

                            <tbody>

                                <tr>

                                    <td
                                        colSpan={
                                            Tittle.length
                                        }
                                        className="dataTableEmpty"
                                    >

                                        <div className="emptyDataIcon">
                                            📋
                                        </div>

                                        <h3>
                                            No Records Found
                                        </h3>

                                        <p>

                                            {search
                                                ? "Try searching with another keyword."
                                                : `No ${Type} records are available.`}

                                        </p>

                                    </td>

                                </tr>

                            </tbody>

                        )}

                    </table>

                </div>


                {/* =========================================
                    PAGINATION
                ========================================= */}

                <div className="dataPagination">

                    <span>

                        Page{" "}
                        <strong>
                            {page + 1}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {totalPages}
                        </strong>

                    </span>


                    <div>

                        <button
                            onClick={
                                handlePrevious
                            }
                            disabled={
                                page === 0 ||
                                loading
                            }
                        >
                            Previous
                        </button>


                        <button
                            onClick={
                                handleNext
                            }
                            disabled={
                                page >=
                                totalPages - 1 ||
                                loading
                            }
                        >
                            Next
                        </button>

                    </div>

                </div>


            </div>

        </div>

    );

};


export default Datatable;

