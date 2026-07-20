
import { FaUsers } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";


const OverAll = ({ datas }) => {

    return (
        <><div className="overAll">
            <div className="TotalEmp">
                <div className="icon">
                    <FaUsers className='dashboarIcons' />
                </div>
                <div className="results">
                    <h5>Total Employees</h5>
                    <h2>{datas.totalEmployees}</h2>
                </div>
            </div>



            <div className="TotalManager">
                <div className="icon">
                    <FaUserTie className='dashboarIcons' />
                </div>
                <div className="results">
                    <h5>Total Manager</h5>
                    <h2>{datas.totalManagers}</h2>
                </div>
            </div>


            <div className="Totaldept">
                <div className="icon">
                    <MdApartment className='dashboarIcons' />
                </div>
                <div className="results">
                    <h5>Total Department</h5>
                    <h2>{datas.totalDepartments}</h2>
                </div>
            </div>


            <div className="pendingLeaves">
                <div className="icon">
                    <MdOutlinePendingActions className='dashboarIcons' />
                </div>
                <div className="results">
                    <h5>Total Pending Leaves</h5>
                    <h2>{datas.pendingLeaves}</h2>
                </div>
            </div>


            <div className="completetask">
                <div className="icon">
                    <MdTaskAlt className='dashboarIcons' />
                </div>
                <div className="results">
                    <h5>Total Complete Tasks</h5>
                    <h2>{datas.completedTask}</h2>
                </div>
            </div>
        </div></>
    )
}

export default OverAll