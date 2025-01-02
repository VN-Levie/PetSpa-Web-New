import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import MKBox from "components/MKBox";
import Card from "@mui/material/Card";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import Contact from "pages/LandingPages/Author/sections/Contact";
import Footer from "pages/LandingPages/Author/sections/Footer";
import { Container, Grid, CircularProgress, Typography, Select, MenuItem } from "@mui/material";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { get } from 'services/apiService';
import { useAuth } from "contexts/AuthContext";
import { useBooking } from "contexts/BookingContext";
import MKAlert from "components/MKAlert";
import Swal from "sweetalert2";
function ServiceDetail() {
    const { user, loading } = useAuth();
    const { catId, serviceId } = useParams();
    const { bookingData, updatePetDetails, addServiceToCart, removeServiceFromCart, clearAllServices } = useBooking();
    const [serviceData, setServiceData] = useState(null);
    const [meLoading, setMeLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);
    const navigate = useNavigate();

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
                setMeLoading(false);
            }
        };

        const fetchPets = async () => {
            try {
                const response = await get('/api/user-pet/list', {}, true);
                if (response.data.status === 200) {
                    setPets(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        fetchData();
        if (user) {
            fetchPets();
        }
    }, [serviceId, user]);

    const handlePetSelection = (event) => {
        const selectedPet = pets.find(pet => pet.id === event.target.value);
        updatePetDetails({ id: selectedPet.id, name: selectedPet.name });
    };

    const handleChangePet = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are changing the pet for all selected services. If you want to book for another pet, please complete the current process first.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Change Pet',
            cancelButtonText: 'Keep Current Pet',
        }).then((result) => {
            if (result.isConfirmed) {
                updatePetDetails({});
            }
        });
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        if (!bookingData.petDetails.id) {
            // Swal.fire("Please select a pet before adding a service to the cart.");
            Swal.fire({
                icon: 'error',
                title: 'No Pet Selected',
                text: 'Please select a pet before adding a service to the cart.',
            });
            return;
        }
        const note = event.target.note.value || null;
        const existingService = bookingData.selectedServices.find(service => service.serviceId === serviceId);
        if (existingService) {
            // Swal.fire("Service already added to the cart.");
            Swal.fire({
                icon: 'error',
                title: 'Service Already Added',
                text: 'Service already added to the cart.',
            });
        } else {
            addServiceToCart(serviceId, serviceData.name, serviceData.price, note);
        }
    };

    const handleRemoveService = (serviceId) => {
        removeServiceFromCart(serviceId);
    };

    const handleClearAll = () => {
        clearAllServices();
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const isServiceInCart = bookingData.selectedServices.some(service => service.serviceId === serviceId);

    if (meLoading) {
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
                                            <Grid container alignItems="center" py={1}>
                                                <Grid item xs={12} sm={8} lineHeight={1}>
                                                    <MKTypography variant="button" color="success" fontWeight="bold" textTransform="uppercase">
                                                        Service
                                                    </MKTypography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} lineHeight={1}>
                                                    <MKTypography variant="caption" color="success" fontWeight="bold">
                                                        Price
                                                    </MKTypography>
                                                </Grid>

                                            </Grid>
                                            {bookingData.selectedServices.map((service, index) => (
                                                <Grid container alignItems="center" py={1} key={index}>
                                                    <Grid item xs={12} sm={8} lineHeight={1}>
                                                        <MKTypography variant="button" color="info" textTransform="uppercase">
                                                            {service.name}
                                                        </MKTypography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={3} lineHeight={1}>
                                                        <MKTypography variant="caption" color="info">
                                                            {service.price}
                                                        </MKTypography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={1} lineHeight={1}>
                                                        <MKButton variant="text" color="error" onClick={() => handleRemoveService(service.serviceId)}>
                                                            X
                                                        </MKButton>
                                                    </Grid>
                                                </Grid>
                                            ))}
                                            {bookingData.selectedServices.length > 0 && (
                                                <Grid container item justifyContent="center" xs={12} my={2} spacing={2}>
                                                    <Grid item xs={6}>
                                                        <MKButton type="submit" variant="gradient" color="error" fullWidth onClick={handleClearAll}>
                                                            Clear All
                                                        </MKButton>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <MKButton type="submit" variant="gradient" color="success" fullWidth onClick={handleCheckout}>
                                                            Checkout
                                                        </MKButton>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        </MKBox>
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={7}>
                                    {user ? (
                                        pets.length > 0 ? (
                                            <MKBox component="form" p={2} method="post" onSubmit={handleAddToCart}>
                                                <MKBox px={3} py={{ xs: 2, sm: 6 }}>
                                                    <MKTypography variant="h2" mb={1}>
                                                        {/* Say Hi! {user?.name} */}
                                                        {serviceData.name}
                                                    </MKTypography>
                                                    <MKTypography variant="body1" color="text" mb={1}>
                                                        Price: ${serviceData.price}
                                                    </MKTypography>
                                                </MKBox>
                                                <MKBox pt={0.5} pb={3} px={3}>
                                                    <Grid container>
                                                        <Grid item xs={12} pr={1} mb={6}>
                                                            <MKTypography variant="body1" color="text" mb={1}>
                                                                Select Pet
                                                            </MKTypography>
                                                            <Select
                                                                variant="standard"
                                                                label="Select Pet"
                                                                fullWidth
                                                                defaultValue={bookingData.petDetails.id || ""}
                                                                displayEmpty
                                                                onChange={handlePetSelection}
                                                                disabled={!!bookingData.petDetails.id}
                                                            >
                                                                <MenuItem disabled value="">
                                                                    <em>Select Pet</em>
                                                                </MenuItem>
                                                                {pets.map((pet) => (
                                                                    <MenuItem key={pet.id} value={pet.id}>
                                                                        {pet.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </Grid>
                                                        <Grid item xs={12} pr={1} mb={6}>
                                                            <MKInput
                                                                variant="standard"
                                                                label="Note"
                                                                placeholder="Enter any notes here"
                                                                InputLabelProps={{ shrink: true }}
                                                                fullWidth
                                                                multiline
                                                                rows={4}
                                                                name="note"
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
                                                        {bookingData.petDetails.id ? (
                                                            <MKButton variant="gradient" color="info" onClick={handleChangePet}>
                                                                Change Pet
                                                            </MKButton>
                                                        ) : (
                                                            <MKButton variant="gradient" color="info">
                                                                Confirm Pet
                                                            </MKButton>
                                                        )}
                                                    </Grid>
                                                    <Grid container item justifyContent="center" xs={12} my={2}>
                                                        <MKButton type="submit" variant="gradient" color="dark" fullWidth disabled={isServiceInCart}>
                                                            Add to service cart
                                                        </MKButton>
                                                    </Grid>
                                                </MKBox>
                                            </MKBox>
                                        ) : (
                                            <MKBox p={2}>
                                                <Grid item xs={12}>
                                                    <MKAlert color="warning">Please add a pet in your profile before using this feature.</MKAlert>
                                                </Grid>
                                            </MKBox>
                                        )
                                    ) : (
                                        <MKBox p={2}>
                                            <Grid item xs={12}>
                                                <MKAlert color="primary">Please log in to use this feature.</MKAlert>
                                            </Grid>
                                        </MKBox>
                                    )}
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
