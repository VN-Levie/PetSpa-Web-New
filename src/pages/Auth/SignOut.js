import { useAuth } from "contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignOut() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    logout();
    // useEffect(() => {
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("refreshToken");
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Signed out',
    //         text: 'You have been signed out successfully.',
    //     }).then(() => {
    //         navigate("/");
    //     });
    // }, [navigate]);
    navigate("/");

    return null;
}

export default SignOut;
