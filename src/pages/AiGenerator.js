import React, { useState, useRef, useEffect } from 'react';
import * as docx from "docx-preview";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from 'react-redux';
import { loadHistory, appendArrayHistory, sendMsg, cleanReceivedMsg } from '../redux/conversationStore/conversationAction';
import { httpManager } from '../managers/httpManagers';
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

// const initChat = [{ type: 'received', content: "Hola! Mi nombre es Lord Barkis y puedo ayudarte a generar cualquier documento." },
// { type: 'received', content: "Por ejemplo: " },
// { type: 'received', content: "Tan solo escribe \"Quiero una carta de renuncia\"." },]


const startFirstTimeMsg = (msg, senderId, receiverId) => {

  const msgPart = [{
    role: 'system',
    content: `Eres un experto redactor de documentos de todo tipo. Y los escribes con las siguientes condiciones:
                                                Si respondes un documento formatealo dentro de los tags <!DOCTYPE html></html>, 
                                                todos los campos que sean a llenar que esten dentro
                                                de llaves en camel case. Por ejemplo: \{detalleDelMotivo\}`,
    senderId: senderId,
    receiverIde: receiverId
  },
  {
    role: 'user',
    content: msg,
    senderId: senderId,
    receiverIde: receiverId
  }]

  return msgPart
}

function separateTextAndHTML(inputText) {
  // Define regular expressions to match the start and end of the HTML block
  const htmlStartRegex = /<!DOCTYPE html>/i;
  const htmlEndRegex = /<\/html>/i;

  // Find the positions of the HTML block start and end
  const startIndex = inputText.search(htmlStartRegex);
  const endIndex = inputText.search(htmlEndRegex);

  // Check if both HTML start and end tags are found
  if (startIndex !== -1 && endIndex !== -1) {
    // Extract the text before and after the HTML block
    const textBeforeHTML = inputText.slice(0, startIndex);
    const htmlContent = inputText.slice(startIndex, endIndex + 7); // Include the closing </html> tag
    const textAfterHTML = inputText.slice(endIndex + 7); // Exclude the closing </html> tag

    return {
      textBeforeHTML,
      htmlContent,
      textAfterHTML,
    };
  } else {
    // HTML tags not found, return the entire input as text
    return {
      textBeforeHTML: inputText,
      htmlContent: '',
      textAfterHTML: '',
    };
  }
}


