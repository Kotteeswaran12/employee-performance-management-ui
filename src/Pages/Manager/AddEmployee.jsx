import './AddEmp.css';
import { GetAllEmployees } from '../../Api/ManagerAccess';
import { useEffect, useMemo, useState } from 'react';
import { addEmployee } from '../../Api/ManagerAccess';

const AddEmployee = () => {

    // ==============================
    // Employee List
    // ==============================

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const [departmentFilter, setDepartmentFilter] = useState('ALL');

    const [showModal, setShowModal] = useState(false);

    const [message, setMessage] = useState({
        type: '',
        text: ''
    });

    // ==============================
    // Pagination
    // ==============================

    const [currentPage, setCurrentPage] = useState(1);

    const employeesPerPage = 8;

    // ==============================
    // Form
    // ==============================

    const initialForm = {
        empcode: '',
        firstname: '',
        lastname: '',
        gender: '',
        phone: '',
        dob: '',
        designation: '',
        role: 'EMPLOYEE',
        joiningDate: '',
        sal: '',
        address: ''
    };

    const [formData, setFormData] = useState(initialForm);

    const [errors, setErrors] = useState({});
    // ==============================
    // Message
    // ==============================
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


    // ==============================
    // Fetch Employees
    // ==============================

    const FetchApi = async () => {

        try {

            setLoading(true);

            const Token = localStorage.getItem('token');

            const response = await GetAllEmployees(Token);

            console.log('Employees:', response.data.content);

            setEmployees(response.data.content || []);

        } catch (error) {

            console.error(error);

            showMessage(
                'error',
                'Unable to load employees. Please try again.'
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        FetchApi();

    }, []);







    // ==============================
    // Form Change
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Remove error while typing
        if (errors[name]) {

            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));

        }
    };


    // ==============================
    // Validation
    // ==============================

    const validateForm = () => {

        const newErrors = {};

        if (!formData.empcode.trim()) {
            newErrors.empcode = 'Employee code is required';
        }

        if (!formData.firstname.trim()) {
            newErrors.firstname = 'First name is required';
        }

        if (!formData.lastname.trim()) {
            newErrors.lastname = 'Last name is required';
        }

        if (!formData.designation.trim()) {
            newErrors.designation = 'Designation is required';
        }

        if (!formData.dob) {
            newErrors.dob = 'Date of birth is required';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Enter a valid 10 digit phone number';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.sal) {
            newErrors.sal = 'Salary is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ==============================
    // Add Employee
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            const Token = localStorage.getItem('token');
            const playLoad = {
                empcode: formData.empcode,
                firstname: formData.firstname,
                lastname: formData.lastname,
                designation: formData.designation,
                dob: formData.dob,
                phone: Number(formData.phone),
                gender: formData.gender,
                address: formData.address,
                sal: Number(formData.sal)
            }

            const response = await addEmployee(Token, playLoad)

            console.log('Employee Data:', response.data);

            FetchApi();

            setFormData(initialForm);

            setErrors({});

            setShowModal(false);

            showMessage(
                'success',
                'Employee added successfully to your department.'
            );

        } catch (error) {

            console.error(error);

            showMessage(
                'error',
                'Failed to add employee. Please try again.'
            );
        }
    };


    // ==============================
    // Departments
    // ==============================

    const departments = useMemo(() => {

        const values = employees
            .map(emp => emp.department)
            .filter(Boolean);

        return [...new Set(values)];

    }, [employees]);


    // ==============================
    // Search + Filter
    // ==============================

    const filteredEmployees = useMemo(() => {

        return employees.filter(emp => {

            const fullName =
                `${emp.firstname || ''} ${emp.lastname || ''}`
                    .toLowerCase();

            const searchValue = search.toLowerCase();

            const matchesSearch =
                fullName.includes(searchValue) ||
                (emp.empcode || '')
                    .toLowerCase()
                    .includes(searchValue) ||
                (emp.email || '')
                    .toLowerCase()
                    .includes(searchValue) ||
                (emp.designation || '')
                    .toLowerCase()
                    .includes(searchValue);

            const matchesDepartment =
                departmentFilter === 'ALL' ||
                emp.departmentname === departmentFilter;

            return matchesSearch && matchesDepartment;

        });

    }, [employees, search, departmentFilter]);


    // ==============================
    // Pagination
    // ==============================

    const totalPages = Math.ceil(
        filteredEmployees.length / employeesPerPage
    );

    const startIndex =
        (currentPage - 1) * employeesPerPage;

    const currentEmployees =
        filteredEmployees.slice(
            startIndex,
            startIndex + employeesPerPage
        );


    // ==============================
    // Reset Page
    // ==============================

    useEffect(() => {

        setCurrentPage(1);

    }, [search, departmentFilter]);


    // ==============================
    // Modal
    // ==============================

    const openModal = () => {

        setFormData(initialForm);

        setErrors({});

        setShowModal(true);
    };


    const closeModal = () => {

        setShowModal(false);

        setErrors({});

    };


    return (

        <div className="AddEmpOuter">

            {/* =====================================
                TOP HEADER
            ====================================== */}

            <div className="employeeHeader">

                <div>

                    <span className="pageLabel">
                        EMPLOYEE MANAGEMENT
                    </span>

                    <h1>
                        Employees
                    </h1>

                    <p>
                        Manage employees in your department
                    </p>

                </div>

                <button
                    className="addEmployeeBtn"
                    onClick={openModal}
                >
                    <span>+</span>
                    Add Employee
                </button>

            </div>


            {/* =====================================
                MESSAGE
            ====================================== */}

            {message.text && (

                <div
                    className={`alertMessage ${message.type}`}
                >

                    <span>
                        {message.type === 'success'
                            ? '✓'
                            : '⚠'}
                    </span>

                    {message.text}

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


            {/* =====================================
                STATISTICS
            ====================================== */}

            <div className="employeeStats">

                <div className="statCard">

                    <div className="statIcon">
                        👥
                    </div>

                    <div>

                        <span>
                            Total Employees
                        </span>

                        <strong>
                            {employees.length}
                        </strong>

                    </div>

                </div>


                <div className="statCard">

                    <div className="statIcon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Active Employees
                        </span>

                        <strong>
                            {
                                employees.filter(
                                    emp =>
                                        emp.status === 'ACTIVE'
                                ).length
                            }
                        </strong>

                    </div>

                </div>





                <div className="statCard">

                    <div className="statIcon">
                        💼
                    </div>

                    <div>

                        <span>
                            Designations
                        </span>

                        <strong>
                            {
                                new Set(
                                    employees
                                        .map(
                                            emp =>
                                                emp.designation
                                        )
                                        .filter(Boolean)
                                ).size
                            }
                        </strong>

                    </div>

                </div>

            </div>


            {/* =====================================
                TABLE SECTION
            ====================================== */}

            <div className="employeeContainer">


                {/* Toolbar */}

                <div className="employeeToolbar">

                    <div className="searchBox">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={e =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (

                            <button
                                onClick={() =>
                                    setSearch('')
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>




                </div>


                {/* Table */}

                <div className="tableWrapper">

                    {loading ? (

                        <div className="loadingState">

                            <div className="spinner"></div>

                            <p>
                                Loading employees...
                            </p>

                        </div>

                    ) : currentEmployees.length === 0 ? (

                        <div className="emptyState">

                            <div className="emptyIcon">
                                👥
                            </div>

                            <h3>
                                No employees found
                            </h3>

                            <p>
                                {search ||
                                    departmentFilter !== 'ALL'
                                    ? 'Try changing your search or filter.'
                                    : 'Start by adding your first employee.'}
                            </p>

                            {!search &&
                                departmentFilter === 'ALL' && (

                                    <button
                                        onClick={openModal}
                                        className="emptyAddBtn"
                                    >
                                        + Add Employee
                                    </button>

                                )}

                        </div>

                    ) : (

                        <table className="employeeTable">

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>
                                    <th>
                                        Name
                                    </th>



                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Designation
                                    </th>

                                    <th>
                                        Role
                                    </th>



                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {currentEmployees.map(
                                    employee => (

                                        <tr key={
                                            employee.id ||
                                            employee.employeeCode
                                        }>

                                            <td>

                                                <div className="employeeInfo">

                                                    <div className="employeeAvatar">

                                                        {
                                                            (
                                                                employee.firstname
                                                                || 'E'
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()
                                                        }

                                                    </div>

                                                    <div>

                                                        <strong>

                                                            {
                                                                employee.firstName
                                                            }{' '}

                                                            {
                                                                employee.lastName
                                                            }

                                                        </strong>

                                                        <small>

                                                            {
                                                                employee.empcode
                                                                ||
                                                                employee.empCode
                                                                ||
                                                                '-'
                                                            }

                                                        </small>

                                                    </div>

                                                </div>

                                            </td>




                                            <td>
                                                {
                                                    employee.firstname
                                                }
                                            </td>
                                            <td>
                                                {
                                                    employee.departmentname
                                                    || '-'
                                                }
                                            </td>


                                            <td>
                                                {
                                                    employee.designation
                                                    || '-'
                                                }
                                            </td>


                                            <td>

                                                <span className="roleBadge">

                                                    {
                                                        employee.role
                                                        || 'EMPLOYEE'
                                                    }

                                                </span>

                                            </td>





                                            <td>

                                                <span
                                                    className={`statusBadge ${employee.status ===
                                                        'ACTIVE'
                                                        ? 'active'
                                                        : 'inactive'
                                                        }`}
                                                >

                                                    <span></span>

                                                    {
                                                        employee.status
                                                        || 'ACTIVE'
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <button
                                                    className="actionBtn"
                                                    title="View Employee"
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


                {/* =====================================
                    PAGINATION
                ====================================== */}

                {totalPages > 1 && (

                    <div className="pagination">

                        <span>

                            Showing{' '}

                            {startIndex + 1}–

                            {Math.min(
                                startIndex +
                                employeesPerPage,
                                filteredEmployees.length
                            )}{' '}

                            of{' '}

                            {filteredEmployees.length}

                        </span>


                        <div className="pageButtons">

                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage(
                                        prev => prev - 1
                                    )
                                }
                            >
                                ‹
                            </button>


                            {Array.from(
                                { length: totalPages },
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
                                        prev => prev + 1
                                    )
                                }
                            >
                                ›
                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* =====================================
                ADD EMPLOYEE MODAL
            ====================================== */}

            {showModal && (

                <div
                    className="modalOverlay"
                    onMouseDown={e => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="employeeModal">

                        {/* Modal Header */}

                        <div className="modalHeader">

                            <div>

                                <span>
                                    EMPLOYEE
                                </span>

                                <h2>
                                    Add New Employee
                                </h2>

                                <p>
                                    Add a new employee to your department
                                </p>

                            </div>

                            <button
                                className="closeModal"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        {/* Form */}


                        <form
                            onSubmit={handleSubmit}
                            className="employeeForm"
                        >

                            {/* =========================
                                PERSONAL INFORMATION
                            ========================== */}

                            <div className="formSection">

                                <h3>
                                    Personal Information
                                </h3>

                                <div className="formGrid">

                                    {/* Employee Code */}

                                    <div className="inputGroup">

                                        <label>
                                            Employee Code *
                                        </label>

                                        <input
                                            type="text"
                                            name="empcode"
                                            value={formData.empcode}
                                            onChange={handleChange}
                                            placeholder="EMP001"
                                        />

                                        {errors.empcode && (
                                            <small className="fieldError">
                                                {errors.empcode}
                                            </small>
                                        )}

                                    </div>


                                    {/* First Name */}

                                    <div className="inputGroup">

                                        <label>
                                            First Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            placeholder="Enter first name"
                                        />

                                        {errors.firstname && (
                                            <small className="fieldError">
                                                {errors.firstname}
                                            </small>
                                        )}

                                    </div>


                                    {/* Last Name */}

                                    <div className="inputGroup">

                                        <label>
                                            Last Name *
                                        </label>

                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                        />

                                        {errors.lastname && (
                                            <small className="fieldError">
                                                {errors.lastname}
                                            </small>
                                        )}

                                    </div>


                                    {/* Date of Birth */}

                                    <div className="inputGroup">

                                        <label>
                                            Date of Birth *
                                        </label>

                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />

                                        {errors.dob && (
                                            <small className="fieldError">
                                                {errors.dob}
                                            </small>
                                        )}

                                    </div>


                                    {/* Gender */}

                                    <div className="inputGroup">

                                        <label>
                                            Gender *
                                        </label>

                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Select Gender
                                            </option>

                                            <option value="MALE">
                                                Male
                                            </option>

                                            <option value="FEMALE">
                                                Female
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>

                                        </select>

                                        {errors.gender && (
                                            <small className="fieldError">
                                                {errors.gender}
                                            </small>
                                        )}

                                    </div>


                                    {/* Phone */}

                                    <div className="inputGroup">

                                        <label>
                                            Phone Number *
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength="10"
                                            placeholder="9876543210"
                                        />

                                        {errors.phone && (
                                            <small className="fieldError">
                                                {errors.phone}
                                            </small>
                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* =========================
                                    JOB INFORMATION
                                ========================== */}

                            <div className="formSection">

                                <h3>
                                    Job Information
                                </h3>

                                <div className="formGrid">

                                    {/* Designation */}

                                    <div className="inputGroup">

                                        <label>
                                            Designation *
                                        </label>

                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            placeholder="Software Developer"
                                        />

                                        {errors.designation && (
                                            <small className="fieldError">
                                                {errors.designation}
                                            </small>
                                        )}

                                    </div>


                                    {/* Salary */}

                                    <div className="inputGroup">

                                        <label>
                                            Salary *
                                        </label>

                                        <input
                                            type="number"
                                            name="sal"
                                            value={formData.sal}
                                            onChange={handleChange}
                                            placeholder="50000"
                                            min="0"
                                        />

                                        {errors.sal && (
                                            <small className="fieldError">
                                                {errors.sal}
                                            </small>
                                        )}

                                    </div>

                                </div>

                            </div>


                            {/* =========================
                                    ADDRESS
                                ========================== */}

                            <div className="formSection">

                                <h3>
                                    Address
                                </h3>

                                <div className="inputGroup">

                                    <label>
                                        Address *
                                    </label>

                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter employee address"
                                        rows="4"
                                    />

                                    {errors.address && (
                                        <small className="fieldError">
                                            {errors.address}
                                        </small>
                                    )}

                                </div>

                            </div>


                            {/* =========================
                                    FOOTER
                                ========================== */}

                            <div className="modalFooter">

                                <button
                                    type="button"
                                    className="cancelBtn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submitEmployeeBtn"
                                >
                                    ✓ Update Employee
                                </button>

                            </div>

                        </form>



                    </div>

                </div>

            )}

        </div>
    );
};

export default AddEmployee;

