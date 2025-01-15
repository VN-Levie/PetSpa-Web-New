import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    AppBar,
    Tabs,
    Tab,
    Card,
    CardContent,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Pagination,
    CircularProgress,
} from "@mui/material";
import { get } from 'services/apiService';
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";

function ShopManagement() {
    const [activeTabShop, setActiveTabShop] = useState(() => {
        const savedTab = localStorage.getItem('activeTabShop');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });
    const [shopProducts, setShopProducts] = useState([]);
    const [shopPage, setShopPage] = useState(0);
    const [shopTotalPages, setShopTotalPages] = useState(0);
    const [shopCategories, setShopCategories] = useState([]);
    const [shopLoading, setShopLoading] = useState(false);
    const handleTabTypeShop = (event, newValue) => {
        setActiveTabShop(newValue);
        localStorage.setItem('activeTabShop', newValue);
    };

    const fetchShopProducts = async (page) => {
        setShopLoading(true);
        try {
            const response = await get(`/api/admin/shop-product/list?page=${page}&size=2`, {}, true);
            if (response.data.status === 200) {
                setShopProducts(response.data.data);
                setShopTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching shop products:", error);
        } finally {
            setShopLoading(false);
        }
    };

    const fetchShopCategories = async () => {
        setShopLoading(true);
        try {
            const response = await get('/api/admin/shop-product/categories', {}, true);
            if (response.data.status === 200) {
                setShopCategories(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching shop categories:", error);
        } finally {
            setShopLoading(false);
        }
    };

    useEffect(() => {
        fetchShopProducts(shopPage);
    }, [shopPage]);

    useEffect(() => {
        fetchShopCategories();
    }, []);

    const handleShopPageChange = (event, value) => {
        setShopPage(value - 1);
    };
    if (shopLoading) {
        return (
            <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </MKBox>
        );
    }
    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                Shop Management
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabShop} onChange={handleTabTypeShop}>
                            <Tab label="Categories" />
                            <Tab label="Products" />
                            <Tab label="Orders" />
                            <Tab label="Chart" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>

            <>
                {activeTabShop === 0 && (
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Shop Product Categories
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {shopCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                )}
                {activeTabShop === 1 && (
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Shop Products
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Image</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shopProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.description}</TableCell>
                                            <TableCell>
                                                <img src={product.imageUrl} alt={product.name} width="50" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination
                            count={shopTotalPages}
                            page={shopPage + 1}
                            onChange={handleShopPageChange}
                            color="primary"
                            sx={{ mt: 2 }}
                        />
                    </CardContent>
                )}
                {activeTabShop === 2 && (
                    <>
                        Order
                    </>
                )}
                {activeTabShop === 3 && (
                    <>
                        Chart
                    </>
                )}
            </>

        </>
    );
}

export default ShopManagement;