export default function AiGenerator() {

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputPosition, setInputPosition] = useState('top');
  const [highlight, setHighlight] = useState(false);
  const messagesContainerRef = useRef(null);
  const [blob, setBlob] = useState();
  const [downldBlob, setDownldBlob] = useState()
  const [viewDoc, setViewDoc] = useState(false);
  // loading state variable after message sent
  const dispatch = useDispatch();
  const { conversationArr, isNewConversation, 
        isLoadingMessage, hasMore, chatAnswer,
        appendHistory } = useSelector(state => state.conversationHistory)

  const { userCard } = useSelector(state => state.login)

  const [page, setPage] = useState(0);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const closeDocViewer = () => {
    setViewDoc(false)
    setBlob(null)
  }

  useEffect(() => {
      dispatch(loadHistory(userCard['id'], "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589", page, 10));
  }, [dispatch, userCard]);

  useEffect(() => {
    if (page > 0) {  // Avoid running on initial render
      // call append history
      dispatch(appendArrayHistory(userCard['id'], "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589", page, 10));
    }
  }, [dispatch, userCard, page]);


  useEffect(() => {
    setMessages(prevMessages => [...filterMsgPart(appendHistory), ...prevMessages]);
  }, [appendHistory])

  // ONLY LOADS FIRST RENDER
  useEffect(() => {
    setMessages(filterMsgPart(conversationArr));
  }, [conversationArr])

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop  } = messagesContainerRef.current;
      const nearingTop = scrollTop === 0;
      if (nearingTop && hasMore) {
        console.log('useEffect 5')
        setPage(prevPage => prevPage + 1);
      }
    };
  
    const messagesContainer = messagesContainerRef.current;
    messagesContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore]);

  useEffect(() =>{
    if(chatAnswer === '') return;
    dispatch(cleanReceivedMsg())
    setMessages(prevMessages => [...prevMessages, chatAnswer]);
  }, [chatAnswer])
  

  /* UseEffect for blob visualization content after word replacement*/
  useEffect(() => {
    if (typeof blob === "undefined")
      return
    docx.renderAsync(blob, document.getElementById("viewer_docx"))
      .then((x) => console.log("docx: finished"))
  }, [blob])

  const filterMsgPart = (arr) => {
    return arr.map((item) => {
  
    const text_separation = separateTextAndHTML(item.content)
  
      const msg = item.content.includes('<!DOCTYPE html>')
        ? text_separation.textBeforeHTML : item.content
  
      const isAttachment = item.attachment_id !== null
        ? [
          {
            label: item.title,
            onClick: () => downloadBlob(item.attachment_id)
          },
        ]
        : [];
        return {
        role: item.role,
        content: msg,
        buttons: isAttachment,
        timestamp: item.timestamp,
      };
    });
  };
  

  const handleSendMessage = async () => {

    if (!inputPosition && inputValue.trim() !== '') {
      setInputPosition('bottom');
    }

    try {
      if (inputValue.trim() !== '') {
        const copySent = inputValue;
        setInputValue('');
        if (isNewConversation) {
          // array [system message, user message]
          const startChat = startFirstTimeMsg(copySent, userCard['id'], "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589")
          // dispatch 
          setMessages(prevMessages => [...prevMessages, startChat]);
          dispatch(sendMsg(startChat, isNewConversation, userCard['id']))
          console.log(startChat)
        } else {
          const obj = {
            role: 'user',
            content: copySent,
            senderId: userCard['id'],
            receiverIde: "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589"
          }
          setMessages(prevMessages => [...prevMessages, obj]);
          dispatch(sendMsg([obj], isNewConversation, userCard['id']))
        }
      }
    } catch (e) {
      console.log(e.message);
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

  const downloadBlob = async (docId) => {

    try {

    
    const response = await httpManager.downloadHistoryDocument(docId);

    if(response.status === 200)
    {
      console.log(response.data)
      const {attachment} = response.data
      setBlob(new Uint8Array(atob(attachment).split('').map(char => char.charCodeAt(0))))
      setDownldBlob(new Blob([ new Uint8Array(atob(attachment).split('').map(char => char.charCodeAt(0))) ]))
      setViewDoc(true)
    }
   } catch (e) {
      console.log(e.message)
    }
  }
  const saveFile = () => {
    saveAs(downldBlob, `DownloadedFile.docx`);
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
          <Box
            ref={messagesContainerRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center content horizontally
              width: '100%', // Take the whole width of the container
              height: 'calc(100vh - 150px)',
              overflowY: 'auto',
            }}
          >
            <List sx={{ width: '100%' }}>
              {messages.map((message, index) => (

                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={message.content}
                    sx={{
                      backgroundColor: message.role === 'user' ? '#DCF8C6' : '#E3F2FD',
                      padding: '8px',
                      borderRadius: '8px',
                      maxWidth: '75%',
                      marginBottom: '4px',
                    }}
                  />
                  {isLoadingMessage && index === messages.length - 1 && (
                    <CircularProgress size={40} color="inherit" sx={{ alignSelf: 'flex-start', marginRight: 2 }} />
                  )}
                  {message.buttons && (
                    <ButtonGroup>
                      {message.buttons.map((button, buttonIndex) => (
                        <Button
                          key={buttonIndex}
                          onClick={button.onClick}
                          sx={{
                            backgroundColor: message.role === 'user' ? '#DCF8C6' : '#E3F2FD',
                            '&:hover': {
                              backgroundColor: message.role === 'user' ? '#B7E69E' : '#90CAF9',
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
              {isLoadingMessage ? (
                <CircularProgress size={24} /> // Show loading icon
              ) : (<InputBase
                sx={{ ml: 1, flex: 1, width: 700 }}
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
          </Box>
        )}
    </Container>
  );
};

