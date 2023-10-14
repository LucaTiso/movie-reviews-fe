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

const Item = styled('div')(({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? '#444d58' : '#ced7e0',
    padding: theme.spacing(2),
    borderRadius: '4px',
    display: 'flex'
  }));

export const MovieDetail=() =>{

    const location=useLocation();

    let currentMovie=location.state;
    
    const navigate=useNavigate();

    const rightMargin= {margin:"0 auto"};
    const leftMargin = {margin:"0 0 0 2rem"}

    const buttonContainer= {display:"flex",float:'right'};

    const buttonStyle= {margin : "1rem",height:'3rem', width:'100%'};


    const showReviews=()=>{
        console.log("cliccato show reviews");
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
              <Typography variant="h6" style={rightMargin}>{currentMovie.originalTitle}</Typography>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
              <Typography variant="h6" style={leftMargin}>Current Position</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.currentPosition}</Typography>
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
              <Typography variant="h6" style={rightMargin}>{currentMovie.sceneggiatura}</Typography>
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
              <Typography variant="h6" style={rightMargin}>{currentMovie.movieCast}</Typography>
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
              <Typography variant="h6" style={leftMargin}>Rating</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.rating}</Typography>
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
              <Typography variant="h6" style={leftMargin}>num ratings</Typography>
              <Typography variant="h6" style={rightMargin}>{currentMovie.numRatings}</Typography>
              </Item>
            </Grid>
          </Grid>
          <Box sx={buttonContainer}>
          <Button type="submit" color="primary" variant="contained" sx={buttonStyle} 
                 onClick={showReviews}>REVIEWS</Button>
        <Button type="submit" color="primary" variant="contained" sx={buttonStyle} 
                 onClick={()=>editMovie(currentMovie)}>EDIT</Button>
                 </Box>
        </Box>
      );


        

}