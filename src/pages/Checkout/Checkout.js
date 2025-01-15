import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useBooking } from "contexts/BookingContext";
import { useNavigate } from "react-router-dom";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import Swal from "sweetalert2";
import { get, post } from 'services/apiService';
import { useAuth } from "contexts/AuthContext";

function Checkout() {
    const { bookingData, clearBooking } = useBooking();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [ip, setIp] = useState("");

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

        fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
                setIp(data.ip);
                console.log("IP address:", data.ip);
            })
            .catch((error) => {
                console.error("Error fetching IP address:", error);
            });
    }, []);

    const handleConfirmPayment = async () => {
        try {
            const orderDetails = {
                userId: user.id,
                paymentMethod: paymentMethod.toUpperCase(),
                goodsType: "SPA",
                cart: bookingData.selectedServices.map((service) => ({
                    id: service.id,
                    quantity: 1,
                })),
                subtotal: bookingData.selectedServices.reduce((acc, service) => acc + service.price, 0),
                shippingFee: 0,
                total: bookingData.selectedServices.reduce((acc, service) => acc + service.price, 0),
                name: user.name,
                phone: user.phone,
                address: "",
            };

            const formData = new FormData();
            formData.append("orderRequestDTO", JSON.stringify(orderDetails));

            const response = await post("/api/user-order/createOrder", formData, true);
            if (response.data.status === 200) {
                console.log("Order confirmed:", response.data);
                if (paymentMethod === "COD") {
                    clearBooking();
                    window.history.replaceState({}, document.title);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Your order has been confirmed successfully!',
                    });
                    return;
                }
                const id = response.data.data.id;
                const formData2 = new FormData();
                formData2.append("orderId", id);
                formData2.append("ip", ip);
                const response2 = await post("/api/payment/create-payment", formData2, true);
                if (response2.data.status === 200) {
                    console.log("Payment gate url:", response2.data.data);
                    window.location.href = response2.data.data;
                }
            } else {
                console.error("Error confirming order:", response.data.message);
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            try {
                if (error.response?.data?.message != null) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response.data.message,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Something went wrong. Please try again later.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error.',
                    text: 'Something went wrong. Please try again later!',
                });

            }

        }
    };

    return (
        <>
            <MKBox
                minHeight="45vh"
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
                    mt: -6,
                    mb: 1,
                    boxShadow: ({ boxShadows: { xxl } }) => xxl,
                }}
            >
                <Container>
                    <MKBox py={6}>
                        {bookingData.petDetails && bookingData.petDetails.id && (
                            <MKBox mb={3}>
                                <Typography variant="h6">Selected Pet</Typography>
                                <Typography variant="body1">Name: {bookingData.petDetails.name}</Typography>
                            </MKBox>
                        )}
                        {bookingData.selectedServices.length > 0 ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <MKBox mb={3}>
                                        <Typography variant="h6">Order Details</Typography>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Service</TableCell>
                                                        <TableCell align="right">Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {bookingData.selectedServices.map((service, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{service.name}</TableCell>
                                                            <TableCell align="right">${service.price.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell align="right">Total</TableCell>
                                                        <TableCell align="right">${bookingData.selectedServices.reduce((acc, service) => acc + service.price, 0).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MKBox mb={3}>
                                        <Typography variant="h6">Payment Method</Typography>
                                        <Select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            fullWidth
                                        >
                                            <MenuItem value="COD">Pay at store</MenuItem>
                                            <MenuItem value="VNPAY">VnPay</MenuItem>
                                        </Select>
                                    </MKBox>
                                    <MKButton variant="gradient" color="success" fullWidth onClick={handleConfirmPayment}>
                                        Confirm and Pay
                                    </MKButton>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="body1">No services selected.</Typography>
                        )}
                    </MKBox>
                </Container>
            </Card>
        </>
    );
}

export default Checkout;
