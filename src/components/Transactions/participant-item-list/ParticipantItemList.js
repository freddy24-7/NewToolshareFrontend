import React, { useEffect, useState } from 'react';
import classes from './ParticipantItemList.module.css';
import { useParams } from 'react-router-dom';
import { GET_SHARE_ITEM_BY_PARTICIPANT_URL } from '../../../backend-urls/constants';
import useAxios from '../../../hooks/useAxios';
import useApiCalls from '../../../hooks/useApiCalls';
import Card from '../../Card/Card';

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
      <div className={classes.control}>
        <h2 className={classes.success}>
          Deze zijn de door u ter beschikking gestelde spullen:
        </h2>
      </div>
      {myItems && myItems.length > 0 ? (
        <ul>
          {/*checking that we have "items", then using the map-method to output the items*/}
          {myItems.map((item) => (
            <Card className={classes.base}>
              <div className={classes.preview} key={item.id}>
                <h3>Name: {item.itemName} </h3>
                <h4>Description: {item.description}</h4>
                <div className={classes.photo}>
                  <img
                    src={item.photoURL}
                    height={150}
                    width={145}
                    alt="item photo"
                  />
                </div>
              </div>
            </Card>
          ))}
        </ul>
      ) : (
        <Card className={classes.base}>
          <p>Je hebt tot nu toe geen spullen toegevoegd.</p>
        </Card>
      )}
    </section>
  );
};

export default ParticipantItemList;
