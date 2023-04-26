import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

const LoadFile = async (e, setColumnLister, setContent) => {
    // console.log('showfile', e)
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      setContent(content);
      // random delimiter to not generate a template ?? found it like that 
      var doc = new Docxtemplater(new PizZip(content), {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});
      // gets full text of document but ignores format and breaklines and paragraphs
      var text = doc.getFullText();
      console.log(text)
      // matches all words inside { }
      const regex = /\{(\w+)\}/g;
      // all matches passed to an array
      const matches = text.match(regex).map(match => match.slice(1, -1));
      // debug matches
      // console.log(matches)
      const uniqueWords = [...new Set(matches)]
      // console.log(uniqueWords);
      setColumnLister(uniqueWords);
    };
    reader.readAsBinaryString(e.target.files[0]);

  };

  export default LoadFile;

  
