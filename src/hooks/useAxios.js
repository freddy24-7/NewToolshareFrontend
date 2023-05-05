// This is a custom hook that we can use to make API calls
import { useState } from 'react';
import axios from 'axios';

const useAxios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [id, setId] = useState(null);
  const [responseData, setResponseData] = useState(null);

  //This function is used to make the API calls
  const fetchData = async (url, method, body = null, headers = {}) => {
    setLoading(true);

    try {
      const response = await axios({
        method: method,
        url: url,
        data: body,
        headers: headers,
      });
      setData(response.data);
      setResponseData(response.data);
      console.log(response);
      console.log(response.data);
      console.log(response.data.id);
      setId(response.data.id); // Set the id state variable
      setStatusCode(response.status);
      setError(null);
    } catch (error) {
      console.log(error);
      setData([]);
      if (error.response && error.response.status === 409) {
        setError(
          'U heeft gebruikersgegevens ingevoerd die al bestaan, ' +
            'wellicht een gebruikersnaam of e-mailadres? Wijzig uw invoer ' +
            'en probeer het opnieuw.',
        );
      } else if (error.response && error.response.status === 403) {
        setError(
          'Slechte serverrespons, niet geauthenticeerd. Als u dit bericht ' +
            'krijgt tijdens het inloggen, controleer dan uw gebruikersnaam en ' +
            'wachtwoord en druk op "Inloggen". Zo niet, log dan opnieuw in.',
        );
      } else if (error.response && error.response.status === 400) {
        setError(
          'Uw invoer is ongeldig. De postcode moet beginnen met 3543, ' +
            'gevolgd door twee hoofdletters. Het mobiele nummer moet beginnen ' +
            'met "06" en tien cijfers bevatten.',
        );
      } else if (error.response && error.response.status === 500) {
        setError(
          'Slechte serverrespons. Heeft u alle velden correct ingevuld? ' +
            'Als u een geldig e-mailadres heeft ingevoerd, is het e-mailadres ' +
            'mogelijk al in gebruik door een andere gebruiker. Dit is ook ' +
            'een initiatief van een gebied in Utrecht met postcode 3543. ' +
            'U kunt daarom alleen postcodes toevoegen die beginnen met 3543, ' +
            'gevolgd door twee hoofdletters. Een mobiel nummer heeft 10 cijfers ' +
            'nodig die beginnen met 06. Pas alstublieft de invoer aan en probeer het opnieuw.',
        );
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
    console.log(data);
  };

  //Here we list all the CRUD methods that we want to use
  const get = (url, headers = {}) => {
    fetchData(url, 'get', null, headers);
  };

  const post = (url, body, headers = {}) => {
    fetchData(url, 'post', body, headers);
  };

  const put = (url, body, headers = {}) => {
    fetchData(url, 'put', body, headers);
  };

  const del = (url, headers = {}) => {
    fetchData(url, 'delete', null, headers);
  };

  // Get token from local storage, for API calls where token is required
  const token = localStorage.getItem('token');

  // return data, loading, error, statusCode, get, post, put, del
  return {
    data,
    responseData,
    loading,
    error,
    statusCode,
    token,
    id,
    get,
    post,
    put,
    del,
  };
};

export default useAxios;
