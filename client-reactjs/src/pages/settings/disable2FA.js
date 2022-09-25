import VerificationInput from 'react-verification-input';
import React from 'react';
import api from '../../services/api';

export default function Disable2FA() {
  const [password, setPassword] = React.useState('');
  const [twoFactorCode, setTwoFactorCode] = React.useState('');
  const [twoFactorError, setTwoFactorError] = React.useState('');
  return (
    <div>
      <h2>Disable 2FA for your Account</h2>
      <p>Enter your password and 2FA code to disable 2FA for your account.</p>
      <div>
        <h3>Password</h3>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <VerificationInput
          autoFocus={true}
          value={twoFactorCode}
          onChange={(value) => {
            setTwoFactorCode(value);
            if (value.length == 6) {
              api
                .post('/auth/2fa/disable', { password, totpCode: value })
                .then((res) => {
                  if (res.data.success) {
                    window.alert('2FA has been disabled for your account');
                    window.location.href = '/';
                  } else {
                    setTwoFactorError(res.data.message);
                    setTwoFactorCode('');
                  }
                })
                .catch((err) => {
                  setTwoFactorError(err.response.data.data);
                  setTwoFactorCode('');
                });
            }
          }}
          length={6}
        />
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
