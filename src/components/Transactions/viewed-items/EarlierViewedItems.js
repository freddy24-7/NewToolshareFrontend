import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './EarlierViewedItems.module.css';
import Card from '../../Card/Card';
import useApiCalls from '../../../hooks/useApiCalls';
import AllItems from '../../../helpers/AllItems';
import useAxios from '../../../hooks/useAxios';
import { GET_HISTORY_OF_VIEWED_ITEMS } from '../../../backend-urls/constants';

const EarlierViewedItems = () => {
  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  //Setting the state variables
  const [allItems, setAllItems] = useState([]);
  const [myViewedItems, setMyViewedItems] = useState([]);
  const [allViewedItems, setAllViewedItems] = useState([]);

  //Keeping track of the number of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Calling the allItems helper component to get the data, loading, and error values
  const {
    data: allItemsData,
    loading: allItemsLoading,
    error: allItemsError,
  } = AllItems();

  //Setting the state variable to the data (all items)
  useEffect(() => {
    if (allItemsData) {
      setAllItems(allItemsData);
    }
    incrementApiCalls();
  }, [allItemsData, allItemsError]);
  console.log('API calls: ', apiCalls);
  console.log(allItems);

  //Custom hook to make API calls
  const { data, get, token, error } = useAxios();
  console.log(token);
  console.log(id);
  console.log(error);

  //Making the API call to get the items that the participant has viewed
  useEffect(() => {
    console.log(id);
    //Making the API call
    get(`${GET_HISTORY_OF_VIEWED_ITEMS}/${id}`, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    console.log(data);
  }, []);
  console.log(data);

  //Setting the state variable to the data (items that the participant has viewed)
  useEffect(() => {
    if (data) {
      setMyViewedItems(data?.loanActions);
    }
    console.log(data.loanActions);
  }, [data?.loanActions]);
  console.log(myViewedItems);

  //Merging the two object arrays, creating a new array with all the data that should be displayed
  useEffect(() => {
    //Using the timeout method to create a microscopic delay to avoid getting null values
    setTimeout(function () {
      //merging to the two object arrays by mapping through them, using the itemId as key
      const mergedArray = myViewedItems.map((m) => ({
        ...m,
        ...allItems.find((a) => a.itemId === m.itemId),
      }));
      setAllViewedItems(mergedArray);
      console.log(allViewedItems);
    }, 0);
  }, [myViewedItems]);
  console.log(allViewedItems);

  //Modifying the dateformat that is received through the API (which was created by LocalDateTime in Java/SpringBoot)
  const now = new Date();
  let inbuiltDateFormat = now.toLocaleDateString();
  console.log(inbuiltDateFormat);

  return (
    <section>
      <div className={classes.control}>
        <h2 className={classes.success}>Spullen al eerder bekeken:</h2>
      </div>
      <ul>
        {/*checking that we have "items", then using the map-method to output the items*/}
        {allViewedItems &&
          allViewedItems.map((item) => (
            <Card className={classes.base} key={item.itemId}>
              <div className={classes.preview}>
                <h3>Name: {item.itemName} </h3>
                <h4>Description: {item.description}</h4>
                <div className={classes.photo}>
                  <img
                    src={item.photoURL}
                    alt="share-item"
                    height={150}
                    width={145}
                  />
                </div>
                <h4>Date: {item.inbuiltDateFormat}</h4>
                {inbuiltDateFormat}
              </div>
            </Card>
          ))}
      </ul>
    </section>
  );
};

export default EarlierViewedItems;
