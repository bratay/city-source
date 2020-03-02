import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';
import ProfileEdit from './components/Profiles/ProfileEdit.jsx';

const CitySourceContainer = () => {
  return (
    <React.Fragment>
      <Navbar login={true} current="index"/>
      <CSMap />
      <ProfileEdit/>
    </React.Fragment>
  );
}

export default CitySourceContainer;
