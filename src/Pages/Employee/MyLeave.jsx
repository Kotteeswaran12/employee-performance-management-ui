import './MyLeave.css';

import { useEffect, useState } from 'react';

import {
  getAllLeaves,
  applyLeave
} from '../../Api/EmployeeAccess';


const MyLeave = () => {

  const token = localStorage.getItem('token');

  const [leaves, setLeaves] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    reason: '',
    startingDate: '',
    endingDate: ''
  });


  // --------------------------------------------------
  // Fetch All Leaves
  // --------------------------------------------------

  const fetchLeaves = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await getAllLeaves(
        token,
        0,
        10
      );

      const data = response?.data?.content || [];

      setLeaves(data);

    } catch (error) {

      console.error('Error fetching leaves:', error);

      setError(
        error?.response?.data?.message ||
        'Unable to load your leave details.'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchLeaves();

  }, []);


  // --------------------------------------------------
  // Form Change
  // --------------------------------------------------

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };


  // --------------------------------------------------
  // Close Modal
  // --------------------------------------------------

  const closeModal = () => {

    if (submitting) {
      return;
    }

    setShowModal(false);

    setFormData({
      reason: '',
      startingDate: '',
      endingDate: ''
    });

  };


  // --------------------------------------------------
  // Submit Leave
  // --------------------------------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    if (!formData.reason.trim()) {

      setError('Please enter a reason for your leave.');

      return;
    }

    if (!formData.startingDate) {

      setError('Please select the starting date.');

      return;
    }

    if (!formData.endingDate) {

      setError('Please select the ending date.');

      return;
    }

    if (
      formData.endingDate <
      formData.startingDate
    ) {

      setError(
        'Ending date cannot be before starting date.'
      );

      return;
    }


    try {

      setSubmitting(true);

      const payload = {
        reason: formData.reason.trim(),
        startingDate: formData.startingDate,
        endingDate: formData.endingDate
      };


      await applyLeave(
        token,
        payload
      );


      closeModal();

      await fetchLeaves();

    } catch (error) {

      console.error('Error applying leave:', error);

      setError(
        error?.response?.data?.message ||
        'Unable to apply for leave.'
      );

    } finally {

      setSubmitting(false);

    }

  };


  // --------------------------------------------------
  // Date Formatting
  // --------------------------------------------------

  const formatDate = (date) => {

    if (!date) {
      return '--';
    }

    const formattedDate =
      new Date(`${date}T00:00:00`);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return date;
    }

    return formattedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  };


  // --------------------------------------------------
  // Status Label
  // --------------------------------------------------

  const getStatusLabel = (status) => {

    if (!status) {
      return 'UNKNOWN';
    }

    return status
      .trim()
      .toUpperCase();

  };


  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const pendingCount = leaves.filter(
    leave =>
      getStatusLabel(leave.status) ===
      'PENDING'
  ).length;


  const approvedCount = leaves.filter(
    leave =>
      getStatusLabel(leave.status) ===
      'APROVED'
  ).length;


  const rejectedCount = leaves.filter(
    leave =>
      getStatusLabel(leave.status) ===
      'REJECTED'
  ).length;


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (

    <div className="myLeaveOuter">


      {/* -----------------------------------------
          HEADER
      ----------------------------------------- */}

      <div className="myLeaveHeader">

        <div>

          <span className="myLeaveEyebrow">
            EMPLOYEE PORTAL
          </span>

          <h1>
            My Leave
          </h1>

          <p>
            Manage your leave applications and
            track their status.
          </p>

        </div>


        <button
          className="applyLeaveButton"
          onClick={() => {
            setError('');
            setShowModal(true);
          }}
        >

          <span>+</span>

          Apply Leave

        </button>

      </div>


      {/* -----------------------------------------
          ERROR
      ----------------------------------------- */}

      {error && !showModal && (

        <div className="leaveError">

          <span>!</span>

          {error}

        </div>

      )}


      {/* -----------------------------------------
          STATISTICS
      ----------------------------------------- */}

      <div className="leaveStats">


        <div className="leaveStatCard">

          <div className="leaveStatIcon totalLeaveIcon">
            ≡
          </div>

          <div>

            <span>
              Total Applications
            </span>

            <strong>
              {leaves.length}
            </strong>

          </div>

        </div>


        <div className="leaveStatCard">

          <div className="leaveStatIcon pendingLeaveIcon">
            ◷
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>


        <div className="leaveStatCard">

          <div className="leaveStatIcon approvedLeaveIcon">
            ✓
          </div>

          <div>

            <span>
              Approved
            </span>

            <strong>
              {approvedCount}
            </strong>

          </div>

        </div>


        <div className="leaveStatCard">

          <div className="leaveStatIcon rejectedLeaveIcon">
            ×
          </div>

          <div>

            <span>
              Rejected
            </span>

            <strong>
              {rejectedCount}
            </strong>

          </div>

        </div>

      </div>


      {/* -----------------------------------------
          LEAVE HISTORY
      ----------------------------------------- */}

      <div className="leaveContainer">


        <div className="leaveContainerHeader">

          <div>

            <span className="sectionLabel">
              LEAVE HISTORY
            </span>

            <h2>
              Your Leave Applications
            </h2>

            <p>
              View all the leaves you have applied for.
            </p>

          </div>


          <div className="leaveCount">
            {leaves.length} Applications
          </div>

        </div>


        {/* -----------------------------------------
            LOADING
        ----------------------------------------- */}

        {loading ? (

          <div className="leaveLoading">

            <div className="leaveSpinner"></div>

            <span>
              Loading leave history...
            </span>

          </div>

        ) : leaves.length === 0 ? (

          /* -----------------------------------------
             EMPTY
          ----------------------------------------- */

          <div className="leaveEmpty">

            <div className="leaveEmptyIcon">
              ◷
            </div>

            <h3>
              No leave applications
            </h3>

            <p>
              You haven't applied for any leave yet.
            </p>

            <button
              onClick={() => {
                setError('');
                setShowModal(true);
              }}
            >
              + Apply Leave
            </button>

          </div>

        ) : (

          <>

            {/* -----------------------------------------
                DESKTOP TABLE
            ----------------------------------------- */}

            <div className="leaveTableWrapper">

              <table className="leaveTable">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      REASON
                    </th>

                    <th>
                      STARTING DATE
                    </th>

                    <th>
                      ENDING DATE
                    </th>

                    <th>
                      MANAGER
                    </th>

                    <th>
                      STATUS
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {leaves.map((leave) => {

                    const status =
                      getStatusLabel(
                        leave.status
                      );

                    return (

                      <tr
                        key={leave.id}
                      >

                        <td>

                          <span className="leaveId">
                            #{leave.id}
                          </span>

                        </td>


                        <td>

                          <div className="leaveReason">
                            {leave.reason || '--'}
                          </div>

                        </td>


                        <td>
                          {formatDate(
                            leave.startingDate
                          )}
                        </td>


                        <td>
                          {formatDate(
                            leave.endingDate
                          )}
                        </td>


                        <td>

                          <strong className="managerName">
                            {leave.managerName || '--'}
                          </strong>

                        </td>


                        <td>

                          <span
                            className={`leaveStatus status-${status.toLowerCase()}`}
                          >

                            <span></span>

                            {status}

                          </span>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>


            {/* -----------------------------------------
                MOBILE CARDS
            ----------------------------------------- */}

            <div className="leaveMobileList">

              {leaves.map((leave) => {

                const status =
                  getStatusLabel(
                    leave.status
                  );

                return (

                  <div
                    className="leaveMobileCard"
                    key={leave.id}
                  >


                    <div className="leaveMobileTop">

                      <div>

                        <span className="mobileLeaveId">
                          #{leave.id}
                        </span>

                        <h3>
                          {leave.reason || '--'}
                        </h3>

                      </div>


                      <span
                        className={`leaveStatus status-${status.toLowerCase()}`}
                      >

                        <span></span>

                        {status}

                      </span>

                    </div>


                    <div className="leaveMobileDetails">


                      <div>

                        <span>
                          STARTING DATE
                        </span>

                        <strong>
                          {formatDate(
                            leave.startingDate
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          ENDING DATE
                        </span>

                        <strong>
                          {formatDate(
                            leave.endingDate
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          MANAGER
                        </span>

                        <strong>
                          {leave.managerName || '--'}
                        </strong>

                      </div>


                    </div>

                  </div>

                );

              })}

            </div>

          </>

        )}

      </div>


      {/* -----------------------------------------
          APPLY LEAVE MODAL
      ----------------------------------------- */}

      {showModal && (

        <div
          className="leaveModalOverlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {

              closeModal();

            }

          }}
        >

          <div className="leaveModal">


            {/* Modal Header */}

            <div className="leaveModalHeader">

              <div>

                <span>
                  LEAVE REQUEST
                </span>

                <h2>
                  Apply for Leave
                </h2>

                <p>
                  Submit your leave request for
                  manager approval.
                </p>

              </div>


              <button
                className="closeLeaveModal"
                onClick={closeModal}
                disabled={submitting}
              >
                ×
              </button>

            </div>


            {/* Modal Error */}

            {error && (

              <div className="modalLeaveError">

                <span>!</span>

                {error}

              </div>

            )}


            {/* Form */}

            <form
              className="leaveForm"
              onSubmit={handleSubmit}
            >


              {/* Reason */}

              <div className="leaveInputGroup">

                <label>
                  Reason *
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Enter the reason for your leave..."
                  rows="4"
                  disabled={submitting}
                />

              </div>


              {/* Dates */}

              <div className="leaveDateGrid">


                <div className="leaveInputGroup">

                  <label>
                    Starting Date *
                  </label>

                  <input
                    type="date"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>


                <div className="leaveInputGroup">

                  <label>
                    Ending Date *
                  </label>

                  <input
                    type="date"
                    name="endingDate"
                    value={formData.endingDate}
                    min={formData.startingDate || undefined}
                    onChange={handleChange}
                    disabled={submitting}
                  />

                </div>

              </div>


              {/* Footer */}

              <div className="leaveModalFooter">

                <button
                  type="button"
                  className="leaveCancelButton"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="leaveSubmitButton"
                  disabled={submitting}
                >

                  {submitting
                    ? 'Submitting...'
                    : 'Submit Leave'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};


export default MyLeave;