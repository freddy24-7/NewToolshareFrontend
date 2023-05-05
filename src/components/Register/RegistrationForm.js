// This component is responsible for the registration form
import React, { useEffect, useState } from 'react';
import { SIGN_UP_URL } from '../../backend-urls/constants';
import classes from './RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import laptopguy from '../../assets/pexels-mikhail-nilov-6964367.jpg';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';
import useInput from '../../hooks/useInput';

const RegistrationForm = ({ handleRegistration }) => {
  const username = useInput('');
  const password = useInput('');
  const repeatPassword = useInput('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);
  const [backEndError, setBackendError] = useState(false);

  //Custom hook to make API calls
  const { post, loading, error, data, statusCode } = useAxios();

  const navigate = useNavigate();

  //Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  // Making the API request when the form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation in frontend
    if (username.value.trim().length === 0) {
      setErrorMessage('Gebruikersnaam is verplicht');
      setInputError(true);
      return;
    }
    if (password.value.trim().length === 0) {
      setErrorMessage('Wachtwoord is verplicht');
      setInputError(true);
      return;
    }
    if (password.value.length < 8 || password.length > 16) {
      setErrorMessage('Wachtwoord moet tussen 8 en 16 tekens zijn');
      setInputError(true);
      return;
    }
    if (password.value !== repeatPassword.value) {
      setErrorMessage('Wachtwoorden komen niet overeen');
      setInputError(true);
      return;
    }

    // Clearing the error message after successful validation
    setErrorMessage('');

    // Preparing payload for Api request
    const payload = {
      username: username.value,
      password: password.value,
    };

    // Making the API request
    post(SIGN_UP_URL, payload, { 'Content-Type': 'application/json' });
    incrementApiCalls();
  };

  // When the API request is complete, handle the response
  useEffect(() => {
    console.log(statusCode);
    if (statusCode === 201) {
      // Registration successful, navigate to login page
      handleRegistration();
      localStorage.setItem('isRegistered', JSON.stringify(true));
      navigate('/login');
    }
    if (error && error.response && error.response.status === 409) {
      // User already exists
      setBackendError(true);
    }
    console.log('API calls: ', apiCalls);
  }, [data, error]);

  //Dynamic use of CSS, other styles appear if input is invalid
  const inputClasses =
    inputError || backEndError ? classes.authinvalid : classes.auth;

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
              {...username}
              placeholder={'Kies een gebruikersnaam'}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              {...password}
              placeholder={'Kies een wachtwoord - ten minste 8 tekens'}
            />
          </div>
          <div>
            <label htmlFor="repeatPassword">Repeat Password:</label>
            <input
              type="password"
              id="repeatPassword"
              {...repeatPassword}
              placeholder={'Herhaal wachtwoord'}
            />
          </div>
          {errorMessage.length > 0 && (
            <div>
              <p className={classes.error}>{errorMessage}</p>
            </div>
          )}
          {loading && <p>Your inputs are ok!</p>}
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          <Button type="submit">Register</Button>
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

export default RegistrationForm;
