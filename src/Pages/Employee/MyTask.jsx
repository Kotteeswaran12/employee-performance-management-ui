import './MyTask.css';

import { useEffect, useState } from 'react';

import {
  GetAlltheTaskDetails,
  StartTheTask,
  CompetedTheTask
} from '../../Api/EmployeeAccess';


const MyTask = () => {

  const [taskDetails, setTaskDetails] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState('');

  const token = localStorage.getItem('token');


  // --------------------------------------------------
  // Fetch Tasks
  // --------------------------------------------------

  const fetchTaskDetails = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await GetAlltheTaskDetails(
        token,
        0,
        10
      );

      const data = response?.data?.content || [];

      setTaskDetails(data);

    } catch (error) {

      console.error('Error fetching tasks:', error);

      setError(
        error?.response?.data?.message ||
        'Unable to load your tasks.'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchTaskDetails();

  }, []);


  // --------------------------------------------------
  // Format Date
  // --------------------------------------------------

  const formatDate = (date) => {

    if (!date) {
      return '--';
    }

    const formattedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };


  // --------------------------------------------------
  // Status Helper
  // --------------------------------------------------

  const getStatus = (status) => {

    if (!status) {
      return 'PENDING';
    }

    const currentStatus = String(status)
      .trim()
      .toUpperCase();

    // Backend typo -> Frontend standard status
    if (
      currentStatus === 'COMLITED' ||
      currentStatus === 'COMPLITED'
    ) {
      return 'COMPLETED';
    }

    return currentStatus;
  };


  const getStatusLabel = (status) => {
    return getStatus(status);
  };


  // --------------------------------------------------
  // Start Task
  // --------------------------------------------------

  const handleStartTask = async () => {

    if (!selectedTask) {
      return;
    }

    try {

      setActionLoading(true);
      setError('');

      await StartTheTask(
        token,
        selectedTask.assignmentId
      );

      setSelectedTask(null);

      await fetchTaskDetails();

    } catch (error) {

      console.error('Error starting task:', error);

      setError(
        error?.response?.data?.message ||
        'Unable to start the task.'
      );

    } finally {

      setActionLoading(false);

    }
  };


  // --------------------------------------------------
  // Complete Task
  // --------------------------------------------------

  const handleCompleteTask = async () => {

    if (!selectedTask) {
      return;
    }

    try {

      setActionLoading(true);
      setError('');

      await CompetedTheTask(
        token,
        selectedTask.assignmentId
      );

      setSelectedTask(null);

      await fetchTaskDetails();

    } catch (error) {

      console.error('Error completing task:', error);

      setError(
        error?.response?.data?.message ||
        'Unable to complete the task.'
      );

    } finally {

      setActionLoading(false);

    }
  };


  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const pendingCount = taskDetails.filter(
    task => getStatus(task.status) === 'PENDING'
  ).length;


  const processingCount = taskDetails.filter(
    task => getStatus(task.status) === 'PROCESSING'
  ).length;


  const completedCount = taskDetails.filter(
    task => getStatus(task.status) === 'COMPLETED'
  ).length;


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (

    <div className="myTaskOuter">


      {/* -----------------------------------------
          PAGE HEADER
      ----------------------------------------- */}

      <div className="myTaskHeader">

        <div>

          <span className="myTaskEyebrow">
            EMPLOYEE PORTAL
          </span>

          <h1>
            My Tasks
          </h1>

          <p>
            View and manage the tasks assigned to you.
          </p>

        </div>

      </div>


      {/* -----------------------------------------
          ERROR
      ----------------------------------------- */}

      {error && (

        <div className="myTaskError">

          <span>!</span>

          {error}

        </div>

      )}


      {/* -----------------------------------------
          STATISTICS
      ----------------------------------------- */}

      <div className="taskStats">


        <div className="taskStatCard">

          <div className="taskStatIcon allTasksIcon">
            ≡
          </div>

          <div>

            <span>
              Total Tasks
            </span>

            <strong>
              {taskDetails.length}
            </strong>

          </div>

        </div>


        <div className="taskStatCard">

          <div className="taskStatIcon pendingIcon">
            !
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


        <div className="taskStatCard">

          <div className="taskStatIcon processingIcon">
            ●
          </div>

          <div>

            <span>
              Processing
            </span>

            <strong>
              {processingCount}
            </strong>

          </div>

        </div>


        <div className="taskStatCard">

          <div className="taskStatIcon completedIcon">
            ✓
          </div>

          <div>

            <span>
              Completed
            </span>

            <strong>
              {completedCount}
            </strong>

          </div>

        </div>

      </div>


      {/* -----------------------------------------
          TASK SECTION
      ----------------------------------------- */}

      <div className="taskSection">


        <div className="taskSectionHeader">

          <div>

            <span className="sectionLabel">
              WORK ASSIGNMENTS
            </span>

            <h2>
              Your Tasks
            </h2>

            <p>
              Tasks assigned by your manager.
            </p>

          </div>

          <div className="taskCount">
            {taskDetails.length} Tasks
          </div>

        </div>


        {/* -----------------------------------------
            LOADING
        ----------------------------------------- */}

        {loading ? (

          <div className="taskLoading">

            <div className="taskSpinner"></div>

            <span>
              Loading your tasks...
            </span>

          </div>

        ) : taskDetails.length === 0 ? (

          /* -----------------------------------------
             EMPTY STATE
          ----------------------------------------- */

          <div className="taskEmpty">

            <div className="emptyIcon">
              ✓
            </div>

            <h3>
              No tasks assigned
            </h3>

            <p>
              You currently don't have any tasks assigned to you.
            </p>

          </div>

        ) : (

          /* -----------------------------------------
             TASK LIST
          ----------------------------------------- */

          <div className="taskList">

            {taskDetails.map((task) => {

              const status = getStatus(task.status);

              return (

                <div
                  className={`taskCard task-${status.toLowerCase()}`}
                  key={task.assignmentId}
                >


                  {/* Task Main Content */}

                  <div className="taskMain">


                    <div className="taskTitleRow">

                      <div className="taskNumber">

                        #{String(task.assignmentId).padStart(2, '0')}

                      </div>

                      <h3>
                        {task.task?.trim() || 'Untitled Task'}
                      </h3>

                    </div>


                    <div className="taskMeta">


                      <div className="taskMetaItem">

                        <span>
                          ASSIGNED BY
                        </span>

                        <strong>
                          {task.assignedBy || '--'}
                        </strong>

                      </div>


                      <div className="taskMetaItem">

                        <span>
                          ASSIGNED DATE
                        </span>

                        <strong>
                          {formatDate(task.assignedDate)}
                        </strong>

                      </div>


                      <div className="taskMetaItem">

                        <span>
                          DUE DATE
                        </span>

                        <strong>
                          {formatDate(task.dueDate)}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* Status */}

                  <div className="taskStatusContainer">

                    <span
                      className={`taskStatus status-${status.toLowerCase()}`}
                    >

                      <span className="taskStatusDot"></span>

                      {getStatusLabel(status)}

                    </span>

                  </div>


                  {/* Action */}

                  <button
                    className="taskActionButton"
                    onClick={() => setSelectedTask(task)}
                    aria-label="View task details"
                  >
                    ⋮
                  </button>

                </div>

              );

            })}

          </div>

        )}

      </div>


      {/* -----------------------------------------
          TASK DETAILS MODAL
      ----------------------------------------- */}

      {selectedTask && (

        <div
          className="taskModalOverlay"
          onClick={() => {
            if (!actionLoading) {
              setSelectedTask(null);
            }
          }}
        >

          <div
            className="taskModal"
            onClick={(event) => event.stopPropagation()}
          >


            {/* Modal Header */}

            <div className="taskModalHeader">

              <div>

                <span className="modalEyebrow">
                  TASK DETAILS
                </span>

                <h2>
                  {selectedTask.task?.trim() || 'Untitled Task'}
                </h2>

              </div>


              <button
                className="modalCloseButton"
                onClick={() => setSelectedTask(null)}
                disabled={actionLoading}
              >
                ×
              </button>

            </div>


            {/* Modal Status */}

            <div className="modalStatusRow">

              <span
                className={`taskStatus status-${getStatus(
                  selectedTask.status
                ).toLowerCase()}`}
              >

                <span className="taskStatusDot"></span>

                {getStatusLabel(selectedTask.status)}

              </span>

            </div>


            {/* Modal Details */}

            <div className="taskDetailGrid">


              <div className="taskDetailItem">

                <span>
                  ASSIGNMENT ID
                </span>

                <strong>
                  #{selectedTask.assignmentId}
                </strong>

              </div>


              <div className="taskDetailItem">

                <span>
                  ASSIGNED TO
                </span>

                <strong>
                  {selectedTask.assignedTo || '--'}
                </strong>

              </div>


              <div className="taskDetailItem">

                <span>
                  ASSIGNED BY
                </span>

                <strong>
                  {selectedTask.assignedBy || '--'}
                </strong>

              </div>


              <div className="taskDetailItem">

                <span>
                  ASSIGNED DATE
                </span>

                <strong>
                  {formatDate(selectedTask.assignedDate)}
                </strong>

              </div>


              <div className="taskDetailItem">

                <span>
                  DUE DATE
                </span>

                <strong>
                  {formatDate(selectedTask.dueDate)}
                </strong>

              </div>


              <div className="taskDetailItem">

                <span>
                  COMPLETED DATE
                </span>

                <strong>
                  {formatDate(selectedTask.completedDate)}
                </strong>

              </div>

            </div>


            {/* Modal Action */}

            <div className="taskModalAction">


              {getStatus(selectedTask.status) === 'PENDING' && (

                <button
                  className="modalActionButton processingButton"
                  onClick={handleStartTask}
                  disabled={actionLoading}
                >

                  {actionLoading
                    ? 'Starting...'
                    : 'PROCESSING'}

                </button>

              )}


              {getStatus(selectedTask.status) === 'PROCESSING' && (

                <button
                  className="modalActionButton completedButton"
                  onClick={handleCompleteTask}
                  disabled={actionLoading}
                >

                  {actionLoading
                    ? 'Completing...'
                    : 'COMPLETED'}

                </button>

              )}


              {getStatus(selectedTask.status) === 'COMPLETED' && (

                <div className="taskCompletedMessage">

                  <span>
                    ✓
                  </span>

                  Task Completed

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>

  );
};

export default MyTask;