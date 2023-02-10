import {GET_SHARE_ITEM_URL} from '../backend-urls/constants'
import axios from 'axios';

//Obtaining token from local storage to access resource
//Key is specified in LoginForm.js and needs to be consistent
const initialToken = localStorage.getItem('jwt');
console.log(initialToken)

//specifying back-end URL
    const getApiURL = GET_SHARE_ITEM_URL;

//Creating a variable that grants access, taking the initial token as parameter
//At this stage, back-end was also updated to allow for the "Authorization-header" (in addition to "Content-Type")
const authAxios = axios.create(
    {
        baseURL: getApiURL,
        headers: {
            Authorization: `Bearer ${initialToken}`
        }
    }
)

//Using the authAxios variable here, taking the URL and the relevant class as parameters
    class ShareItemService {
        getAllItems() {
            return authAxios.get(getApiURL);
        }
    }

export default new ShareItemService();