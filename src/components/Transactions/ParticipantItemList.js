import React, { useEffect, useState } from 'react';
import classes from './ParticipantItemList.module.css';
import { useParams } from 'react-router-dom';
import { GET_SHARE_ITEM_BY_PARTICIPANT_URL } from '../../backend-urls/constants';
import useAxios from '../../hooks/useAxios';
import useApiCalls from '../../hooks/useApiCalls';

const ParticipantItemList = () => {
  //Defining list-item variable
  const [myItems, setMyItems] = useState(null);

  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  //Custom hook to make API calls
  const { data, loading, error, get, token } = useAxios();

  //Here we are making the API call to get the participant
  useEffect(() => {
    if (id) {
      get(`${GET_SHARE_ITEM_BY_PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
    // Storing the id in local storage
  }, [id]);

  useEffect(() => {
    if (data) {
      setMyItems(data.items);
    }
  }, [data]);

  //Here we are checking if the data is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  //Here we are checking if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <section className={classes.base}>
        <div className={classes.control}>
          <p className={classes.success}>
            Dit zijn de door u ter beschikking gestelde spullen
          </p>
        </div>
      </section>
      <ul>
        {/*checking that we have "items", then using the map-method to output the items*/}
        {myItems &&
          myItems.map((item) => (
            <div className={classes.actions} key={item.itemId}>
              <h3>Name: {item.itemName} </h3>
              <h4>Description: {item.description}</h4>
              <div className={classes.photo}>
                <img src={item.photoURL} height={150} width={145} />
              </div>
            </div>
          ))}
      </ul>
    </section>
  );
};

export default ParticipantItemList;
