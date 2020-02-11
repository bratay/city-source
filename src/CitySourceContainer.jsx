import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './Map.js'
import SignInModal from './components/SignInModal/SignInModal.jsx'

const CitySourceContainer = () => {
  return (
    <React.Fragment>
      <Navbar login={false} current="index"/>
      <SignInModal />
      <CSMap />
    </React.Fragment>
  );
}

export default CitySourceContainer;
