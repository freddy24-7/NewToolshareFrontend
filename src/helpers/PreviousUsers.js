//This is a helper function that is used to fetch the previous user ids and participant ids from the database.
//This is used to check if a user is already registered in the database, and if so, to prevent the user from registering again.
import { useState, useEffect } from 'react';
import { PARTICIPANT_URL } from '../backend-urls/constants';

//
const PrevUserIds = () => {
  //State to store the previous user ids and participant ids
  const [prevUserIds, setPrevUserIds] = useState([]);
  const [prevParticipantIds, setPrevParticipantIds] = useState([]);
  const [apiCalls, setApiCalls] = useState(0);
  const [data, setData] = useState(null);

  //Fetching the previous user ids and participant ids from the database
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${PARTICIPANT_URL}`);
      const responseData = await response.json();
      console.log(responseData);
      setData(responseData);
      setApiCalls((apiCalls) => apiCalls + 1);
      console.log('API calls: ', apiCalls);
    };
    fetchData();
  }, []);

  //Here we are storing the previous user ids and participant ids in state so that we can compare them
  // with the current user id and participant id
  useEffect(() => {
    if (data) {
      const oldUserIds = data.map((item) => (item.user ? item.user.id : null));
      const oldParticipantIds = data.map((item) => (item ? item.id : null));
      setPrevUserIds(oldUserIds);
      setPrevParticipantIds(oldParticipantIds);
    }
  }, [data]);

  return {
    prevUserIds,
    prevParticipantIds,
  };
};

export default PrevUserIds;
