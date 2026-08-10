import './ManagerLeave.css';
import { getAllEmpLeave, updateLeaveStatus } from '../../Api/ManagerAccess';
import { useEffect, useMemo, useState } from 'react';

const ManagerLeave = () => {

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [selectedLeave, setSelectedLeave] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const token = localStorage.getItem('token');


    // =====================================================
    // FETCH ALL EMPLOYEE LEAVE REQUESTS
    // =====================================================

    const fetchData = async () => {

        try {

            setLoading(true);

            const response = await getAllEmpLeave(token);

            const resData = response.data.content.map((leave) => ({
                id: leave.id,
                name: leave.employeName,
                from: leave.startingDate,
                to: leave.endingDate,
                status: leave.status
            }));

            setLeaves(resData);

        } catch (error) {

            console.error(
                'Error fetching leave requests:',
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalLeaves = leaves.length;

    const pendingLeaves = leaves.filter(
        (leave) => leave.status === 'PENDING'
    ).length;

    const approvedLeaves = leaves.filter(
        (leave) => leave.status === 'APROVED'
    ).length;

    const rejectedLeaves = leaves.filter(
        (leave) => leave.status === 'REJECTED'
    ).length;


    // =====================================================
    // SEARCH + STATUS FILTER
    // =====================================================

    const filteredLeaves = useMemo(() => {

        return leaves.filter((leave) => {

            const matchesSearch =
                leave.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === 'ALL' ||
                leave.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [leaves, search, statusFilter]);


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

    };


    // =====================================================
    // OPEN LEAVE ACTION
    // ONLY PENDING REQUESTS CAN BE OPENED
    // =====================================================

    const openLeaveAction = (leave) => {
        console.log(leave)
        setSelectedLeave(leave);
    };


    // =====================================================
    // ACCEPT / REJECT LEAVE
    // =====================================================

    const handleLeaveAction = async (status) => {

        if (!selectedLeave) {
            return;
        }

        if (selectedLeave.status !== 'PENDING') {

            console.warn(
                'Leave cannot be updated. Current status:',
                selectedLeave.status
            );

            setSelectedLeave(null);

            return;
        }


        setActionLoading(true);


        try {

            const response = await updateLeaveStatus(
                token,
                selectedLeave.id,
                status.toUpperCase()
            );


            console.log(
                'Leave status updated successfully:',
                response.data
            );


            // -------------------------------------------------
            // UPDATE UI IMMEDIATELY
            // -------------------------------------------------

            setLeaves((previousLeaves) =>
                previousLeaves.map((leave) =>
                    leave.id === selectedLeave.id
                        ? {
                            ...leave,
                            status: status.toUpperCase()
                        }
                        : leave
                )
            );


            // Close modal
            setSelectedLeave(null);


        } catch (error) {

            console.error(
                'Leave action failed:',
                error
            );

        } finally {

            setActionLoading(false);

        }
    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (
            <div className="managerLeaveOuter">

                <div className="leaveLoading">

                    <div className="loadingSpinner"></div>

                    <p>
                        Loading leave requests...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="managerLeaveOuter">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="leavePageHeader">

                <div>

                    <p className="pageEyebrow">
                        MANAGER PANEL
                    </p>

                    <h1>
                        Leave Requests
                    </h1>

                    <p className="pageDescription">
                        Review and manage leave requests from your employees.
                    </p>

                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="leaveStats">


                {/* TOTAL */}

                <div className="statCard">

                    <div className="statIcon totalIcon">
                        📋
                    </div>

                    <div>

                        <span>
                            Total Requests
                        </span>

                        <strong>
                            {totalLeaves}
                        </strong>

                    </div>

                </div>


                {/* PENDING */}

                <div className="statCard">

                    <div className="statIcon pendingIcon">
                        ⏳
                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingLeaves}
                        </strong>

                    </div>

                </div>


                {/* APPROVED */}

                <div className="statCard">

                    <div className="statIcon approvedIcon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Approved
                        </span>

                        <strong>
                            {approvedLeaves}
                        </strong>

                    </div>

                </div>


                {/* REJECTED */}

                <div className="statCard">

                    <div className="statIcon rejectedIcon">
                        ✕
                    </div>

                    <div>

                        <span>
                            Rejected
                        </span>

                        <strong>
                            {rejectedLeaves}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <div className="leaveToolbar">


                {/* SEARCH */}

                <div className="searchBox">

                    <span>
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* STATUS FILTER */}

                <div className="statusFilters">

                    {[
                        'ALL',
                        'PENDING',
                        'APROVED',
                        'REJECTED'
                    ].map((status) => (

                        <button
                            key={status}
                            className={
                                statusFilter === status
                                    ? 'filterBtn active'
                                    : 'filterBtn'
                            }
                            onClick={() =>
                                setStatusFilter(status)
                            }
                        >

                            {status === 'ALL'
                                ? 'All'
                                : status.charAt(0) +
                                status.slice(1).toLowerCase()}

                        </button>

                    ))}

                </div>

            </div>


            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="leaveTableContainer">

                {filteredLeaves.length === 0 ? (

                    <div className="emptyState">

                        <div className="emptyIcon">
                            📭
                        </div>

                        <h3>
                            No leave requests found
                        </h3>

                        <p>
                            There are no requests matching your current filters.
                        </p>

                    </div>

                ) : (

                    <table className="leaveTable">

                        <thead>

                            <tr>

                                <th>
                                    EMPLOYEE
                                </th>

                                <th>
                                    FROM
                                </th>

                                <th>
                                    TO
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th className="actionHeader">
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredLeaves.map((leave) => (

                                <tr key={leave.id}>


                                    {/* EMPLOYEE */}

                                    <td>

                                        <div className="employeeInfo">

                                            <div className="employeeAvatar">

                                                {leave.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>

                                            <div>

                                                <strong>
                                                    {leave.name}
                                                </strong>

                                                <small>
                                                    Leave #{leave.id}
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    {/* FROM */}

                                    <td>

                                        <span className="dateText">
                                            {formatDate(leave.from)}
                                        </span>

                                    </td>


                                    {/* TO */}

                                    <td>

                                        <span className="dateText">
                                            {formatDate(leave.to)}
                                        </span>

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`statusBadge ${leave.status?.toLowerCase()}`}
                                        >

                                            <span className="statusDot"></span>

                                            {leave.status}

                                        </span>

                                    </td>


                                    {/* ACTION */}

                                    <td>

                                        <button
                                            className="actionButton"
                                            onClick={() =>
                                                openLeaveAction(leave)
                                            }
                                            aria-label="Open leave actions"
                                        >
                                            ⋮
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="mobileLeaveList">

                {filteredLeaves.map((leave) => (

                    <div
                        className="leaveMobileCard"
                        key={leave.id}
                    >


                        {/* TOP */}

                        <div className="mobileCardTop">

                            <div className="employeeInfo">

                                <div className="employeeAvatar">

                                    {leave.name
                                        ?.charAt(0)
                                        .toUpperCase()}

                                </div>

                                <div>

                                    <strong>
                                        {leave.name}
                                    </strong>

                                    <small>
                                        Leave #{leave.id}
                                    </small>

                                </div>

                            </div>




                            <button
                                className="actionButton"
                                onClick={() =>
                                    openLeaveAction(leave)
                                }
                                aria-label="Open leave actions"
                            >
                                ⋮
                            </button>

                        </div>


                        {/* DATES */}

                        <div className="mobileDates">

                            <div>

                                <span>
                                    FROM
                                </span>

                                <strong>
                                    {formatDate(leave.from)}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    TO
                                </span>

                                <strong>
                                    {formatDate(leave.to)}
                                </strong>

                            </div>

                        </div>


                        {/* STATUS */}

                        <div className="mobileStatus">

                            <span
                                className={`statusBadge ${leave.status?.toLowerCase()}`}
                            >

                                <span className="statusDot"></span>

                                {leave.status}

                            </span>

                        </div>

                    </div>

                ))}

            </div>


            {/* =================================================
                ACTION MODAL
            ================================================= */}

            {selectedLeave &&
                (

                    <div
                        className="leaveModalOverlay"
                        onClick={() => {

                            if (!actionLoading) {
                                setSelectedLeave(null);
                            }

                        }}
                    >


                        <div
                            className="leaveModal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* MODAL HEADER */}

                            <div className="modalHeader">

                                <div>

                                    <p>
                                        LEAVE REQUEST
                                    </p>

                                    <h2>
                                        Review Request
                                    </h2>

                                </div>


                                <button
                                    className="modalClose"
                                    disabled={actionLoading}
                                    onClick={() =>
                                        setSelectedLeave(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* EMPLOYEE */}

                            <div className="modalEmployee">

                                <div className="modalAvatar">

                                    {selectedLeave.name
                                        ?.charAt(0)
                                        .toUpperCase()}

                                </div>

                                <div>

                                    <span>
                                        Employee
                                    </span>

                                    <strong>
                                        {selectedLeave.name}
                                    </strong>

                                </div>

                            </div>


                            {/* LEAVE DETAILS */}

                            <div className="leaveDetails">


                                <div className="detailItem">

                                    <span>
                                        From
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedLeave.from
                                        )}
                                    </strong>

                                </div>


                                <div className="detailItem">

                                    <span>
                                        To
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedLeave.to
                                        )}
                                    </strong>

                                </div>


                                <div className="detailItem">

                                    <span>
                                        Current Status
                                    </span>

                                    <span className="statusBadge pending">

                                        <span className="statusDot"></span>

                                        PENDING

                                    </span>

                                </div>

                            </div>


                            {/* ACTION */}

                            <div className="modalActionSection">

                                {selectedLeave.status === 'PENDING' ? (

                                    <>
                                        <p>
                                            What would you like to do with this request?
                                        </p>

                                        <div className="modalActions">

                                            <button
                                                className="rejectButton"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleLeaveAction('REJECTED')
                                                }
                                            >
                                                <span>✕</span>

                                                Reject
                                            </button>


                                            <button
                                                className="approveButton"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleLeaveAction('APROVED')
                                                }
                                            >
                                                <span>✓</span>

                                                {actionLoading
                                                    ? 'Updating...'
                                                    : 'Accept'}
                                            </button>

                                        </div>
                                    </>

                                ) : (

                                    <div className="leaveAlreadyProcessed">

                                        <div className="processedIcon">
                                            ⚠
                                        </div>

                                        <div className="processedMessage">

                                            {selectedLeave.status === 'APROVED' ? (

                                                <>
                                                    <strong>
                                                        Leave Status is Already Approved
                                                    </strong>

                                                    <p>
                                                        This leave request has already been approved.
                                                    </p>
                                                </>

                                            ) : (

                                                <>
                                                    <strong>
                                                        Leave Status is Already Rejected
                                                    </strong>

                                                    <p>
                                                        This leave request has already been rejected.
                                                    </p>
                                                </>

                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
};

export default ManagerLeave;
