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

export const AppContext=createContext<any>({});

function App() {
  const [user,setUser] =useState(null);

  return (
    <div className="App">
      <AppContext.Provider value={{user,setUser}}>
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
        </Routes> 
        </Router> 
        </AppContext.Provider>
    </div>
  );
}

export default App;
