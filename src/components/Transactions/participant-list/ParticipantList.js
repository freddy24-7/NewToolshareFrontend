import React, { useEffect } from 'react';
import classes from './ParticipantList.module.css';
import useAxios from '../../../hooks/useAxios';
import useApiCalls from '../../../hooks/useApiCalls';
import { PARTICIPANT_URL } from '../../../backend-urls/constants';
import Card from '../../Card/Card';

const ParticipantList = () => {
  //Custom hook to make API calls
  const { get, loading, error, data } = useAxios();

  //Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Making the API call
  useEffect(() => {
    get(`${PARTICIPANT_URL}`);
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul>
      {/*checking that we have "participants", then using the map-method to output the participants*/}
      {data &&
        data.map((data) => (
          <Card className={classes.base} key={data.id}>
            <div className={classes.preview}>
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
          </Card>
        ))}
    </ul>
  );
};

export default ParticipantList;
