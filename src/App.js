import {Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Layout from "./components/Layout/Layout";

function App() {

    return (

        <Layout>
            <Routes>
                <Route>
                    <Route exact path="/" element={<HomePage />}/>
                </Route>
            </Routes>
        </Layout>

    );

}

export default App;
