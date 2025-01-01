// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";

import MKBox from "components/MKBox";


import Container from "@mui/material/Container";
import Posts from "pages/LandingPages/Author/sections/Posts";
import Contact from "pages/LandingPages/Author/sections/Contact";
import Footer from "pages/LandingPages/Author/sections/Footer";
import { useAuth } from "contexts/AuthContext";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MKAvatar from "components/MKAvatar";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import team1 from "assets/images/team-5.jpg";
import team2 from "assets/images/bruce-mars.jpg";
import team3 from "assets/images/ivana-squares.jpg";
import team4 from "assets/images/ivana-square.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import bgImage from "assets/images/city-profile.jpg";
import { API_ENDPOINT } from "configs/AppConfig";
import profilePicture from "assets/images/bruce-mars.jpg";
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";

// 
function Author() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [petCount, setPetCount] = useState(0);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth/sign-in");
        } else if (user) {
            const fetchProfile = async () => {
                try {
                    const profileResponse = await axios.get(`${API_ENDPOINT}/api/auth/profile`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    if (profileResponse.data.status === 200) {
                        setProfile(profileResponse.data.data);
                    } else {
                        navigate("/auth/sign-out");
                    }

                    const petCountResponse = await axios.get(`${API_ENDPOINT}/api/user-pet/count`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (petCountResponse.data.status === 200) {
                        setPetCount(petCountResponse.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    // navigate("/auth/sign-out");
                }
            };
            fetchProfile();
        }
    }, [user, loading, navigate]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file[0]);
        formData.append("petDTO", JSON.stringify({
            name: data.name,
            description: data.description,
            height: data.height,
            weight: data.weight,
            petTypeId: data.petTypeId,
            userId: profile.id,
            avatarUrl: "",
        }));

        try {
            const response = await axios.post(`${API_ENDPOINT}/api/user-pet/add`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status === 200) {
                alert("Pet added successfully");
                reset();
            }
        } catch (error) {
            console.error("Error adding pet:", error);
        }
    };

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
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <TextField
                                                {...register("name")}
                                                label="Pet Name"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                            <TextField
                                                {...register("description")}
                                                label="Description"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                            <TextField
                                                {...register("height")}
                                                label="Height"
                                                type="number"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                            <TextField
                                                {...register("weight")}
                                                label="Weight"
                                                type="number"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                            <TextField
                                                {...register("petTypeId")}
                                                label="Pet Type ID"
                                                type="number"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                            <input
                                                {...register("file")}
                                                type="file"
                                                accept="image/*"
                                                required
                                            />
                                            <MKButton type="submit" variant="contained" color="primary">
                                                Add Pet
                                            </MKButton>
                                        </form>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                        <Container>
                            <Grid container>
                                <Grid item xs={12} md={8} sx={{ mb: 6 }}>
                                    <MKTypography variant="h3" color="white">
                                        The Executive Team
                                    </MKTypography>
                                    <MKTypography variant="body2" color="white" opacity={0.8}>
                                        There&apos;s nothing I really wanted to do in life that I wasn&apos;t able to get good
                                        at. That&apos;s my skill.
                                    </MKTypography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={1}>
                                        <HorizontalTeamCard
                                            image={team1}
                                            name="Emma Roberts"
                                            position={{ color: "info", label: "UI Designer" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={1}>
                                        <HorizontalTeamCard
                                            image={team2}
                                            name="William Pearce"
                                            position={{ color: "info", label: "Boss" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={{ xs: 1, lg: 0 }}>
                                        <HorizontalTeamCard
                                            image={team3}
                                            name="Ivana Flow"
                                            position={{ color: "info", label: "Athlete" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={{ xs: 1, lg: 0 }}>
                                        <HorizontalTeamCard
                                            image={team4}
                                            name="Marquez Garcia"
                                            position={{ color: "info", label: "JS Developer" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                            </Grid>
                        </Container>
                    </MKBox>
                    <Posts />
                </Card>
                <Contact />
                <Footer />
            </MKBox>
        </>
    );
}

export default Author;
