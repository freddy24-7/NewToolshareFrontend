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
  console.log(id);

  //Defining variables
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedItems, setUploadedItems] = useState(null);

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
  console.log(uploadedItems);

  //Defining a success message - only runs when the uploadedItems arrays is not null
  const successMessage = () => {
    if (uploadedItems === null) return null;
    return (
      <div className={classes.animation}>
        {uploadedItems && (
          <>
            Number of items added:
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
          <Button type="submit" onClick={(event) => handleSubmit(event)}>
            {loading ? 'Loading...' : 'Add your item'}
          </Button>
          {/*Ternary statement displaying server error back to user*/}
          {error && <div className={classes.error}> {error} </div>}
          {/*Success message displayed on successful upload*/}
          {uploadSuccess && successMessage()}
        </form>
        <Button onClick={(event) => handleMyListOfItems(event)}>
          All my uploaded items
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
