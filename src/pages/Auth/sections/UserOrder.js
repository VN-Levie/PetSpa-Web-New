import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Card, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { get, post } from 'services/apiService';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserOrder = () => {
    const [orders, setOrders] = useState([]);
    const [goodsType, setGoodsType] = useState("SHOP");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await get(`/api/user-order/list?page=0&size=10&goodsType=${goodsType}`, {}, true);
            if (response.data.status === 200) {
                setOrders(response.data.data || []);
            } else {
                console.error("Error loading orders:", response.data.message);
            }
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [goodsType]);

    const handleGoodsTypeChange = (event) => {
        setGoodsType(event.target.value);
    };

    const handleViewDetail = (orderId) => {
        navigate(`/auth/profile/user-order-detail/${orderId}`);
    };

    const handleContinuePayment = async (orderId) => {
        try {
            const response = await get(`/api/user-order/detail/${orderId}`, {}, true);
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipResponse.json();
            const ip = ipData.ip;

            if (response.data.status === 200) {
                const id = response.data.data.id;
                const formData2 = new FormData();
                formData2.append("orderId", id);
                formData2.append("ip", ip);
                const response2 = await post("/api/payment/create-payment", formData2, true);
                if (response2.data.status === 200) {
                    window.history.replaceState({}, document.title);
                    window.location.href = response2.data.data; // Redirect to the payment URL
                }
            } else {
                console.error("Error loading order detail:", response.data.message);
            }
        } catch (error) {
            console.error("Error continuing payment:", error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await post(`/api/user-order/cancel`, { orderId }, true);
            if (response.data.status === 200) {
                loadOrders(); // Reload orders after cancellation
            } else {
                console.error("Error cancelling order:", response.data.message);
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    return (
        <Card sx={{ p: 2, mx: { xs: 2, lg: 3 }, mt: 2, mb: 1, boxShadow: ({ boxShadows: { xxl } }) => xxl }}>
            <Container>
                <MKBox py={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <MKBox mb={3}>
                                <Typography variant="h6">User Orders</Typography>
                                <Grid >

                                    <InputLabel>Search Order Type</InputLabel>
                                    <Select value={goodsType}
                                        onChange={handleGoodsTypeChange}
                                        // label="Goods Type"
                                        fullWidth
                                        height="100%"
                                        sx={{ height: "100%" }}
                                        margin="dense"
                                    >
                                        <MenuItem value="SPA">SPA</MenuItem>
                                        <MenuItem value="SHOP">SHOP</MenuItem>
                                        <MenuItem value="HOTEL">HOTEL</MenuItem>
                                        <MenuItem value="PET_TAG">PET_TAG</MenuItem>
                                    </Select>

                                </Grid>
                                {loading ? (
                                    <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                                        <CircularProgress />
                                    </MKBox>
                                ) : (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableBody>
                                                {orders.map((order) => (
                                                    <TableRow key={order.id}>
                                                        <TableCell>{order.id}</TableCell>
                                                        <TableCell>Type: {order.goodsType}</TableCell>
                                                        <TableCell>{order.totalPrice}</TableCell>
                                                        <TableCell>{order.status}</TableCell>
                                                        <TableCell>{order.updatedAt}</TableCell>
                                                        <TableCell>                                                   
                                                            <MKButton variant="outlined" color="info" onClick={() => handleViewDetail(order.id)}>View Detail</MKButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </MKBox>
                        </Grid>
                    </Grid>
                </MKBox>
            </Container>
        </Card>
    );
};

export default UserOrder;
