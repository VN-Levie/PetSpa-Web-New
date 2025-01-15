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

function AppSettingsManagement() {
    const [activeTabAppSettings, setActiveTabAppSettings] = useState(() => {
        const savedTab = localStorage.getItem('activeTabAppSettings');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabTypeAppSettings = (event, newValue) => {
        setActiveTabAppSettings(newValue);
        localStorage.setItem('activeTabAppSettings', newValue);
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                App Settings
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabAppSettings} onChange={handleTabTypeAppSettings}>
                            <Tab label="Work Days" />
                            <Tab label="Work Hours" />
                            <Tab label="Rest Day" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabAppSettings === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Work Days
                    </Typography>
                    {/* Add your Work Days content here */}
                </CardContent>
            )}
            {activeTabAppSettings === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Work Hours
                    </Typography>
                    {/* Add your Work Hours content here */}
                </CardContent>
            )}
            {activeTabAppSettings === 2 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Rest Day
                    </Typography>
                    {/* Add your Rest Day content here */}
                </CardContent>
            )}
        </>
    );
}

export default AppSettingsManagement;
