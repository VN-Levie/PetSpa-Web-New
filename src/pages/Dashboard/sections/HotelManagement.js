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

function HotelManagement() {
    const [activeTabHotel, setActiveTabHotel] = useState(() => {
        const savedTab = localStorage.getItem('activeTabHotel');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });
    const [rooms, setRooms] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [roomTypes, setRoomTypes] = useState([]);
    const [openRoomTypeDialog, setOpenRoomTypeDialog] = useState(false);
    const [currentRoomType, setCurrentRoomType] = useState(null);
    const { register, handleSubmit, reset } = useForm();
    const [imagePreview, setImagePreview] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);

    const handleTabTypeHotel = (event, newValue) => {
        setActiveTabHotel(newValue);
        localStorage.setItem('activeTabHotel', newValue);
    };

    const fetchRooms = async (page) => {
        try {
            const response = await get(`/api/admin/hotel/room/getAll`, {}, true);
            if (response.data.status === 200) {
                setRooms(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const fetchRoomTypes = async () => {
        try {
            const response = await get('/api/admin/hotel/roomType/getAll', {}, true);
            if (response.data.status === 200) {
                setRoomTypes(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching room types:", error);
        }
    };

    useEffect(() => {
        fetchRooms(page);
    }, [page]);

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const handleAddEditRoomType = (roomType = null) => {
        reset();
        setCurrentRoomType(roomType);
        setImagePreview(null);
        setOpenRoomTypeDialog(true);
    };

    const handleRoomTypeDialogClose = () => {
        setOpenRoomTypeDialog(false);
        setCurrentRoomType(null);
        setImagePreview(null);
    };

    const handleRoomTypeDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        const roomTypeDTO = {
            name: data.name,
            description: data.description,
            deleted: false
        };
        if (currentRoomType) {
            roomTypeDTO.id = currentRoomType.id;
            roomTypeDTO.deleted = currentRoomType.deleted;
        }
        if (data.file && data?.file[0]) {
            formData.append("file", data.file[0]);
        }
        formData.append("petHotelRoomTypeDTO", JSON.stringify(roomTypeDTO));
        try {
            const response = await post(`/api/admin/hotel/roomType/${currentRoomType ? 'edit' : 'add'}`, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentRoomType ? "Room type edited successfully" : "Room type added successfully", "success");
                fetchRoomTypes();
                handleRoomTypeDialogClose();
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the room type.";
            Swal.fire("Error!", message, "error");
        }
    };

    const handleToggleRoomTypeVisibility = (roomType) => {
        (async () => {
            const action = roomType.deleted ? 'SHOW' : 'HIDE';
            const step1 = await Swal.fire({
                title: 'Are you sure?',
                html: `This action will <strong>${action}</strong> the room type in the hotel.  <br>And <strong>ALL</strong> rooms in this type will be <strong>ALSO</strong> take action.`,
                icon: 'warning',
                showCancelButton: true,
            });

            if (step1.isConfirmed) {
                const step2 = await Swal.fire({
                    title: `Confirm to ${action} it?`,
                    text: `Are you sure you want to ${action} this room type?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                });

                if (step2.isConfirmed) {
                    try {
                        const formData = new FormData();
                        const roomTypeDTO = {
                            id: roomType.id,
                            name: roomType.name,
                            description: roomType.description,
                            deleted: roomType.deleted
                        };
                        formData.append("petHotelRoomTypeDTO", JSON.stringify(roomTypeDTO));
                        const response = await post(`/api/admin/hotel/roomType/delete`, formData, true);
                        if (response.data.status === 200) {
                            Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)}d!`, `The room type has been ${action}d.`, 'success');
                            fetchRoomTypes();
                        } else {
                            Swal.fire('Error!', response.data.message, 'error');
                        }
                    } catch (error) {
                        const message = error.response?.data?.message ?? `There was an error ${action}ing the room type.`;
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

    const handleAddEditRoom = (room = null) => {
        setCurrentRoom(room);
        setImagePreview(null);
        setOpenRoomDialog(true);
    };

    const handleRoomDialogClose = () => {
        setOpenRoomDialog(false);
        setCurrentRoom(null);
        setImagePreview(null);
    };

    const handleRoomDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        const petHotelRoomDTO = {
            name: data.name,
            description: data.description,
            price: data.price,
            deleted: false,
            bookingDetails: [],
        };
        const typeDTO = {
            id: data.roomTypeId,
            name: "",
            description: "",
            deleted: false
        };
        petHotelRoomDTO.roomType = typeDTO;
        if (currentRoom) {
            petHotelRoomDTO.id = currentRoom.id;
            petHotelRoomDTO.deleted = currentRoom.deleted;
        }

        formData.append("petHotelRoomDTO", JSON.stringify(petHotelRoomDTO));
        try {
            const response = await post(`/api/admin/hotel/room/${currentRoom ? 'edit' : 'add'}`, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentRoom ? "Room edited successfully" : "Room added successfully", "success");
                fetchRooms(page);
                handleRoomDialogClose();
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the room.";
            Swal.fire("Error!", message, "error");
        }
    };

    const handleToggleRoomVisibility = (room) => {
        (async () => {
            const action = room.deleted ? 'SHOW' : 'HIDE';
            const step1 = await Swal.fire({
                title: 'Are you sure?',
                html: `This action will ${action} the room in the hotel.`,
                icon: 'warning',
                showCancelButton: true,
            });

            if (step1.isConfirmed) {
                const step2 = await Swal.fire({
                    title: `Confirm to ${action} it?`,
                    text: `Are you sure you want to ${action} this room?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                });

                if (step2.isConfirmed) {
                    try {
                        const formData = new FormData();
                        const petHotelRoomDTO = {
                            id: room.id,
                            name: room.name,
                            description: room.description,
                            price: room.price,
                            deleted: room.deleted
                        };
                        formData.append("petHotelRoomDTO", JSON.stringify(petHotelRoomDTO));
                        const response = await post(`/api/admin/hotel/room/delete`, formData, true);
                        if (response.data.status === 200) {
                            Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)}d!`, `The room has been ${action}d.`, 'success');
                            fetchRooms(page);
                        } else {
                            Swal.fire('Error!', response.data.message, 'error');
                        }
                    } catch (error) {
                        const message = error.response?.data?.message ?? `There was an error ${action}ing the room.`;
                        Swal.fire('Error!', message, 'error');
                    }
                }
            }
        })();
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                Hotel Management
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabHotel} onChange={handleTabTypeHotel}>
                            <Tab label="Room Types" />
                            <Tab label="Rooms" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabHotel === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Hotel Room Types
                    </Typography>
                    <MKButton onClick={() => handleAddEditRoomType()} color="primary">Add Room Type</MKButton>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Room Type Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {roomTypes.map((roomType) => (
                                    <TableRow key={roomType.id}>
                                        <TableCell>{roomType.name}</TableCell>
                                        <TableCell>{roomType.description}</TableCell>
                                        <TableCell align="right">
                                            <MKButton onClick={() => handleAddEditRoomType(roomType)} color="warning" size="small">Edit</MKButton>
                                            <MKButton onClick={() => handleToggleRoomTypeVisibility(roomType)} color={roomType.deleted ? "success" : "error"} size="small">
                                                {roomType.deleted ? "Show" : "Hide"}
                                            </MKButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            )}
            {activeTabHotel === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Hotel Rooms
                    </Typography>
                    <MKButton onClick={() => handleAddEditRoom()} color="primary">Add Room</MKButton>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Room Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>{room.price}</TableCell>
                                        <TableCell>{room.description}</TableCell>
                                        <TableCell align="right">
                                            <MKButton onClick={() => handleAddEditRoom(room)} color="warning" size="small">Edit</MKButton>
                                            <MKButton onClick={() => handleToggleRoomVisibility(room)} color={room.deleted ? "success" : "error"} size="small">
                                                {room.deleted ? "Show" : "Hide"}
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
            <Dialog open={openRoomTypeDialog} onClose={handleRoomTypeDialogClose} sx={{ zIndex: 999 }}>
                <DialogTitle>{currentRoomType ? "Edit Room Type" : "Add Room Type"}</DialogTitle>
                <DialogContent>
                    <TextField
                        {...register("name")}
                        id="roomTypeName"
                        label="Room Type Name"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentRoomType?.name || ""}
                    />
                    <TextField
                        {...register("description")}
                        id="roomTypeDescription"
                        label="Description"
                        fullWidth
                        margin="normal"
                        defaultValue={currentRoomType?.description || ""}
                        multiline
                        required
                        rows={3}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRoomTypeDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit(handleRoomTypeDialogSubmit)} color="primary">{currentRoomType ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openRoomDialog} onClose={handleRoomDialogClose} sx={{ zIndex: 999 }}>
                <DialogTitle>{currentRoom ? "Edit Room" : "Add Room"}</DialogTitle>
                <DialogContent>
                    <TextField
                        {...register("name")}
                        id="roomName"
                        label="Room Name"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentRoom?.name || ""}
                    />
                    <TextField
                        {...register("description")}
                        id="roomDescription"
                        label="Description"
                        fullWidth
                        margin="normal"
                        defaultValue={currentRoom?.description || ""}
                        multiline
                        required
                        rows={3}
                    />
                    <TextField
                        {...register("price")}
                        id="roomPrice"
                        label="Price"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentRoom?.price || ""}
                        type="number"
                    />
                    <Select
                        {...register("roomTypeId")}
                        id="roomTypeId"
                        label="Room Type"
                        fullWidth
                        margin="normal"
                        required
                        defaultValue={currentRoom?.roomTypeId || ""}
                    >
                        {roomTypes.map((roomType) => (
                            <MenuItem key={roomType.id} value={roomType.id}>{roomType.name}</MenuItem>
                        ))}
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRoomDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit(handleRoomDialogSubmit)} color="primary">{currentRoom ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default HotelManagement;
