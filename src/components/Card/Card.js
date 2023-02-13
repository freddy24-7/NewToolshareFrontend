import React from 'react';

import classes from './Card.module.css';

const Card = (props) => {
  // The Card component is a wrapper component that can be used to wrap other components
  return (
    <div className={`${classes.card} ${props.className}`}>{props.children}</div>
  );
};

export default Card;
