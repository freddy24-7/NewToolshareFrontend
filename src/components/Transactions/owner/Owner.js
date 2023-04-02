import React, { useEffect, useState } from 'react';
import classes from './Owner.module.css';
import useAxios from '../../../hooks/useAxios';
import { PARTICIPANT_URL } from '../../../backend-urls/constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useApiCalls from '../../../hooks/useApiCalls';
import Card from '../../Card/Card';
import Button from '../../Button/Button';

const Owner = () => {
  //Setting the state variables
  const [owner, setOwner] = useState([]);
  const [apiCalls, incrementApiCalls] = useApiCalls();
  const [index, setIndex] = useState(null);

  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  //for navigating to other pages
  const navigate = useNavigate();

  //Getting the itemId from the URL
  const location = useLocation();
  //The URLSearchParams object lets us access the query string parameters
  const itemIdValue = new URLSearchParams(location.search).get('itemId');
  console.log(itemIdValue);

  //Custom hook to make API calls
  const { get, token, responseData } = useAxios();

  //Making the API call to get all the participants, in order to later find the owner of the particular item
  //The useEffect is run only when the token is loaded or when the itemIdValue changes
  useEffect(() => {
    get(PARTICIPANT_URL, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    incrementApiCalls();
  }, [token, itemIdValue]);
  console.log(responseData);

  //Finding the owner of the item with use of optional chaining, and running the useEffect only when the data is loaded
  //Also getting the index from the API data, which is used for rendering the data
  useEffect(() => {
    if (responseData && itemIdValue) {
      const foundOwner = responseData.find(({ items }) =>
        items?.find(({ itemId }, index) => {
          if (itemId == itemIdValue) {
            setIndex(index);
            return true;
          }
          return false;
        }),
      );
      setOwner(foundOwner ?? null);
    }
    incrementApiCalls();
  }, [responseData, itemIdValue]);
  console.log(owner ?? null);
  console.log('API calls: ', apiCalls);
  console.log(index);

  //Allowing the participant to navigate to owner details page
  const goToOwnerDetails = () => {
    navigate(`/owner-details/${id}`);
  };

  const goToEarlierViewedItems = () => {
    navigate(`/earlier-viewed/${id}`);
  };

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Card className={classes.base}>
          <section className={classes.control}>
            {owner.items && index !== null && (
              <p className={classes.success}>
                U heeft interesse getoond in een {''}
                {owner.items[index].itemName}
              </p>
            )}
          </section>
          <article>
            {owner.items && index !== null && owner.items[index].photoURL && (
              <img
                className={classes.photo}
                src={owner.items[index].photoURL}
                alt="share-item"
              />
            )}
          </article>
        </Card>
      </div>
      <div className={classes.right}>
        <Card className={classes.base}>
          <p className={classes.success}>Als je echt wil lenen ?</p>
          <div className={classes.click}>
            <div className={classes.actions}>
              <Button onClick={(event) => goToOwnerDetails(event)}>
                Klik hier om in contact te komen met de eigenaar
              </Button>
              <Button onClick={(event) => goToEarlierViewedItems(event)}>
                Alle items die u eerder hebt bekenen, worden hier weergegeven
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Owner;
