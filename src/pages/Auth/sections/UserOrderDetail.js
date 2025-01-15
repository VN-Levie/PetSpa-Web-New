import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { get, post } from 'services/apiService';
import bgImage from "assets/images/city-profile.jpg";
const UserOrderDetail = () => {
    const { orderId } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [ip, setIp] = useState("");
    const [mess, setMess] = useState("");
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
    }, [orderDetail]);
    const loadOrderDetail = async () => {
        try {
            const response = await get(`/api/user-order/detail/${orderId}`, {}, true);
            if (response.data.status === 200) {
                setOrderDetail(response.data.data);
            } else {
                console.error("Error loading order detail:", response.data.message);
                setMess(response.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "An error occurred while loading order detail. Please try again";
            console.error("Error loading order detail:", error);
            setMess(message);
        }
    };

    useEffect(() => {
        loadOrderDetail();
    }, [orderId]);

    const handleContinuePayment = async () => {
        try {
            const formData2 = new FormData();
            formData2.append("orderId", orderDetail.id);
            formData2.append("ip", ip);
            const response2 = await post("/api/payment/create-payment", formData2, true);
            if (response2.data.status === 200) {
                window.history.replaceState({}, document.title);
                window.location.href = response2.data.data; // Redirect to the payment URL
            }
        } catch (error) {
            console.error("Error continuing payment:", error);
        }
    };

    const handleCancelOrder = async () => {
        try {
            const response = await post(`/api/user-order/cancel`, { orderId: orderDetail.id }, true);
            if (response.data.status === 200) {
                // Handle successful cancellation, e.g., navigate back to orders list
            } else {
                console.error("Error cancelling order:", response.data.message);
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    if (!orderDetail) {
        if(mess){
            return (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <Typography variant="h6">{mess}</Typography>
                </div>
            );
        }
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </div>
        );
    }

    return (
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

                <Card sx={{ p: 2, mx: { xs: 2, lg: 3 }, mt: 2, mb: 1, boxShadow: ({ boxShadows: { xxl } }) => xxl }}>
                    <Container>
                        <MKBox py={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <MKBox mb={3}>
                                        <Card sx={{ mb: 3, p: 2 }}>
                                            <Typography variant="h6">Order Detail</Typography>
                                            <Typography variant="body1">Order ID: {orderDetail.id}</Typography>
                                            <hr />
                                            <Typography variant="body1">User ID: {orderDetail.userId}</Typography>
                                            <hr />
                                            <Typography variant="body1">Goods Type: {orderDetail.goodsType}</Typography>
                                            <hr />
                                            <Typography variant="body1">Total Price: {orderDetail.totalPrice}</Typography>
                                            <hr />
                                            <Typography variant="body1">Status: {orderDetail.status}</Typography>
                                            <hr />
                                            <Typography variant="body1">Updated At: {orderDetail.updatedAt}</Typography>
                                        </Card>

                                        <Card sx={{ mb: 3, p: 2 }}>
                                            <Typography variant="h6">Products</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={3}><Typography variant="body1">Product ID</Typography></Grid>
                                                <Grid item xs={3}><Typography variant="body1">Goods Type</Typography></Grid>
                                                <Grid item xs={3}><Typography variant="body1">Price</Typography></Grid>
                                                <Grid item xs={3}><Typography variant="body1">Quantity</Typography></Grid>
                                                {orderDetail.orderProducts.map((product) => (
                                                    <React.Fragment key={product.id}>
                                                        <Grid item xs={3}><Typography variant="body2">{product.productId}</Typography></Grid>
                                                        <Grid item xs={3}><Typography variant="body2">{product.goodsType}</Typography></Grid>
                                                        <Grid item xs={3}><Typography variant="body2">{product.price}</Typography></Grid>
                                                        <Grid item xs={3}><Typography variant="body2">{product.quantity}</Typography></Grid>
                                                        <Grid item xs={12}><hr /></Grid>
                                                    </React.Fragment>
                                                ))}
                                            </Grid>
                                        </Card>

                                        <Card sx={{ mb: 3, p: 2 }}>
                                            <Typography variant="h6">Payment Status</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}><Typography variant="body1">Status</Typography></Grid>
                                                <Grid item xs={4}><Typography variant="body1">Payment Type</Typography></Grid>
                                                <Grid item xs={4}><Typography variant="body1">Date</Typography></Grid>
                                                {orderDetail.paymentStatuses.map((status) => (
                                                    <React.Fragment key={status.id}>
                                                        <Grid item xs={4}><Typography variant="body2">{status.status}</Typography></Grid>
                                                        <Grid item xs={4}><Typography variant="body2">{status.paymentType}</Typography></Grid>
                                                        <Grid item xs={4}><Typography variant="body2">{status.date}</Typography></Grid>
                                                        <Grid item xs={12}><hr /></Grid>
                                                    </React.Fragment>
                                                ))}
                                            </Grid>
                                        </Card>

                                        <Card sx={{ mb: 3, p: 2 }}>
                                            <Typography variant="h6">Delivery Status</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}><Typography variant="body1">Status</Typography></Grid>
                                                <Grid item xs={4}><Typography variant="body1">Note</Typography></Grid>
                                                <Grid item xs={4}><Typography variant="body1">Date</Typography></Grid>
                                                {orderDetail.deliveryStatuses.map((status) => (
                                                    <React.Fragment key={status.id}>
                                                        <Grid item xs={4}><Typography variant="body2">{status.status}</Typography></Grid>
                                                        <Grid item xs={4}><Typography variant="body2">{status.note}</Typography></Grid>
                                                        <Grid item xs={4}><Typography variant="body2">{status.date}</Typography></Grid>
                                                        <Grid item xs={12}><hr /></Grid>
                                                    </React.Fragment>
                                                ))}
                                            </Grid>
                                        </Card>

                                        {orderDetail.status === "PENDING" && (
                                            <>

                                                <MKButton variant="outlined" color="info" onClick={handleContinuePayment}>Continue Payment</MKButton>

                                            </>

                                        )}
                                        {(orderDetail.status === "PENDING" || orderDetail.status === "CONFIRMED") && (
                                            <>

                                                <MKButton variant="outlined" color="info" onClick={handleCancelOrder}>Cancel Order</MKButton>

                                            </>

                                        )}
                                    </MKBox>
                                </Grid>
                            </Grid>
                        </MKBox>
                    </Container>
                </Card>
            </Card>
        </MKBox>


    );
};

export default UserOrderDetail;
