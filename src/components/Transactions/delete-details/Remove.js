//This component is used to remove a participant from the database
import React, { useEffect } from 'react';
import { PARTICIPANT_URL } from '../../../backend-urls/constants';
import { useParams } from 'react-router-dom';
import classes from './Remove.module.css';
import goodbye from '../../../assets/pexels-polina-kovaleva-6265892.jpg';
import Card from '../../Card/Card';
import useAxios from '../../../hooks/useAxios';

const Remove = ({ handleLogout }) => {
  //Getting the id from url
  const { id } = useParams();
  console.log(id);

  //Custom hook to make API calls
  const { del, statusCode, token } = useAxios();
  console.log(token);

  //Delete participant from database
  useEffect(() => {
    del(`${PARTICIPANT_URL}/${id}`, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    //Setting the token to null, so that the user is logged out
    //passing false to the handleLogout function, so that the user is not redirected to the login page
    handleLogout(false);
  }, [id]);
  console.log(statusCode);

  return (
    <Card>
      <div>
        <p className={classes.base}>U bent verwijderd van het systeem.</p>
      </div>
      <div className={classes.photo}>
        <img src={goodbye} alt="goodbye" height={600} width={580} />
      </div>
    </Card>
  );
};

export default Remove;
