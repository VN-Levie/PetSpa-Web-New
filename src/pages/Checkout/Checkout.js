import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Card, Select, MenuItem } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useBooking } from "contexts/BookingContext";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import Swal from "sweetalert2";
import { get } from 'services/apiService';

function Checkout() {
    const { bookingData, updatePetDetails } = useBooking();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleChangePet = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are changing the pet for all selected services. If you want to book for another pet, please start a new booking.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Select Pet',
                    input: 'select',
                    inputOptions: pets.reduce((acc, pet) => {
                        // console.log("select-pet", pet);
                        // console.log("select-acc", acc);

                        acc[pet.id] = pet.name;
                        return acc;
                    }, {}),
                    inputPlaceholder: 'Select a pet',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'You need to select a pet!';
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const selectedPet = pets.find(pet => pet.id == result.value);
                        if (!selectedPet) {
                            Swal.fire('Error', 'Selected pet not found!', 'error');
                            return;
                        }
                        updatePetDetails({ id: selectedPet.id, name: selectedPet.name });
                    }
                });
            }
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
                            Checkout
                        </MKTypography>
                        <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
                            Review your selected services and confirm your booking.
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
                        {bookingData.petDetails && bookingData.petDetails.id && (
                            <MKBox mb={2}>
                                <Typography variant="h6">Selected Pet</Typography>
                                <Typography variant="body1">Name: {bookingData.petDetails.name}</Typography>
                                <MKButton variant="gradient" color="info" fullWidth onClick={handleChangePet}>
                                    Change Pet
                                </MKButton>
                            </MKBox>
                        )}
                        {bookingData.selectedServices.length > 0 ? (
                            bookingData.selectedServices.map((service, index) => (
                                <MKBox key={index} mb={2}>
                                    <Typography variant="h6">{service.name}</Typography>
                                    <Typography variant="body1">Price: ${service.price}</Typography>
                                    <Typography variant="body2">Note: {service.note || "No notes"}</Typography>
                                </MKBox>
                            ))
                        ) : (
                            <Typography variant="body1">No services selected.</Typography>
                        )}
                        <MKButton variant="gradient" color="success" fullWidth>
                            Confirm Booking
                        </MKButton>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
}

export default Checkout;
