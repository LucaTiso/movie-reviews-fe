import * as React from 'react';
import {useState,useEffect,useRef} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import {TableContainer,Paper,Table,TableBody,TableCell,Button,TableHead,Box,TableRow,TableSortLabel,Typography,Link} from '@mui/material';


export function MovieTable() {

  const navigate=useNavigate();


  //const [order,setOrder]=useState("asc");
  const [orderBy,setOrderBy]=useState("currentPosition");
  const [order,setOrder]=useState("asc");

  //let tmpOrderBy="currentPosition";
  //let tmpOrder="asc"; 

 
  const [pageNumber,setPageNumber]=useState(0);
  const [itemsPerPage,setItemsPerPage]=useState(10);
  const [totalItems,setTotalItems]=useState(100);
  const [fromItem,setFromItem]=useState(0);
  const [toItem,setToItem]=useState(0);

  const [tableData,setTableData]=useState([] as any[]);

  const shouldLoad=useRef(true);

  const buttonContainer= {display:"flex",float:'right'};

  useEffect(()=>{
    if(shouldLoad.current){
      shouldLoad.current=false;
      loadData(0,"currentPosition",'asc');
    }
    
  },[]);

  const loadData=(pageNumSearch:number,orderByParam:string,orderParam:string)=>{

    let loadUrl="http://localhost:8080/api/movies?pageNumber="+pageNumSearch+"&itemsPerPage=10&sortBy="+orderByParam+"&direction="+orderParam;
    console.log(loadUrl);
    setOrderBy(orderByParam);
    setOrder(orderParam);

    //console.log(tmpOrder);
    //console.log(tmpOrderBy);

    axios.get(loadUrl).then((response)=>{
      console.log(response);
      setTableData(response.data.movieList);
      setPageNumber(response.data.pageNumber);
      setTotalItems(response.data.totalNumber);
      setFromItem(response.data.fromNum);
      setToItem(response.data.toNum);
    });
}


  const changePage=(num:number)=>{

    console.log("PAGE NUMBER: "+num);
    //setPageNumber(pageNumber+num);
    //console.log(tmpOrderBy);
    //console.log(tmpOrder);
    loadData(pageNumber+num,orderBy,order);
  };
  
  // year , duration , rating , metascore, numRatings , currentPosition

const addMovie=()=>{
  let movieData={
    title : "",
    originalTitle : "",
    currentPosition : null,
    year : null,
    duration : null,
    regia : "",
    sceneggiatura : "",
    star : "",
    movieCast : "",
    plot : "",
    rating : null,
    metascore : null,
    numRatings : null
  };

  navigate("/movieEdit",{state:movieData});
}

  const handleClick=(event: React.MouseEvent<unknown>,movieData:any)=>{
    console.log("selezionato record con id: "+movieData.id);
    navigate("/movieDetail",{state:movieData});
  };

  const handleSortRequest=(columnName:string)=>{
    let orderParam=""
    
    // inverto l'ordine
    if(columnName===orderBy){
     
      orderParam=order==='asc'?'desc':'asc';
      setOrder(orderParam);
    }else{
      // setto asc
      orderParam="asc";
      setOrder("asc");
    }

    let orderByParam=columnName;
    setOrderBy(columnName);
    loadData(pageNumber,orderByParam,orderParam);
  }
 
  return (
    <Paper sx={{ width: '80%', overflow: 'hidden', margin: '3rem auto' }}>
      
      <Typography variant='h4' component='div' sx={{ flexGrow: 1 }} >
                    MOVIE REVIEWS APP
                </Typography>
              <Box sx={{margin:'0 10% 5% 10%'}}>
                <Box sx={buttonContainer}>
                <Button type='submit' variant='contained' color='primary' onClick={addMovie} >
                    NEW MOVIE
                </Button>
                </Box>

                
                  <Typography>
                 {fromItem} - {toItem} of {totalItems} titles. | {pageNumber!==0? <Link component="button" onClick={()=>changePage(-1)}>Previous</Link>:null} 
                  {toItem!==totalItems?<Link component="button" onClick={()=>changePage(1)}>Next</Link>:null}
              </Typography>
              </Box>
                
    
    
    <TableContainer sx={{ maxHeight: '35rem' }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
              <TableCell><TableSortLabel onClick={()=>{handleSortRequest("currentPosition")}}
                          direction={orderBy==='currentPosition'&& order==='asc'?'asc':'desc'}
                          active={orderBy==='currentPosition'}>Position</TableSortLabel>
              </TableCell>
              <TableCell><TableSortLabel onClick={()=>{handleSortRequest("movieName")}}
                          direction={orderBy==='movieName' && order==='asc'?'asc':'desc'}
                          active={orderBy==='movieName'}>Title</TableSortLabel></TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell><TableSortLabel onClick={()=>{handleSortRequest("rating")}}
                          direction={orderBy==='rating' && order==='asc'?'asc':'desc'}
                          active={orderBy==='rating'}>Rating</TableSortLabel>
              </TableCell>
              <TableCell><TableSortLabel onClick={()=>{handleSortRequest("metascore")}}
                          direction={orderBy==='metascore' && order==='asc'?'asc':'desc'}
                          active={orderBy==='metascore'}>Metascore</TableSortLabel></TableCell>
              <TableCell><TableSortLabel onClick={()=>{handleSortRequest("numRatings")}}
                          direction={orderBy==='numRatings' && order==='asc'?'asc':'desc'}
                          active={orderBy==='numRatings'}>NumRatings</TableSortLabel></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            tableData.map((row,index)=>(
              <TableRow hover role="checkbox" key={index} tabIndex={-1} sx={{ cursor: 'pointer' }}
              onClick={(event) => handleClick(event, row)} >

                <TableCell>{row.currentPosition}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.metascore}</TableCell>
                <TableCell>{row.numRatings}</TableCell>
                

              </TableRow>
            ))
          }

        </TableBody>
      </Table>

    </TableContainer>
    </Paper>

  );
    
}