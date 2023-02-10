import {SIGN_IN_URL} from '../backend-urls/constants'
import axios from 'axios';

class AuthenticationService {

    login(user) {
        return axios.post(SIGN_IN_URL, user);
    }
}

export default new AuthenticationService();