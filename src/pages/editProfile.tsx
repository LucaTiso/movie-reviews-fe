import { useNavigate } from "react-router-dom";
import {Button,TextField,Grid, Paper,Box} from '@mui/material';
import {useContext,useState} from "react";
import axios from 'axios';
import { AppContext } from "../App";

export const EditProfile=() =>{

    const {setUser}=useContext(AppContext);
    const {user} =useContext(AppContext);

    
    let [password, setPassword] = useState("");
    let [reEnterPassword,setReEnterPassword] = useState("");
    let [country,setCountry]=useState(user.country);
    let [email,setEmail] =useState(user.email);

    const navigate=useNavigate();
    const paperStyle={padding:20,height:'70vh',width:280,margin:"20px auto"};
    const spacingStyle={margin:"0.5rem 0"};
    const homeButtonStyle={margin:"1rem 0", whith:300 };

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


    const doEdit=async () => {
      let userRequest={
        username : user.username,
        email : email,
        password : password,
        country : country
      };

      console.log(userRequest);

      axios.patch("http://localhost:8080/api/webapp-users/editProfile",userRequest).then((response:any)=>{
        console.log(response);
        setUser(response.data);
        navigate("/");
      });


    };
   
    return(

        <Grid>
            <Box textAlign="center" style={homeButtonStyle}>
                <Button type="submit" color="primary" variant="contained" onClick={()=>navigate("/")}>Movie Reviews App</Button>
            </Box>

            <Paper elevation={10} style={paperStyle}>

            <Grid container direction="column" alignItems="center" justifyContent="center">
                <h2>Edit profile</h2>
            </Grid>

            <TextField label="Email" placeholder="Enter email" fullWidth required style={spacingStyle} value={email} onChange={changeEmail}/>
            <TextField label="Password" placeholder="Enter password" type="password" fullWidth required style={spacingStyle} value={password} onChange={changePassword}/>
            <TextField label="Re-enter Password" placeholder="Re-enter password" type="password" fullWidth required style={spacingStyle} value={reEnterPassword} onChange={changeReEnterPassword}/>
            <TextField label="Country" placeholder="Country" fullWidth required style={spacingStyle} value={country} onChange={changeCountry}/>
            <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle} onClick={doEdit}>Submit changes</Button> 
            </Paper>
        </Grid> 

    );

}