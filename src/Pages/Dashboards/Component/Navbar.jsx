import { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaUserTie,
    FaUserShield
} from "react-icons/fa";

const Navbar = ({ User }) => {

    const [{ name, role }] = User;

    const navigate = useNavigate();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const getRoleIcon = () => {

        switch (role?.toUpperCase()) {

            case "ADMIN":
                return <FaUserShield />;

            case "MANAGER":
                return <FaUserTie />;

            case "EMPLOYEE":
                return <FaUser />;

            default:
                return <FaUser />;

        }
    };

    useEffect(() => {

        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="NavOuter">

            <div className="logoName">

                <h1>
                    {role} Dashboard
                </h1>

                {windowWidth > 900 && (

                    <div
                        className="userInfo"
                        onClick={handleLogout}
                        title="Click to logout"
                    >

                        <div className="profileImageWrapper">

                            <div className="roleIcon">
                                {getRoleIcon()}
                            </div>

                            <span className="onlineIndicator"></span>

                        </div>


                        <div className="userDetails">

                            <h4>
                                User : {name}
                            </h4>

                            <p>
                                {role}
                            </p>

                            <span className="logoutHint">
                                Click to logout
                            </span>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Navbar;