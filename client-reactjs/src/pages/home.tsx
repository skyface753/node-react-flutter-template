import React from 'react';
import { echoService2 } from '../client04unary';
// import grpcClient from '../grpc-client';
import { service } from '../interceptor';
import { StatusRequest, StatusResponse } from '../proto/auth_pb';
export default function Home() {
  React.useEffect(() => {
    const statusRequest = new StatusRequest();
    async function getStatus() {
      const status = (await service
        .status(statusRequest, null)
        .catch((error) => {
          console.log(error);
        })) as StatusResponse;
      console.log(status.toObject());
      // const status = await echoService2.status(statusRequest, {});
      // console.log(status.toObject());
      // (err, res) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(res);
      //   }
      // });
    }

    getStatus();
  }, []);

  return (
    <div className='home'>
      <h1 className='site-title'> HOME</h1>
    </div>
  );
}
