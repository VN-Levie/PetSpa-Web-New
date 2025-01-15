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
} from "@mui/material";
import { get } from 'services/apiService';
import MKTypography from "components/MKTypography";

function SpaManagement() {
    const [activeTabSpa, setActiveTabSpa] = useState(() => {
        const savedTab = localStorage.getItem('activeTabSpa');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);

    const handleTabTypeSpa = (event, newValue) => {
        setActiveTabSpa(newValue);
        localStorage.setItem('activeTabSpa', newValue);
    };

    const fetchProducts = async (page) => {
        try {
            const response = await get(`/api/admin/spa-product/list?page=${page}&size=10`, {}, true);
            if (response.data.status === 200) {
                setProducts(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await get('/api/admin/spa-product/categories', {}, true);
            if (response.data.status === 200) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                Spa Service Management
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabSpa} onChange={handleTabTypeSpa}>
                            <Tab label="Categories" />
                            <Tab label="Products" />
                            <Tab label="Orders" />
                            <Tab label="Chart" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabSpa === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Spa Service Categories
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Image</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell>
                                            <img src={category.imageUrl} alt={category.name} width="50" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            )}
            {activeTabSpa === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Spa Service
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
                                {products.map((product) => (
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
                        count={totalPages}
                        page={page + 1}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ mt: 2 }}
                    />
                </CardContent>
            )}
            {activeTabSpa === 2 && (
                <>
                    Order
                </>
            )}
            {activeTabSpa === 3 && (
                <>
                    Chart
                </>
            )}
        </>
    );
}

export default SpaManagement;
