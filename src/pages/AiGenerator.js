
import HTMLtoDOCX from 'html-to-docx';
import * as React from 'react';
import * as docx from "docx-preview";
import { Box, Button, Container, Paper } from '@mui/material';
// import { saveAs } from 'file-saver';
import { httpManager } from '../managers/httpManagers';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

export default function AiGenerator() {

    let textInserted;

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


    //------------------------------------------------
    //------------------------------------------------
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
//------------------------------------------------

const onChange = (event) => {
    // console.log(event.target.value);
    textInserted = event.target.value
};

const onClickSend = (event) => {
    if (textInserted === undefined || textInserted === "" ) return;
        console.log("envio: ")
        console.log(textInserted)
};

    return (
        <Container>
            <Box>

            <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
            <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Que documento desea?"
            inputProps={{ 'aria-label': 'generar documento' }}
            multiline
            onChange={onChange}
            />

            <IconButton onClick={onClickSend} color="primary" sx={{ p: '10px' }} aria-label="directions">
                <SendIcon/>
            </IconButton>

            </Paper>

            </Box>
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


