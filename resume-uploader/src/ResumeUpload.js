import React, { useState } from 'react';
import axios from 'axios';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file!');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];

      await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });

      window.location.reload();  // Refresh page after upload

    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload Your Resume</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default ResumeUpload;
