import React from 'react';
import ProfileItem from './ProfileItem.jsx';

const ProfileList = (props) => {

  const results = props.resultsList;

  const profilelist = results.map((user) =>
    <ProfileItem url={user.picUrl} name={user.username} id={user.userID}/>
  );

  return profilelist;
}

export default ProfileList;
