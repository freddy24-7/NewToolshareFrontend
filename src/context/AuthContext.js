import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  token: null,
  userId: null,
  login: (token, userId) => {},
  logout: () => {},
});

const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

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

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('userData');
  };

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
