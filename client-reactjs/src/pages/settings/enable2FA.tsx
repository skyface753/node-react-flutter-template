import VerificationInput from 'react-verification-input';
import React from 'react';
// import api from '../../services/api';
import QRCode from 'react-qr-code';
import { AxiosResponse } from 'axios';
import { grpcApi } from '../../services/grpc-api/grpc-client';
import {
  EnableTOTPRequest,
  EnableTOTPResponse,
  VerifyTOTPRequest,
  VerifyTOTPResponse,
} from '../../proto/auth_pb';

var empty2FAData = {
  url: '',
  secretbase32: '',
};
export default function Enable2FA() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [twoFactorData, setTwoFactorData] = React.useState(empty2FAData);
  const [twoFactorCode, setTwoFactorCode] = React.useState('');
  const [twoFactorError, setTwoFactorError] = React.useState('');
  return (
    <div>
      <h2>Enable 2FA for your Account</h2>
      <p>Enter your password to setup 2FA for your account.</p>
      <div>
        <h3>Password</h3>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => {
            const enableTotpReq = new EnableTOTPRequest();
            enableTotpReq.setPassword(password);
            grpcApi.authService
              .enableTOTP(enableTotpReq, null)
              .then((res: EnableTOTPResponse) => {
                setTwoFactorData({
                  url: res.getUrl(),
                  secretbase32: res.getSecret(),
                });
              })
              .catch((err) => {
                setError(err.message);
              });
            // .post('/auth/2fa/enable', { password })
            // .then((res: AxiosResponse) => {
            //   if (res.data.success) {
            //     setTwoFactorData(res.data.data);
            //   } else {
            //     setError(res.data.message);
            //   }
            // })
            // .catch((err: any) => {
            //   setError(err.response.data.data);
            // });
          }}
        >
          Enable
        </button>
        {error && <p>{error}</p>}
        {twoFactorData != empty2FAData && (
          <div>
            <h3>Scan the QR Code</h3>
            <QRCode value={twoFactorData.url} />
            <h3>Or enter the code manually</h3>
            <input type='text' value={twoFactorData.secretbase32} readOnly />
            <h3>Enter the 2FA code</h3>

            <VerificationInput
              autoFocus={true}
              value={twoFactorCode}
              onChange={(value) => {
                setTwoFactorCode(value);
                if (value.length == 6) {
                  const verifyTOTPReq = new VerifyTOTPRequest();
                  verifyTOTPReq.setTotpcode(value);

                  grpcApi.authService
                    .verifyTOTP(verifyTOTPReq, null)
                    .then((res: VerifyTOTPResponse) => {
                      if (res.getSuccess()) {
                        window.alert('2FA has been enabled for your account');
                        window.location.href = '/';
                      }
                    })
                    .catch((err) => {
                      setTwoFactorError(err.message);
                      setTwoFactorCode('');
                    });

                  // api
                  //   .post('/auth/2fa/verify', { password, currentCode: value })
                  //   .then((res: AxiosResponse) => {
                  //     if (res.data.success) {
                  //       window.alert('2FA has been enabled and verified!');
                  //       window.location.href = '/';
                  //     } else {
                  //       setTwoFactorError(res.data.message);
                  //       setTwoFactorCode('');
                  //     }
                  //   })
                  //   .catch((err: any) => {
                  //     setTwoFactorError(err.response.data.data);
                  //     setTwoFactorCode('');
                  //   });
                }
              }}
              length={6}
            />
          </div>
        )}
      </div>
      <div
        style={{
          color: 'red',
          marginTop: '10px',
        }}
      >
        {twoFactorError}
      </div>
    </div>
  );
}
