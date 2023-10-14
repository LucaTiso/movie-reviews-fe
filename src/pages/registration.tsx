import { useNavigate } from "react-router-dom";
import {Typography,Button,TextField,Grid, Paper,Link,Box} from '@mui/material';
import axios from 'axios';
import {useState} from "react";
export const Registration=() =>{

    const navigate=useNavigate();
    const paperStyle={padding:20,height:'70vh',width:280,margin:"20px auto"};
    const spacingStyle={margin:"0.5rem 0"};

    const homeButtonStyle={margin:"1rem 0", whith:300 };

    let [username,setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [reEnterPassword,setReEnterPassword] = useState("");
    let [country,setCountry]=useState("");
    let [email,setEmail] =useState("");

    const changeUsername=(event:any)=>{
        setUsername(event.target.value);
    };


    const changePassword=(event:any)=>{
        setPassword(event.target.value);
    }

    const changeReEnterPassword=(event:any)=>{
        setReEnterPassword(event.target.value);
    }

    const changeEmail=(event:any)=>{
        setEmail(event.target.value);
    };

    const changeCountry=(event:any)=>{
        setCountry(event.target.value);
    };



    const doRegistration=async () => {
        console.log("username : "+username) ;
        console.log("email : "+email);
        console.log("password : "+password);
        console.log("reEnter password : "+reEnterPassword);
        console.log("country : "+country);

        let registrationRequest={
            username : username,
            email : email,
            password : password,
            country : country

        };
        //const usernameResult= "PIPPO";
       // navigate("/");
       axios.post("http://localhost:8080/api/webapp-users/registration",registrationRequest).then((response:any)=>{
        console.log(response);
        navigate("/");
       });
    }

    
    return(
    <Grid>
            <Box textAlign="center" style={homeButtonStyle}>
                <Button type="submit" color="primary" variant="contained" onClick={()=>navigate("/")}>Movie Reviews App</Button>
            </Box>
            <Paper elevation={10} style={paperStyle}>
            <Grid container direction="column" alignItems="center" justifyContent="center">
                <h2>Create account</h2>
            </Grid>
            <TextField label="Username" placeholder="Enter username" fullWidth required style={spacingStyle} value={username} onChange={changeUsername}/>
            <TextField label="Email" placeholder="Enter email" fullWidth required style={spacingStyle} value={email} onChange={changeEmail}/>
            <TextField label="Password" placeholder="Enter password" type="password" fullWidth required style={spacingStyle} value={password} onChange={changePassword}/>
            <TextField label="Re-enter Password" placeholder="Re-enter password" type="password" fullWidth required style={spacingStyle} value={reEnterPassword} onChange={changeReEnterPassword}/>
            <TextField label="Country" placeholder="Country" fullWidth required style={spacingStyle} value={country} onChange={changeCountry}/>
            <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle} onClick={doRegistration}>Sign in</Button>
            <Typography>Already have an account ?
                    <Link component="button" onClick={()=>navigate("/login")}> Sign in
                    </Link>
                </Typography>   
            </Paper>
    </Grid>
    );
}