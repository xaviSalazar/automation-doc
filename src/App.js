import './App.css';
import DataGridView from './pages/DataGridView';
import Study from './pages/Study';

function App() {
  return (
    <div className="App">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      {/* <Example /> */}

     <Study />
      <DataGridView />
    </div>
  );
}

export default App;
