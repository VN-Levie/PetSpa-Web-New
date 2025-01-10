import React, { useState, useEffect, useCallback } from "react";
import { Container, Grid, Typography, Card, TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Autocomplete, TableCell, TableBody, TableRow, TableContainer, Paper, Table, TableHead } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { useCart } from "contexts/CartContext";
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import { get, post } from 'services/apiService';
import Swal from "sweetalert2";
const ProductCheckout = () => {
    const { cart, clearCart } = useCart();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
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
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    // Tính tổng phụ dựa trên giỏ hàng
    useEffect(() => {
        const total = cart.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setSubtotal(total);
    }, [cart]);

    const handleConfirmOrder = async () => {
        const orderDetails = {
            address,
            latitude,
            longitude,
            paymentMethod,
            cart,
            shippingFee,
            total: subtotal + shippingFee,
        };

        try {
            // const response = await post("http://localhost:8090/api/order", orderDetails);
            // if (response.data.status === 200) {
            //     console.log("Order confirmed:", response.data);
            //     clearCart();
            // } else {
            //     console.error("Error confirming order:", response.data.message);
            // }
        } catch (error) {
            console.error("Error confirming order:", error);
        }
    };

    const savedAddresses = ["123 Main St", "456 Elm St", "789 Oak St"]; // Example saved addresses
    const handleAddressSearch = async (query) => {
        try {
            const response = await get(`/api/map/search-place?query=${query}`);
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

    const handleAddressSelect = async (selectedAddress) => {
        setAddress(selectedAddress);
        if (!selectedAddress) {
            // Nếu không có địa chỉ nào được chọn, xóa các trường thứ cấp
            setStreetNumber("");
            setStreet("");
            setCity("");
            setProvince("");
            setPostalCode("");
            setCountry("");
            setLatitude(null);
            setLongitude(null);
            setShippingFee(0);
            return;
        }
        // Tìm thông tin chi tiết từ `addressRs`
        // Tìm thông tin chi tiết từ `addressRs`
        const selected = addressRs.find((result) => {
            const poiName = result.poi?.name ? `${result.poi.name} - ` : ""; // Lấy `poi.name` nếu có
            const fullAddress = `${poiName}${result.address.freeformAddress}`; // Kết hợp `poi.name` và `freeformAddress`
            return fullAddress === selectedAddress; // So sánh với địa chỉ đã chọn
        });



        if (selected) {
            setStreetNumber(selected.address.streetNumber || "");
            setStreet(selected.address.streetName || "");
            setCity(selected.address.municipality || "");
            setProvince(selected.address.countrySubdivision || "");
            setPostalCode(selected.address.postalCode || "");
            setCountry(selected.address.country || "");
            setLatitude(selected.position.lat || null);
            setLongitude(selected.position.lon || null);

            // Call API to calculate shipping fee
            try {
                Swal.showLoading();
                console.log(selected.position.lat, selected.position.lon);
                // console.log(`http://localhost:8090/api/map/calculate-shipping-fee?userLat=${selected.position.lat}&userLon=${selected.position.lon}`);

                const response = await get(`/api/map/calculate-shipping-fee?userLat=${selected.position.lat}&userLon=${selected.position.lon}`);
                // console.log("response", response.data);

                if (response.data.status === 200) {
                    setShippingFee(response.data.data.shippingFee);
                    Swal.close();
                } else if (response.data.status === 400 || response.data.status === 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message,
                    });
                } else {
                    console.error("Error calculating shipping fee:", response.data.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error~!',
                        text: 'Something went wrong. Please try again later.',
                    });
                }
            } catch (error) {
                console.error("Error calculating shipping fee:", error);
                try {
                    if (error.response?.data?.message != null) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.response.data.message,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Something went wrong. Please try again later.',
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error.',
                        text: 'Something went wrong. Please try again later!',
                    });

                } finally {

                    setStreetNumber("");
                    setStreet("");
                    setCity("");
                    setProvince("");
                    setPostalCode("");
                    setCountry("");
                    setLatitude(null);
                    setLongitude(null);
                    setShippingFee(0);
                }



            }
        }
    };


    return (
        <>
            <MKBox
                minHeight="45vh"
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
                    mt: -6,
                    mb: 1,
                    boxShadow: ({ boxShadows: { xxl } }) => xxl,
                }}
            >
                <Container>
                    <MKBox py={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <MKBox mb={3}>
                                    <Typography variant="h6">
                                        Contact Information
                                    </Typography>
                                    <TextField
                                        label="Full Name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Typography variant="h6">Delivery to</Typography>
                                    <FormControl component="fieldset" margin="normal">
                                        <RadioGroup
                                            value={useNewAddress ? "new" : "saved"}
                                            onChange={(e) => setUseNewAddress(e.target.value === "new")}
                                        >
                                            <FormControlLabel value="saved" control={<Radio />} label="Deliver to Saved Address" />
                                            <FormControlLabel value="new" control={<Radio />} label="Deliver to New Address" />
                                        </RadioGroup>
                                    </FormControl>
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
                                                onChange={(e) => setStreetNumber(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: false,
                                                }}
                                            />
                                            <TextField
                                                label="Street"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: false,
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
                                            {/* <TextField
                                                label="Latitude"
                                                value={latitude || ""}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                            <TextField
                                                label="Longitude"
                                                value={longitude || ""}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            /> */}
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
                                </MKBox>
                            </Grid>
                            <Grid item xs={12} md={6}>

                                <MKBox mb={3}>
                                    <Typography variant="h6">Order Summary</Typography>
                                    <MKBox mt={2} component={Paper} p={2}>
                                        {/* Tổng phụ */}
                                        <Typography variant="body1" align="right" sx={{ fontWeight: "bold" }}>
                                            Subtotal: ${subtotal.toFixed(2)}
                                        </Typography>
                                        {/* Phí ship */}
                                        <Typography variant="body1" align="right" sx={{ fontWeight: "bold" }}>
                                            Shipping Fee: ${(shippingFee ?? 0).toFixed(2)}
                                        </Typography>
                                        {/* Tổng cộng */}
                                        <Typography variant="h6" align="right" sx={{ fontWeight: "bold", mt: 2 }}>
                                            Total: ${(subtotal + (shippingFee ?? 0)).toFixed(2)}
                                        </Typography>
                                    </MKBox>
                                </MKBox>
                                <MKBox mb={3}>
                                    <Typography variant="h6">Payment Method</Typography>
                                    <FormControl component="fieldset" margin="normal">
                                        <RadioGroup
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
                                            <FormControlLabel value="vnpay" control={<Radio />} label="VnPay" />
                                        </RadioGroup>
                                    </FormControl>
                                </MKBox>
                                <MKButton variant="gradient" color="success" fullWidth onClick={handleConfirmOrder}>
                                    Review and Confirm Order
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
