import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { useContext } from "react";
import { AppContext } from "../App";
import { myGlobalFunction } from "../pages/utils/utils";
import {
  TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link
  , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid,TextField
} from '@mui/material';
import {MovieSearchDialog} from '../components/MovieSearchDialog';

const Item = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? '#444d58' : '#ced7e0',
  padding: theme.spacing(2),
  borderRadius: '4px',
  display: 'flex'
}));


export function MovieTable() {

  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  const [orderBy, setOrderBy] = useState("title");
  const [order, setOrder] = useState("asc");


  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(100);
  const [fromItem, setFromItem] = useState(0);
  const [toItem, setToItem] = useState(0);

  const [tableData, setTableData] = useState([] as any[]);

  const shouldLoad = useRef(true);

  const buttonContainer = { display: "flex", float: 'right' };

  let [searchData,setSearchData] =useState({
    minRatingSearch:"",
    maxRatingSearch:"",
    titleSearch:"",
    minMetascoreSearch:"",
    maxMetascoreSearch:"",
    minUserNumRatingSearch:"",
    maxUserNumRatingSearch:"",
    fromYearSearch:null,
    toYearSearch:null,
    genresSearch:[]

  });


  


  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  useEffect(() => {
    if (shouldLoad.current) {
      shouldLoad.current = false;
      loadData(1, "title", 'asc');
    }

  }, []);

  const loadData = (pageNumSearch: number, orderByParam: string, orderParam: string) => {

    let loadUrl = "http://localhost:8080/api/movies?pageNumber=" + pageNumSearch + "&itemsPerPage=10&sortBy=" + orderByParam + "&direction=" + orderParam;

      console.log("searchData:");
      console.log(searchData);

   
      if(searchData.titleSearch!=="" && searchData.titleSearch.length>0){
        loadUrl+="&title="+searchData.titleSearch;
      }
      if(searchData.minRatingSearch!=="" && searchData.minRatingSearch.length>0){
        loadUrl+="&minUserRating="+parseFloat(searchData.minRatingSearch);
      }
  
      if(searchData.maxRatingSearch!=="" && searchData.maxRatingSearch.length>0){
        loadUrl+="&maxUserRating="+parseFloat(searchData.maxRatingSearch);
      }

      if(searchData.minMetascoreSearch!=="" && searchData.minMetascoreSearch.length>0){
        loadUrl+="&minMetascore="+parseInt(searchData.minMetascoreSearch);
      }
  
      if(searchData.maxMetascoreSearch!=="" && searchData.maxMetascoreSearch.length>0){
        loadUrl+="&maxMetascore="+parseInt(searchData.maxMetascoreSearch);
      }

      if(searchData.minUserNumRatingSearch!=="" && searchData.minUserNumRatingSearch.length>0){
        loadUrl+="&minUserNumRating="+parseInt(searchData.minUserNumRatingSearch);
      }

      if(searchData.maxUserNumRatingSearch!=="" && searchData.maxUserNumRatingSearch.length>0){
        loadUrl+="&maxUserNumRating="+parseInt(searchData.maxUserNumRatingSearch);
      }

      if(searchData.fromYearSearch!==null){
        loadUrl+="&fromYear="+parseInt(searchData.fromYearSearch);
      }

      if(searchData.toYearSearch!==null){
        loadUrl+="&toYear="+parseInt(searchData.toYearSearch);
      }




      if(searchData.genresSearch!=null && searchData.genresSearch.length>0){
        searchData.genresSearch.forEach((g:string)=>{
          loadUrl+="&genres="+g;
        });

      }
  


    console.log(loadUrl);
    setOrderBy(orderByParam);
    setOrder(orderParam);

    let config = {};

    if (userData != null) {
      config = {
        headers: {
          'Authorization': "Bearer " + userData.jwtToken
        }
      };
    }

    axios.get(loadUrl, config).then(response => {
      console.log(response);
      setTableData(response.data.movieList);
      setPageNumber(response.data.pageNumber);
      setTotalItems(response.data.totalNumber);
      setFromItem(response.data.fromNum);
      setToItem(response.data.toNum);
    },
      error => {
        console.log(error);
        if (error.response.status === 403) {

          myGlobalFunction(userData).then(response => {
            console.log(response);
            userData.jwtToken = response.jwtToken;

            config = {
              headers: {
                'Authorization': "Bearer " + response.jwtToken
              }
            };

            axios.get(loadUrl, config).then(response => {
              console.log(response);
              setTableData(response.data.movieList);
              setPageNumber(response.data.pageNumber);
              setTotalItems(response.data.totalNumber);
              setFromItem(response.data.fromNum);
              setToItem(response.data.toNum);
            });
          });

        }
      });
  }


  const changePage = (num: number) => {

    console.log("PAGE NUMBER: " + num);
    loadData(pageNumber + num, orderBy, order);
  };



  const addFavourite = (movieData: any) => {
    let loadUrl = "http://localhost:8080/api/webapp-users/favourites/" + movieData.id;

    const config = {
      headers: {
        'Authorization': "Bearer " + userData.jwtToken
      }
    };

    axios.put(loadUrl, null, config).then((response) => {
      console.log(response);

      const updatedList = tableData.map(m => {
        if (m.id === movieData.id) {
          return { ...m, favourite: true }; // Creazione di un nuovo oggetto con il valore aggiornato
        }
        return m;
      });


      console.log(updatedList);

      setTableData(updatedList);

    });

  }

  const removeFavourite = (movieData: any) => {



    let loadUrl = "http://localhost:8080/api/webapp-users/favourites";

    const config = {
      headers: {
        'Authorization': "Bearer " + userData.jwtToken
      },
      data: [movieData.id]
    };

    axios.delete(loadUrl, config).then((response) => {
      console.log(response);

      const updatedList = tableData.map(m => {
        if (m.id === movieData.id) {
          return { ...m, favourite: false };
        }
        return m;
      });


      console.log(updatedList);

      setTableData(updatedList);



    });

  }

  const handleClick = (movieData: any) => {
    console.log("selezionato record con id: " + movieData.id);
    navigate("/movieDetail", { state: movieData });
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
    loadData(pageNumber, orderByParam, orderParam);
  }


  const openSearchDialog = () => {
    setSearchDialogOpen(true);
    
  }




  return (
    <Paper sx={{ width: '80%', overflow: 'hidden', margin: '3rem auto' }}>

      <Typography variant='h4' component='div' sx={{ flexGrow: 1 }} >
        MOVIE REVIEWS APP
      </Typography>
      <Box sx={{ margin: '0 10% 5% 10%' }}>
        <Box sx={buttonContainer}>
          <Button type='submit' variant='contained' color='primary' onClick={openSearchDialog} >
            SEARCH MOVIE
          </Button>
          <MovieSearchDialog pageNumFunc={setPageNumber} loadDataFunc={loadData} orderBy={orderBy} order={order} dialogOpen={searchDialogOpen} dialogOpenFunc={setSearchDialogOpen}
           searchData={searchData} setSearchData={setSearchData}></MovieSearchDialog>
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
              <TableCell><TableSortLabel onClick={() => { handleSortRequest("title") }}
                direction={orderBy === 'title' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'title'}>Title</TableSortLabel></TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell><TableSortLabel onClick={() => { handleSortRequest("userRating") }}
                direction={orderBy === 'userRating' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'userRating'}>User Rating</TableSortLabel>
              </TableCell>
              <TableCell><TableSortLabel onClick={() => { handleSortRequest("metascore") }}
                direction={orderBy === 'metascore' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'metascore'}>Metascore</TableSortLabel></TableCell>
              <TableCell><TableSortLabel onClick={() => { handleSortRequest("userNumRatings") }}
                direction={orderBy === 'userNumRatings' && order === 'asc' ? 'asc' : 'desc'}
                active={orderBy === 'userNumRatings'}>user num ratings</TableSortLabel></TableCell>
              {
                userData != null ? <TableCell>Add to Favourites</TableCell> : null
              }
            </TableRow>



          </TableHead>
          <TableBody>
            {
              tableData.map((row, index) => (
                <TableRow key={index} tabIndex={-1}>

                  <TableCell role="checkbox" sx={{ cursor: 'pointer' }}
                    onClick={() => handleClick(row)}>{row.title}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.userRating}</TableCell>
                  <TableCell>{row.metascore}</TableCell>
                  <TableCell>{row.userNumRatings}</TableCell>

                  {
                    row.favourite === false && userData != null ? <TableCell><Button type='submit' variant='contained' color='primary' onClick={() => addFavourite(row)} >
                      ADD
                    </Button></TableCell> : row.favourite === true ? <TableCell><Button type='submit' variant='contained' color='primary' onClick={() => removeFavourite(row)} >
                      REMOVE
                    </Button></TableCell> : null
                  }

                </TableRow>
              ))
            }

          </TableBody>
        </Table>

      </TableContainer>
    </Paper>

  );

}