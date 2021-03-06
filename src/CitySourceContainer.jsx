import React from 'react';
import * as firebase from 'firebase/app';
import Navbar from './Navbar.js';
import CSMap from './components/MapUI/Map.js';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SignInModal from "./components/SignInModal/SignInModal";
import CreateIcon from '@material-ui/icons/Create';
import PostCreate from './components/PostCreate/PostCreate';
import HometownModal from './components/HometownModal/HometownModal.jsx';
import PostViewModal from './components/Post/PostViewModal.jsx';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { currentUserObj, cachedSignIn } from './signIn.js';

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
  const [signInModal, setSignInModal] = React.useState(false);
  const [location, setLocation] = React.useState("");
  const [coordinates, setCoordinates] = React.useState({lat: null, lng: null});
  const [postingMode, setPostingMode] = React.useState(false);
  const isUserObj = () => (currentUserObj.userID !== "");

  const [signedIn, setSignedIn] = React.useState(isUserObj());
  let signedInVar = isUserObj();

  setInterval(() => {
    if (signedInVar !== isUserObj()) {
      setSignedIn(isUserObj());
      signedInVar = !(signedInVar);
    }
  }, 500);

  React.useEffect(() => {
    async function checkCache() {
      let inCache = await cachedSignIn();
      setSignedIn(inCache);
    }
    checkCache();
  }, []);

  return (
    <React.Fragment>
      <Navbar login={signedIn}/>
      {!postingMode && <Fab
      className={classes.postButton}
      color="secondary"
      onClick={() => {
        if (signedIn) {
                    setPostingMode(true);
                }
                else {
                    setSignInModal(true);
                }
            }}
            variant="extended"
        >
            <CreateIcon className={classes.extendedIcon}/> Create Post
          </Fab> }
      {postingMode && <Fab
      className={classes.postButton}
      color="secondary"
      onClick={() => {
        setPostingMode(false);
      }}
        variant="extended"
      >
          <ArrowBackIcon className={classes.extendedIcon}/> Return
      </Fab>}
      <PostCreate open={postCreateDialog} action={setPostCreateDialog} initLoc={location} initCoords={coordinates}/>
      <CSMap setLocation={setLocation} setCoordinates={setCoordinates} postingMode={postingMode} setPostingMode={setPostingMode} signedIn={signedIn} setPostCreateDialog={setPostCreateDialog}/>
      <HometownModal open={true} />
      <SignInModal open={signInModal} action={setSignInModal} />
    </React.Fragment>
  );
}

export default CitySourceContainer;
