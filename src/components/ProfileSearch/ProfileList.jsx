import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';

import ProfileItem from './ProfileItem.jsx';

import { dynamicProfileSearch } from '../../profileSearch.js';
import { profileSearchList } from '../../profileSearch.js';

const ProfileList = (props) => {

  const results = props.resultsList;

  const profilelist = results.map((user) =>
    <ProfileItem url={user.picUrl} name={user.username}/>
  );

  return profilelist;
}

export default ProfileList;
