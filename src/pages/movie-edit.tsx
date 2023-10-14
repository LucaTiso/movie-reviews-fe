import {Box,TextField,Button,Grid} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useContext,useState} from "react";
import { styled } from '@mui/material/styles';
import {useLocation} from 'react-router-dom';
import axios from 'axios';


const Item = styled('div')(({ theme }) => ({
   
    padding: theme.spacing(2),
    
  }));

export const MovieEdit=()=>{

    const navigate=useNavigate();

    const location=useLocation();

    let currentMovie=location.state;
    
    let [title,setTitle] = useState(currentMovie.title);
    let [titleEntered,setTitleEntered]=useState(false);
    let [originalTitle, setOriginalTitle] = useState(currentMovie.originalTitle);
    let [originalTitleEntered,setOriginalTitleEntered]=useState(false);

    let [year, setYear] = useState(currentMovie.year!=null? currentMovie.year.toString():"");
    let [duration, setDuration] = useState(currentMovie.duration!=null?currentMovie.duration.toString():"");


    let [regia, setRegia] = useState(currentMovie.regia);
    let [sceneggiatura, setSceneggiatura] = useState(currentMovie.sceneggiatura);
    let [star, setStar] = useState(currentMovie.star);
    
    let [movieCast, setMovieCast] = useState(currentMovie.movieCast);

    let [plot,setPlot] = useState(currentMovie.plot);

    let [rating,setRating] = useState(currentMovie.rating!=null?currentMovie.rating.toString():"");
    let [metascore,setMetascore] = useState(currentMovie.metascore!=null?currentMovie.metascore.toString():"");
    let [numRatings,setNumRatings]=useState(currentMovie.numRatings!=null?currentMovie.numRatings.toString():"");


    const changeTitle=(event:any)=>{
        setTitle(event.target.value);
        setTitleEntered(true);
    };


    const testTitle = ()=>{
        return !title && titleEntered===true;
    }

    const changeOriginalTitle=(event:any)=>{
        setOriginalTitle(event.target.value);
        setOriginalTitleEntered(true);
    }

    const testOriginalTitle = ()=>{
        return !originalTitle && originalTitleEntered===true;
    }

    

    const changeYear=(event:any)=>{
        const regex = /^[0-9\b]+$/;
        if(event.target.value === "" || regex.test(event.target.value)){
            setYear(event.target.value);
        }

    }

    const changeStar=(event:any)=>{
       
       
        setStar(event.target.value);
        

    }

    const changeDuration=(event:any)=>{
        const regex = /^[0-9\b]+$/;
        if(event.target.value === "" || regex.test(event.target.value)){
            setDuration(event.target.value);
        }

    }

    const changeRegia=(event:any)=>{
       
            setRegia(event.target.value);
    }

    const changeSceneggiatura=(event:any)=>{
       
        setSceneggiatura(event.target.value);
    
}

const changeMovieCast=(event:any)=>{
    setMovieCast(event.target.value);
}

const changePlot=(event:any)=>{
    setPlot(event.target.value);
}

const changeRating=(event:any)=>{
    const regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
    if(event.target.value === "" || regex.test(event.target.value)){
        setRating(event.target.value);
    }

}


const changeMetascore=(event:any)=>{
    const regex = /^[0-9\b]+$/;
    if(event.target.value === "" || regex.test(event.target.value)){
        setMetascore(event.target.value);
    }

}

    const changeNumRatings=(event:any)=>{
        const regex = /^[0-9\b]+$/;
        if(event.target.value === "" || regex.test(event.target.value)){
            setNumRatings(event.target.value);
        }

    }

    const doEdit=async () => {
        let movieRequest={
            
            movieName : title,
            originalName : originalTitle,
            duration : parseInt(duration),
            regia : regia,
            sceneggiatura : sceneggiatura,
            star : star,
            movieCast : movieCast,
            movieYear : parseInt(year),
            plot : plot,
            rating : parseFloat(rating),
            numRatings : parseInt(numRatings),
            metascore : parseInt(metascore)
         
        };
  
        console.log(movieRequest);
        

        if(currentMovie.id!=null){
            axios.patch("http://localhost:8080/api/movies/"+currentMovie.id,movieRequest).then((response:any)=>{
                console.log(response);
                
                navigate("/");
      
              });
        }else{
            axios.post("http://localhost:8080/api/movies",movieRequest).then((response:any)=>{
                console.log(response);
                
                navigate("/");
      
              });
        }

        // navigate to movie detail page with popup
        
  
  
      };


    return (
        <Box sx={{width:"70%",margin:"auto"}}>
        
        
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Item>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Titolo' variant="outlined" value={title} onChange={changeTitle} error={testTitle()} helperText={testTitle()?"title is mandatory":""}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Titolo Originale' variant="outlined" value={originalTitle} onChange={changeOriginalTitle} error={testOriginalTitle()}  helperText={testOriginalTitle()?"original title is mandatory":""}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Current Position' variant="outlined" InputProps={{readOnly: true}} value={currentMovie.currentPosition!=null?currentMovie.currentPosition:"Position not set"} />
                        <TextField sx={{margin:"1rem"}} fullWidth label='Anno' variant="outlined" value={year} onChange={changeYear} />
                    </Item>
                    
                </Grid>
                <Grid item xs={6}>
                <Item>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Durata' variant="outlined" value={duration} onChange={changeDuration}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Rating' variant="outlined" value={rating} onChange={changeRating}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Metascore' variant="outlined" value={metascore} onChange={changeMetascore}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Num Ratings' variant="outlined" value={numRatings} onChange={changeNumRatings}/>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                <Item>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Regia' variant="outlined" value={regia} onChange={changeRegia}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Sceneggiatura' variant="outlined" value={sceneggiatura} onChange={changeSceneggiatura}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Star' variant="outlined" value={star} onChange={changeStar}/>
                        <TextField sx={{margin:"1rem"}} fullWidth label='Movie cast' variant="outlined" value={movieCast} onChange={changeMovieCast}/>
                        
                    </Item>
                </Grid>
                <Grid item xs={12}>
                <Item>
                <TextField
                    sx={{margin:"1rem"}}
                    fullWidth
                    label="Plot"
                    placeholder="MultiLine with rows: 2 and rowsMax: 4"
                    multiline
                    rows={4}
                    
                    value={plot}
                    onChange={changePlot}
                />
                </Item>
                </Grid>
                <Button type='submit' variant='contained' color='primary' onClick={doEdit} >
                    Conferma
                </Button>


            </Grid>

        </Box>
    );
}