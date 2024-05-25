
import { Typography, Button, TextField, Grid, Paper, Link, Box, Stack, Alert, Select, InputLabel, FormControl, SelectChangeEvent, MenuItem, Autocomplete } from '@mui/material';
import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useContext } from "react";
import { AppContext } from "../App";

export const EditPassword = () => {

    const { userData } = useContext(AppContext);

    let [passwordChanged, setPasswordChanged] = useState(false);
    let [changedError,setChangedError] = useState("");
    let [oldPassword,setOldPassword] = useState("");
    let [newPassword,setNewPassword] = useState("");
    let [reEnterNewPassword,setReEnterNewPassword] = useState("");

    let [newPasswordError, setNewPasswordError] = useState("");

    

    let [reEnterPasswordError, setReEnterPasswordError] = useState("");

    

    const navigate = useNavigate();
    const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" };
    const spacingStyle = { margin: "0.5rem 0" };

    const checkChangePassword = () => {

        let error = false;


        if (newPassword === "" || newPassword.length < 6) {
            error = true;
            setNewPasswordError("New password should be at least 6 characters long");
        } else {
            setNewPasswordError("");
        }


        if(reEnterNewPassword!==newPassword){
            error = true;
            setReEnterPasswordError("Confirmation password is different from new password");
        }else{
            setReEnterPasswordError("");
        }

        if(!error){
            doChangePassword();
        }

        

    }


    const doChangePassword = async () => {

        let changePaswordRequest = {
            currentPassword:oldPassword,
            newPassword:newPassword,
            confirmationPassword:reEnterNewPassword

        };

        let config={};

        if(userData!=null){
            config = {
                headers: {
                    'Authorization': "Bearer " + userData.jwtToken
                }
            };
        }

        axios.patch("http://localhost:8080/api/webapp-users/changePassword", changePaswordRequest,config)
            .then((response: any) => {
                console.log(response);
                setPasswordChanged(true);
                setChangedError("");
            })
            .catch((error: any) => {
                console.log("errore nel cambio della password");
                console.log(error.response.data.error);
                setChangedError(error.response.data.error);
            });
    }

    return (
        !passwordChanged ?
            <Grid>{
                changedError != "" ?
                    <Stack spacing={2}>
                        <Alert severity='error' variant='standard' onClose={() => { setChangedError("") }}>{changedError}</Alert>
                    </Stack> : null
            }

                <Paper elevation={10} style={paperStyle}>
                    <Grid container direction="column" alignItems="center" justifyContent="center">
                        <h2>Change password</h2>
                    </Grid>
                    <TextField label="Old password" placeholder="Old password" type="password" fullWidth required style={spacingStyle} value={oldPassword} onChange={(e:any)=>{
                        setOldPassword(e.target.value);
                    }} />

                    <TextField label="New Password" placeholder="New password" type="password" fullWidth required style={spacingStyle} value={newPassword} onChange={(e:any)=>{
                        setNewPassword(e.target.value);
                    }}  error={newPasswordError !== ""} helperText={newPasswordError !== "" ? newPasswordError : null}/>
                    <TextField label="Re-enter New Password" placeholder="Re-enter New password" type="password" fullWidth required style={spacingStyle} value={reEnterNewPassword} onChange={(e:any)=>{
                        setReEnterNewPassword(e.target.value);
                        
                    }}  error={reEnterPasswordError !== ""} helperText={reEnterPasswordError !== "" ? reEnterPasswordError : null}/>
            
                    <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle} onClick={checkChangePassword}>Apply changes</Button>
                    
                </Paper>
            </Grid> :

            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Typography>
                        La password è stata modificata con successo
                    </Typography>
                </Paper>
            </Grid>
    );


}