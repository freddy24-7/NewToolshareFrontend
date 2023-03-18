import React, { useEffect, useState } from 'react';
import useApiCalls from '../../hooks/useApiCalls';
import useAxios from '../../hooks/useAxios';
import usePhotoUploader from '../../hooks/usePhotoUploader';
import Card from '../Card/Card';
import Button from '../Button/Button';
import classes from './LendOutItem.module.css';
import working from '../../assets/pexels-bidvine-1249611.jpg';
import { POST_SHARE_ITEM_URL } from '../../backend-urls/constants';
import { GET_SHARE_ITEM_BY_PARTICIPANT_URL } from '../../backend-urls/constants';

import { useNavigate, useParams } from 'react-router-dom';

const LendOutItem = () => {
  //Getting the id from the URL
  const { id } = useParams();

  //Defining variables
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedItems, setUploadedItems] = useState(null);

  //Custom hook to make API calls
  const { post, get, loading, error, data, statusCode, token } = useAxios();

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

  //Function to handle the submission of the form
  const handleSubmit = (event) => {
    event.preventDefault();
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
    console.log(statusCode);
    if (statusCode === 200) {
      setItemName('');
      setDescription('');
      setPhotoURL('');
    }
  }, [data, error]);

  //Here we are making the API call to get all the items from the participant
  useEffect(() => {
    if (id) {
      // Storing the id in local storage
      get(`${GET_SHARE_ITEM_BY_PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    incrementApiCalls();
    console.log('API calls: ', apiCalls);
  }, [id]);

  useEffect(() => {
    if (data && data.items) {
      // check that data and data.items are defined
      console.log(data.items);
      const items = data.items;
      const itemsLength = items.length;
      console.log(itemsLength);
      // setUploadedItems(data.items.length);
    }
  }, [data]);

  console.log('Data: ', data);
  console.log(uploadedItems);

  //Defining a success message
  function successMessage() {
    return (
      <div className={classes.animation}>
        Item has been added! Feel free to add more items. Number of items added:{' '}
        <p className={classes.uploaded}>{uploadedItems}</p>
        Scroll down to see a list of all the items you are lending out. To exit,
        press one of the links in the toolshare navigation area.
      </div>
    );
  }

  const handleMyListOfItems = () => {
    navigate(`/my-items/${id}`);
  };

  return (
    <>
      <Card className={classes.base}>
        <article>
          <p>
            Hier kun je je tools delen! Voeg een tool toe die anderen kunnen
            lenen. Begin met het toevoegen van een foto van het gereedschap.
          </p>
        </article>
        {/*Terniary statement displaying server error back to user*/}
        {error && <div className={classes.error}> {error} </div>}
        {/*Success message displayed on successful upload*/}
        {loading && successMessage()}
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
            Item Name:
            <input
              type="text"
              placeholder="Wat wil je delen?"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </label>
          <label>
            Item Description:
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
          <Button type="submit">
            {loading ? 'Loading...' : 'Update your details'}
          </Button>
        </form>
        <Button onClick={(event) => handleMyListOfItems(event)}></Button>
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
