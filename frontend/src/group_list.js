import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

function GroupList({ setSelectedGroups }) {
    const [sortedGroups, setSortedGroups] = useState([]);
    const [stadtFilters, setStadtFilters] = useState([]);
    const [bundeslandFilters, setBundeslandFilters] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');

    useEffect(() => {
        console.log('Fetching groups...');
        axios.get('http://localhost:3000/group')
            .then(response => {
                console.log('Groups:', response.data);
                setSortedGroups(response.data);
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    const toggleFilter = (column) => {
        if (selectedFilter === column) {
            setSelectedFilter('');
            setShowFilter(false);
        } else {
            setSelectedFilter(column);
            setShowFilter(true);
        }
    };

    const handleFilter = (filterValue) => {
        if (selectedFilter === 'city') {
            if (stadtFilters.includes(filterValue)) {
                setStadtFilters(stadtFilters.filter(filter => filter !== filterValue));
            } else {
                setStadtFilters([...stadtFilters, filterValue]);
            }
        } else if (selectedFilter === 'state_long') {
            if (bundeslandFilters.includes(filterValue)) {
                setBundeslandFilters(bundeslandFilters.filter(filter => filter !== filterValue));
            } else {
                setBundeslandFilters([...bundeslandFilters, filterValue]);
            }
        }
    };

    const filteredGroups = sortedGroups.filter(group => {
        const matchStadt = stadtFilters.length === 0 || stadtFilters.includes(group.city);
        const matchBundesland = bundeslandFilters.length === 0 || bundeslandFilters.includes(group.state_long);
        return matchStadt && matchBundesland;
    });
    useEffect(() => {
        console.log('filteredGroups changed', filteredGroups);
        setSelectedGroups(filteredGroups);

    }, [filteredGroups, setSelectedGroups]); // Only re-run the effect if selectedBundesland changes

    const getFilterIconColor = (column) => {
        return selectedFilter === column ? 'blue' : 'black';
    };

    return (
        <div style={{ width: '40%', height: '80%', float: 'left', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ flexShrink: 0 }}>HEMA Gruppen Deutschland</h2>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>
                                Name
                                <FontAwesomeIcon
                                    icon={icon({ name: 'search' })}
                                    style={{ marginLeft: '0.5rem', cursor: 'pointer', color: getFilterIconColor('name') }}
                                />
                            </th>
                            <th style={{ width: '20%' }}>
                                Stadt
                                <FontAwesomeIcon
                                    icon={icon({ name: 'filter' })}
                                    onClick={() => toggleFilter('city')}
                                    style={{ marginLeft: '0.5rem', cursor: 'pointer', color: getFilterIconColor('city') }}
                                />
                            </th>
                            <th style={{ width: '20%' }}>
                                Bundesland
                                <FontAwesomeIcon
                                    icon={icon({ name: 'filter' })}
                                    onClick={() => toggleFilter('state_long')}
                                    style={{ marginLeft: '0.5rem', cursor: 'pointer', color: getFilterIconColor('state_long') }}
                                />
                            </th>
                            <th style={{ width: '20%', textAlign: 'right' }}>Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGroups.map(group => (
                            <tr key={group.id}>
                                <td>{group.name}</td>
                                <td>{group.city}</td>
                                <td>{group.state_long}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {group.website && (
                                        <a href={group.website} target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem' }}>
                                            <FontAwesomeIcon icon={icon({ name: 'house' })} />
                                        </a>
                                    )}
                                    {group.facebook && (
                                        <a href={group.facebook} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'facebook', style: 'brands' })} style={{ marginRight: '0.5rem' }} />
                                        </a>
                                    )}
                                    {group.youtube && (
                                        <a href={group.youtube} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'youtube', style: 'brands' })} color='red' style={{ marginRight: '0.5rem' }} />
                                        </a>
                                    )}
                                    {group.instagram && (
                                        <a href={group.instagram} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'instagram', style: 'brands' })} color='red' style={{ marginRight: '0.5rem' }} />
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showFilter && (
                <div style={{ position: 'absolute', top: '50px', right: '10px', backgroundColor: 'white', border: '1px solid #ccc', padding: '10px', zIndex: 100 }}>
                    <h4>Filter: {selectedFilter === 'city' ? 'Stadt' : 'Bundesland'}</h4>
                    {selectedFilter === 'city' &&
                        Array.from(new Set(sortedGroups.map(group => group.city))).sort().map(city => (
                            <div
                                key={city}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => handleFilter(city)}
                            >
                                <input
                                    type="checkbox"
                                    checked={stadtFilters.includes(city)}
                                    readOnly
                                />
                                {city}
                            </div>
                        ))}
                    {selectedFilter === 'state_long' &&
                        Array.from(new Set(sortedGroups.map(group => group.state_long))).sort().map(state => (
                            <div
                                key={state}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => handleFilter(state)}
                            >
                                <input
                                    type="checkbox"
                                    checked={bundeslandFilters.includes(state)}
                                    readOnly
                                />
                                {state}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default React.memo(GroupList);
