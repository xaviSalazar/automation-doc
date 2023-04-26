import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

const SelectFile = (pathname, setColumnLister, setContent, filesArray) => {

    const regexPathname = /\/([^\/]+)$/;
    const fileMatch = pathname.match(regexPathname);
    // match element
    const fname = fileMatch[1]

    const fileT = filesArray.filter((file) => {
      if (file.name === fname) 
        return file
    })
  
    const obj = fileT[0]

    if (typeof obj === "undefined") return;
    const content = obj.content

    console.log(obj)

    setContent(content);
    // random delimiter to not generate a template ?? found it like that 
    if (obj) var doc = new Docxtemplater(new PizZip(content), {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});
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

export default SelectFile;

  
