import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

function GroupList({ setSelectedGroups, highlightedGroup }) {
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
        setSelectedGroups(filteredGroups);
    }, [filteredGroups, setSelectedGroups]); // Only re-run the effect if selectedBundesland changes

    const getFilterIconColor = (column) => {
        return selectedFilter === column ? 'blue' : 'black';
    };

    const generateSocialMediaLink = (iconName, link, color, icon) => {
        if (link) {
            return (
                <a key={iconName} href={link} target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem' }}>
                    <FontAwesomeIcon icon={icon} color={color} />
                </a>
            );
        }
        return null;
    };

    const generateSocialMediaLinks = (group) => {
        const socialMediaLinks = [];

        socialMediaLinks.push(generateSocialMediaLink('house', group.website, null, icon({ name: 'house' })));
        socialMediaLinks.push(generateSocialMediaLink('facebook', group.facebook, null, icon({ name: 'facebook', style: 'brands' })));
        socialMediaLinks.push(generateSocialMediaLink('youtube', group.youtube, 'red', icon({ name: 'youtube', style: 'brands' })));
        socialMediaLinks.push(generateSocialMediaLink('instagram', group.instagram, 'red', icon({ name: 'instagram', style: 'brands' })));

        return socialMediaLinks.filter(link => link !== null);
    };

    return (
        <div style={{ width: '30%', height: '90%', float: 'left', display: 'flex', flexDirection: 'column' }}>
            <div>
                <h2 style={{ flexShrink: 0 }}>HEMA Gruppen Deutschland</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>
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
                            <th style={{ width: '30%' }}>
                                Bundesland
                                <FontAwesomeIcon
                                    icon={icon({ name: 'filter' })}
                                    onClick={() => toggleFilter('state_long')}
                                    style={{ marginLeft: '0.5rem', cursor: 'pointer', color: getFilterIconColor('state_long') }}
                                />
                            </th>
                            <th style={{ width: '15%', textAlign: 'center' }}>Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGroups.map(group => (
                            <tr key={group.id} style={{ backgroundColor: highlightedGroup && highlightedGroup.id === group.id ? 'yellow' : 'transparent' }}>
                                <td><b>{group.name}</b></td>
                                <td>{group.city}</td>
                                <td>{group.state_long}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {generateSocialMediaLinks(group)}
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
