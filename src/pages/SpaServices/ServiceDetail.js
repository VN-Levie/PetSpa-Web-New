import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import MKBox from "components/MKBox";
import Card from "@mui/material/Card";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import Contact from "pages/LandingPages/Author/sections/Contact";
import Footer from "pages/LandingPages/Author/sections/Footer";
import { Container, Grid, CircularProgress, Typography } from "@mui/material";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { get } from 'services/apiService';

function ServiceDetail() {
    const { catId, serviceId } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(`/api/public/spa/services-by-id`, { id: serviceId });
                if (response.data.status === 200) {
                    setServiceData(response.data.data);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [serviceId]);

    if (loading) {
        return (
            <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h4" color="error">
                    {error}
                </Typography>
                <Typography variant="body1">Please refresh the page or try again later.</Typography>
            </Container>
        );
    }

    if (!serviceData) {
        return (
            <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h4">No Service Data Found: </Typography>
                <hr />
                <Typography variant="body1">The requested service is not available or has been removed.</Typography>
            </Container>
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
                            )}, url(${serviceData.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "grid",
                        placeItems: "center",
                    }}
                />
                <Card
                    sx={{
                        p: 1,
                        mx: { xs: 2, lg: 3 },
                        mt: -8,
                        mb: 4,
                        backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                        backdropFilter: "saturate(200%) blur(30px)",
                        boxShadow: ({ boxShadows: { xxl } }) => xxl,
                    }}
                >


                    <Grid item>
                        <MKBox
                            width="100%"
                            bgColor="white"
                            borderRadius="xl"
                            shadow="xl"

                            sx={{ overflow: "hidden" }}
                        >
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    xs={12}
                                    lg={5}
                                    position="relative"
                                    px={0}
                                    sx={{
                                        backgroundImage: ({
                                            palette: { gradients },
                                            functions: { rgba, linearGradient },
                                        }) =>
                                            `${linearGradient(
                                                rgba(gradients.dark.main, 0.8),
                                                rgba(gradients.dark.state, 0.8)
                                            )}, url(${serviceData.imageUrl})`,
                                        backgroundSize: "cover",
                                    }}
                                >
                                    <MKBox
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        width="100%"
                                        height="100%"
                                    >
                                        <MKBox py={6} pr={6} pl={{ xs: 6, sm: 12 }} my="auto">
                                            <MKTypography variant="h3" color="white" mb={1}>
                                                {serviceData.name}
                                            </MKTypography>
                                            <MKTypography variant="body2" color="white" opacity={0.8} mb={3}>
                                                {serviceData.description}
                                            </MKTypography>
                                            <MKBox display="flex" p={1}>
                                                <MKTypography variant="button" color="white">
                                                    <i className="fas fa-phone" />
                                                </MKTypography>
                                                <MKTypography
                                                    component="span"
                                                    variant="button"
                                                    color="white"
                                                    opacity={0.8}
                                                    ml={2}
                                                    fontWeight="regular"
                                                >
                                                    (+40) 772 100 200
                                                </MKTypography>
                                            </MKBox>
                                            <MKBox display="flex" color="white" p={1}>
                                                <MKTypography variant="button" color="white">
                                                    <i className="fas fa-envelope" />
                                                </MKTypography>
                                                <MKTypography
                                                    component="span"
                                                    variant="button"
                                                    color="white"
                                                    opacity={0.8}
                                                    ml={2}
                                                    fontWeight="regular"
                                                >
                                                    hello@creative-tim.com
                                                </MKTypography>
                                            </MKBox>
                                            <MKBox display="flex" color="white" p={1}>
                                                <MKTypography variant="button" color="white">
                                                    <i className="fas fa-map-marker-alt" />
                                                </MKTypography>
                                                <MKTypography
                                                    component="span"
                                                    variant="button"
                                                    color="white"
                                                    opacity={0.8}
                                                    ml={2}
                                                    fontWeight="regular"
                                                >
                                                    Dyonisie Wolf Bucharest, RO 010458
                                                </MKTypography>
                                            </MKBox>
                                            <MKBox mt={3}>
                                                <MKButton variant="text" color="white" size="large" iconOnly>
                                                    <i className="fab fa-facebook" style={{ fontSize: "1.25rem" }} />
                                                </MKButton>
                                                <MKButton variant="text" color="white" size="large" iconOnly>
                                                    <i className="fab fa-twitter" style={{ fontSize: "1.25rem" }} />
                                                </MKButton>
                                                <MKButton variant="text" color="white" size="large" iconOnly>
                                                    <i className="fab fa-dribbble" style={{ fontSize: "1.25rem" }} />
                                                </MKButton>
                                                <MKButton variant="text" color="white" size="large" iconOnly>
                                                    <i className="fab fa-instagram" style={{ fontSize: "1.25rem" }} />
                                                </MKButton>
                                            </MKBox>
                                        </MKBox>
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={7}>
                                    <MKBox component="form" p={2} method="post">
                                        <MKBox px={3} py={{ xs: 2, sm: 6 }}>
                                            <MKTypography variant="h2" mb={1}>
                                                Say Hi!
                                            </MKTypography>
                                            <MKTypography variant="body1" color="text" mb={2}>
                                                We&apos;d like to talk with you.
                                            </MKTypography>
                                        </MKBox>
                                        <MKBox pt={0.5} pb={3} px={3}>
                                            <Grid container>
                                                <Grid item xs={12} pr={1} mb={6}>
                                                    <MKInput
                                                        variant="standard"
                                                        label="My name is"
                                                        placeholder="Full Name"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} pr={1} mb={6}>
                                                    <MKInput
                                                        variant="standard"
                                                        label="I'm looking for"
                                                        placeholder="What you love"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} pr={1} mb={6}>
                                                    <MKInput
                                                        variant="standard"
                                                        label="Your message"
                                                        placeholder="I want to say that..."
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        multiline
                                                        rows={6}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                item
                                                xs={12}
                                                md={6}
                                                justifyContent="flex-end"
                                                textAlign="right"
                                                ml="auto"
                                            >
                                                <MKButton variant="gradient" color="info">
                                                    Send Message
                                                </MKButton>
                                            </Grid>
                                        </MKBox>
                                    </MKBox>
                                </Grid>
                            </Grid>
                        </MKBox>
                    </Grid>

                </Card>
            </MKBox>
        </>
    );
}

export default ServiceDetail;
