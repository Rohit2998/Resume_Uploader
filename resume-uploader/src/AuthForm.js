import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `http://localhost:8000/api/${mode}/`;

    try {
      const response = await axios.post(
        url,
        { username, password },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      console.log('✅ Login/Register success');

      if (mode === 'login') {
        // 👉 Call parent to show ResumeUpload + ResumeList
        onAuthSuccess();
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%' }}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ color: 'green' }}>{message}</p>
      <p>
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
