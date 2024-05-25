import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {AllReviewsSearchDialog} from '../components/AllReviewsSearchDialog';

import { TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link } from '@mui/material';


export function AllMetacriticReviews() {

  const navigate = useNavigate();

  const location = useLocation();

  const [orderBy, setOrderBy] = useState("movie.title");
  const [order, setOrder] = useState("asc");

  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(100);
  const [fromItem, setFromItem] = useState(0);
  const [toItem, setToItem] = useState(0);

  const buttonContainer = { display: "flex", float: 'right' };

  const [movieId, setMovieId] = useState(0);

  const [tableData, setTableData] = useState([] as any[]);

  const shouldLoad = useRef(true);

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  let [searchData, setSearchData] = useState({
    minRatingSearch: "",
    maxRatingSearch: "",
    usernameSearch: "",
    titleSearch:"",
    fromReviewDateSearch: null,
    toReviewDateSearch: null

  });


  useEffect(() => {
    if (shouldLoad.current) {
      shouldLoad.current = false;
      let currentMovieId = location.state;
      setMovieId(currentMovieId);
      loadData(currentMovieId, 1, "movie.title", 'asc');
    }

  }, []);

  const loadData = (movieId: number, pageNumSearch: number, orderByParam: string, orderParam: string) => {

    let loadUrl = "http://localhost:8080/api/movies/metacritic/reviews?pageNumber=" + pageNumSearch + "&itemsPerPage=10&sortBy=" + orderByParam + "&direction=" + orderParam;
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

    if(searchData.titleSearch!==null && searchData.titleSearch.length>0){
      loadUrl += "&title=" + searchData.titleSearch;
    }

    axios.get(loadUrl).then((response) => {
      setTableData(response.data.reviewList);
      setPageNumber(response.data.pageNumber);
      setTotalItems(response.data.totalNumber);
      setFromItem(response.data.fromNum);
      setToItem(response.data.toNum);
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

  const handleClick = (event: React.MouseEvent<unknown>, reviewData: any) => {
    console.log("selezionato record con id: " + reviewData.id);
    navigate("/metacriticReviewDetail", { state: reviewData });
  };

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


      <Typography variant='h4' component='div' sx={{ flexGrow: 1 }} >
        ALL METACRITIC REVIEWS
      </Typography>
      <Box sx={{ margin: '0 10% 5% 10%' }}>
        <Box sx={buttonContainer}>
          <Button type='submit' variant='contained' color='primary' onClick={openSearchDialog} >
            SEARCH ALL METACRITIC USER REVIEWS
          </Button>
          <AllReviewsSearchDialog movieId={movieId} pageNumFunc={setPageNumber} loadDataFunc={loadData} orderBy={orderBy} order={order} dialogOpen={searchDialogOpen} dialogOpenFunc={setSearchDialogOpen}
            searchData={searchData} setSearchData={setSearchData}></AllReviewsSearchDialog>
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
              <TableCell><TableSortLabel onClick={() => { handleSortRequest("movie.title") }}
                direction={orderBy === 'movie.title' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'movie.title'}>Title</TableSortLabel></TableCell>

              <TableCell><TableSortLabel onClick={() => { handleSortRequest("username") }}
                direction={orderBy === 'username' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'username'}>Username</TableSortLabel></TableCell>

              <TableCell><TableSortLabel onClick={() => { handleSortRequest("rating") }}
                direction={orderBy === 'rating' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'rating'}>Rating</TableSortLabel>
              </TableCell>
              <TableCell><TableSortLabel onClick={() => { handleSortRequest("reviewDate") }}
                direction={orderBy === 'reviewDate' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'reviewDate'}>Review Date</TableSortLabel></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              tableData.map((row, index) => (
                <TableRow hover role="checkbox" key={index} tabIndex={-1} sx={{ cursor: 'pointer' }}
                  onClick={(event) => handleClick(event, row)} >
                  <TableCell>{row.movieTitle}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.rating}</TableCell>
                  <TableCell>{row.reviewDate}</TableCell>

                </TableRow>
              ))
            }

          </TableBody>
        </Table>

      </TableContainer>

    </Paper>
  );

}