import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Avatar,
         ListItem,
         ListItemText } from '@material-ui/core'

import { getCommentsFromPost } from '../../commentBackEnd.js';

import ProfileView from '../Profiles/ProfileView';

const useStyles = makeStyles(theme => ({
 name: {
   padding: theme.spacing(0, 1, 1),
 },
}));

const Comment = (props) => {

  const classes = useStyles();

  const local = props.local;
  const localComment = props.localComment;
  const username = props.username;
  const userID = props.userID;
  const commentText = props.commentText;

  const [comments, setComments] = React.useState([]);
  const [openProfile, setOpenProfile] = React.useState(false);

  const comment = (local == localComment) ? (
    <ListItem button onClick={() => {setOpenProfile(true)}}>
      <ListItemText
        primary={username}
        secondary={commentText}
        className={classes.name}
      />
    </ListItem>
  ) : null;

  const profile = openProfile ? (
    <ProfileView open={openProfile} action={setOpenProfile} userId={userID}/>
  ) : null;

  return (
    <React.Fragment>
      {comment}
      {profile}
    </React.Fragment>
  );
}

export default Comment;
