import React from 'react';
import { useParams } from 'react-router-dom';

const EarlierViewedItems = () => {
  //Getting the id from the URL
  const { id } = useParams();
  console.log(id);

  return (
    <div>
      <p>Earlier viewed items</p>
    </div>
  );
};

export default EarlierViewedItems;
