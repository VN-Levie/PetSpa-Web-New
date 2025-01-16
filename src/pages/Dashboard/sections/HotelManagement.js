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

function HotelManagement() {
    const [activeTabHotel, setActiveTabHotel] = useState(() => {
        const savedTab = localStorage.getItem('activeTabHotel');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabTypeHotel = (event, newValue) => {
        setActiveTabHotel(newValue);
        localStorage.setItem('activeTabHotel', newValue);
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                Hotel Management !
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabHotel} onChange={handleTabTypeHotel}>
                            <Tab label="Rooms" />
                            <Tab label="Room Types" />

                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabHotel === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Hotel Categories
                    </Typography>
                    {/* Add your Hotel Categories content here */}
                </CardContent>
            )}
            {activeTabHotel === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Hotel Rooms
                    </Typography>
                    {/* Add your Hotel Rooms content here */}
                </CardContent>
            )}
            {activeTabHotel === 2 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Hotel Bookings
                    </Typography>
                    {/* Add your Hotel Bookings content here */}
                </CardContent>
            )}
            {activeTabHotel === 3 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Hotel Chart
                    </Typography>
                    {/* Add your Hotel Chart content here */}
                </CardContent>
            )}
        </>
    );
}

export default HotelManagement;
