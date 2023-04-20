import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

// import copy from "copy-to-clipboard";  

// URL to saved file 
const filePath = 'https://d1d5i0xjsb5dtw.cloudfront.net/TemplateT.docx'
// const filePath = 'https://d1d5i0xjsb5dtw.cloudfront.net/AUTORIZACION_example.docx'

function readSource(content, valuesToChange, fileName, setBlob, download) {
            // return zip 
            const zip = new PizZip(content);
            
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
        
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render(valuesToChange);
            const blob = doc.getZip().generate({
                type: "blob",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            setBlob(blob);
            if(download === true)
                saveAs(blob, `${fileName}.docx`);
}


export default function ReplaceWords(content, valuesToChange, fileName, setBlob, download) {

            readSource(
                content,
                valuesToChange,
                fileName,
                setBlob,
                download
            );

};