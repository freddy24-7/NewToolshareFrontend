import React from 'react';
import './Button.css';

const Button = ({ children, onClick, className = '' }) => (
    <button className={`Button ${className}`} onClick={onClick}>
        {children}
    </button>
);

export default Button;