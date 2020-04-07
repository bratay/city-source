import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';
import HometownModal from './components/HometownModal/HometownModal.jsx';

import PostViewModal from './components/Post/PostViewModal.jsx'

const CitySourceContainer = () => {
  let signedIn = false;

  return (
    <React.Fragment>
      <Navbar login={signedIn}/>
      <CSMap />
      <HometownModal open={true} />
    </React.Fragment>
  );
}

export default CitySourceContainer;
