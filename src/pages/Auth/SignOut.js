import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SignOut() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        Swal.fire({
            icon: 'success',
            title: 'Signed out',
            text: 'You have been signed out successfully.',
        }).then(() => {
            navigate("/auth/sign-in");
        });
    }, [navigate]);

    return null;
}

export default SignOut;
