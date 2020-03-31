import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import PostCreate from './components/PostCreate/PostCreate';

const useStyles = makeStyles(theme => ({
  postButton: {
    position: "fixed",
    zIndex: "999",
    bottom: "2em",
    left: "1em",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const CitySourceContainer = () => {
  const classes = useStyles();
  const [postCreateDialog, setPostCreateDialog] = React.useState(false);

  let signedIn = false;

  return (
    <React.Fragment>
      <Navbar login={signedIn}/>
      <Fab 
      className={classes.postButton} 
      color="secondary"
      onClick={() => {setPostCreateDialog(true);}}
      variant="extended" 
      >
        <CreateIcon className={classes.extendedIcon}/> Create Post
      </Fab>
      <PostCreate open={postCreateDialog} action={setPostCreateDialog}/>
      <CSMap />
    </React.Fragment>
  );
}

export default CitySourceContainer;
