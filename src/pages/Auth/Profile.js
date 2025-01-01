// @mui material components
import Card from "@mui/material/Card";

//  components
import MKBox from "components/MKBox";

// Author page sections
import ProfileSection from "pages/LandingPages/Author/sections/Profile";
import Posts from "pages/LandingPages/Author/sections/Posts";
import Contact from "pages/LandingPages/Author/sections/Contact";
import Footer from "pages/LandingPages/Author/sections/Footer";
import { useAuth } from "contexts/AuthContext";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// Images
import bgImage from "assets/images/city-profile.jpg";
import { API_ENDPOINT } from "configs/AppConfig";

// 
function Author() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth/sign-in");
        } else if (user) {
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`${API_ENDPOINT}/api/auth/profile`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    if (response.data.status === 200) {
                        setProfile(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            };
            fetchProfile();
        }
    }, [user, loading, navigate]);

    if (loading || !profile) {
        return <div>Loading...</div>; // Hoặc thêm spinner
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
                    <ProfileSection user={profile} />
                    <Posts />
                </Card>
                <Contact />
                <Footer />
            </MKBox>
        </>
    );
}

export default Author;
