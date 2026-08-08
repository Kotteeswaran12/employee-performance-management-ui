import { useEffect, useRef, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";

import {
    getAlltheDepartments,
    addDepartment,
    DeleteDept,
    getDeptbyId,
    updateDeptname
} from "../../Api/AdminAccess";

import "./AddDept.css";

const AddDepartment = () => {

    const [DeptData, setDeptData] = useState([]);
    const [search, setSearch] = useState("");

    const [showUpdate, setShowUpdate] = useState(false);
    const [updateData, setUpdateData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    const AuthToken = localStorage.getItem("token");

    const addDept = useRef({
        dept: ""
    });

    // ------------------------------------------
    // FETCH DEPARTMENTS
    // ------------------------------------------

    const fetchDataFromApi = async () => {

        try {

            setLoading(true);

            const alldept = await getAlltheDepartments(
                AuthToken,
                0,
                10
            );

            const finaldata = alldept.data.content.map((d) => ({
                no: d.id,
                department: d.dept,
                action: ["update", "delete"]
            }));

            setDeptData(finaldata);

        } catch (error) {

            console.log(error);

            setMessage({
                type: "error",
                text: "Failed to load departments"
            });

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFromApi();
    }, []);

    // ------------------------------------------
    // MESSAGE
    // ------------------------------------------

    const showMessage = (type, text) => {

        setMessage({
            type,
            text
        });

        setTimeout(() => {
            setMessage({
                type: "",
                text: ""
            });
        }, 3000);
    };

    // ------------------------------------------
    // ADD DEPARTMENT
    // ------------------------------------------

    const handelAddDept = async () => {

        const deptName = addDept.current.dept.trim();

        if (!deptName) {

            showMessage(
                "error",
                "Please enter a department name"
            );

            return;
        }

        try {

            setActionLoading(true);

            const response = await addDepartment(
                AuthToken,
                {
                    dept: deptName
                }
            );

            console.log(response);

            showMessage(
                "success",
                "Department added successfully"
            );

            // Clear input
            addDept.current = {
                dept: ""
            };

            // Clear input element
            document.querySelector(
                ".addDeptInner input"
            ).value = "";

            await fetchDataFromApi();

        } catch (e) {

            console.log(e);

            showMessage(
                "error",
                "Unable to add department"
            );

        } finally {

            setActionLoading(false);
        }
    };

    // ------------------------------------------
    // DELETE DEPARTMENT
    // ------------------------------------------

    const handelDeleteDept = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this department?"
        );

        if (!confirmDelete) return;

        try {

            setActionLoading(true);

            const response = await DeleteDept(
                AuthToken,
                id
            );

            console.log(response);

            showMessage(
                "success",
                "Department deleted successfully"
            );

            await fetchDataFromApi();

        } catch (e) {

            console.log(e);

            showMessage(
                "error",
                "Unable to delete department"
            );

        } finally {

            setActionLoading(false);
        }
    };

    // ------------------------------------------
    // OPEN UPDATE MODAL
    // ------------------------------------------

    const handelUpdateDept = async (id) => {

        try {

            setActionLoading(true);

            const oldData = await getDeptbyId(
                AuthToken,
                id
            );

            setUpdateData(oldData.data);

            // Prefill update input
            addDept.current = {
                dept: oldData.data.dept
            };

            setShowUpdate(true);

        } catch (e) {

            console.log(e);

            showMessage(
                "error",
                "Unable to load department details"
            );

        } finally {

            setActionLoading(false);
        }
    };

    // ------------------------------------------
    // UPDATE DEPARTMENT
    // ------------------------------------------

    const UpdateDept = async () => {

        const newDeptName =
            addDept.current.dept?.trim();

        if (!newDeptName) {

            showMessage(
                "error",
                "Please enter a valid department name"
            );

            return;
        }

        try {

            setActionLoading(true);

            const response = await updateDeptname(
                AuthToken,
                newDeptName,
                updateData.id
            );

            console.log(response);

            showMessage(
                "success",
                "Department updated successfully"
            );

            setShowUpdate(false);

            addDept.current = {
                dept: ""
            };

            await fetchDataFromApi();

        } catch (e) {

            console.log(e);

            showMessage(
                "error",
                "Unable to update department"
            );

        } finally {

            setActionLoading(false);
        }
    };

    // ------------------------------------------
    // SEARCH
    // ------------------------------------------

    const filteredDepartments = DeptData.filter((dept) =>
        dept.department
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const title = [
        "no",
        "department",
        "action"
    ];

    // ------------------------------------------
    // UI
    // ------------------------------------------

    return (

        <div
            className="addDeptOuter"
            onClick={() => setShowUpdate(false)}
        >

            <h1>Add Department !!</h1>


            {/* --------------------------------
                ADD DEPARTMENT
            -------------------------------- */}

            <div className="addDeptInner">

                <input
                    type="text"
                    placeholder="Enter the Department Name"
                    onChange={(e) => {

                        addDept.current = {
                            ...addDept.current,
                            dept: e.target.value
                        };

                    }}
                />

                <button
                    onClick={handelAddDept}
                    disabled={actionLoading}
                >
                    {actionLoading
                        ? "Please wait..."
                        : "Add"
                    }
                </button>

            </div>


            {/* --------------------------------
                MESSAGE
            -------------------------------- */}

            {message.text && (

                <div
                    className={`deptMessage ${message.type}`}
                >
                    {message.text}
                </div>

            )}


            {/* --------------------------------
                DEPARTMENT HEADER
            -------------------------------- */}

            <div className="deptTools">

                <div className="deptCount">

                    <span>
                        Total Departments
                    </span>

                    <strong>
                        {DeptData.length}
                    </strong>

                </div>


                <div className="deptSearch">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search Department..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (

                        <MdClose
                            onClick={() => setSearch("")}
                        />

                    )}

                </div>


                <button
                    className="refreshBtn"
                    onClick={fetchDataFromApi}
                    disabled={loading}
                >

                    <IoMdRefresh
                        className={
                            loading
                                ? "refreshAnimation"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* --------------------------------
                TABLE
            -------------------------------- */}

            <div className="LeavReqOuter">

                <div className="LeaveReqDatas">

                    <table>

                        <thead>

                            <tr>

                                {title.map((key) => (

                                    <th key={key}>
                                        {key}
                                    </th>

                                ))}

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={title.length}
                                        className="tableLoading"
                                    >

                                        <div className="loader"></div>

                                        Loading Departments...

                                    </td>

                                </tr>

                            ) : filteredDepartments.length > 0 ? (

                                filteredDepartments.map(
                                    (d, index) => (

                                        <tr key={d.no}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <span className="deptName">
                                                    {d.department}
                                                </span>
                                            </td>


                                            <td>

                                                <button
                                                    className="update"
                                                    disabled={actionLoading}
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        handelUpdateDept(
                                                            d.no
                                                        );

                                                    }}
                                                >

                                                    <GrUpdate />

                                                </button>


                                                <button
                                                    className="delete"
                                                    disabled={actionLoading}
                                                    onClick={() =>
                                                        handelDeleteDept(
                                                            d.no
                                                        )
                                                    }
                                                >

                                                    <MdDelete />

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={title.length}
                                        className="emptyTable"
                                    >

                                        <div>
                                            <span>📂</span>

                                            <p>
                                                {search
                                                    ? "No department found"
                                                    : "No Departments Available"
                                                }
                                            </p>

                                            {search && (
                                                <small>
                                                    Try searching with
                                                    another name
                                                </small>
                                            )}

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* --------------------------------
                UPDATE MODAL
            -------------------------------- */}

            {showUpdate && updateData && (

                <div
                    className="overLay"
                    onClick={() =>
                        setShowUpdate(false)
                    }
                >

                    <div
                        className="DeptUpdateOuter"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="closeModal"
                            onClick={() =>
                                setShowUpdate(false)
                            }
                        >
                            <MdClose />
                        </button>


                        <h1>
                            Update Department
                        </h1>


                        <div className="oldData">

                            <span>
                                Current Department
                            </span>

                            <h4>
                                {updateData.dept}
                            </h4>

                        </div>


                        <div className="addDeptInner">

                            <input
                                type="text"
                                placeholder="Enter new Department Name"
                                defaultValue={
                                    updateData.dept
                                }
                                onChange={(e) => {

                                    addDept.current = {
                                        ...addDept.current,
                                        dept: e.target.value
                                    };

                                }}
                            />


                            <button
                                onClick={UpdateDept}
                                disabled={actionLoading}
                            >

                                {actionLoading
                                    ? "Updating..."
                                    : "Update"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AddDepartment;