import React, { useEffect, useState } from 'react';
import classes from './Borrow.module.css';
import useAxios from '../../../hooks/useAxios';
import useApiCalls from '../../../hooks/useApiCalls';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import { useNavigate } from 'react-router-dom';
import AllItems from '../../../helpers/AllItems';

const Borrow = () => {
  //Getting the id from local storage
  let id = JSON.parse(localStorage.getItem('id'));
  console.log(id);

  //Keeping track of the number of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Setting the state variables
  const [allItems, setAllItems] = useState([]);

  //Custom hook to make API calls
  const { data, loading, error } = useAxios();

  // React router hook to navigate to other pages
  const navigate = useNavigate();

  //Calling the allItems helper component to get the data, loading, and error values
  const {
    data: allItemsData,
    loading: allItemsLoading,
    error: allItemsError,
  } = AllItems();

  //Setting the state variable to the data
  useEffect(() => {
    if (allItemsData) {
      setAllItems(allItemsData);
    }
    incrementApiCalls();
  }, [allItemsData, allItemsError]);
  console.log('API calls: ', apiCalls);
  console.log(allItems);

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
