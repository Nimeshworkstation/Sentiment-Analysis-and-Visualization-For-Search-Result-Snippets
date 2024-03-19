import React from 'react';
import { ReactComponent as EmailIcon } from './email.svg';

export default function CheckEmail() {
  return (
    <div className='container text-center text-white'>
      <EmailIcon />
      <h3>Signup Successful</h3>
      <p>Please Check your email to activate your account and Login!</p>
    </div>
  );
}
