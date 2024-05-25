import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography, TextField, Alert, Stack, Rating } from '@mui/material';
import { Margin } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useContext } from "react";
import { AppContext } from "../App";


export const WebappReviewDetail = () => {

    const shouldLoad = useRef(true);

    const navigate = useNavigate();

    const { userData } = useContext(AppContext);

    let [reviewError, setReviewError] = useState("");

    const rightMargin = { margin: "0 auto" };
    const leftMargin = { margin: "0 0 0 2rem" };
    const buttonContainer = { display: "flex", float: 'right' };
    const buttonStyle = { margin: "1rem", height: '3rem', width: '100%' };
    const spacingStyle = { margin: "0.5rem 0" };

    let [currentMode, setCurrentMode] = useState("READ");
    let [editRating, setEditRating] = useState(0);
    let [editText, setEditText] = useState("");

    const [movieId, setMovieId] = useState(null);


    const [createMovieTile,setCreateMovieTitle] =useState("");
   

    const paperStyle = { padding: 20, height: '70vh', width: '60%', margin: "20px auto" };

    const [currentReview, setReview] = useState({
        title:"",
        username: "",
        text: "",
        rating: null,
        reviewDate: null,
        reviewTime: null,
        id: null
    });

    const location = useLocation();

    useEffect(() => {
        if (shouldLoad.current) {
            shouldLoad.current = false;

            console.log(location.state);
            if (location.state.mode === "READ") {
                let currentReview = location.state;
                setCurrentMode(location.state.mode);
                loadData(currentReview.id);
              
            } else if (location.state.mode === "CREATE") {
                console.log("create mode");
                setCurrentMode("CREATE");
                setCreateMovieTitle(location.state.title);
                setMovieId(location.state.movieId);
               
            } else {
                let currentReview = location.state;
                setCurrentMode(location.state.mode);
                loadData(currentReview.id);
                setMovieId(location.state.movieId);
               
            }

        }

    }, []);


    const changeEditRating = (event: any) => {
        console.log(event.target.value);
        setEditRating(event.target.value);
    };

    const changeText = (event: any) => {
        setEditText(event.target.value);
    }



    const loadData = (id: number) => {

        let loadUrl = "http://localhost:8080/api/movies/webapp/reviews/" + id;
        axios.get(loadUrl).then((response) => {
            console.log(response);
            setReview(response.data);
            if (location.state.mode === "EDIT") {
                setEditRating(response.data.rating);
                setEditText(response.data.text);
            }

        });
    }


    const createReview = () => {
        let loadUrl = "http://localhost:8080/api/movies/" + movieId + "/webapp/reviews";

        let json = {
            text: editText,
            rating: editRating
        };

        console.log("json to send create");
        console.log(json);
        console.log("jwt: ");
        console.log(userData.jwtToken);


        let config={};

        if(userData!=null){
            config = {
                headers: {
                    'Authorization': "Bearer " + userData.jwtToken
                }
            };
        }

      

        if (editRating < 1) {
            setReviewError("Rating should be at least 1 star");
        } else if (editText == null || editText.length < 20) {
            setReviewError("Review text should be at least 20 characters");
        } else {

            axios.post(loadUrl, json, config).then((response) => {
                console.log(response);
                setReviewError("");

                let movieData = {
                    id: movieId,
                    reviewState: "CREATE"
                }

                navigate("/webappReviews", { state: movieData });
            });
        }

    }

    const editReview = () => {
        let loadUrl = "http://localhost:8080/api/movies/" + movieId + "/webapp/reviews/" + location.state.id;

        let json = {
            text: editText,
            rating: editRating
        };

        console.log("json to send edit");
        console.log(json);
        console.log("jwt: ");
        console.log(userData.jwtToken);


        const config = {
            headers: {
                'Authorization': "Bearer " + userData.jwtToken


            }
        };

        if (editRating < 1) {
            setReviewError("Rating should be at least 1 star");
        } else if (editText == null || editText.length < 20) {
            setReviewError("Review text should be at least 20 characters");
        } else {
            axios.put(loadUrl, json, config).then((response) => {
                setReviewError("");
                console.log(response);

                let movieData = {
                    id: movieId,
                    reviewState: "EDIT"
                }
                navigate("/webappReviews", { state: movieData });
            });
        }

    }

    const deleteReview = () => {
        let loadUrl = "http://localhost:8080/api/movies/" + movieId + "/webapp/reviews/" + location.state.id;

        const config = {
            headers: {
                'Authorization': "Bearer " + userData.jwtToken


            }
        };

        axios.delete(loadUrl, config).then((response) => {
            setReviewError("");
            console.log(response);

            let movieData = {
                id: movieId,
                reviewState: "DELETE"
            }
            navigate("/webappReviews", { state: movieData });
        });

    }


    return (




        <Box>

            {
                reviewError != "" ?
                    <Stack spacing={2}>
                        <Alert severity='error' variant='standard' onClose={() => { setReviewError("") }}>{reviewError}</Alert>
                    </Stack> : null
            }

            {
                currentMode === "READ" ?


                    <Paper elevation={10} style={paperStyle}>
                        <Grid container spacing={1}>

                            <Grid xs={12} sm={12} item>

                                <Typography variant="h6" >{currentReview.title}</Typography>
                            </Grid>

                            <Grid xs={12} sm={12} item>

                                <Typography variant="h6" >{currentReview.username}</Typography>
                            </Grid>


                            <Grid xs={12} sm={6} item>
                                <Typography variant="h6" >{currentReview.reviewDate}</Typography>
                            </Grid>

                            <Grid xs={12} sm={6} item>
                                <Typography variant="h6">{currentReview.reviewTime}</Typography>
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



                    : currentMode === "EDIT" ?

                        <Paper elevation={10} style={paperStyle}>


                            <Grid container spacing={1} >
                                <Grid xs={12} sm={12} item>
                                    <Typography variant="h6">{currentReview.title}</Typography>

                                </Grid>

                                <Grid xs={12} sm={12} item>
                                    <Typography variant="h6">{currentReview.username}</Typography>
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <Typography variant="h6" >{currentReview.reviewDate}</Typography>
                                </Grid>

                                <Grid xs={12} sm={6} item>
                                    <Typography variant="h6" >{currentReview.reviewTime}</Typography>
                                </Grid>


                                <Grid xs={12} sm={12} item>
                                    <Rating name="customized-10" value={editRating} max={10} onChange={changeEditRating} />
                                </Grid>


                                <Grid xs={12} sm={12} item>
                                    <TextField label='Testo' fullWidth multiline minRows={10} variant="outlined" value={editText} onChange={changeText} />

                                </Grid>

                            </Grid>

                            <Box sx={buttonContainer}><Button type="submit" color="primary" variant="contained" sx={buttonStyle}
                                onClick={editReview}>MODIFICA RECENSIONE</Button>
                                <Button type="submit" color="primary" variant="contained" sx={buttonStyle}
                                    onClick={deleteReview}>CANCELLA RECENSIONE</Button>
                            </Box>



                        </Paper> :
                        <Paper elevation={10} style={paperStyle}>


                            <Grid container spacing={1} >
                                <Grid xs={12} sm={12} item>
                                    <Typography variant="h6">{createMovieTile}</Typography>

                                </Grid>

                                <Grid xs={12} sm={12} item>
                                    <Typography variant="h6">{userData.username}</Typography>
                                </Grid>


                                <Grid xs={12} sm={12} item>
                                    <Rating name="customized-10" value={editRating} max={10} onChange={changeEditRating} />
                                </Grid>


                                <Grid xs={12} sm={12} item>
                                    <TextField label='Testo' fullWidth multiline minRows={10} variant="outlined" value={editText} onChange={changeText} />

                                </Grid>

                            </Grid>

                            <Box sx={buttonContainer}><Button type="submit" color="primary" variant="contained" sx={buttonStyle}
                                onClick={createReview}>INVIA RECENSIONE</Button>
                            </Box>

                        </Paper>

            }

        </Box>
    )



}