//This hook is used to validate the form fields,
//and reduce code duplication in the form components "Profile.js" and "Details.js"

//By using useMemo one can in this case prevent unnecessary re-renders of the component
import { useMemo } from 'react';

export const useValidation = (fields, requestType) => {
  const validationErrors = useMemo(() => {
    const errors = [];

    if (requestType === 'post') {
      if (!fields.firstName) {
        errors.push({ field: 'firstName', message: 'Voornaam is verplicht' });
      }

      if (!fields.lastName) {
        errors.push({ field: 'lastName', message: 'Achternaam is verplicht' });
      }

      if (!fields.postcode) {
        errors.push({ field: 'postcode', message: 'Postcode is verplicht' });
      }

      if (!fields.email) {
        errors.push({ field: 'email', message: 'Email is verplicht' });
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(fields.email)
      ) {
        errors.push({ field: 'email', message: 'Ongeldig e-mailadres' });
      }

      if (!fields.mobileNumber) {
        errors.push({
          field: 'mobileNumber',
          message: 'Mobiel nummer is verplicht',
        });
      } else if (!/^\d{10}$/i.test(fields.mobileNumber)) {
        errors.push({
          field: 'mobileNumber',
          message: 'Ongeldig mobiel nummer',
        });
      }
    } else if (requestType === 'put') {
      if (fields.firstName && !fields.firstName.trim()) {
        errors.push({
          field: 'firstName',
          message: 'Voornaam kan niet leeg zijn',
        });
      }

      if (fields.lastName && !fields.lastName.trim()) {
        errors.push({
          field: 'lastName',
          message: 'Achernaam kan niet leeg zijn',
        });
      }

      if (
        fields.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(fields.email)
      ) {
        errors.push({ field: 'email', message: 'Ongeldig e-mailadres' });
      }

      if (fields.mobileNumber && !/^\d{10}$/i.test(fields.mobileNumber)) {
        errors.push({
          field: 'mobileNumber',
          message: 'Ongeldig mobiel nummer',
        });
      }
    }

    return errors;
  }, [fields, requestType]);

  return validationErrors;
};
