import React, { useEffect, useState } from 'react';
import { PARTICIPANT_URL } from '../../../backend-urls/constants';
import classes from './MyDetails.module.css';
import Card from '../../Card/Card';
import Button from '../../Button/Button';
import useAxios from '../../../hooks/useAxios';
import machineworker from '../../../assets/pexels-karolina-grabowska-6920104.jpg';
import usePhotoUploader from '../../../hooks/usePhotoUploader';
import { useNavigate, useParams } from 'react-router-dom';
import { useValidation } from '../../../hooks/useValidation';

const initialValues = {
  firstName: '',
  lastName: '',
  postcode: '',
  email: '',
  mobileNumber: '',
};

const MyDetails = () => {
  const id = JSON.parse(localStorage.getItem('id'));
  const { put, loading, error, data, get, token } = useAxios();
  const navigate = useNavigate();
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
  const [errorMessage, setErrorMessage] = useState([]);
  const [inputError, setInputError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [submit, setSubmit] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [touched, setTouched] = useState({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    if (id) {
      get(`${PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
  }, [id]);

  useEffect(() => {
    if (photoUrl) {
      setPhotoURL(photoUrl);
      setUploadSuccess(true);
    }
  }, [submit]);

  const validateField = (field, value, defaultValue) => {
    if (!touched[field] || value === defaultValue) {
      return null;
    }

    const errorMessage = useValidation(field, value, initialValues[field]);

    if (errorMessage) {
      setInputError(true);
    }

    return errorMessage;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const fields = {
      firstName,
      lastName,
      email,
      mobileNumber,
      postcode,
    };

    const newErrorMessage = Object.entries(fields).map(([field, value]) => {
      const message = validateField(field, value, data[field]);
      if (message) {
        setInputError(true);
      }
      return { field, message };
    });

    if (newErrorMessage.some(({ message }) => message)) {
      setDisplayError(true);
      setErrorMessage(newErrorMessage);
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      mobileNumber,
      postcode,
    };

    put(`${PARTICIPANT_URL}/${id}`, payload, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    navigate(`/start/${id}`);
    setSubmit(true);
  };

  const inputClasses = inputError || error ? classes.authinvalid : classes.auth;

  return (
    <>
      <Card className={inputClasses}>
        <article>
          <h2 className={classes.h2}>Change details</h2>
          <h3 className={classes.h3}>Hier kan je jouw details veranderen! </h3>
          <h2 className={classes.h2}>Oude gegevens worden eerst doorgegeven</h2>
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
              placeholder={data.firstName}
              defaultValue={data.firstName}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              onBlur={() => setTouched({ ...touched, firstName: true })}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              placeholder={data.lastName}
              defaultValue={data.lastName}
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              onBlur={() => setTouched({ ...touched, lastName: true })}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              placeholder={data.email}
              defaultValue={data.email}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onBlur={() => setTouched({ ...touched, email: true })}
            />
          </label>
          <label>
            Mobile Number:
            <input
              type="text"
              placeholder={data.mobileNumber}
              defaultValue={data.mobileNumber}
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
              }}
              onBlur={() => setTouched({ ...touched, mobileNumber: true })}
            />
          </label>
          <label>
            Post Code:
            <input
              type="text"
              placeholder={data.postcode}
              defaultValue={data.postcode}
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value);
              }}
              onBlur={() => setTouched({ ...touched, postcode: true })}
            />
          </label>
          {errorMessage.map((error) => (
            <p key={error.field} className={classes.error}>
              {error.field}: {error.message}
            </p>
          ))}{' '}
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

export default MyDetails;
