import React from "react";
import { Container, Grid, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useCart } from "contexts/CartContext";
import { useLocation } from "react-router-dom";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import { post } from "services/apiService";

const ReviewAndConfirmOrder = () => {
    const { cart, clearCart } = useCart();
    const location = useLocation();

    const { orderDetails } = location.state;

    const handleConfirmPayment = async () => {
        try {
            //in hoa toàn bộ paymentMethod
            orderDetails.paymentMethod = orderDetails.paymentMethod.toUpperCase();
            // "goodsType": "SHOP"
            orderDetails.goodsType = "SHOP";
            console.log("Order confirmed:", orderDetails);
            const formData = new FormData();
            formData.append("orderRequestDTO", JSON.stringify(orderDetails));
            
            const response = await post("/api/user-order/createOrder", formData, true);
            if (response.data.status === 200) {
                console.log("Order confirmed:", response.data);
                // clearCart();
                history.push("/order-success");
            } else {
                console.error("Error confirming order:", response.data.message);
            }
        } catch (error) {
            console.error("Error confirming order:", error);
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
                            Review and Confirm Order
                        </MKTypography>
                        <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
                            Please review your order details before making the payment.
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
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <MKBox mb={3}>
                                    <Typography variant="h6">Order Details</Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell align="right">Quantity</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cart.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell align="right">{item.quantity}</TableCell>
                                                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={3} align="right">Subtotal</TableCell>
                                                    <TableCell align="right">${(orderDetails?.subtotal ?? 0).toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} align="right">Shipping Fee</TableCell>
                                                    <TableCell align="right">${(orderDetails?.shippingFee ?? 0).toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} align="right">Total</TableCell>
                                                    <TableCell align="right">${(orderDetails?.total ?? 0).toFixed(2)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </MKBox>
                                <MKBox mb={3}>
                                    <Typography variant="h6">Shipping Information</Typography>
                                    <Typography variant="body1">Name: {orderDetails.name}</Typography>
                                    <Typography variant="body1">Phone: {orderDetails.phone}</Typography>
                                    <Typography variant="body1">Address: {orderDetails.address}</Typography>
                                </MKBox>
                                <MKBox mb={3}>
                                    <Typography variant="h6">Payment Method</Typography>
                                    <Typography variant="body1">{orderDetails.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "VnPay"}</Typography>
                                </MKBox>
                                <MKButton variant="gradient" color="success" fullWidth onClick={handleConfirmPayment}>
                                    Confirm and Pay
                                </MKButton>
                            </Grid>
                        </Grid>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
};

export default ReviewAndConfirmOrder;
