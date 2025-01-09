import { useCart } from "contexts/CartContext";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, TextField } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { Link } from "react-router-dom";
import bgImage from "assets/images/city-profile.jpg";

const CartDetail = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

    return (
        <MKBox bgColor="white">
            <MKBox
                minHeight="25rem"
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
                    mx: { xs: 2, lg: 3 },
                    mt: -8,
                    mb: 4,
                    backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                    backdropFilter: "saturate(200%) blur(30px)",
                    boxShadow: ({ boxShadows: { xxl } }) => xxl,
                }}
            >
                <MKBox component="section" py={{ xs: 6, sm: 12 }}>
                    <Container>
                        <MKTypography variant="h4" mb={2}>Cart Details</MKTypography>
                        {cart.length === 0 ? (
                            <MKTypography variant="body1">Your cart is empty.</MKTypography>
                        ) : (
                            <Grid container spacing={3}>
                                {cart.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={product.imageUrl}
                                                alt={product.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {product.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {product.description}
                                                </Typography>
                                                <Typography variant="h6" color="text.primary">
                                                    ${product.price}
                                                </Typography>
                                                <TextField
                                                    label="Quantity"
                                                    type="number"
                                                    value={product.quantity}
                                                    onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                                                    inputProps={{ min: 1 }}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <Button variant="contained" color="secondary" onClick={() => removeFromCart(product.id)}>
                                                    Remove
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        {cart.length > 0 && (
                            <MKBox mt={4}>
                                <Button variant="contained" color="primary" onClick={clearCart}>
                                    Clear Cart
                                </Button>
                                <Button component={Link} to="/product-checkout" variant="contained" color="success" sx={{ ml: 2 }}>
                                    Proceed to Checkout
                                </Button>
                            </MKBox>
                        )}
                    </Container>
                </MKBox>
            </Card>
        </MKBox>
    );
};

export default CartDetail;
