import { useEffect, useState } from "react";

import logDesign from "../../assets/login/loginDesign.png";
import LoginImg from "../../assets/login/LoginImg.png";

import "./Login.css";

import { BsPersonFill } from "react-icons/bs";
import { FaKey } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";

import { login } from "../../Api/AuthApi";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);

    const [errorMessage, setErrorMessage] = useState(false);

    const [loading, setLoading] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);


    // ============================================
    // FORM DATA
    // ============================================

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });


    // ============================================
    // LOAD REMEMBERED USERNAME
    // ============================================

    useEffect(() => {

        const savedUsername =
            localStorage.getItem("rememberedUsername");

        if (savedUsername) {

            setFormData(prev => ({
                ...prev,
                username: savedUsername
            }));

            setRememberMe(true);
        }

    }, []);


    // ============================================
    // INPUT HANDLER
    // ============================================

    const addUserDetails = (e, field) => {

        const value = e.target.value;

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Remove error when user starts typing
        if (errorMessage) {
            setErrorMessage(false);
        }
    };


    // ============================================
    // PASSWORD VISIBILITY
    // ============================================

    const passwordVisible = () => {

        setVisible(prev => !prev);

    };


    // ============================================
    // REMEMBER ME
    // ============================================

    const handleRememberMe = (e) => {

        setRememberMe(e.target.checked);

    };


    // ============================================
    // LOGIN
    // ============================================

    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }


        const username = formData.username.trim();

        const password = formData.password;


        // ========================================
        // VALIDATION
        // ========================================

        if (!username || !password) {

            setErrorMessage(true);

            return;
        }


        try {

            setLoading(true);

            setErrorMessage(false);


            console.log("Login Request:", {
                username,
                password
            });


            // ====================================
            // API LOGIN
            // ====================================

            const response = await login(
                username,
                password
            );


            console.log("Login Response:", response.data);


            // ====================================
            // SAVE AUTH DATA
            // ====================================

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "role",
                response.data.Role
            );

            localStorage.setItem(
                "username",
                response.data.username
            );


            // ====================================
            // REMEMBER USERNAME
            // ====================================

            if (rememberMe) {

                localStorage.setItem(
                    "rememberedUsername",
                    username
                );

            } else {

                localStorage.removeItem(
                    "rememberedUsername"
                );
            }


            // ====================================
            // ROLE BASED NAVIGATION
            // ====================================

            if (response.data.Role === "ADMIN") {

                navigate(
                    "/dashBoard",
                    { replace: true }
                );

            } else if (
                response.data.Role === "MANAGER"
            ) {

                navigate(
                    "/dashBoard",
                    { replace: true }
                );

            } else if (
                response.data.Role === "EMPLOYEE"
            ) {

                navigate(
                    "/dashBoard",
                    { replace: true }
                );

            } else {

                navigate(
                    "/dashBoard",
                    { replace: true }
                );
            }


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            setErrorMessage(true);

        } finally {

            setLoading(false);
        }
    };


    // ============================================
    // FORGOT PASSWORD
    // ============================================

    const handleForgotPassword = () => {

        console.log("Forgot Password clicked");

        // Later:
        // navigate("/forgotPassword");

    };


    return (

        <main className="loginMain">

            <div className="loginOuter">

                <div className="loginInner">


                    {/* ==========================================
                        LEFT SIDE
                    ========================================== */}

                    <section className="LoginLeft">


                        {/* ======================================
                            TITLE
                        ====================================== */}

                        <div className="LoginTittle">

                            <h1>
                                Employee Performance
                                Management System
                            </h1>

                            <p>
                                Welcome Back 👋🏻
                            </p>

                            <p>
                                Sign in to Access Your
                                Employee Dashboard !!
                            </p>


                            {errorMessage && (

                                <p className="loginError">
                                    Username or password
                                    is incorrect
                                </p>

                            )}

                        </div>


                        {/* ======================================
                            FORM
                        ====================================== */}

                        <form
                            onSubmit={handleLogin}
                            className="LoginForm"
                        >


                            {/* ================================
                                USERNAME
                            ================================= */}

                            <div
                                className={
                                    `UserNameInput ${
                                        errorMessage
                                            ? "error"
                                            : ""
                                    }`
                                }
                            >

                                <BsPersonFill
                                    className="LoginIcons"
                                />


                                <input
                                    type="text"
                                    placeholder="Username"
                                    autoComplete="username"
                                    value={formData.username}
                                    onChange={(e) =>
                                        addUserDetails(
                                            e,
                                            "username"
                                        )
                                    }
                                    autoFocus
                                    required
                                />

                            </div>


                            {/* ================================
                                PASSWORD
                            ================================= */}

                            <div
                                className={
                                    `PasswordInput ${
                                        errorMessage
                                            ? "error"
                                            : ""
                                    }`
                                }
                            >

                                <FaKey
                                    className="LoginIcons"
                                />


                                <input
                                    type={
                                        visible
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        addUserDetails(
                                            e,
                                            "password"
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    className="PasswordEyeButton"
                                    onClick={
                                        passwordVisible
                                    }
                                >

                                    {visible ? (

                                        <IoEye
                                            className="PasswordEye"
                                        />

                                    ) : (

                                        <IoMdEyeOff
                                            className="PasswordEye"
                                        />

                                    )}

                                </button>

                            </div>


                            {/* ==================================
                                ADDITIONAL DETAILS
                            ================================== */}

                            <div className="AditionalDetails">


                                <label className="Remember">

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={
                                            handleRememberMe
                                        }
                                    />

                                    <span>
                                        Remember Me
                                    </span>

                                </label>


                                <button
                                    type="button"
                                    className="ForgotPassword"
                                    onClick={
                                        handleForgotPassword
                                    }
                                >
                                    Forgot Password?
                                </button>

                            </div>


                            {/* ==================================
                                LOGIN BUTTON
                            ================================== */}

                            <button
                                type="submit"
                                className="LoginSubmitButton"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <ImSpinner8
                                            className="LoginSpinner"
                                        />

                                        Signing In...
                                    </>

                                ) : (

                                    <>
                                        Sign In

                                        <FaArrowRight
                                            className="LoginArrow"
                                        />
                                    </>

                                )}

                            </button>

                        </form>


                        {/* ======================================
                            DEMO ACCOUNTS
                        ====================================== */}

                        <div className="DemoAccount">

                            <h2>
                                Demo Accounts
                            </h2>

                            <p className="admin">
                                🔴 ADMIN :
                                <span>
                                    admin || admin123
                                </span>
                            </p>

                            <p className="manager">
                                🟢 MANAGER :
                                <span>
                                    manager || manager123
                                </span>
                            </p>

                            <p className="employee">
                                🟣 EMPLOYEE :
                                <span>
                                    employee || employee123
                                </span>
                            </p>

                        </div>


                    </section>


                    {/* ==========================================
                        RIGHT SIDE
                    ========================================== */}

                    <section className="LoginRight">

                        <img
                            src={LoginImg}
                            alt="Employee Management System"
                            className="MainLoginImg"
                        />

                        <img
                            src={logDesign}
                            alt=""
                            className="rectangleImg"
                        />

                    </section>


                </div>

            </div>

        </main>
    );
};


export default Login;