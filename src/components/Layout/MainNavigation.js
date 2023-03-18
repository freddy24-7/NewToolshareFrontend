//This is the MainNavigation component. It is used to navigate between the different pages in the application.
import { Link, useNavigate, useParams } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import applicationLogo from '../../assets/1667993269612blob.jpg';
import Button from '../Button/Button';
import { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { PARTICIPANT_URL } from '../../backend-urls/constants';

function MainNavigation({ isRegistered, isLoggedIn, isUpdated, handleLogout }) {
  return (
    <>
      <header className={classes.header}>
        <div>
          <img
            className={classes.logo}
            src={applicationLogo}
            alt="logo"
            height={83}
            width={85}
          />
        </div>
        <nav>
          {!isRegistered && !isLoggedIn && !isUpdated ? (
            // Display "Register" and "Login" buttons
            <ul>
              <li>
                <Link to="/" className={classes.nav}>
                  Home
                </Link>
                <Link to="/register" className={classes.nav}>
                  Register
                </Link>
                <Link to="/login" className={classes.nav}>
                  Login
                </Link>
              </li>
            </ul>
          ) : isRegistered && !isLoggedIn && !isUpdated ? (
            // Display "Home" and "Login" buttons
            <ul>
              <li>
                <Link to="/" className={classes.nav}>
                  Home
                </Link>
                <Link to="/login" className={classes.nav}>
                  Login
                </Link>
              </li>
            </ul>
          ) : isRegistered && isLoggedIn && !isUpdated ? (
            // Display "Home", "Logout" and "Profile" buttons
            <ul>
              <li>
                <Link to="/" className={classes.nav}>
                  Home
                </Link>
                <Link to="/profile" className={classes.nav}>
                  Profile
                </Link>
                <Button to="/" className={classes.nav} onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </ul>
          ) : isRegistered && isLoggedIn && isUpdated ? (
            // Display "Home", "Logout" and transaction buttons
            <ul>
              <li>
                <Link to="/" className={classes.nav}>
                  Home
                </Link>
                <Link to="/participants" className={classes.nav}>
                  Participants
                </Link>
                <Link
                  to={`/items/${localStorage.getItem('id')}`}
                  className={classes.nav}
                >
                  Lend-Out
                </Link>
                <Button to="/" className={classes.nav} onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </ul>
          ) : null}
        </nav>
      </header>
    </>
  );
}

export default MainNavigation;
