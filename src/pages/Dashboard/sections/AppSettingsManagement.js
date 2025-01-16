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
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import MKTypography from "components/MKTypography";
import axios from "axios";
import { get, post } from "services/apiService";
import Swal from "sweetalert2";

function AppSettingsManagement() {
    const [activeTabAppSettings, setActiveTabAppSettings] = useState(() => {
        const savedTab = localStorage.getItem('activeTabAppSettings');
        return savedTab !== null ? parseInt(savedTab, 10) : 0;
    });

    const handleTabTypeAppSettings = (event, newValue) => {
        setActiveTabAppSettings(newValue);
        localStorage.setItem('activeTabAppSettings', newValue);
    };

    const initialWorkingHours = {
        Monday: { open: "", close: "", rest: "", fullRest: false },
        Tuesday: { open: "", close: "", rest: "", fullRest: false },
        Wednesday: { open: "", close: "", rest: "", fullRest: false },
        Thursday: { open: "", close: "", rest: "", fullRest: false },
        Friday: { open: "", close: "", rest: "", fullRest: false },
        Saturday: { open: "", close: "", rest: "", fullRest: false },
        Sunday: { open: "", close: "", rest: "", fullRest: false },
    };

    const [workingHours, setWorkingHours] = useState(initialWorkingHours);

    useEffect(() => {
        const fetchWorkingHours = async () => {
            try {
                const response = await get('/api/admin/setting/get-by-key?key=weeklyWorkingHours', {}, true);
                const data = JSON.parse(response.data.data);
                const formattedData = data.reduce((acc, day) => {
                    acc[day.dayOfWeek] = {
                        open: day.openTime || "",
                        close: day.closeTime || "",
                        rest: day.restStartTime && day.restEndTime ? `${day.restStartTime} - ${day.restEndTime}` : "",
                        fullRest: day.isRestDay,
                    };
                    return acc;
                }, {});
                setWorkingHours(formattedData);
            } catch (error) {
                console.error("Error fetching working hours:", error);
            }
        };

        fetchWorkingHours();
    }, []);

    const handleWorkingHoursChange = (day, field, value) => {
        setWorkingHours({
            ...workingHours,
            [day]: {
                ...workingHours[day],
                [field]: field === "fullRest" ? value.target.checked : value.target.value,
            },
        });
    };

    const handleSaveChanges = async () => {
        Swal.showLoading();
        try {
            const formattedWorkingHours = Object.keys(workingHours).map(day => ({
                dayOfWeek: day.toUpperCase(),
                openTime: workingHours[day].open || null,
                closeTime: workingHours[day].close || null,
                restStartTime: workingHours[day].rest ? workingHours[day].rest.split(" - ")[0] : null,
                restEndTime: workingHours[day].rest ? workingHours[day].rest.split(" - ")[1] : null,
                isRestDay: workingHours[day].fullRest,
            }));

            const response = await post('/api/admin/setting/working-hours/update', formattedWorkingHours, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", "Weekly working hours updated successfully", "success");
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error updating the weekly working hours.";
            Swal.fire("Error!", message, "error");
        }
    };

    const [restDays, setRestDays] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newRestDay, setNewRestDay] = useState({ date: "", reason: "" });

    useEffect(() => {
        const fetchRestDays = async () => {
            try {
                const response = await get('/api/admin/setting/get-by-key?key=specificRestDays', {}, true);
                const data = JSON.parse(response.data.data);
                setRestDays(data);
            } catch (error) {
                console.error("Error fetching rest days:", error);
            }
        };

        fetchRestDays();
    }, []);

    const handleOpenDialog = () => {
        setNewRestDay({ date: "", reason: "" });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveRestDay = async () => {
        Swal.showLoading();
        try {
            const formData = new FormData();
            const restDay = {
                date: newRestDay.date,
                reason: newRestDay.reason,
            };
            formData.append("restDayDTO", JSON.stringify(restDay));

            const response = await post('/api/admin/setting/specific-rest-day/add', formData, true);
            if (response.data.status === 200) {
                Swal.fire("Success!", "Specific rest day added successfully", "success");
                setRestDays([...restDays, newRestDay]);
                setOpenDialog(false);
            } else {
                Swal.fire("Error!", response.data.message, "error");
            }
        } catch (error) {
            const message = error.response?.data?.message ?? "There was an error submitting the specific rest day.";
            Swal.fire("Error!", message, "error");
        }
    };

    const handleDeleteRestDay = async (index) => {
        const restDayToDelete = restDays[index];
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this rest day?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            Swal.showLoading();
            try {
                const formData = new FormData();
                formData.append("restDayDTO", JSON.stringify(restDayToDelete));

                const response = await post('/api/admin/setting/specific-rest-day/delete', formData, true);
                if (response.data.status === 200) {
                    Swal.fire("Deleted!", "The specific rest day has been deleted.", "success");
                    const updatedRestDays = restDays.filter((_, i) => i !== index);
                    setRestDays(updatedRestDays);
                } else {
                    Swal.fire("Error!", response.data.message, "error");
                }
            } catch (error) {
                const message = error.response?.data?.message ?? "There was an error deleting the specific rest day.";
                Swal.fire("Error!", message, "error");
            }
        }
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
                            <Tab label="Work Hours" />
                            <Tab label="Rest Day" />
                        </Tabs>
                    </AppBar>
                </Grid>
            </Container>

            {activeTabAppSettings === 0 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Weekly Working Hours Configuration
                    </Typography>
                    {Object.keys(workingHours).map((day) => (
                        <Grid container spacing={3} key={day} alignItems="center" sx={{ mb: 2 }}>
                            <Grid item xs={2}>
                                <Typography>{day}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label="Open Time"
                                    type="time"
                                    value={workingHours[day].open}
                                    onChange={(e) => handleWorkingHoursChange(day, "open", e)}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 300 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label="Close Time"
                                    type="time"
                                    value={workingHours[day].close}
                                    onChange={(e) => handleWorkingHoursChange(day, "close", e)}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 300 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Rest Time (Optional)"
                                    type="text"
                                    value={workingHours[day].rest}
                                    onChange={(e) => handleWorkingHoursChange(day, "rest", e)}
                                    placeholder="12:00 PM - 01:00 PM"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={workingHours[day].fullRest}
                                            onChange={(e) => handleWorkingHoursChange(day, "fullRest", e)}
                                        />
                                    }
                                    label="Full Rest Day"
                                />
                            </Grid>
                        </Grid>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </CardContent>
            )}
            {activeTabAppSettings === 1 && (
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Specific Rest Days
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restDays.map((restDay, index) => (
                                <TableRow key={index}>
                                    <TableCell>{restDay.date}</TableCell>
                                    <TableCell>{restDay.reason}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteRestDay(index)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{ mt: 2 }}>
                        Add New Rest Day
                    </Button>
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Add New Rest Day</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Date"
                                type="date"
                                value={newRestDay.date}
                                onChange={(e) => setNewRestDay({ ...newRestDay, date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Reason"
                                type="text"
                                value={newRestDay.reason}
                                onChange={(e) => setNewRestDay({ ...newRestDay, reason: e.target.value })}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={handleSaveRestDay} color="primary">Save</Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            )}
        </>
    );
}

export default AppSettingsManagement;
