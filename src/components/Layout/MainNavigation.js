import {Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import applicationLogo from "../../assets/1667993269612blob.jpg";


const MainNavigation = () => {
    return (

        <header className={classes.header}>

            <div >
                <img className={classes.logo} src={applicationLogo} alt="logo" height={83} width={85}
                />
            </div>
                    <nav >
                        <ul>
                            <li>
                                <Link to='/' >Home</Link>
                            </li>
                            <li>
                                <Link to='/login-register' >Login/Register</Link>
                            </li>
                        </ul>
                    </nav>
        </header>

    );
};

export default MainNavigation;