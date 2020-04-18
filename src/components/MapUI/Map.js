import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Google_Maps_API_Key } from '../../apiKey.js';
import {StandardPin} from '../PostPins/StandardPostPin.jsx';
import { getNearbyPosts } from '../../postBackEnd.js';



const calcRange = (highBound, lowBound) => {
    return 1.1*(Math.abs(highBound) - Math.abs(lowBound))/2
}

const CSMap = () => {
    //TODO: obtain initial lat long from user coords
    const [initCenter, setCenter] = React.useState([38.9543,-95.2558]);
    const [initZoom, setZoom] = React.useState(11);
    const [postingMode, setPostingMode] = React.useState(false);
    const [posts, setPosts] = React.useState([]);

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

    const handleMapClick = ({x, y, lat, lng, event}) => {
        //if(postingMode){
            console.log({lat, lng, event});
        //}
    }

    const tempPost = {
        title: "Test Post",
        address: "KU",
        lat: 38.9543,
        long: -95.2558,
        postID: 9999,
        username: "Test User",
        text: "This is a test post to display the card & onclick",
    }



    return(
        <React.Fragment>
        <div style = {{height: '92vh', width: '100%'}}>
        <GoogleMapReact
            onClick = {handleMapClick}
            bootstrapURLKeys={{ key: Google_Maps_API_Key}}
            defaultCenter={initCenter}
            defaultZoom={initZoom}
            onChange={handleBoundsChange}
            // yesIWantToUseGoogleMapApiInternals
            // onGoogleApiLoaded={({ map,maps }) => apiIsLoaded(map,maps)}
        >
            {posts.map(postObj =>(
                <StandardPin 
                    key={postObj.postID}
                    lat={postObj.lat}
                    lng={postObj.long}
                    postObj={postObj}
                />
            ))}
            {/* <StandardPin
                lat={38.9543}
                lng={-95.2558}
                postObj = {tempPost}
                text={'KU test marker'}
            /> */}
            
        </GoogleMapReact>
        </div>
        </React.Fragment>
    );
}

export default CSMap;
