import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
    width: '80%',
    height: '80%'
};

const center = {
    lat: 51.1657,
    lng: 10.4515
};


function MyComponent() {
    console.log('MyComponent');
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        console.log('Fetching groups...');
        axios.get('http://localhost:3000/group')
            .then(response => {
                console.log('Groups:', response.data);

                setGroups(response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyB7tLUvq-NIpcEUNLM6jb0dKSdXug2BgMU"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={7}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {groups.map(group => (
                <Marker
                    key={group.id}
                    position={{ lat: group.latitude, lng: group.longitude }}
                />
            ))}
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)