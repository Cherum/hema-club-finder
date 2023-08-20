import './App.css';
import MyComponent from './gmaps.js';
import GroupList from './group_list.js';
import Menu from './menu.js';

function App() {
  return (
    <div className="App">
      <Menu />
      <GroupList />
      <MyComponent />
    </div>
  );
}

export default App;
