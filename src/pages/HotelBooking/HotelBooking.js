import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Card, Select, MenuItem, TextField, FormControl, InputLabel } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { get, post } from 'services/apiService';
import bgImage from "assets/images/bg-about-us.jpg";
import MKTypography from "components/MKTypography";
import Swal from "sweetalert2";
import { useAuth } from "contexts/AuthContext";

function HotelBooking() {
    const { user } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState("");
    const [pickupType, setPickupType] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffType, setDropoffType] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [ip, setIp] = useState("");
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    const minDate2 = new Date();
    const maxDate2 = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await get('/api/user-pet/list', {}, true);
                if (response.data.status === 200) {
                    setPets(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        // Gọi API của ipify để lấy địa chỉ IP
        fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
                setIp(data.ip); // Cập nhật IP vào state
                console.log("IP address:", data.ip);
            })
            .catch((error) => {
                console.error("Error fetching IP address:", error);
            });
    }, []);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await get('/api/public/hotel/roomType/getAll', {}, true);
                if (response.status === 200) {
                    setRoomTypes(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching room types:", error);
            }
        };

        fetchRoomTypes();
    }, []);

    useEffect(() => {
        if (selectedRoomType) {
            const fetchRooms = async () => {
                try {
                    const response = await get(`/api/public/hotel/room/getByRoomType?roomTypeId=${selectedRoomType}`, {}, true);
                    if (response.status === 200) {
                        setRooms(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching rooms:", error);
                }
            };

            fetchRooms();
        }
    }, [selectedRoomType]);
    useEffect(() => {
        const checkInDate = new Date(bookingDate);
        const checkOutDate = new Date(endDate);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const room = rooms.find(r => r.id === selectedRoom);
        var totalAmount = 0;
        if (room != null && room?.price != null && diffDays > 0) {
            totalAmount = room.price * diffDays;

        }
        setTotalAmount(totalAmount);
        console.log("Total amount:", totalAmount);
    }, [bookingDate, endDate, selectedRoom]);

    const handleRoomTypeChange = (e) => {
        const roomTypeId = e.target.value;
        setSelectedRoomType(roomTypeId);
        const roomType = roomTypes.find(rt => rt.id === roomTypeId);
        setRoomDescription(roomType ? roomType.description : "");
    };

    const handleBooking = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            if (bookingDate < today) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Check-in date cannot be in the past.',
                });
                return;
            }
            if (endDate < bookingDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Check-out date must be greater than or equal to check-in date.',
                });
                return;
            }
            const checkInDate = new Date(bookingDate);
            const checkOutDate = new Date(endDate);
            const diffTime = Math.abs(checkOutDate - checkInDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 14) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'The maximum stay duration is 14 days.',
                });
                return;
            }
            if (!selectedPet) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select a pet.',
                });
                return;
            }
            if (!bookingDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select a booking date.',
                });
                return;
            }
            if (!selectedRoomType) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select a room type.',
                });
                return;
            }

            if (!selectedRoom) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select a room.',
                });
                return;
            }

            if (!paymentMethod) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select a payment method.',
                });
                return;
            }

            if (!endDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please select a check-out date.',
                });
                return;
            }

            const room = rooms.find(r => r.id === selectedRoom);
            const totalAmount = room.price * diffDays;
            setTotalAmount(totalAmount);
            console.log("Total amount:", totalAmount);

            const bookingDetails = {
                userId: user.id,
                paymentMethod: paymentMethod.toUpperCase(),
                goodsType: "HOTEL",
                cart: [
                    {
                        id: selectedRoom,
                        quantity: 1,
                    },
                ],
                subtotal: totalAmount,
                shippingFee: 0,
                total: totalAmount,
                name: user.name,
                phone: user.phone,
                address: "",
                startTime: "", // Add selected time to order details
                date: bookingDate, // Add selected date to order details
                endDate: endDate,
                petId: selectedPet,
            };

            console.log("bookingDetails:", bookingDetails);

            const formData = new FormData();
            formData.append("orderRequestDTO", JSON.stringify(bookingDetails));

            const response = await post("/api/user-order/createOrder", formData, true);
            if (response.data.status === 200) {
                console.log("Booking confirmed:", response.data);
                if (paymentMethod === "COD") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Your booking has been confirmed successfully!',
                    });
                    // Clear the form
                    setSelectedPet("");
                    setBookingDate("");
                    setEndDate("");
                    setSelectedRoomType("");
                    setSelectedRoom("");
                    setPaymentMethod("");
                    setTotalAmount(0);
                    return;
                }
                const id = response.data.data.id;
                const formData2 = new FormData();
                formData2.append("orderId", id);
                formData2.append("ip", ip);
                const response2 = await post("/api/payment/create-payment", formData2, true);
                if (response2.data.status === 200) {
                    console.log("Payment gate url:", response2.data.data);
                    window.location.href = response2.data.data; // Redirect to the payment URL
                }
            } else {
                console.error("Error confirming booking:", response.data.message);
            }
        } catch (error) {
            console.error("Error confirming booking:", error);
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
            }
        }
    };

    const handleCheckInDateChange = (e) => {
        const newCheckInDate = e.target.value;
        setBookingDate(newCheckInDate);
        if (newCheckInDate > endDate) {
            setEndDate(newCheckInDate);
        }
    };

    const handleCheckOutDateChange = (e) => {
        const newCheckOutDate = e.target.value;
        setEndDate(newCheckOutDate);
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
                            Hotel Booking
                        </MKTypography>
                        <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
                            Book a stay for your pet with ease.
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
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Select Pet</InputLabel>
                            <Select
                                value={selectedPet}
                                onChange={(e) => setSelectedPet(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                {pets.map((pet) => (
                                    <MenuItem key={pet.id} value={pet.id}>
                                        {pet.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Check-in Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={bookingDate}
                            onChange={handleCheckInDateChange}
                            inputProps={{
                                min: minDate.toISOString().split('T')[0],
                                max: maxDate.toISOString().split('T')[0],
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Check-out Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={handleCheckOutDateChange}
                            inputProps={{
                                min: bookingDate,
                                max: maxDate.toISOString().split('T')[0],
                            }}
                        />
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Select Room Type</InputLabel>
                            <Select
                                value={selectedRoomType}
                                onChange={handleRoomTypeChange}
                                sx={{ height: '80%' }}
                            >
                                {roomTypes.map((roomType) => (
                                    <MenuItem key={roomType.id} value={roomType.id}>
                                        {roomType.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="body1" margin="normal">
                            {roomDescription}
                        </Typography>
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Select Room</InputLabel>
                            <Select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                {rooms.map((room) => (
                                    <MenuItem key={room.id} value={room.id}>
                                        {room.name} - ${room.price}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography variant="h6" margin="normal">
                            Total Amount: ${totalAmount}
                        </Typography>
                        <FormControl fullWidth margin="normal" sx={{ height: '56px' }}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                sx={{ height: '80%' }}
                            >
                                <MenuItem value="COD">Pay at store</MenuItem>
                                <MenuItem value="VNPAY">VNPay</MenuItem>
                            </Select>
                        </FormControl>
                        <MKButton variant="gradient" color="success" fullWidth onClick={handleBooking}>
                            Confirm Booking
                        </MKButton>
                    </MKBox>
                </Container>
            </Card>
        </>
    );
}

export default HotelBooking;
