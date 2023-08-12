// src/Customization.js
import React from 'react';
import { Link } from 'react-router-dom';

function Customization({ title, setTitle }) {
  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    updateTitleInDB(newTitle);
  };

  const updateTitleInDB = (newTitle) => {
    fetch('http://localhost:5000/title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="customization-container">
      <label htmlFor="title">Title: </label>
      <input type="text" id="title" value={title} onChange={handleTitleChange} />
    </div>
  );
}

export default Customization;
