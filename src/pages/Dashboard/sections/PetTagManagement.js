import React, { useState } from "react";
import {
    Container,
    Grid,
    AppBar,
    Tabs,
    Tab,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import MKTypography from "components/MKTypography";

function PetTagManagement() {
    const [activeTabPetTag, setActiveTabPetTag] = useState(() => {
        const savedTab = localStorage.getItem('activeTabPetTag');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabTypePetTag = (event, newValue) => {
        setActiveTabPetTag(newValue);
        localStorage.setItem('activeTabPetTag', newValue);
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                Pet Tag Management !
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabPetTag} onChange={handleTabTypePetTag}>
                            <Tab label="Categories" />
                            <Tab label="Tags" />
                            <Tab label="Orders" />
                            <Tab label="Chart" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabPetTag === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Pet Tag Categories
                    </Typography>
                    {/* Add your Pet Tag Categories content here */}
                </CardContent>
            )}
            {activeTabPetTag === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Pet Tags
                    </Typography>
                    {/* Add your Pet Tags content here */}
                </CardContent>
            )}
            {activeTabPetTag === 2 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Pet Tag Orders
                    </Typography>
                    {/* Add your Pet Tag Orders content here */}
                </CardContent>
            )}
            {activeTabPetTag === 3 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Pet Tag Chart
                    </Typography>
                    {/* Add your Pet Tag Chart content here */}
                </CardContent>
            )}
        </>
    );
}

export default PetTagManagement;
