// src/Login.js
import React from 'react';
import LoginForm from './LoginForm'; // Adjust the import based on your folder structure
import { Helmet } from 'react-helmet-async';

function Login() {

  return (
    <div className="portal-container">
      <Helmet>
        <title>Log in or Sign Up | Accordee</title>
      </Helmet>
      <div>
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );

}

export default Login;
