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
import { get, post } from 'services/apiService';
import MKTypography from "components/MKTypography";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import MKButton from "components/MKButton";
import MKAlert from "components/MKAlert";
import MKBox from "components/MKBox";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { imgUrl } from "configs/AppConfig";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function SpaManagement() {
    const [activeTabSpa, setActiveTabSpa] = useState(() => {
        const savedTab = localStorage.getItem('activeTabSpa');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

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

    const handleAddEditCategory = (category = null) => {
        reset();
        setCurrentCategory(category);
        setImagePreview(null);
        setOpenCategoryDialog(true);
    };

    const handleCategoryDialogClose = () => {
        setOpenCategoryDialog(false);
        setCurrentCategory(null);
        setImagePreview(null);
    };

    const handleCategoryDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        const categoryDTO = {
            name: data.name,
            description: data.description,
            imageUrl: "",
            deleted: false
        };
        if (currentCategory) {
            categoryDTO.id = currentCategory.id;
            categoryDTO.deleted = currentCategory.deleted;
        }
        if (data.file && data?.file[0]) {
            formData.append("file", data.file[0]);
        }
        formData.append("categoryDTO", JSON.stringify(categoryDTO));
        try {
            const response = await post(`/api/admin/spa-product/category/${currentCategory ? 'update' : 'add'}`, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentCategory ? "Category edited successfully" : "Category added successfully", "success");
                fetchCategories();
                handleCategoryDialogClose();
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the category.";
            Swal.fire("Error!", message, "error");
        }
    };

    const handleToggleCategoryVisibility = (category) => {
        (async () => {
            const action = category.deleted ? 'SHOW' : 'HIDE';
            const step1 = await Swal.fire({
                title: 'Are you sure?',
                html: `This action will <strong>${action}</strong> the category in the SPA.  <br>And <strong>ALL</strong> products in this category will be <strong>ALSO</strong> take action.`,
                icon: 'warning',
                showCancelButton: true,
            });

            if (step1.isConfirmed) {
                const step2 = await Swal.fire({
                    title: `Confirm to ${action} it?`,
                    text: `Are you sure you want to ${action} this category?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                });

                if (step2.isConfirmed) {
                    try {
                        const formData = new FormData();
                        const categoryDTO = {
                            id: category.id,
                            name: category.name,
                            description: category.description,
                            deleted: category.deleted
                        };
                        formData.append("categoryDTO", JSON.stringify(categoryDTO));
                        const response = await post(`/api/admin/spa-product/category/delete`, formData, true);
                        if (response.data.status === 200) {
                            Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)}d!`, `The category has been ${action}d.`, 'success');
                            fetchCategories();
                        } else {
                            Swal.fire('Error!', response.data.message, 'error');
                        }
                    } catch (error) {
                        const message = error.response?.data?.message ?? `There was an error ${action}ing the category.`;
                        Swal.fire('Error!', message, 'error');
                    }
                }
            }
        })();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (!validImageTypes.includes(file.type)) {
                Swal.fire("Error!", "Invalid image type. Only jpg, jpeg, png, gif, webp, bmp are allowed.", "error");
                setImagePreview(null);
                event.target.value = null;
                return;
            }

            if (file.size > maxSizeInBytes) {
                Swal.fire("Error!", "File size exceeds 5MB. Please upload a smaller file.", "error");
                setImagePreview(null);
                event.target.value = null;
                return;
            }

            const reader = new FileReader();
            var isValid = false;
            setImageLoading(true);
            reader.onloadend = (e) => {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                if (!isValidImageMagicBytes(uint8Array)) {
                    Swal.fire("Error!", "Invalid file content. This is not a valid image.", "error");
                    setImagePreview(null);
                    event.target.value = null;
                    setImageLoading(false);
                    return;
                }

                isValid = true;
            };
            reader.readAsArrayBuffer(file);
            const reader2 = new FileReader();
            reader2.onloadend = () => {
                if (isValid) {
                    setImagePreview(reader2.result);
                } else {
                    setImagePreview(null);
                }
                setImageLoading(false);
            };
            reader2.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const isValidImageMagicBytes = (bytes) => {
        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true;
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && (bytes[3] === 0x38 || bytes[3] === 0x37)) return true;
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;
        if (bytes[0] === 0x42 && bytes[1] === 0x4D) return true;

        return false;
    };

    const handleAddEditProduct = (product = null) => {
        setCurrentProduct(product);
        setImagePreview(null);
        setOpenProductDialog(true);
    };

    const handleProductDialogClose = () => {
        setOpenProductDialog(false);
        setCurrentProduct(null);
        setImagePreview(null);
    };

    const handleProductDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        const productDTO = {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.categoryId,
            imageUrl: "",
            deleted: false,
        };
        if (currentProduct) {
            productDTO.id = currentProduct.id;
            productDTO.deleted = currentProduct.deleted;
            console.log("currentProduct", currentProduct);

        }
        if (data.file && data?.file[0]) {
            formData.append("file", data.file[0]);
        }
        formData.append("productDTO", JSON.stringify(productDTO));
        try {
            const response = await post(`/api/admin/spa-product/${currentProduct ? 'edit' : 'add'}`, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentProduct ? "Product edited successfully" : "Product added successfully", "success");
                fetchProducts(page);
                handleProductDialogClose();
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the product.";
            Swal.fire("Error!", message, "error");
        }
    };

    const handleToggleProductVisibility = (product) => {
        (async () => {
            const action = product.deleted ? 'SHOW' : 'HIDE';
            const step1 = await Swal.fire({
                title: 'Are you sure?',
                html: `This action will ${action} the product in the spa.`,
                icon: 'warning',
                showCancelButton: true,
            });

            if (step1.isConfirmed) {
                const step2 = await Swal.fire({
                    title: `Confirm to ${action} it?`,
                    text: `Are you sure you want to ${action} this product?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                });

                if (step2.isConfirmed) {
                    try {
                        const formData = new FormData();
                        const productDTO = {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            deleted: product.deleted
                        };
                        formData.append("productDTO", JSON.stringify(productDTO));
                        const response = await post(`/api/admin/spa-product/delete`, formData, true);
                        if (response.data.status === 200) {
                            Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)}d!`, `The product has been ${action}d.`, 'success');
                            fetchProducts(page);
                        } else {
                            Swal.fire('Error!', response.data.message, 'error');
                        }
                    } catch (error) {
                        const message = error.response?.data?.message ?? `There was an error ${action}ing the product.`;
                        Swal.fire('Error!', message, 'error');
                    }
                }
            }
        })();
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
                            {/* <Tab label="Orders" />
                            <Tab label="Chart" /> */}
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabSpa === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Spa Service Categories
                    </Typography>
                    <MKButton onClick={() => handleAddEditCategory()} color="primary">Add Category</MKButton>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell>
                                            <img src={imgUrl(category.imageUrl)} alt={category.name} width="50" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <MKButton onClick={() => handleAddEditCategory(category)} color="warning" size="small">Edit</MKButton>
                                            <MKButton onClick={() => handleToggleCategoryVisibility(category)} color={category.deleted ? "success" : "error"} size="small">
                                                {category.deleted ? "Show" : "Hide"}
                                            </MKButton>
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
                    <MKButton onClick={() => handleAddEditProduct()} color="primary">Add Product</MKButton>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell>
                                            <img src={imgUrl(product.imageUrl)} alt={product.name} width="50" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <MKButton onClick={() => handleAddEditProduct(product)} color="warning" size="small">Edit</MKButton>
                                            <MKButton onClick={() => handleToggleProductVisibility(product)} color={product.deleted ? "success" : "error"} size="small">
                                                {product.deleted ? "Show" : "Hide"}
                                            </MKButton>
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
            <Dialog open={openCategoryDialog} onClose={handleCategoryDialogClose} sx={{ zIndex: 999 }}>
                <DialogTitle>{currentCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                <DialogContent>
                    <TextField
                        {...register("name")}
                        id="categoryName"
                        label="Category Name"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentCategory?.name || ""}
                    />
                    <TextField
                        {...register("description")}
                        id="categoryDescription"
                        label="Description"
                        fullWidth
                        margin="normal"
                        defaultValue={currentCategory?.description || ""}
                        multiline
                        required
                        rows={3}
                    />
                    <input
                        name={register("file").name}
                        ref={register("file").ref}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        onBlur={register("file").onBlur}
                        style={{ marginTop: '16px' }}
                        required={!currentCategory}
                    />
                    {imageLoading ? (
                        <MKBox display="flex" justifyContent="center" alignItems="center" height="50px">
                            <CircularProgress />
                        </MKBox>
                    ) : (
                        imagePreview && (
                            <>
                                <MKTypography variant="body2" color="inherit" style={{ marginTop: "10px" }}>
                                    Preview Image:
                                </MKTypography>
                                <MKAlert color="light" textAlign="center">
                                    <img src={imagePreview} alt="Preview" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto", borderRadius: "6px" }} />
                                </MKAlert>
                            </>
                        )
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCategoryDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit(handleCategoryDialogSubmit)} color="primary">{currentCategory ? "Save" : "Add"}</Button>
                </DialogActions>
            </Dialog >
            <Dialog open={openProductDialog} onClose={handleProductDialogClose} sx={{ zIndex: 999 }}>
                <DialogTitle>{currentProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                <DialogContent>
                    <TextField
                        {...register("name")}
                        id="productName"
                        label="Product Name"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentProduct?.name || ""}
                    />
                    <TextField
                        {...register("description")}
                        id="productDescription"
                        label="Description"
                        fullWidth
                        margin="normal"
                        defaultValue={currentProduct?.description || ""}
                        multiline
                        required
                        rows={3}
                    />
                    <TextField
                        {...register("price")}
                        id="productPrice"
                        label="Price"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentProduct?.price || ""}
                        type="number"
                    />
                    <Select
                        {...register("categoryId")}
                        id="productCategory"
                        label="Category"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentProduct?.categoryId || ""}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <input
                        name={register("file").name}
                        ref={register("file").ref}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        onBlur={register("file").onBlur}
                        style={{ marginTop: '16px' }}
                        required={!currentProduct}
                    />
                    {imageLoading ? (
                        <MKBox display="flex" justifyContent="center" alignItems="center" height="50px">
                            <CircularProgress />
                        </MKBox>
                    ) : (
                        imagePreview && (
                            <>
                                <MKTypography variant="body2" color="inherit" style={{ marginTop: "10px" }}>
                                    Preview Image:
                                </MKTypography>
                                <MKAlert color="light" textAlign="center">
                                    <img src={imagePreview} alt="Preview" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto", borderRadius: "6px" }} />
                                </MKAlert>
                            </>
                        )
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProductDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit(handleProductDialogSubmit)} color="primary">{currentProduct ? "Save" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SpaManagement;
