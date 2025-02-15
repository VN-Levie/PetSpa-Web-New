import { useEffect, useState } from "react";
import { Container, Grid, TextField, Select, MenuItem, CircularProgress, Card, CardMedia, CardContent, Typography, InputLabel, FormControl, ToggleButton, ToggleButtonGroup, Button, IconButton, Badge } from "@mui/material";
import { get } from 'services/apiService';
import MKButton from "components/MKButton";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import bgImage from "assets/images/city-profile.jpg";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import Pagination from '@mui/material/Pagination';
import { useCart } from "contexts/CartContext";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { API_ENDPOINT } from "configs/AppConfig";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchParams, setSearchParams] = useState({ name: "", categoryId: "" });
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(localStorage.getItem('shopPageSize') || 10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState(localStorage.getItem('shopViewMode') || 'grid');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [page, pageSize]);

    const fetchCategories = async () => {
        try {
            const response = await get('/api/public/shop-product/categories');
            if (response.data.status === 200) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

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

    const fetchProducts = async (params = searchParams) => {
        setLoading(true);
        try {
            const { name, categoryId } = params; // Sử dụng params truyền vào
            const response = await get(`/api/public/shop-product/list?page=${page - 1}&size=${pageSize}&name=${name}&categoryId=${categoryId}`);
            if (response.data.status === 200) {
                setProducts(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
        console.log('searchParams:', searchParams);

        // fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams.categoryId]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const handleClearFilters = () => {
        const resetParams = { name: "", categoryId: "" }; // Giá trị reset
        setSearchParams(resetParams);
        setPage(1);
        fetchProducts(resetParams); // Gọi fetchProducts với giá trị mới ngay lập tức
    };

    const handlePageSizeChange = (event) => {
        const newSize = event.target.value;
        setPageSize(newSize);
        localStorage.setItem('shopPageSize', newSize);
        setPage(1);
        fetchProducts();
    };

    const handlePageChange = (event, value) => {
        window.scrollTo(0, 0); // Scroll to top after pagination
        setPage(value);
        fetchProducts();
    };

    const handleViewModeChange = (event, newViewMode) => {
        if (newViewMode !== null) {
            setViewMode(newViewMode);
            localStorage.setItem('shopViewMode', newViewMode);
        }
    };

    return (
        <>
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
                    <MKTypography variant="h3" align="center">Pet Shop</MKTypography>
                    <MKBox component="section" py={{ xs: 6, sm: 12 }}>

                        <Container>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <form onSubmit={handleSearchSubmit}>
                                        <Grid container spacing={2} mb={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Search by Name"
                                                    name="name"
                                                    value={searchParams.name}
                                                    onChange={handleSearchChange}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth sx={{ height: "100%" }}>
                                                    <Select
                                                        name="categoryId"
                                                        value={searchParams.categoryId}
                                                        onChange={handleSearchChange}
                                                        displayEmpty
                                                        sx={{ height: "100%" }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>All Categories</em>
                                                        </MenuItem>
                                                        {categories.map((category) => (
                                                            <MenuItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <MKButton type="submit" variant="contained" color="primary" fullWidth>
                                                    Search
                                                </MKButton>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <MKButton type="button" variant="outlined" color="secondary" fullWidth onClick={handleClearFilters}>
                                                    Clear
                                                </MKButton>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    <Grid container spacing={2} mb={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth sx={{ height: "100%" }}>
                                                <InputLabel>Items per page</InputLabel>
                                                <Select
                                                    value={pageSize}
                                                    onChange={handlePageSizeChange}
                                                    fullWidth sx={{ height: "100%" }}
                                                >
                                                    <MenuItem value={5}>5</MenuItem>
                                                    <MenuItem value={10}>10</MenuItem>
                                                    <MenuItem value={20}>20</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ToggleButtonGroup
                                                value={viewMode}
                                                exclusive
                                                onChange={handleViewModeChange}
                                                aria-label="view mode"
                                                fullWidth
                                            >
                                                <ToggleButton value="grid" aria-label="grid view">
                                                    <ViewModuleIcon />
                                                </ToggleButton>
                                                <ToggleButton value="list" aria-label="list view">
                                                    <ViewListIcon />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    {loading ? (
                                        <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                                            <CircularProgress />
                                        </MKBox>
                                    ) : (
                                        <Grid container spacing={3} mb={2}>
                                            {products.map((product) => (
                                                <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={product.id}>
                                                    <Card sx={{ position: 'relative', backgroundColor: '#f5f5f5' }}>
                                                        {/* Bọc ảnh trong Link */}

                                                        <CardMedia
                                                            component="img"
                                                            sx={{
                                                                height: 140, // Chiều cao cố định
                                                                objectFit: "contain", // Đảm bảo ảnh vừa với khung mà không bị cắt
                                                                backgroundColor: "#f5f5f5", // Tùy chỉnh màu nền cho khoảng trống (nếu có)
                                                            }}
                                                            image={fetchProductImage(product)}
                                                            alt={product.name}
                                                        />



                                                        {/* Nút Add to Cart */}
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 18,
                                                                right: 18,
                                                                backgroundColor: '#f5f5f5',
                                                                '&:hover': {
                                                                    backgroundColor: '#FFD1DC',
                                                                },
                                                            }}
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            <AddShoppingCartIcon />
                                                        </IconButton>

                                                        <CardContent>
                                                            {/* Bọc tên trong Link */}
                                                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                <Typography gutterBottom variant="h5" component="div" sx={{ cursor: 'pointer' }}>
                                                                    {product.name}
                                                                </Typography>
                                                            </Link>

                                                            {/* <Typography variant="body2" color="text.secondary">
                                                                {product.description}
                                                            </Typography> */}

                                                            <Typography variant="h6" color="primary">
                                                                ${product.price}
                                                            </Typography>

                                                            {/* Nút View Details */}

                                                            <MKButton
                                                                type="submit"
                                                                variant="contained"
                                                                color="primary"
                                                                fullWidth
                                                                component={Link} to={`/product/${product.id}`}
                                                                sx={{ mt: 2 }}
                                                            >
                                                                View Details
                                                            </MKButton>


                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>

                                    )}
                                    <MKBox display="flex" justifyContent="center" mt={4}>
                                        <Pagination count={totalPages} page={page} onChange={handlePageChange} />
                                    </MKBox>
                                </Grid>
                            </Grid>
                        </Container>
                    </MKBox>
                </Card>
            </MKBox>
        </>
    );
};

export default Shop;
