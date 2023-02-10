import {Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Layout from "./components/Layout/Layout";
import RegistrationForm from "./components/Register-Login/RegistrationForm";

function App() {

    return (

        <Layout>
            <Routes>
                <Route>
                    <Route exact path="/" element={<HomePage />}/>
                    <Route path="/login-register" element={<RegistrationForm />}/>
                </Route>
            </Routes>
        </Layout>

    );

}

export default App;
