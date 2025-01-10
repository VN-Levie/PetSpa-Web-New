import React, { useState } from "react";
import { Container, Grid, Typography, Card, TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Select } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useCart } from "contexts/CartContext";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";

const ProductCheckout = () => {
    const { cart, clearCart } = useCart();
    const [address, setAddress] = useState("");
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const handleConfirmOrder = () => {
        // Handle order confirmation logic here
        clearCart();
    };

    const savedAddresses = ["123 Main St", "456 Elm St", "789 Oak St"]; // Example saved addresses

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
                            Product Checkout
                        </MKTypography>
                        <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
                            Review your selected products and confirm your order.
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
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                {cart.length > 0 ? (
                                    cart.map((product, index) => (
                                        <MKBox key={index} mb={2}>
                                            <Typography variant="h6">{product.name}</Typography>
                                            <Typography variant="body1">Price: ${product.price}</Typography>
                                            <Typography variant="body1">Quantity: {product.quantity}</Typography>
                                        </MKBox>
                                    ))
                                ) : (
                                    <Typography variant="body1">No products in cart.</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset" margin="normal">
                                    <Typography variant="h6">Delivery Address</Typography>
                                    <RadioGroup
                                        value={useNewAddress ? "new" : "saved"}
                                        onChange={(e) => setUseNewAddress(e.target.value === "new")}
                                    >
                                        <FormControlLabel value="saved" control={<Radio />} label="Deliver to Saved Address" />
                                        <FormControlLabel value="new" control={<Radio />} label="Deliver to New Address" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControl fullWidth >
                                    {useNewAddress ? (
                                        <TextField
                                            label="Enter New Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    ) : (
                                        <TextField
                                            select
                                            label="Select Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            fullWidth
                                            displayEmpty
                                            margin="normal"
                                            sx={{
                                                '.MuiInputBase-root': {
                                                    height: '45px', // Tăng chiều cao của ô chọn
                                                },
                                                '.MuiSelect-select': {
                                                    display: 'flex',
                                                    alignItems: 'center', // Đảm bảo nội dung căn giữa
                                                },
                                            }}
                                        >
                                            {savedAddresses.map((addr, index) => (
                                                <MenuItem key={index} value={addr}>
                                                    {addr}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    )}
                                </FormControl>
                                <FormControl component="fieldset" margin="normal">
                                    <Typography variant="h6">Payment Method</Typography>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
                                        <FormControlLabel value="vnpay" control={<Radio />} label="VnPay" />
                                    </RadioGroup>
                                </FormControl>
                                <MKButton variant="gradient" color="success" fullWidth onClick={handleConfirmOrder}>
                                    Confirm Order
                                </MKButton>
                            </Grid>
                        </Grid>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
};

export default ProductCheckout;
