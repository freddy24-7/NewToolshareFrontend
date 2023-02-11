import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import RegistrationForm from './components/Register/RegistrationForm';
import LoginForm from './components/Login/LoginForm';
import AuthContext from './context/AuthContext';
import Profile from './components/Profile/Profile';
import MainNavigation from './components/Layout/MainNavigation';
import { useState } from 'react';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistration = () => {
    setIsRegistered(true);
  };

  return (
    <AuthContext>
      <MainNavigation isRegistered={isRegistered} />
      <Routes>
        <Route>
          <Route exact path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={
              <RegistrationForm handleRegistration={handleRegistration} />
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthContext>
  );
}

export default App;
