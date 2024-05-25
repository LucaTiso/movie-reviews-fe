import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import { Margin } from '@mui/icons-material';

import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios, {AxiosResponse} from 'axios';
import { useContext } from "react";
import { AppContext } from "../App";
import { TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link, FormControl, FormControlLabel, Checkbox } from '@mui/material';


export const Favourites = () => {

    const navigate = useNavigate();

    const [checkBoxChecked, setCheckBoxChecked] = useState(false);

    const [checkBoxArr, setCheckBoxArr] = useState([] as any[]);

    const shouldLoad = useRef(true);

    const { userData } = useContext(AppContext);

    const rightMargin = { margin: "0 auto" };
    const leftMargin = { margin: "0 0 0 2rem" };

    const [tableData, setTableData] = useState([] as any[]);

    const buttonContainer = { display: "flex", float: 'right' };

    console.log("checkBoxArr: ");
    console.log(checkBoxArr);

    useEffect(() => {
        if (shouldLoad.current) {
            shouldLoad.current = false;
            loadData();
        }

    }, []);


    const loadData = () => {

        let loadUrl = "http://localhost:8080/api/webapp-users/favourites";
        console.log(loadUrl);
        const config = {
            headers: {
                'Authorization': "Bearer " + userData.jwtToken
            }
        };

        axios.get(loadUrl, config).then((response) => {
            console.log(response);
            setTableData(response.data);
        });
    }

    const downloadFavourites = () => {
        let downloadUrl = "http://localhost:8080/api/webapp-users/favourites/download";

        const config = {
            headers: {
                'Authorization': "Bearer " + userData.jwtToken
            },
            responseType: 'blob' as 'blob'
        };

        axios.get(downloadUrl, config).then((response: AxiosResponse<Blob>) => {
            console.log(response);
            //setTableData(response.data);
            const blob = new Blob([response.data], { type: 'text/csv' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nome_file.csv'); // Imposta il nome del file CSV
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        });


    }




    const handleCheckbox = (movieId: number) => {
        //setCheckBoxChecked(event.target.checked);
        const index = checkBoxArr.indexOf(movieId);
        if (index === -1) {
            setCheckBoxArr([...checkBoxArr, movieId])
        } else {
            setCheckBoxArr(checkBoxArr.filter(f =>
                f !== movieId
            ))
        }
    }


    const deleteFavourites = () => {

        let loadUrl = "http://localhost:8080/api/webapp-users/favourites";

        let movieIds = [] as any[];

        movieIds = checkBoxArr;

        console.log("favourites ids");

        console.log(movieIds);

        const config = {
            headers: {
                'Authorization': "Bearer " + userData.jwtToken
            },
            data: movieIds
        };

        axios.delete(loadUrl, config).then((response) => {

            console.log(response);
            //setTableData(response.data);
            setCheckBoxArr([]);

            loadData();

        });
    }

    const handleClick = (movie: any) => {
        console.log("selezionato record con id: " +movie.id);
        navigate("/movieDetail", { state: movie });
      };

    return (
        <Paper sx={{ width: '80%', overflow: 'hidden', margin: '3rem auto' }}>

            <Typography variant='h4' component='div' sx={{ flexGrow: 1 }} >
                FAVOURITES
            </Typography>
            <Box sx={{ margin: '0 10% 5% 10%' }}>

            </Box>



            <TableContainer sx={{ maxHeight: '35rem' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>User Rating</TableCell>
                            <TableCell>Metascore</TableCell>
                            <TableCell>User num ratings</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableData.map((row, index) => (
                                <TableRow key={index} tabIndex={-1} >


                                    <TableCell role="checkbox"  sx={{ cursor: 'pointer' }}
                                    onClick={() => handleClick(row.movieResponse)}>{row.movieResponse.title}</TableCell>
                                    <TableCell>{row.movieResponse.year}</TableCell>
                                    <TableCell>{row.movieResponse.duration}</TableCell>
                                    <TableCell>{row.movieResponse.userRating}</TableCell>
                                    <TableCell>{row.movieResponse.metascore}</TableCell>
                                    <TableCell>{row.movieResponse.userNumRatings}</TableCell>
                                    <TableCell>{row.movieResponse.title}</TableCell>
                                    <TableCell> <Checkbox checked={checkBoxArr.includes(row.movieResponse.id)} onChange={() => handleCheckbox(row.movieResponse.id)} /></TableCell>

                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </TableContainer>
            <Button type='submit' variant='contained' color='primary' onClick={deleteFavourites} >
                DELETE
            </Button>
            <Button type='submit' variant='contained' color='primary' onClick={downloadFavourites} >
                DOWNLOAD
            </Button>
        </Paper>

    );
}