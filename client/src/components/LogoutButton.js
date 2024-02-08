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
    <div className="text-center">
      <span>
        Come back later?{' '}
        <button onClick={userLogout} className="btn btn-link">
          Logout
        </button>
      </span>
    </div>
  );
};