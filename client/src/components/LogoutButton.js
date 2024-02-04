import React from 'react';
import { useNavigate } from 'react-router-dom';

/** logout button component */
export const LogoutButton = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <button onClick={userLogout} className=''>
      Logout
    </button>
  );
};