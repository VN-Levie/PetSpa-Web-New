import React, { useEffect, useState, Suspense, lazy } from "react";
// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";

import MKBox from "components/MKBox";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    TextField,
    Paper,
    Pagination,
    CardContent,
    AppBar,
    Tabs,
    Tab,
} from "@mui/material";


import Grid from "@mui/material/Grid";
import { useAuth } from "contexts/AuthContext";

import profilePicture from "assets/images/bruce-mars.jpg";
import bgImage from "assets/images/city-profile.jpg";
import MKAvatar from "components/MKAvatar";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { useNavigate } from "react-router-dom";
import { get } from 'services/apiService';
const SpaManagement = lazy(() => import("./sections/SpaManagement"));
const ShopManagement = lazy(() => import("./sections/ShopManagement"));
const HotelManagement = lazy(() => import("./sections/HotelManagement"));
const PetTagManagement = lazy(() => import("./sections/PetTagManagement"));
const FeedbackManagement = lazy(() => import("./sections/FeedbackManagement"));
const UserManagement = lazy(() => import("./sections/UserManagement"));
const AppSettingsManagement = lazy(() => import("./sections/AppSettingsManagement"));

function Dashboard() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [petCount, setPetCount] = useState(0);


    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const [shopCategories, setShopCategories] = useState([]);
    const [shopProducts, setShopProducts] = useState([]);
    const [shopPage, setShopPage] = useState(0);
    const [shopTotalPages, setShopTotalPages] = useState(0);
    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem('activeTab');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabType = (event, newValue) => {
        setActiveTab(newValue);
        localStorage.setItem('activeTab', newValue);
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
                    minHeight="18rem"
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
                        mx: { xs: 1, lg: 2 },
                        mt: -8,
                        mb: 4,
                        backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                        backdropFilter: "saturate(200%) blur(30px)",
                        boxShadow: ({ boxShadows: { xxl } }) => xxl,
                    }}
                >

                    <Container>
                        <Grid container spacing={1} >
                            <Grid item xs={12} lg={2} mt={1} >
                                <AppBar position="static">
                                    <Tabs
                                        orientation="vertical"
                                        value={activeTab}
                                        onChange={handleTabType}

                                    >
                                        <Tab label="Spa" /> {/* 0 */}
                                        <Tab label="Shop" /> {/* 1 */}
                                        <Tab label="Hotel" /> {/* 2 */}
                                        {/* <Tab label="Pet Tag" /> */} {/* 3 */}
                                        {/* <Tab label="Feedback" /> */} {/* 4 */}
                                        <Tab label="Users" /> {/* 5 -> 3 */}
                                        <Tab label="Order" /> {/* 6 -> 4 */}
                                        <Tab label="App Settings" /> {/* 7 -> 5 */}
                                    </Tabs>
                                </AppBar>
                            </Grid>
                            <Grid item xs={12} lg={9}>
                                <Card
                                    sx={{
                                        p: 2,
                                        mx: { xs: 1, lg: 2 },
                                        mt: 1,
                                        mb: 4,
                                        backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                                        backdropFilter: "saturate(200%) blur(30px)",
                                        boxShadow: ({ boxShadows: { xxl } }) => xxl,
                                    }}
                                >
                                    <Suspense fallback={<CircularProgress />}>
                                        {activeTab === 0 && <SpaManagement />}
                                        {activeTab === 1 && <ShopManagement />}
                                        {activeTab === 2 && <HotelManagement />}
                                        {/* {activeTab === 3 && <PetTagManagement />} */}
                                        {/* {activeTab === 4 && <FeedbackManagement />} */}
                                        {activeTab === 3 && <UserManagement />}
                                        {/* {activeTab === 4 && <UserManagement />} */}
                                        {activeTab === 5 && <AppSettingsManagement />}
                                    </Suspense>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>

                </Card>
            </MKBox>

        </>
    );
}

export default Dashboard;
