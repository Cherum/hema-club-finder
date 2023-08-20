import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import { env } from './next.conf.js';
import { markerColors } from './map.colors.js';

const containerStyle = {
    width: '70%',
    height: '90%'
};

const center = { // Center of Germany
    lat: 51.1657,
    lng: 10.4515
};


function MapComponent({ selectedGroups, setHighlightedGroup }) {
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

    const handleMarkerClick = (group) => {
        setSelectedGroup(group);
        setHighlightedGroup(group);
    };

    const handleInfoWindowClose = () => {
        setSelectedGroup(null);
        setHighlightedGroup(null);
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
                    visible={selectedGroups.length === 0 || selectedGroups.some(selectedGroup => selectedGroup.id === group.id)}
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

export default React.memo(MapComponent)