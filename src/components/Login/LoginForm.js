import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../Card/Card';
import classes from './LoginForm.module.css';
import Button from '../Button/Button';
import laptopgirl from '../../assets/pexels-jopwell-2422286.jpg';
import { SIGN_IN_URL } from '../../backend-urls/constants';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';

const LoginForm = ({ changeLoginState }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [backEndError, setBackendError] = useState(false);

  //Custom hook to make API calls
  const { post, loading, error, data, statusCode } = useAxios();

  const navigate = useNavigate();
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //using context to store jwt token
  const authContext = useContext(AuthContext);

  // Preparing payload for Api request
  const payload = {
    username,
    password,
  };

  // Making the API request. Keeping track of the number of API calls
  const handleLogin = async (event) => {
    event.preventDefault();
    post(SIGN_IN_URL, payload, { 'Content-Type': 'application/json' });
  };

  useEffect(() => {
    incrementApiCalls();
    authContext.login(data.token);
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
    console.log(user.id);
    //storing userid in local storage - to be utilized later in the application
    localStorage.setItem('userId', user.id);
    console.log(user.token);
    incrementApiCalls();
    changeLoginState();
    console.log('API calls: ', apiCalls);
    if (statusCode === 200) {
      // Login successful, navigate to profile page
      navigate('/profile');
    } else if (error && error.response && error.response.status === 403) {
      // Wrong username or password
      setBackendError(true);
      console.log('Wrong username or password');
    }
    console.log('API calls: ', apiCalls);
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
