
import Navbar from '../Component/Navbar'
import Sidebar from '../../SideBar/Sidebar'
import './AdminDashboard.css'
import OverAll from '../Component/OverAll'
import PieChart from '../Component/PieChart'
import { useEffect, useState } from 'react'
import { AdminDashBoard } from '../../../Api/AdminAccess'
import LeaveRequest from '../Component/LeaveRequest'
const AdminDashBorad = () => {

    const [AdminDashBoradDetails, setAdminDashBoard] = useState({});

    useEffect(() => {

        const getDetails = async () => {

            const AuthToken = localStorage.getItem('token');
            try {

                const response = await AdminDashBoard(AuthToken);
                setAdminDashBoard(response.data);

            } catch (e) {
                console.log(e)
            }

        }

        getDetails()

    }, [])



    return (
        <div className='AdminDashboarOuter'>
            <Sidebar></Sidebar>
            <div className="adminDashInner">
                <Navbar User={[
                    {
                        'name': localStorage.getItem("username"),
                        'role': localStorage.getItem("role")
                    }
                ]} />


                <OverAll datas={AdminDashBoradDetails} />

                <div className="additionDetails">



                    <PieChart data={[AdminDashBoradDetails]} />


                    <div className="leaveRequest">
                        <LeaveRequest Title="Recent Leave Request" />
                    </div>
                </div>
                <div className="Task">
                    <LeaveRequest Title="Recent Task Assigned" />
                </div>
            </div>
        </div>
    )
}

export default AdminDashBorad
