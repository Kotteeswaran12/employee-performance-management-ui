import { useEffect, useMemo, useState } from "react";
import {
    GetAllEmployees,
    createReview,
    getReviewById
} from "../../Api/ManagerAccess";

import {
    FiSearch,
    FiUsers,
    FiPlus,
    FiEye,
    FiX,
    FiCalendar,
    FiMessageSquare,
    FiAward,
    FiActivity,
    FiCheckCircle,
    FiAlertCircle,
    FiChevronRight,
    FiChevronLeft,
    FiStar
} from "react-icons/fi";

import "./Review.css";


const Review = () => {

    const Token = localStorage.getItem("token");


    /* =========================================================
       EMPLOYEES
    ========================================================= */


    const [EmployeeList, setEmployeeList] = useState([]);

    const [employeeOverallScores, setEmployeeOverallScores] = useState({});

    const [loadingEmployees, setLoadingEmployees] =
        useState(true);

    const [search, setSearch] = useState("");


    /* =========================================================
       PAGINATION
    ========================================================= */

    const [currentPage, setCurrentPage] = useState(1);

    const employeesPerPage = 8;


    /* =========================================================
       REVIEW HISTORY
    ========================================================= */

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [showReviewHistory, setShowReviewHistory] =
        useState(false);

    const [reviewHistory, setReviewHistory] =
        useState([]);

    const [loadingReviews, setLoadingReviews] =
        useState(false);


    /* =========================================================
       CREATE REVIEW
    ========================================================= */

    const [showCreateReview, setShowCreateReview] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);


    /* =========================================================
       FORM
    ========================================================= */

    const [reviewForm, setReviewForm] = useState({
        qualityScore: 0,
        remarks: ""
    });


    /* =========================================================
       NOTIFICATION
    ========================================================= */

    const [notification, setNotification] =
        useState(null);
    /* =========================================================
         NOTIFICATION
      ========================================================= */

    const showNotification = (
        message,
        type = "success"
    ) => {

        setNotification({
            message,
            type
        });

        setTimeout(() => {

            setNotification(null);

        }, 3500);

    };

    /* =========================================================
       FETCH EMPLOYEES
    ========================================================= */

    const fetchEmpData = async () => {

        try {

            setLoadingEmployees(true);

            const response =
                await GetAllEmployees(Token);

            const content =
                response?.data?.content || [];


            const responseData =
                content.map((employee) => ({
                    id: employee.id,
                    empcode: employee.empcode,
                    designation: employee.designation,
                    firstname: employee.firstname,
                    lastname: employee.lastname
                }));


            setEmployeeList(responseData);


            /*
             * Fetch latest overall score
             * for every employee.
             */

            const scoreResults =
                await Promise.all(

                    responseData.map(
                        async (employee) => {

                            try {

                                const reviewResponse =
                                    await getReviewById(
                                        Token,
                                        employee.id
                                    );


                                const data =
                                    reviewResponse?.data;


                                let reviews = [];


                                /*
                                 * API can return:
                                 * Array
                                 * Page object
                                 * Single object
                                 */

                                if (Array.isArray(data)) {

                                    reviews = data;

                                } else if (
                                    Array.isArray(
                                        data?.content
                                    )
                                ) {

                                    reviews =
                                        data.content;

                                } else if (data) {

                                    reviews = [data];

                                }


                                /*
                                 * Remove invalid/default
                                 * review records.
                                 */

                                const realReviews =
                                    reviews.filter(
                                        (review) =>
                                            review?.id !== 0
                                    );


                                if (
                                    realReviews.length === 0
                                ) {

                                    return {
                                        employeeId:
                                            employee.id,

                                        overallScore:
                                            null
                                    };

                                }


                                /*
                                 * Get latest review.
                                 */

                                const latestReview =
                                    [...realReviews].sort(
                                        (a, b) =>
                                            new Date(
                                                b?.reviewDate || 0
                                            ) -
                                            new Date(
                                                a?.reviewDate || 0
                                            )
                                    )[0];


                                return {
                                    employeeId:
                                        employee.id,

                                    overallScore:
                                        latestReview?.overallScore ??
                                        latestReview?.qualityScore ??
                                        null
                                };

                            } catch (error) {

                                console.error(
                                    `Unable to fetch review for employee ${employee.id}:`,
                                    error
                                );


                                return {
                                    employeeId:
                                        employee.id,

                                    overallScore:
                                        null
                                };

                            }

                        }
                    )

                );


            /*
             * Convert results into:
             *
             * {
             *     1: 8.5,
             *     2: 7,
             *     3: null
             * }
             */

            const scoreMap = {};


            scoreResults.forEach(
                (result) => {

                    scoreMap[
                        result.employeeId
                    ] = result.overallScore;

                }
            );


            setEmployeeOverallScores(
                scoreMap
            );


        } catch (error) {

            console.error(
                "Employee fetch error:",
                error
            );

            showNotification(
                "Unable to load employees",
                "error"
            );

        } finally {

            setLoadingEmployees(false);

        }

    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEmpData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* =========================================================
       SEARCH
    ========================================================= */

    const filteredEmployees = useMemo(() => {

        const value =
            search.toLowerCase().trim();

        if (!value) {
            return EmployeeList;
        }

        return EmployeeList.filter(
            (employee) => {

                const fullName =
                    `${employee.firstname || ""} ${employee.lastname || ""}`
                        .toLowerCase();

                return (
                    fullName.includes(value) ||
                    employee.empcode
                        ?.toLowerCase()
                        .includes(value) ||
                    employee.designation
                        ?.toLowerCase()
                        .includes(value)
                );

            }
        );

    }, [EmployeeList, search]);


    /* =========================================================
       RESET PAGE ON SEARCH
    ========================================================= */

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);


    /* =========================================================
       PAGINATION
    ========================================================= */

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredEmployees.length /
            employeesPerPage
        )
    );


    const startIndex =
        (currentPage - 1) *
        employeesPerPage;


    const endIndex =
        startIndex +
        employeesPerPage;


    const currentEmployees =
        filteredEmployees.slice(
            startIndex,
            endIndex
        );


    useEffect(() => {

        if (currentPage > totalPages) {

            setCurrentPage(
                totalPages
            );

        }

    }, [
        currentPage,
        totalPages
    ]);


    const changePage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    const pageNumbers = useMemo(() => {

        const pages = [];

        if (totalPages <= 6) {

            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {

                pages.push(i);

            }

            return pages;
        }


        pages.push(1);


        if (currentPage > 3) {

            pages.push(
                "left-dots"
            );

        }


        const start =
            Math.max(
                2,
                currentPage - 1
            );


        const end =
            Math.min(
                totalPages - 1,
                currentPage + 1
            );


        for (
            let i = start;
            i <= end;
            i++
        ) {

            pages.push(i);

        }


        if (
            currentPage <
            totalPages - 2
        ) {

            pages.push(
                "right-dots"
            );

        }


        pages.push(
            totalPages
        );


        return pages;

    }, [
        totalPages,
        currentPage
    ]);





    /* =========================================================
       DEFAULT REVIEW
    ========================================================= */

    const getDefaultReview = (
        employee
    ) => {

        return {
            id: 0,
            attendanceScore: 0,
            taskScore: 0,
            feedbackScore: 0,
            qualityScore: 0,
            overallScore: 0,
            remarks: "",
            reviewDate: null,
            employees: employee.id,
            reviewBy: ""
        };

    };


    /* =========================================================
       OPEN REVIEW HISTORY
    ========================================================= */

    const openReviewHistory = async (
        employee
    ) => {

        setSelectedEmployee(
            employee
        );

        setShowReviewHistory(
            true
        );

        setLoadingReviews(
            true
        );

        setReviewHistory([]);


        const defaultReview =
            getDefaultReview(
                employee
            );

        console.log(employee)
        try {

            const response =
                await getReviewById(
                    Token,
                    employee.id
                );


            const data =
                response?.data;


            console.log(data)

            let reviews = [];


            if (Array.isArray(data)) {

                reviews = data;

            } else if (
                Array.isArray(
                    data?.content
                )
            ) {

                reviews =
                    data.content;

            } else if (data) {

                reviews = [data];

            }


            /*
             * If API returns no review,
             * show default values.
             */

            if (
                reviews.length === 0
            ) {

                reviews = [
                    defaultReview
                ];

            }


            /*
             * Protect the UI from
             * null / undefined values.
             */

            reviews =
                reviews.map(
                    (review) => ({

                        id:
                            review?.id ??
                            0,

                        attendanceScore:
                            review?.attendanceScore ??
                            0,

                        taskScore:
                            review?.taskScore ??
                            0,

                        feedbackScore:
                            review?.feedbackScore ??
                            0,

                        qualityScore:
                            review?.qualityScore ??
                            0,

                        overallScore:
                            review?.overallScore ??
                            review?.qualityScore ??
                            0,

                        remarks:
                            review?.remarks ??
                            "",

                        reviewDate:
                            review?.reviewDate ??
                            null,

                        employees:
                            review?.employees ??
                            employee.id,

                        reviewBy:
                            review?.reviewBy ??
                            ""

                    })
                );


            setReviewHistory(
                reviews
            );

        } catch (error) {

            console.error(
                "Review fetch error:",
                error
            );


            /*
             * Even if the API throws
             * or returns nothing,
             * show default values.
             */

            setReviewHistory([
                defaultReview
            ]);

        } finally {

            setLoadingReviews(
                false
            );

        }

    };


    /* =========================================================
       REAL REVIEW CHECK
    ========================================================= */

    const hasRealReview =
        reviewHistory.some(
            (review) =>
                review.id !== 0
        );


    /* =========================================================
       OPEN CREATE REVIEW
    ========================================================= */

    const openCreateReview = () => {

        setReviewForm({
            qualityScore: 0,
            remarks: ""
        });

        setShowCreateReview(
            true
        );

    };


    /* =========================================================
       CLOSE HISTORY
    ========================================================= */

    const closeHistory = () => {

        if (loadingReviews) {
            return;
        }

        setShowReviewHistory(
            false
        );

    };


    /* =========================================================
       CLOSE CREATE REVIEW
    ========================================================= */

    const closeCreateReview = () => {

        if (submitting) {
            return;
        }

        setShowCreateReview(
            false
        );

    };


    /* =========================================================
       SCORE CHANGE
    ========================================================= */

    const handleScoreChange = (
        value
    ) => {

        const score =
            Math.min(
                10,
                Math.max(
                    0,
                    Number(value)
                )
            );


        setReviewForm(
            (previous) => ({
                ...previous,
                qualityScore:
                    score
            })
        );

    };


    /* =========================================================
       REMARKS CHANGE
    ========================================================= */

    const handleRemarksChange = (
        event
    ) => {


        setReviewForm(
            (previous) => ({
                ...previous,
                remarks:
                    event.target.value
            })
        );

    };


    /* =========================================================
       SUBMIT REVIEW
    ========================================================= */

    const handleSubmitReview = async (
        event
    ) => {

        console.log(reviewForm)

        event.preventDefault();


        if (!selectedEmployee) {
            return;
        }


        if (
            reviewForm.qualityScore <= 0
        ) {

            showNotification(
                "Please provide a quality score",
                "error"
            );

            return;
        }


        try {

            setSubmitting(
                true
            );


            await createReview(
                Token,
                selectedEmployee.id,
                Number(
                    reviewForm.qualityScore
                ),
                reviewForm.remarks.trim()
            );


            showNotification(
                "Review created successfully",
                "success"
            );


            setShowCreateReview(
                false
            );


            /*
             * Refresh the review
             * history after creation.
             */

            await openReviewHistory(
                selectedEmployee
            );


        } catch (error) {

            console.error(
                "Create review error:",
                error
            );


            showNotification(
                "Unable to create review",
                "error"
            );

        } finally {

            setSubmitting(
                false
            );

        }

    };


    /* =========================================================
       INITIALS
    ========================================================= */

    const getInitials = (
        employee
    ) => {

        const first =
            employee.firstname
                ?.charAt(0) || "";

        const last =
            employee.lastname
                ?.charAt(0) || "";


        return (
            first + last
        ).toUpperCase();

    };


    /* =========================================================
       DATE FORMAT
    ========================================================= */

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "N/A";
        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    /* =========================================================
       SCORE CLASS
    ========================================================= */

    const getScoreClass = (
        score
    ) => {

        const value =
            Number(score || 0);


        if (value >= 8) {
            return "excellent";
        }


        if (value >= 6) {
            return "good";
        }


        if (value >= 4) {
            return "average";
        }


        return "poor";

    };


    /* =========================================================
       SORT REVIEWS
    ========================================================= */

    const sortedReviews =
        useMemo(() => {

            return [
                ...reviewHistory
            ].sort(
                (a, b) =>
                    new Date(
                        b.reviewDate
                    ) -
                    new Date(
                        a.reviewDate
                    )
            );

        }, [
            reviewHistory
        ]);


    const latestReview =
        sortedReviews[0];


    /* =========================================================
       JSX
    ========================================================= */

    return (

        <div className="review-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="review-header">

                <div className="review-heading">

                    <div className="heading-icon">
                        <FiAward />
                    </div>


                    <div>

                        <span className="heading-label">
                            PERFORMANCE CENTER
                        </span>

                        <h1>
                            Employee Reviews
                        </h1>

                        <p>
                            Evaluate performance,
                            track progress and
                            provide meaningful
                            feedback.
                        </p>

                    </div>

                </div>


                <div className="header-stat">

                    <div className="header-stat-icon">
                        <FiUsers />
                    </div>


                    <div>

                        <strong>
                            {
                                EmployeeList.length
                            }
                        </strong>

                        <span>
                            Team Members
                        </span>

                    </div>

                </div>

            </header>


            {/* =================================================
                SEARCH TOOLBAR
            ================================================= */}

            <div className="review-toolbar">

                <div className="search-wrapper">

                    <FiSearch />


                    <input
                        type="text"
                        placeholder="Search employee, ID or designation..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />


                    {search && (

                        <button
                            className="clear-search"
                            onClick={() =>
                                setSearch("")
                            }
                        >

                            <FiX />

                        </button>

                    )}

                </div>


                <div className="employee-count">

                    <span>
                        Showing
                    </span>


                    <strong>

                        {
                            filteredEmployees.length === 0
                                ? 0
                                : startIndex + 1
                        }

                    </strong>


                    <span>
                        -
                    </span>


                    <strong>

                        {
                            Math.min(
                                endIndex,
                                filteredEmployees.length
                            )
                        }

                    </strong>


                    <span>
                        of
                    </span>


                    <strong>
                        {
                            filteredEmployees.length
                        }
                    </strong>


                    <span>
                        employees
                    </span>

                </div>

            </div>


            {/* =================================================
                EMPLOYEE LIST
            ================================================= */}

            <div className="employee-container">


                {loadingEmployees ? (

                    <div className="loading-state">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading employees...
                        </p>

                    </div>


                ) : filteredEmployees.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">

                            <FiUsers />

                        </div>


                        <h3>
                            No employees found
                        </h3>


                        <p>
                            Try searching with a
                            different employee
                            name, ID or designation.
                        </p>

                    </div>


                ) : (

                    <>


                        {/* =================================================
                            DESKTOP TABLE
                        ================================================= */}

                        <div className="employee-table-wrapper">

                            <table className="employee-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Employee
                                        </th>

                                        <th>
                                            Employee ID
                                        </th>

                                        <th>
                                            Designation
                                        </th>

                                        <th>
                                            Overall
                                        </th>

                                        <th className="action-column">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        currentEmployees.map(
                                            (employee) => (

                                                <tr
                                                    key={
                                                        employee.id
                                                    }
                                                >

                                                    <td>

                                                        <div className="employee-info">

                                                            <div className="employee-avatar">

                                                                {
                                                                    getInitials(
                                                                        employee
                                                                    )
                                                                }

                                                            </div>


                                                            <div>

                                                                <strong>

                                                                    {
                                                                        employee.firstname
                                                                    }{" "}

                                                                    {
                                                                        employee.lastname
                                                                    }

                                                                </strong>


                                                                <span>
                                                                    Team Member
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span className="employee-code">

                                                            #

                                                            {
                                                                employee.empcode
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="designation-badge">

                                                            {
                                                                employee.designation
                                                            }

                                                        </span>

                                                    </td>
                                                    <td>

                                                        {
                                                            employeeOverallScores[
                                                                employee.id
                                                            ] !== null &&
                                                                employeeOverallScores[
                                                                employee.id
                                                                ] !== undefined
                                                                ? (
                                                                    <div className="overall-score-cell">

                                                                        <strong>
                                                                            {
                                                                                employeeOverallScores[
                                                                                employee.id
                                                                                ]
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            /100
                                                                        </span>

                                                                    </div>
                                                                )
                                                                : (
                                                                    <span className="overall-score-na">
                                                                        N/A
                                                                    </span>
                                                                )
                                                        }

                                                    </td>


                                                    <td className="action-column">

                                                        <button
                                                            className="review-action-btn"
                                                            onClick={() =>
                                                                openReviewHistory(
                                                                    employee
                                                                )
                                                            }
                                                        >

                                                            <FiEye />

                                                            <span>
                                                                Review
                                                            </span>

                                                            <FiChevronRight />

                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            MOBILE CARDS
                        ================================================= */}

                        <div className="employee-mobile-list">

                            {
                                currentEmployees.map(
                                    (employee) => (

                                        <div
                                            className="employee-mobile-card"
                                            key={
                                                employee.id
                                            }
                                        >

                                            <div className="mobile-employee-top">

                                                <div className="employee-info">

                                                    <div className="employee-avatar">

                                                        {
                                                            getInitials(
                                                                employee
                                                            )
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                employee.firstname
                                                            }{" "}

                                                            {
                                                                employee.lastname
                                                            }

                                                        </strong>


                                                        <span>

                                                            #

                                                            {
                                                                employee.empcode
                                                            }

                                                        </span>

                                                    </div>

                                                </div>


                                                <FiChevronRight />

                                            </div>


                                            <div className="mobile-designation">

                                                {
                                                    employee.designation
                                                }

                                            </div>


                                            <button
                                                className="review-action-btn mobile-action"
                                                onClick={() =>
                                                    openReviewHistory(
                                                        employee
                                                    )
                                                }
                                            >

                                                <FiEye />

                                                View Employee Reviews

                                            </button>

                                        </div>

                                    )
                                )
                            }

                        </div>


                        {/* =================================================
                            PAGINATION
                        ================================================= */}

                        {
                            totalPages > 1 && (

                                <div className="pagination">


                                    <button
                                        className="pagination-arrow"
                                        disabled={
                                            currentPage ===
                                            1
                                        }
                                        onClick={() =>
                                            changePage(
                                                currentPage - 1
                                            )
                                        }
                                    >

                                        <FiChevronLeft />

                                        <span>
                                            Previous
                                        </span>

                                    </button>


                                    <div className="page-numbers">

                                        {
                                            pageNumbers.map(
                                                (
                                                    page,
                                                    index
                                                ) => {

                                                    if (
                                                        page ===
                                                        "left-dots" ||
                                                        page ===
                                                        "right-dots"
                                                    ) {

                                                        return (

                                                            <span
                                                                className="page-dots"
                                                                key={
                                                                    `${page}-${index}`
                                                                }
                                                            >
                                                                ...
                                                            </span>

                                                        );

                                                    }


                                                    return (

                                                        <button
                                                            key={
                                                                page
                                                            }
                                                            className={
                                                                currentPage ===
                                                                    page
                                                                    ? "page-number active"
                                                                    : "page-number"
                                                            }
                                                            onClick={() =>
                                                                changePage(
                                                                    page
                                                                )
                                                            }
                                                        >

                                                            {
                                                                page
                                                            }

                                                        </button>

                                                    );

                                                }
                                            )
                                        }

                                    </div>


                                    <button
                                        className="pagination-arrow"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            changePage(
                                                currentPage + 1
                                            )
                                        }
                                    >

                                        <span>
                                            Next
                                        </span>

                                        <FiChevronRight />

                                    </button>

                                </div>

                            )
                        }

                    </>

                )}

            </div>


            {/* =================================================
                REVIEW HISTORY MODAL
            ================================================= */}

            {
                showReviewHistory &&
                selectedEmployee && (

                    <div
                        className="modal-overlay"
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget &&
                                !loadingReviews
                            ) {

                                closeHistory();

                            }

                        }}
                    >

                        <div className="review-history-modal">


                            {/* HEADER */}

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-title-icon">

                                        <FiActivity />

                                    </div>


                                    <div>

                                        <span>
                                            PERFORMANCE HISTORY
                                        </span>


                                        <h2>

                                            {
                                                selectedEmployee.firstname
                                            }{" "}

                                            {
                                                selectedEmployee.lastname
                                            }

                                        </h2>


                                        <p>

                                            #

                                            {
                                                selectedEmployee.empcode
                                            }

                                            {" • "}

                                            {
                                                selectedEmployee.designation
                                            }

                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="modal-close"
                                    onClick={
                                        closeHistory
                                    }
                                >

                                    <FiX />

                                </button>

                            </div>


                            {/* BODY */}

                            <div className="modal-body">


                                {
                                    loadingReviews ? (

                                        <div className="modal-loading">

                                            <div className="loading-spinner"></div>

                                            <p>
                                                Fetching review history...
                                            </p>

                                        </div>


                                    ) : (

                                        <div className="review-history-content">


                                            {/* LATEST REVIEW */}

                                            {
                                                latestReview && (

                                                    <div className="latest-review">


                                                        <div className="latest-review-header">

                                                            <div>

                                                                <span>
                                                                    {
                                                                        hasRealReview
                                                                            ? "LATEST REVIEW"
                                                                            : "NO REVIEW YET"
                                                                    }
                                                                </span>


                                                                <h3>
                                                                    Performance
                                                                    Overview
                                                                </h3>

                                                            </div>


                                                            <div
                                                                className={`overall-score ${getScoreClass(
                                                                    latestReview.overallScore
                                                                )}`}
                                                            >

                                                                <strong>

                                                                    {
                                                                        latestReview.overallScore ??
                                                                        0
                                                                    }

                                                                </strong>


                                                                <span>
                                                                    / 100
                                                                </span>

                                                            </div>

                                                        </div>


                                                        {/* SCORE GRID */}

                                                        <div className="score-grid">

                                                            <ScoreItem
                                                                title="Attendance"
                                                                value={
                                                                    latestReview.attendanceScore
                                                                }
                                                            />


                                                            <ScoreItem
                                                                title="Task Performance"
                                                                value={
                                                                    latestReview.taskScore
                                                                }
                                                            />


                                                            <ScoreItem
                                                                title="Feedback"
                                                                value={
                                                                    latestReview.feedbackScore
                                                                }
                                                            />


                                                            <ScoreItem
                                                                title="Quality"
                                                                value={
                                                                    latestReview.qualityScore
                                                                }
                                                            />

                                                        </div>


                                                        {/* META */}

                                                        {
                                                            hasRealReview && (

                                                                <div className="review-meta">

                                                                    <div>

                                                                        <FiCalendar />

                                                                        <span>

                                                                            {
                                                                                formatDate(
                                                                                    latestReview.reviewDate
                                                                                )
                                                                            }

                                                                        </span>

                                                                    </div>


                                                                    <div>

                                                                        <FiAward />

                                                                        <span>

                                                                            Reviewed
                                                                            by{" "}

                                                                            {
                                                                                latestReview.reviewBy ||
                                                                                "Manager"
                                                                            }

                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            )
                                                        }


                                                        {/* REMARKS */}

                                                        {
                                                            hasRealReview &&
                                                            latestReview.remarks && (

                                                                <div className="remarks-box">

                                                                    <FiMessageSquare />


                                                                    <div>

                                                                        <span>
                                                                            MANAGER
                                                                            REMARKS
                                                                        </span>


                                                                        <p>
                                                                            {
                                                                                latestReview.remarks
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            )
                                                        }


                                                        {
                                                            !hasRealReview && (

                                                                <div className="no-review-message">

                                                                    <FiStar />

                                                                    <span>
                                                                        No review has been
                                                                        created for this
                                                                        employee yet.
                                                                    </span>

                                                                </div>

                                                            )
                                                        }

                                                    </div>

                                                )
                                            }


                                            {/* PREVIOUS REVIEWS */}

                                            {
                                                hasRealReview &&
                                                sortedReviews.length >
                                                1 && (

                                                    <div className="previous-reviews">

                                                        <div className="section-heading">

                                                            <div>

                                                                <span>
                                                                    HISTORY
                                                                </span>

                                                                <h3>
                                                                    Previous Reviews
                                                                </h3>

                                                            </div>


                                                            <span className="review-count">

                                                                {
                                                                    sortedReviews.length
                                                                }

                                                                {" "}
                                                                reviews

                                                            </span>

                                                        </div>


                                                        <div className="history-list">

                                                            {
                                                                sortedReviews
                                                                    .slice(1)
                                                                    .map(
                                                                        (
                                                                            review,
                                                                            index
                                                                        ) => (

                                                                            <div
                                                                                className="history-item"
                                                                                key={
                                                                                    review.id ||
                                                                                    index
                                                                                }
                                                                            >

                                                                                <div className="history-date">

                                                                                    <FiCalendar />

                                                                                    <span>

                                                                                        {
                                                                                            formatDate(
                                                                                                review.reviewDate
                                                                                            )
                                                                                        }

                                                                                    </span>

                                                                                </div>


                                                                                <div className="history-score">

                                                                                    <strong>

                                                                                        {
                                                                                            review.overallScore ??
                                                                                            review.qualityScore ??
                                                                                            0
                                                                                        }

                                                                                    </strong>


                                                                                    <span>
                                                                                        /10
                                                                                    </span>

                                                                                </div>


                                                                                <div className="history-remarks">

                                                                                    {
                                                                                        review.remarks ||
                                                                                        "No remarks provided"
                                                                                    }

                                                                                </div>

                                                                            </div>

                                                                        )
                                                                    )
                                                            }

                                                        </div>

                                                    </div>

                                                )
                                            }

                                        </div>

                                    )
                                }

                            </div>


                            {/* FOOTER */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        closeHistory
                                    }
                                >
                                    Close
                                </button>


                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={
                                        openCreateReview
                                    }
                                >

                                    <FiPlus />

                                    Create New Review

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }


            {/* =================================================
                CREATE REVIEW MODAL
            ================================================= */}

            {
                showCreateReview &&
                selectedEmployee && (

                    <div
                        className="modal-overlay create-modal-overlay"
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget &&
                                !submitting
                            ) {

                                closeCreateReview();

                            }

                        }}
                    >

                        <form
                            className="create-review-modal"
                            onSubmit={
                                handleSubmitReview
                            }
                        >


                            {/* HEADER */}

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-title-icon create">

                                        <FiPlus />

                                    </div>


                                    <div>

                                        <span>
                                            NEW PERFORMANCE REVIEW
                                        </span>


                                        <h2>
                                            Create Review
                                        </h2>


                                        <p>

                                            {
                                                selectedEmployee.firstname
                                            }{" "}

                                            {
                                                selectedEmployee.lastname
                                            }

                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={
                                        closeCreateReview
                                    }
                                >

                                    <FiX />

                                </button>

                            </div>


                            {/* BODY */}

                            <div className="create-modal-body">


                                {/* SCORE OVERVIEW */}

                                <div className="score-overview">

                                    <div>

                                        <span>
                                            QUALITY SCORE
                                        </span>


                                        <strong>

                                            {
                                                reviewForm.qualityScore
                                            }

                                        </strong>


                                        <small>
                                            / 10
                                        </small>

                                    </div>


                                    <div className="score-progress">

                                        <div
                                            className={`score-progress-fill ${getScoreClass(
                                                reviewForm.qualityScore
                                            )}`}
                                            style={{
                                                width:
                                                    `${reviewForm.qualityScore *
                                                    10
                                                    }%`
                                            }}
                                        ></div>

                                    </div>

                                </div>


                                {/* QUALITY */}

                                <div className="form-section">

                                    <div className="form-section-title">

                                        <div>

                                            <span>
                                                PERFORMANCE METRIC
                                            </span>


                                            <h3>
                                                Rate Work Quality
                                            </h3>

                                        </div>


                                        <small>
                                            0 — 10
                                        </small>

                                    </div>


                                    <ScoreInput
                                        label="Work Quality"
                                        icon={
                                            <FiAward />
                                        }
                                        value={
                                            reviewForm.qualityScore
                                        }
                                        onChange={
                                            handleScoreChange
                                        }
                                    />

                                </div>


                                {/* REMARKS */}

                                <div className="form-section">

                                    <div className="form-section-title">

                                        <div>

                                            <span>
                                                MANAGER FEEDBACK
                                            </span>


                                            <h3>
                                                Add Remarks
                                            </h3>

                                        </div>

                                    </div>


                                    <div className="textarea-wrapper">

                                        <FiMessageSquare />


                                        <textarea
                                            placeholder="Write your observations, achievements, areas for improvement or additional feedback..."
                                            value={
                                                reviewForm.remarks
                                            }
                                            onChange={
                                                handleRemarksChange
                                            }
                                            maxLength={
                                                500
                                            }
                                        />


                                        <span>

                                            {
                                                reviewForm
                                                    .remarks
                                                    .length
                                            }

                                            /500

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        closeCreateReview
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn submit-btn"
                                    disabled={
                                        submitting
                                    }
                                >

                                    {
                                        submitting ? (

                                            <>

                                                <div className="button-spinner"></div>

                                                Submitting...

                                            </>

                                        ) : (

                                            <>

                                                <FiCheckCircle />

                                                Submit Review

                                            </>
                                        )
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                )
            }


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            {
                notification && (

                    <div
                        className={`review-notification ${notification.type}`}
                    >

                        {
                            notification.type ===
                                "success"
                                ? <FiCheckCircle />
                                : <FiAlertCircle />
                        }


                        <span>
                            {
                                notification.message
                            }
                        </span>


                        <button
                            onClick={() =>
                                setNotification(
                                    null
                                )
                            }
                        >

                            <FiX />

                        </button>

                    </div>

                )
            }

        </div>

    );

};


