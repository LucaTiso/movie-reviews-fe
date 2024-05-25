import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Grid, Paper, Link, Box, Stack, Alert, Select, InputLabel, FormControl, SelectChangeEvent, MenuItem, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useState,useEffect,useRef } from "react";

export const Registration = () => {

    const navigate = useNavigate();
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const spacingStyle = { margin: "0.5rem 0" };

    
    let [username, setUsername] = useState("");
    let [firstname, setFirstname] = useState("");
    let [lastname, setLastname] = useState("");
    let [password, setPassword] = useState("");
    let [reEnterPassword, setReEnterPassword] = useState("");
    let [country, setCountry] = useState("");
    let [email, setEmail] = useState("");

    let [registrationCompleted, setRegistrationCompleted] = useState(false);


    let [registrationError, setRegistrationError] = useState("");


    let [firstNameError, setFirstNameError] = useState("");
    let [lastNameError, setLastNameError] = useState("");
    let [usernameError, setUsernameError] = useState("");
    let [passwordError, setPasswordError] = useState("");
    let [emailError, setEmailError] = useState("");
    let [countryError, setCountryError] = useState("");

    let [countries,setCountries] = useState<string[]>([]);

    const shouldLoad = useRef(true);

    useEffect(() => {
        if (shouldLoad.current) {
          shouldLoad.current = false;
          loadCountries();
        }
    
      }, []);
    

    const changeUsername = (event: any) => {
        setUsername(event.target.value);

        if (event.target.value === "") {
            setUsernameError("Username is required");
        } else {
            setUsernameError("");
        }

    };


    const changePassword = (event: any) => {
        setPassword(event.target.value);

        if (event.target.value === "" || event.target.value.length < 6) {
            setPasswordError("Password should be at least 6 characters long");
        } else {
            setPasswordError("");
        }


    }

    const changeReEnterPassword = (event: any) => {
        setReEnterPassword(event.target.value);

    }

    const changeEmail = (event: any) => {
        setEmail(event.target.value);
        if (event.target.value === "") {
            setEmailError("Email is required");
        } else {
            setEmailError("");
        }
    };

    const changeCountry = (event: any) => {
        setCountry(event.target.value);
        if (event.target.value === "") {
            setCountryError("Country is required");
        } else {
            setCountryError("");
        }
    };

    const changeFirstname = (event: any) => {
        setFirstname(event.target.value);
        if (event.target.value === "") {
            setFirstNameError("First name is required");
        } else {
            setFirstNameError("");
        }
    };

    const changeLastname = (event: any) => {
        setLastname(event.target.value);
        if (event.target.value === "") {
            setLastNameError("Last name is required");
        } else {
            setLastNameError("");
        }
    };


    const checkRegistration = () => {


        let error = false;

        if (firstname === "") {
            error = true;
            setFirstNameError("First name is required");
        } else {
            setFirstNameError("");
        }

        if (lastname === "") {
            error = true;
            setLastNameError("Last name is required");
        } else {
            setLastNameError("");
        }


        if (username === "") {
            error = true;
            setUsernameError("Username is required");
        } else {
            setUsernameError("");
        }


        if (password === "" || password.length < 6) {
            error = true;
            setPasswordError("Password should be at least 6 characters long");
        } else {
            setPasswordError("");
        }

        if (email === "") {
            error = true;

            setEmailError("Email is required");
        } else {
            setEmailError("");
        }


        if (country === "") {
            error = true;
            setCountryError("Country is required");
        } else {
            setCountryError("");
        }

        if (!error) {

            if (reEnterPassword !== password) {

                setRegistrationError("Passord and confirmation password not matching");

            } else {
                setRegistrationError("");
                doRegistration();
            }

        } else {
            setRegistrationError("Error on fields");
        }


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

    const doRegistration = async () => {
        console.log("username : " + username);
        console.log("firstname : " + firstname);
        console.log("lastname :" + lastname);
        console.log("email : " + email);
        console.log("password : " + password);
        console.log("reEnter password : " + reEnterPassword);
        console.log("country : " + country);



        let registrationRequest = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
            country: country

        };

        axios.post("http://localhost:8080/api/auth/register", registrationRequest)
            .then((response: any) => {
                console.log(response);
                setRegistrationCompleted(true);
                setRegistrationError("");
            })
            .catch((error: any) => {
                console.log("errore nella registrazione");
                console.log(error.response.data.validationErrors[0]);
                setRegistrationError(error.response.data.validationErrors[0]);
            });


    }


    return (
        !registrationCompleted ?
            <Grid>{
                registrationError != "" ?
                    <Stack spacing={2}>
                        <Alert severity='error' variant='standard' onClose={() => { setRegistrationError("") }}>{registrationError}</Alert>
                    </Stack> : null
            }

                <Paper elevation={10} style={paperStyle}>
                    <Grid container direction="column" alignItems="center" justifyContent="center">
                        <h2>Create account</h2>
                    </Grid>
                    <TextField label="Username" placeholder="Enter username" fullWidth required style={spacingStyle} value={username} onChange={changeUsername}
                        error={usernameError !== ""} helperText={usernameError !== "" ? usernameError : null} />
                    <TextField label="Email" placeholder="Enter email" fullWidth required style={spacingStyle} value={email} onChange={changeEmail}
                        error={emailError !== ""} helperText={emailError !== "" ? emailError : null} />
                    <TextField label="First Name" placeholder="Enter first name" fullWidth required style={spacingStyle} value={firstname} onChange={changeFirstname}
                        error={firstNameError !== ""} helperText={firstNameError !== "" ? firstNameError : null} />
                    <TextField label="Last Name" placeholder="Enter last name" fullWidth required style={spacingStyle} value={lastname} onChange={changeLastname}
                        error={lastNameError !== ""} helperText={lastNameError !== "" ? lastNameError : null} />
                    <TextField label="Password" placeholder="Enter password" type="password" fullWidth required style={spacingStyle} value={password} onChange={changePassword}
                        error={passwordError !== ""} helperText={passwordError !== "" ? passwordError : null} />
                    <TextField label="Re-enter Password" placeholder="Re-enter password" type="password" fullWidth required style={spacingStyle} value={reEnterPassword} onChange={changeReEnterPassword} />
            
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={countries}
                        sx={{ width: 300 }}
                       // getOptionLabel={(option) => option.name}
                       
                        //isOptionEqualToValue={(option, value) => option.value === value.value}
                        onChange={(event, newValue: any| null) => {
                            console.log("cambiato");
                            if(newValue!==null){
                                console.log(newValue);
                                setCountry(newValue);
                                setCountryError("");
                            }else{
                               setCountry("");
                               setCountryError("Country is required");
                            }

                            
                            
                        }}
                        renderInput={(params) => <TextField {...params} label="Country" error={countryError !== ""} helperText={countryError !== "" ? countryError : null}  />}
                    />




                    <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle} onClick={checkRegistration}>Sign in</Button>
                    <Typography>Already have an account ?
                        <Link component="button" onClick={() => navigate("/login")}> Sign in
                        </Link>
                    </Typography>
                </Paper>
            </Grid> :

            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Typography>
                        La registrazione è avvenuta con successo . E' stata inviata una mail all'indirizzo specificato
                    </Typography>
                </Paper>
            </Grid>
    );
}