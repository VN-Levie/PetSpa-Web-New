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

function FeedbackManagement() {
    const [activeTabFeedback, setActiveTabFeedback] = useState(() => {
        const savedTab = localStorage.getItem('activeTabFeedback');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabTypeFeedback = (event, newValue) => {
        setActiveTabFeedback(newValue);
        localStorage.setItem('activeTabFeedback', newValue);
    };

    return (
        <>
            <MKTypography container variant="h3" align="center" sx={{ mt: 1, mb: 2 }}>
                Feedback Management !
            </MKTypography>
            <Container>
                <Grid container item justifyContent="center" xs={12} lg={8} mx="auto">
                    <AppBar position="static">
                        <Tabs value={activeTabFeedback} onChange={handleTabTypeFeedback}>
                            <Tab label="Feedback List" />
                            <Tab label="Feedback Chart" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>
            {activeTabFeedback === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Feedback List
                    </Typography>
                    {/* Add your Feedback List content here */}
                </CardContent>
            )}
            {activeTabFeedback === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Feedback Chart
                    </Typography>
                    {/* Add your Feedback Chart content here */}
                </CardContent>
            )}
        </>
    );
}

export default FeedbackManagement;
