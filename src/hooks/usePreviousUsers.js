import { useState, useEffect } from 'react';
import { PARTICIPANT_URL } from '../backend-urls/constants';

const usePrevUserIds = () => {
  const [prevUserIds, setPrevUserIds] = useState([]);
  const [prevParticipantIds, setPrevParticipantIds] = useState([]);
  const [apiCalls, setApiCalls] = useState(0);
  const [data, setData] = useState(null);

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

export default usePrevUserIds;
