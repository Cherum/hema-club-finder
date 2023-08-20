import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function GroupList() {
    const [sortedGroups, setSortedGroups] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

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

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }

        const sorted = [...sortedGroups].sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });

        setSortedGroups(sorted);
    };

    const getSortIndicator = (column) => {
        if (column === sortColumn) {
            return sortOrder === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <div style={{ width: '40%', height: '80%', float: 'left', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ flexShrink: 0 }}>HEMA Gruppen Deutschland</h2>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} style={{ width: '40%' }}>
                                Name {getSortIndicator('name')}
                            </th>
                            <th onClick={() => handleSort('city')} style={{ width: '20%' }}>
                                Stadt {getSortIndicator('city')}
                            </th>
                            <th onClick={() => handleSort('state_long')} style={{ width: '20%' }}>
                                Bundesland {getSortIndicator('state_long')}
                            </th>
                            <th style={{ width: '20%', textAlign: 'right' }}>Links</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedGroups.map(group => (
                            <tr key={group.id}>
                                <td>{group.name}</td>
                                <td>{group.city}</td>
                                <td>{group.state_long}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {group.website ? (
                                        <a href={group.website} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'house' })} />
                                        </a>
                                    ) : ''}

                                    {group.facebook ? (
                                        <a href={group.facebook} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'facebook', style: 'brands' })} />
                                        </a>
                                    ) : ''}

                                    {group.youtube ? (
                                        <a href={group.youtube} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'youtube', style: 'brands' })} color='red' />
                                        </a>
                                    ) : ''}

                                    {group.instagram ? (
                                        <a href={group.instagram} target="_blank" rel="noopener noreferrer">
                                            <FontAwesomeIcon icon={icon({ name: 'instagram', style: 'brands' })} color='red' />
                                        </a>
                                    ) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default React.memo(GroupList);
