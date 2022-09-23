import React, { useContext } from 'react';
// import { reactLocalStorage } from "reactjs-localstorage";
// import GoogleLoginButton from "../components/google-login-button";
// import "../styles/sign-up-in-style.css";
import '../styles/sign-up-and-in.css';

// import GitHubLoginButton from "../components/GitHubLoginButton";
import { AuthContext } from '../App';
import { uninterceptedAxiosInstance } from '../services/api';
// import api from '../services/api.js';
// import ApiService from '../services/apiService';

export default function Login() {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  async function login() {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    uninterceptedAxiosInstance
      .post('/auth/login', { email, password })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem(
            'token',
            JSON.stringify(res.data.data.accessToken)
          );
          dispatch({
            type: 'LOGIN',
            payload: {
              user: res.data.data.user,
              isLoggedIn: true,
              accessToken: res.data.data.accessToken,
              refreshToken: res.data.data.refreshToken,
              csrfToken: res.data.data.csrfToken,
            },
          });
          window.location.href = '/';
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError(err.response.data.data);
      });
  }

  return (
    <div className='sign-in-container'>
      {/* <GoogleLoginButton /> */}
      {/* <GitHubLoginButton /> */}
      <div className='container'>
        <h1 className='site-title'>Sign In</h1>
        <hr />

        <label htmlFor='email'>
          <b>Email</b>
        </label>
        <input
          type='text'
          placeholder='Enter Email'
          name='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              login();
            }
          }}
        />

        <label htmlFor='password'>
          <b>Password</b>
        </label>
        <input
          type='password'
          placeholder='Enter Password'
          name='password'
          required
          value={password}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              login();
            }
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p
          style={{
            color: 'red',
          }}
        >
          {error}
        </p>

        <button className='sign-in-up-btn' onClick={login}>
          Sign In
        </button>
      </div>
    </div>
  );
}
