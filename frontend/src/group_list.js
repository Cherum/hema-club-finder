import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [sortedGroups, setSortedGroups] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        console.log('Fetching groups...');
        axios.get('http://localhost:3000/group')
            .then(response => {
                console.log('Groups:', response.data);
                setGroups(response.data);
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
        <div style={{ width: '20%', height: '80%', float: 'left', maxHeight: '80%', overflowY: 'auto' }}>
            <h2>Group List</h2>
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>
                            Name {getSortIndicator('name')}
                        </th>
                        <th onClick={() => handleSort('city')}>
                            Stadt {getSortIndicator('city')}
                        </th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedGroups.map(group => (
                        <tr key={group.id}>
                            <td>{group.name}</td>
                            <td>{group.city}</td>
                            <td>
                                <a href={group.website} target="_blank" rel="noopener noreferrer">WS</a>&nbsp;
                                <a href={group.facebook} target="_blank" rel="noopener noreferrer">FB</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default React.memo(GroupList);
