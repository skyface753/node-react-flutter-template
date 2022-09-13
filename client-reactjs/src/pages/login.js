import React, { useContext } from 'react';
// import { reactLocalStorage } from "reactjs-localstorage";
// import GoogleLoginButton from "../components/google-login-button";
// import "../styles/sign-up-in-style.css";
import '../styles/sign-up-and-in.css';

// import GitHubLoginButton from "../components/GitHubLoginButton";
import { AuthContext } from '../App';
import ApiService from '../services/apiService';

export default function Login() {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  return (
    <div className='sign-in-container'>
      {/* <GoogleLoginButton /> */}
      {/* <GitHubLoginButton /> */}
      <div className='container'>
        <h1>Sign In</h1>
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
          onChange={(e) => setPassword(e.target.value)}
        />

        <p>{error}</p>

        <button
          className='sign-in-up-btn'
          onClick={() => {
            ApiService.login(email, password).then((res) => {
              if (!res) {
                setError('Invalid email or password');
                return;
              }
              if (res.data.success) {
                console.log(res.data.data.user);
                dispatch({
                  type: 'LOGIN',
                  payload: {
                    user: res.data.data.user,
                    isLoggedIn: true,
                  },
                });
                window.location.href = '/';
              }
            });

            // apiService("login/manuelly", {
            //   username: email,
            //   password,
            // }).then((response) => {
            //   if (response.data.success) {
            //     var user = response.data["user"];
            //     dispatch({
            //       type: "LOGIN",
            //       payload: {
            //         user,
            //         isLoggedIn: true,
            //       },
            //     });
            //     window.location.href = "/";
            //   } else {
            //     setError(response.data.message);
            //   }
            // });
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
