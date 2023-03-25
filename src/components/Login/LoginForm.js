// This component is used to log in a user, and direct a first time user to the profile page,
// and a repeat user to the start page.
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card/Card';
import classes from './LoginForm.module.css';
import Button from '../Button/Button';
import laptopgirl from '../../assets/pexels-jopwell-2422286.jpg';
import { SIGN_IN_URL } from '../../backend-urls/constants';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';
import usePrevUserIds from '../../hooks/usePreviousUsers';

const LoginForm = ({ changeLoginState, handleRegistration, handleUpdate }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [backEndError, setBackendError] = useState(false);
  const [participantId, setParticipantId] = useState(null);
  const { prevUserIds, prevParticipantIds } = usePrevUserIds();

  //Custom hook to make API calls
  const { post, loading, error, data } = useAxios();

  //Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  // React router hook to navigate to other pages
  const navigate = useNavigate();

  // Preparing payload for Api request
  const payload = {
    username,
    password,
  };

  // Making the API request when the form is submitted
  const handleLogin = async (event) => {
    event.preventDefault();
    post(SIGN_IN_URL, payload, { 'Content-Type': 'application/json' });
    incrementApiCalls();
  };

  //Checking if the user is logged in
  useEffect(() => {
    if (data && data.token) {
      // Login successful, set the token and navigate to profile page
      login(data.token);
      changeLoginState();
      console.log(data.id);
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      //Checking if user has already uploaded participant details
      if (prevUserIds.includes(data.id)) {
        const index = prevUserIds.indexOf(data.id);
        console.log(index);
        const participantId = prevParticipantIds[index];
        setParticipantId(participantId);
        localStorage.setItem('isRegistered', JSON.stringify(true));
        localStorage.setItem('isUpdated', JSON.stringify(true));
        //sending the user to the start page
        navigate(`/start/${participantId}`);
      } else {
        console.log('User has not uploaded participant details yet');
        //sending the user to the profile page
        navigate('/profile');
      }
    } else if (error && error.response && error.response.status === 403) {
      // Wrong username or password
      setBackendError(true);
      console.log('Wrong username or password');
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
