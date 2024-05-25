import { useState } from "react";
import { AppBar, Toolbar, Typography, Stack, Button, Menu, MenuItem } from '@mui/material';
import { Box, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useContext } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

export const MuiNavbar = () => {

  const { userData } = useContext(AppContext);

  console.log("current user data: ");




  console.log(userData);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const toFavourites=() =>{
    setAnchorEl(null);
    navigate("/favourites")
  }

  const handleViewProfile = () => {
    setAnchorEl(null);
    navigate("/view-profile");
  }

  const toHomepage = () => {
    navigate("/");

  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }} style={{ cursor: 'pointer' }} onClick={toHomepage}>
            MOVIE REVIEWS APP
          </Typography>
          <Stack direction='row' spacing={2}>

            <Button onClick={() => navigate("/movieTable")} color='inherit'>Movie Table</Button>
            <Button onClick={()=> navigate("/allMetacriticReviews")} color='inherit'>ALL METACRITIC REVIEWS</Button>
            <Button onClick={()=> navigate("/allWebappReviews")} color='inherit'>ALL WEBAPP REVIEWS</Button>
            {userData == null ? <Button color='inherit' onClick={() => navigate("/login")}>Login</Button> :
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-profile"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

            }
            
            {userData != null ?
              <Menu id="menu-profile"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
                <MenuItem onClick={toFavourites}>Preferiti</MenuItem>
              </Menu> : null}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
