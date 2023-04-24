import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import DocxMerger from "docx-merger";

function saveSetWords(content, valuesToChange, fileName, setBlob, download) {
            // return zip 
            const zip = new PizZip(content);
            
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
        
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render(valuesToChange);
            const blob = doc.getZip().generate({
                type: "string",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            setBlob(blob);
            console.log('blobv', typeof blob)
            console.log('content ', typeof content)
            const docTest = new DocxMerger({}, [blob, blob, blob, blob, blob, blob, blob, blob, blob, blob, blob])

            docTest.save('blob',function (data) {
                saveAs(data,"merged_react.docx");
            });
            if(download === true)
                saveAs(blob, `${fileName}.docx`);
}


export default function ReplaceWords(content, valuesToChange, fileName, setBlob, download) {

            saveSetWords(
                content,
                valuesToChange,
                fileName,
                setBlob,
                download
            );

};