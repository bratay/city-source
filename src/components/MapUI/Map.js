import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Google_Maps_API_Key } from '../../apiKey.js'


//TODO: we will need to create markers for each post type. Markers
//      are just divs that are rendered at specific lat longs on
//      the map.
/*const simpleMarker = ({ text }) => (
    <div style={{
      color: 'white',
      background: 'grey',
      padding: '15px 10px',
      display: 'inline-flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '100%',
      transform: 'translate(-50%, -50%)'
    }}>
      {text}
    </div>
  );
*/

const CSMap = () => {
    //TODO: obtain initial lat long from user coords
    const [initCenter, setCenter] = React.useState([38.9543,-95.2558]);
    const [initZoom, setZoom] = React.useState(11);

    return(
        <React.Fragment>
        <div style = {{height: '92vh', width: '100%'}}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: Google_Maps_API_Key}}
            defaultCenter={initCenter}
            defaultZoom={initZoom}
            // yesIWantToUseGoogleMapApiInternals
            // onGoogleApiLoaded={({ map,maps }) => apiIsLoaded(map,maps)}
        >
            {/* TODO: this is where we'd include markers
            <simpleMarker
                lat={38.9543}
                lng={-95.2558}
                text={'KU test marker'}
            />
            */}
        </GoogleMapReact>
        </div>
        </React.Fragment>
    );
}

export default CSMap;
