import React, { useEffect, useState } from 'react';
import { PARTICIPANT_URL } from '../../backend-urls/constants';
import classes from './Profile.module.css';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';
import machineworker from '../../assets/pexels-karolina-grabowska-6920104.jpg';

const Profile = ({ handleUpdate }) => {
  //Defining the variables for uploading new participant
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);

  //Custom hook to make API calls
  const { post, loading, error, data, statusCode, token } = useAxios();

  const navigate = useNavigate();
  const [apiCalls, incrementApiCalls] = useApiCalls();

  // const token = localStorage.getItem('token');
  // console.log(token);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Input validation in frontend
    if (firstName.trim().length === 0 || firstName.trim().length > 30) {
      setErrorMessage('Firstname should be between 1 and 30 characters');
      setInputError(true);
      return;
    }
    if (lastName.trim().length === 0 || lastName.trim().length > 30) {
      setErrorMessage('Lastname should be between 1 and 30 characters');
      setInputError(true);
      return;
    }
    //postcode should start with "3543" followed by two capital letters
    let regex = /^3543[A-Z]{2}$/;
    if (!postcode.trim().match(regex)) {
      setErrorMessage(
        'Postcode should start with "3543" followed by two capital letters',
      );
      setInputError(true);
      return;
    }
    regex = /@/;
    if (!regex.test(email)) {
      setErrorMessage('Please provide a valid email address');
      setInputError(true);
      return;
    }
    regex = /^06\d{8}$/;
    if (!regex.test(mobileNumber)) {
      setErrorMessage(
        'Invalid mobile number: must contain 10 digits and start with "06"',
      );
      setInputError(true);
      return;
    }

    // Clearing the error message after successful validation
    setErrorMessage('');
    setInputError(false);

    const payload = {
      firstName,
      lastName,
      email,
      mobileNumber,
      postcode,
      photoURL,
    };
    post(PARTICIPANT_URL, payload, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  };

  useEffect(() => {
    console.log(statusCode);
    if (statusCode === 200) {
      // Success, navigate to transactions start page
      handleUpdate();
      navigate('/start');
    } else if (error && error.response && error.response.status === 403) {
      console.log('Authentication failed');
    }
    console.log('API calls: ', apiCalls);
  }, [data, error]);

  //Dynamic use of CSS, other styles appear if input is invalid
  const inputClasses = inputError || error ? classes.authinvalid : classes.auth;

  return (
    <>
      <Card className={inputClasses}>
        <article>
          <h2 className={classes.h2}>Welkom!</h2>
          <h3 className={classes.h3}>
            Voeg wat meer details toe om te beginnen!
          </h3>
        </article>
        <form className={classes.control} onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              placeholder="Jouw voornaam"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              placeholder="Jouw achternaam"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              placeholder="Jouw email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Mobile Number:
            <input
              type="text"
              placeholder="Jouw mobiele nummer"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </label>
          <label>
            Post Code:
            <input
              type="text"
              placeholder="Jouw postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </label>
          <label>
            Photo URL:
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </label>
          {errorMessage.length > 0 && (
            <div>
              <p className={classes.error}>{errorMessage}</p>
            </div>
          )}
          {error && <div className="error">{error}</div>}
          <Button type="submit">
            {loading ? 'Loading...' : 'Update your details'}
          </Button>
        </form>
      </Card>
      <section>
        <div className={classes.photo}>
          <img
            src={machineworker}
            alt="machineworker"
            height={300}
            width={300}
          />
        </div>
      </section>
    </>
  );
};

export default Profile;
