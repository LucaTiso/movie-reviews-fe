import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useContext } from "react";
import { AppContext } from "../App";
import { MovieReviewSearchDialog } from '../components/MovieReviewSearchDialog';

import { TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link, Alert, Stack } from '@mui/material';


export function WebappReviews() {

    const navigate = useNavigate();

    const location = useLocation();

    const { userData } = useContext(AppContext);

    const [orderBy, setOrderBy] = useState("webappUser.username");
    const [order, setOrder] = useState("asc");

    const [pageNumber, setPageNumber] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(100);
    const [fromItem, setFromItem] = useState(0);
    const [toItem, setToItem] = useState(0);

    const [movieId, setMovieId] = useState(0);
    const [movieTitle, setMovieTitle] = useState("");
    const [reviewId, setReviewId] = useState(null);

    const [successMessage, setSuccessMessage] = useState("");

    const [tableData, setTableData] = useState([] as any[]);

    const shouldLoad = useRef(true);
    const buttonContainer = { display: "flex", float: 'right' };

    const [searchDialogOpen, setSearchDialogOpen] = useState(false);

    let [searchData, setSearchData] = useState({
        minRatingSearch: "",
        maxRatingSearch: "",
        usernameSearch: "",
    
        fromReviewDateSearch: null,
        toReviewDateSearch: null
    
      });
    

    useEffect(() => {
        if (shouldLoad.current) {
            shouldLoad.current = false;
            let currentMovie = location.state;
            setMovieId(currentMovie.id);
           


            if (currentMovie.reviewState != null) {
                if (currentMovie.reviewState === "CREATE") {
                    setSuccessMessage("Review successfuly created");
                } else if (currentMovie.reviewState === "EDIT") {
                    setSuccessMessage("Review successfuly updated");
                } else {
                    setSuccessMessage("Review successfuly deleted");
                }
            }

            loadData(currentMovie.id, 1, "webappUser.username", 'asc');
        }

    }, []);

    const loadData = (movieId: number, pageNumSearch: number, orderByParam: string, orderParam: string) => {

        let loadUrl = "http://localhost:8080/api/movies/" + movieId + "/webapp/reviews?pageNumber=" + pageNumSearch + "&itemsPerPage=10&sortBy=" + orderByParam + "&direction=" + orderParam;
        console.log(loadUrl);
        setOrderBy(orderByParam);
        setOrder(orderParam);

        if (searchData.usernameSearch !== "" && searchData.usernameSearch.length > 0) {
            loadUrl += "&username=" + searchData.usernameSearch;
          }
          if (searchData.minRatingSearch !== "" && searchData.minRatingSearch.length > 0) {
            loadUrl += "&minUserRating=" + parseInt(searchData.minRatingSearch);
          }
      
          if (searchData.maxRatingSearch !== "" && searchData.maxRatingSearch.length > 0) {
            loadUrl += "&maxUserRating=" + parseInt(searchData.maxRatingSearch);
          }
      
          if (searchData.fromReviewDateSearch !== null) {
            loadUrl += "&fromReviewDate=" + fromDaysJsToString(searchData.fromReviewDateSearch);
      
          }
      
      
          if (searchData.toReviewDateSearch !== null) {
            loadUrl += "&toReviewDate=" + fromDaysJsToString(searchData.toReviewDateSearch)
          }


        let config = {};

        if (userData != null) {
            config = {
                headers: {
                    'Authorization': "Bearer " + userData.jwtToken
                }
            };
        }


        axios.get(loadUrl, config).then((response) => {
            setTableData(response.data.reviewList);
            setPageNumber(response.data.pageNumber);
            setTotalItems(response.data.totalNumber);
            setFromItem(response.data.fromNum);
            setToItem(response.data.toNum);
            setReviewId(response.data.reviewId);
            setMovieTitle(response.data.title);
        });
    }

    const fromDaysJsToString = (date: any) => {
        let year = date.year();
        let month = date.month() + 1;
        let day = date.date();
    
    
        let monthStr = month < 10 ? "0" + month : month.toString();
        let dayStr = day < 10 ? "0" + day : day.toString();
    
        let result = dayStr + "/" + monthStr + "/" + year;
        return result;
      }

    const changePage = (num: number) => {

        console.log("PAGE NUMBER: " + num);
        loadData(movieId, pageNumber + num, orderBy, order);
    };

    const showReviewDetail = (event: React.MouseEvent<unknown>, reviewData: any) => {

        // se username è lo stesso della recensione apri in  edit

        let detailMode = userData == null || userData.username !== reviewData.username ? "READ" : "EDIT";

        let reviewDetail = {
            id: reviewData.id,
            movieId: movieId,
            movieTitle: movieTitle,
            mode: detailMode
        }

        console.log("open webappReviewDetail");

        console.log(reviewDetail);
        navigate("/webappReviewDetail", { state: reviewDetail });
    };

    const editReview = () => {

        let reviewData = {};

        if (reviewId == null) {
            reviewData = {
                mode: "CREATE",
                title: movieTitle,
                movieId: movieId
            };
        } else {
            reviewData = {
                mode: "EDIT",
                movieTitle: movieTitle,
                movieId: movieId,
                id: reviewId
            };
        }

        navigate("/webappReviewDetail", { state: reviewData });
    }

    const handleSortRequest = (columnName: string) => {
        let orderParam = ""

        // inverto l'ordine
        if (columnName === orderBy) {

            orderParam = order === 'asc' ? 'desc' : 'asc';
            setOrder(orderParam);
        } else {
            // setto asc
            orderParam = "asc";
            setOrder("asc");
        }

        let orderByParam = columnName;
        setOrderBy(columnName);
        loadData(movieId, pageNumber, orderByParam, orderParam);
    }

    const openSearchDialog = () => {
        setSearchDialogOpen(true);
    
      }


    return (
        <Paper sx={{ width: '80%', overflow: 'hidden', margin: '3rem auto' }}>
            {
                successMessage != "" ?
                    <Stack spacing={2}>
                        <Alert severity='success' variant='standard' onClose={() => { setSuccessMessage("") }}>{successMessage}</Alert>
                    </Stack> : null
            }


            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }} >
                WEBAPP REVIEWS {movieTitle}
            </Typography>
            <Box sx={{ margin: '0 10% 5% 10%' }}>
                <Box sx={buttonContainer}>

                    {reviewId != null ? <Button type='submit' variant='contained' color='primary' onClick={editReview} >
                        EDIT REVIEW
                    </Button> :
                        <Button type='submit' variant='contained' color='primary' onClick={editReview} >
                            NEW REVIEW
                        </Button>
                    }

                    <Button type='submit' variant='contained' color='primary' onClick={openSearchDialog} >
                        SEARCH METACRITIC USER REVIEW
                    </Button>
                    <MovieReviewSearchDialog movieId={movieId} pageNumFunc={setPageNumber} loadDataFunc={loadData} orderBy={orderBy} order={order} dialogOpen={searchDialogOpen} dialogOpenFunc={setSearchDialogOpen}
                        searchData={searchData} setSearchData={setSearchData}></MovieReviewSearchDialog>

                </Box>


                <Typography>
                    {fromItem} - {toItem} of {totalItems} titles. | {pageNumber !== 1 ? <Link component="button" onClick={() => changePage(-1)}>Previous</Link> : null}
                    {toItem !== totalItems ? <Link component="button" onClick={() => changePage(1)}>Next</Link> : null}
                </Typography>
            </Box>

            <TableContainer sx={{ maxHeight: '35rem' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell><TableSortLabel onClick={() => { handleSortRequest("webappUser.username") }}
                                direction={orderBy === 'webappUser.username' && order === 'asc' ? 'asc' : 'desc'}
                                active={orderBy === 'webappUser.username'}>Username</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel onClick={() => { handleSortRequest("rating") }}
                                direction={orderBy === 'rating' && order === 'asc' ? 'asc' : 'desc'}
                                active={orderBy === 'rating'}>Rating</TableSortLabel>
                            </TableCell>
                            <TableCell><TableSortLabel onClick={() => { handleSortRequest("reviewDate") }}
                                direction={orderBy === 'reviewDate' && order === 'asc' ? 'asc' : 'desc'}
                                active={orderBy === 'reviewDate'}>Review Date</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel onClick={() => { handleSortRequest("reviewTime") }}
                                direction={orderBy === 'reviewTime' && order === 'asc' ? 'asc' : 'desc'}
                                active={orderBy === 'reviewTime'}>Review Time</TableSortLabel></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            tableData.map((row, index) => (
                                <TableRow hover role="checkbox" key={index} tabIndex={-1} sx={{ cursor: 'pointer' }}
                                    onClick={(event) => showReviewDetail(event, row)} >

                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.rating}</TableCell>
                                    <TableCell>{row.reviewDate}</TableCell>
                                    <TableCell>{row.reviewTime}</TableCell>

                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>

            </TableContainer>

        </Paper>
    )
}