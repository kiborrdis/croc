import React from 'react';
import ApplicableInput from '../ApplicableInput';
import './Auth.css';

interface AuthProps {
  onAuth: (text: string) => void;
}

const Auth = (props: AuthProps) => (
  <div className='Auth'>
    <div className='Auth-title'>Enter your name</div>
    <ApplicableInput onApply={props.onAuth} />
  </div>
);

export default Auth;
