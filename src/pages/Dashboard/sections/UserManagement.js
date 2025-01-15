
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

function UserManagement() {
    const [activeTabUsers, setActiveTabUsers] = useState(() => {
        const savedTab = localStorage.getItem('activeTabUsers');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabTypeUsers = (event, newValue) => {
        setActiveTabUsers(newValue);
        localStorage.setItem('activeTabUsers', newValue);
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                User Management!
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabUsers} onChange={handleTabTypeUsers}>
                            <Tab label="User List" />
                            <Tab label="User Roles" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabUsers === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        User List
                    </Typography>
                    {/* Add your User List content here */}
                </CardContent>
            )}
            {activeTabUsers === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        User Roles
                    </Typography>
                    {/* Add your User Roles content here */}
                </CardContent>
            )}
        </>
    );
}

export default UserManagement;