import React, { useState } from 'react';
import axios from 'axios';
import { SIGN_UP_URL } from '../../backend-urls/constants';
import classes from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import laptopguy from '../../assets/pexels-mikhail-nilov-6964367.jpg';
import useApiCalls from '../../hooks/useApiCalls';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [apiCalls, incrementApiCalls] = useApiCalls();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Input validation in frontend
    if (username.trim().length === 0) {
      setErrorMessage('Username is required');
      setInputError(true);
      return;
    }
    if (password.trim().length === 0) {
      setErrorMessage('Password is required');
      setInputError(true);
      return;
    }
    if (password.length < 8 || password.length > 16) {
      setErrorMessage('Password must be between 8 and 16 characters');
      setInputError(true);
      return;
    }
    if (password !== repeatPassword) {
      setErrorMessage('Passwords do not match');
      setInputError(true);
      return;
    }

    // Clearing the error message after successful validation
    setErrorMessage('');

    // Preparing payload for Api request
    const payload = {
      username,
      password,
    };

    // Making the API request. Keeping track of the number of API calls
    axios
      .post(SIGN_UP_URL, payload)
      .then((response) => {
        console.log(response);
        incrementApiCalls();

        // Redirecting to login page
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
        //Checking error response stats
        console.log(error.response.status);
        //storing it in a variable
        const errorCheck = error.response.status;
        //setting the error
        if (errorCheck === 409) {
          setError(
            'Gebruikersnaam In gebruik, kies een andere gebruikersnaam.',
          );
        }
        setIsLoading(false);
      });
    console.log('API calls: ', apiCalls);
  };
  //Dynamic use of CSS, other styles appear if input is invalid
  const inputClasses = inputError ? classes.authinvalid : classes.auth;

  return (
    <>
      {/*Wrapping around a reusable Card component*/}
      <Card className={inputClasses}>
        <form className={classes.control} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder={'Kies een gebruikersnaam'}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder={'Kies een wachtwoord'}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="repeatPassword">Repeat Password:</label>
            <input
              type="password"
              id="repeatPassword"
              value={repeatPassword}
              placeholder={'Herhaal wachtwoord'}
              onChange={(event) => setRepeatPassword(event.target.value)}
            />
          </div>
          {errorMessage.length > 0 && (
            <div>
              <p className={classes.error}>{errorMessage}</p>
            </div>
          )}
          {isLoading && <p>Your inputs are ok!</p>}
          {error && <div className={classes.error}> {error} </div>}
          <Button type="submit">Submit</Button>
        </form>
      </Card>
      <section>
        <div className={classes.photo}>
          <img src={laptopguy} alt="laptopguy" height={300} width={220} />
        </div>
      </section>
    </>
  );
};

export default Registration;
