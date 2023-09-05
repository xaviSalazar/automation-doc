import React, { useState, useRef, useEffect } from 'react';
import * as docx from "docx-preview";
import { httpManager } from '../managers/httpManagers';
import { saveAs } from "file-saver";
import {
  Container,
  Box,
  ButtonGroup,
  CircularProgress,
  Button,
  Paper,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

export default function AiGenerator() {

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputPosition, setInputPosition] = useState('top');
  const [highlight, setHighlight] = useState(false);
  const messagesContainerRef = useRef(null);
  const [blob, setBlob] = useState();
  const [viewDoc, setViewDoc] = useState(false);
  // loading state variable after message sent
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const closeDocViewer = () => {
    setViewDoc(false)
    setBlob(null)
  }

  /* UseEffect for blob visualization content after word replacement*/
  useEffect(() => {
    if (typeof blob === "undefined")
      return
    docx.renderAsync(blob, document.getElementById("viewer_docx"))
      .then((x) => console.log("docx: finished"))
  }, [blob])

  const contactServer = async (msg) => {
    try {
      //const response = await httpManager.retrieveChat({msg: msg}); 
      const response = await httpManager.retrieveDocument({ msg: msg })

      // response is new blob 
      if (response.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: 'received',
            content: "nuevo documento recibido",
            buttons: [
              { label: 'Visualizar Documento', onClick: () => downloadBlob(new Blob([response.data])) },
            ],
          },
        ]);
        //setHtmlDoc(response.data.result[0].message.content)
        // setBlob(new Blob([response.data]))
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {

    if (!inputPosition && inputValue.trim() !== '') {
      setInputPosition('bottom');
    }

    try {
      if (inputValue.trim() !== '') {
        const copySent = inputValue
        setInputValue('');
        setMessages((prevMessages) => [...prevMessages, { type: 'sent', content: copySent }])
        console.log(messages)
        setIsLoading(true); // Set loading state to true
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

  const downloadBlob = async (content) => {
    try {
      setBlob(content)
      setViewDoc(true)
    } catch (e) {
      console.log(e.message)
    }
  }

  const saveFile = () => {
    saveAs(blob, `Archivo.docx`);
  }

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (

    <Container
    sx={{
      justifyContent: 'center',
    }}
    >

      {viewDoc ? (<>
        <IconButton aria-label="delete" onClick={closeDocViewer}>
          <CancelIcon />
        </IconButton>

        <IconButton color="primary" onClick={saveFile}>
          <SaveIcon />
        </IconButton>
        <Box id='viewer_docx' /> </>) :

        (
          <>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Add this to evenly distribute items horizontally
                position: inputPosition === 'bottom' ? 'fixed' : 'relative',
                bottom: inputPosition === 'bottom' ? 0 : 'auto',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                backgroundColor: highlight ? '#ccc' : 'transparent', // Highlight background color
                transition: 'background-color 0.5s ease-in-out', // Add a smooth transition effect
              }}
              onClick={handleInputClick}
            >
              {isLoading ? (
                <CircularProgress size={24} /> // Show loading icon
              ) : (<InputBase
                sx={{ ml: 1, flex: 1 }}
                onChange={handleInputChange}
                placeholder="Escribe que necesitas..."
                value={inputValue}
                inputProps={{ 'aria-label': 'chat message input' }}
                multiline
              />
              )}
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
                  <ListItem
                    key={index}
                    disableGutters
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.type === 'sent' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <ListItemText
                      primary={message.content}
                      sx={{
                        backgroundColor: message.type === 'sent' ? '#DCF8C6' : '#E3F2FD',
                        padding: '8px',
                        borderRadius: '8px',
                        maxWidth: '75%',
                        marginBottom: '4px',
                      }}
                    />
                    {message.buttons && (
                      <ButtonGroup>
                        {message.buttons.map((button, buttonIndex) => (
                          <Button
                            key={buttonIndex}
                            onClick={button.onClick}
                            sx={{
                              backgroundColor: message.type === 'sent' ? '#DCF8C6' : '#E3F2FD',
                              '&:hover': {
                                backgroundColor: message.type === 'sent' ? '#B7E69E' : '#90CAF9',
                              },
                            }}
                          >
                            {button.label}
                          </Button>
                        ))}
                      </ButtonGroup>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
    </Container>
  );
};

