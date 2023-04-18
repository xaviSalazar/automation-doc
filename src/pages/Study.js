import React from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

export default function Study() {

  const showFile = async (e) => {
    console.log('showfile', e)
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      var doc = new Docxtemplater(new PizZip(content), {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});
      var text = doc.getFullText();
      console.log(text)

      const regex = /\{(\w+)\}/g;
      const matches = text.match(regex).map(match => match.slice(1, -1));

      console.log(matches);
    };
    reader.readAsBinaryString(e.target.files[0]);
  };

  return (
    <div className="App">
      <div style={{ flex: 1 }}>
          <input type="file" onChange={(e) => showFile(e)} />
      </div>
    
    </div>
  );
}