import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUploader = ({ username, backendUrl, bucketUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/${username}/uploaded-media`)
      .then((response) => {
        setUploadedMedia(response.data.uploadedMedia || []);
      })
      .catch((error) => {
        console.error('An error occurred while fetching uploaded media:', error);
      });
  }, [username, backendUrl]);

  const handleDelete = (url) => {
    const token = localStorage.getItem('token'); // Retrieve the token
    const config = {
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      },
      data: { url } // Axios requires data to be in this format for delete requests
    };
  
    axios.delete(`${backendUrl}/${username}/delete-media`, config)
      .then(() => {
        const newUploadedMedia = uploadedMedia.filter(item => item !== url);
        setUploadedMedia(newUploadedMedia);
      })
      .catch((error) => {
        console.error('An error occurred while deleting the file:', error);
      });
  };
  
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('media', selectedFile);
  
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage or context
      const config = {
        headers: {
          'Authorization': `Bearer ${token}` // Add the token in the Authorization header
        }
      };
  
      await axios.post(`${backendUrl}/${username}/upload-media`, formData, config);
      const newMediaUrl = `${bucketUrl}/${username}/${selectedFile.name}`;
      setUploadedMedia(prevState => {
        if (!prevState.includes(newMediaUrl)) {
          return [...prevState, newMediaUrl];
        }
        return prevState;
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
    

  return (
    <div>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <p>Supported file types: jpg, png, gif</p>
      <button onClick={handleFileUpload}>Upload</button>

      <ul>
        {uploadedMedia.map((url, index) => (
          <li key={index}>
            <img src={url} alt="Uploaded Thumbnail" width="50" height="50" />
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
            <button onClick={() => handleDelete(url)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
