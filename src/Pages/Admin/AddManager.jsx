import { useEffect, useState } from "react";
import "./AddManager.css";

import {
    getAlltheDepartments,
    addManager
} from "../../Api/AdminAccess";


const fields = [
    {
        name: "empcode",
        label: "Employee Code",
        type: "text",
        placeholder: "MAG001"
    },
    {
        name: "firstname",
        label: "First Name",
        type: "text",
        placeholder: "John"
    },
    {
        name: "lastname",
        label: "Last Name",
        type: "text",
        placeholder: "Doe"
    },
    {
        name: "designation",
        label: "Designation",
        type: "text",
        placeholder: "Software Engineer"
    },
    {
        name: "dob",
        label: "Date of Birth",
        type: "date"
    },
    {
        name: "phone",
        label: "Phone Number",
        type: "number",
        placeholder: "9876543210"
    },
    {
        name: "address",
        label: "Address",
        type: "textarea",
        placeholder: "Enter Address"
    },
    {
        name: "sal",
        label: "Salary",
        type: "number",
        placeholder: "50000"
    }
];


export default function AddManager() {

    const token = localStorage.getItem("token");

    const [departments, setDepartments] = useState([]);

    const [department, setDepartment] = useState("");

    const [loadingDepartments, setLoadingDepartments] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({
        empcode: "",
        firstname: "",
        lastname: "",
        designation: "",
        dob: "",
        phone: "",
        gender: "",
        address: "",
        sal: ""
    });


    // ---------------------------------------------
    // Handle Input
    // ---------------------------------------------

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    // ---------------------------------------------
    // Fetch Departments
    // ---------------------------------------------

    const fetchDepartments = async () => {

        try {

            setLoadingDepartments(true);

            const response =
                await getAlltheDepartments(
                    token,
                    0,
                    100
                );

            setDepartments(
                response?.data?.content || []
            );

        } catch (error) {

            console.error(
                "Error fetching departments:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to load departments."
            );

        } finally {

            setLoadingDepartments(false);

        }
    };


    useEffect(() => {

        fetchDepartments();

    }, []);


    // ---------------------------------------------
    // Submit
    // ---------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!department) {

            setError(
                "Please select a department."
            );

            return;
        }


        try {

            setSubmitting(true);


            const response =
                await addManager(
                    token,
                    formData,
                    department
                );


            console.log(response?.data);


            setSuccess(
                "Manager added successfully."
            );


            // Reset form

            setFormData({
                empcode: "",
                firstname: "",
                lastname: "",
                designation: "",
                dob: "",
                phone: "",
                gender: "",
                address: "",
                sal: ""
            });

            setDepartment("");


        } catch (error) {

            console.error(
                "Error adding manager:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to add manager. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="AddManagerOuter">

            <div className="employeeCard">


                {/* ---------------------------------
                    HEADER
                --------------------------------- */}

                <div className="managerHeader">

                    <div className="managerHeaderIcon">
                        +
                    </div>

                    <div>

                        <span className="managerEyebrow">
                            ADMINISTRATION
                        </span>

                        <h1>
                            Add Manager
                        </h1>

                        <p>
                            Create a manager profile and
                            assign them to a department.
                        </p>

                    </div>

                </div>


                {/* ---------------------------------
                    ALERTS
                --------------------------------- */}

                {error && (

                    <div className="managerAlert managerError">

                        <span>!</span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {success && (

                    <div className="managerAlert managerSuccess">

                        <span>✓</span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                <form onSubmit={handleSubmit}>


                    {/* ---------------------------------
                        PERSONAL / PROFESSIONAL DETAILS
                    --------------------------------- */}

                    <div className="formSection">

                        <div className="sectionHeading">

                            <div>
                                <span>
                                    PROFILE DETAILS
                                </span>

                                <h2>
                                    Manager Information
                                </h2>
                            </div>

                            <small>
                                Required information
                            </small>

                        </div>


                        <div className="grid">

                            {fields.map(field => (

                                <div
                                    className={`formGroup ${
                                        field.type === "textarea"
                                            ? "fullWidthField"
                                            : ""
                                    }`}
                                    key={field.name}
                                >

                                    <label>
                                        {field.label}
                                    </label>


                                    {field.type === "textarea" ? (

                                        <textarea
                                            name={field.name}
                                            value={
                                                formData[field.name]
                                            }
                                            onChange={handleChange}
                                            placeholder={
                                                field.placeholder
                                            }
                                            disabled={submitting}
                                        />

                                    ) : (

                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={
                                                formData[field.name]
                                            }
                                            onChange={handleChange}
                                            placeholder={
                                                field.placeholder
                                            }
                                            disabled={submitting}
                                        />

                                    )}

                                </div>

                            ))}


                            {/* Department */}

                            <div className="formGroup">

                                <label>
                                    Department
                                </label>

                                <select
                                    value={department}
                                    onChange={(e) => {
                                        setDepartment(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                    disabled={
                                        loadingDepartments ||
                                        submitting
                                    }
                                >

                                    <option value="">
                                        {loadingDepartments
                                            ? "Loading departments..."
                                            : "Select Department"
                                        }
                                    </option>


                                    {departments.map(dept => (

                                        <option
                                            key={dept.id}
                                            value={dept.id}
                                        >
                                            {dept.dept}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* Gender */}

                            <div className="formGroup genderGroup">

                                <label>
                                    Gender
                                </label>

                                <div className="genderBox">

                                    <label className="genderOption">

                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={
                                                formData.gender ===
                                                "Male"
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={submitting}
                                        />

                                        <span>
                                            Male
                                        </span>

                                    </label>


                                    <label className="genderOption">

                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={
                                                formData.gender ===
                                                "Female"
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={submitting}
                                        />

                                        <span>
                                            Female
                                        </span>

                                    </label>


                                    <label className="genderOption">

                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Other"
                                            checked={
                                                formData.gender ===
                                                "Other"
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={submitting}
                                        />

                                        <span>
                                            Other
                                        </span>

                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ---------------------------------
                        FOOTER
                    --------------------------------- */}

                    <div className="managerFormFooter">

                        <div className="requiredHint">

                            <span>*</span>

                            Please make sure all details
                            are correct before submitting.

                        </div>


                        <button
                            type="submit"
                            className="submitBtn"
                            disabled={submitting}
                        >

                            {submitting ? (

                                <>
                                    <span className="buttonSpinner"></span>
                                    Adding Manager...
                                </>

                            ) : (

                                <>
                                    <span className="buttonPlus">
                                        +
                                    </span>

                                    Add Manager
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}