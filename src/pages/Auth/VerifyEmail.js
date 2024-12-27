import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";

import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { API_ENDPOINT } from "configs/AppConfig";

function VerifyEmail() {
    const [otp, setOtp] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { email: initialEmail, userId, isUpdatingEmail: initialIsUpdatingEmail, fromLogin } = location.state || {};
    const [email, setEmail] = useState(initialEmail);

    useEffect(() => {
        if (initialIsUpdatingEmail) {
            setIsUpdatingEmail(true);
        }

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/api/auth/is-verified?email=${email}`);
                const data = await response.json();
                if (data.status == 200 && data.data.verified) {
                    Swal.fire("Success", "Email verified successfully", "success").then(() => {
                        sessionStorage.removeItem("registrationInProgress");
                        navigate("/auth/sign-in");
                    });
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [email, navigate, initialIsUpdatingEmail, fromLogin]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateOtp = (otp) => {
        const re = /^\d{6}$/;
        return re.test(String(otp));
    };

    const handleVerify = async () => {
        if (!validateOtp(otp)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid OTP',
                text: 'OTP must be a 6-digit number.',
            });
            return;
        }

        setIsLoading(true);
        Swal.fire({
            title: 'Verifying...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const response = await fetch(`${API_ENDPOINT}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire("Success", "Email verified successfully", "success").then(() => {
                    sessionStorage.removeItem("registrationInProgress");
                    navigate("/auth/sign-in");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Verification failed',
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during the verification process.',
            });
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setIsLoading(true);
        Swal.fire({
            title: 'Resending OTP...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const response = await fetch(`${API_ENDPOINT}/api/auth/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire("Success", "OTP sent successfully. Please check your email.", "success");
                setResendCooldown(30);
                const cooldownInterval = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(cooldownInterval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Resend failed',
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during the resend process.',
            });
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!validateEmail(newEmail)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        setIsLoading(true);
        Swal.fire({
            title: 'Updating Email...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            const response = await fetch(`${API_ENDPOINT}/api/auth/update-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, email: newEmail, verified: false }),
            });
            const data = await response.json();

            if (response.ok) {
                Swal.fire("Success", "Email updated and OTP sent successfully. Please check your email.", "success").then(() => {
                    setEmail(newEmail);
                    setIsUpdatingEmail(false);
                    setResendCooldown(30);
                    const cooldownInterval = setInterval(() => {
                        setResendCooldown((prev) => {
                            if (prev <= 1) {
                                clearInterval(cooldownInterval);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update failed',
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during the update process.',
            });
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRegistration = () => {
        Swal.fire({
            title: 'Cancel Registration',
            text: 'Are you sure you want to cancel your registration?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("registrationInProgress");
                navigate("/auth/sign-up");
            }
        });
    };

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
                                    Verify Email
                                </MKTypography>
                                {!isUpdatingEmail && (
                                    <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                                        <MKTypography variant="body2" color="white">
                                            An OTP has been sent to: <br />{email}
                                        </MKTypography>
                                    </Grid>
                                )}
                            </MKBox>
                            <MKBox pt={4} pb={3} px={3}>
                                <MKBox component="form" role="form">
                                    {!isUpdatingEmail && (
                                        <>
                                            <MKBox mb={2}>
                                                <MKInput
                                                    type="text"
                                                    label="OTP"
                                                    fullWidth
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </MKBox>
                                            <MKBox mt={2} mb={1}>
                                                <MKButton variant="gradient" color="info" fullWidth onClick={handleVerify} disabled={isLoading}>
                                                    Verify
                                                </MKButton>
                                            </MKBox>
                                            <MKBox mt={2} mb={1}>
                                                <MKButton variant="gradient" color="info" fullWidth onClick={handleResendOtp} disabled={resendCooldown > 0 || isLoading}>
                                                    {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
                                                </MKButton>
                                            </MKBox>
                                        </>
                                    )}
                                    {isUpdatingEmail && (
                                        <>
                                            <MKBox mb={2}>
                                                <MKInput
                                                    type="email"
                                                    label="New Email"
                                                    fullWidth
                                                    value={newEmail || email}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </MKBox>
                                            <MKBox mt={2} mb={1}>
                                                <MKButton variant="gradient" color="info" fullWidth onClick={handleUpdateEmail} disabled={isLoading}>
                                                    Update Email
                                                </MKButton>
                                            </MKBox>
                                        </>
                                    )}
                                    <MKBox mt={2} mb={1}>
                                        <MKButton variant="gradient" color="info" fullWidth onClick={() => setIsUpdatingEmail(!isUpdatingEmail)} disabled={isLoading}>
                                            {isUpdatingEmail ? "Back to OTP Verification" : "Update Email"}
                                        </MKButton>
                                    </MKBox>
                                    <MKBox mt={2} mb={1}>
                                        <MKButton variant="gradient" color="error" fullWidth onClick={handleCancelRegistration} disabled={isLoading}>
                                            Cancel Registration
                                        </MKButton>
                                    </MKBox>
                                </MKBox>
                                <MKBox mt={2} mb={1} textAlign="center">
                                    <MKTypography variant="body2" color="text">
                                        Your help ID: <u>{userId}</u>
                                    </MKTypography>
                                </MKBox>
                            </MKBox>
                        </Card>
                    </Grid>
                </Grid>
            </MKBox>
        </>
    );
}

export default VerifyEmail;
