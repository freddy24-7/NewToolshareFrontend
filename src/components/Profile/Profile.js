import React, { useEffect, useState } from 'react';
import { PARTICIPANT_URL } from '../../backend-urls/constants';
import classes from './Profile.module.css';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';
import usePhotoUploader from '../../hooks/usePhotoUploader';
import machineworker from '../../assets/pexels-karolina-grabowska-6920104.jpg';
import { useValidation } from '../../hooks/useValidation';
import useInput from '../../hooks/useInput';

const Profile = ({ handleUpdate }) => {
  //Defining the variables for uploading new participant
  const id = useInput('');
  const firstName = useInput('');
  const lastName = useInput('');
  const postcode = useInput('');
  const email = useInput('');
  const mobileNumber = useInput('');
  const photoURL = useInput('');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputError, setInputError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  //Custom hook to make API calls
  const { post, loading, error, data, statusCode, token } = useAxios();

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

  // Hook to validate form inputs
  const validationErrors = useValidation(
    {
      firstName: firstName.value,
      lastName: lastName.value,
      postcode: postcode.value,
      email: email.value,
      mobileNumber: mobileNumber.value,
    },
    'post',
  );

  //Function to handle the submission of the form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Input validation in frontend
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
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      mobileNumber: mobileNumber.value,
      postcode: postcode.value,
      photoURL: photoURL.value,
    };
    //Making the API call
    post(PARTICIPANT_URL, payload, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
    console.log(id);
  };

  // useEffect to check if the photoUrl is updated
  useEffect(() => {
    if (photoUrl) {
      photoURL.onChange({ target: { value: photoUrl } });
      setUploadSuccess(true);
    }
  }, [photoUrl]);

  // useEffect to check if the API call was successful
  useEffect(() => {
    console.log(statusCode);
    console.log(data.id);
    if (statusCode === 200) {
      // Success, navigate to transactions start page
      handleUpdate();
      localStorage.setItem('isUpdated', JSON.stringify(true));
      navigate(`/start/${data.id}`);
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
                  Sleep je foto hierheen of klik op 'Choose File' om een bestand
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
            First Name:
            <input type="text" placeholder="Jouw voornaam" {...firstName} />
          </label>
          <label>
            Last Name:
            <input type="text" placeholder="Jouw achternaam" {...lastName} />
          </label>
          <label>
            Email:
            <input type="text" placeholder="Jouw email" {...email} />
          </label>
          <label>
            Mobile Number:
            <input
              type="text"
              placeholder="Jouw mobiele nummer - tien cijvers"
              {...mobileNumber}
            />
          </label>
          <label>
            Post Code (3543__):
            <input type="text" placeholder="Jouw 3543-postcode" {...postcode} />
          </label>
          {errorMessage.length > 0 && (
            <div>
              <p className={classes.error}>{errorMessage}</p>
            </div>
          )}
          {error && <div className="error">{error}</div>}
          <Button type="submit">{loading ? 'Loading...' : 'Submit'}</Button>
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
