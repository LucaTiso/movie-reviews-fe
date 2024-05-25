import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { MovieReviewSearchDialog } from '../components/MovieReviewSearchDialog';

import { TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link } from '@mui/material';


export function MetacriticReviews() {

  const navigate = useNavigate();

  const location = useLocation();

  const [orderBy, setOrderBy] = useState("username");
  const [order, setOrder] = useState("asc");

  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(100);
  const [fromItem, setFromItem] = useState(0);
  const [toItem, setToItem] = useState(0);

  const [movieId, setMovieId] = useState(0);

  const [currentMovieTitle, setCurrentMovieTitle] = useState("");

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
      let currentMovieId = location.state.id;

      setMovieId(currentMovieId);
      
      loadData(currentMovieId, 1, "username", 'asc');
    }

  }, []);

  const loadData = (movieId: number, pageNumSearch: number, orderByParam: string, orderParam: string) => {

    let loadUrl = "http://localhost:8080/api/movies/" + movieId + "/metacritic/reviews?pageNumber=" + pageNumSearch + "&itemsPerPage=10&sortBy=" + orderByParam + "&direction=" + orderParam;
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


    axios.get(loadUrl).then((response) => {
      setTableData(response.data.reviewList);
      setPageNumber(response.data.pageNumber);
      setTotalItems(response.data.totalNumber);
      setFromItem(response.data.fromNum);
      setToItem(response.data.toNum);
      setCurrentMovieTitle(response.data.title);
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


    let payLoad = {
      id: reviewData.id,
      title: currentMovieTitle
    }


    navigate("/metacriticReviewDetail", { state: payLoad });
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


      <Typography variant='h6' component='div' sx={{ flexGrow: 1 }} >
        METACRITIC REVIEWS {currentMovieTitle}
      </Typography>
      <Box sx={{ margin: '0 10% 5% 10%' }}>

        <Box sx={buttonContainer}>
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

                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.rating}</TableCell>
                  <TableCell>{row.reviewDate}</TableCell>


                </TableRow>

                /* <React.Fragment key={index}>
                 <TableRow hover role="checkbox" tabIndex={-1} sx={{ cursor: 'pointer' }} onClick={(event) => handleClick(event, row)}>
                   <TableCell>{row.username}</TableCell>
                   <TableCell>{row.rating}</TableCell>
                   <TableCell>{row.reviewDate}</TableCell>
                 </TableRow>
                 <TableRow>
                   <TableCell colSpan={3} style={{ padding: 0 }}>
                     <div style={{ padding: '16px', color: '#888', fontSize: '0.875rem' }}>
                     TESTO DELLA RECENSIONE
                     </div>
                   </TableCell>
                 </TableRow>
               </React.Fragment>*/

              ))
            }

          </TableBody>
        </Table>

      </TableContainer>

    </Paper>
  );

}