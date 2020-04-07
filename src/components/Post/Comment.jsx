import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Avatar,
         ListItem,
         ListItemText } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
 name: {
   padding: theme.spacing(0, 1, 1),
 },
}));

const Comment = (props) => {

  const classes = useStyles();

  const postId = props.postId

  return (
    <ListItem button>
      <Avatar/>
      <ListItemText
        primary="Mary Smith"
        secondary={"Cool idea!"}
        className={classes.name}
      />
    </ListItem>
  );
}

export default Comment;
