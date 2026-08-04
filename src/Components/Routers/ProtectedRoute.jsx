
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children, allowedRole }) => {



    const AuthToken = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!AuthToken) {
        return <Navigate to={"/"} replace />
    }

    try {
        const decode = jwtDecode(AuthToken);

        // eslint-disable-next-line react-hooks/purity
        if (decode.exp * 1000 < Date.now()) {
            localStorage.clear();
            // eslint-disable-next-line react-hooks/error-boundaries
            return <Navigate to={"/"} replace />
        }
    } catch (e) {
        console.log(e)
        localStorage.clear();
        return <Navigate to={"/"} replace />
    }

    // Wrong Role
    if (!role || !allowedRole.includes(role)) {
        return <Navigate to={"/"} replace />
    }


    return (
        children
    )
}

export default ProtectedRoute