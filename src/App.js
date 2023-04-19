import './App.css';
import DataGridView from './pages/DataGridView';
import LoadFile from './pages/LoadFile';
import React from 'react';

function App() {
  const [columnLister, setColumnLister] = React.useState()
  const [content, setContent] = React.useState(null);

  return (
    <div className="App">
     <LoadFile setColumnLister={setColumnLister} setContent={setContent} />
      <DataGridView columnLister={columnLister} content={content} />
    </div>
  );
}

export default App;
