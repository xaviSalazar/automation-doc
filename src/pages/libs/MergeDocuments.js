import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import DocxMerger from "@xavicoel/docx-merger";

export default function MergeDocuments(content, ArrayValues) {

    // delete id attribute
    const arrTest = JSON.parse(JSON.stringify(ArrayValues)).map(function(item) { 
        delete item.id; 
        return item; 
    });

    const documents = arrTest.map((item) => {

        // create zip
        const zip = new PizZip(content);
        // Onlye one instance permited by Docxtemplater
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.render(item);

        const blob = doc.getZip().generate({
            type: "string",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        return blob;

    })

    const docxMerge = new DocxMerger({}, documents)

    docxMerge.save('blob',function (data) {
        saveAs(data,"all_items.docx");
    });

}