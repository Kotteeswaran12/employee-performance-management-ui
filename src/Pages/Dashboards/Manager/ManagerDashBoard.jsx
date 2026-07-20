
import Sidebar from '../../SideBar/Sidebar'
import Navbar from '../Component/Navbar'
const ManagerDashBoard = () => {
    return (
        <>
            <div className="empDashBoardOuter">
                <Sidebar />
                <div className="empDashBoardInner">
                    <Navbar User={[
                        {
                            'name': localStorage.getItem("username"),
                            'role': localStorage.getItem("role")
                        }
                    ]} />
                </div>
            </div>
        </>
    )
}

export default ManagerDashBoard