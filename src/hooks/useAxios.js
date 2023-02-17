//This is a custom hook that we can use to make API calls
import { useState } from 'react';
import axios from 'axios';

const useAxios = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

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
      console.log(response);
      setStatusCode(response.status);
      setError(null);
    } catch (error) {
      console.log(error);
      setData([]);
      if (error.response && error.response.status === 409) {
        setError('Username already exists, please choose another.');
      } else if (error.response && error.response.status === 403) {
        setError('Bad server response, please try again later.');
      } else {
        setError(error.message);
      }
    }
    console.log(data);
    setLoading(false);
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
    loading,
    error,
    statusCode,
    token,
    get,
    post,
    put,
    del,
  };
};

export default useAxios;
