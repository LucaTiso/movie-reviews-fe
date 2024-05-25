import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import { Margin } from '@mui/icons-material';
import {Button} from '@mui/material';
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {useState,useEffect,useRef} from "react";
import axios from 'axios';
import { useContext } from "react";
import { AppContext } from "../App";

const Item = styled('div')(({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? '#444d58' : '#ced7e0',
    padding: theme.spacing(2),
    borderRadius: '4px',
    display: 'flex'
  }));

export const MovieDetail=() =>{

  const shouldLoad=useRef(true);

  const { userData } = useContext(AppContext);


  const [currentMovie,setMovie]=useState({
    cast:"",
    duration:null,
    genre:"",
    href:"",
    id:null,
    metascore:null,
    metascoreNumRatings:null,
    movieRatingCategory:"",
    plot:"",
    production:"",
    regia:"",
    star:"",
    title:"",
    reviewId:null,
    userNumRatings:null,
    userRating:null,
    year:null

  });


  useEffect(()=>{
    if(shouldLoad.current){
      shouldLoad.current=false;
      let currentMovie=location.state;
      loadData(currentMovie.id);
    }
    
  },[]);

    const location=useLocation();


    const navigate=useNavigate();

    const rightMargin= {margin:"0 auto"};
    const leftMargin = {margin:"0 0 0 2rem"}

    const buttonContainer= {display:"flex",float:'right'};
    const buttonStyle= {margin : "1rem",height:'3rem', width:'100%'};


    const loadData=(id:number)=>{
      let loadUrl="http://localhost:8080/api/movies/"+id;


      let config={};

      if(userData!=null){
        config = {
          headers: {
              'Authorization': "Bearer " + userData.jwtToken
          }
      };
      }

      axios.get(loadUrl,config).then((response)=>{
        console.log(response);
        setMovie(response.data);
      });
    }


    const showMetacriticReviews=()=>{
        console.log("cliccato show metacritic reviews");

        let movieData={
          id:currentMovie.id,
          title:currentMovie.title
        }

        navigate("/metacriticReviews", { state: movieData });
    }

    const showWebappReviews=()=>{
      console.log("cliccato show webapp reviews");

      let movieData={
        id:currentMovie.id,
        title:currentMovie.title
      }

      navigate("/webappReviews", { state: movieData });
  }

    const editMovie=(movieData:any)=>{
        console.log("cliccato show edit mvie");
        navigate("/movieEdit",{state:movieData});
    }
  
    return (
        <Box sx={{ width: '50%', margin:'5% auto' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Titolo</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.title}</Typography>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Titolo originale</Typography>
             
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Current Position</Typography>
            
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Anno</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.year}</Typography>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Durata</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.duration}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Regia</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.regia}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Sceneggiatura</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Star</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.star}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Movie cast</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.cast}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Plot</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.plot}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>User Rating</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.userRating}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Metascore</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.metascore}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>User num ratings</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.userNumRatings}</Typography>
              </Item>
            </Grid>
          </Grid>
          <Box sx={buttonContainer}>
          <Button type="submit" color="primary" variant="contained" sx={buttonStyle} 
                 onClick={showMetacriticReviews}>METACRITIC REVIEWS</Button>
                  <Button type="submit" color="primary" variant="contained" sx={buttonStyle} 
                 onClick={showWebappReviews}>WEBAPP REVIEWS</Button>
        <Button type="submit" color="primary" variant="contained" sx={buttonStyle} 
                 onClick={()=>editMovie(currentMovie)}>EDIT</Button>
                 </Box>
        </Box>
      );


        

}