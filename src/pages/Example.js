import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

// import copy from "copy-to-clipboard";  

// URL to saved file 
// const filePath = 'https://d1d5i0xjsb5dtw.cloudfront.net/TemplateT.docx'
// const filePath = 'https://d1d5i0xjsb5dtw.cloudfront.net/AUTORIZACION_example.docx'

function readSource(url, valuesToChange, setBlob) {

    return new Promise((resolve, reject) => {

        PizZipUtils.getBinaryContent(url, function (error, content) {
            // error checker
            if (error) {
                throw error;
            }

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
            saveAs(blob, "output.docx");
        });
    })
}


export default function Example(valuesToChange, setBlob) {

            readSource(
                filePath,
                valuesToChange,
                setBlob
            );

};