import React, { useCallback, useEffect, useState } from 'react';
import { PARTICIPANT_URL } from '../../backend-urls/constants';
import classes from './Profile.module.css';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';
import usePhotoUploader from '../../hooks/usePhotoUploader';
import { useValidation } from '../../hooks/useValidation';
import machineworker from '../../assets/pexels-karolina-grabowska-6920104.jpg';

const Profile = ({ handleUpdate, isDetailsUpdate }) => {
  console.log(isDetailsUpdate);

  let id = JSON.parse(localStorage.getItem('id'));
  console.log(id);

  //Custom hook to make API calls
  const {
    post,
    put,
    get,
    loading,
    error,
    data,
    statusCode,
    token,
    responseData,
  } = useAxios();

  //get the data of the current user
  // useEffect(() => {
  //   if (id) {
  //     get(`${PARTICIPANT_URL}/${id}`, {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     });
  //   }
  // }, [statusCode]);
  // console.log(responseData);

  //Defining the variables for uploading new participant
  const [firstName, setFirstName] = useState(responseData?.firstName ?? '');
  const [lastName, setLastName] = useState(responseData?.lastName ?? '');
  const [postcode, setPostcode] = useState(responseData?.postcode ?? '');
  const [email, setEmail] = useState(responseData?.email ?? '');
  const [mobileNumber, setMobileNumber] = useState(
    responseData?.mobileNumber ?? '',
  );
  const [photoURL, setPhotoURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [detailUpdate, setDetailUpdate] = useState(false);

  //Hook to navigate to other pages
  const navigate = useNavigate();

  //Custom hook to keep track of API calls
  const [apiCalls, incrementApiCalls] = useApiCalls();

  //Custom hook to upload photos
  const {
    file,
    fileError,
    fileIsLoading,
    photoUrl,
    getRootProps,
    getInputProps,
    dropzoneStyle,
    onDrop,
  } = usePhotoUploader();

  //Custom hook to validate form input
  const validationErrors = useValidation(
    {
      firstName,
      lastName,
      postcode,
      email,
      mobileNumber,
    },
    !isDetailsUpdate ? 'post' : 'put',
  );

  //Function to handle the submission of the form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors[0].message);
      setInputError(true);
      return;
    }

    // Clearing the error message after successful validation
    setErrorMessage('');
    setInputError(false);

    //Creating the payload for the API call
    const payload = {
      firstName,
      lastName,
      email,
      mobileNumber,
      postcode,
      photoURL,
    };
    console.log(payload);

    if (!isDetailsUpdate) {
      //Making the API call for new registration
      post(PARTICIPANT_URL, payload, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
      handleUpdate();
      localStorage.setItem('isUpdated', JSON.stringify(true));
    } else {
      let id = JSON.parse(localStorage.getItem('id'));
      console.log(id);
      //Making the API call for updating participant
      put(`${PARTICIPANT_URL}/${id}`, payload, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  };

  // useEffect to check if the photoUrl is updated
  useEffect(() => {
    if (photoUrl) {
      setPhotoURL(photoUrl);
      setUploadSuccess(true);
    }
  }, [photoUrl]);

  // useEffect to check if the API call was successful
  useEffect(() => {
    if (!isDetailsUpdate) {
      if (statusCode === 200) {
        // Success, navigate to transactions start page
        navigate(`/start/${data.id}`);
      } else if (error && error.response && error.response.status === 403) {
        console.log('Authentication failed');
      }
    }
    console.log('API calls: ', apiCalls);
  }, [data]);
  console.log(statusCode);
  console.log(data.id);

  //Navigation to the start page after details update
  useEffect(() => {
    if (isDetailsUpdate && statusCode === 200) {
      navigate(`/start/${id}`);
    }
  }, [id, statusCode]);
  console.log(isDetailsUpdate);
  console.log(statusCode);

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
        <div className={classes.h3}>
          {fileIsLoading ? (
            <p>Uploading photo...</p>
          ) : (
            <>
              {fileError && <p>{fileError.message}</p>}
              <div
                {...getRootProps({
                  style: dropzoneStyle,
                  className: classes.dropzone,
                  activeclassname: classes['dropzone-active'],
                })}
              >
                <input {...getInputProps()} />
                <p>
                  Drag and drop your photo here or click "Choose file" to select
                  a file
                </p>
              </div>
              <input
                type="file"
                onChange={(event) => onDrop(event.target.files)}
              />
              {photoUrl && (
                <p className={classes.success}>Photo uploaded successfully!</p>
              )}
            </>
          )}
        </div>
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
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}
          {error && <p>{error}</p>}
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
