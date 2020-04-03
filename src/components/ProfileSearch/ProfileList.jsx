import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';

import ProfileItem from './ProfileItem.jsx';

import { dynamicProfileSearch } from '../../profileSearch.js';
import { profileSearchList } from '../../profileSearch.js';

const ProfileList = (props) => {

  let list = [];

  const createListItem = (value) => {
    list += (<ProfileItem avatar={value.picUrl}  name={value.username}/>);
  }

  profileSearchList.forEach(createListItem);

  console.log(profileSearchList)

  return list;
}

export default ProfileList;
