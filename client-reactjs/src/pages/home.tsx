import React from 'react';
// import grpcClient from '../grpc-client';
import { grpcAuthService } from '../grpc-client';
import { StatusRequest, StatusResponse } from '../proto/auth_pb';
export default function Home() {
  const [status, setStatus] = React.useState<StatusResponse>();

  React.useEffect(() => {
    const statusRequest = new StatusRequest();
    async function getStatus() {
      const statusResponse = await grpcAuthService
        .status(statusRequest, null)
        .catch((error) => {
          console.trace(error);
        });
      if (statusResponse) {
        setStatus(statusResponse);
      } else {
        console.log('error');
      }
    }

    getStatus();
  }, []);

  return (
    <div className='home'>
      <h1 className='site-title'> HOME</h1>
      <h2 className='site-title'> {status?.getUser()?.getUsername()}</h2>
    </div>
  );
}
