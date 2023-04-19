import './App.css';
import DataGridView from './pages/DataGridView';
import LoadFile from './pages/LoadFile';
import React from 'react';

function App() {
  const [columnLister, setColumnLister] = React.useState()
  const [content, setContent] = React.useState(null);

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

     <LoadFile setColumnLister={setColumnLister} setContent={setContent} />
      <DataGridView columnLister={columnLister} content={content} />
    </div>
  );
}

export default App;