/* =============================================================
   SCORE ITEM
============================================================= */

const ScoreItem = ({
    title,
    value
}) => {

    const score =
        Number(value || 0);


    let scoreClass =
        "poor";


    if (score >= 8) {

        scoreClass =
            "excellent";

    } else if (score >= 6) {

        scoreClass =
            "good";

    } else if (score >= 4) {

        scoreClass =
            "average";

    }


    return (

        <div className="score-item">

            <div className="score-item-top">

                <span>
                    {title}
                </span>


                <strong
                    className={
                        scoreClass
                    }
                >
                    {score}
                </strong>

            </div>


            <div className="score-bar">

                <div
                    className={
                        scoreClass
                    }
                    style={{
                        width:
                            `${score * 10}%`
                    }}
                ></div>

            </div>

        </div>

    );

};


/* =============================================================
   SCORE INPUT
============================================================= */

const ScoreInput = ({
    label,
    icon,
    value,
    onChange
}) => {

    return (

        <div className="score-input-card">

            <div className="score-input-header">

                <div className="score-input-label">

                    <div className="score-input-icon">
                        {icon}
                    </div>


                    <span>
                        {label}
                    </span>

                </div>


                <strong>
                    {value}
                </strong>

            </div>


            <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={value}
                onChange={(event) =>
                    onChange(
                        Number(
                            event.target.value
                        )
                    )
                }
            />


            <div className="range-labels">

                <span>
                    0
                </span>


                <span>
                    5
                </span>


                <span>
                    10
                </span>

            </div>

        </div>

    );

};


export default Review;