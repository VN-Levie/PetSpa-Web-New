import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Card, Select, MenuItem, TextField, FormControl, InputLabel } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { get } from 'services/apiService';
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import Swal from "sweetalert2";

function HotelBooking() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState("");
    const [pickupType, setPickupType] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffType, setDropoffType] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await get('/api/user-pet/list', {}, true);
                if (response.data.status === 200) {
                    setPets(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const handleBooking = () => {
        Swal.fire({
            title: 'Booking Confirmed',
            text: 'Your hotel booking has been confirmed!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };

    return (
        <>
            <MKBox
                minHeight="75vh"
                width="100%"
                sx={{
                    backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                        `${linearGradient(
                            rgba(gradients.dark.main, 0.6),
                            rgba(gradients.dark.state, 0.6)
                        )}, url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Container>
                    <Grid
                        container
                        item
                        xs={12}
                        lg={8}
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        sx={{ mx: "auto", textAlign: "center" }}
                    >
                        <MKTypography
                            variant="h1"
                            color="white"
                            sx={({ breakpoints, typography: { size } }) => ({
                                [breakpoints.down("md")]: {
                                    fontSize: size["3xl"],
                                },
                            })}
                        >
                            Hotel Booking
                        </MKTypography>
                        <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
                            Book a stay for your pet with ease.
                        </MKTypography>
                    </Grid>
                </Container>
            </MKBox>
            <Card
                sx={{
                    p: 2,
                    mx: { xs: 2, lg: 3 },
                    mt: -8,
                    mb: 4,
                    boxShadow: ({ boxShadows: { xxl } }) => xxl,
                }}
            >
                <Container>
                    <MKBox py={6}>
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Select Pet</InputLabel>
                            <Select
                                value={selectedPet}
                                onChange={(e) => setSelectedPet(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                {pets.map((pet) => (
                                    <MenuItem key={pet.id} value={pet.id}>
                                        {pet.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Booking Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Booking Time"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Pick-up Type</InputLabel>
                            <Select
                                value={pickupType}
                                onChange={(e) => setPickupType(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="vet">Vet</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Pick-up Location"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Drop-off Type</InputLabel>
                            <Select
                                value={dropoffType}
                                onChange={(e) => setDropoffType(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                <MenuItem value="home">Home</MenuItem>
                                <MenuItem value="vet">Vet</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Drop-off Location"
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                <MenuItem value="credit_card">Credit Card</MenuItem>
                                <MenuItem value="paypal">PayPal</MenuItem>
                                <MenuItem value="cash">Cash</MenuItem>
                            </Select>
                        </FormControl>
                        <MKButton variant="gradient" color="success" fullWidth onClick={handleBooking}>
                            Confirm Booking
                        </MKButton>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
}

export default HotelBooking;
