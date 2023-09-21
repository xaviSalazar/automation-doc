import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

// types of files inside a docx
const xmlTypes = {
  document: "word/document.xml",
  foot: "word/footer1.xml",
  head: "word/header1.xml"
}

// check errors when single document does not contain variables inside { }
// also check header, footer and body separated (checks if header or footer or body not existant)
const checkFiles = (doc, zip) => {

  let matchDoc, matchHeading, matchFooter = null
  // matches all words inside { }
  // const regex = /\{(\p{L}+\p{M}*)+\}/gu;
  // const regex = /\{(\p{L}+\p{M}*\d+)\}/gu
  const regex = /{([a-zA-ZñáéíóúÁÉÍÓÚ0-9]+)}/g

  const document = zip.files[xmlTypes['document']]
  const header = zip.files[xmlTypes['head']]
  const footer = zip.files[xmlTypes['foot']]

  if(typeof document !== "undefined")
  {
    // matchDoc = doc.getFullText().match(regex).map(match => match.slice(1, -1));
    const bodyText = doc.getFullText()
    // still undefined when no existing words with { }
    matchDoc = bodyText.match(regex)?.map(match => match.slice(1, -1));
  }

  if (typeof header !== "undefined")
  {
    const headText = doc.getFullText(xmlTypes['head'])
    // still undefined when no existing words with { }
    matchHeading = headText.match(regex)?.map(match => match.slice(1, -1));
  }

  if (typeof footer !== "undefined")
  {
    const footText = doc.getFullText(xmlTypes['foot'])
    // still undefined when no existing words with { }
    matchFooter = footText.match(regex)?.map(match => match.slice(1, -1));
  }

  console.log("document -> ", matchDoc)
  // console.log("header -> ", matchHeading)
  // console.log("footer -> ", matchFooter)

  // useful to concatenate only existing Arrays
  // For better stability in filtering, rather than using a blacklist (not null),
  // use a whitelist (Array.isArray) to ensure only arrays are combined.
  const concat = (...arrays) => [].concat(...arrays.filter(Array.isArray));
  const unique = (array) => [...new Set(array)];

  const concatenated = concat(matchDoc, matchHeading, matchFooter)

  console.log("concatenated -> ", concatenated)

  const uniqueWords = unique(concatenated)

  return uniqueWords;
}

const SelectFile = (base64Content, setColumnLister, setContent, filesArray) => {

    // match name after "/"
    // eslint-disable-next-line
    // const regexPathname = /\/([^\/]+)$/;
    // // name after the /templates/nameFile.docx
    // const urlFileName = pathname.match(regexPathname).pop();
    // console.log(urlFileName)

    // create local variable for array 
    // const modifiableArray = JSON.parse(JSON.stringify(filesArray))
    // // function to match the pathname
    // function removeValue(value, index, arr) {
    //   if(value.id === docId) {
    //     arr.splice(index,1);
    //     return true;
    //   }
    //   return false;
    // }

    // filter from list of files
    // const fileExists = modifiableArray.filter(removeValue).pop()
    // console.log(fileExists)

    // if(typeof fileExists === "undefined") return;
    const content = new Uint8Array(atob(base64Content).split('').map(char => char.charCodeAt(0)))
    // set content (this is the editable content)
    setContent(content);
    // create a new pizzip
    const zip = new PizZip(content)
    // random delimiter to not generate a template ?? found it like that 
    // var doc = new Docxtemplater(new PizZip(content), {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});
    var doc = new Docxtemplater( zip, {delimiters: {start: '12op1j2po1j2poj1po', end: 'op21j4po21jp4oj1op24j'}});

    const uniqueWords = checkFiles(doc, zip);
    setColumnLister({columns: uniqueWords, fileName: "editando"});
};

export default SelectFile;

  
