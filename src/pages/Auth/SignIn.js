import { useAuth } from "contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";

// @mui icons

//  components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";

import SimpleFooter from "examples/Footers/SimpleFooter";


// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function MySignIn() {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            Swal.fire({
                icon: 'error',
                title: 'Already logged in',
                text: 'You are already logged in.',
            });
        }
    }, []);

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    const handleSignIn = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            Swal.fire({
                icon: 'error',
                title: 'Already logged in',
                text: 'You are already logged in.',
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:8090/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                login(data.data); // Cập nhật trạng thái đăng nhập

                Swal.fire("Success", "Login successful", "success").then(() => {
                    // navigate("/auth/profile");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred during the login process.',
            });
            console.error("Error:", error);
        }
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
                                    Sign in
                                </MKTypography>
                                <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>

                                </Grid>
                            </MKBox>
                            <MKBox pt={4} pb={3} px={3}>
                                <MKBox component="form" role="form">
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
                                    <MKBox display="flex" alignItems="center" ml={-1}>
                                        <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                                        <MKTypography
                                            variant="button"
                                            fontWeight="regular"
                                            color="text"
                                            onClick={handleSetRememberMe}
                                            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                                        >
                                            &nbsp;&nbsp;Remember me
                                        </MKTypography>
                                    </MKBox>
                                    <MKBox mt={4} mb={1}>
                                        <MKButton variant="gradient" color="info" fullWidth onClick={handleSignIn}>
                                            sign in
                                        </MKButton>
                                    </MKBox>
                                    <MKBox mt={3} mb={1} textAlign="center">
                                        <MKTypography variant="button" color="text">
                                            Don&apos;t have an account?{" "}
                                            <MKTypography
                                                component={Link}
                                                to="/auth/sign-up"
                                                variant="button"
                                                color="info"
                                                fontWeight="medium"
                                                textGradient
                                            >
                                                Sign up here
                                            </MKTypography>
                                        </MKTypography>
                                    </MKBox>
                                </MKBox>
                            </MKBox>
                        </Card>
                    </Grid>
                </Grid>
            </MKBox>
            <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
                <SimpleFooter light />
            </MKBox>
        </>
    );
}

export default MySignIn;
