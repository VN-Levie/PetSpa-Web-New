import React from "react";
import { useCart } from "contexts/CartContext";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    TextField,
    Paper,
} from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { Link } from "react-router-dom";
import bgImage from "assets/images/city-profile.jpg";
import MKButton from "components/MKButton";
import { API_ENDPOINT } from "configs/AppConfig";

const CartDetail = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const fetchProductImage = (product) => {
        // Xử lý URL
        let formattedUrl = product.imageUrl;
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = `${API_ENDPOINT}${formattedUrl}`;
        } else if (formattedUrl.startsWith('http://localhost:')) {
            formattedUrl = formattedUrl.replace(/^http:\/\/localhost:\d+/, API_ENDPOINT);
        }
        return formattedUrl;
    };
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
            <Paper
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
                <MKTypography variant="h3" align="center">
                    Cart And Checkout
                </MKTypography>
                <MKBox component="section" py={{ xs: 6, sm: 12 }}>
                    <Container>
                        {cart.length === 0 ? (
                            <MKTypography align="center" variant="body1">Your cart is empty.</MKTypography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {cart.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell align="center">
                                                    <img
                                                        src={fetchProductImage(product)}
                                                        alt={product.name}
                                                        style={{ width: "80px", height: "auto", borderRadius: "4px" }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">{product.name}</TableCell>
                                                <TableCell align="center">${product.price}</TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        value={product.quantity || 1} // Đảm bảo giá trị mặc định
                                                        onChange={(e) =>
                                                            updateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))
                                                        }
                                                        inputProps={{ min: 1 }}
                                                        size="small"
                                                        sx={{ width: "80px" }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    ${((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <MKButton
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => removeFromCart(product.id)}
                                                    >
                                                        Remove
                                                    </MKButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {cart.length > 0 && (
                            <MKBox mt={4} display="flex" justifyContent="space-between" alignItems="center">
                                <MKButton variant="contained" color="primary" onClick={clearCart}>
                                    Clear Cart
                                </MKButton>
                                <MKButton
                                    component={Link}
                                    to="/product-checkout"
                                    variant="contained"
                                    color="success"
                                >
                                    Proceed to Checkout
                                </MKButton>
                            </MKBox>
                        )}
                    </Container>
                </MKBox>
            </Paper>
        </MKBox>
    );
};

export default CartDetail;
