import React, { useState } from 'react';
import axios from 'axios';
import {SIGN_UP_URL} from "../../backend-urls/constants";

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        </form>
    );
};

export default Registration;




