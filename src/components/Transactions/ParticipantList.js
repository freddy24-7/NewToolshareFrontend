import React, { useEffect } from 'react';
import classes from './PartcipantList.module.css';
import useAxios from '../../hooks/useAxios';
import useApiCalls from '../../hooks/useApiCalls';
import { PARTICIPANT_URL } from '../../backend-urls/constants';

const ParticipantList = () => {
  //Custom hook to make API calls
  const { get, loading, error, data, statusCode, token } = useAxios();

  //Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Making the API call
  useEffect(() => {
    get(`${PARTICIPANT_URL}`);
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  }, []);

  return (
    <ul>
      {/*checking that we have "participants", then using the map-method to output the participants*/}
      {data &&
        data.map((data) => (
          <div className={classes.preview} key={data.id}>
            <h3>
              Name: {data.firstName} {data.lastName}
            </h3>
            <h4>
              Email: {data.email} / Phone: {data.mobileNumber}{' '}
            </h4>
            <div className={classes.photo}>
              <img src={data.photoURL} height={150} width={145} />
            </div>
          </div>
        ))}
    </ul>
  );
};

export default ParticipantList;