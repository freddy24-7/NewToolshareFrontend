//This component generates a qr code for the borrower to scan,
//which will take them to the whatsapp number of the owner
//The component also integrates the google maps api to show the location of the owner
//and the biking distance from the borrower to the owner
import React, { Fragment, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import classes from './OwnerDetails.module.css';
import FindOwner from './../../../helpers/FindOwner';
import { PARTICIPANT_URL, WHATSAPP_API } from '../../../backend-urls/constants';
import useAxios from '../../../hooks/useAxios';
import { SkeletonText } from '@chakra-ui/react';
import { useJsApiLoader } from '@react-google-maps/api';
import QRCode from 'react-qr-code';
import Card from '../../Card/Card';

const OwnerDetails = () => {
  //Getting the id (of the borrower) from the URL
  const { id } = useParams();
  console.log(id);

  //Owner: These variables pertain to the owner of an item
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [postcode, setPostcode] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [qr, setQr] = useState('');

  //Borrower: Defining the postcode of the borrower
  const [participantPostcode, setParticipantPostcode] = useState('');

  //Variables used to work with google distance matrix api, to obtain the cycle distance between an
  //owner and a participant interested in an borrowing an item.
  const [bikeDistance, setBikeDistance] = useState('');
  const [bikeTime, setBikeTime] = useState('');

  //Item to be borrowed: Getting the itemIdValue from the URL
  const location = useLocation();
  const itemIdValue = new URLSearchParams(location.search).get('itemId');
  console.log(itemIdValue);

  //Owner: Checking if itemIdValue is null or undefined before calling FindOwner
  const owner = itemIdValue ? FindOwner({ itemIdValue }) : '';
  console.log(owner.owner);
  useEffect(() => {
    if (owner.owner) {
      setFirstName(owner.owner.firstName);
      setLastName(owner.owner.lastName);
      setEmail(owner.owner.email);
      setMobileNumber(owner.owner.mobileNumber);
      setPostcode(owner.owner.postcode);
      setPhotoURL(owner.owner.photoURL);
    }
  }, [owner.owner]);
  console.log(firstName);
  console.log(mobileNumber);

  //Here we are adding qr-codes and manipulating mobile numbers using the slice-method
  //so that we can generate a qr-code that can take a participant to the whatsapp number
  //of an owner through a qr-code
  useEffect(() => {
    if (mobileNumber) {
      const mobileWithoutFirstZero = mobileNumber.slice(1);
      console.log(mobileWithoutFirstZero);
      const whatsAppAPIAndNumber = WHATSAPP_API + mobileWithoutFirstZero;
      console.log(whatsAppAPIAndNumber);
      setQr(whatsAppAPIAndNumber);
    }
  }, [mobileNumber]);
  console.log(qr);

  //Custom hook to make API calls
  const { get, data, token } = useAxios();

  //Get the current participant details to set the participantPostcode
  useEffect(() => {
    if (id !== null) {
      get(`${PARTICIPANT_URL}/${id}`, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
      console.log(data);
    }
  }, [id, token]);

  //Setting the participantPostcode
  useEffect(() => {
    if (data) {
      setParticipantPostcode(data.postcode);
    }
  }, [data]);
  console.log(participantPostcode);

  //Getting the API and API key, and adding language as per documentation to get the output in Dutch
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    language: ['nl'],
  });

  //Using the google resource that we have imported from chakra
  if (!isLoaded) {
    return <SkeletonText />;
  }

  //Defining the two postcodes needed to measure distance. "Origin" in is the participant postcode,
  // "destination" is the owner-postcode
  let origin = participantPostcode;
  let destination = postcode;
  //controlling that we are passing strings to the API
  console.log(typeof origin);
  console.log(typeof destination);

  //Specifying the resources needed from the google distance matrix api.
  //Only using the resources needed for this specific application
  let service = new window.google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: 'BICYCLING',
    },
    callback,
  );

  //For loop to determine distance and duration using google maps resources
  function callback(response, status) {
    if (status === 'OK') {
      let origins = response.originAddresses;
      for (let i = 0; i < origins.length; i++) {
        let results = response.rows[i].elements;
        for (let j = 0; j < results.length; j++) {
          let element = results[j];
          let distance = element.distance.text;
          console.log(distance);
          setBikeDistance(distance);
          let duration = element.duration.text;
          setBikeTime(duration);
          console.log(duration);
        }
      }
    } else {
      console.log(status);
      console.log(response);
    }
  }

  return (
    <Fragment>
      <article className={classes.display}>
        <div className={classes.qr}>
          <QRCode value={qr} />
        </div>
        <Card className={classes.base}>
          <section className={classes.control}>
            <p className={classes.success}>
              De eigenaar is {firstName + ' ' + lastName}. Als {firstName} een
              geldig whatsapp-nummer heeft geüpload, dan brengt de QR-code je
              naar een whatsapp-chat met {firstName}. Wijs gewoon naar de code
              met je foto-app op je mobiel.
            </p>
            <p>
              Of bel {firstName} op: {mobileNumber}
            </p>
            <div className={classes.photo}>
              <img src={photoURL} alt="owner" height={300} width={290} />
            </div>
            <p className={classes.cycle}>
              Maak er straks een leuk fietstocht van. U woont op korte afstand
              van de eigenaar {bikeDistance}. Duurt niet lang op det fiets{' '}
              {bikeTime}.
            </p>
            <p>Er kan ook een e-mail gestuurd worden naar {email}</p>
          </section>
        </Card>
      </article>
    </Fragment>
  );
};

export default OwnerDetails;
