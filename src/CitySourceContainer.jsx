import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';

const CitySourceContainer = () => {

  let signedIn = false;

  return (
    <React.Fragment>
      <Navbar login={signedIn}/>
      <CSMap />
    </React.Fragment>
  );
}

export default CitySourceContainer;
