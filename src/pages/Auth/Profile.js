// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";

import MKBox from "components/MKBox";


import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useAuth } from "contexts/AuthContext";

import profilePicture from "assets/images/bruce-mars.jpg";
import bgImage from "assets/images/city-profile.jpg";
import MKAvatar from "components/MKAvatar";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from 'services/apiService';
import PetManager from "./sections/PetManager";

function Author() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [petCount, setPetCount] = useState(0);
    const { register, handleSubmit, reset } = useForm();
    const handlePetCountChange = (newCount) => {
        setPetCount(newCount);
      };

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth/sign-in");
        } else if (user) {
            const fetchProfile = async () => {
                try {
                    const profileResponse = await get('/api/auth/profile', {}, true);
                    if (profileResponse.data.status === 200) {
                        setProfile(profileResponse.data.data);

                        const petCountResponse = await get('/api/user-pet/count', {}, true);
                        if (petCountResponse.data.status === 200) {
                            setPetCount(petCountResponse.data.data);
                        }

                        //fetchPets();
                        // fetchPetTypes();
                    } else {
                        navigate("/auth/sign-out");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchProfile();
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (loading) {
            console.log("Loading...");

            return;
        }
        if (user && !loading) {
            const interval = setInterval(async () => {
                try {
                    const petCountResponse = await get('/api/user-pet/count', {}, true);
                    if (petCountResponse.data.status === 200 && petCountResponse.data.data !== petCount) {
                        setPetCount(petCountResponse.data.data);
                        //fetchPets();
                    }
                } catch (error) {
                    console.error("Error fetching pet count:", error);
                }
            }, 500000);

            return () => clearInterval(interval);
        }
    }, [user, petCount, loading]);


    const useScrollToTop = (dependency) => {
        useEffect(() => {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        }, [dependency]);
    };
    useScrollToTop(user);



    if (loading || !profile) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </div>
        );
    }
    return (
        <>

            <MKBox bgColor="white">
                <MKBox
                    minHeight="25rem"
                    width="100%"
                    sx={{
                        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                            `${linearGradient(
                                rgba(gradients.dark.main, 0.8),
                                rgba(gradients.dark.state, 0.8)
                            )}, url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "grid",
                        placeItems: "center",
                    }}
                />
                <Card
                    sx={{
                        p: 2,
                        mx: { xs: 2, lg: 3 },
                        mt: -8,
                        mb: 4,
                        backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                        backdropFilter: "saturate(200%) blur(30px)",
                        boxShadow: ({ boxShadows: { xxl } }) => xxl,
                    }}
                >
                    {/* <ProfileSection user={profile} /> */}
                    <MKBox component="section" py={{ xs: 6, sm: 12 }}>
                        <Container>
                            <Grid container item xs={12} justifyContent="center" mx="auto">
                                <MKBox mt={{ xs: -16, md: -20 }} textAlign="center">
                                    <MKAvatar src={profilePicture} alt="Burce Mars" size="xxl" shadow="xl" />
                                </MKBox>
                                <Grid container justifyContent="center" py={6}>
                                    <Grid item xs={12} md={7} mx={{ xs: "auto", sm: 6, md: 1 }}>
                                        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <MKTypography variant="h3">
                                                {profile.name ?? "Pet Spa"}

                                            </MKTypography>
                                            <MKButton variant="outlined" color="info" size="small">
                                                Follow
                                            </MKButton>
                                        </MKBox>
                                        <Grid container spacing={3} mb={3}>
                                            <Grid item>
                                                <MKTypography component="span" variant="body2" color="text">
                                                    {profile.email ?? "Email"}
                                                </MKTypography>
                                            </Grid>
                                            <Grid item>
                                                <MKTypography component="span" variant="body2" fontWeight="bold">
                                                    Role: &nbsp;
                                                </MKTypography>
                                                <MKTypography component="span" variant="body2" color="text">
                                                    {profile.role ? (profile.role === "USER" ? "User" : "Admin") : "Role"}
                                                </MKTypography>
                                            </Grid>
                                            <Grid item>
                                                <MKTypography component="span" variant="body2" fontWeight="bold">
                                                    {petCount}&nbsp;
                                                </MKTypography>
                                                <MKTypography component="span" variant="body2" color="text">
                                                    Pet{petCount !== 1 ? "s" : ""}
                                                </MKTypography>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                        <PetManager profile={profile} petCount={petCount} onCountChange={handlePetCountChange} />

                    </MKBox>

                </Card>

            </MKBox>
        </>
    );
}

export default Author;
