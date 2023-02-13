import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Card from '../Card/Card';
import classes from './LoginForm.module.css';
import Button from '../Button/Button';
import laptopgirl from '../../assets/pexels-jopwell-2422286.jpg';
import { SIGN_IN_URL } from '../../backend-urls/constants';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';

const LoginForm = ({ changeLoginState }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //using context to store jwt token
  const authContext = useContext(AuthContext);

  //Constant for dynamic CSS display
  const [errorCSS, setErrorCSS] = useState(false);

  // Preparing payload for Api request
  const payload = {
    username,
    password,
  };

  // Making the API request. Keeping track of the number of API calls
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(SIGN_IN_URL, payload).then((response) => {
        console.log(response);
        const data = response.data;
        authContext.login(response.data.token);
        //Defining user object for backend
        const user = {
          token: data.token,
          id: data.id,
          username: data.username,
          password: data.password,
        };
        //storing jwt token for future authentication. Token is later deleted on log-out
        localStorage.setItem('jwt', data.token);
        //checking the data we have access to with a console.log
        console.log(user);
        console.log(user.id);
        //storing userid in local storage - to be utilized later in the application
        localStorage.setItem('userId', user.id);
        console.log(user.token);
      });
      //navigate to profile page after successful login
      navigate('/profile');
      incrementApiCalls();
      changeLoginState();
    } catch (error) {
      setError(error.message);
      console.log(error);
      //403 is the only backend error response possible in this configuration
      //checking error response stats
      console.log(error.response.status);
      //storing it in a variable
      const errorCheck = error.response.status;

      //setting the error
      if (errorCheck === 403) {
        setError('Ongeldige gebruikersgegevens ingevoerd');
        setErrorCSS(true);
        console.log(errorCSS);
      }
    } finally {
      setIsLoading(false);
    }
    console.log('API calls: ', apiCalls);
  };

  //Dynamic use of CSS, other styles appear if input is invalid
  const inputClasses = errorCSS ? classes.authinvalid : classes.auth;

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
          <Button type="submit">{isLoading ? 'Loading...' : 'Login'}</Button>
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
