import React, {useState} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input'
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';

  const AutocompleteSearchBox = (props) => {
    const [value, setValue] = useState("");
    const [coordinates, setCoordinates] = useState({lat: null, lng: null})
     
    const gotCoords = (hometown, {lat, lng}) => {
        console.log({lat, lng});
        setCoordinates({lat, lng});
        props.setCoords({lat, lng});
        props.setHometown(hometown);
    }
    // const handleSelect = async value => { console.log(value)};
    const handleSelect = async address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => gotCoords(address, { lat, lng }))
            .catch(error => console.error('Error', error));
        setValue(address);
    };


    // useEffect(() => {
    //     //check if we have already loaded the maps api before loading
    //     if (typeof window.google !== 'object' || typeof window.google.maps !== 'object') {
    //         const googleMapScript = document.createElement('script');
    //         googleMapScript.async = true;
    //         googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${Google_Maps_API_Key}&libraries=places&callback=autocompleteCallback`;
    //         window.document.body.appendChild(googleMapScript);

    //         // googleMapScript.onload = () =>{
    //         //     return null;
    //         // }
    //     }
    // });

    return (
        <React.Fragment>
        <div>
            <PlacesAutocomplete
                value = {value}
                onChange = {setValue}
                onSelect = {handleSelect}
                googleCallbackName="autocompleteCallback"
                >
            {({getInputProps, suggestions, getSuggestionItemProps, loading}) =>
                <div>
                    <Input inputProps={getInputProps({
                        placeholder: 'Add your location',
                    })}
                    />
                    <div>
                    {loading && <ListItem><ListItemText primary={"Loading..."} /></ListItem>}
                    {suggestions.map(suggestion => {
                        const style = {
                            position: "relative",
                            textAlign: "center",
                            zIndex: "2100",
                            backgroundColor: suggestion.active ? "#f29c2b" : "#f5f4e8"
                        };
                        return <ListItem button {...getSuggestionItemProps(suggestion, {style})}>
                            <ListItemText primary={suggestion.description} />
                        </ListItem>;
                    })}
                    </div>
                </div>}
            </PlacesAutocomplete>
        </div>
        </React.Fragment>
    )
    
  }
export default AutocompleteSearchBox;