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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Select,
    MenuItem,
    Icon,
} from "@mui/material";
import { get, post } from 'services/apiService';
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import Swal from 'sweetalert2';
import MKAlert from "components/MKAlert";
import { useForm } from "react-hook-form";
import MKButton from "components/MKButton";
import { API_ENDPOINT } from "configs/AppConfig";

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
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const [hideButtonDisabled, setHideButtonDisabled] = useState(false);
    const [hideButtonCountdown, setHideButtonCountdown] = useState(5);
    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
    const [confirmButtonCountdown, setConfirmButtonCountdown] = useState(5);
    const [searchParams, setSearchParams] = useState({ name: "", categoryId: "" });
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const handleTabTypeShop = (event, newValue) => {
        setActiveTabShop(newValue);
        localStorage.setItem('activeTabShop', newValue);
    };

    const fetchShopProducts = async (page) => {
        setShopLoading(true);
        try {
            const { name, categoryId } = searchParams;
            const response = await get(`/api/admin/shop-product/list?page=${page}&size=10&name=${name}&categoryId=${categoryId}`, {}, true);
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
    const useScrollToTop = (dependency) => {
        useEffect(() => {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        }, [dependency]);
    };
    useScrollToTop(shopLoading);

    const handleAddEditProduct = (product = null) => {
        setCurrentProduct(product);
        setImagePreview(null);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentProduct(null);
        setImagePreview(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            // Kiểm tra loại file dựa trên MIME type
            if (!validImageTypes.includes(file.type)) {
                Swal.fire("Error!", "Invalid image type. Only jpg, jpeg, png, gif, webp, bmp are allowed.", "error");
                setImagePreview(null);
                event.target.value = null;
                return;
            }

            // Kiểm tra kích thước file
            if (file.size > maxSizeInBytes) {
                Swal.fire("Error!", "File size exceeds 5MB. Please upload a smaller file.", "error");
                setImagePreview(null);
                event.target.value = null;
                return;
            }

            // Đọc nội dung file bằng FileReader
            const reader = new FileReader();
            var isValid = false;
            setImageLoading(true);
            reader.onloadend = (e) => {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                // Kiểm tra magic bytes
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


    const fetchProductImage = (product) => {
        console.log();

        let attempts = 0;

        // Xử lý URL
        let formattedUrl = product.imageUrl;
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = `${API_ENDPOINT}${formattedUrl}`;
        } else if (formattedUrl.startsWith('http://localhost:')) {
            formattedUrl = formattedUrl.replace(/^http:\/\/localhost:\d+/, API_ENDPOINT);
        }
        return formattedUrl;
    };


    // Kiểm tra magic bytes (JPEG, PNG, GIF, WebP, BMP)
    const isValidImageMagicBytes = (bytes) => {
        // JPEG: FF D8 FF
        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;
        // PNG: 89 50 4E 47
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true;
        // GIF: 47 49 46 38
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && (bytes[3] === 0x38 || bytes[3] === 0x37)) return true;
        // WebP: 52 49 46 46 (RIFF) + WEBP at byte 8
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;
        // BMP: 42 4D
        if (bytes[0] === 0x42 && bytes[1] === 0x4D) return true;

        return false;
    };

    const handleDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        console.log("formData", data);

        if (!currentProduct && data?.file?.length == 0) {
            Swal.fire('Error!', 'Please upload an image for the product', 'error');
            return;
        }
        if (data.file && data?.file[0]) {
            formData.append("file", data.file[0]);
        }

        if (!data.name || !data.price || !data.description || !data.categoryId || !data.quantity) {
            Swal.fire('Error!', 'Please fill out all fields', 'error');
            return;
        }
        // public class ShopProductDTO {

        //     private Long id;
        //     private String name;
        //     private Double price;
        //     private String description;
        //     private Long categoryId;
        //     private String imageUrl;
        //     private Integer quantity;

        const shopProductDTO = {
            name: data.name,
            price: data.price,
            description: data.description,
            imageUrl: "",
            categoryId: data.categoryId,
            quantity: data.quantity,
            isDeleted: false
        };
        if (currentProduct) {
            shopProductDTO.id = currentProduct.id;
        }
        formData.append("productDTO", JSON.stringify(shopProductDTO));
        try {
            const response = await post(`/api/admin/shop-product/${currentProduct ? 'edit' : 'add'}`, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentProduct ? "Pet edited successfully" : "Pet added successfully", "success");
                fetchShopProducts(shopPage);
                handleDialogClose();
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the pet.";
            Swal.fire("Error!", message, "error");
        }
    };

    const steps = ['1', '2'];
    const Queue = Swal.mixin({
        progressSteps: steps,
        confirmButtonText: 'Continue &rarr;',
        showClass: { backdrop: 'swal2-noanimation' },
        hideClass: { backdrop: 'swal2-noanimation' },
    });

    const handleToggleProductVisibility = (product) => {
        (async () => {
            const action = product.isDeleted ? 'SHOW' : 'HIDE';
            const step1 = await Queue.fire({
                title: 'Are you sure?',
                html: `This action will ${action} the product in the shop.<br> Users will ${action === 'hide' ? 'not ' : ''}be able to purchase this product.`,
                icon: 'warning',
                showCancelButton: true,
                currentProgressStep: 0,
            });

            if (step1.isConfirmed) {
                const step2 = await Queue.fire({
                    title: `Confirm to ${action} it?`,
                    text: `Are you sure you want to ${action} this product?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    currentProgressStep: 1,
                });

                if (step2.isConfirmed) {
                    try {
                        const formData = new FormData();
                        const shopProductDTO = {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            imageUrl: product.imageUrl,
                            categoryId: product.categoryId,
                            quantity: product.quantity,
                            isDeleted: product.isDeleted
                        };
                        formData.append("productDTO", JSON.stringify(shopProductDTO));
                        const response = await post(`/api/admin/shop-product/delete`, formData, true);
                        if (response.data.status === 200) {
                            Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)}d!`, `The product has been ${action}d.`, 'success');
                            fetchShopProducts(shopPage);
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

    useEffect(() => {
        if (hideButtonDisabled) {
            const interval = setInterval(() => {
                setHideButtonCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setHideButtonDisabled(false);
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }, [hideButtonDisabled]);

    const handleHideButtonClick = (product) => {
        setHideButtonDisabled(true);
        handleToggleProductVisibility(product);
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchShopProducts(0);
    };

    const handleClearFilters = () => {
        setSearchParams({ name: "", categoryId: "" });
        setShopPage(0);
        fetchShopProducts(0);
    };

    const truncateDescription = (description, maxLength = 100) => {
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + '...';
    };

    const handleAddEditCategory = (category = null) => {
        //clear form
        reset();
        setCurrentCategory(category);
        setOpenCategoryDialog(true);
    };

    const handleCategoryDialogClose = () => {
        setOpenCategoryDialog(false);
        setCurrentCategory(null);
    };

    const handleCategoryDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        const categoryDTO = {
            name: data.name,
            description: data.description,
            deleted: false
        };
        if (currentCategory) {
            categoryDTO.id = currentCategory.id;
            categoryDTO.deleted = currentCategory.deleted;
        }
        formData.append("categoryDTO", JSON.stringify(categoryDTO));
        try {
            const response = await post(`/api/admin/shop-product/category/${currentCategory ? 'update' : 'add'}`, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentCategory ? "Category edited successfully" : "Category added successfully", "success");
                fetchShopCategories();
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
            const step1 = await Queue.fire({
                title: 'Are you sure?',
                html: `This action will <strong>${action}</strong> the category in the SHOP.  <br>And <strong>ALL</strong> products in this category will be <strong>ALSO</strong> take action.`,
                icon: 'warning',
                showCancelButton: true,
                currentProgressStep: 0,
            });

            if (step1.isConfirmed) {
                const step2 = await Queue.fire({
                    title: `Confirm to ${action} it?`,
                    text: `Are you sure you want to ${action} this category?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    currentProgressStep: 1,
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
                        const response = await post(`/api/admin/shop-product/category/delete`, formData, true);
                        if (response.data.status === 200) {
                            Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)}d!`, `The category has been ${action}d.`, 'success');
                            fetchShopCategories();
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
                        <MKButton onClick={() => handleAddEditCategory()} color="primary">Add Category</MKButton>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {shopCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.description}</TableCell>
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
                {activeTabShop === 1 && (
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Shop Products
                        </Typography>
                        <form onSubmit={handleSearchSubmit}>
                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        label="Search by Name"
                                        name="name"
                                        value={searchParams.name}
                                        onChange={handleSearchChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Select
                                        label="Filter by Category"
                                        name="categoryId"
                                        value={searchParams.categoryId}
                                        onChange={handleSearchChange}
                                        fullWidth
                                        displayEmpty
                                        sx={{ height: "100%" }}
                                    >
                                        <MenuItem value="">
                                            <em>All Categories</em>
                                        </MenuItem>
                                        {shopCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <MKButton type="submit" variant="contained" color="primary" fullWidth>
                                        <Icon>search</Icon>
                                    </MKButton>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <MKButton type="button" variant="outlined" color="secondary" fullWidth onClick={handleClearFilters}>
                                        <Icon>clear</Icon>
                                    </MKButton>
                                </Grid>
                            </Grid>
                        </form>
                        <MKButton onClick={() => handleAddEditProduct()} color="primary">Add Product</MKButton>
                        <TableContainer >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead align="center">
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        {/* <TableCell align="right">Description</TableCell> */}
                                        <TableCell align="right">Image</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shopProducts.map((product) => (
                                        <TableRow key={product.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th">{product.name}</TableCell>
                                            <TableCell align="right">{product.price}</TableCell>
                                            {/* <TableCell align="right">{truncateDescription(product.description ?? "")}</TableCell> */}
                                            <TableCell align="right">
                                                <img src={fetchProductImage(product)} alt={product.name} width="50" />
                                            </TableCell>
                                            <TableCell align="right">
                                                <MKButton onClick={() => handleAddEditProduct(product)} color="warning" size="small">Edit</MKButton>
                                                <MKButton onClick={() => handleToggleProductVisibility(product)} color={product.isDeleted ? "success" : "error"} size="small">
                                                    {product.isDeleted ? "Show" : "Hide"}
                                                </MKButton>
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
            <Dialog open={openDialog} onClose={handleDialogClose} sx={{ zIndex: 999 }}>
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
                        {...register("price")}
                        id="productPrice"
                        label="Price"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentProduct?.price || ""}
                    />
                    <TextField
                        {...register("quantity")}
                        id="productQuantity"
                        label="Quantity"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentProduct?.quantity || ""}
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

                    <Select
                        {...register("categoryId")}
                        id="productCategory"
                        label="Category"
                        fullWidth
                        margin="normal"
                        height="100px"
                        defaultValue={currentProduct?.categoryId || ""}
                        displayEmpty
                        required
                        renderValue={(selected) => {
                            if (!selected) {
                                return <em> Select Category</em>;
                            }
                            const selectedType = shopCategories.find(category => category.id === selected);
                            return selectedType ? selectedType.name : <em> Select Category</em>;
                        }}
                    >
                        <MenuItem disabled value="">
                            <em>
                                Select Category
                            </em>
                        </MenuItem>
                        {shopCategories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {currentProduct && currentProduct.imageUrl && (
                        <>
                            <MKTypography variant="body2" color="inherit" style={{ marginTop: "10px" }}>
                                Current Product Image:
                            </MKTypography>
                            <img src={currentProduct.imageUrl} alt="Product" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto", borderRadius: "6px" }} />
                        </>
                    )}
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
                    <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit(handleDialogSubmit)} color="primary">{currentProduct ? "Save" : "Add"}</Button>
                </DialogActions>
            </Dialog>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCategoryDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit(handleCategoryDialogSubmit)} color="primary">{currentCategory ? "Save" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ShopManagement;
