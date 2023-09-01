// src/NavRow.js
import React from 'react';
import './NavRow.css';

function NavRow({ title, onSelect, color, isShrinked, isSelected }) {
  let className = 'navRow';
  
  if (isShrinked) className += ' shrink';
  if (isSelected) className += ' selected';

  return (
    <div className={className} style={{ backgroundColor: color }} onClick={onSelect}>
      {title}
    </div>
  );
}

export default NavRow;
