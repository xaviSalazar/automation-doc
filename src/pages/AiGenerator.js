
// import HTMLtoDOCX from 'html-to-docx';
// import * as React from 'react';
// import * as docx from "docx-preview";
// import { Box, Button, Container, Paper } from '@mui/material';
// // import { saveAs } from 'file-saver';
// import { httpManager } from '../managers/httpManagers';
// import InputBase from '@mui/material/InputBase';
// import IconButton from '@mui/material/IconButton';
// import SendIcon from '@mui/icons-material/Send';

// export default function AiGenerator() {

//     const [value, setValue] = React.useState("");

//     // blob that contains binary word file
//     const [blob, setBlob] =
//         React.useState();

//     /* UseEffect for blob visualization content after word replacement*/
//     React.useEffect(() => {
//         if (typeof blob === "undefined")
//             return
//         docx.renderAsync(blob, document.getElementById("viewer_docx"))
//             .then((x) => console.log("docx: finished"))
//     }, [blob])


//     //------------------------------------------------
//     //------------------------------------------------
//     async function downloadDocx(params) {

//         console.log("button")

//         try {

//             const fetchDocument = await httpManager.retrieveDocumentXml()

//             console.log(fetchDocument.data)

//             const fileBuffer = await HTMLtoDOCX(fetchDocument.data, null, {
//                 table: { row: { cantSplit: true } },
//                 footer: true,
//                 pageNumber: true,
//             });

//             console.log(typeof fileBuffer)
//             setBlob(fileBuffer)

//             // saveAs(fileBuffer, 'html-to-docx.docx');

//         } catch (e) {
//             console.log(e.message)
//         }
//     }
// //------------------------------------------------

//             </Box>
//             {/* <Box>
//                 <Button
//                     variant="contained"
//                     onClick={downloadDocx}
//                 >
//                     PRESIONAME
//                 </Button>
//             </Box> */}

//             <Box id='viewer_docx' />
//         </Container>
//     );

// }

import React, { useState, useRef, useEffect } from 'react';
import { httpManager } from '../managers/httpManagers';
import {
  Container,
  Box,
  Paper,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function AiGenerator() {

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputPosition, setInputPosition] = useState('top');
  const [highlight, setHighlight] = useState(false);
  const messagesContainerRef = useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const contactServer = async (msg) => {
    const response = await httpManager.retrieveChat(msg); 
    console.log(messages)
    if(response.data.message)
    setMessages([...messages, msg, response.data.message]);
  }

  const handleSendMessage = async () => {

    if (!inputPosition && inputValue.trim() !== '') {
        setInputPosition('bottom');
      }

      try {
        if (inputValue.trim() !== '') {
          const copySent = inputValue
          setInputValue('');
          console.log(messages)
          contactServer(copySent)
        }
      } catch (e) {
        console.log(e.message)
      }
  };


  const handleInputClick = () => {
    if (inputPosition === 'top') {
        setInputPosition('bottom');
        setHighlight(true); // Highlight when moving the input down
        setTimeout(() => {
          setHighlight(false); // Remove the highlight after a short delay
        }, 1000); // Adjust the delay duration as needed
      }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 400,
          position: inputPosition === 'bottom' ? 'fixed' : 'relative',
          bottom: inputPosition === 'bottom' ? 0 : 'auto',
          boxShadow:'0px 0px 10px rgba(0, 0, 0, 0.2)',
          backgroundColor: highlight ? '#ccc' : 'transparent', // Highlight background color
          transition: 'background-color 0.5s ease-in-out', // Add a smooth transition effect
        }}
        onClick={handleInputClick}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          onChange={handleInputChange}
          placeholder="Escribe que necesitas..."
          value={inputValue}
          inputProps={{ 'aria-label': 'chat message input' }}
          multiline
        />
        <IconButton
          onClick={handleSendMessage}
          color="primary"
          sx={{ p: '10px' }}
          aria-label="send message"
        >
          <SendIcon />
        </IconButton>
      </Paper>

      <Box
        ref={messagesContainerRef}
        sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto' }}
      >
        <List sx={{ width: '100%', maxWidth: 400 }}>
          {messages.map((message, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText primary={message} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

