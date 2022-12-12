import { useState, useContext, useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../App';
import React from 'react';
// import api from '../services/api';
// import { grpcAuthService } from '../services/grpc-api/grpc-client';
import { StatusRequest, StatusResponse } from '../proto/grpc-proto/auth_pb';
import { grpcApi } from '../services/grpc-api/grpc-client';

const access = async () => {
  try {
    const statusResponse = (await grpcApi.authService.status(
      new StatusRequest(),
      null
    )) as StatusResponse;
    if (statusResponse.getUser() !== null) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const UserProtectedRoute = () => {
  const location = useLocation();
  const [authorized, setAuthorized] = useState<boolean>(); // initially undefined!

  const { state } = useContext(AuthContext);

  useEffect(() => {
    const authorize = async () => {
      try {
        setAuthorized(await access());
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
