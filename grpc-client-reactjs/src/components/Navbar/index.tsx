import React, { useContext } from 'react';
import '../../styles/navbar.css';
import { useState } from 'react';
import { AuthContext } from '../../App';
import defaultImage from '../../img/default-profile-pic.png';
import config from '../../config.json';
// import api from '../../services/api';
import { AxiosResponse } from 'axios';
import { ActionType } from '../../store/reducer';
import ProfilePictureComponent from '../ProfilePicture';
import { LogoutRequest, LogoutResponse, Role } from '../../proto/grpc-proto/auth_pb';
import { grpcApi } from '../../services/grpc-api/grpc-client';
// import { ReactComponent as Logo } from "../../img/SkyBlog-Logo.svg";

export default function Navbar() {
  const { state, dispatch } = useContext(AuthContext);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  console.log('State');
  console.log(state);
  return (
    <nav className='navigation'>
      <a href='/' className='brand-name'>
        SkyTemp
        {/* <Logo /> */}
      </a>
      <button
        className='hamburger'
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        {/* icon from heroicons.com */}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          viewBox='0 0 20 20'
          fill='white'
        >
          <path
            fillRule='evenodd'
            d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z'
            clipRule='evenodd'
          />
        </svg>
      </button>
      <div
        className={
          isNavExpanded ? 'navigation-menu expanded' : 'navigation-menu'
        }
      >
        <ul>
          <li>
            <a href='/home'>Home</a>
          </li>
          <li>
            <a href='/status'>Auth Status (User Route)</a>
          </li>
          {state.isLoggedIn ? (
            state.user?.role === Role.ADMIN ? (
              <li>
                <a href='/admin'>Admin</a>
              </li>
            ) : null
          ) : null}
          {!isNavExpanded ? (
            <li>
              <input
                type='text'
                placeholder='Search'
                className='search-nav-input'
                onKeyDown={(e) => {
                  // Enter key
                  if (e.key === 'Enter') {
                    window.location.href =
                      '/search/?searchString=' +
                      (e.target as HTMLInputElement).value;
                  }
                }}
              />
            </li>
          ) : null}

          {state.isLoggedIn ? (
            <li
              style={{
                marginLeft: 'auto',
              }}
            >
              <div
                className={
                  isNavExpanded
                    ? 'loggedInUserMenu-expanded'
                    : 'loggedInUserMenu'
                }
              >
                {/* TODO: AVATAR */}
                <div className='loggedInUserMenu-Button'>
                  {state.user?.avatar ? (
                    <ProfilePictureComponent avatarPath={state.user.avatar} />
                  ) : (
                    <ProfilePictureComponent avatarPath={undefined} />
                  )}
                </div>
                <div
                  className={
                    isNavExpanded
                      ? 'loggedInUser-dropdown-content-expanded'
                      : 'loggedInUser-dropdown-content'
                  }
                >
                  <a href={'/users/' + state.user?.username}>
                    {state.user?.username}
                  </a>
                  <a href='/settings'>Settings</a>
                  {/* Logout */}
                  {/* <a
                    href='#'
                    onClick={async () => {
                      const currentRefreshToken =
                        localStorage.getItem('refreshToken') || '';

                      try {
                        await api
                          .post('/auth/logout', {
                            refreshToken: currentRefreshToken, // To delete from redis
                          })
                          .then((res: AxiosResponse) => {
                            if (res.data.success) {
                              dispatch({
                                type: ActionType.LOGOUT,
                                payload: {},
                              });
                              window.location.href = '/';
                              return;
                            } else {
                              console.log('Error');
                              console.log(res.data);
                            }
                          });
                        dispatch({ type: ActionType.LOGOUT, payload: {} });
                        window.location.href = '/';
                      } catch (err) {
                        console.log(err);
                        dispatch({ type: ActionType.LOGOUT, payload: {} });
                        window.location.href = '/';
                      }
                    }}
                  >
                    Logout
                  </a> */}
                  <button
                    className='logout-button'
                    onClick={async () => {
                      const currentRefreshToken =
                        localStorage.getItem('refreshToken') || '';

                      try {
                        const logoutRequest = new LogoutRequest();
                        logoutRequest.setRefreshToken(currentRefreshToken);
                        await grpcApi.authService
                          .logout(logoutRequest, {})
                          .then((res: LogoutResponse) => {
                            if (res.getSuccess()) {
                              dispatch({
                                type: ActionType.LOGOUT,
                                payload: ActionType.LOGOUT,
                              });
                              window.location.href = '/';
                              return;
                            } else {
                              console.log('Error');
                              console.log(res);
                            }
                          });
                      } catch (err) {
                        console.log(err);
                      }
                      dispatch({
                        type: ActionType.LOGOUT,
                        payload: ActionType.LOGOUT,
                      });
                      window.location.href = '/';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <div className={isNavExpanded ? 'navbar-space' : 'navbar-right'}>
              <li>
                <a href='/login'>Login</a>
              </li>
              <li>
                <a href='/register'>Register</a>
              </li>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}
