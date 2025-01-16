import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import MKBox from "components/MKBox";
import Card from "@mui/material/Card";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import Contact from "pages/LandingPages/Author/sections/Contact";
import Footer from "pages/LandingPages/Author/sections/Footer";
import { Container, Grid, CircularProgress, Typography, Select, MenuItem, Modal, Fade, Backdrop } from "@mui/material";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { get } from 'services/apiService';
import { useAuth } from "contexts/AuthContext";
import { useBooking } from "contexts/BookingContext";
import MKAlert from "components/MKAlert";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function ServiceDetail({ open, onClose, catId, serviceId }) {
    const { user, loading } = useAuth();
    const { bookingData, updatePetDetails, addServiceToCart, removeServiceFromCart, clearAllServices } = useBooking();
    const [serviceData, setServiceData] = useState(null);
    const [meLoading, setMeLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);
    const [isPetSaved, setIsPetSaved] = useState(!!bookingData.petDetails.id);
    const [selectedPetId, setSelectedPetId] = useState(bookingData.petDetails.id || "");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get(`/api/public/spa/services-by-id`, { id: serviceId });
                if (response.data.status === 200) {
                    setServiceData(response.data.data);
                } else {
                    console.error("Failed to fetch data");
                    // setError("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                // setError("Failed to fetch data");
            }
        };

        const fetchPets = async () => {
            try {
                // giả lập đội 2s
                // await new Promise(resolve => setTimeout(resolve, 300));

                const response = await get('/api/user-pet/list', {}, true);
                if (response.data.status === 200) {
                    setPets(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setMeLoading(false);
            }
        };
        // setMeLoading(true);
        fetchData();
        if (user) {
            fetchPets();
        }
        // setMeLoading(false);
    }, [serviceId, user]);

    useEffect(() => {
        setSelectedPetId(bookingData.petDetails.id || "");
    }, [bookingData.petDetails.id]);

    const handlePetSelection = (event) => {
        const selectedPet = pets.find(pet => pet.id === event.target.value);
        updatePetDetails({ id: selectedPet.id, name: selectedPet.name });
        setSelectedPetId(selectedPet.id);
    };

    const handleSavePet = () => {
        if (!selectedPetId) {
            Swal.fire({
                icon: 'error',
                title: 'No Pet Selected',
                text: 'Please select a pet before saving.',
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Pet Saved',
            text: 'Pet details have been saved successfully.',
        }).then(() => {
            setIsPetSaved(true);
        });
    };

    const handleChangePet = () => {
        updatePetDetails({});
        setIsPetSaved(false);
        setSelectedPetId("");
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        if (!bookingData.petDetails.id) {
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

    const calculateTotalPrice = () => {
        return bookingData.selectedServices.reduce((total, service) => total + service.price, 0);
    };

    if (meLoading) {
        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="service-detail-modal"
                aria-describedby="service-detail-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <CircularProgress />
                    </Container>
                </Fade>
            </Modal>
        );
    }

    if (error && !meLoading) {
        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="service-detail-modal"
                aria-describedby="service-detail-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <Typography variant="h4" color="error">
                            {error}
                        </Typography>
                        <Typography variant="body1">Please refresh the page or try again later.</Typography>
                    </Container>
                </Fade>
            </Modal>
        );
    }

    if (!serviceData && !meLoading) {
        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="service-detail-modal"
                aria-describedby="service-detail-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <Typography variant="h4">No Service Data Found: </Typography>
                        <hr />
                        <Typography variant="body1">The requested service is not available or has been removed.</Typography>
                    </Container>
                </Fade>
            </Modal>
        );
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="service-detail-modal"
            aria-describedby="service-detail-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            sx={{
                zIndex: 500,
            }}
        >
            <Fade in={open}>
                <MKBox
                    bgColor="transparent"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: {
                            xs: '95%',  // Màn hình nhỏ
                            xl: '75%',  // Màn hình lớn (bắt đầu từ md trở lên)
                        },
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        zIndex: 500,
                    }}
                    inert={!open ? "true" : undefined}
                >
                <Card
                    sx={{
                        p: 0,


                        backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                        backdropFilter: "saturate(200%) blur(30px)",
                        boxShadow: ({ boxShadows: { xxl } }) => xxl,
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'fixed',
                            right: 16,
                            top: 16,
                            color: (theme) => theme.palette.grey[500],
                            zIndex: 1000,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Grid item>
                        <MKBox
                            width="100%"
                            bgColor="white"
                            borderRadius="xl"
                            shadow="xl"
                            sx={{ overflow: "hidden" }}
                        >
                            <Grid container>
                                <Grid item
                                    order={{ xs: 2, lg: 1 }}
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

                                    <MKBox pl={3} py={3} my="auto" pr={3}>
                                        <MKTypography variant="h3" color="white" mt={3} mb={1} textAlign="center">
                                            Your Cart
                                        </MKTypography>

                                        <Grid container py={0}>
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
                                                    <MKTypography variant="button" color="light" textTransform="uppercase">
                                                        {service.name}
                                                    </MKTypography>
                                                </Grid>
                                                <Grid item xs={12} sm={3} lineHeight={1}>
                                                    <MKTypography variant="caption" color="light">
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
                                            <Grid container alignItems="center" py={1}>
                                                <Grid item xs={12} sm={8} lineHeight={1}>
                                                    <MKTypography variant="button" color="success" fontWeight="bold" textTransform="uppercase">
                                                        Total
                                                    </MKTypography>
                                                </Grid>
                                                <Grid item xs={12} sm={4} lineHeight={1}>
                                                    <MKTypography variant="caption" color="success" fontWeight="bold">
                                                        ${calculateTotalPrice()}
                                                    </MKTypography>
                                                </Grid>
                                            </Grid>
                                        )}
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

                                </Grid>
                                <Grid item xs={12} lg={7} order={{ xs: 1, lg: 2 }}>
                                    {user ? (
                                        pets.length > 0 ? (
                                            <MKBox component="form" p={2} method="post" onSubmit={handleAddToCart}>
                                                <MKBox px={3} py={{ xs: 2, sm: 6 }}>
                                                    <MKTypography variant="h2" mb={1}>
                                                        {/* Say Hi! {user?.name} */}
                                                        {serviceData.name}
                                                    </MKTypography>
                                                    <MKTypography variant="body1" color="text" mb={1}>
                                                        Description: {serviceData.description}
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
                                                                value={selectedPetId}
                                                                displayEmpty
                                                                onChange={handlePetSelection}
                                                                disabled={isPetSaved}
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
                                                        {isPetSaved ? (
                                                            <MKButton variant="gradient" color="info" onClick={handleChangePet}>
                                                                Change Pet
                                                            </MKButton>
                                                        ) : (
                                                            <MKButton variant="gradient" color="info" onClick={handleSavePet}>
                                                                Save Pet
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
        </Fade>
        </Modal >
    );
}

export default ServiceDetail;
