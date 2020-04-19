import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Google_Maps_API_Key } from '../../apiKey.js';
import {StandardPin} from '../PostPins/StandardPostPin.jsx';
import { getNearbyPosts } from '../../postBackEnd.js';
import {makeStyles} from '@material-ui/core/styles';
import { Fab, Snackbar } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {currentUserObj} from '../../signIn.js';

const useStyles = makeStyles(theme => ({
    postButton: {
      position: "fixed",
      zIndex: "999",
      bottom: "2em",
      left: "1em",
    },
    confirmButton: {
        position: "fixed",
        zIndex: "999",
        bottom: "2em",
        right: "4em",
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }));

const calcRange = (highBound, lowBound) => {
    return 1.1*(Math.abs(highBound) - Math.abs(lowBound))/2
}

const CSMap = (props) => {
    const classes = useStyles();
    const [posts, setPosts] = React.useState([]);
    const initCenter = props.signedIn? [currentUserObj.hometownLat, currentUserObj.hometownLong] : [38.9543,-95.2558];
    const [geocoder, setGeocoder] = React.useState(null);
    const [markerShown, setMarkerShown] = React.useState(false);
    const [markerLatLng, setMarkerLatLng] = React.useState([]);
    const [snackbarOpen, setSnackbar] = React.useState(true);
    const apiIsLoaded = (map, maps) => {
        setGeocoder(new maps.Geocoder);
    }

    async function fetchPosts(center, range) {
        const newPosts = await getNearbyPosts(center.lat, center.lng, range);
        setPosts(newPosts);
    }

    const handleBoundsChange = ({center, zoom, bounds, marginbounds}) => {
        if (zoom > 7){
            const range = calcRange(bounds.nw.lng, bounds.ne.lng);
            fetchPosts(center, range);
            console.log(posts);
        }
    }

    const handleSnackbarClose = () => {
        setSnackbar(false);
    }

    const handleMapClick = ({x, y, lat, lng, event}) => {
        if(props.postingMode){
            setMarkerShown(true);
            setMarkerLatLng([lat,lng]);

        }
    }
    
    async function handleConfirm() {
        
        await geocoder.geocode({'location': {lat: markerLatLng[0], lng: markerLatLng[1]}}, function(results, status) {
            if(status === 'OK'){
                if(results[0]){
                    props.setLocation(results[0].formatted_address);
                }
            }
        });
        props.setCoordinates({lat: markerLatLng[0], lng: markerLatLng[1]});
        setMarkerShown(false);
        props.setPostCreateDialog(true);
        props.setPostingMode(false);
    }
    return(
        <React.Fragment>
        <div style = {{height: '92vh', width: '100%'}}>
        <GoogleMapReact
            onClick = {handleMapClick}
            bootstrapURLKeys={{ key: Google_Maps_API_Key}}
            defaultCenter={initCenter}
            defaultZoom={11}
            onChange={handleBoundsChange}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map,maps }) => apiIsLoaded(map,maps)}
        >
            {!props.postingMode && posts.map(postObj =>(
                <StandardPin 
                    key={postObj.postID}
                    lat={postObj.lat}
                    lng={postObj.long}
                    postObj={postObj}
                />
            ))}
            {props.postingMode && markerShown && <StandardPin lat={markerLatLng[0]} lng={markerLatLng[1]} /> }

        </GoogleMapReact>
        </div>
        {props.postingMode &&
            <Snackbar 
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            autoHideDuration={6000}
            message={"Choose a location, then hit Confirm!"}
            action={
            <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
            }

            />
        }

        {props.postingMode && <Fab
            className={classes.confirmButton}
            color="primary"
            onClick={handleConfirm}
            variant="extended"
        >
            <CreateIcon className={classes.extendedIcon}/> Confirm
        </Fab>}
        </React.Fragment>
    );
}

export default CSMap;
