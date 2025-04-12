import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/list/')
      .then(res => setResumes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Uploaded Resumes</h2>
      {resumes.length === 0 ? (
        <p>No resumes uploaded yet.</p>
      ) : (
        <ul>
          {resumes.map((resume) => (
            <li key={resume.id}>
              <strong>Name:</strong> {resume.name}<br />
              <strong>Email:</strong> {resume.email}<br />
              <strong>Phone:</strong> {resume.phone}<br />
              <strong>Skills:</strong> {resume.skills}<br />
              <strong>Education:</strong> {resume.education}<br />
<strong>Experience:</strong><pre>{resume.experience}</pre><br />
              <a href={`http://localhost:8000${resume.pdf}`} target="_blank" rel="noopener noreferrer">Download PDF</a>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResumeList;
