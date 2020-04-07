import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar,
         ListItem,
         ListItemText } from '@material-ui/core';
import ProfileView from '../Profiles/ProfileView.jsx';

const useStyles = makeStyles(theme => ({
  name: {
    padding: theme.spacing(2),
  },
}));

const ProfileItem = (props) => {

  const classes = useStyles();

  const name = props.name;
  const url = props.url;
  const id = props.userID;

  const [openProfile, setOpenProfile] = React.useState(false);

  const item = (
    <ListItem button onClick={() => {setOpenProfile(true)}}>
      <Avatar src={url}/>
      <ListItemText className={classes.name} primary={name} />
    </ListItem>
  );

  const profile = openProfile ? (
    <ProfileView open={openProfile} action={setOpenProfile} userId={id}/>
  ) : null;

  return (
    <React.Fragment>
      {item}
      {profile}
    </React.Fragment>
  );
}

export default ProfileItem;
