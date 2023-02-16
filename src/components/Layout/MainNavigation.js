//This is the MainNavigation component. It is used to navigate between the different pages in the application.
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import applicationLogo from '../../assets/1667993269612blob.jpg';
import Button from '../Button/Button';

const MainNavigation = ({ isRegistered, isLoggedIn, handleLogout }) => {
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
          {isRegistered ? (
            isLoggedIn ? (
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Button to="/" onClick={handleLogout}>
                    Logout
                  </Button>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            )
          ) : (
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          )}
        </nav>
      </header>
    </>
  );
};

export default MainNavigation;
