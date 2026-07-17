
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
const ProtectedRoute = ({ children, allowedRole }) => {
    const navigation = useNavigate();


    const AuthToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!AuthToken) {
        return navigation("/", { replace: true })
    }

    try {
        const decode = jwtDecode(AuthToken);
        console.log(decode);
        if (decode.exp * 1000 < Date.now()) {
            localStorage.clear()
            return navigation("/", { replace: true })
        }
    } catch (e) {
        console.log(e)
        localStorage.clear();
        return navigation("/", { replace: true })
    }

    // Wrong Role
    if (!role && role !== allowedRole) {
        return navigation("/", { replace: true })
    }


    return (
        children
    )
}

export default ProtectedRoute