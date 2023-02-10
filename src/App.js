import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import RegistrationForm from './components/Register-Login/RegistrationForm';
import LoginForm from './components/Register-Login/LoginForm';

function App() {
  return (
    <Layout>
      <Routes>
        <Route>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
