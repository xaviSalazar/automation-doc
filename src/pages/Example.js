import React from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

// URL to saved file 
const filePath = "https://docxtemplater.com/tag-example.docx"

// Values defined to change inside a file (pdf, word, etc)
// const valuesToChange =  {
//     first_name: "John",
//     last_name: "Doe",
//     phone: "0652455478",
//     description: "New Website",
// }


// Loads file from url only and gets content
// function loadFile(url, callback) {
//     PizZipUtils.getBinaryContent(url, callback);
// }

function readSource(url, valuesToChange) {

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
            saveAs(blob, "output.docx");
        });
        
    })
}

// modifies values in file and then saves it in docx format
// const renderAndSave = (error, content) => {
//     // error checker
//     if (error) {
//         throw error;
//     }
//     // return zip 
//     const zip = new PizZip(content);
    
//     const doc = new Docxtemplater(zip, {
//         paragraphLoop: true,
//         linebreaks: true,
//     });

//     // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
//     doc.render(valuesToChange);
//     const blob = doc.getZip().generate({
//         type: "blob",
//         mimeType:
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     }); //Output the document using Data-URI
//     saveAs(blob, "output.docx");
// }

export default function Example() {

    const valuesToChange =  {
    first_name: "John",
    last_name: "Doe",
    phone: "0652455478",
    description: "New Website",
    }

        // generate document should be called in a map
        // const generateDocument = () => {
            readSource(
                filePath,
                valuesToChange
            );
        // };

        // return (
        //     <div className="p-2">
        //         <button onClick={generateDocument}>
        //             Generate document
        //         </button>
        //     </div>
        // );
};