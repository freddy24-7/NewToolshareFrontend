import React from 'react';
import { useParams } from 'react-router-dom';

const OwnerDetails = () => {
  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  return <div>Owner Details</div>;
};

export default OwnerDetails;
