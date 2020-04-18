import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Avatar,
         ListItem,
         ListItemText } from '@material-ui/core'

import { getCommentsFromPost } from '../../commentBackEnd.js';

const useStyles = makeStyles(theme => ({
 name: {
   padding: theme.spacing(0, 1, 1),
 },
}));

const Comment = (props) => {

  const classes = useStyles();
  const postID = props.postID;
  const local = props.local;

  let comments = []

  async function getComments(comments) {
    if (postID != null){
      comments = getCommentsFromPost(postID);
    }
  };

  getComments(comments);

  function isLocal(comment) {
    return(comment.local)
  }

  function isNotLocal(comment) {
    return(!comment.local)
  }

  const commentsList = comments.map((comment) =>
    <ListItem button>
      <Avatar/>
      <ListItemText
        primary={comment.userID}
        secondary={comment.comment}
        className={classes.name}
      />
    </ListItem>
  );

  const localComments = commentsList.filter(isLocal);
  const nonLocalComments = commentsList.filter(isNotLocal);

  const c = local ? localComments : nonLocalComments;

  return (
    <React.Fragment>
      {c}
    </React.Fragment>
  );
}

export default Comment;
