//Dev constant
export const BASE_API_URL = 'http://localhost:8080';
// Other constants
export const SIGN_UP_URL = BASE_API_URL + '/api/authentication/sign-up';
export const SIGN_IN_URL = BASE_API_URL + '/api/authentication/sign-in';
export const PARTICIPANT_URL = BASE_API_URL + '/api/participant/participants';
export const FILE_UPLOAD_URL = BASE_API_URL + '/api/imagefile/upload';
export const POST_SHARE_ITEM_URL =
  BASE_API_URL + '/api/items/participants/items';
export const GET_ALL_SHARE_ITEM_URL = BASE_API_URL + '/api/items/items';
export const GET_SHARE_ITEM_BY_PARTICIPANT_URL =
  BASE_API_URL + '/api/items/participants/items';
export const EXPRESS_INTEREST_GET_OWNER_DETAILS_URL =
  BASE_API_URL + '/api/loan/participant';
export const GET_HISTORY_OF_VIEWED_ITEMS =
  BASE_API_URL + '/api/loan/participants/loaninterest';

// Below is a free resource that constructs a whatsapp QR-code from a phone number input
//This is utilized in the application
export const WHATSAPP_API = 'https://wa.me/31';

//To include verification of whether a phone number is on whatsapp, a get-request can be sent to the following API,
//see below. However, one has to purchase an API-key for 20 USD. Not done for this project.
//The constant below will therefore only be utilized in this project whenever an API-key is purchased
// const verificationAPI = 'https://watverifyapi.live/verify?api_key=wx-12384990&phones=+155895548844';

//To include verification of whether a given Dutch postcode exists, a get-request can be sent to "Postcode API",
//However, one has to purchase an API-key for 45,60 euro per year. Not done for this project.
//More info on: https://www.postcodeapi.nu/prijzen/?gclid=EAIaIQobChMIm6mF-vvJ-wIVl-J3Ch1NZwHKEAAYASABEgIDOfD_BwE

//Production constant for railway.app
//export const BASE_API_URL = "https://toolshare-production.up.railway.app";
