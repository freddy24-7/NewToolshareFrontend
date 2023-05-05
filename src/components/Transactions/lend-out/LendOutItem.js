import React, { useEffect, useState } from 'react';
import useApiCalls from '../../../hooks/useApiCalls';
import useAxios from '../../../hooks/useAxios';
import usePhotoUploader from '../../../hooks/usePhotoUploader';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import classes from './LendOutItem.module.css';
import working from '../../../assets/pexels-bidvine-1249611.jpg';
import { POST_SHARE_ITEM_URL } from '../../../backend-urls/constants';
import { GET_SHARE_ITEM_BY_PARTICIPANT_URL } from '../../../backend-urls/constants';

import { useNavigate } from 'react-router-dom';

const LendOutItem = () => {
  //Getting the id from the local storage
  const id = JSON.parse(localStorage.getItem('id'));

  //Defining variables
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedItems, setUploadedItems] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  //Custom hook to make API calls
  const { post, get, loading, error, data, statusCode, token } = useAxios();

  //for navigating to other pages
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

  //This function handles the submission of data
  const handleSubmit = (event) => {
    try {
      event.preventDefault();
      // Check if itemName and itemDescription fields are not empty
      if (!itemName || !description || !photoURL) {
        setErrorMessage(
          'Gelieve alle invoervelden in te vullen ' +
            'inclusief het toevoegen van een foto.',
        );
        return;
      }
      //Creating the payload for the API call
      const payload = {
        itemName,
        description,
        photoURL,
      };
      //Defining the URL for the API call
      const url = `${POST_SHARE_ITEM_URL}/${id}`;
      //Making the API call
      post(url, payload, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
      incrementApiCalls();
      console.log('API calls: ', apiCalls);
      console.log(id);
    } catch (error) {
      console.error(error);
    }
  };

  //useEffect to check if the photoUrl is updated
  useEffect(() => {
    if (photoUrl) {
      setPhotoURL(photoUrl);
      setUploadSuccess(true);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 6000);
    }
  }, [photoUrl]);

  //useEffect to check if the API call was successful and increment the number of items uploaded
  useEffect(() => {
    console.log(statusCode);
    if (statusCode === 200) {
      setItemName('');
      setDescription('');
      setPhotoURL('');
      setUploadSuccess(true);
      setUploadedItems((prevUploadedItems) => {
        if (prevUploadedItems !== null) {
          return prevUploadedItems + 1;
        } else {
          return null;
        }
      });
      // Clear input fields and feedback after two seconds
      setTimeout(() => {
        setItemName('');
        setDescription('');
        setPhotoURL('');
        setErrorMessage('');
        setUploadSuccess(false);
      }, 2000);
    }
  }, [data, error, statusCode]);

  //Here we are making an API call to get all the items from the participant
  useEffect(() => {
    if (id) {
      get(`${GET_SHARE_ITEM_BY_PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    console.log(uploadedItems);
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  }, [data?.items?.length]);

  //Here we are counting the number of items uploaded by the participant
  //The code block runs when the updatedItems array is updated
  useEffect(() => {
    if (data?.items?.length) {
      setUploadedItems(data.items.length);
    }
  }, [data?.items?.length, uploadedItems]);

  //Defining a success message - only runs when the uploadedItems arrays is not null
  const successMessage = () => {
    if (uploadedItems === null) return null;
    return (
      <div className={classes.animation}>
        {uploadedItems && (
          <>
            Aantal toegevoegde items:
            <p className={classes.uploaded}>{uploadedItems}</p>
          </>
        )}
        Scroll down to see a list of all the items you are lending out. To exit,
        press one of the links in the toolshare navigation area.
      </div>
    );
  };

  //Allowing the participant to navigate to the list of items
  const handleMyListOfItems = () => {
    navigate(`/my-items/${id}`);
  };

  return (
    <>
      <Card className={classes.base}>
        <article className={classes.preview}>
          <p>
            Hier kun je je tools delen! Voeg een tool toe die anderen kunnen
            lenen. Begin met het toevoegen van een foto van het gereedschap.
          </p>
        </article>
        <div className={classes.preview}>
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
                  te selecteren.
                </p>
                <p>Let op: HEIC-bestanden worden niet ondersteund!</p>
              </div>
              <input
                type="file"
                onChange={(event) => onDrop(event.target.files)}
              />
              {showSuccessMessage && (
                <p className={classes.success}>Foto succesvol geüpload!</p>
              )}
            </>
          )}
        </div>
        <form className={classes.control} onSubmit={handleSubmit}>
          <label>
            Itemnaam:
            <input
              type="text"
              placeholder="Wat wil je delen?"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </label>
          <label>
            Itembeschrijving:
            <input
              type="text"
              placeholder="Kan je jouw item kort beschrijven? "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {errorMessage.length > 0 && (
            <div>
              <p className={classes.error}>{errorMessage}</p>
            </div>
          )}
          {error && <div className="error">{error}</div>}
          <Button type="submit" onClick={(event) => handleSubmit(event)}>
            {loading ? 'Loading...' : 'item toevoegen'}
          </Button>
          {/*Ternary statement displaying server error back to user*/}
          {error && <div className={classes.error}> {error} </div>}
          {/*Success message displayed on successful upload*/}
          {uploadSuccess && successMessage()}
        </form>
        <Button onClick={(event) => handleMyListOfItems(event)}>
          Al mijn geüploade items bekijken
        </Button>
      </Card>
      <section>
        <div className={classes.photo}>
          <img src={working} alt="laptopworker" height={300} width={300} />
        </div>
      </section>
    </>
  );
};

export default LendOutItem;
