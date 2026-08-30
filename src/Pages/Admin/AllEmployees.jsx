import { useEffect, useMemo, useState } from "react";

import { getAllEmployees } from "../../Api/AdminAccess";
import { getEmployeedetailsByEmpCode } from "../../Api/ManagerAccess";

import {
    FiSearch,
    FiRefreshCw,
    FiChevronUp,
    FiChevronDown,
    FiUsers,
    FiAlertCircle,
    FiX,
    FiMoreVertical,
    FiUser,
    FiBriefcase,
    FiMapPin,
    FiDollarSign
} from "react-icons/fi";

import "./AllEmployees.css";


const AllEmployees = () => {

    // =====================================================
    // EMPLOYEE LIST
    // =====================================================

    const [allEmpData, setAllEmpData] = useState([]);

    const [search, setSearch] = useState("");

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(1);


    // =====================================================
    // EMPLOYEE DETAILS MODAL
    // =====================================================

    const [showEmployeeDetails, setShowEmployeeDetails] =
        useState(false);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [employeeDetailsLoading, setEmployeeDetailsLoading] =
        useState(false);

    const [employeeDetailsError, setEmployeeDetailsError] =
        useState("");


    // =====================================================
    // PAGINATION
    // =====================================================

    const pageSize = 20;

    const authToken = localStorage.getItem("token");


    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const Title = [
        "empcode",
        "firstname",
        "managername",
        "Department",
        "role",
        "action"
    ];


    const hasManager = (managerName) => {

        if (
            managerName === null ||
            managerName === undefined
        ) {
            return false;
        }

        const value = managerName
            .toString()
            .trim()
            .toLowerCase();

        return (
            value !== "" &&
            value !== "null" &&
            value !== "undefined"
        );
    };


    // =====================================================
    // FETCH EMPLOYEES
    // =====================================================

    const fetchAllEmp = async (page = currentPage) => {

        try {

            setLoading(true);

            setError("");

            const response = await getAllEmployees(
                authToken,
                page,
                pageSize
            );


            /*
            -------------------------------------------------
            Spring Boot Page<T>

            response.data.content

            Plain List<T>

            response.data
            -------------------------------------------------
            */

            const employees = Array.isArray(response.data)
                ? response.data
                : response.data?.content || [];


            // =================================================
            // TRANSFORM EMPLOYEE DATA
            // =================================================

            const responseData = employees.map((d) => {

                const employeeHasManager = hasManager(
                    d.managername
                );

                return {

                    Id: d.id,

                    Department:
                        d.departmentname || "-",

                    empcode:
                        d.empcode || "-",

                    firstname:
                        d.firstname || "-",

                    lastname:
                        d.lastname || "",

                    managername:
                        hasManager(d.managername)
                            ? d.managername
                            : "",

                    designation:
                        d.designation || "",

                    gender:
                        d.gender || "",

                    phone:
                        d.phone || null,

                    salary:
                        d.sal ?? 0,

                    address:
                        d.address || "",

                    role:
                        employeeHasManager
                            ? "EMPLOYEE"
                            : "MANAGER"

                };

            });


            setAllEmpData(responseData);


            // =================================================
            // PAGINATION INFORMATION
            // =================================================

            if (!Array.isArray(response.data)) {

                setTotalPages(
                    response.data?.totalPages || 1
                );

            } else {

                setTotalPages(1);

            }


        } catch (error) {

            console.error(
                "Employee Fetch Error:",
                error
            );


            setError(
                error.response?.status === 403
                    ? "You don't have permission to view employees."
                    : "Unable to load employees. Please try again."
            );


            setAllEmpData([]);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllEmp(0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredEmployees = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        if (!searchValue) {

            return allEmpData;

        }


        return allEmpData.filter((employee) => {

            return (

                employee.empcode
                    ?.toString()
                    .toLowerCase()
                    .includes(searchValue)

                ||

                employee.firstname
                    ?.toString()
                    .toLowerCase()
                    .includes(searchValue)

                ||

                employee.managername
                    ?.toString()
                    .toLowerCase()
                    .includes(searchValue)

                ||

                employee.Department
                    ?.toString()
                    .toLowerCase()
                    .includes(searchValue)

                ||

                employee.role
                    ?.toString()
                    .toLowerCase()
                    .includes(searchValue)

            );

        });

    }, [allEmpData, search]);


    // =====================================================
    // SORT
    // =====================================================

    const sortedEmployees = useMemo(() => {

        const data = [...filteredEmployees];


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
        filteredEmployees,
        sortConfig
    ]);


    // =====================================================
    // SORT HANDLER
    // =====================================================

    const handleSort = (column) => {

        // Action column should never be sorted
        if (column === "action") {
            return;
        }


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


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = () => {

        setSearch("");

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        fetchAllEmp(currentPage);

    };


    // =====================================================
    // PAGINATION
    // =====================================================

    const handlePrevious = () => {

        if (currentPage === 0) {

            return;

        }


        const newPage =
            currentPage - 1;


        setCurrentPage(newPage);

        fetchAllEmp(newPage);

    };


    const handleNext = () => {

        if (currentPage >= totalPages - 1) {

            return;

        }


        const newPage =
            currentPage + 1;


        setCurrentPage(newPage);

        fetchAllEmp(newPage);

    };


    // =====================================================
    // COLUMN LABEL
    // =====================================================

    const getColumnLabel = (column) => {

        if (column === "empcode") {
            return "Employee Code";
        }

        if (column === "firstname") {
            return "First Name";
        }

        if (column === "managername") {
            return "Manager";
        }

        if (column === "Department") {
            return "Department";
        }

        if (column === "role") {
            return "Role";
        }

        if (column === "action") {
            return "Action";
        }

        return column;

    };


    // =====================================================
    // INITIALS
    // =====================================================

    const getInitial = (name) => {

        if (!name || name === "-") {

            return "?";

        }


        return name
            .charAt(0)
            .toUpperCase();

    };


    // =====================================================
    // VIEW EMPLOYEE DETAILS
    // =====================================================

    const handleViewEmployee = async (employee) => {

        const empCode = employee.empcode;


        if (!empCode || empCode === "-") {

            setEmployeeDetailsError(
                "Employee code is not available."
            );

            setShowEmployeeDetails(true);

            return;

        }


        try {

            setShowEmployeeDetails(true);

            setEmployeeDetailsLoading(true);

            setEmployeeDetailsError("");

            setSelectedEmployee(null);


            const Token =
                localStorage.getItem("token");


            const response =
                await getEmployeedetailsByEmpCode(
                    Token,
                    empCode
                );


            console.log(
                "Admin Employee Details:",
                response.data
            );


            const employeeData =
                response.data;


            /*
            -------------------------------------------------
            ROLE LOGIC FOR DETAILS API

            managername empty/null
            = MANAGER

            managername present
            = EMPLOYEE
            -------------------------------------------------
            */

            const employeeHasManager = hasManager(employeeData.managername);


            setSelectedEmployee({

                ...employeeData,

                role:
                    employeeHasManager
                        ? "EMPLOYEE"
                        : "MANAGER"

            });


        } catch (error) {

            console.error(
                "Employee Details Error:",
                error
            );


            setEmployeeDetailsError(

                error.response?.status === 403

                    ? "You don't have permission to view this employee."

                    : "Unable to load employee details. Please try again."

            );


        } finally {

            setEmployeeDetailsLoading(false);

        }

    };


    // =====================================================
    // CLOSE EMPLOYEE DETAILS
    // =====================================================

    const closeEmployeeDetails = () => {

        setShowEmployeeDetails(false);

        setSelectedEmployee(null);

        setEmployeeDetailsError("");

        setEmployeeDetailsLoading(false);

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="EmployeeListOuter">


            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="employeeHeader">

                <div className="employeeTitle">

                    <div className="employeeTitleIcon">

                        <FiUsers />

                    </div>


                    <div>

                        <h1>
                            List of All Employees
                        </h1>

                        <span>
                            Manage and view employee details
                        </span>

                    </div>

                </div>


                <div className="employeeCount">

                    <strong>
                        {allEmpData.length}
                    </strong>

                    <span>
                        Employees
                    </span>

                </div>

            </div>


            {/* =========================================
                TOOLS
            ========================================= */}

            <div className="employeeTools">


                {/* SEARCH */}

                <div className="employeeSearch">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) => {

                            setSearch(
                                e.target.value
                            );

                        }}
                    />


                    {search && (

                        <button
                            className="clearSearch"
                            onClick={clearSearch}
                        >

                            <FiX />

                        </button>

                    )}

                </div>


                {/* REFRESH */}

                <button
                    className="employeeRefresh"
                    onClick={handleRefresh}
                    disabled={loading}
                >

                    <FiRefreshCw
                        className={
                            loading
                                ? "refreshSpin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="employeeError">

                    <FiAlertCircle />

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={() =>
                            fetchAllEmp(currentPage)
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


                    {/* =================================
                        HEADER
                    ================================= */}

                    <thead>

                        <tr>

                            {Title.map(
                                (column) => (

                                    <th
                                        key={column}
                                        onClick={() =>
                                            column !== "action" &&
                                            handleSort(column)
                                        }
                                    >

                                        <div className="tableHeaderContent">

                                            {getColumnLabel(
                                                column
                                            )}


                                            {/* Don't show
                                                sorting for Action */}

                                            {column !== "action" && (

                                                <span className="sortIcon">

                                                    {sortConfig.key === column ? (

                                                        sortConfig.direction === "asc"

                                                            ? <FiChevronUp />

                                                            : <FiChevronDown />

                                                    ) : (

                                                        <FiChevronDown />

                                                    )}

                                                </span>

                                            )}

                                        </div>

                                    </th>

                                )
                            )}

                        </tr>

                    </thead>


                    {/* =================================
                        BODY
                    ================================= */}

                    {loading ? (

                        <tbody>

                            <tr>

                                <td
                                    colSpan={Title.length}
                                    className="employeeLoading"
                                >

                                    <div className="employeeLoader"></div>

                                    <span>
                                        Loading Employees...
                                    </span>

                                </td>

                            </tr>

                        </tbody>

                    ) : sortedEmployees.length > 0 ? (

                        <tbody>

                            {sortedEmployees.map(
                                (d, index) => (

                                    <tr
                                        key={
                                            d.Id ||
                                            index
                                        }
                                        className="employeeRow"
                                    >


                                        {/* =====================
                                            EMPLOYEE CODE
                                        ====================== */}

                                        <td>

                                            <span className="employeeCode">

                                                {d.empcode}

                                            </span>

                                        </td>


                                        {/* =====================
                                            FIRST NAME
                                        ====================== */}

                                        <td>

                                            <div className="employeeName">

                                                <div className="employeeAvatar">

                                                    {getInitial(
                                                        d.firstname
                                                    )}

                                                </div>

                                                <span>
                                                    {d.firstname}
                                                </span>

                                            </div>

                                        </td>


                                        {/* =====================
                                            MANAGER
                                        ====================== */}

                                        <td>

                                            {d.managername?.trim()
                                                ? d.managername
                                                : "—"}

                                        </td>


                                        {/* =====================
                                            DEPARTMENT
                                        ====================== */}

                                        <td>

                                            <span className="departmentBadge">

                                                {d.Department}

                                            </span>

                                        </td>


                                        {/* =====================
                                            ROLE
                                        ====================== */}

                                        <td>

                                            <span
                                                className={`employeeRoleBadge ${d.role === "MANAGER"
                                                    ? "managerRole"
                                                    : "employeeRole"
                                                    }`}
                                            >

                                                <span className="roleDot"></span>

                                                {d.role}

                                            </span>

                                        </td>


                                        {/* =====================
                                            ACTION
                                        ====================== */}

                                        <td>

                                            <button
                                                type="button"
                                                className="employeeActionBtn"
                                                title="View Employee Details"
                                                aria-label={`View ${d.firstname} details`}
                                                onClick={() =>
                                                    handleViewEmployee(d)
                                                }
                                            >

                                                <FiMoreVertical />

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    ) : (

                        <tbody>

                            <tr>

                                <td
                                    colSpan={Title.length}
                                    className="employeeEmpty"
                                >

                                    <div className="emptyEmployeeIcon">

                                        <FiUsers />

                                    </div>

                                    <h3>
                                        No Employees Found
                                    </h3>

                                    <p>

                                        {search

                                            ? "Try searching with another name, employee code or department."

                                            : "There are no employees available."
                                        }

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

            <div className="employeePagination">

                <span>

                    Page{" "}

                    <strong>
                        {currentPage + 1}
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {totalPages}
                    </strong>

                </span>


                <div className="paginationButtons">

                    <button
                        onClick={handlePrevious}
                        disabled={
                            currentPage === 0 ||
                            loading
                        }
                    >
                        Previous
                    </button>


                    <button
                        onClick={handleNext}
                        disabled={
                            currentPage >=
                            totalPages - 1 ||
                            loading
                        }
                    >
                        Next
                    </button>

                </div>

            </div>


            {/* =====================================================
                ADMIN EMPLOYEE OVERVIEW MODAL
            ===================================================== */}

            {showEmployeeDetails && (

                <div
                    className="adminEmployeeModalOverlay"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            closeEmployeeDetails();

                        }

                    }}
                >

                    <div className="adminEmployeeModal">


                        {/* =========================
                            MODAL HEADER
                        ========================== */}

                        <div className="adminEmployeeModalHeader">

                            <div>

                                <span className="adminModalLabel">
                                    ADMIN • EMPLOYEE OVERVIEW
                                </span>

                                <h2>
                                    Employee Details
                                </h2>

                                <p>
                                    Complete employee information
                                </p>

                            </div>


                            <button
                                type="button"
                                className="adminModalClose"
                                onClick={
                                    closeEmployeeDetails
                                }
                                aria-label="Close employee details"
                            >

                                <FiX />

                            </button>

                        </div>


                        {/* =========================
                            LOADING
                        ========================== */}

                        {employeeDetailsLoading && (

                            <div className="adminEmployeeLoading">

                                <div className="adminEmployeeSpinner"></div>

                                <h3>
                                    Loading employee details
                                </h3>

                                <p>
                                    Fetching the latest employee information...
                                </p>

                            </div>

                        )}


                        {/* =========================
                            ERROR
                        ========================== */}

                        {!employeeDetailsLoading &&
                            employeeDetailsError && (

                                <div className="adminEmployeeError">

                                    <div className="adminErrorIcon">

                                        <FiAlertCircle />

                                    </div>

                                    <h3>
                                        Unable to load employee
                                    </h3>

                                    <p>
                                        {employeeDetailsError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            closeEmployeeDetails
                                        }
                                    >
                                        Close
                                    </button>

                                </div>

                            )}


                        {/* =========================
                            DETAILS
                        ========================== */}

                        {!employeeDetailsLoading &&
                            !employeeDetailsError &&
                            selectedEmployee && (

                                <div className="adminEmployeeModalBody">


                                    {/* =====================
                                        PROFILE
                                    ====================== */}

                                    <div className="adminEmployeeProfile">

                                        <div className="adminEmployeeAvatar">

                                            {getInitial(
                                                selectedEmployee.firstname
                                            )}

                                        </div>


                                        <div className="adminEmployeeProfileInfo">

                                            <div className="adminEmployeeNameRow">

                                                <h3>

                                                    {
                                                        selectedEmployee.firstname ||
                                                        "-"
                                                    }{" "}

                                                    {
                                                        selectedEmployee.lastname ||
                                                        ""
                                                    }

                                                </h3>


                                                <span
                                                    className={`adminRoleBadge ${selectedEmployee.role ===
                                                        "MANAGER"

                                                        ? "adminManagerRole"

                                                        : "adminEmployeeRole"
                                                        }`}
                                                >

                                                    {
                                                        selectedEmployee.role
                                                    }

                                                </span>

                                            </div>


                                            <p>

                                                {
                                                    selectedEmployee.designation ||
                                                    "Employee"
                                                }

                                            </p>


                                            <span className="adminEmployeeCode">

                                                {
                                                    selectedEmployee.empcode ||
                                                    "-"
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    {/* =====================
                                        PERSONAL INFORMATION
                                    ====================== */}

                                    <div className="adminDetailsSection">

                                        <div className="adminDetailsSectionHeader">

                                            <div className="adminDetailsIcon">

                                                <FiUser />

                                            </div>


                                            <div>

                                                <h3>
                                                    Personal Information
                                                </h3>

                                                <p>
                                                    Basic employee information
                                                </p>

                                            </div>

                                        </div>


                                        <div className="adminDetailsGrid">


                                            {/* EMPLOYEE CODE */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Employee Code
                                                </span>

                                                <strong>
                                                    {
                                                        selectedEmployee.empcode ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>


                                            {/* FULL NAME */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Full Name
                                                </span>

                                                <strong>

                                                    {
                                                        selectedEmployee.firstname ||
                                                        "-"
                                                    }{" "}

                                                    {
                                                        selectedEmployee.lastname ||
                                                        ""
                                                    }

                                                </strong>

                                            </div>


                                            {/* GENDER */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Gender
                                                </span>

                                                <strong>
                                                    {
                                                        selectedEmployee.gender ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>


                                            {/* PHONE */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Phone Number
                                                </span>

                                                <strong>

                                                    {
                                                        selectedEmployee.phone ??
                                                        "-"
                                                    }

                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =====================
                                        EMPLOYMENT
                                    ====================== */}

                                    <div className="adminDetailsSection">

                                        <div className="adminDetailsSectionHeader">

                                            <div className="adminDetailsIcon">

                                                <FiBriefcase />

                                            </div>


                                            <div>

                                                <h3>
                                                    Employment Information
                                                </h3>

                                                <p>
                                                    Organizational details
                                                </p>

                                            </div>

                                        </div>


                                        <div className="adminDetailsGrid">


                                            {/* ROLE */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Role
                                                </span>

                                                <strong>

                                                    <span
                                                        className={`adminInlineRole ${selectedEmployee.role ===
                                                            "MANAGER"

                                                            ? "inlineManager"

                                                            : "inlineEmployee"
                                                            }`}
                                                    >

                                                        {
                                                            selectedEmployee.role
                                                        }

                                                    </span>

                                                </strong>

                                            </div>


                                            {/* DEPARTMENT */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Department
                                                </span>

                                                <strong>
                                                    {
                                                        selectedEmployee.departmentname ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>


                                            {/* DESIGNATION */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Designation
                                                </span>

                                                <strong>
                                                    {
                                                        selectedEmployee.designation ||
                                                        "-"
                                                    }
                                                </strong>

                                            </div>


                                            {/* MANAGER */}

                                            <div className="adminDetailItem">

                                                <span>
                                                    Reporting Manager
                                                </span>

                                                <strong>

                                                    {
                                                        selectedEmployee.managername
                                                            ?.trim()

                                                            ? selectedEmployee.managername

                                                            : "—"
                                                    }

                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =====================
                                        COMPENSATION
                                    ====================== */}

                                    <div className="adminDetailsSection">

                                        <div className="adminDetailsSectionHeader">

                                            <div className="adminDetailsIcon">

                                                <FiDollarSign />

                                            </div>


                                            <div>

                                                <h3>
                                                    Compensation
                                                </h3>

                                                <p>
                                                    Salary information
                                                </p>

                                            </div>

                                        </div>


                                        <div className="adminSalaryCard">

                                            <div>

                                                <span>
                                                    Monthly Salary
                                                </span>

                                                <strong>

                                                    ₹{" "}

                                                    {
                                                        selectedEmployee.sal !== null &&
                                                            selectedEmployee.sal !== undefined

                                                            ? Number(
                                                                selectedEmployee.sal
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )

                                                            : "0"
                                                    }

                                                </strong>

                                            </div>


                                            <FiDollarSign />

                                        </div>

                                    </div>


                                    {/* =====================
                                        ADDRESS
                                    ====================== */}

                                    <div className="adminDetailsSection">

                                        <div className="adminDetailsSectionHeader">

                                            <div className="adminDetailsIcon">

                                                <FiMapPin />

                                            </div>


                                            <div>

                                                <h3>
                                                    Address
                                                </h3>

                                                <p>
                                                    Employee address
                                                </p>

                                            </div>

                                        </div>


                                        <div className="adminAddress">

                                            {
                                                selectedEmployee.address
                                                    ?.trim()

                                                    ? selectedEmployee.address

                                                    : "No address available"
                                            }

                                        </div>

                                    </div>


                                    {/* =====================
                                        FOOTER
                                    ====================== */}

                                    <div className="adminEmployeeModalFooter">

                                        <button
                                            type="button"
                                            className="adminEmployeeCloseBtn"
                                            onClick={
                                                closeEmployeeDetails
                                            }
                                        >
                                            Close
                                        </button>

                                    </div>

                                </div>

                            )}

                    </div>

                </div>

            )}


        </div>

    );

};


export default AllEmployees;