// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, DialogContentText } from "@mui/material";
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
                    // navigate("/auth/sign-out");
                }
            };
            fetchProfile();
        }
    }, [user, loading, navigate]);

    const fetchPets = async () => {
        try {
            const response = await get('/api/user-pet/list', {}, true);
            if (response.data.status === 200) {
                setPets(response.data.data);
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
        setOpenDialog(true);
    };

    const handleDeletePet = async (petId) => {
        setConfirmDeleteDialog({ open: true, petId });
    };

    const confirmDelete = async () => {
        try {
            await axios.post(`${API_ENDPOINT}/api/user-pet/delete`, { id: confirmDeleteDialog.petId }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }, true);
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
    };

    const handleDialogSubmit = async (data) => {
        Swal.showLoading();
        const formData = new FormData();
        formData.append("file", data.file[0]);


        if (currentPet) {
            formData.append("petDTO", JSON.stringify({
                id: currentPet.id,
                name: data.name,
                description: data.description,
                height: data.height,
                weight: data.weight,
                petTypeId: data.petTypeId,
                userId: profile.id,
                avatarUrl: "",
            }));
        } else {
            formData.append("petDTO", JSON.stringify({
                name: data.name,
                description: data.description,
                height: data.height,
                weight: data.weight,
                petTypeId: data.petTypeId,
                userId: profile.id,
                avatarUrl: "",
            }));
        }

        try {
            const endpoint = currentPet ? `${API_ENDPOINT}/api/user-pet/edit` : `${API_ENDPOINT}/api/user-pet/add`;
            const response = await axios.post(endpoint, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status === 200) {
                Swal.fire("Success!", currentPet ? "Pet edited successfully" : "Pet added successfully", "success");
                fetchPets();
                handleDialogClose();
            }
        } catch (error) {
            console.error("Error submitting pet:", error.response.data.message);
            var message = error.response.data.message ?? "There was an error submitting the pet.";
            Swal.fire("Error!", message, "error");
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
                                            image={`${API_ENDPOINT}${pet.avatarUrl}`}
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
                                    <input
                                        name={register("file").name}
                                        ref={register("file").ref}
                                        onChange={register("file").onChange}
                                        onBlur={register("file").onBlur}
                                        type="file"
                                        accept="image/*"
                                        required={!currentPet}
                                    />
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
                        <Container>
                            <Grid container>
                                <Grid item xs={12} md={8} sx={{ mb: 6 }}>
                                    <MKTypography variant="h3" color="white">
                                        The Executive Team
                                    </MKTypography>
                                    <MKTypography variant="body2" color="white" opacity={0.8}>
                                        There&apos;s nothing I really wanted to do in life that I wasn&apos;t able to get good
                                        at. That&apos;s my skill.
                                    </MKTypography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                {/* <Grid item xs={12} md={6} lg={4}>
                                    <MKBox mt={3}>
                                        <HorizontalTeamCard
                                            image={team1}
                                            title="Single room in the center of the city"
                                            description="As Uber works through a huge amount of internal management turmoil, the company is also consolidating more of its international business."
                                            categories={["Private Room", "1 Guest", "1 Sofa"]}
                                            action='View'
                                        />
                                    </MKBox>
                                </Grid> */}
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={1}>
                                        <HorizontalTeamCard
                                            image={team1}
                                            name="Emma Roberts"
                                            position={{ color: "info", label: "UI Designer" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={1}>
                                        <HorizontalTeamCard
                                            image={team2}
                                            name="William Pearce"
                                            position={{ color: "info", label: "Boss" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={{ xs: 1, lg: 0 }}>
                                        <HorizontalTeamCard
                                            image={team3}
                                            name="Ivana Flow"
                                            position={{ color: "info", label: "Athlete" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <MKBox mb={{ xs: 1, lg: 0 }}>
                                        <HorizontalTeamCard
                                            image={team4}
                                            name="Marquez Garcia"
                                            position={{ color: "info", label: "JS Developer" }}
                                            description="Artist is a term applied to a person who engages in an activity deemed to be an art."
                                        />
                                    </MKBox>
                                </Grid>
                            </Grid>
                        </Container>
                    </MKBox>
                    <MKBox component="section" py={2}>
                        <Container>
                            <Grid container item xs={12} lg={6}>
                                <MKTypography variant="h3" mb={6}>
                                    Check my latest blogposts
                                </MKTypography>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <TransparentBlogCard
                                        image={post1}
                                        title="Rover raised $65 million"
                                        description="Finding temporary housing for your dog should be as easy as renting an Airbnb. That’s the idea behind Rover ..."
                                        action={{
                                            type: "internal",
                                            route: "/pages/blogs/author",
                                            color: "info",
                                            label: "read more",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <TransparentBlogCard
                                        image={post2}
                                        title="MateLabs machine learning"
                                        description="If you’ve ever wanted to train a machine learning model and integrate it with IFTTT, you now can with ..."
                                        action={{
                                            type: "internal",
                                            route: "/pages/blogs/author",
                                            color: "info",
                                            label: "read more",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <TransparentBlogCard
                                        image={post3}
                                        title="MateLabs machine learning"
                                        description="If you’ve ever wanted to train a machine learning model and integrate it with IFTTT, you now can with ..."
                                        action={{
                                            type: "internal",
                                            route: "/pages/blogs/author",
                                            color: "info",
                                            label: "read more",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <BackgroundBlogCard
                                        image={post4}
                                        title="Flexible work hours"
                                        description="Rather than worrying about switching offices every couple years, you stay in the same place."
                                        action={{
                                            type: "internal",
                                            route: "/pages/blogs/author",
                                            label: "read more",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </MKBox>
                </Card>
                <Contact />
                <Footer />
            </MKBox>
        </>
    );
}

export default Author;
