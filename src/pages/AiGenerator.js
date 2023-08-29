
import HTMLtoDOCX from 'html-to-docx';
import * as React from 'react';
import * as docx from "docx-preview";
import { Box, Button, Container } from '@mui/material';
// import { saveAs } from 'file-saver';
import { httpManager } from '../managers/httpManagers';

export default function AiGenerator() {

    // blob that contains binary word file
    const [blob, setBlob] =
        React.useState();

    /* UseEffect for blob visualization content after word replacement*/
    React.useEffect(() => {
        if (typeof blob === "undefined")
            return
        docx.renderAsync(blob, document.getElementById("viewer_docx"))
            .then((x) => console.log("docx: finished"))
    }, [blob])

    async function downloadDocx(params) {

        console.log("button")

        try {

            const fetchDocument = await httpManager.retrieveDocumentXml()

            console.log(fetchDocument.data)

            const fileBuffer = await HTMLtoDOCX(fetchDocument.data, null, {
                table: { row: { cantSplit: true } },
                footer: true,
                pageNumber: true,
            });

            console.log(typeof fileBuffer)
            setBlob(fileBuffer)

            // saveAs(fileBuffer, 'html-to-docx.docx');

        } catch (e) {
            console.log(e.message)
        }

    }

    return (
        <Container>
            <Box>
                <Button
                    variant="contained"
                    onClick={downloadDocx}
                >
                    PRESIONAME
                </Button>
            </Box>

            <Box id='viewer_docx' />
        </Container>
    );

}


