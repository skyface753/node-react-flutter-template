import React, { useContext } from 'react';
// import { reactLocalStorage } from "reactjs-localstorage";
// import GoogleLoginButton from "../components/google-login-button";
// import "../styles/sign-up-in-style.css";
import '../styles/sign-up-and-in.css';
import VerificationInput from 'react-verification-input';

// import GitHubLoginButton from "../components/GitHubLoginButton";
import { AuthContext } from '../App';
// import { uninterceptedAxiosInstance } from '../services/api';
import { ActionType } from '../store/reducer';
import { grpcBaseAuthService } from '../services/grpc-api/grpc-client';
import { DefaultAuthResponse, LoginRequest } from '../proto/auth_pb';
import { RpcError, StatusCode } from 'grpc-web';
// import api from '../services/api.js';
// import ApiService from '../services/apiService';

export default function Login() {
  const { dispatch } = useContext(AuthContext);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [required2FA, setRequired2FA] = React.useState(false);
  const [twoFactorCode, setTwoFactorCode] = React.useState('');
  const [twoFactorError, setTwoFactorError] = React.useState('');

  async function login() {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    const loginRequest: LoginRequest = new LoginRequest();
    loginRequest.setUsername(username);
    loginRequest.setPassword(password);
    grpcBaseAuthService
      .login(loginRequest, null)
      .then((response: DefaultAuthResponse) => {
        console.log(response.toObject());
        // localStorage.setItem('token', response.getAccessToken());
        dispatch({
          type: ActionType.LOGIN,
          payload: response.toObject(),
          // payload: {
          //   user: response.getUser()!,
          //   isLoggedIn: true,

          //   accessToken: response.getAccessToken(),
          //   refreshToken: response.getRefreshToken(),
          //   csrfToken: response.getCsrfToken(),
          // },
        });
        window.location.href = '/';
      })
      .catch((error: RpcError) => {
        if (
          error.code === StatusCode.UNAUTHENTICATED &&
          error.message === 'TOTP code required'
        ) {
          setRequired2FA(true);
        }
        setError(error.message);
        console.log(error);
      });
    // uninterceptedAxiosInstance
    //   .post('auth/login', { username, password })
    //   .then((res) => {
    //     if (res.data.success) {
    //       localStorage.setItem(
    //         'token',
    //         JSON.stringify(res.data.data.accessToken)
    //       );
    //       dispatch({
    //         type: ActionType.LOGIN,
    //         payload: {
    //           user: res.data.data.user,
    //           isLoggedIn: true,
    //           accessToken: res.data.data.accessToken,
    //           refreshToken: res.data.data.refreshToken,
    //           csrfToken: res.data.data.csrfToken,
    //         },
    //       });
    //       window.location.href = '/';
    //     } else {
    //       setError(res.data.message);
    //     }
    //   })
    //   .catch((err) => {
    //     if (
    //       err.response.status === 400 &&
    //       err.response.data.message === '2FA required'
    //     ) {
    //       setRequired2FA(true);
    //     }
    //     setError(err.response.data.message);
    //   });
  }

  return (
    <div className='sign-in-container'>
      {/* <GoogleLoginButton /> */}
      {/* <GitHubLoginButton /> */}
      {required2FA ? (
        <div className='mfa-container'>
          <h1>Enter your 2FA code</h1>
          <VerificationInput
            autoFocus={true}
            value={twoFactorCode}
            onChange={(value) => {
              setTwoFactorCode(value);
              if (value.length == 6) {
                const loginRequest: LoginRequest = new LoginRequest();
                loginRequest.setUsername(username);
                loginRequest.setPassword(password);
                loginRequest.setTotpcode(value);
                grpcBaseAuthService
                  .login(loginRequest, null)
                  .then((response: DefaultAuthResponse) => {
                    console.log(response.toObject());
                    // localStorage.setItem('token', response.getAccessToken());
                    dispatch({
                      type: ActionType.LOGIN,
                      payload: response.toObject(),
                      // payload: {
                      //   user: response.getUser(),
                      //   isLoggedIn: true,
                      //   accessToken: response.getAccessToken(),
                      //   refreshToken: response.getRefreshToken(),
                      //   csrfToken: response.getCsrfToken(),
                      // },
                    });
                    window.location.href = '/';
                  })
                  .catch((error: RpcError) => {
                    setTwoFactorError(error.message);
                    console.log(error);
                  });

                // uninterceptedAxiosInstance
                //   .post('auth/login', { username, password, totpCode: value })
                //   .then((res) => {
                //     if (res.data.success) {
                //       localStorage.setItem(
                //         'token',
                //         JSON.stringify(res.data.data.accessToken)
                //       );
                //       dispatch({
                //         type: ActionType.LOGIN,
                //         payload: {
                //           user: res.data.data.user,
                //           isLoggedIn: true,
                //           accessToken: res.data.data.accessToken,
                //           refreshToken: res.data.data.refreshToken,
                //           csrfToken: res.data.data.csrfToken,
                //         },
                //       });
                //       window.location.href = '/';
                //     } else {
                //       setTwoFactorError(res.data.message);
                //       setTwoFactorCode('');
                //     }
                //   })
                //   .catch((err) => {
                //     setTwoFactorError(err.response.data.data);
                //     setTwoFactorCode('');
                //   });
              }
            }}
            length={6}
          />
          {twoFactorError ? (
            <p className='mfa-error'>{twoFactorError}</p>
          ) : null}
        </div>
      ) : null}

      <div className='container'>
        <h1 className='site-title'>Sign In</h1>
        <hr />

        <label htmlFor='username'>
          <b>Email</b>
        </label>
        <input
          type='text'
          placeholder='Enter Username'
          name='username'
          required
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
