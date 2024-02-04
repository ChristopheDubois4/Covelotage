import React from 'react';
import { Link } from 'react-router-dom'

/** logout button component */
export default function Home() {

  return (

    <div>

        <h1>ACCEUIL</h1>

        <Link to="/login"><button>Login</button></Link>

    </div>

  );
};