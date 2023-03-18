import React, { useEffect, useState } from 'react';
import classes from './ParticipantItemList.module.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GET_SHARE_ITEM_BY_PARTICIPANT_URL } from '../../backend-urls/constants';

const ParticipantItemList = () => {
  //Defining list-item variable
  const [myItems, setMyItems] = useState(null);

  const { id } = useParams();

  //axios get by id call backend and credentials, using axios
  const getAxios = axios.get(GET_SHARE_ITEM_BY_PARTICIPANT_URL + '/' + id, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  //Runs once, to give the existing data
  useEffect(() => {
    getAxios
      .then((response) => {
        console.log(response);
        console.log(response.data.items);
        //creating the variable that contains the items of the specific participant
        const myItems = response.data.items;
        //setting the state equal to the variable value
        setMyItems(myItems);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.data);
      });
  }, []);
  //Final check:
  console.log(myItems);

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
