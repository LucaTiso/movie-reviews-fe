import React from 'react';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import {Main} from './pages/main';
import {Login} from './pages/login';
import {useState,createContext} from 'react';
import { CreatePost } from './pages/create-post/create-post';
import { MuiNavbar } from './components/MuiNavbar';
import { Registration } from './pages/registration';
import { EditProfile } from './pages/editProfile';
import { MovieTable } from './pages/movie-table';
import { MovieDetail } from './pages/movie-detail';
import { MovieEdit } from './pages/movie-edit';
import {MetacriticReviews} from './pages/metacritic-reviews';
import {WebappReviews} from './pages/webapp-reviews';
import {MetacriticReviewDetail} from './pages/metacritic-review-detail';
import { WebappReviewDetail } from './pages/webapp-review-detail';
import {Favourites} from './pages/favourites';
import {AllMetacriticReviews} from './pages/all-metacritic-reviews';
import {AllWebappReviews} from './pages/all-webapp-reviews';
import { ActivateAccount } from './pages/activate-account';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ViewProfile } from './pages/view-profile';
import {EditPassword} from './pages/editPassword';



export const AppContext=createContext<any>({});

function App() {
  const [userData,setUserData] =useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="App">
      <AppContext.Provider value={{userData,setUserData}}>
      <Router>
      <MuiNavbar/>
       <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/registration" element={<Registration/>}/>
          <Route path="/editProfile" element={<EditProfile/>}/>
          <Route path="/create" element={<CreatePost/>}></Route>
          <Route path="/movieTable" element={<MovieTable/>}></Route>
          <Route path="/movieDetail" element={<MovieDetail/>}></Route>
          <Route path="/movieEdit" element={<MovieEdit/>}></Route>
          <Route path="/metacriticReviews" element={<MetacriticReviews/>}></Route>
          <Route path="/webappReviews" element={<WebappReviews/>}></Route>
          <Route path="/metacriticReviewDetail" element={<MetacriticReviewDetail/>}></Route>
          <Route path="/webappReviewDetail" element={<WebappReviewDetail/>}></Route>
          <Route path="/favourites" element={<Favourites/>}></Route>
          <Route path="/allMetacriticReviews" element={<AllMetacriticReviews/>}></Route>
          <Route path="/allWebappReviews" element={<AllWebappReviews/>}></Route>
          <Route path="/activate-account" element={<ActivateAccount/>}></Route>
          <Route path="/view-profile" element={<ViewProfile/>}></Route>
          <Route path="/changePassword" element={<EditPassword/>}></Route>
        </Routes> 
        </Router> 
        </AppContext.Provider>
    </div>
    </LocalizationProvider>
  );
}

export default App;
