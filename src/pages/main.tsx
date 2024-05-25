import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AppContext } from "../App";
import { useContext } from "react";
import { TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link } from '@mui/material';

export const Main=() =>{

    const shouldLoad=useRef(true);
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([] as any[]);

    const { userData } = useContext(AppContext);

    useEffect(() => {
        if (shouldLoad.current) {
          shouldLoad.current = false;
          loadData();
        }
    
      }, []);



    const loadData = () => {

        let loadUrl = "http://localhost:8080/api/movies/recent";
        console.log(loadUrl);

        let config={};

    if(userData!=null){
      config = {
        headers: {
          'Authorization': "Bearer " + userData.jwtToken
        }
      };
    }
       

        axios.get(loadUrl,config).then((response) => {
            setTableData(response.data.movieList);
        });
    }

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
              return { ...m, favourite: true }; 
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
    
        axios.delete(loadUrl,config).then((response) => {
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


    return (
        <Paper sx={{ width: '80%', overflow: 'hidden', margin: '3rem auto' }}>

      <Typography variant='h4' component='div' sx={{ flexGrow: 1 }} >
        HOMEPAGE
      </Typography>
      <Box sx={{ margin: '0 10% 5% 10%' }}>
        
       
      </Box>



      <TableContainer sx={{ maxHeight: '35rem' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>User Rating</TableCell>
              <TableCell>Metascore</TableCell>
              <TableCell>User num ratings</TableCell>
              {
                userData != null ? <TableCell>Add to Favourites</TableCell> : null
              }
            </TableRow>


          </TableHead>
          <TableBody>
            {
              tableData.map((row, index) => (
                <TableRow  key={index} tabIndex={-1}>

                  <TableCell  role="checkbox"  sx={{ cursor: 'pointer' }}
                  onClick={() => handleClick(row)}>{row.title}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.userRating}</TableCell>
                  <TableCell>{row.metascore}</TableCell>
                  <TableCell>{row.userNumRatings}</TableCell>

                  {
                    row.favourite === false && userData != null ? <TableCell><Button type='submit' variant='contained' color='primary' onClick={()=>addFavourite(row)} >
                      ADD
                    </Button></TableCell> : row.favourite === true ? <TableCell><Button type='submit' variant='contained' color='primary' onClick={()=>removeFavourite(row)} >
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