import React, { useEffect, useState } from 'react';
import { PARTICIPANT_URL } from '../../../backend-urls/constants';
import classes from './Details.module.css';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../../hooks/useApiCalls';
import useAxios from '../../../hooks/useAxios';
import usePhotoUploader from '../../../hooks/usePhotoUploader';
import { useValidation } from '../../../hooks/useValidation';
import machineworker from '../../../assets/pexels-karolina-grabowska-6920104.jpg';

const Details = () => {
  //Getting the id from local storage
  const id = JSON.parse(localStorage.getItem('id'));

  //Custom hook to make API calls
  const { put, get, loading, error, data, statusCode, token, responseData } =
    useAxios();

  //Defining the variables for uploading new participant
  //Checking for response data to be able to prefill the form
  const [firstName, setFirstName] = useState(responseData?.firstName || '');
  const [lastName, setLastName] = useState(responseData?.lastName || '');
  const [postcode, setPostcode] = useState(responseData?.postcode || '');
  const [email, setEmail] = useState(responseData?.email || '');
  const [mobileNumber, setMobileNumber] = useState(
    responseData?.mobileNumber || '',
  );
  const [photoURL, setPhotoURL] = useState(responseData?.photoURL || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [participantFetched, setParticipantFetched] = useState(false);

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
    put,
  );

  //Function to handle the submission of the form
  const handleSubmit = (event) => {
    event.preventDefault();

    //Checking for validation errors
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
    console.log(id);

    //Making the API call for updating participant
    put(`${PARTICIPANT_URL}/${id}`, payload, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  };

  //useEffect to navigate to the next page after successful API call
  useEffect(() => {
    if (apiCalls > 0 && statusCode === 200) {
      navigate(`/start/${data.id}`);
    }
  }, [data]);

  // useEffect to check if the photoUrl is updated
  useEffect(() => {
    if (photoUrl) {
      setPhotoURL(photoUrl);
      setUploadSuccess(true);
    }
  }, [photoUrl]);

  //Get the current participant details
  useEffect(() => {
    if (id && !participantFetched) {
      setParticipantFetched(true);
      get(`${PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
  }, [participantFetched]);

  // useEffect to prefill the form with the current participant details
  useEffect(() => {
    if (data) {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setPostcode(data.postcode);
      setEmail(data.email);
      setPhotoURL(data.photoURL);
      setMobileNumber(data.mobileNumber);
    }
  }, [data]);

  //Function to handle the deletion of the participant
  const handleDelete = () => {
    navigate(`/remove/${id}`);
  };

  //Dynamic use of CSS, other styles appear if input is invalid
  const inputClasses = inputError || error ? classes.authinvalid : classes.auth;

  return (
    <>
      <Card className={inputClasses}>
        <article>
          <h2 className={classes.h2}>Gegevens wijzigen?</h2>
          <h3 className={classes.h3}>
            Selecteer de gegevens die je wilt wijzigen, druk op verzenden.
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
                  Sleep je foto hierheen of klik op 'Choose file' om een bestand
                  te selecteren
                </p>
                <p>Let op: HEIC-bestanden worden niet ondersteund!</p>
              </div>
              <input
                type="file"
                onChange={(event) => onDrop(event.target.files)}
              />
              {photoUrl && (
                <p className={classes.success}>Foto succesvol geüpload!</p>
              )}
            </>
          )}
        </div>
        <form className={classes.control} onSubmit={handleSubmit}>
          <label>
            Voornaam:
            <input
              type="text"
              placeholder={responseData?.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label>
            Achternaam:
            <input
              type="text"
              placeholder={responseData?.lastName}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              placeholder={responseData?.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Mobiel nummer
            <input
              type="text"
              placeholder={responseData?.mobileNumber}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </label>
          <label>
            Post Code:
            <input
              type="text"
              placeholder={responseData?.postcode}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </label>
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}
          {error && <p>{error}</p>}
          <Button type="submit">{loading ? 'Loading...' : 'Submit'}</Button>
        </form>
      </Card>
      <Card className={inputClasses}>
        <article>
          <h2 className={classes.h2}>Gegevens deleten?</h2>
          <h3 className={classes.h3}>
            Als je het zeker weet, druk op "Delete". Jouw gegevens worden
            verwijdert van het systeem.
          </h3>
          <Button type="submit" onClick={(event) => handleDelete(event)}>
            {' '}
            Delete
          </Button>
        </article>
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

export default Details;
