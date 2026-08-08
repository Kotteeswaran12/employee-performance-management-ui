
import { useEffect, useMemo, useState } from "react";
import { getAllEmployees } from "../../Api/AdminAccess";
import {
    FiSearch,
    FiRefreshCw,
    FiChevronUp,
    FiChevronDown,
    FiUsers,
    FiAlertCircle,
    FiX
} from "react-icons/fi";

import "./AllEmployees.css";


const AllEmployees = () => {

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

    const pageSize = 20;

    const authToken = localStorage.getItem("token");


    /*
    =====================================================
        TABLE COLUMNS
    =====================================================
    */

    const Title = [
        "empcode",
        "firstname",
        "managername",
        "Department"
    ];


    /*
    =====================================================
        FETCH EMPLOYEES
    =====================================================
    */

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


            const responseData = employees.map((d) => ({

                Id: d.id,

                Department: d.departmentname || "-",

                empcode: d.empcode || "-",

                firstname: d.firstname || "-",

                managername: d.managername || "-"

            }));


            setAllEmpData(responseData);


            /*
            -------------------------------------------------
            Pagination information
            -------------------------------------------------
            */

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


    /*
    =====================================================
        INITIAL LOAD
    =====================================================
    */

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAllEmp(0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /*
    =====================================================
        SEARCH
    =====================================================
    */

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

            );

        });

    }, [allEmpData, search]);


    /*
    =====================================================
        SORT
    =====================================================
    */

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


    /*
    =====================================================
        SORT HANDLER
    =====================================================
    */

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


    /*
    =====================================================
        CLEAR SEARCH
    =====================================================
    */

    const clearSearch = () => {

        setSearch("");

    };


    /*
    =====================================================
        REFRESH
    =====================================================
    */

    const handleRefresh = () => {

        fetchAllEmp(currentPage);

    };


    /*
    =====================================================
        PAGINATION
    =====================================================
    */

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


    /*
    =====================================================
        COLUMN LABEL
    =====================================================
    */

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

        return column;

    };


    /*
    =====================================================
        INITIALS
    =====================================================
    */

    const getInitial = (name) => {

        if (!name || name === "-") {

            return "?";

        }

        return name
            .charAt(0)
            .toUpperCase();

    };


    /*
    =====================================================
        UI
    =====================================================
    */

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
                                            handleSort(
                                                column
                                            )
                                        }
                                    >

                                        <div className="tableHeaderContent">

                                            {getColumnLabel(
                                                column
                                            )}


                                            <span className="sortIcon">

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


                                        {/* EMPLOYEE CODE */}

                                        <td>

                                            <span className="employeeCode">

                                                {d.empcode}

                                            </span>

                                        </td>


                                        {/* FIRST NAME */}

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


                                        {/* MANAGER */}

                                        <td>

                                            {d.managername}

                                        </td>


                                        {/* DEPARTMENT */}

                                        <td>

                                            <span className="departmentBadge">

                                                {d.Department}

                                            </span>

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


        </div>
    );
};


export default AllEmployees;

