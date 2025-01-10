import React, { useState, useEffect, useCallback } from "react";
import { Container, Grid, Typography, Card, TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Autocomplete } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useCart } from "contexts/CartContext";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import { get } from 'services/apiService';

const ProductCheckout = () => {
    const { cart, clearCart } = useCart();
    const [address, setAddress] = useState("");
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [addressOptions, setAddressOptions] = useState([]);
    const [addressRs, setAddressRs] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // State cho các trường thứ cấp
    const [streetNumber, setStreetNumber] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    //tính đơn hàng
    const [shippingFee, setShippingFee] = useState(10); // Phí ship cố định
    const [subtotal, setSubtotal] = useState(0); // Tổng phụ
    // Tính tổng phụ dựa trên giỏ hàng
    useEffect(() => {
        const total = cart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setSubtotal(total);
    }, [cart]);

    const handleConfirmOrder = () => {
        // Handle order confirmation logic here
        clearCart();
    };

    const savedAddresses = ["123 Main St", "456 Elm St", "789 Oak St"]; // Example saved addresses
    const handleAddressSearch = async (query) => {
        try {
            const response = await get(`http://localhost:8090/api/map/search-place?query=${query}`);
            if (response.data.status === 200) {
                const jsonResponse = JSON.parse(response.data.data);
                const results = jsonResponse.results;

                // Tùy chỉnh hiển thị nếu có `poi.name`
                const addresses = results.map((result) => {
                    const poiName = result.poi?.name ? `${result.poi.name} - ` : ""; // Nếu có poi.name, thêm vào trước
                    return `${poiName}${result.address.freeformAddress}`; // Ghép poi.name với freeformAddress
                });

                setAddressRs(results); // Giữ dữ liệu gốc để xử lý chi tiết
                setAddressOptions([...new Set(addresses)]); // Loại bỏ trùng lặp
            } else {
                console.error("Error fetching addresses:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching address options:", error);
        }
    };


    const debounceSearch = useCallback(
        (query) => {
            if (debounceTimeout) clearTimeout(debounceTimeout);
            const timeout = setTimeout(() => {
                if (query != null && query.length > 2) {
                    handleAddressSearch(query);
                }
            }, 300);
            setDebounceTimeout(timeout);
        },
        [debounceTimeout]
    );

    useEffect(() => {
        debounceSearch(address);
    }, [address, debounceSearch]);

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress);
        if (!selectedAddress) {
            // Nếu không có địa chỉ nào được chọn, xóa các trường thứ cấp
            setStreetNumber("");
            setStreet("");
            setCity("");
            setProvince("");
            setPostalCode("");
            setCountry("");
            return;
        }
        // Tìm thông tin chi tiết từ `addressRs`
        const selected = addressRs.find(
            (result) => result.address.freeformAddress === selectedAddress
        );

        if (selected) {
            setStreetNumber(selected.address.streetNumber || "");
            setStreet(selected.address.streetName || "");
            setCity(selected.address.municipality || "");
            setProvince(selected.address.countrySubdivision || "");
            setPostalCode(selected.address.postalCode || "");
            setCountry(selected.address.country || "");
        }
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
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
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
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl component="fieldset" margin="normal">
                                    <Typography variant="h6">Delivery Address</Typography>
                                    <RadioGroup
                                        value={useNewAddress ? "new" : "saved"}
                                        onChange={(e) => setUseNewAddress(e.target.value === "new")}
                                    >
                                        <FormControlLabel value="saved" control={<Radio />} label="Deliver to Saved Address" />
                                        <FormControlLabel value="new" control={<Radio />} label="Deliver to New Address" />
                                    </RadioGroup>
                                </FormControl>
                                <FormControl fullWidth>
                                    {useNewAddress ? (
                                        <>
                                            <Autocomplete
                                                freeSolo
                                                options={addressOptions}
                                                filterOptions={(x) => x}
                                                inputValue={address || ""}
                                                onInputChange={(event, newInputValue) => {
                                                    setAddress(newInputValue || "");
                                                }}
                                                onChange={(event, newValue) => {
                                                    handleAddressSelect(newValue || "");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Search for Address"
                                                        margin="normal"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                            {/* Hiển thị các trường thứ cấp */}
                                            <TextField
                                                label="Street number"
                                                value={streetNumber}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                label="Street"
                                                value={street}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                label="City"
                                                value={city}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                label="Province"
                                                value={province}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                label="Postal Code"
                                                value={postalCode}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                label="Country"
                                                value={country}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        </>

                                    ) : (
                                        <TextField
                                            select
                                            label="Select Address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            fullWidth
                                            displayEmpty
                                            margin="normal"
                                            sx={{
                                                '.MuiInputBase-root': {
                                                    height: '45px', // Increase the height of the select box
                                                },
                                                '.MuiSelect-select': {
                                                    display: 'flex',
                                                    alignItems: 'center', // Ensure content is centered
                                                },
                                            }}
                                        >
                                            {savedAddresses.map((addr, index) => (
                                                <MenuItem key={index} value={addr}>
                                                    {addr}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                </FormControl>
                                <FormControl component="fieldset" margin="normal">
                                    <Typography variant="h6">Payment Method</Typography>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
                                        <FormControlLabel value="vnpay" control={<Radio />} label="VnPay" />
                                    </RadioGroup>
                                </FormControl>
                                <MKButton variant="gradient" color="success" fullWidth onClick={handleConfirmOrder}>
                                    Confirm Order
                                </MKButton>
                            </Grid>
                        </Grid>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
};

export default ProductCheckout;
