import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import { Paper, Table, Grid, TableBody, Stack, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link, Container } from '@mui/material';

export const ViewProfile = () => {

    const navigate = useNavigate();

    const shouldLoad = useRef(true);

    const { userData } = useContext(AppContext);

    const paperStyle = { padding: 20, height: '70vh', width: "50%", margin: "auto" };

    const boxStyle = { marginLeft:"30px"};

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        country: "",
        firstName: "",
        lastName: "",
        registrationTime: null,
    });



    useEffect(() => {
        if (shouldLoad.current) {
            shouldLoad.current = false;
            loadProfile();
        }

    }, []);

    const loadProfile = async () => {

        let config = {};

        console.log(userData.jwtToken);

        if (userData != null) {
            config = {
                headers: {
                    'Authorization': "Bearer " + userData.jwtToken
                }
            };
        }
        axios.get("http://localhost:8080/api/webapp-users/getProfile", config)
            .then((response: any) => {

                setProfile(response.data);


            })
            .catch((error: any) => {
                console.log("errore nel caricamento dei countries");

            });


    }

    const toEditProfile = async () => {
        navigate("/editProfile");
    }


    const toChangePassword = async () => {
        navigate("/changePassword");
    }

    return (

        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"

        >
            <Grid container justifyContent="center">
                <Paper elevation={10} style={paperStyle}>


                    <Grid item xs={12} >
                        <Typography variant="h4" gutterBottom align="center" >
                            Profile
                        </Typography>
                    </Grid>


                        <Box style={{margin:"30px"}}></Box>


                    <Grid container spacing={2} >
                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center" >
                                Username:
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center" >
                                {profile.username}
                            </Typography>
                        </Grid>




                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center">
                                Email:
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center"  >
                                {profile.email}
                            </Typography>
                        </Grid>



                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'  align="center" >
                                First name:
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center" >
                                {profile.firstName}
                            </Typography>
                        </Grid>



                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center">
                                Last name:
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center">
                                {profile.lastName}
                            </Typography>
                        </Grid>



                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center">
                                Country:
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div'align="center">
                                {profile.country}
                            </Typography>
                        </Grid>



                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center">
                                Registration time:
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant='body1' component='div' align="center">
                                {profile.registrationTime}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button type="submit" color="primary" fullWidth variant="contained"  onClick={toEditProfile}>Edit Profile</Button>
                    <Button type="submit" color="primary" fullWidth variant="contained" onClick={toChangePassword}>Change password</Button>

                </Paper>

            </Grid >
        </Box>

    );




}