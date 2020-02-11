import React from 'react';
import SignInModal from './SignInModal.jsx';

const SignInModalContainer = () => {
  console.log("Sign in modal container\n");
  return(
    <React.Fragment>
      {SignInModal()}
    </React.Fragment>
  );
}

export default SignInModalContainer
