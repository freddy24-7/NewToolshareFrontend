import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import RegistrationForm from './components/Register/RegistrationForm';
import LoginForm from './components/Login/LoginForm';
import { AuthProvider } from './context/AuthContext';
import Profile from './components/Profile/Profile';
import MainNavigation from './components/Layout/MainNavigation';
import { useState } from 'react';
import Commencement from './components/Transactions/commencement/Commencement';
import ParticipantList from './components/Transactions/participant-list/ParticipantList';
import LendOutItem from './components/Transactions/lend-out/LendOutItem';
import ParticipantItemList from './components/Transactions/participant-item-list/ParticipantItemList';
import Borrow from './components/Transactions/borrow/Borrow';
import Owner from './components/Transactions/owner/Owner';
import OwnerDetails from './components/Transactions/owner-details/OwnerDetails';
import EarlierViewedItems from './components/Transactions/viewed-items/EarlierViewedItems';
import Details from './components/Transactions/my-details/Details';
import Remove from './components/Transactions/delete-details/Remove';

function App() {
  //These variables are used for conditional button display in the MainNavigation component
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDetailsUpdate, setIsDetailsUpdate] = useState(false);

  //This variable manages the navigation
  const navigate = useNavigate();

  //These three functions are used to change the state of the navigation variables above
  const handleRegistration = () => {
    setIsRegistered(true);
  };
  const changeLoginState = () => {
    setIsLoggedIn(true);
  };
  const handleUpdate = () => {
    setIsUpdated(true);
  };

  const newDetailsUpdate = () => {
    setIsDetailsUpdate(true);
  };

  //This function handles the logout
  const handleLogout = (shouldNavigate = true) => {
    setIsLoggedIn(false);
    setIsRegistered(false);
    setIsUpdated(false);
    setIsDetailsUpdate(false);
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isUpdated');
    if (shouldNavigate) {
      navigate('/');
    }
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
        newDetailsUpdate={newDetailsUpdate}
        isDetailsUpdate={isDetailsUpdate}
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
            element={
              <LoginForm
                changeLoginState={changeLoginState}
                //below is used to assist navigation for repeat users
                handleRegistration={handleRegistration}
                handleUpdate={handleUpdate}
              />
            }
          />
          <Route
            path="/profile"
            element={<Profile handleUpdate={handleUpdate} />}
          />
          <Route path="/start/:id" element={<Commencement />} />
          <Route path="/participants" element={<ParticipantList />} />
          <Route path="/items" element={<LendOutItem />} />
          <Route path="/my-items/:id" element={<ParticipantItemList />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/owner/:id" element={<Owner />} />
          <Route path="/owner-details/:id" element={<OwnerDetails />} />
          <Route
            path="/remove/:id"
            element={<Remove handleLogout={handleLogout} />}
          />
          <Route path="/earlier-viewed/:id" element={<EarlierViewedItems />} />
          <Route path="/my-details" element={<Details />} />
          {/* Redirect to the homepage for any other URLs */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
