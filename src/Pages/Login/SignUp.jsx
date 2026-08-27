import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SignUp.css";

import { SignIn } from "../../Api/AuthApi";


const SignUp = () => {

    const navigate = useNavigate();


    // =========================================
    // FORM DATA
    // =========================================

    const [formData, setFormData] = useState({
        empcode: "",
        email: "",
        password: ""
    });


    // =========================================
    // FIELD ERRORS
    // =========================================

    const [fieldErrors, setFieldErrors] = useState({
        empcode: "",
        email: "",
        password: ""
    });


    // =========================================
    // REQUEST STATES
    // idle | loading | success | error
    // =========================================

    const [status, setStatus] = useState("idle");

    const [message, setMessage] = useState("");


    // =========================================
    // PASSWORD VISIBILITY
    // =========================================

    const [showPassword, setShowPassword] =
        useState(false);


    // =========================================
    // INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));


        // Remove individual field error
        setFieldErrors((previous) => ({

            ...previous,

            [name]: ""

        }));


        // Remove global error message
        if (status === "error") {

            setStatus("idle");

            setMessage("");

        }

    };


    // =========================================
    // VALIDATION
    // =========================================

    const validateForm = () => {

        const errors = {

            empcode: "",
            email: "",
            password: ""

        };


        const empcode =
            formData.empcode.trim();


        const email =
            formData.email.trim();


        const password =
            formData.password;


        // Employee Code Validation

        if (!empcode) {

            errors.empcode =
                "Employee Code is required.";

        }


        else if (empcode.length < 2) {

            errors.empcode =
                "Please enter a valid Employee Code.";

        }


        // Email Validation

        if (!email) {

            errors.email =
                "Email address is required.";

        }


        else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                email
            )
        ) {

            errors.email =
                "Please enter a valid email address.";

        }


        // Password Validation

        if (!password) {

            errors.password =
                "Password is required.";

        }


        else if (password.length < 6) {

            errors.password =
                "Password must contain at least 6 characters.";

        }


        setFieldErrors(errors);


        return !Object.values(errors)
            .some((error) => error !== "");

    };


    // =========================================
    // HANDLE SIGN IN
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Prevent duplicate API requests

        if (status === "loading") {

            return;

        }


        // Validate all fields

        const isValid =
            validateForm();


        if (!isValid) {

            setStatus("error");

            setMessage(
                "Please correct the highlighted fields."
            );

            return;

        }


        try {

            // ===============================
            // LOADING
            // ===============================

            setStatus("loading");

            setMessage("");


            const empcode =
                formData.empcode.trim();


            const loginData = {

                password:
                    formData.password,
                email:
                    formData.email.trim()


            };


            // ===============================
            // API CALL
            // ===============================

            const response =
                await SignIn(
                    empcode,
                    loginData
                );


            console.log(
                "Login Response:",
               response
            );


            // const responseData =
            //     response?.data;
            const responseData = true;

            // ===============================
            // INVALID RESPONSE
            // ===============================

            if (!responseData) {

                throw new Error(
                    "Invalid response received from server."
                );

            }


            // ===============================
            // SAVE AUTHENTICATION DATA
            // ===============================

            if (responseData.token) {

                localStorage.setItem(
                    "token",
                    responseData.token
                );

            }


            // Role

            if (responseData.role) {

                localStorage.setItem(
                    "role",
                    responseData.role
                );

            }


            // Username

            if (responseData.username) {

                localStorage.setItem(
                    "username",
                    responseData.username
                );

            }


            // Employee Code

            localStorage.setItem(
                "empcode",
                empcode
            );


            // ===============================
            // SUCCESS
            // ===============================

            setStatus("success");

            setMessage(
                "Login successful! Redirecting..."
            );


            // Navigate after success

            // setTimeout(() => {

            //     navigate(
            //         "/dashboard"
            //     );

            // }, 1000);


        } catch (err) {

            console.error(
                "Sign In Error:",
                err
            );


            const responseStatus =
                err?.response?.status;


            // ===============================
            // 400 - BAD REQUEST
            // ===============================

            if (responseStatus === 400) {

                setMessage(

                    err?.response?.data?.message ||

                    "Invalid Employee Code, email, or password."

                );

            }


            // ===============================
            // 401 - UNAUTHORIZED
            // ===============================

            else if (responseStatus === 401) {

                setMessage(
                    "Invalid email or password."
                );

            }


            // ===============================
            // 403 - FORBIDDEN
            // ===============================

            else if (responseStatus === 403) {

                setMessage(
                    "You do not have permission to access this system."
                );

            }


            // ===============================
            // 404 - NOT FOUND
            // ===============================

            else if (responseStatus === 404) {

                setMessage(
                    "Employee Code or account was not found."
                );

            }


            // ===============================
            // 409 - CONFLICT
            // ===============================

            else if (responseStatus === 409) {

                setMessage(
                    "There is a problem with this account."
                );

            }


            // ===============================
            // SERVER ERROR
            // ===============================

            else if (responseStatus >= 500) {

                setMessage(
                    "Server error. Please try again later."
                );

            }


            // ===============================
            // NETWORK ERROR
            // ===============================

            else if (

                err?.code === "ERR_NETWORK" ||

                err?.message === "Network Error"

            ) {

                setMessage(
                    "Unable to connect to the server. Please check your internet connection."
                );

            }


            // ===============================
            // TIMEOUT
            // ===============================

            else if (

                err?.code === "ECONNABORTED"

            ) {

                setMessage(
                    "Request timed out. Please try again."
                );

            }


            // ===============================
            // OTHER ERROR
            // ===============================

            else {

                setMessage(

                    err?.response?.data?.message ||

                    err?.message ||

                    "Something went wrong. Please try again."

                );

            }


            setStatus("error");

        }

    };


    // =========================================
    // RESET FORM
    // =========================================

    const handleReset = () => {

        if (status === "loading") {

            return;

        }


        setFormData({
            empcode: "",
            email: "",
            password: ""
        });


        setFieldErrors({
            empcode: "",
            email: "",
            password: ""
        });


        setStatus("idle");

        setMessage("");

    };


    return (

        <div className="signPage">


            {/* =================================
                LEFT SIDE
            ================================= */}

            <div className="signVisualSection">


                <div className="signOverlay"></div>


                <div className="signBrand">


                    <div className="signLogo">

                        EP

                    </div>


                    <h1>

                        Employee Performance

                    </h1>


                    <p>

                        Manage your work,
                        track your performance,
                        and achieve more.

                    </p>


                    <div className="signFeatures">

                        <div>
                            ✓ Track Performance
                        </div>

                        <div>
                            ✓ Manage Tasks
                        </div>

                        <div>
                            ✓ Monitor Progress
                        </div>

                    </div>


                </div>


                <div className="signBackgroundGlow glowOne"></div>

                <div className="signBackgroundGlow glowTwo"></div>


            </div>


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="signFormSection">


                <div className="signFormContainer">


                    {/* HEADER */}

                    <div className="signHeader">


                        <span className="signWelcome">

                            Welcome Back

                        </span>


                        <h2>

                            Sign in to your account

                        </h2>


                        <p>

                            Enter your details
                            to access your dashboard.

                        </p>


                    </div>


                    {/* =================================
                        GLOBAL STATUS MESSAGE
                    ================================= */}

                    {status === "error" && (

                        <div className="signError">

                            <span>

                                !

                            </span>


                            <p>

                                {message}

                            </p>


                        </div>

                    )}


                    {status === "success" && (

                        <div className="signSuccess">

                            <span>

                                ✓

                            </span>


                            <p>

                                {message}

                            </p>


                        </div>

                    )}


                    {/* =================================
                        FORM
                    ================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="signForm"
                        noValidate
                    >


                        {/* EMPLOYEE CODE */}

                        <div className="signInputGroup">


                            <label>

                                Employee Code

                            </label>


                            <div
                                className={`signInputWrapper
                                ${fieldErrors.empcode
                                    ? "signInputInvalid"
                                    : ""
                                }`}
                            >


                                <span className="signInputIcon">

                                    ID

                                </span>


                                <input

                                    type="text"

                                    name="empcode"

                                    placeholder="Enter your employee code"

                                    value={formData.empcode}

                                    onChange={handleChange}

                                    disabled={
                                        status === "loading"
                                    }

                                />


                            </div>


                            {fieldErrors.empcode && (

                                <small className="signFieldError">

                                    {fieldErrors.empcode}

                                </small>

                            )}


                        </div>


                        {/* EMAIL */}

                        <div className="signInputGroup">


                            <label>

                                Email Address

                            </label>


                            <div
                                className={`signInputWrapper
                                ${fieldErrors.email
                                    ? "signInputInvalid"
                                    : ""
                                }`}
                            >


                                <span className="signInputIcon">

                                    ✉

                                </span>


                                <input

                                    type="email"

                                    name="email"

                                    placeholder="Enter your email"

                                    value={formData.email}

                                    onChange={handleChange}

                                    disabled={
                                        status === "loading"
                                    }

                                />


                            </div>


                            {fieldErrors.email && (

                                <small className="signFieldError">

                                    {fieldErrors.email}

                                </small>

                            )}


                        </div>


                        {/* PASSWORD */}

                        <div className="signInputGroup">


                            <label>

                                Password

                            </label>


                            <div
                                className={`signInputWrapper
                                ${fieldErrors.password
                                    ? "signInputInvalid"
                                    : ""
                                }`}
                            >


                                <span className="signInputIcon">

                                    🔒

                                </span>


                                <input

                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    name="password"

                                    placeholder="Enter your password"

                                    value={formData.password}

                                    onChange={handleChange}

                                    disabled={
                                        status === "loading"
                                    }

                                />


                                <button

                                    type="button"

                                    className="signPasswordToggle"

                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }

                                    disabled={
                                        status === "loading"
                                    }

                                >

                                    {showPassword
                                        ? "Hide"
                                        : "Show"}

                                </button>


                            </div>


                            {fieldErrors.password && (

                                <small className="signFieldError">

                                    {fieldErrors.password}

                                </small>

                            )}


                        </div>


                        {/* OPTIONS */}

                        <div className="signOptions">


                            <label className="signRemember">


                                <input
                                    type="checkbox"
                                    disabled={
                                        status === "loading"
                                    }
                                />


                                <span>

                                    Remember me

                                </span>


                            </label>


                            <button

                                type="button"

                                className="signForgotPassword"

                                disabled={
                                    status === "loading"
                                }

                            >

                                Forgot password?

                            </button>


                        </div>


                        {/* BUTTON */}

                        <button

                            type="submit"

                            className="signSubmitButton"

                            disabled={
                                status === "loading" ||
                                status === "success"
                            }

                        >


                            {status === "loading" && (

                                <>

                                    <span className="signButtonLoader"></span>

                                    Signing in...

                                </>

                            )}


                            {status === "success" && (

                                "Success!"

                            )}


                            {status === "idle" && (

                                "Sign In"

                            )}


                            {status === "error" && (

                                "Try Again"

                            )}


                        </button>


                        {/* RESET AFTER ERROR */}

                        {status === "error" && (

                            <button

                                type="button"

                                className="signResetButton"

                                onClick={handleReset}

                            >

                                Clear Form

                            </button>

                        )}


                    </form>


                    <div className="signFooter">

                        <p>

                            Secure access to your
                            Employee Performance System

                        </p>

                    </div>


                </div>

            </div>


        </div>

    );

};


export default SignUp;