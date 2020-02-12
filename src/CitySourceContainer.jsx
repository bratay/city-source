import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './Map.js';

const CitySourceContainer = () => {
  return (
    <React.Fragment>
      <Navbar login={false} current="index"/>
      <CSMap />
    </React.Fragment>
  );
}

export default CitySourceContainer;
