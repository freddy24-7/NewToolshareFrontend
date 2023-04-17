import React, { useEffect } from 'react';
import classes from './Owner.module.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import FindOwner from './../../../helpers/FindOwner';
import { EXPRESS_INTEREST_GET_OWNER_DETAILS_URL } from '../../../backend-urls/constants';
import useAxios from '../../../hooks/useAxios';

const Owner = () => {
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
  const { post, token } = useAxios();
  console.log(token);

  //Calling the FindOwner component to get the owner, index, and apiCalls variables
  const { owner, index, apiCalls } = FindOwner({ itemIdValue });
  console.log(owner);
  console.log(itemIdValue);

  //This code block registers the interest of the participant, with a separate id for every
  //item the participant has shown interest in
  const payload = {
    itemId: itemIdValue,
  };
  useEffect(() => {
    //Defining the URL for the API call
    const url = `${EXPRESS_INTEREST_GET_OWNER_DETAILS_URL}/${id}`;
    //Making the API call
    post(url, payload, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }, []);

  //Allowing the participant to navigate to owner details page
  const goToOwnerDetails = (itemId) => {
    navigate(`/owner-details/${id}?itemId=${itemId}`);
  };
  console.log(itemIdValue);

  //Allowing the participant to navigate to earlier viewed items page
  const goToEarlierViewedItems = () => {
    navigate(`/earlier-viewed/${id}`);
  };

  console.log(owner ?? null);
  console.log('API calls: ', apiCalls);
  console.log(index);

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
              <Button onClick={() => goToOwnerDetails(itemIdValue)}>
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
