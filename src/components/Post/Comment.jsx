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

  const local = props.local;
  const username = props.username
  const userID = props.userID
  const commentText = props.commentText

  const [comments, setComments] = React.useState([])

  const comment = (
    <ListItem button>
      <ListItemText
        primary={username}
        secondary={commentText}
        className={classes.name}
      />
    </ListItem>
  );

  return (
    <React.Fragment>
      {comment}
    </React.Fragment>
  );
}

export default Comment;
