import './App.css';
import React, { useState } from 'react';
import MapComponent from './gmaps.js';
import GroupList from './group_list.js';
import Menu from './menu.js';

function App() {
  const [selectedGroups, setSelectedGroups] = useState('');
  const [highlightedGroup, setHighlightedGroup] = useState('');

  return (
    <div className="App">
      <Menu />
      <GroupList setSelectedGroups={setSelectedGroups} highlightedGroup={highlightedGroup} />
      <MapComponent selectedGroups={selectedGroups} setHighlightedGroup={setHighlightedGroup} />
    </div>
  );
}

export default App;
