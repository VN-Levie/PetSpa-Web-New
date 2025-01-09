import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, TextField } from "@mui/material";
import { get } from 'services/apiService';
import { useCart } from "contexts/CartContext";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import bgImage from "assets/images/city-profile.jpg";

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await get(`/api/public/shop-product/product?productId=${productId}`);
                if (response.data.status === 200) {
                    setProduct(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
    };

    if (loading) {
        return (
            <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </MKBox>
        );
    }

    if (!product) {
        return <MKTypography variant="body1">Product not found.</MKTypography>;
    }

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
                        <MKTypography variant="h4" mb={2}>{product.name}</MKTypography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="400"
                                        image={product.imageUrl}
                                        alt={product.name}
                                    />
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
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
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            inputProps={{ min: 1 }}
                                            fullWidth
                                            margin="normal"
                                        />
                                        <Button variant="contained" color="primary" onClick={handleAddToCart}>
                                            Add to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </MKBox>
            </Card>
        </MKBox>
    );
};

export default ProductDetail;
