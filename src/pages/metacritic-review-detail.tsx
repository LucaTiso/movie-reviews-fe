import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography,Rating,TextField } from '@mui/material';
import { Margin } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';

const Item = styled('div')(({ theme }) => ({
    border: '1px solid',
    borderColor: theme.palette.mode === 'dark' ? '#444d58' : '#ced7e0',
    padding: theme.spacing(2),
    borderRadius: '4px',
    display: 'flex'
}));


export const MetacriticReviewDetail = () => {


    const shouldLoad = useRef(true);

    const rightMargin = { margin: "0 auto" };
    const leftMargin = { margin: "0 0 0 2rem" };


    const [currentReview, setReview] = useState({
        title:"",
        username: "",
        text: "",
        rating: null,
        reviewDate: null
    });

    const paperStyle = { padding: 20, height: '70vh', width: '60%', margin: "20px auto" };
    const location = useLocation();

    useEffect(() => {
        if (shouldLoad.current) {
            shouldLoad.current = false;
            let currentReview = location.state;
            
            loadData(currentReview.id);
        }

    }, []);


    const loadData = (id: number) => {

        let loadUrl = "http://localhost:8080/api/movies/metacritic/reviews/" + id;
        axios.get(loadUrl).then((response) => {
            console.log(response);
            setReview(response.data);
        });
    }



    return (
        <Box >
            <Paper elevation={10} style={paperStyle}>
                <Grid container spacing={1}>
                    <Grid xs={12} sm={12} item>

                        <Typography variant="h6" >{currentReview.title}</Typography>
                    </Grid>

                    <Grid xs={12} sm={12} item>

                        <Typography variant="h6" >{currentReview.username}</Typography>
                    </Grid>


                    <Grid xs={12} sm={12} item>
                        <Typography variant="h6" >{currentReview.reviewDate}</Typography>
                    </Grid>

                    <Grid xs={12} sm={12} item>
                        <Rating name="customized-10" value={currentReview.rating} max={10} readOnly />
                    </Grid>

                    <Grid xs={12} sm={12} item>
                        <TextField label='Testo' fullWidth multiline minRows={10} variant="outlined" value={currentReview.text} InputProps={{
                            readOnly: true,
                        }} />

                    </Grid>


                </Grid>

            </Paper>

        </Box>
    )
}