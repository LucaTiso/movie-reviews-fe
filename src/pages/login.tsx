import { useNavigate } from "react-router-dom";
import {useContext,useState} from "react";
import { AppContext } from "../App";
import {Typography,Button,TextField,Grid, Paper,Avatar,Link, FormControlLabel,Checkbox,Box} from '@mui/material';
import {AccountCircle} from '@mui/icons-material';
import axios from 'axios';

export const Login=() =>{

    const {setUser}=useContext(AppContext);

    const navigate=useNavigate();

    let [loginUsername,setLoginUsername] = useState("");
    let [password, setPassword] = useState("");

    const changeLoginUsername=(event:any)=>{
        setLoginUsername(event.target.value);
    };

    const changePassword=(event:any)=>{
        setPassword(event.target.value);
    }
 
    const signIn=async () => {
       
        const loginRequest={
            username : loginUsername,
            password : password
        };

        console.log(loginRequest);

        axios.post("http://localhost:8080/api/webapp-users/login",loginRequest).then((response)=>{
        
        console.log(response);

        setUser(response.data);
        
        navigate("/");
        });
    }

    const paperStyle={padding:20,height:'70vh',width:280,margin:"3rem auto"};
    const spacingStyle={margin:"0.5rem 0"};
    const homeButtonStyle={margin:"1rem 0", whith:300 };

    return (
        
        <Grid>
            <Box textAlign="center" style={homeButtonStyle}>
                <Button type="submit" color="primary" variant="contained" onClick={()=>navigate("/")}>Movie Reviews App</Button>
            </Box>
            <Paper elevation={10} style={paperStyle}>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                <Avatar><AccountCircle /></Avatar>
                <h2>Sign in</h2>
                </Grid>
                <TextField label="Username" placeholder="Enter username" fullWidth required style={spacingStyle} value={loginUsername} onChange={changeLoginUsername}/>
                <TextField label="Password" placeholder="Enter password" type="password" fullWidth required style={spacingStyle} value={password} onChange={changePassword}/>
                <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary"/>} label="Remember me"
                    ></FormControlLabel>
                <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle}
                 onClick={signIn}>Sign in</Button>
                <Typography>
                    <Link component="button" onClick={()=>console.log("miao")}>Forgot password ? 
                    </Link>
                </Typography>
                <Typography>Do you have an account ?
                <Link component="button" onClick={()=>navigate("/registration")}> Sign up
                    </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}
/*
<Stack spacing={4} direction='column' alignItems="center"
        justifyContent="center">
            <Typography variant='h6' component='div'>
                Sign in to continue
            </Typography>
            <TextField label='Username'></TextField>
            <Button color='inherit' onClick={signIn}>Sign in</Button>
        </Stack>
*/