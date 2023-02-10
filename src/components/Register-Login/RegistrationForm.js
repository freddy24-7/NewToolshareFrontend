import React, { useState } from 'react';
import axios from 'axios';
import {SIGN_UP_URL} from "../../backend-urls/constants";
import classes from "./RegistrationForm.module.css";

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate inputs
        if (username.trim().length === 0) {
            setErrorMessage('Username is required');
            return;
        }
        if (password.trim().length === 0) {
            setErrorMessage('Password is required');
            return;
        }
        if (password.length < 8 || password.length > 16) {
            setErrorMessage('Password must be between 8 and 16 characters');
            return;
        }
        if (password !== repeatPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }


        // Clear error message
        setErrorMessage('');

        // Prepare payload
        const payload = {
            username,
            password
        };

        // Make API request
        axios.post(SIGN_UP_URL, payload)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
                //Checking error response stats
                console.log(error.response.status);
                //storing it in a variable
                const errorCheck = (error.response.status)
                //setting the error
                if (errorCheck === 409) {
                    setError("Gebruikersnaam In gebruik, kies een andere gebruikersnaam")
                }
                setIsLoading(false);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={event => setUsername(event.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} />
            </div>
            <div>
                <label htmlFor="repeatPassword">Repeat Password:</label>
                <input type="password" id="repeatPassword" value={repeatPassword} onChange={event => setRepeatPassword(event.target.value)} />
            </div>
            {errorMessage.length > 0 && (
                <div>
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                </div>
            )}
            <button type="submit">Submit</button>
            {isLoading && <p>Your inputs are ok!</p>}
            {error && <div className={classes.error}> {error} </div>}
        </form>
    );
};

export default Registration;




