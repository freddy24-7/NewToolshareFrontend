import React from 'react';
import './Button.css';

// The Button component is a wrapper component that can be used to wrap other components
const Button = ({ children, onClick, className = '' }) => (
  <button className={`Button ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
