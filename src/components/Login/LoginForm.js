// This component is used to login a user
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card/Card';
import classes from './LoginForm.module.css';
import Button from '../Button/Button';
import laptopgirl from '../../assets/pexels-jopwell-2422286.jpg';
import { PARTICIPANT_URL, SIGN_IN_URL } from '../../backend-urls/constants';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';

const LoginForm = ({ changeLoginState }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [backEndError, setBackendError] = useState(false);
  const [participants, setParticipants] = useState([]);

  //Custom hook to make API calls
  const { post, get, loading, error, data, statusCode } = useAxios();

  //Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  // React router hook to navigate to other pages
  const navigate = useNavigate();

  // Preparing payload for Api request
  const payload = {
    username,
    password,
  };

  //To allow a user to go straight to trading pages if already additional details were earlier
  //provided, we need to check if the user has already provided additional details
  //To do so we are checking the user id against the ids of the participants
  //Defining an empty array to store the user-ids of existing participants
  const [prevUserIds, setPrevUserIds] = useState([]);

  useEffect(() => {
    //obtaining the data needed to check if the user has already provided additional details
    get(`${PARTICIPANT_URL}`);
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  }, []);

  useEffect(() => {
    if (data) {
      // Map through the data and create a new array of ids
      const oldUserIds = data.map((item) => (item.user ? item.user.id : null));
      setPrevUserIds(oldUserIds);
    }
  }, [data]);
  console.log(prevUserIds);

  // Making the API request when the form is submitted
  const handleLogin = async (event) => {
    event.preventDefault();
    post(SIGN_IN_URL, payload, { 'Content-Type': 'application/json' });
    incrementApiCalls();
  };

  // When the API request is complete, handle the response
  useEffect(() => {
    if (data) {
      if (statusCode === 200) {
        // Login successful, set the token and navigate to profile page
        login(data.token);
        changeLoginState();
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        navigate('/profile');
      } else if (error && error.response && error.response.status === 403) {
        // Wrong username or password
        setBackendError(true);
        console.log('Wrong username or password');
      }
    }
  }, [data, error]);

  //Dynamic use of CSS, other styles appear if input is invalid
  const inputClasses = error ? classes.authinvalid : classes.auth;

  return (
    <>
      <Card className={inputClasses}>
        <form className={classes.control} onSubmit={handleLogin}>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              placeholder="Jouw gebruikersnaam"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              placeholder="Jouw wachtwoord"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <Button type="submit">{loading ? 'Loading...' : 'Login'}</Button>
        </form>
      </Card>
      <section>
        <div className={classes.photo}>
          <img src={laptopgirl} alt="laptopgirl" height={300} width={320} />
        </div>
      </section>
    </>
  );
};

export default LoginForm;
