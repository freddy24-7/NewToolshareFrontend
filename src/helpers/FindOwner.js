import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { PARTICIPANT_URL } from '../backend-urls/constants';
import useApiCalls from '../hooks/useApiCalls';

const FindOwner = ({ itemIdValue }) => {
  //Setting the state variables
  const [owner, setOwner] = useState([]);
  const [apiCalls, incrementApiCalls] = useApiCalls();
  const [index, setIndex] = useState(null);

  //Custom hook to make API calls
  const { get, token, responseData } = useAxios();

  //Making the API call to get all the participants, in order to later find the owner of the particular item
  //The useEffect is run only when the token is loaded or when the itemIdValue changes
  useEffect(() => {
    get(PARTICIPANT_URL, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    incrementApiCalls();
  }, [token, itemIdValue]);

  //Finding the owner of the item with use of optional chaining, and running the useEffect only when the data is loaded
  //Also getting the index from the API data, which is used for rendering the data
  useEffect(() => {
    if (responseData && itemIdValue) {
      const foundOwner = responseData.find(({ items }) =>
        items?.find(({ itemId }, index) => {
          if (itemId == itemIdValue) {
            setIndex(index);
            return true;
          }
          return false;
        }),
      );
      setOwner(foundOwner ?? null);
    }
    incrementApiCalls();
  }, [responseData, itemIdValue]);

  return { owner, index, apiCalls };
};

export default FindOwner;
