import './Department.css';

import {
    GetAllEmployees,
    addFeedback
} from '../../Api/ManagerAccess';

import { useEffect, useState } from 'react';

import {
    FiSearch,
    FiMoreVertical,
    FiX,
    FiUser,
    FiBriefcase,
    FiUsers,
    FiMessageSquare,
    FiSend,
    FiChevronLeft,
    FiChevronRight,
    FiRefreshCw,
    FiStar
} from 'react-icons/fi';


const Department = () => {

    const token = localStorage.getItem('token');

    // =========================
    // Employees
    // =========================
    const [allEmployees, setAllEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // =========================
    // Pageable
    // =========================
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // =========================
    // Search
    // =========================
    const [search, setSearch] = useState('');

    // =========================
    // Employee Details Modal
    // =========================
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // =========================
    // Feedback Modal
    // =========================
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const [feedback, setFeedback] = useState({
        communicationScore: 0,
        teamworkScore: 0,
        helpfullnessScore: 0,
        knowledgeSharingScore: 0,
        comments: ''
    });

    const [feedbackLoading, setFeedbackLoading] = useState(false);

    // =========================
    // Notification
    // =========================
    const [notification, setNotification] = useState({
        show: false,
        type: '',
        message: ''
    });


    // ============================================================
    // Fetch Employees
    // ============================================================

    const fetchEmployees = async () => {

        try {

            setLoading(true);
            setError('');

            const response = await GetAllEmployees(
                token,
                page,
                size
            );

            const data = response?.data;

            const employees = data?.content || [];

            const responseData = employees.map((r) => ({
                id: r.id,
                designation: r.designation,
                empcode: r.empcode,
                firstname: r.firstname,
                lastname: r.lastname,
                departmentname: r.departmentname,
                managername: r.managername
            }));

            setAllEmployees(responseData);

            setTotalPages(data?.totalPages || 0);
            setTotalElements(data?.totalElements || 0);

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                'Unable to load employees. Please try again.'
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchEmployees();

    }, [page]);


    // ============================================================
    // Search
    // ============================================================

    const filteredEmployees = allEmployees.filter((employee) => {

        const searchValue = search.toLowerCase();

        return (
            employee.firstname?.toLowerCase().includes(searchValue) ||
            employee.lastname?.toLowerCase().includes(searchValue) ||
            employee.empcode?.toLowerCase().includes(searchValue) ||
            employee.designation?.toLowerCase().includes(searchValue)
        );

    });


    // ============================================================
    // Department Name
    // ============================================================

    const departmentName =
        allEmployees.length > 0
            ? allEmployees[0].departmentname
            : 'My Department';


    // ============================================================
    // Open Employee Details
    // ============================================================

    const openEmployeeDetails = (employee) => {

        setSelectedEmployee(employee);

    };


    // ============================================================
    // Close Employee Details
    // ============================================================

    const closeEmployeeDetails = () => {

        setSelectedEmployee(null);

    };


    // ============================================================
    // Open Feedback
    // ============================================================

    const openFeedback = () => {

        setFeedback({
            communicationScore: 0,
            teamworkScore: 0,
            helpfullnessScore: 0,
            knowledgeSharingScore: 0,
            comments: ''
        });

        setFeedbackOpen(true);

    };


    // ============================================================
    // Close Feedback
    // ============================================================

    const closeFeedback = () => {

        if (feedbackLoading) return;

        setFeedbackOpen(false);

    };


    // ============================================================
    // Feedback Change
    // ============================================================

    const handleFeedbackChange = (field, value) => {

        setFeedback((previous) => ({
            ...previous,
            [field]: value
        }));

    };


    // ============================================================
    // Submit Feedback
    // ============================================================

    const handleSubmitFeedback = async (e) => {

        e.preventDefault();

        if (!selectedEmployee) return;


        // Basic validation
        if (
            feedback.communicationScore === 0 ||
            feedback.teamworkScore === 0 ||
            feedback.helpfullnessScore === 0 ||
            feedback.knowledgeSharingScore === 0
        ) {

            showNotification(
                'error',
                'Please provide all ratings.'
            );

            return;
        }


        if (!feedback.comments.trim()) {

            showNotification(
                'error',
                'Please enter your feedback comments.'
            );

            return;
        }


        try {

            setFeedbackLoading(true);


            await addFeedback(
                token,
                selectedEmployee.id,
                feedback
            );


            setFeedbackOpen(false);

            setSelectedEmployee(null);


            showNotification(
                'success',
                `Feedback added successfully for ${selectedEmployee.firstname}.`
            );


            setFeedback({
                communicationScore: 0,
                teamworkScore: 0,
                helpfullnessScore: 0,
                knowledgeSharingScore: 0,
                comments: ''
            });


        } catch (err) {

            console.error(err);

            showNotification(
                'error',
                err?.response?.data?.message ||
                'Unable to add feedback. Please try again.'
            );

        } finally {

            setFeedbackLoading(false);
        }
    };


    // ============================================================
    // Notification
    // ============================================================

    const showNotification = (type, message) => {

        setNotification({
            show: true,
            type,
            message
        });


        setTimeout(() => {

            setNotification({
                show: false,
                type: '',
                message: ''
            });

        }, 3000);
    };


    // ============================================================
    // Initials
    // ============================================================

    const getInitials = (employee) => {

        const first =
            employee?.firstname?.charAt(0) || '';

        const last =
            employee?.lastname?.charAt(0) || '';

        return `${first}${last}`.toUpperCase();
    };


    // ============================================================
    // Rating Component
    // ============================================================

    const Rating = ({
        value,
        field
    }) => {

        return (

            <div className="feedback-rating">

                {[1, 2, 3, 4, 5].map((star) => (

                    <button
                        type="button"
                        key={star}
                        className={
                            star <= value
                                ? 'rating-star active'
                                : 'rating-star'
                        }
                        onClick={() =>
                            handleFeedbackChange(
                                field,
                                star
                            )
                        }
                    >

                        <FiStar />

                    </button>

                ))}

                <span className="rating-value">
                    {value === 0 ? 'Not rated' : `${value}/5`}
                </span>

            </div>
        );
    };


    // ============================================================
    // Loading UI
    // ============================================================

    if (loading) {

        return (

            <div className="DepartmentOuter">

                <div className="department-header skeleton-header">

                    <div className="skeleton skeleton-title"></div>

                    <div className="skeleton skeleton-search"></div>

                </div>


                <div className="employee-list">

                    {[1, 2, 3, 4, 5].map((item) => (

                        <div
                            className="employee-skeleton"
                            key={item}
                        >

                            <div className="skeleton skeleton-avatar"></div>

                            <div className="skeleton-content">

                                <div className="skeleton skeleton-line"></div>

                                <div className="skeleton skeleton-small"></div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        );
    }


    // ============================================================
    // Error UI
    // ============================================================

    if (error) {

        return (

            <div className="DepartmentOuter">

                <div className="department-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-btn"
                        onClick={fetchEmployees}
                    >

                        <FiRefreshCw />

                        Retry

                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="DepartmentOuter">


            {/* ==================================================
                Header
            ================================================== */}

            <div className="department-header">

                <div className="department-title-section">

                    <div className="department-icon">

                        <FiBriefcase />

                    </div>

                    <div>

                        <p className="department-label">
                            Department
                        </p>

                        <h1>
                            {departmentName}
                        </h1>

                        <span className="employee-count">

                            <FiUsers />

                            {totalElements} Employees

                        </span>

                    </div>

                </div>


                <div className="department-search">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (

                        <button
                            onClick={() => setSearch('')}
                            className="clear-search"
                        >

                            <FiX />

                        </button>

                    )}

                </div>

            </div>


            {/* ==================================================
                Employee List
            ================================================== */}

            {filteredEmployees.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        <FiUsers />
                    </div>

                    <h2>
                        No employees found
                    </h2>

                    <p>
                        {search
                            ? 'Try searching with a different name or employee code.'
                            : 'There are no employees available in your department.'
                        }
                    </p>

                    {search && (

                        <button
                            className="clear-filter-btn"
                            onClick={() => setSearch('')}
                        >
                            Clear Search
                        </button>

                    )}

                </div>

            ) : (

                <div className="employee-container">


                    {/* Desktop Table */}

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
                                        Department
                                    </th>

                                    <th>
                                        Manager
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredEmployees.map(
                                    (employee) => (

                                        <tr key={employee.id}>

                                            <td>

                                                <div className="employee-name">

                                                    <div className="employee-avatar">

                                                        {getInitials(employee)}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {employee.firstname}{' '}
                                                            {employee.lastname}
                                                        </strong>

                                                        <span>
                                                            {employee.designation}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="employee-code">

                                                    {employee.empcode}

                                                </span>

                                            </td>


                                            <td>

                                                {employee.designation}

                                            </td>


                                            <td>

                                                <span className="department-badge">

                                                    {employee.departmentname}

                                                </span>

                                            </td>


                                            <td>

                                                {employee.managername || '—'}

                                            </td>


                                            <td>

                                                <button
                                                    className="action-btn"
                                                    onClick={() =>
                                                        openEmployeeDetails(
                                                            employee
                                                        )
                                                    }
                                                    title="View Employee"
                                                >

                                                    <FiMoreVertical />

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* Mobile Cards */}

                    <div className="employee-mobile-list">

                        {filteredEmployees.map(
                            (employee) => (

                                <div
                                    className="employee-card"
                                    key={employee.id}
                                >

                                    <div className="employee-card-top">

                                        <div className="employee-name">

                                            <div className="employee-avatar">

                                                {getInitials(employee)}

                                            </div>

                                            <div>

                                                <strong>
                                                    {employee.firstname}{' '}
                                                    {employee.lastname}
                                                </strong>

                                                <span>
                                                    {employee.empcode}
                                                </span>

                                            </div>

                                        </div>


                                        <button
                                            className="action-btn"
                                            onClick={() =>
                                                openEmployeeDetails(
                                                    employee
                                                )
                                            }
                                        >

                                            <FiMoreVertical />

                                        </button>

                                    </div>


                                    <div className="mobile-details">

                                        <div>

                                            <span>
                                                Designation
                                            </span>

                                            <strong>
                                                {employee.designation}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                Department
                                            </span>

                                            <strong>
                                                {employee.departmentname}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* ==================================================
                        Pagination
                    ================================================== */}

                    {!search && totalPages > 0 && (

                        <div className="pagination">

                            <span className="pagination-info">

                                Page {page + 1} of {totalPages}

                            </span>


                            <div className="pagination-buttons">

                                <button
                                    disabled={page === 0}
                                    onClick={() =>
                                        setPage((prev) =>
                                            prev - 1
                                        )
                                    }
                                >

                                    <FiChevronLeft />

                                </button>


                                <span className="current-page">
                                    {page + 1}
                                </span>


                                <button
                                    disabled={
                                        page >= totalPages - 1
                                    }
                                    onClick={() =>
                                        setPage((prev) =>
                                            prev + 1
                                        )
                                    }
                                >

                                    <FiChevronRight />

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            )}


            {/* ==================================================
                Employee Details Modal
            ================================================== */}

            {selectedEmployee && (

                <div
                    className="modal-overlay"
                    onClick={closeEmployeeDetails}
                >

                    <div
                        className="employee-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <p>
                                    Employee Details
                                </p>

                                <h2>
                                    {selectedEmployee.firstname}{' '}
                                    {selectedEmployee.lastname}
                                </h2>

                            </div>


                            <button
                                className="modal-close"
                                onClick={closeEmployeeDetails}
                            >

                                <FiX />

                            </button>

                        </div>


                        <div className="employee-profile">

                            <div className="large-avatar">

                                {getInitials(selectedEmployee)}

                            </div>

                            <div>

                                <h3>

                                    {selectedEmployee.firstname}{' '}

                                    {selectedEmployee.lastname}

                                </h3>

                                <span>
                                    {selectedEmployee.designation}
                                </span>

                            </div>

                        </div>


                        <div className="details-grid">

                            <div className="detail-item">

                                <span>
                                    Employee ID
                                </span>

                                <strong>
                                    {selectedEmployee.empcode}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Employee Number
                                </span>

                                <strong>
                                    {selectedEmployee.id}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Designation
                                </span>

                                <strong>
                                    {selectedEmployee.designation}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Department
                                </span>

                                <strong>
                                    {selectedEmployee.departmentname}
                                </strong>

                            </div>


                            <div className="detail-item full">

                                <span>
                                    Manager
                                </span>

                                <strong>
                                    {selectedEmployee.managername || '—'}
                                </strong>

                            </div>

                        </div>


                        <div className="feedback-section">

                            <div>

                                <h3>
                                    Employee Feedback
                                </h3>

                                <p>
                                    Share your feedback about this employee.
                                </p>

                            </div>


                            <button
                                className="feedback-btn"
                                onClick={openFeedback}
                            >

                                <FiMessageSquare />

                                Add Feedback

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                Feedback Modal
            ================================================== */}

            {feedbackOpen && selectedEmployee && (

                <div
                    className="modal-overlay feedback-overlay"
                    onClick={closeFeedback}
                >

                    <form
                        className="feedback-modal"
                        onSubmit={handleSubmitFeedback}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <p>
                                    Employee Feedback
                                </p>

                                <h2>
                                    {selectedEmployee.firstname}{' '}
                                    {selectedEmployee.lastname}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeFeedback}
                            >

                                <FiX />

                            </button>

                        </div>


                        <div className="feedback-employee">

                            <div className="small-avatar">

                                {getInitials(selectedEmployee)}

                            </div>

                            <div>

                                <strong>
                                    {selectedEmployee.firstname}{' '}
                                    {selectedEmployee.lastname}
                                </strong>

                                <span>
                                    {selectedEmployee.empcode} •{' '}
                                    {selectedEmployee.designation}
                                </span>

                            </div>

                        </div>


                        <div className="rating-section">

                            <div className="rating-field">

                                <label>
                                    Communication
                                </label>

                                <Rating
                                    value={
                                        feedback.communicationScore
                                    }
                                    field="communicationScore"
                                />

                            </div>


                            <div className="rating-field">

                                <label>
                                    Teamwork
                                </label>

                                <Rating
                                    value={
                                        feedback.teamworkScore
                                    }
                                    field="teamworkScore"
                                />

                            </div>


                            <div className="rating-field">

                                <label>
                                    Helpfulness
                                </label>

                                <Rating
                                    value={
                                        feedback.helpfullnessScore
                                    }
                                    field="helpfullnessScore"
                                />

                            </div>


                            <div className="rating-field">

                                <label>
                                    Knowledge Sharing
                                </label>

                                <Rating
                                    value={
                                        feedback.knowledgeSharingScore
                                    }
                                    field="knowledgeSharingScore"
                                />

                            </div>

                        </div>


                        <div className="comments-field">

                            <label>
                                Comments
                            </label>

                            <textarea
                                placeholder="Write your feedback here..."
                                value={feedback.comments}
                                onChange={(e) =>
                                    handleFeedbackChange(
                                        'comments',
                                        e.target.value
                                    )
                                }
                                maxLength={1000}
                                rows={5}
                            />

                            <span>
                                {feedback.comments.length}/1000
                            </span>

                        </div>


                        <div className="feedback-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeFeedback}
                                disabled={feedbackLoading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="submit-feedback-btn"
                                disabled={feedbackLoading}
                            >

                                {feedbackLoading ? (

                                    <>
                                        <span className="button-spinner"></span>

                                        Submitting...

                                    </>

                                ) : (

                                    <>
                                        <FiSend />

                                        Submit Feedback
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ==================================================
                Notification
            ================================================== */}

            {notification.show && (

                <div
                    className={`department-notification ${notification.type}`}
                >

                    <div className="notification-icon">

                        {notification.type === 'success'
                            ? '✓'
                            : '!'}

                    </div>

                    <span>
                        {notification.message}
                    </span>

                </div>

            )}

        </div>
    );
};


export default Department;