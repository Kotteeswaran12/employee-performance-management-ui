import './Task.css';

import {
    CreateTask,
    Assigntask,
    GetAllTaskAssigned,
    GetAllEmployees
} from '../../Api/ManagerAccess';

import { useEffect, useMemo, useState } from 'react';


const Task = () => {

    const token = localStorage.getItem('token');


    // =========================================================
    // TASK DATA
    // =========================================================

    const [existingTask, setExistingTask] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================================================
    // EMPLOYEE DATA
    // =========================================================

    const [employees, setEmployees] = useState([]);


    // =========================================================
    // SEARCH / FILTER
    // =========================================================

    const [search, setSearch] = useState('');

    const [statusFilter, setStatusFilter] = useState('ALL');


    // =========================================================
    // MODAL
    // =========================================================

    const [showModal, setShowModal] = useState(false);

    const [step, setStep] = useState(1);


    // =========================================================
    // FORM DATA
    // =========================================================

    const initialTaskForm = {
        title: '',
        description: '',
        estimatedHours: ''
    };


    const initialAssignForm = {
        employeeCode: '',
        dueDate: ''
    };


    const [taskForm, setTaskForm] = useState(
        initialTaskForm
    );

    const [assignForm, setAssignForm] = useState(
        initialAssignForm
    );


    // =========================================================
    // VALIDATION
    // =========================================================

    const [errors, setErrors] = useState({});


    // =========================================================
    // MESSAGE
    // =========================================================

    const [message, setMessage] = useState({
        type: '',
        text: ''
    });


    // =========================================================
    // SUBMITTING
    // =========================================================

    // eslint-disable-next-line no-unused-vars
    const [submitting, setSubmitting] = useState(false);


    // =========================================================
    // PAGINATION
    // =========================================================

    const [currentPage, setCurrentPage] = useState(1);

    const tasksPerPage = 8;

    // =========================================================
    // MESSAGE
    // =========================================================

    const showMessage = (type, text) => {

        setMessage({
            type,
            text
        });


        setTimeout(() => {

            setMessage({
                type: '',
                text: ''
            });

        }, 4000);

    };



    // =========================================================
    // FETCH TASKS
    // =========================================================

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const response = await GetAllTaskAssigned(
                token,
                0,
                10
            );

            const content =
                response?.data?.content || [];


            const formattedTasks = content.map((d) => ({

                id: d.assignmentId,

                Name: d.assignedTo,

                employeeCode:
                    d.employeeCode || '',

                Task: d.task,

                Created: d.assignedDate,

                DueDate: d.dueDate,

                completedDate:
                    d.completedDate,

                status: d.status

            }));


            setExistingTask(formattedTasks);


            


        } catch (error) {

            console.error(
                'Failed to fetch tasks:',
                error
            );

            showMessage(
                'error',
                'Unable to load assigned tasks.'
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // FETCH EMPLOYEES
    // =========================================================

    const fetchEmployees = async () => {

        try {

            const response =
                await GetAllEmployees(token);


            const employeeData =
                response?.data?.content ||
                response?.data ||
                [];


            setEmployees(employeeData);


           


        } catch (error) {

            console.error(
                'Failed to fetch employees:',
                error
            );

            showMessage(
                'error',
                'Unable to load employees.'
            );

        }

    };


    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTasks();

        fetchEmployees();

    }, []);



    // =========================================================
    // TASK FORM CHANGE
    // =========================================================

    const handleTaskChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setTaskForm(prev => ({
            ...prev,
            [name]: value
        }));


        if (errors[name]) {

            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));

        }

    };


    // =========================================================
    // ASSIGN FORM CHANGE
    // =========================================================

    const handleAssignChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setAssignForm(prev => ({
            ...prev,
            [name]: value
        }));


        if (errors[name]) {

            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));

        }

    };


    // =========================================================
    // VALIDATE STEP 1
    // =========================================================

    const validateTaskForm = () => {

        const newErrors = {};


        if (!taskForm.title.trim()) {

            newErrors.title =
                'Task title is required';

        }


        if (!taskForm.description.trim()) {

            newErrors.description =
                'Task description is required';

        }


        if (!taskForm.estimatedHours.trim()) {

            newErrors.estimatedHours =
                'Estimated hours is required';

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;

    };


    // =========================================================
    // VALIDATE STEP 2
    // =========================================================

    const validateAssignForm = () => {

        const newErrors = {};


        if (!assignForm.employeeCode) {

            newErrors.employeeCode =
                'Please select an employee';

        }


        if (!assignForm.dueDate) {

            newErrors.dueDate =
                'Due date is required';

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;

    };


    // =========================================================
    // OPEN MODAL
    // =========================================================

    const openAddTask = () => {

        setTaskForm(initialTaskForm);

        setAssignForm(initialAssignForm);

        setErrors({});

        setStep(1);

        setShowModal(true);

    };


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {

        if (submitting) {
            return;
        }


        setShowModal(false);

        setStep(1);

        setTaskForm(initialTaskForm);

        setAssignForm(initialAssignForm);

        setErrors({});

    };


    // =========================================================
    // STEP 1 → STEP 2
    // =========================================================

    const goToAssignStep = (e) => {

        e.preventDefault();


        if (!validateTaskForm()) {
            return;
        }


        setErrors({});

        setStep(2);

    };


    // =========================================================
    // FINAL CREATE + ASSIGN
    // =========================================================

    const handleCreateAndAssign = async (e) => {

        e.preventDefault();


        if (!validateAssignForm()) {
            return;
        }



        const createPayload = {

            title: taskForm.title.trim(),

            description:
                taskForm.description.trim(),

            estimatedHours:
                taskForm.estimatedHours.trim()

        };


       


      


        

        const createResponse =
            await CreateTask(token, createPayload);


        const taskId = createResponse.data.id;

        await Assigntask(token, assignForm.dueDate, assignForm.employeeCode, taskId)


        showMessage(
            'success',
            'Task and assignment details are ready. Check the console.'
        );


        setShowModal(false)
        fetchTasks();

    };


    // =========================================================
    // FILTER TASKS
    // =========================================================

    const filteredTasks = useMemo(() => {

        return existingTask.filter(task => {

            const searchValue =
                search.toLowerCase().trim();


            const matchesSearch =

                (task.Name || '')
                    .toLowerCase()
                    .includes(searchValue)

                ||

                (task.Task || '')
                    .toLowerCase()
                    .includes(searchValue)

                ||

                (task.employeeCode || '')
                    .toLowerCase()
                    .includes(searchValue);


            const matchesStatus =

                statusFilter === 'ALL' ||

                task.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        existingTask,
        search,
        statusFilter
    ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.ceil(
        filteredTasks.length /
        tasksPerPage
    );


    const startIndex =
        (currentPage - 1) *
        tasksPerPage;


    const currentTasks =
        filteredTasks.slice(
            startIndex,
            startIndex + tasksPerPage
        );


    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        statusFilter
    ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalTasks =
        existingTask.length;


    const pendingTasks =
        existingTask.filter(
            task =>
                task.status === 'PENDING'
        ).length;


    const inProgressTasks =
        existingTask.filter(
            task =>
                task.status === 'IN_PROGRESS'
        ).length;


    const completedTasks =
        existingTask.filter(
            task =>
                task.status === 'COMPLETED'
        ).length;


    // =========================================================
    // GET EMPLOYEE DISPLAY NAME
    // =========================================================

    const getEmployeeName = (employee) => {

        const firstName =
            employee.firstName ||
            employee.firstname ||
            '';

        const lastName =
            employee.lastName ||
            employee.lastname ||
            '';

        const code =
            employee.empCode ||
            employee.empcode ||
            employee.employeeCode ||
            '';


        const fullName =
            `${firstName} ${lastName}`.trim();


        if (fullName && code) {

            return `${fullName} - ${code}`;

        }


        return code || fullName || 'Employee';

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="TaskOuter">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="taskHeader">

                <div>

                    <span className="taskPageLabel">
                        TASK MANAGEMENT
                    </span>

                    <h1>
                        Tasks
                    </h1>

                    <p>
                        Create and assign tasks to employees
                        in your department.
                    </p>

                </div>


                <button
                    className="addTaskBtn"
                    onClick={openAddTask}
                >

                    <span>
                        +
                    </span>

                    Add Task

                </button>

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            {message.text && (

                <div
                    className={`taskAlert ${message.type}`}
                >

                    <span>
                        {message.type === 'success'
                            ? '✓'
                            : '⚠'}
                    </span>


                    <span>
                        {message.text}
                    </span>


                    <button
                        onClick={() =>
                            setMessage({
                                type: '',
                                text: ''
                            })
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="taskStats">


                <div className="taskStatCard">

                    <div className="taskStatIcon">
                        📋
                    </div>

                    <div>

                        <span>
                            Total Tasks
                        </span>

                        <strong>
                            {totalTasks}
                        </strong>

                    </div>

                </div>


                <div className="taskStatCard">

                    <div className="taskStatIcon">
                        🕐
                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingTasks}
                        </strong>

                    </div>

                </div>


                <div className="taskStatCard">

                    <div className="taskStatIcon">
                        ⚙
                    </div>

                    <div>

                        <span>
                            In Progress
                        </span>

                        <strong>
                            {inProgressTasks}
                        </strong>

                    </div>

                </div>


                <div className="taskStatCard">

                    <div className="taskStatIcon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedTasks}
                        </strong>

                    </div>

                </div>


            </div>


            {/* =================================================
                TASK TABLE CONTAINER
            ================================================= */}

            <div className="taskContainer">


                {/* Toolbar */}

                <div className="taskToolbar">


                    <div className="taskSearch">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search tasks or employees..."
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="taskFilter"
                        value={statusFilter}
                        onChange={e =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="IN_PROGRESS">
                            In Progress
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                    </select>


                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="taskTableWrapper">


                    {loading ? (

                        <div className="taskLoading">

                            <div className="taskSpinner"></div>

                            <p>
                                Loading tasks...
                            </p>

                        </div>

                    ) : currentTasks.length === 0 ? (

                        <div className="taskEmpty">

                            <div className="taskEmptyIcon">
                                📋
                            </div>

                            <h3>
                                No tasks found
                            </h3>

                            <p>
                                Create your first task
                                and assign it to an employee.
                            </p>

                            <button
                                onClick={openAddTask}
                                className="emptyTaskBtn"
                            >
                                + Add Task
                            </button>

                        </div>

                    ) : (

                        <table className="taskTable">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Task
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Due Date
                                    </th>

                                    <th>
                                        Completed
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentTasks.map(
                                    (task) => (

                                        <tr
                                            key={task.id}
                                        >


                                            <td>
                                                <span className="taskId">
                                                    #{task.id}
                                                </span>
                                            </td>


                                            <td>

                                                <div className="assignedEmployee">

                                                    <div className="employeeAvatar">

                                                        {
                                                            (
                                                                task.Name ||
                                                                'E'
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()
                                                        }

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                task.Name ||
                                                                '-'
                                                            }
                                                        </strong>

                                                        {task.employeeCode && (

                                                            <small>
                                                                {
                                                                    task.employeeCode
                                                                }
                                                            </small>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="taskName">

                                                    {
                                                        task.Task ||
                                                        '-'
                                                    }

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    task.Created ||
                                                    '-'
                                                }
                                            </td>


                                            <td>
                                                {
                                                    task.DueDate ||
                                                    '-'
                                                }
                                            </td>


                                            <td>
                                                {
                                                    task.completedDate ||
                                                    '-'
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`taskStatus ${(
                                                        task.status ||
                                                        ''
                                                    )
                                                        .toLowerCase()
                                                        .replace(
                                                            '_',
                                                            '-'
                                                        )
                                                        }`}
                                                >

                                                    <span></span>

                                                    {
                                                        task.status ||
                                                        'UNKNOWN'
                                                    }

                                                </span>

                                            </td>


                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    )}

                </div>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {totalPages > 1 && (

                    <div className="taskPagination">

                        <span>

                            Showing{' '}

                            {startIndex + 1}

                            {' - '}

                            {Math.min(
                                startIndex +
                                tasksPerPage,
                                filteredTasks.length
                            )}

                            {' of '}

                            {filteredTasks.length}

                        </span>


                        <div>

                            <button
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            prev - 1
                                    )
                                }
                            >
                                ‹
                            </button>


                            {Array.from(
                                {
                                    length:
                                        totalPages
                                },
                                (_, index) => (

                                    <button
                                        key={index}
                                        className={
                                            currentPage ===
                                                index + 1
                                                ? 'activePage'
                                                : ''
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                index + 1
                                            )
                                        }
                                    >
                                        {index + 1}
                                    </button>

                                )
                            )}


                            <button
                                disabled={
                                    currentPage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            prev + 1
                                    )
                                }
                            >
                                ›
                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================================
                CREATE + ASSIGN MODAL
            ================================================= */}

            {showModal && (

                <div
                    className="taskModalOverlay"
                    onMouseDown={e => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeModal();

                        }

                    }}
                >

                    <div className="taskModal">


                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div className="taskModalHeader">

                            <div>

                                <span>
                                    TASK MANAGEMENT
                                </span>

                                <h2>
                                    {
                                        step === 1
                                            ? 'Create New Task'
                                            : 'Assign Task'
                                    }
                                </h2>

                                <p>

                                    {
                                        step === 1
                                            ? 'Enter the task details first.'
                                            : 'Choose the employee and due date.'
                                    }

                                </p>

                            </div>


                            <button
                                className="closeTaskModal"
                                onClick={closeModal}
                                disabled={submitting}
                            >
                                ×
                            </button>

                        </div>


                        {/* =================================================
                            STEP INDICATOR
                        ================================================= */}

                        <div className="taskSteps">

                            <div
                                className={
                                    `taskStep ${step >= 1
                                        ? 'active'
                                        : ''
                                    }`
                                }
                            >

                                <span>
                                    1
                                </span>

                                <div>

                                    <strong>
                                        Task Details
                                    </strong>

                                    <small>
                                        Create task
                                    </small>

                                </div>

                            </div>


                            <div className="stepLine"></div>


                            <div
                                className={
                                    `taskStep ${step >= 2
                                        ? 'active'
                                        : ''
                                    }`
                                }
                            >

                                <span>
                                    2
                                </span>

                                <div>

                                    <strong>
                                        Assignment
                                    </strong>

                                    <small>
                                        Assign employee
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            STEP 1
                        ================================================= */}

                        {step === 1 && (

                            <form
                                className="taskForm"
                                onSubmit={
                                    goToAssignStep
                                }
                            >

                                <div className="taskFormSection">

                                    <h3>
                                        Task Information
                                    </h3>


                                    {/* Title */}

                                    <div className="taskInputGroup">

                                        <label>
                                            Task Title *
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={
                                                taskForm.title
                                            }
                                            onChange={
                                                handleTaskChange
                                            }
                                            placeholder="e.g. Build Employee Dashboard"
                                        />

                                        {errors.title && (

                                            <small>
                                                {errors.title}
                                            </small>

                                        )}

                                    </div>


                                    {/* Description */}

                                    <div className="taskInputGroup">

                                        <label>
                                            Description *
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                taskForm.description
                                            }
                                            onChange={
                                                handleTaskChange
                                            }
                                            placeholder="Describe what needs to be completed..."
                                            rows="5"
                                        />

                                        {errors.description && (

                                            <small>
                                                {errors.description}
                                            </small>

                                        )}

                                    </div>


                                    {/* Estimated Hours */}

                                    <div className="taskInputGroup">

                                        <label>
                                            Estimated Hours *
                                        </label>

                                        <input
                                            type="text"
                                            name="estimatedHours"
                                            value={
                                                taskForm.estimatedHours
                                            }
                                            onChange={
                                                handleTaskChange
                                            }
                                            placeholder="e.g. 8"
                                        />

                                        {errors.estimatedHours && (

                                            <small>
                                                {
                                                    errors.estimatedHours
                                                }
                                            </small>

                                        )}

                                    </div>

                                </div>


                                <div className="taskModalFooter">

                                    <button
                                        type="button"
                                        className="taskCancelBtn"
                                        onClick={
                                            closeModal
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="taskNextBtn"
                                    >
                                        Continue
                                        <span>
                                            →
                                        </span>
                                    </button>

                                </div>

                            </form>

                        )}


                        {/* =================================================
                            STEP 2
                        ================================================= */}

                        {step === 2 && (

                            <form
                                className="taskForm"
                                onSubmit={
                                    handleCreateAndAssign
                                }
                            >

                                <div className="taskFormSection">


                                    {/* Preview */}

                                    <div className="taskPreview">

                                        <div className="previewIcon">
                                            📋
                                        </div>

                                        <div>

                                            <span>
                                                TASK
                                            </span>

                                            <strong>
                                                {
                                                    taskForm.title
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    taskForm.estimatedHours
                                                }{' '}
                                                estimated hours
                                            </small>

                                        </div>

                                    </div>


                                    <h3>
                                        Assignment Details
                                    </h3>


                                    {/* Employee */}

                                    <div className="taskInputGroup">

                                        <label>
                                            Employee *
                                        </label>

                                        <select
                                            name="employeeCode"
                                            value={
                                                assignForm.employeeCode
                                            }
                                            onChange={
                                                handleAssignChange
                                            }
                                        >

                                            <option value="">
                                                Select Employee
                                            </option>


                                            {employees.map(
                                                (employee) => {

                                                    const code =
                                                        employee.empCode ||
                                                        employee.empcode ||
                                                        employee.employeeCode;


                                                    return (

                                                        <option
                                                            key={code}
                                                            value={code}
                                                        >

                                                            {
                                                                getEmployeeName(
                                                                    employee
                                                                )
                                                            }

                                                        </option>

                                                    );

                                                }
                                            )}

                                        </select>


                                        {errors.employeeCode && (

                                            <small>
                                                {
                                                    errors.employeeCode
                                                }
                                            </small>

                                        )}

                                    </div>


                                    {/* Due Date */}

                                    <div className="taskInputGroup">

                                        <label>
                                            Due Date *
                                        </label>

                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={
                                                assignForm.dueDate
                                            }
                                            onChange={
                                                handleAssignChange
                                            }
                                        />


                                        {errors.dueDate && (

                                            <small>
                                                {
                                                    errors.dueDate
                                                }
                                            </small>

                                        )}

                                    </div>


                                    {/* Warning */}

                                    <div className="assignmentNotice">

                                        <span>
                                            ⚠
                                        </span>

                                        <p>

                                            The task will only be
                                            submitted after an employee
                                            and due date are selected.

                                        </p>

                                    </div>

                                </div>


                                <div className="taskModalFooter">


                                    <button
                                        type="button"
                                        className="taskBackBtn"
                                        onClick={() => {

                                            setErrors({});

                                            setStep(1);

                                        }}
                                        disabled={submitting}
                                    >
                                        ← Back
                                    </button>


                                    <button
                                        type="submit"
                                        className="taskCreateBtn"
                                        disabled={submitting}
                                    >

                                        {submitting
                                            ? 'Processing...'
                                            : 'Create & Assign'}

                                    </button>

                                </div>

                            </form>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

};

export default Task;