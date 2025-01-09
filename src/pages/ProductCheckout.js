import React from "react";
import { Container, Grid, Typography, Card } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useCart } from "contexts/CartContext";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";

const ProductCheckout = () => {
    const { cart, clearCart } = useCart();

    const handleConfirmOrder = () => {
        // Handle order confirmation logic here
        clearCart();
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
                        <MKButton variant="gradient" color="success" fullWidth onClick={handleConfirmOrder}>
                            Confirm Order
                        </MKButton>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
};

export default ProductCheckout;
