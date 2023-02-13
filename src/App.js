import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import RegistrationForm from './components/Register/RegistrationForm';
import LoginForm from './components/Login/LoginForm';
import AuthContext from './context/AuthContext';
import Profile from './components/Profile/Profile';
import MainNavigation from './components/Layout/MainNavigation';
import { useState } from 'react';

function App() {
  //These variable manages the security set up for the whole application (JWT)
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //This variable manages the navigation
  const navigate = useNavigate();

  const handleRegistration = () => {
    setIsRegistered(true);
  };
  const changeLoginState = () => {
    setIsLoggedIn(true);
  };

  //This function handles the logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsRegistered(false);
    navigate('/');
  };

  return (
    <AuthContext>
      <MainNavigation
        isRegistered={isRegistered}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route>
          <Route exact path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={
              <RegistrationForm handleRegistration={handleRegistration} />
            }
          />
          <Route
            path="/login"
            element={<LoginForm changeLoginState={changeLoginState} />}
          />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthContext>
  );
}

export default App;
