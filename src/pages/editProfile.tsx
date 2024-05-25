import { useNavigate } from "react-router-dom";
import { Button, TextField, Grid, Paper, Box, Autocomplete } from '@mui/material';
import { useContext, useState, useRef, useEffect } from "react";
import axios from 'axios';
import { AppContext } from "../App";

export const EditProfile = () => {


    const navigate = useNavigate();
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const spacingStyle = { margin: "0.5rem 0" };
    const homeButtonStyle = { margin: "1rem 0", whith: 300 };

    const { userData } = useContext(AppContext);

    const shouldLoad = useRef(true);

    let [countries, setCountries] = useState<string[]>([]);

    

    let [profile, setProfile] = useState({

        country: "" as any,
        firstName: "",
        lastName: ""

    });

    console.log("country:");
    console.log(profile.country);

    useEffect(() => {
        if (shouldLoad.current) {
            shouldLoad.current = false;
            loadProfile();
            loadCountries();
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

    const loadCountries = async () => {
        axios.get("http://localhost:8080/api/config/countries")
            .then((response: any) => {
                console.log(response.data.countryList);

                let cList=response.data.countryList.map((c:any)=>c.name );


                setCountries(cList);


            })
            .catch((error: any) => {
                console.log("errore nel caricamento dei countries");

            });


    }


    const doEdit = async () => {
        let userRequest = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            country: profile.country
        };

        let config = {};

        console.log(userData.jwtToken);

        if (userData != null) {
            config = {
                headers: {
                    'Authorization': "Bearer " + userData.jwtToken
                }
            };
        }

        console.log(userRequest);

        axios.patch("http://localhost:8080/api/webapp-users/editProfile", userRequest, config).then((response: any) => {
            console.log(response);

            navigate("/view-profile");
        });


    };

    return (

        <Grid>
            <Box textAlign="center" style={homeButtonStyle}>
                <Button type="submit" color="primary" variant="contained" onClick={() => navigate("/")}>Movie Reviews App</Button>
            </Box>

            <Paper elevation={10} style={paperStyle}>

                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <h2>Edit profile</h2>
                </Grid>

                <TextField label="First Name" placeholder="Enter first name" fullWidth required style={spacingStyle} value={profile.firstName} onChange={(e: any) => {

                    const { value } = e.target;
                    setProfile({
                        ...profile,
                        firstName: value
                    });

                }} />
                <TextField label="Last Name" placeholder="Enter last name" fullWidth required style={spacingStyle} value={profile.lastName} onChange={(e: any) => {

                    const { value } = e.target;
                    setProfile({
                        ...profile,
                        lastName: value
                    });

                }} />

                <Autocomplete
                    disablePortal
                    disableClearable
                    id="combo-box-demo"
                    options={countries}
                    sx={{ width: 300 }}
                    //getOptionLabel={(option) => option.name}
                    value={profile.country}

                    //isOptionEqualToValue={(option, value) => option.value === value.value}
                    onChange={(event, newValue: string | null) => {
                        setProfile({
                            ...profile,
                            country: newValue
                        });
                    }}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                />



                <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle} onClick={doEdit}>Submit changes</Button>
            </Paper>
        </Grid>

    );

}