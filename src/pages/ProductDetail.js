import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, TextField } from "@mui/material";
import { get } from 'services/apiService';
import { useCart } from "contexts/CartContext";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import bgImage from "assets/images/city-profile.jpg";
import { API_ENDPOINT } from "configs/AppConfig";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";

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
                    mb: 2,
                    backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                    backdropFilter: "saturate(200%) blur(30px)",
                    boxShadow: ({ boxShadows: { xxl } }) => xxl,
                }}
            >

                <MKBox component="section" py={{ xs: 6, sm: 12 }}>
                    <Grid container >
                        <Grid
                            item
                            xs={12}
                            lg={5}
                            position="relative"
                            px={0}
                            sx={{
                                backgroundImage: `url(${fetchProductImage(product)})`,
                                backgroundSize: "contain", // Đảm bảo ảnh vừa với khung mà không bị cắt
                                backgroundRepeat: "no-repeat", // Không lặp lại hình ảnh
                                backgroundPosition: "center", // Căn giữa hình ảnh
                                height: { xs: '500px', lg: 'auto' }, // Điều chỉnh chiều cao cho mobile
                                order: { xs: 1, lg: 0 }, // Hiển thị hình trước tiên trên mobile
                            }}
                        >
                        </Grid>



                        <Grid item xs={12} lg={7}>
                            <MKBox component="form" p={2} method="post">
                                <MKBox px={3} py={{ xs: 2, sm: 6 }}>
                                    <MKTypography variant="h2" mb={1}>
                                        {product.name}
                                    </MKTypography>
                                    <MKTypography variant="body1" color="text">
                                        ${product.price}
                                    </MKTypography>
                                </MKBox>
                                <MKBox pt={0.5} pb={3} px={3}>
                                    <Grid container>
                                        <Grid item xs={12} pr={1} mb={6}>
                                            <TextField
                                                label="Quantity"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                inputProps={{ min: 1 }}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        item
                                        xs={12}
                                        md={6}
                                        justifyContent="flex-end"
                                        textAlign="right"
                                        ml="auto"
                                    >
                                        <MKButton variant="contained" color="primary" onClick={handleAddToCart}>
                                            Add to Cart
                                        </MKButton>
                                    </Grid>
                                </MKBox>
                                <MKBox px={3} py={{ xs: 2, sm: 6 }}>
                                    <MKTypography variant="body1" color="text" mb={2} style={{ whiteSpace: "pre-line" }}>
                                        {product.description}
                                    </MKTypography>
                                </MKBox>
                            </MKBox>
                        </Grid>
                    </Grid>

                </MKBox>

            </Card>

        </MKBox>
    );
};

export default ProductDetail;
