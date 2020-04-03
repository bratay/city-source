import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar,
         ListItem,
         ListItemText } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  name: {
    padding: theme.spacing(2),
  },
}));

const ProfileItem = (props) => {

  const classes = useStyles();

  const name = props.name;

  const item = (
    <ListItem button>
      <Avatar/>
      <ListItemText className={classes.name} primary={name} />
    </ListItem>
  );

  return item;
}

export default ProfileItem;