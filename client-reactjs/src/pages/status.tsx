import React from 'react';
import ProfilePictureComponent from '../components/ProfilePicture';
import { StatusRequest, StatusResponse, User } from '../proto/auth_pb';
import { grpcApi } from '../services/grpc-api/grpc-client';
// import api from '../services/api';

// interface IAuthStatusState {
//   success: boolean;
//   data: {
//     id: number;
//     username: string;
//     email: string;
//     avatar: string;
//     roleFk: number;
//   } | null;
// }
interface IAuthStatusState {
  success: boolean;
  user: User.AsObject | null;
}

export default function StatusPage() {
  const [authStatus, setAuthStatus] = React.useState<IAuthStatusState>({
    success: false,
    user: null,
  });

  React.useEffect(() => {
    const statusReq = new StatusRequest();
    grpcApi.authService.status(statusReq, null).then((res: StatusResponse) => {
      console.log(res.toObject());
      setAuthStatus({
        success: true,
        user: res.getUser()?.toObject() || null,
      });
    });
    // const statusReq = new StatusRequest();
    // statusReq.s
    // grpcApi.authService.status()
    // api.get('auth/status').then((res) => {
    //   setAuthStatus(res.data);
    // });
  }, []);

  if (!authStatus.success) {
    // Show loading indicator
    return <div>Loading...</div>;
  }

  return (
    <div className='status-container'>
      <h1>Status</h1>
      <ProfilePictureComponent avatarPath={authStatus.user?.avatar} />
      <p>Success: {authStatus.success ? 'true' : 'false'}</p>
      <p>Username: {authStatus.user?.username}</p>
      <p>
        Email: {authStatus.user?.createdAt?.nanos} +{' '}
        {authStatus.user?.createdAt?.seconds}
      </p>
      <p>Role: {authStatus.user?.role}</p>
    </div>
  );
}
