import { useMemo } from 'react';

export const useValidation = (fields, requestType) => {
  const validationErrors = useMemo(() => {
    const errors = [];

    if (requestType === 'post') {
      if (!fields.firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
      }

      if (!fields.lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
      }

      if (!fields.postcode) {
        errors.push({ field: 'postcode', message: 'Postcode is required' });
      }

      if (!fields.email) {
        errors.push({ field: 'email', message: 'Email is required' });
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(fields.email)
      ) {
        errors.push({ field: 'email', message: 'Invalid email address' });
      }

      if (!fields.mobileNumber) {
        errors.push({
          field: 'mobileNumber',
          message: 'Mobile number is required',
        });
      } else if (!/^\d{10}$/i.test(fields.mobileNumber)) {
        errors.push({
          field: 'mobileNumber',
          message: 'Invalid mobile number',
        });
      }
    } else if (requestType === 'put') {
      if (fields.firstName && !fields.firstName.trim()) {
        errors.push({
          field: 'firstName',
          message: 'First name cannot be empty',
        });
      }

      if (fields.lastName && !fields.lastName.trim()) {
        errors.push({
          field: 'lastName',
          message: 'Last name cannot be empty',
        });
      }

      if (
        fields.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(fields.email)
      ) {
        errors.push({ field: 'email', message: 'Invalid email address' });
      }

      if (fields.mobileNumber && !/^\d{10}$/i.test(fields.mobileNumber)) {
        errors.push({
          field: 'mobileNumber',
          message: 'Invalid mobile number',
        });
      }
    }

    return errors;
  }, [fields, requestType]);

  return validationErrors;
};
