import React, { useState, useEffect, useCallback } from "react";
import { Container, Grid, Typography, Card, TextField, FormControl, TableCell, TableBody, TableRow, TableContainer, Paper, Table, TableHead, Autocomplete } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { get, post, del } from 'services/apiService';
import Swal from "sweetalert2";

const BookAddress = ({ profile, addrCount, onCountChange }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [form, setForm] = useState({
        freeformAddress: "",
        streetNumber: "",
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
        latitude: null,
        longitude: null,
        name: profile?.name || "",
        phone: "0123456789",
    });
    const [addressOptions, setAddressOptions] = useState([]);
    const [addressRs, setAddressRs] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const loadAddresses = async () => {
        try {
            const response = await get('/api/auth/bookaddress?page=0&size=10', {}, true);
            if (response.data.status === 200) {
                setAddresses(response.data.data || []);
            } else {
                console.error("Error loading addresses:", response.data.message);
            }
        } catch (error) {
            console.error("Error loading addresses:", error);
        }
    };
    useEffect(() => {

        loadAddresses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSaveAddress = async () => {
        try {

            // Validate từng trường
            if (!form.name) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Name is required.',
                });
                return;
            }
            if (!form.phone) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Phone number is required.',
                });
                return;
            }
            if (!form.freeformAddress) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Address is required.',
                });
                return;
            }
            if (!form.streetNumber) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Street number is required.',
                });
                return;
            }
            if (!form.street) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Street is required.',
                });
                return;
            }
            if (!form.city) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'City is required.',
                });
                return;
            }
            if (!form.province) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Province is required.',
                });
                return;
            }
            if (!form.postalCode) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Postal code is required.',
                });
                return;
            }
            if (!form.country) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Country is required.',
                });
                return;
            }




            Swal.showLoading();
            const formData = new FormData();
            const addressBookDTO = {
                id: -1,
                userId: -1,
                freeformAddress: form.freeformAddress,
                streetNumber: form.streetNumber,
                street: form.street,
                city: form.city,
                province: form.province,
                postalCode: form.postalCode,
                country: form.country,
                latitude: form.latitude,
                longitude: form.longitude,
                name: form.name,
                phone: form.phone
            };
            if (selectedAddress) {
                addressBookDTO.id = selectedAddress.id;
            }
            formData.append("addressBookDTO", JSON.stringify(addressBookDTO));
            const endpoint = selectedAddress ? `/api/auth/bookaddress/edit` : '/api/auth/bookaddress/add';
            const response = await post(endpoint, formData, true);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Address saved successfully.',
                });
                // setAddresses(response.data.data || []);
                setForm({
                    freeformAddress: "",
                    streetNumber: "",
                    street: "",
                    city: "",
                    province: "",
                    postalCode: "",
                    country: "",
                    latitude: null,
                    longitude: null,
                    name: "",
                    phone: "",
                });
                setSelectedAddress(null);
                loadAddresses();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("Error saving address:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.',
            });
        }
    };

    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setForm(address);
    };

    const handleCancelEdit = () => {
        setSelectedAddress(null);
        setForm({
            freeformAddress: "",
            streetNumber: "",
            street: "",
            city: "",
            province: "",
            postalCode: "",
            country: "",
            latitude: null,
            longitude: null,
            name: profile?.name || "",
            phone: "0123456789",
        });
    };

    const handleDeleteAddress = async (id) => {
        try {
            const response = await del(`/api/auth/bookaddress/${id}`);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Address deleted successfully.',
                });
                setAddresses(response.data.data || []);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("Error deleting address:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again later.',
            });
        }
    };

    const handleAddressSearch = async (query) => {
        try {
            const response = await get(`/api/map/search-place?query=${query}`);
            if (response.data.status === 200) {
                const jsonResponse = JSON.parse(response.data.data);
                const results = jsonResponse.results;

                const addresses = results.map((result) => {
                    const poiName = result.poi?.name ? `${result.poi.name} - ` : "";
                    return `${poiName}${result.address.freeformAddress}`;
                });

                setAddressRs(results);
                setAddressOptions([...new Set(addresses)]);
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
        debounceSearch(form.freeformAddress);
    }, [form.freeformAddress, debounceSearch]);

    const handleAddressSelect = async (selectedAddress) => {
        setForm({ ...form, freeformAddress: selectedAddress });
        if (!selectedAddress) {
            setForm({
                ...form,
                streetNumber: "",
                street: "",
                city: "",
                province: "",
                postalCode: "",
                country: "",
                latitude: null,
                longitude: null,
            });
            return;
        }

        const selected = addressRs.find((result) => {
            const poiName = result.poi?.name ? `${result.poi.name} - ` : "";
            const fullAddress = `${poiName}${result.address.freeformAddress}`;
            return fullAddress === selectedAddress;
        });

        if (selected) {
            setForm({
                ...form,
                streetNumber: selected.address.streetNumber || "",
                street: selected.address.streetName || "",
                city: selected.address.municipality || "",
                province: selected.address.countrySubdivision || "",
                postalCode: selected.address.postalCode || "",
                country: selected.address.country || "",
                latitude: selected.position.lat || null,
                longitude: selected.position.lon || null,
            });
        }
    };

    return (
        <Card sx={{ p: 2, mx: { xs: 2, lg: 3 }, mt: -6, mb: 1, boxShadow: ({ boxShadows: { xxl } }) => xxl }}>
            <Container>
                <MKBox py={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <MKBox mb={3}>
                                <Typography variant="h6">Manage Addresses</Typography>
                                <TextField
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <Autocomplete
                                    freeSolo
                                    options={addressOptions}
                                    filterOptions={(x) => x}
                                    inputValue={form.freeformAddress || ""}
                                    onInputChange={(event, newInputValue) => {
                                        setForm({ ...form, freeformAddress: newInputValue || "" });
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
                                <TextField
                                    label="Street Number"
                                    name="streetNumber"
                                    value={form.streetNumber}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Street"
                                    name="street"
                                    value={form.street}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="City"
                                    name="city"
                                    value={form.city}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Province"
                                    name="province"
                                    value={form.province}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Postal Code"
                                    name="postalCode"
                                    value={form.postalCode}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    label="Country"
                                    name="country"
                                    value={form.country}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <MKButton variant="gradient" color="success" fullWidth onClick={handleSaveAddress}>
                                    {selectedAddress ? "Update Address" : "Add Address"}
                                </MKButton>
                                {selectedAddress && (
                                    <MKButton variant="gradient" color="warning" fullWidth onClick={handleCancelEdit} sx={{ mt: 2 }}>
                                        Cancel
                                    </MKButton>
                                )}
                            </MKBox>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <MKBox mb={3}>
                                <Typography variant="h6">Saved Addresses</Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Address</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {addresses.map((address) => (
                                                <TableRow key={address.id}>
                                                    <TableCell>{address.freeformAddress}</TableCell>
                                                    <TableCell>
                                                        <MKButton variant="text" color="info" onClick={() => handleEditAddress(address)}>
                                                            Edit
                                                        </MKButton>
                                                        <MKButton variant="text" color="error" onClick={() => handleDeleteAddress(address.id)}>
                                                            Delete
                                                        </MKButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </MKBox>
                        </Grid>
                    </Grid>
                </MKBox>
            </Container>
        </Card>
    );
};

export default BookAddress;
