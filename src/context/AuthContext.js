// This file defines the context for the application. It is used to create JWT-tokens for authentication
import React, { createContext, useState } from 'react';

//Defining Security context - to produce JWT tokens on login for authentication
export const AuthContext = createContext({
  token: null,
  userId: null,
  login: (token, userId) => {},
  logout: () => {},
});

//Defining set up for login and logout with token. In login-component, this is used to create JWT-token which
//is then used for authentication for the application
const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  //user must have a token to be logged in
  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: userId,
        token: token,
      }),
    );
  };

  //deleting token from local storage on logout
  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('userData');
  };

  //Defining context
  return (
    <AuthContext.Provider
      value={{
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
