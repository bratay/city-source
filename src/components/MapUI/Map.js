import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import * as firebase from 'firebase/app';
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

class CSMap extends Component {
    //TODO: obtain initial lat long from user coords
    static defaultProps = {
        center: {
            lat: 38.9543,
            lng: -95.2558
        },
        zoom: 11
    };

    render() {
        return(
            <div style = {{height: '92vh', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: Google_Maps_API_Key }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
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
        );
    }
}

//returns a geopoint object
export function getHometownCoor(hometown){
    var geoPointResult = new firebase.firestore.GeoPoint( 0, 0)

    return geoPointResult
}

export default CSMap;
