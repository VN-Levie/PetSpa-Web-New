import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, Skeleton, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";

import MKBox from "components/MKBox";


import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MKAlert from "components/MKAlert";
import MKButton from "components/MKButton";
import MKPagination from "components/MKPagination";
import MKTypography from "components/MKTypography";
import { API_ENDPOINT } from "configs/AppConfig";
import { HorizontalTeamCardWithActions } from "examples/Cards/TeamCards/HorizontalTeamCard";
import { useEffect, useState } from "react";
import { get, post } from 'services/apiService';
import Swal from "sweetalert2";
const PetManager = ({ profile, petCount, onCountChange }) => {

    const [pets, setPets] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);
    const [petTypes, setPetTypes] = useState([]);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({ open: false, petId: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 3;
    const [searchParams, setSearchParams] = useState({ name: "", petTypeId: "" });
    const [petsLoading, setPetsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const timeCount = 500000;
    useEffect(() => {
        fetchPets();
        fetchPetTypes();
    }, []);
    useEffect(() => {

        const interval = setInterval(async () => {
            try {
                const petCountResponse = await get('/api/user-pet/count', {}, true);
                if (petCountResponse.data.status === 200 && petCountResponse.data.data !== petCount) {
                    onCountChange(petCountResponse.data.data);
                    fetchPets();
                    console.log("Pet count changed. Fetching pets...");

                }
            } catch (error) {
                console.error("Error fetching pet count:", error);
            }
        }, timeCount);

        return () => clearInterval(interval);

    }, [petCount]);
    const fetchPetImage = async (pet) => {
        let attempts = 0;
        while (attempts < 3) {
            try {
                const response = await get(`${API_ENDPOINT}${pet.avatarUrl}`, {}, false);
                if (response.status === 200) {
                    // attempts = 3;
                    return `${API_ENDPOINT}${pet.avatarUrl}`;
                }
            } catch (error) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return null;
    };

    const fetchPets = async (page = 0) => {
        setPetsLoading(true);
        try {
            const { name, petTypeId } = searchParams;
            const response = await get(`/api/user-pet/list?page=${page}&size=${pageSize}&name=${name}&petTypeId=${petTypeId}`, {}, true);
            if (response.data.status === 200) {
                const petsWithImages = await Promise.all(response.data.data.map(async (pet) => {
                    const image = await fetchPetImage(pet);
                    return { ...pet, image };
                }));
                setPets(petsWithImages);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
        } finally {
            setPetsLoading(false);
        }
    };

    const fetchPetTypes = async () => {
        try {
            const response = await get('/api/user-pet/pet-type');
            if (response.data.status === 200) {
                setPetTypes(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching pet types:", error);
        }
    };

    const handleEditPet = (pet) => {
        setCurrentPet(pet);
        reset({
            name: pet.name,
            description: pet.description,
            height: pet.height,
            weight: pet.weight,
            petTypeId: pet.petTypeId,
        });
        setImagePreview(null);
        setCurrentImage(pet.image || null);
        setOpenDialog(true);
    };

    const handleDeletePet = async (petId) => {
        setConfirmDeleteDialog({ open: true, petId });
    };

    const confirmDelete = async () => {
        try {
            await post(`${API_ENDPOINT}/api/user-pet/delete`, { id: confirmDeleteDialog.petId }, true);
            fetchPets();
            setConfirmDeleteDialog({ open: false, petId: null });
            Swal.fire("Deleted!", "Pet has been deleted.", "success");
        } catch (error) {
            console.error("Error deleting pet:", error);
            Swal.fire("Error!", "There was an error deleting the pet.", "error");
        }
    };

    const handleConfirmDeleteClose = () => {
        setConfirmDeleteDialog({ open: false, petId: null });
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setCurrentPet(null);
        setImagePreview(null);
        setCurrentImage(null);
        reset({
            name: null,
            description: null,
            height: null,
            weight: null,
            petTypeId: null,
        });
    };

    const handleDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const petDTO = {
            name: data.name,
            description: data.description,
            height: data.height,
            weight: data.weight,
            petTypeId: data.petTypeId,
            userId: profile.id,
            avatarUrl: "",
        };

        if (currentPet) {
            petDTO.id = currentPet.id;
        }

        formData.append("petDTO", JSON.stringify(petDTO));

        try {
            const endpoint = currentPet ? `${API_ENDPOINT}/api/user-pet/edit` : `${API_ENDPOINT}/api/user-pet/add`;
            const response = await post(endpoint, formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", currentPet ? "Pet edited successfully" : "Pet added successfully", "success");
                fetchPets();
                handleDialogClose();
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the pet.";
            Swal.fire("Error!", message, "error");
        }
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
            reader.onloadend = (e) => {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);

                // Kiểm tra magic bytes
                if (!isValidImageMagicBytes(uint8Array)) {
                    Swal.fire("Error!", "Invalid file content. This is not a valid image.", "error");
                    setImagePreview(null);
                    event.target.value = null;
                    return;
                }

                isValid = true;

            };
            // reader.readAsDataURL(file);
            reader.readAsArrayBuffer(file);
            const reader2 = new FileReader();
            reader2.onloadend = () => {
                if (isValid) {
                    setImagePreview(reader2.result);
                } else {
                    setImagePreview(null);
                }

            };
            reader2.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
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
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchPets(newPage);
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchPets();
    };

    const handleClearFilters = () => {
        setSearchParams({ name: "", petTypeId: "" });
        setPage(0);
        fetchPets(0);
    };

    return (
        <>
            <Container>
                <MKTypography variant="h4" mb={2}>Manage Pets</MKTypography>
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
                                label="Filter by Pet Type"
                                name="petTypeId"
                                value={searchParams.petTypeId}
                                onChange={handleSearchChange}
                                fullWidth
                                displayEmpty
                                sx={{ height: "100%" }}
                            >
                                <MenuItem value="">
                                    <em>All Pet Types</em>
                                </MenuItem>
                                {petTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
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
                <MKButton variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Add Pet</MKButton>
                {petsLoading ? (
                    <MKBox display="flex" justifyContent="center" alignItems="center" height="50vh">
                        <CircularProgress />
                    </MKBox>
                ) : (
                    <Grid container spacing={3} mt={2}>
                        {pets.map((pet) => (


                            <Grid item xs={12} sm={12} lg={6} key={pet.id}>
                                <HorizontalTeamCardWithActions
                                    image={pet.image || <Skeleton variant="rectangular" width={210} height={118} />}
                                    name={pet.name}
                                    position={{ color: "info", label: `Height: ${pet.height} cm, Weight: ${pet.weight} kg` }}
                                    description={pet.description}
                                    onEdit={() => handleEditPet(pet)}
                                    onDelete={() => handleDeletePet(pet.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}



                <MKBox display="flex" justifyContent="space-between" mt={2}>
                    <Grid container item justifyContent="center" xs={12} lg={6} mx="auto" height="100%">
                        <MKPagination>
                            <MKPagination item onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                                <Icon>keyboard_arrow_left</Icon>
                            </MKPagination>
                            {[...Array(totalPages)].map((_, index) => (
                                <MKPagination item key={index} active={index === page} onClick={() => handlePageChange(index)}>
                                    {index + 1}
                                </MKPagination>
                            ))}
                            <MKPagination item onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1}>
                                <Icon>keyboard_arrow_right</Icon>
                            </MKPagination>
                        </MKPagination>
                    </Grid>
                </MKBox>
            </Container>
            <Dialog open={openDialog} onClose={handleDialogClose} sx={{ zIndex: 999 }}>
                <DialogTitle>{currentPet ? "Edit Pet" : "Add Pet"}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(handleDialogSubmit)}>
                        <TextField
                            {...register("name")}
                            label="Pet Name"
                            fullWidth
                            margin="normal"
                            required
                            defaultValue={currentPet?.name || ""}
                        />
                        <TextField
                            {...register("description")}
                            label="Description"
                            fullWidth
                            margin="normal"
                            required
                            defaultValue={currentPet?.description || ""}
                        />
                        <TextField
                            {...register("height")}
                            label="Height (cm)"
                            type="number"
                            fullWidth
                            margin="normal"
                            required
                            defaultValue={currentPet?.height || ""}
                        />
                        <TextField
                            {...register("weight")}
                            label="Weight (kg)"
                            type="number"
                            fullWidth
                            margin="normal"
                            required
                            defaultValue={currentPet?.weight || ""}
                        />
                        <Select
                            {...register("petTypeId")}
                            label="Pet Type"
                            fullWidth
                            height="40px"
                            margin="dense"
                            required
                            defaultValue={currentPet?.petTypeId || ""}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>Select Pet Type</em>;
                                }
                                const selectedType = petTypes.find(type => type.id === selected);
                                return selectedType ? selectedType.name : <em>Select Pet Type</em>;
                            }}
                        >
                            <MenuItem disabled value="">
                                <em>Select Pet Type</em>
                            </MenuItem>
                            {petTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {currentPet && currentImage && (
                            <>
                                <MKTypography variant="body2" color="inherit" style={{ marginTop: "10px" }}>
                                    Current Pet Image:
                                </MKTypography>
                                <img src={currentImage} alt="Pet" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto", borderRadius: "6px" }} />
                            </>
                        )}
                        <input
                            name={register("file").name}
                            ref={register("file").ref}
                            onChange={(e) => {
                                register("file").onChange(e);
                                handleImageChange(e);
                            }}
                            onBlur={register("file").onBlur}
                            type="file"
                            accept="image/*"
                            required={!currentPet}
                        />
                        {imagePreview && (
                            <>
                                <MKTypography variant="body2" color="inherit" style={{ marginTop: "10px" }}>
                                    Preview Image:
                                </MKTypography>
                                <MKAlert color="light" textAlign="center">
                                    <img src={imagePreview} alt="Preview" style={{ width: "50%", display: "block", marginLeft: "auto", marginRight: "auto", borderRadius: "6px" }} />
                                </MKAlert>
                            </>
                        )}
                        <DialogActions>
                            <MKButton onClick={handleDialogClose} color="secondary">Cancel</MKButton>
                            <MKButton type="submit" variant="contained" color="primary">{currentPet ? "Save" : "Add"}</MKButton>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={confirmDeleteDialog.open} onClose={handleConfirmDeleteClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this pet?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MKButton onClick={handleConfirmDeleteClose} color="secondary">Cancel</MKButton>
                    <MKButton onClick={confirmDelete} color="primary">Delete</MKButton>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default PetManager;
