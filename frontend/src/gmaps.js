import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { env } from './next.conf.js';

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

    const [selectedGroup, setSelectedGroup] = useState(null);

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
        googleMapsApiKey: env.GOOGLE_API_KEY
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

    const handleMarkerClick = (group) => {
        setSelectedGroup(group);
    };

    const handleInfoWindowClose = () => {
        setSelectedGroup(null);
    };

    // Define marker icons with different colors based on state_short value
    const markerColors = {
        BW: 'FF5733',   // Baden-Württemberg
        HE: 'FFC300',   // Hessen
        SL: '4CAF50',   // Saarland
        BY: '2196F3',   // Bayern
        TH: '9C27B0',   // Thüringen
        RP: 'E91E63',   // Rheinland-Pfalz
        NI: 'FF9800',   // Niedersachsen
        HH: '00BCD4',   // Hamburg
        BE: '673AB7',   // Berlin
        SH: '3F51B5',   // Schleswig-Holstein
        MV: 'FFEB3B',   // Mecklenburg-Vorpommern
        BB: 'CDDC39',   // Brandenburg
        ST: 'FF5722',   // Sachsen-Anhalt
        SN: '795548',   // Sachsen
        NW: '607D8B',   // Nordrhein-Westfalen
        HB: '009688',   // Bremen
    };


    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
        >
            {groups.map(group => (
                <Marker
                    key={group.id}
                    position={{ lat: group.latitude, lng: group.longitude }}
                    title={group.name}
                    onClick={() => handleMarkerClick(group)}
                    icon={`https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-pin-container_4x.png,icons/onion/1899-blank-shape_pin_4x.png&highlight=${markerColors[group.state_short]},ff000000&scale=1.0`}

                    optimized={true}
                >
                    {selectedGroup === group && (
                        <InfoWindow onCloseClick={handleInfoWindowClose}>
                            <table>
                                <tbody>
                                    <tr>
                                        <th colSpan={2}><h2>{group.name}</h2></th>
                                    </tr>
                                    <tr>
                                        <td><b>Adresse:</b></td>
                                        <td>
                                            {group.street ? `${group.street}, ${group.city}` : `${group.city}`} ({group.state_long})
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Website:</b></td>
                                        <td>
                                            {group.website ? (
                                                <a href={group.website} target="_blank" rel="noopener noreferrer">
                                                    {group.website}
                                                </a>
                                            ) : (
                                                'Keine Website bekannt'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Facebook:</b></td>
                                        <td>
                                            {group.facebook ? (
                                                <a href={group.facebook} target="_blank" rel="noopener noreferrer">
                                                    {group.facebook}
                                                </a>
                                            ) : (
                                                'Kein Facebook bekannt'
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>DDHF Mitglied:</b></td>
                                        <td>{group.federation_member ? 'Ja' : 'Nein'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </InfoWindow>
                    )}
                </Marker>
            ))}
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)