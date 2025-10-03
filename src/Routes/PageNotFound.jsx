import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Oops! The page you are looking for does not exist.</p>
      <button style={styles.button} onClick={() => navigate('/')}>
        Go to Homepage
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: '6rem',
    fontWeight: 'bold',
    color: '#dc3545',
    margin: '0',
  },
  message: {
    fontSize: '1.5rem',
    color: '#6c757d',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
};
