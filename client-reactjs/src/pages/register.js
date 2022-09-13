import React, { useContext } from 'react';
import '../styles/sign-up-and-in.css';
import { AuthContext } from '../App';
import ApiService from '../services/apiService';
// import GitHubLoginButton from "../components/GitHubLoginButton";

export default function Register() {
  const { dispatch } = useContext(AuthContext);
  var lastPage = document.referrer;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  return (
    <div>
      <div className='sign-in-up-container'>
        <div>
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
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
            onChange={(e) => {
              setEmail(e.target.value);
              // TODO: check if email is free
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
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor='confirmPassword'>
            <b>Confirm Password</b>
          </label>
          <input
            type='password'
            placeholder='Confirm Password'
            name='confirmPassword'
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <p>{error}</p>

          <p>
            By creating an account you agree to our{' '}
            <a href='/privacy-policy' style={{ color: 'dodgerblue' }}>
              Terms & Privacy
            </a>
            .
          </p>

          <div className='clearfix'>
            <button
              type='submit'
              className='sign-in-up-btn'
              onClick={() => {
                if (password !== confirmPassword) {
                  setError('Passwords do not match');
                  return;
                }
                ApiService.register(email, password).then((res) => {
                  if (res.data.success) {
                    console.log(res.data.data.user);
                    dispatch({
                      type: 'LOGIN',
                      payload: {
                        user: res.data.data.user,
                        isLoggedIn: true,
                      },
                    });
                    window.alert('You have successfully registered!');
                    window.location.href = lastPage;
                  }
                });
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
