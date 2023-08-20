import './App.css';
import React, { useState } from 'react';
import MapComponent from './gmaps.js';
import GroupList from './group_list.js';
import Menu from './menu.js';

function App() {
  const [selectedGroups, setSelectedGroups] = useState('');

  return (
    <div className="App">
      <Menu />
      <GroupList setSelectedGroups={setSelectedGroups} />
      <MapComponent selectedGroups={selectedGroups} />
    </div>
  );
}

export default App;
