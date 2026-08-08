
import "./Setting.css";

import { getUserInfo } from "../../Api/AdminAccess";

import { useEffect, useState } from "react";

import {
    FiUser,
    FiMail,
    FiShield,
    FiCalendar,
    FiLock,
    FiCopy,
    FiCheck,
    FiRefreshCw,
    FiAlertCircle,
    FiEdit3,
    FiKey,
    FiPhone,
    FiLogOut,
    FiEye,
    FiEyeOff,
    FiSave,
    FiX
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";


const Settings = () => {


    const navigate = useNavigate();


    /* =====================================================
       AUTH
    ===================================================== */

    const AuthToken =
        localStorage.getItem("token");

    const userName =
        localStorage.getItem("username");


    /* =====================================================
       USER DATA
    ===================================================== */

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [copied, setCopied] =
        useState("");


    /* =====================================================
       UPDATE SECTION
    ===================================================== */

    const [showUpdate, setShowUpdate] =
        useState(false);


    const [updateData, setUpdateData] =
        useState({
            username: "",
            email: "",
            phone: ""
        });


    const [updateLoading, setUpdateLoading] =
        useState(false);


    const [updateMessage, setUpdateMessage] =
        useState("");



    /* =====================================================
       PASSWORD SECTION
    ===================================================== */

    const [showPassword, setShowPassword] =
        useState(false);


    const [showNewPassword, setShowNewPassword] =
        useState(false);


    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const [passwordData, setPasswordData] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });


    const [passwordLoading, setPasswordLoading] =
        useState(false);


    const [passwordMessage, setPasswordMessage] =
        useState("");


    /* =====================================================
       LOGOUT CONFIRMATION
    ===================================================== */

    const [showLogout, setShowLogout] =
        useState(false);



    /* =====================================================
       FETCH USER INFORMATION
    ===================================================== */

    const fetchData = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getUserInfo(
                    AuthToken,
                    userName
                );


            console.log(
                "User Information:",
                response.data
            );


            const user =
                Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;


            if (!user) {

                throw new Error(
                    "User information not found."
                );

            }


            const finalData = {

                JoinedAt:
                    user.createdate,

                Email:
                    user.email || "",

                Role:
                    user.role || "",

                userName:
                    user.username || "",

                Phone:
                    user.phone || ""

            };


            setData(finalData);


            /*
             * Fill update form with existing values.
             */

            setUpdateData({

                username:
                    user.username || "",

                email:
                    user.email || "",

                phone:
                    user.phone || ""

            });


        } catch (e) {

            console.error(
                "User Info Error:",
                e
            );


            if (
                e.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (
                e.response?.status === 403
            ) {

                setError(
                    "You don't have permission to view this information."
                );

            } else {

                setError(
                    "Unable to load your account information."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    /* =====================================================
       COPY
    ===================================================== */

    const copyValue = async (
        value,
        type
    ) => {

        if (!value) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                value
            );


            setCopied(type);


            setTimeout(() => {

                setCopied("");

            }, 1800);


        } catch (error) {

            console.log(
                "Copy failed:",
                error
            );

        }

    };



    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return date;

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };



    /* =====================================================
       FORMAT ROLE
    ===================================================== */

    const formatRole = (role) => {

        if (!role) {
            return "User";
        }


        return role
            .toString()
            .toLowerCase()
            .replace(
                /^./,
                (letter) =>
                    letter.toUpperCase()
            );

    };



    /* =====================================================
       INITIAL
    ===================================================== */

    const getInitial = () => {

        const name =
            data?.userName ||
            userName ||
            "U";


        return name
            .charAt(0)
            .toUpperCase();

    };



    /* =====================================================
       UPDATE INPUT
    ===================================================== */

    const handleUpdateChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setUpdateData((previous) => ({

            ...previous,

            [name]: value

        }));

    };



    /* =====================================================
       PASSWORD INPUT
    ===================================================== */

    const handlePasswordChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setPasswordData((previous) => ({

            ...previous,

            [name]: value

        }));

    };



    /* =====================================================
       UPDATE PROFILE
       
       IMPORTANT:
       Replace the API call below with your actual
       update-user API.
    ===================================================== */

    const handleUpdateProfile = async (e) => {

        e.preventDefault();


        setUpdateMessage("");


        if (
            !updateData.username.trim() ||
            !updateData.email.trim()
        ) {

            setUpdateMessage(
                "Username and email are required."
            );

            return;

        }


        setUpdateLoading(true);


        try {

            /*
             * Replace this section with:
             *
             * await updateUserInfo(
             *     AuthToken,
             *     updateData
             * );
             */


            console.log(
                "UPDATE USER:",
                updateData
            );


            /*
             * Temporary success.
             * Remove this when API is connected.
             */

            setData((previous) => ({

                ...previous,

                userName:
                    updateData.username,

                Email:
                    updateData.email,

                Phone:
                    updateData.phone

            }));


            /*
             * Keep localStorage username
             * synchronized.
             */

            localStorage.setItem(
                "username",
                updateData.username
            );


            setUpdateMessage(
                "Profile updated successfully."
            );


        } catch (e) {

            console.error(e);


            setUpdateMessage(
                "Unable to update profile. Please try again."
            );

        } finally {

            setUpdateLoading(false);

        }

    };



    /* =====================================================
       CHANGE PASSWORD
       
       IMPORTANT:
       Replace the API call with your backend endpoint.
    ===================================================== */

    const handleChangePassword = async (e) => {

        e.preventDefault();


        setPasswordMessage("");


        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            setPasswordMessage(
                "Please fill all password fields."
            );

            return;

        }


        if (
            passwordData.newPassword.length < 8
        ) {

            setPasswordMessage(
                "New password must contain at least 8 characters."
            );

            return;

        }


        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            setPasswordMessage(
                "New password and confirm password do not match."
            );

            return;

        }


        if (
            passwordData.currentPassword ===
            passwordData.newPassword
        ) {

            setPasswordMessage(
                "New password must be different from the current password."
            );

            return;

        }


        setPasswordLoading(true);


        try {

            /*
             * Replace with your actual API:
             *
             * await updatePassword(
             *     AuthToken,
             *     passwordData.currentPassword,
             *     passwordData.newPassword
             * );
             */


            console.log(
                "CHANGE PASSWORD"
            );


            setPasswordData({

                currentPassword: "",
                newPassword: "",
                confirmPassword: ""

            });


            setPasswordMessage(
                "Password updated successfully."
            );


        } catch (e) {

            console.error(e);


            setPasswordMessage(
                "Unable to change password."
            );

        } finally {

            setPasswordLoading(false);

        }

    };



    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        /*
         * Clear authentication information.
         */

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        localStorage.removeItem("username");


        /*
         * Optional:
         * If your application stores other
         * authentication information, clear
         * them here too.
         */


        setShowLogout(false);


        /*
         * Replace history so user cannot
         * simply navigate back to dashboard.
         */

        navigate(
            "/",
            {
                replace: true
            }
        );

    };



    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="SettingOuter">

                <div className="settingsSkeleton">

                    <div className="skeletonProfile">

                        <div className="skeletonAvatar"></div>

                        <div className="skeletonLines">

                            <span></span>

                            <span></span>

                        </div>

                    </div>


                    <div className="skeletonCards">

                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                    </div>

                </div>

            </div>

        );

    }



    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <div className="SettingOuter">

                <div className="settingsError">

                    <div className="settingsErrorIcon">

                        <FiAlertCircle />

                    </div>


                    <h2>
                        Unable to Load Profile
                    </h2>


                    <p>
                        {error}
                    </p>


                    <button
                        onClick={fetchData}
                    >

                        <FiRefreshCw />

                        Try Again

                    </button>

                </div>

            </div>

        );

    }



    /* =====================================================
       MAIN UI
    ===================================================== */

    return (

        <div className="SettingOuter">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="settingsPageHeader">

                <div>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your account and profile settings
                    </p>

                </div>


                <button
                    className="settingsRefresh"
                    onClick={fetchData}
                >

                    <FiRefreshCw />

                    Refresh

                </button>

            </div>



            {/* =================================================
                PROFILE CARD
            ================================================= */}

            <div className="profileCard">


                <div className="profileMain">


                    <div className="profileAvatar">

                        {getInitial()}

                    </div>


                    <div className="profileIdentity">

                        <h2>
                            {data?.userName ||
                                "User"}
                        </h2>


                        <p>
                            {data?.Email ||
                                "No email available"}
                        </p>


                        <div className="profileTags">

                            <span className="roleBadge">

                                <FiShield />

                                {formatRole(
                                    data?.Role
                                )}

                            </span>


                            <span className="activeBadge">

                                <span></span>

                                Active

                            </span>

                        </div>

                    </div>

                </div>


                <div className="profileAction">

                    <button
                        onClick={() => {

                            setShowUpdate(true);

                            setUpdateData({
                                username: data?.userName || "",
                                email: data?.Email || "",
                                phone: data?.Phone || ""
                            });

                            setPasswordData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: ""
                            });

                            setUpdateMessage("");
                            setPasswordMessage("");
                        }}
                    >

                        <FiEdit3 />

                        <span>
                            Edit Profile
                        </span>

                    </button>

                </div>

            </div>



            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <div className="settingsSection">

                <div className="sectionHeader">

                    <div>

                        <h2>
                            Account Information
                        </h2>

                        <p>
                            Your basic account details
                        </p>

                    </div>

                </div>


                <div className="infoGrid">


                    {/* USERNAME */}

                    <div className="infoCard">

                        <div className="infoIcon">

                            <FiUser />

                        </div>


                        <div className="infoContent">

                            <span>
                                Username
                            </span>

                            <strong>
                                {data?.userName ||
                                    "-"}
                            </strong>

                        </div>


                        <button
                            className="copyButton"
                            onClick={() =>
                                copyValue(
                                    data?.userName,
                                    "username"
                                )
                            }
                        >

                            {copied === "username"
                                ? <FiCheck />
                                : <FiCopy />
                            }

                        </button>

                    </div>



                    {/* EMAIL */}

                    <div className="infoCard">

                        <div className="infoIcon">

                            <FiMail />

                        </div>


                        <div className="infoContent">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {data?.Email ||
                                    "-"}
                            </strong>

                        </div>


                        <button
                            className="copyButton"
                            onClick={() =>
                                copyValue(
                                    data?.Email,
                                    "email"
                                )
                            }
                        >

                            {copied === "email"
                                ? <FiCheck />
                                : <FiCopy />
                            }

                        </button>

                    </div>



                    {/* PHONE */}

                    <div className="infoCard">

                        <div className="infoIcon">

                            <FiPhone />

                        </div>


                        <div className="infoContent">

                            <span>
                                Phone Number
                            </span>

                            <strong>
                                {data?.Phone ||
                                    "Not provided"}
                            </strong>

                        </div>


                        {data?.Phone && (

                            <button
                                className="copyButton"
                                onClick={() =>
                                    copyValue(
                                        data.Phone,
                                        "phone"
                                    )
                                }
                            >

                                {copied === "phone"
                                    ? <FiCheck />
                                    : <FiCopy />
                                }

                            </button>

                        )}

                    </div>



                    {/* ROLE */}

                    <div className="infoCard">

                        <div className="infoIcon">

                            <FiShield />

                        </div>


                        <div className="infoContent">

                            <span>
                                Account Role
                            </span>

                            <strong>
                                {formatRole(
                                    data?.Role
                                )}
                            </strong>

                        </div>


                        <div className="roleMiniBadge">

                            {formatRole(
                                data?.Role
                            )}

                        </div>

                    </div>



                    {/* JOINED */}

                    <div className="infoCard">

                        <div className="infoIcon">

                            <FiCalendar />

                        </div>


                        <div className="infoContent">

                            <span>
                                Joined Date
                            </span>

                            <strong>
                                {formatDate(
                                    data?.JoinedAt
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>




            {/* =================================================
    EDIT PROFILE MODAL
================================================= */}

            {showUpdate && (

                <div
                    className="editProfileOverlay"
                    onClick={() => setShowUpdate(false)}
                >

                    <div
                        className="editProfileModal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* ===============================
                MODAL HEADER
            =============================== */}

                        <div className="editProfileHeader">

                            <div>

                                <h2>
                                    Edit Profile
                                </h2>

                                <p>
                                    Update your account information
                                </p>

                            </div>


                            <button
                                className="editProfileClose"
                                onClick={() =>
                                    setShowUpdate(false)
                                }
                            >

                                <FiX />

                            </button>

                        </div>


                        {/* ===============================
                PROFILE INFORMATION
            =============================== */}

                        <form
                            className="editProfileForm"
                            onSubmit={
                                handleUpdateProfile
                            }
                        >

                            <div className="editFormGrid">


                                {/* USERNAME */}

                                <div className="updateInputGroup">

                                    <label>
                                        Username
                                    </label>

                                    <div className="settingsInput">

                                        <FiUser />

                                        <input
                                            type="text"
                                            name="username"
                                            value={
                                                updateData.username
                                            }
                                            onChange={
                                                handleUpdateChange
                                            }
                                            placeholder="Enter username"
                                        />

                                    </div>

                                </div>


                                {/* EMAIL */}

                                <div className="updateInputGroup">

                                    <label>
                                        Email Address
                                    </label>

                                    <div className="settingsInput">

                                        <FiMail />

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                updateData.email
                                            }
                                            onChange={
                                                handleUpdateChange
                                            }
                                            placeholder="Enter email"
                                        />

                                    </div>

                                </div>


                                {/* PHONE */}

                                <div className="updateInputGroup">

                                    <label>
                                        Phone Number
                                    </label>

                                    <div className="settingsInput">

                                        <FiPhone />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                updateData.phone
                                            }
                                            onChange={
                                                handleUpdateChange
                                            }
                                            placeholder="Enter phone number"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* ===============================
                    PROFILE MESSAGE
                =============================== */}

                            {updateMessage && (

                                <div
                                    className={
                                        updateMessage.includes(
                                            "successfully"
                                        )
                                            ? "formSuccess"
                                            : "formError"
                                    }
                                >

                                    {updateMessage}

                                </div>

                            )}


                            {/* ===============================
                    PASSWORD SECTION
                =============================== */}

                            <div className="editPasswordSection">

                                <div className="editPasswordTitle">

                                    <FiLock />

                                    <div>

                                        <h3>
                                            Change Password
                                        </h3>

                                        <p>
                                            Leave these fields empty
                                            if you don't want to
                                            change your password.
                                        </p>

                                    </div>

                                </div>


                                <div className="editPasswordGrid">


                                    {/* CURRENT PASSWORD */}

                                    <div className="passwordInputGroup">

                                        <label>
                                            Current Password
                                        </label>

                                        <div className="settingsInput">

                                            <FiLock />

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="currentPassword"
                                                value={
                                                    passwordData.currentPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Current password"
                                            />

                                            <button
                                                type="button"
                                                className="passwordEye"
                                                onClick={() =>
                                                    setShowPassword(
                                                        previous =>
                                                            !previous
                                                    )
                                                }
                                            >

                                                {showPassword
                                                    ? <FiEyeOff />
                                                    : <FiEye />
                                                }

                                            </button>

                                        </div>

                                    </div>


                                    {/* NEW PASSWORD */}

                                    <div className="passwordInputGroup">

                                        <label>
                                            New Password
                                        </label>

                                        <div className="settingsInput">

                                            <FiKey />

                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="newPassword"
                                                value={
                                                    passwordData.newPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="New password"
                                            />

                                            <button
                                                type="button"
                                                className="passwordEye"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        previous =>
                                                            !previous
                                                    )
                                                }
                                            >

                                                {showNewPassword
                                                    ? <FiEyeOff />
                                                    : <FiEye />
                                                }

                                            </button>

                                        </div>

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div className="passwordInputGroup">

                                        <label>
                                            Confirm Password
                                        </label>

                                        <div className="settingsInput">

                                            <FiKey />

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Confirm password"
                                            />

                                            <button
                                                type="button"
                                                className="passwordEye"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        previous =>
                                                            !previous
                                                    )
                                                }
                                            >

                                                {showConfirmPassword
                                                    ? <FiEyeOff />
                                                    : <FiEye />
                                                }

                                            </button>

                                        </div>

                                    </div>

                                </div>


                                {passwordMessage && (

                                    <div
                                        className={
                                            passwordMessage.includes(
                                                "successfully"
                                            )
                                                ? "formSuccess"
                                                : "formError"
                                        }
                                    >

                                        {passwordMessage}

                                    </div>

                                )}

                            </div>


                            {/* ===============================
                    ACTIONS
                =============================== */}

                            <div className="editProfileActions">

                                <button
                                    type="button"
                                    className="editCancelButton"
                                    onClick={() =>
                                        setShowUpdate(false)
                                    }
                                >

                                    <FiX />

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="editSaveButton"
                                    disabled={
                                        updateLoading ||
                                        passwordLoading
                                    }
                                >

                                    {updateLoading ||
                                        passwordLoading ? (

                                        <>
                                            <FiRefreshCw
                                                className="buttonSpin"
                                            />

                                            Updating...

                                        </>

                                    ) : (

                                        <>
                                            <FiSave />

                                            Save Changes

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}











            {/* =================================================
                ACCOUNT STATUS
            ================================================= */}

            <div className="settingsSection">

                <div className="sectionHeader">

                    <div>

                        <h2>
                            Account Status
                        </h2>

                        <p>
                            Current account information
                        </p>

                    </div>

                </div>


                <div className="accountStatusCard">

                    <div className="statusInfo">

                        <div className="statusIcon">

                            <FiCheck />

                        </div>


                        <div>

                            <h3>
                                Account Active
                            </h3>

                            <p>
                                Your account is currently active and accessible.
                            </p>

                        </div>

                    </div>


                    <span className="accountActiveBadge">

                        <span></span>

                        Active

                    </span>

                </div>

            </div>



            {/* =================================================
                LOGOUT
            ================================================= */}

            <div className="logoutSection">

                <div>

                    <h2>
                        Logout
                    </h2>

                    <p>
                        Sign out from this account on this device.
                    </p>

                </div>


                <button
                    className="logoutButton"
                    onClick={() =>
                        setShowLogout(true)
                    }
                >

                    <FiLogOut />

                    Logout

                </button>

            </div>



            {/* =================================================
                LOGOUT MODAL
            ================================================= */}

            {showLogout && (

                <div
                    className="logoutOverlay"
                    onClick={() =>
                        setShowLogout(false)
                    }
                >

                    <div
                        className="logoutModal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="logoutModalIcon">

                            <FiLogOut />

                        </div>


                        <h2>
                            Logout?
                        </h2>


                        <p>
                            Are you sure you want to logout
                            from this account?
                        </p>


                        <div className="logoutModalActions">

                            <button
                                className="logoutCancel"
                                onClick={() =>
                                    setShowLogout(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="logoutConfirm"
                                onClick={
                                    handleLogout
                                }
                            >

                                <FiLogOut />

                                Logout

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );

};


export default Settings;

