// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, DialogContentText, Skeleton } from "@mui/material";
import { useForm } from "react-hook-form";

import MKBox from "components/MKBox";


import Container from "@mui/material/Container";
import Posts from "pages/LandingPages/Author/sections/Posts";
import Contact from "pages/LandingPages/Author/sections/Contact";
import Footer from "pages/LandingPages/Author/sections/Footer";
import { useAuth } from "contexts/AuthContext";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MKAvatar from "components/MKAvatar";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import team1 from "assets/images/team-5.jpg";
import team2 from "assets/images/bruce-mars.jpg";
import team3 from "assets/images/ivana-squares.jpg";
import team4 from "assets/images/ivana-square.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import post1 from "assets/images/examples/testimonial-6-2.jpg";
import post2 from "assets/images/examples/testimonial-6-3.jpg";
import post3 from "assets/images/examples/blog-9-4.jpg";
import post4 from "assets/images/examples/blog2.jpg";
import bgImage from "assets/images/city-profile.jpg";
import { API_ENDPOINT } from "configs/AppConfig";
import profilePicture from "assets/images/bruce-mars.jpg";
import HorizontalTeamCard from "examples/Cards/TeamCards/HorizontalTeamCard";
import TransparentBlogCard from "examples/Cards/BlogCards/TransparentBlogCard";
import BackgroundBlogCard from "examples/Cards/BlogCards/BackgroundBlogCard";
import { HorizontalTeamCardWithActions } from "examples/Cards/TeamCards/HorizontalTeamCard";
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard";
import { get, post } from 'services/apiService';
import Swal from "sweetalert2";
import MKAlert from "components/MKAlert";

function Author() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [petCount, setPetCount] = useState(0);
    const { register, handleSubmit, reset } = useForm();
    const [pets, setPets] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);
    const [petTypes, setPetTypes] = useState([]);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({ open: false, petId: null });
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth/sign-in");
        } else if (user) {
            const fetchProfile = async () => {
                try {
                    const profileResponse = await get('/api/auth/profile', {}, true);
                    if (profileResponse.data.status === 200) {
                        setProfile(profileResponse.data.data);

                        const petCountResponse = await get('/api/user-pet/count', {}, true);
                        if (petCountResponse.data.status === 200) {
                            setPetCount(petCountResponse.data.data);
                        }

                        fetchPets();
                        fetchPetTypes();
                    } else {
                        navigate("/auth/sign-out");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchProfile();
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (loading) {
            console.log("Loading...");

            return;
        }
        if (user && !loading) {
            const interval = setInterval(async () => {
                try {
                    const petCountResponse = await get('/api/user-pet/count', {}, true);
                    if (petCountResponse.data.status === 200 && petCountResponse.data.data !== petCount) {
                        setPetCount(petCountResponse.data.data);
                        fetchPets();
                    }
                } catch (error) {
                    console.error("Error fetching pet count:", error);
                }
            }, 500000);

            return () => clearInterval(interval);
        }
    }, [user, petCount, loading]);


    const useScrollToTop = (dependency) => {
        useEffect(() => {
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        }, [dependency]);
    };
    useScrollToTop(user);

    const fetchPetImage = async (pet) => {
        let attempts = 0;
        while (attempts < 3) {
            try {
                const response = await get(`${API_ENDPOINT}${pet.avatarUrl}`, {}, false);
                if (response.status === 200) {
                    attempts = 3;
                    return `${API_ENDPOINT}${pet.avatarUrl}`;
                }
            } catch (error) {
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return null;
    };

    const fetchPets = async () => {
        try {
            const response = await get('/api/user-pet/list', {}, true);
            if (response.data.status === 200) {
                const petsWithImages = await Promise.all(response.data.data.map(async (pet) => {
                    const image = await fetchPetImage(pet);
                    return { ...pet, image };
                }));
                setPets(petsWithImages);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    if (loading || !profile) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </div>
        );
    }
    return (
        <>

            <MKBox bgColor="white">
                <MKBox
                    minHeight="25rem"
                    width="100%"
                    sx={{
                        backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                            `${linearGradient(
                                rgba(gradients.dark.main, 0.8),
                                rgba(gradients.dark.state, 0.8)
                            )}, url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "grid",
                        placeItems: "center",
                    }}
                />
                <Card
                    sx={{
                        p: 2,
                        mx: { xs: 2, lg: 3 },
                        mt: -8,
                        mb: 4,
                        backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
                        backdropFilter: "saturate(200%) blur(30px)",
                        boxShadow: ({ boxShadows: { xxl } }) => xxl,
                    }}
                >
                    {/* <ProfileSection user={profile} /> */}
                    <MKBox component="section" py={{ xs: 6, sm: 12 }}>
                        <Container>
                            <Grid container item xs={12} justifyContent="center" mx="auto">
                                <MKBox mt={{ xs: -16, md: -20 }} textAlign="center">
                                    <MKAvatar src={profilePicture} alt="Burce Mars" size="xxl" shadow="xl" />
                                </MKBox>
                                <Grid container justifyContent="center" py={6}>
                                    <Grid item xs={12} md={7} mx={{ xs: "auto", sm: 6, md: 1 }}>
                                        <MKBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <MKTypography variant="h3">
                                                {profile.name ?? "Pet Spa"}

                                            </MKTypography>
                                            <MKButton variant="outlined" color="info" size="small">
                                                Follow
                                            </MKButton>
                                        </MKBox>
                                        <Grid container spacing={3} mb={3}>
                                            <Grid item>
                                                <MKTypography component="span" variant="body2" color="text">
                                                    {profile.email ?? "Email"}
                                                </MKTypography>
                                            </Grid>
                                            <Grid item>
                                                <MKTypography component="span" variant="body2" fontWeight="bold">
                                                    Role: &nbsp;
                                                </MKTypography>
                                                <MKTypography component="span" variant="body2" color="text">
                                                    {profile.role ? (profile.role === "USER" ? "User" : "Admin") : "Role"}
                                                </MKTypography>
                                            </Grid>
                                            <Grid item>
                                                <MKTypography component="span" variant="body2" fontWeight="bold">
                                                    {petCount}&nbsp;
                                                </MKTypography>
                                                <MKTypography component="span" variant="body2" color="text">
                                                    Pet{petCount !== 1 ? "s" : ""}
                                                </MKTypography>
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Container>
                        <Container>
                            <MKTypography variant="h4" mb={2}>Manage Pets</MKTypography>
                            <MKButton variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Add Pet</MKButton>
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
                                            <MKTypography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
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
                                            <MKTypography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
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

                    </MKBox>

                </Card>

            </MKBox>
        </>
    );
}

export default Author;
