import React, { useState, useEffect } from 'react';
import ResumeUpload from './ResumeUpload';
import ResumeList from './ResumeList';
import AuthForm from './AuthForm';
import axios from 'axios';
import './App.css';  // Importing global styles

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/check-auth/', { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    try {
      const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken=')).split('=')[1];

      await axios.post('http://localhost:8000/api/logout/', {}, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true
      });

      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="container">
      <h1>Resume Uploader</h1>

      <div style={{ position: 'relative' }}>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>

        {!isLoggedIn ? (
          <AuthForm onAuthSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <>
            <ResumeUpload />
            <hr />
            <ResumeList />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
