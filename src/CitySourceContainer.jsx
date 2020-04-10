import React from 'react';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import PostCreate from './components/PostCreate/PostCreate';
import HometownModal from './components/HometownModal/HometownModal.jsx';

import PostViewModal from './components/Post/PostViewModal.jsx'
import { currentUserObj } from './signIn.js';

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

function CitySourceContainer(props) {
  const classes = useStyles();
  const [postCreateDialog, setPostCreateDialog] = React.useState(false);

  const isUserObj = () => (currentUserObj.userID !== "");

  const [signedIn, setSignedIn] = React.useState(isUserObj());
  let signedInVar = isUserObj();

  setInterval(() => {
    if (signedInVar !== isUserObj()) {
      setSignedIn(isUserObj());
      signedInVar = !(signedInVar);
    }
  }, 500);

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
      <HometownModal open={false} />
    </React.Fragment>
  );
}

export default CitySourceContainer;
