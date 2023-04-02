import React, { useEffect, useState } from 'react';
import classes from './Borrow.module.css';
import { GET_ALL_SHARE_ITEM_URL } from '../../../backend-urls/constants';
import useAxios from '../../../hooks/useAxios';
import useApiCalls from '../../../hooks/useApiCalls';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import { useNavigate, useParams } from 'react-router-dom';

const Borrow = () => {
  //Setting the state variables
  const [allItems, setAllItems] = useState([]);
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Custom hook to make API calls
  const { data, loading, error, get, token } = useAxios();

  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  // React router hook to navigate to other pages
  const navigate = useNavigate();

  //Making the API call to get all the items
  useEffect(() => {
    get(GET_ALL_SHARE_ITEM_URL, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    incrementApiCalls();
  }, []);
  console.log('API calls: ', apiCalls);

  //Setting the state variable to the data
  useEffect(() => {
    if (data) {
      setAllItems(data);
    }
  }, [data, error]);

  //Checking if the data is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  //Checking if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  //Allowing the participant to navigate to the chosen item
  const goToOwnerPage = (itemId) => {
    navigate(`/owner/${id}?itemId=${itemId}`);
  };

  return (
    <section>
      <div className={classes.control}>
        <h2 className={classes.success}>Dit zijn alle beschikbare spullen:</h2>
      </div>
      {allItems.length > 0 ? (
        <ul>
          {allItems.map((data) => (
            <Card className={classes.base} key={data.itemId}>
              <li className={classes.actions}>
                <h3>Name: {data.itemName} </h3>
                <h4>Description: {data.description}</h4>
                <div className={classes.photo}>
                  <img
                    src={data.photoURL}
                    alt={data.itemName}
                    height={150}
                    width={145}
                  />
                </div>
                <Button onClick={() => goToOwnerPage(data.itemId)}>
                  Borrow?
                </Button>
              </li>
            </Card>
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

export default Borrow;
