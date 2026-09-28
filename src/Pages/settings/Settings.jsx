import "./Setting.css";

import { getUserInfo } from "../../Api/AdminAccess";
import {
    UpdateUesrInfo,
    changePass
} from "../../Api/AuthApi";

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
       EDIT PROFILE
       
       ONLY:
       username
       email
       phone
       
       NO PASSWORD DATA
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
       CHANGE PASSWORD
       
       COMPLETELY SEPARATE FROM EDIT PROFILE
    ===================================================== */

    const [showChangePassword, setShowChangePassword] =
        useState(false);

    const [passwordData, setPasswordData] =
        useState({
            currentPass: "",
            newPass: "",
            confirmPass: ""
        });

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    /* =====================================================
       LOGOUT
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
             * Fill Edit Profile form.
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
       COPY VALUE
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
                String(value)
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
       GET INITIAL
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
       EDIT PROFILE INPUT CHANGE
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
       CHANGE PASSWORD INPUT CHANGE
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
       OPEN EDIT PROFILE
       
       ONLY PROFILE DATA
    ===================================================== */

    const openEditProfile = () => {

        setUpdateData({

            username:
                data?.userName || "",

            email:
                data?.Email || "",

            phone:
                data?.Phone || ""

        });

        setUpdateMessage("");

        setShowUpdate(true);

    };


    /* =====================================================
       CLOSE EDIT PROFILE
    ===================================================== */

    const closeEditProfile = () => {

        setShowUpdate(false);

        setUpdateMessage("");

    };


    /* =====================================================
       OPEN CHANGE PASSWORD
       
       COMPLETELY SEPARATE
    ===================================================== */

    const openChangePassword = () => {

        setPasswordData({

            currentPass: "",
            newPass: "",
            confirmPass: ""

        });

        setPasswordMessage("");

        setShowCurrentPassword(false);

        setShowNewPassword(false);

        setShowConfirmPassword(false);

        setShowChangePassword(true);

    };


    /* =====================================================
       CLOSE CHANGE PASSWORD
    ===================================================== */

    const closeChangePassword = () => {

        setShowChangePassword(false);

        setPasswordMessage("");

        setPasswordData({

            currentPass: "",
            newPass: "",
            confirmPass: ""

        });

    };


    /* =====================================================
       UPDATE PROFILE API
       
       API:
       UpdateProfile(
           JWT,
           {
               username,
               email,
               phone
           }
       )
    ===================================================== */

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        setUpdateMessage("");


        /* Required validation */

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
             * Profile object ONLY.
             */

            const profilePayload = {

                username:
                    updateData.username.trim(),

                email:
                    updateData.email.trim(),

                phone:
                    updateData.phone
                        ? Number(updateData.phone)
                        : null

            };


            /*
             * Update Profile API
             */

            const response =
                await UpdateUesrInfo(
                    AuthToken,
                    profilePayload
                );


            console.log(
                "Profile Updated:",
                response?.data
            );


            /*
             * Update UI after successful API call.
             */

            setData((previous) => ({

                ...previous,

                userName:
                    profilePayload.username,

                Email:
                    profilePayload.email,

                Phone:
                    profilePayload.phone

            }));


            /*
             * Keep username in localStorage synchronized.
             */

            localStorage.setItem(
                "username",
                profilePayload.username
            );


            setUpdateMessage(
                "Profile updated successfully."
            );


        } catch (e) {

            console.error(
                "Update Profile Error:",
                e
            );


            if (
                e.response?.status === 401
            ) {

                setUpdateMessage(
                    "Your session has expired. Please login again."
                );

            } else if (
                e.response?.status === 403
            ) {

                setUpdateMessage(
                    "You don't have permission to update this profile."
                );

            } else {

                setUpdateMessage(
                    e.response?.data?.message ||
                    "Unable to update profile. Please try again."
                );

            }

        } finally {

            setUpdateLoading(false);

        }

    };


    /* =====================================================
       CHANGE PASSWORD API
       
       API:
       ChangePass(
           JWT,
           {
               currentPass,
               newPass
           }
       )
       
       confirmPass is NEVER sent to API.
    ===================================================== */

    const handleChangePassword = async (e) => {

        e.preventDefault();

        setPasswordMessage("");


        /* ================================================
           CHECK ALL FIELDS
        ================================================ */

        if (
            !passwordData.currentPass ||
            !passwordData.newPass ||
            !passwordData.confirmPass
        ) {

            setPasswordMessage(
                "Please fill all password fields."
            );

            return;

        }


        /* ================================================
           PASSWORD LENGTH
        ================================================ */

        if (
            passwordData.newPass.length < 8
        ) {

            setPasswordMessage(
                "New password must contain at least 8 characters."
            );

            return;

        }


        /* ================================================
           CONFIRM PASSWORD
           
           API WILL NOT BE CALLED IF
           PASSWORDS DON'T MATCH.
        ================================================ */

        if (
            passwordData.newPass !==
            passwordData.confirmPass
        ) {

            setPasswordMessage(
                "New password and confirm password do not match."
            );

            return;

        }


        /* ================================================
           CURRENT AND NEW PASSWORD
        ================================================ */

        if (
            passwordData.currentPass ===
            passwordData.newPass
        ) {

            setPasswordMessage(
                "New password must be different from the current password."
            );

            return;

        }


        setPasswordLoading(true);


        try {

            /*
             * EXACT API OBJECT.
             *
             * confirmPass is NOT included.
             */

            const passwordPayload = {

                currentPass:
                    passwordData.currentPass,

                newPass:
                    passwordData.newPass

            };


            /*
             * Change Password API
             */
            console.log("JWT:", AuthToken);
            console.log("Password Payload:", passwordPayload);

            const response =
                await changePass(
                    AuthToken,
                    passwordPayload
                );


            console.log(
                "Password Changed:",
                passwordPayload
            );


            /*
             * Clear password fields.
             */

            setPasswordData({

                currentPass: "",
                newPass: "",
                confirmPass: ""

            });


            setPasswordMessage(
                "Password updated successfully."
            );


        } catch (e) {

            console.error(
                "Change Password Error:",
                e
            );


            if (
                e.response?.status === 401
            ) {

                setPasswordMessage(
                    e.response?.data?.message ||
                    "Current password is incorrect or your session has expired."
                );

            } else if (
                e.response?.status === 403
            ) {

                setPasswordMessage(
                    "You don't have permission to change the password."
                );

            } else {

                setPasswordMessage(
                    e.response?.data?.message ||
                    "Unable to change password. Please try again."
                );

            }

        } finally {

            setPasswordLoading(false);

        }

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        localStorage.removeItem("username");

        setShowLogout(false);

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


                {/* =================================================
                    PROFILE ACTIONS
                ================================================= */}

                <div className="profileAction">


                    {/* EDIT PROFILE */}

                    <button
                        className="editProfileButton"
                        onClick={openEditProfile}
                    >

                        <FiEdit3 />

                        <span>
                            Edit Profile
                        </span>

                    </button>


                    {/* CHANGE PASSWORD */}

                    <button
                        className="changePasswordButton"
                        onClick={openChangePassword}
                    >

                        <FiLock />

                        <span>
                            Change Password
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
                EDIT PROFILE POPUP
               
                IMPORTANT:
                ONLY USERNAME / EMAIL / PHONE
               
                NO PASSWORD SECTION
            ================================================= */}

            {showUpdate && (

                <div
                    className="editProfileOverlay"
                    onClick={closeEditProfile}
                >

                    <div
                        className="editProfileModal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="editProfileHeader">

                            <div>

                                <div className="modalTitleIcon">

                                    <FiEdit3 />

                                </div>


                                <div>

                                    <h2>
                                        Edit Profile
                                    </h2>

                                    <p>
                                        Update your account information
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="editProfileClose"
                                onClick={closeEditProfile}
                            >

                                <FiX />

                            </button>

                        </div>


                        {/* =================================================
                            EDIT PROFILE FORM
                           
                            ONLY 3 FIELDS
                        ================================================= */}

                        <form
                            className="editProfileForm"
                            onSubmit={handleUpdateProfile}
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
                                            autoComplete="username"
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
                                            autoComplete="email"
                                        />

                                    </div>

                                </div>


                                {/* PHONE */}

                                <div className="updateInputGroup fullWidth">

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
                                            inputMode="numeric"
                                            autoComplete="tel"
                                        />

                                    </div>

                                </div>


                            </div>


                            {/* PROFILE MESSAGE */}

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


                            {/* PROFILE ACTIONS */}

                            <div className="editProfileActions">


                                <button
                                    type="button"
                                    className="editCancelButton"
                                    onClick={closeEditProfile}
                                >

                                    <FiX />

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="editSaveButton"
                                    disabled={
                                        updateLoading
                                    }
                                >

                                    {updateLoading ? (

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
                CHANGE PASSWORD POPUP
               
                THIS IS A COMPLETELY SEPARATE POPUP
               
                CURRENT PASSWORD
                NEW PASSWORD
                CONFIRM PASSWORD
            ================================================= */}

            {showChangePassword && (

                <div
                    className="changePasswordOverlay"
                    onClick={closeChangePassword}
                >

                    <div
                        className="changePasswordModal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* PASSWORD HEADER */}

                        <div className="changePasswordHeader">

                            <div className="passwordModalIcon">

                                <FiLock />

                            </div>


                            <div className="passwordModalTitle">

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Create a new password for your account
                                </p>

                            </div>


                            <button
                                type="button"
                                className="changePasswordClose"
                                onClick={closeChangePassword}
                            >

                                <FiX />

                            </button>

                        </div>


                        {/* =================================================
                            PASSWORD FORM
                        ================================================= */}

                        <form
                            className="changePasswordForm"
                            onSubmit={
                                handleChangePassword
                            }
                        >


                            {/* CURRENT PASSWORD */}

                            <div className="passwordInputGroup">

                                <label>
                                    Current Password
                                </label>


                                <div className="settingsInput">

                                    <FiLock />


                                    <input
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="currentPass"
                                        value={
                                            passwordData.currentPass
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter current password"
                                        autoComplete="current-password"
                                    />


                                    <button
                                        type="button"
                                        className="passwordEye"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                previous =>
                                                    !previous
                                            )
                                        }
                                    >

                                        {showCurrentPassword
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
                                        name="newPass"
                                        value={
                                            passwordData.newPass
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
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


                            {/* CONFIRM NEW PASSWORD */}

                            <div className="passwordInputGroup">

                                <label>
                                    Confirm New Password
                                </label>


                                <div className="settingsInput">

                                    <FiKey />


                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPass"
                                        value={
                                            passwordData.confirmPass
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
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


                            {/* PASSWORD MESSAGE */}

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


                            {/* PASSWORD ACTIONS */}

                            <div className="changePasswordActions">


                                <button
                                    type="button"
                                    className="editCancelButton"
                                    onClick={
                                        closeChangePassword
                                    }
                                >

                                    <FiX />

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="editSaveButton"
                                    disabled={
                                        passwordLoading
                                    }
                                >

                                    {passwordLoading ? (

                                        <>

                                            <FiRefreshCw
                                                className="buttonSpin"
                                            />

                                            Updating...

                                        </>

                                    ) : (

                                        <>

                                            <FiSave />

                                            Change Password

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
                LOGOUT CONFIRMATION
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
                                    setShowLogout(false)
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