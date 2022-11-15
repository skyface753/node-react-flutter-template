import React from 'react';
// import grpcClient from '../grpc-client';
import { grpcAuthService } from '../grpc-client';
import { StatusRequest, StatusResponse } from '../proto/auth_pb';
export default function Home() {
  React.useEffect(() => {
    const statusRequest = new StatusRequest();
    async function getStatus() {
      const status = (await grpcAuthService
        .status(statusRequest, null)
        .catch((error) => {
          console.log(error);
        })) as StatusResponse;
      console.log(status.toObject());
    }

    getStatus();
  }, []);

  return (
    <div className='home'>
      <h1 className='site-title'> HOME</h1>
    </div>
  );
}
