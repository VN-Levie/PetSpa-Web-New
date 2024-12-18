// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// @mui icons

//  components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";

import SimpleFooter from "examples/Footers/SimpleFooter";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { bool } from "prop-types";

function MySignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        var falg = false;
        if (falg) {
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
            return re.test(password);
        } else {
            return true;
        }
    };

    const handleSignUp = async () => {
        Swal.showLoading();

        // Disable all buttons
        document.querySelectorAll("button").forEach(button => button.disabled = true);

        if (!validateEmail(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
            });
            document.querySelectorAll("button").forEach(button => button.disabled = false);
            return;
        }

        if (!validatePassword(password)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: 'Password must contain at least 6 characters, including uppercase, lowercase letters, and numbers.',
            });
            document.querySelectorAll("button").forEach(button => button.disabled = false);
            return;
        }

        if (password !== rePassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password mismatch',
                text: 'Passwords do not match.',
            });
            document.querySelectorAll("button").forEach(button => button.disabled = false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8090/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();

            if (response.status === 201) {
                const userId = data.data.userId; // Assuming the response contains userId
                sessionStorage.setItem("registrationInProgress", JSON.stringify({ email, userId }));
                Swal.fire("Success", "Registration successful. Please check your email.", "success").then(() => {
                    navigate("/auth/verify-email", { state: { email, userId } });
                });
            } else if (response.status === 200) {
                const userId = data.data.userId; // Assuming the response contains userId
                Swal.fire({
                    title: 'Email Not Verified',
                    text: 'This email is already registered but not verified. Would you like to continue the registration process?',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Continue Registration',
                    cancelButtonText: 'Change Registration Info',
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem("registrationInProgress", JSON.stringify({ email, userId }));
                        navigate("/auth/verify-email", { state: { email, userId } });
                    } else {
                        sessionStorage.removeItem("registrationInProgress");
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration failed',
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during the registration process.',
            });
            console.error("Error:", error);
        } finally {
            // Swal.close();
            document.querySelectorAll("button").forEach(button => button.disabled = false);
        }
    };

    useEffect(() => {
        const registrationInProgress = sessionStorage.getItem("registrationInProgress");
        if (registrationInProgress) {
            Swal.fire({
                title: 'Email Verification Required',
                text: 'You need to verify your email. Would you like to go to the verification page?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Go to Verification',
                cancelButtonText: 'Cancel Registration',
                showDenyButton: true,
                denyButtonText: 'Change Email',
            }).then((result) => {
                if (result.isConfirmed) {
                    const { email, userId } = JSON.parse(registrationInProgress);
                    navigate("/auth/verify-email", { state: { email, userId } });
                } else if (result.isDenied) {
                    const { email, userId } = JSON.parse(registrationInProgress);
                    navigate("/auth/verify-email", { state: { email, userId, isUpdatingEmail: true } });
                } else {
                    sessionStorage.removeItem("registrationInProgress");
                }
            });
        }
    }, [navigate]);

    return (
        <>
            <MKBox
                position="absolute"
                top={0}
                left={0}
                zIndex={1}
                width="100%"
                minHeight="100vh"
                sx={{
                    backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                        `${linearGradient(
                            rgba(gradients.dark.main, 0.6),
                            rgba(gradients.dark.state, 0.6)
                        )}, url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
                <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                    <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                        <Card>
                            <MKBox
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                mx={2}
                                mt={-3}
                                p={2}
                                mb={1}
                                textAlign="center"
                            >
                                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                                    Sign up
                                </MKTypography>
                                <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>

                                </Grid>
                            </MKBox>
                            <MKBox pt={4} pb={3} px={3}>
                                <MKBox component="form" role="form">
                                    <MKBox mb={2}>
                                        <MKInput
                                            type="text"
                                            label="Name"
                                            fullWidth
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </MKBox>
                                    <MKBox mb={2}>
                                        <MKInput
                                            type="email"
                                            label="Email"
                                            fullWidth
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </MKBox>
                                    <MKBox mb={2}>
                                        <MKInput
                                            type="password"
                                            label="Password"
                                            fullWidth
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </MKBox>
                                    <MKBox mb={2}>
                                        <MKInput
                                            type="password"
                                            label="Re-enter Password"
                                            fullWidth
                                            value={rePassword}
                                            onChange={(e) => setRePassword(e.target.value)}
                                        />
                                    </MKBox>
                                    <MKBox mt={4} mb={1}>
                                        <MKButton variant="gradient" color="info" fullWidth onClick={handleSignUp}>
                                            sign up
                                        </MKButton>
                                    </MKBox>
                                    <MKBox mt={3} mb={1} textAlign="center">
                                        <MKTypography variant="button" color="text">
                                            Already have an account?{" "}
                                            <MKTypography
                                                component={Link}
                                                to="/auth/sign-in"
                                                variant="button"
                                                color="info"
                                                fontWeight="medium"
                                                textGradient
                                            >
                                                Sign in here
                                            </MKTypography>
                                        </MKTypography>
                                    </MKBox>
                                </MKBox>
                            </MKBox>
                        </Card>
                    </Grid>
                </Grid>
            </MKBox>
        </>
    );
}

export default MySignUp;
