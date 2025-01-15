import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useCart } from "contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import { post } from "services/apiService";
import { useAuth, user, loading as userLoading } from "contexts/AuthContext";
import Swal from "sweetalert2";
const ReviewAndConfirmOrder = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const location = useLocation();
    const { user, loading } = useAuth();
    const { orderDetails } = location.state || {}; // Nếu location.state null, orderDetails sẽ undefined
    const [ip, setIp] = useState("");
    // Kiểm tra nếu không có orderDetails, chuyển hướng
    // if (!orderDetails) {
    //     console.warn("No order details found. Redirecting to cart...");
    //     navigate("/");
    //     return null; // Không render gì nếu đang redirect
    // }
    useEffect(() => {

        // Gọi API của ipify để lấy địa chỉ IP
        fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
                setIp(data.ip); // Cập nhật IP vào state
                console.log("IP address:", data.ip);

            })
            .catch((error) => {
                console.error("Error fetching IP address:", error);
            });
    }, [loading]);
    const handleConfirmPayment = async () => {
        try {
            console.log("user", user);

            //in hoa toàn bộ paymentMethod
            orderDetails.paymentMethod = orderDetails.paymentMethod.toUpperCase();
            // "goodsType": "SHOP"
            orderDetails.goodsType = "SHOP";
            console.log("orderDetails:", orderDetails);
            //lấy ra orderDetails.cart loại bỏ hết thông tin thừ chỉa giữ lại id và quantity
            orderDetails.cart = orderDetails.cart.map((item) => {
                return {
                    id: item.id,
                    quantity: item.quantity,
                };
            });
            const formData = new FormData();
            orderDetails.id = null;
            orderDetails.userId = user.id;
            formData.append("orderRequestDTO", JSON.stringify(orderDetails));

            const response = await post("/api/user-order/createOrder", formData, true);
            if (response.data.status === 200) {
                console.log("Order confirmed:", response.data);
                if (orderDetails.paymentMethod === "COD") {
                    //clearCart and orderDetails
                    clearCart();
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
                    window.location.href = response2.data.data; // Redirect to the payment URL
                }
                // clearCart();
                // history.push("/order-success");
            } else {
                console.error("Error confirming order:", response.data.message);
            }
            // const formData2 = new FormData();
            // const addressBookDTO = {
            //     id: -1,
            //     amount: orderDetails.total * 23000,
            //     bankCode: "",
            //     language: "vn",
            //     detail: "detail",
            //     ip: "171.243.48.50",
            // };

            // formData2.append("paymentDTO", JSON.stringify(addressBookDTO));
            // const response = await post("/api/payment/create-payment", formData2, true);
            // if (response.data.status === 200) {
            //     console.log("Payment gate url:", response.data.data);
            //     // clearCart();
            //     // window.location.href = response.data.data; // This will navigate to the URL
            //     window.open(response.data.data, "_blank");

            // } else {
            //     console.error("Error confirming order:", response.data.message);
            // }
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
                        {!orderDetails || orderDetails == {} || Object.keys(orderDetails).length === 0 ? (
                            <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                                <Typography variant="body1" gutterBottom>
                                    No order details found. Please add items to your cart first.
                                </Typography>
                            </MKBox>
                        ) : (
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
                        )}
                    </MKBox>
                </Container>
            </Card>
        </>
    );
};

export default ReviewAndConfirmOrder;
