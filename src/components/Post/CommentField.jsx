import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { createComment } from '../../commentBackEnd.js';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const CommentField = (props) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <InputBase
        className={classes.input}
        placeholder="Add comment"
        inputProps={{ 'aria-label': 'add comment'}}
        fullWidth
        multiline
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <ChevronRightIcon />
      </IconButton>
    </React.Fragment>
  );
}

export default CommentField
