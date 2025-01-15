import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Card, Grid, CircularProgress } from "@mui/material";
import MKBox from "components/MKBox";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import { useAuth } from "contexts/AuthContext";
import { get } from "services/apiService";
import { HorizontalTeamCardWithActions } from "examples/Cards/TeamCards/HorizontalTeamCard";
import { useCart } from "contexts/CartContext";
const Payment = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const vnp_Amount = queryParams.get("vnp_Amount");
    const vnp_BankCode = queryParams.get("vnp_BankCode");
    const vnp_BankTranNo = queryParams.get("vnp_BankTranNo");
    const vnp_CardType = queryParams.get("vnp_CardType");
    const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
    const vnp_PayDate = queryParams.get("vnp_PayDate");
    const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
    const vnp_TmnCode = queryParams.get("vnp_TmnCode");
    const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
    const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
    const vnp_TxnRef = queryParams.get("vnp_TxnRef");
    const vnp_SecureHash = queryParams.get("vnp_SecureHash");
    const [profile, setProfile] = useState(null);
    const { user, loading } = useAuth();
    const [payLoading, setPayLoading] = useState(false);
    const [mess, setMess] = useState(null);
    const { cart, clearCart } = useCart();
    useEffect(() => {
        const checkPey = async () => {
            setPayLoading(true);
            try {
                const profileResponse = await get('/api/payment/vnpay_ipn', queryParams, true);
                if (profileResponse.data.status === 200) {
                    console.log("Profile:", profileResponse.data.data);
                    setMess(profileResponse.data.data);
                    clearCart();
                } else {
                    console.log("Profile:", profileResponse);
                    setMess(profileResponse.data.data);
                }
            } catch (error) {
                console.error("Error confirming order:", error);
                try {
                    if (error.response?.data?.message != null) {

                        // Swal.fire({
                        //     icon: 'error',
                        //     title: 'Error',
                        //     text: error.response.data.message,
                        // });
                        setMess(error.response.data.message);                       
                    } else {
                        setMess("An error occurred while confirming the order. Please try again");
                    }
                } catch (error) {
                    setMess("An error occurred while confirming the order. Please try again!");

                }
            } finally {
                setPayLoading(false);
            }
        };
        checkPey();
    }, [loading]);
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
            > <Container>
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
            <MKBox minHeight="75vh" display="flex" alignItems="center" justifyContent="center">
                <Container>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            Payment Information
                        </Typography>
                        {payLoading ? (
                            <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                                <CircularProgress />
                            </MKBox>
                        ) : (
                            <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                                <Typography variant="body1" gutterBottom>
                                    {mess}
                                </Typography>
                            </MKBox>
                        )}
                    </Card>
                </Container>
            </MKBox>

        </>

    );
};

export default Payment;
