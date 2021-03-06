import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Modal, Typography } from '@material-ui/core'
import {currentUserObj, saveHometown} from '../../signIn';
import AutocompleteSearchBox from '../MapUI/AutocompleteSearchBox.jsx';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles(theme => ({
    paper: {
      position: 'absolute',
      width: 500,
      height: 240,
      backgroundColor: theme.palette.background.paper,
      borderRadius: '25px',
      outline: 'none',
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      '& > *': {
        // position: 'absolute',
        // margin: theme.spacing(1),
        paddingTop: theme.spacing(2),
      },
    },
    title: {
      flexGrow: 1,
      fontFamily: 'sans-serif',
      userSelect: 'none',
      color: "inherit",
    },
}));


const HometownModal = (props) => {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(props.open);
    const [coordinates, setCoordinates] = useState({lat: null, lng: null});
    const [hometownStr, setHometownStr] = useState("");
  
    useEffect(() => {
      setOpen(props.open)
    }, [props.open])

    if(currentUserObj.userID === "" || currentUserObj.hometown !== ""){
        return null;
    }

    const confirmHometown = () =>{
        if (coordinates == null || hometownStr == null) {
            return null;
        } else{
            saveHometown(hometownStr, coordinates.lat, coordinates.lng);
            setOpen(false);
        }
    }

    const modal = 
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={open}
              onClose={() => {setOpen(false);}}
            >
              <div style={modalStyle} className={classes.paper}>
                <Typography variant="h4" className={classes.title} style={{textAlign: "center", paddingTop: "2%", color: "#F06E38"}}>
                    SELECT YOUR HOMETOWN
                </Typography>
                <div style={{position: "absolute", zIndex: "2100", textAlign: "center", paddingLeft: "25%", paddingRight: "25%", paddingTop: "2%"}}>
                    <AutocompleteSearchBox setCoords={setCoordinates} setHometown={setHometownStr} inputProps={{placeholder: 'Add your location',}}/>
                </div>
                <div style={{position: "absolute", zIndex: "2000", textAlign: "center", paddingLeft: "35%", paddingTop: "15%"}}>
                 <Button variant="contained" style={{backgroundColor: "#F06E38", color: "white"}} onClick={confirmHometown}>
                    Confirm
                 </Button>
              </div>
              </div>
            </Modal>
          </Grid>
        </Grid>
      ;
  
    return modal;
  }
  
  export default HometownModal;
  