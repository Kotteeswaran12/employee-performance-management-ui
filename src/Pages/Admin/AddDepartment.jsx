import { getAlltheDepartments } from "../../Api/AdminAccess"
import { useEffect, useRef, useState } from "react"
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { addDepartment } from "../../Api/AdminAccess";
import { DeleteDept } from "../../Api/AdminAccess";
import "./AddDept.css"
const AddDepartment = () => {

    const [DeptData, setDeptData] = useState([]);
    const AuthToken = localStorage.getItem("token");
    const [showUpdate, setShowUpdate] = useState(false);

    const addDept = useRef({
        dept: ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchDataFromApi = async () => {

        const alldept = await getAlltheDepartments(AuthToken, 0, 10);

        const finaldata = alldept.data.content.map((d,) => (
            {
                no: d.id,
                department: d.dept,
                action: ["update", "delete"]

            }
        ))


        setDeptData(finaldata);

    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDataFromApi()
    }, [fetchDataFromApi])


    const handelAddDept = async () => {
        try {
            const response = await addDepartment(AuthToken, addDept.current)

            console.log(response)
            console.log("Done ")
            fetchDataFromApi()

        } catch (e) {
            console.log(e)
        }
    }

    const handelDeleteDept = async (id) => {
        try {

            console.log("id", id)
            const response = await DeleteDept(AuthToken, id);

            console.log(response)
            fetchDataFromApi()
        } catch (e) {
            console.log(e)
        }

        // console.log(id)
    }
    const handelUpdateDept = (id) => {

        console.log(id)
        setShowUpdate(prev => !prev)


    }


    const title = ["no", "department", "action"]





    return (
        <div className="addDeptOuter" onClick={(e) => { setShowUpdate(false) }}>
            <h1>Add  Department !!</h1>

            <div className="addDeptInner">
                <input type="text" name="" id="" placeholder="Enter the Department Name" onChange={(e) => {
                    addDept.current = { ...addDept.current, dept: e.target.value }
                    console.log(addDept)
                }} />
                <button onClick={handelAddDept}>Add</button>

            </div>




            <div className="LeavReqOuter">
                <div className="LeaveReqDatas">

                    <table>
                        <thead>
                            <tr>
                                {title.map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {DeptData.length > 0 ? (
                                DeptData.map((d, index) => (
                                    <tr key={index}>
                                        {title.map((column) => (
                                            <td key={column}>
                                                {column === "action" ? (
                                                    <>
                                                        <button className="update" onClick={(e) => { e.stopPropagation(), handelUpdateDept(d['no']) }}>
                                                            <GrUpdate />
                                                        </button>
                                                        <button className="delete" onClick={() => handelDeleteDept(d['no'])}>
                                                            <MdDelete />
                                                        </button>
                                                    </>
                                                ) : (
                                                    d[column]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={title.length}>No Records Found!!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                showUpdate && (
                    <div className="overLay">
                        <div className="DeptUpdateOuter">

                            <h1>Enter ur Update Depart name</h1>
                            <div className="addDeptInner">
                                <input type="text" name="" id="" placeholder="Enter the Department Name" onChange={(e) => {
                                    addDept.current = { ...addDept.current, dept: e.target.value }
                                    console.log(addDept)
                                }} />
                                <button onClick={handelAddDept}>update</button>

                            </div>
                        </div>
                    </div>

                )
            }
        </div>
    )
}

export default AddDepartment