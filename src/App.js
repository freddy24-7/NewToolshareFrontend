import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import RegistrationForm from './components/Register/RegistrationForm';
import LoginForm from './components/Login/LoginForm';
import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile/Profile';
import MainNavigation from './components/Layout/MainNavigation';
import { useState } from 'react';
import Commencement from './components/Transactions/Commencement';

function App() {
  //These variables are used for conditonal button display in the MainNavigation component
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  //This variable manages the navigation
  const navigate = useNavigate();

  //These functions are used to change the state of the navigation variables above
  const handleRegistration = () => {
    setIsRegistered(true);
  };
  const changeLoginState = () => {
    setIsLoggedIn(true);
  };
  const handleUpdate = () => {
    setIsUpdated(true);
  };

  //This function handles the logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsRegistered(false);
    setIsUpdated(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  //These console.logs are used to check the state of the variables above
  console.log(isRegistered, isLoggedIn, isUpdated);

  return (
    <AuthProvider>
      <MainNavigation
        isRegistered={isRegistered}
        isLoggedIn={isLoggedIn}
        isUpdated={isUpdated}
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
          <Route
            path="/profile"
            element={<Profile handleUpdate={handleUpdate} />}
          />
          <Route path="/start" element={<Commencement />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
