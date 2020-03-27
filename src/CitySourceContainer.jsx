import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';
import HometownModal from './components/HometownModal/HometownModal.jsx';

const CitySourceContainer = () => {
  return (
    <React.Fragment>
      <Navbar login={false} current="index"/>
      <CSMap />
      <HometownModal open={true} />
    </React.Fragment>
  );
}

export default CitySourceContainer;
