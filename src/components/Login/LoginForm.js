import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Card from '../Card/Card';
import classes from './LoginForm.module.css';
import Button from '../Button/Button';
import laptopgirl from '../../assets/pexels-jopwell-2422286.jpg';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/login', {
        username: username,
        password: password,
      });
      const token = response.data.token;
      const userId = response.data.userId;
      authContext.login(token, userId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className={classes.auth}>
        <form className={classes.control} onSubmit={handleLogin}>
          {error && <div className="error">{error}</div>}
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
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
