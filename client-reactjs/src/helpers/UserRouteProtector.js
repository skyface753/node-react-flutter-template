import { useState, useContext, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../App';
import ApiService from '../services/apiService';
import React from 'react';

const access = async () => {
  const response = await ApiService.status();
  if (!response) return false;
  console.log(response);
  if (response.data.success) {
    return true;
  } else {
    return false;
  }
  // return await axios.post(
  //   "http://localhost:5000/access",
  //   {},
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
};

export const UserProtectedRoute = () => {
  const location = useLocation();
  const [authorized, setAuthorized] = useState(); // initially undefined!

  const { state } = useContext(AuthContext);

  useEffect(() => {
    const authorize = async () => {
      try {
        setAuthorized(await access(state.accessToken));
      } catch (err) {
        setAuthorized(false);
      }
    };

    authorize();
  }, []);

  if (authorized === undefined) {
    return null; // or loading indicator/spinner/etc
  }

  return authorized ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
};
