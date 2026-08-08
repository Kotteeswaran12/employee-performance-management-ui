
import { useEffect, useMemo, useState } from "react";
import { getallLeaveRequest } from "../../Api/AdminAccess";

import {
    FiSearch,
    FiRefreshCw,
    FiChevronUp,
    FiChevronDown,
    FiX,
    FiAlertCircle
} from "react-icons/fi";

import "./LeaveReq.css";


const LeaveReq = () => {

    /* =====================================================
       DATA
    ===================================================== */

    const [Data, setData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


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
       PAGINATION
    ===================================================== */

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(1);

    const size = 10;


    /* =====================================================
       AUTH
    ===================================================== */

    const AuthToken = localStorage.getItem("token");


    /* =====================================================
       TABLE COLUMNS
    ===================================================== */

    const title = [
        "id",
        "EmployeeName",
        "From",
        "To",
        "Reason",
        "Manager",
        "Status"
    ];


    /* =====================================================
       FETCH DATA
    ===================================================== */

    const fetchData = async (requestedPage = page) => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getallLeaveRequest(
                    AuthToken,
                    requestedPage,
                    size
                );


           


            /*
            -------------------------------------------------
            Spring Boot Page<T>
            -------------------------------------------------
            */

            const content =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.content || [];


            const responseData = content.map((d) => ({

                id: d.id,

                EmployeeName:
                    d.employeName || "-",

                From:
                    d.startingDate || "-",

                To:
                    d.endingDate || "-",

                Reason:
                    d.reason || "-",

                Manager:
                    d.managerName || "-",

                Status:
                    d.status || "-"

            }));


            setData(responseData);


            /*
            -------------------------------------------------
            PAGINATION
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
                "Leave Request Error:",
                e
            );


            if (e.response?.status === 403) {

                setError(
                    "You don't have permission to view leave requests."
                );

            } else if (e.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else {

                setError(
                    "Unable to load leave requests."
                );

            }


            setData([]);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL FETCH
    ===================================================== */

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData(0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredData = useMemo(() => {

        const value =
            search.trim().toLowerCase();


        if (!value) {

            return Data;

        }


        return Data.filter((leave) => {

            return title.some((column) => {

                return leave[column]
                    ?.toString()
                    .toLowerCase()
                    .includes(value);

            });

        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Data, search]);


    /* =====================================================
       SORT
    ===================================================== */

    const sortedData = useMemo(() => {

        const result =
            [...filteredData];


        if (!sortConfig.key) {

            return result;

        }


        result.sort((a, b) => {

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


        return result;

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

        fetchData(page);

    };


    /* =====================================================
       SEARCH CLEAR
    ===================================================== */

    const clearSearch = () => {

        setSearch("");

    };


    /* =====================================================
       PAGINATION
    ===================================================== */

    const handlePrevious = () => {

        if (page <= 0) {

            return;

        }


        const newPage =
            page - 1;

        setPage(newPage);

        fetchData(newPage);

    };


    const handleNext = () => {

        if (page >= totalPages - 1) {

            return;

        }


        const newPage =
            page + 1;

        setPage(newPage);

        fetchData(newPage);

    };


    /* =====================================================
       COLUMN LABEL
    ===================================================== */

    const getColumnLabel = (column) => {

        const labels = {

            id: "ID",

            EmployeeName: "Employee",

            From: "From",

            To: "To",

            Reason: "Reason",

            Manager: "Manager",

            Status: "Status"

        };


        return labels[column] || column;

    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (status) => {

        if (!status) {

            return "";

        }


        return status
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-");

    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="allLeavReqOuter">


            {/* =============================================
                HEADER
            ============================================= */}

            <div className="leavePageHeader">

                <div className="leaveTitle">

                    <div>

                        <h1>
                            Leave Requests
                        </h1>

                        <span>
                            Manage employee leave requests
                        </span>

                    </div>

                </div>


                <div className="leaveCount">

                    <strong>
                        {Data.length}
                    </strong>

                    <span>
                        Requests
                    </span>

                </div>

            </div>


            {/* =============================================
                TOOLS
            ============================================= */}

            <div className="leaveTools">


                {/* SEARCH */}

                <div className="leaveSearch">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search leave requests..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    {search && (

                        <button
                            className="clearLeaveSearch"
                            onClick={
                                clearSearch
                            }
                        >

                            <FiX />

                        </button>

                    )}

                </div>


                {/* REFRESH */}

                <button
                    className="leaveRefresh"
                    onClick={
                        handleRefresh
                    }
                    disabled={loading}
                >

                    <FiRefreshCw
                        className={
                            loading
                                ? "leaveRefreshSpin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =============================================
                ERROR
            ============================================= */}

            {error && (

                <div className="leaveError">

                    <FiAlertCircle />

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={() =>
                            fetchData(page)
                        }
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =============================================
                TABLE
            ============================================= */}

            <div className="LeaveReqDatas">

                <table>

                    <thead>

                        <tr>

                            {title.map(
                                (column) => (

                                    <th
                                        key={column}
                                        onClick={() =>
                                            handleSort(
                                                column
                                            )
                                        }
                                    >

                                        <div className="leaveHeaderCell">

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


                    {/* =====================================
                        LOADING
                    ===================================== */}

                    {loading ? (

                        <tbody>

                            <tr>

                                <td
                                    colSpan={
                                        title.length
                                    }
                                    className="leaveLoading"
                                >

                                    <div className="leaveLoader"></div>

                                    Loading Leave Requests...

                                </td>

                            </tr>

                        </tbody>

                    ) : sortedData.length > 0 ? (

                        /* =================================
                           DATA
                        ================================= */

                        <tbody>

                            {sortedData.map(
                                (d, index) => (

                                    <tr
                                        key={
                                            d.id ||
                                            index
                                        }
                                        className="leaveRow"
                                    >

                                        {title.map(
                                            (column) => (

                                                <td
                                                    key={
                                                        column
                                                    }
                                                >

                                                    {column === "Status" ? (

                                                        <span
                                                            className={`leaveStatus ${getStatusClass(
                                                                d[column]
                                                            )}`}
                                                        >

                                                            <span className="leaveStatusDot"></span>

                                                            {d[column]}

                                                        </span>

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

                        /* =================================
                           EMPTY
                        ================================= */

                        <tbody>

                            <tr>

                                <td
                                    colSpan={
                                        title.length
                                    }
                                    className="leaveEmpty"
                                >

                                    <div className="leaveEmptyIcon">
                                        📋
                                    </div>

                                    <h3>
                                        No Leave Requests Found
                                    </h3>

                                    <p>

                                        {search
                                            ? "Try searching with another employee, manager or status."
                                            : "There are currently no leave requests."
                                        }

                                    </p>

                                </td>

                            </tr>

                        </tbody>

                    )}

                </table>

            </div>


            {/* =============================================
                PAGINATION
            ============================================= */}

            <div className="leavePagination">

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
    );
};


export default LeaveReq;

