import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { httpManager } from '../../managers/httpManagers.js';
import { loadHistory, appendArrayHistory, cleanReceivedMsg } from '../../redux/conversationStore/conversationAction';

import {
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
import AttachFileIcon from '@mui/icons-material/AttachFile';

 const mensajes = []

export default function ChatLayout() {

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(mensajes);
  const [inputPosition, setInputPosition] = useState('top');
  const [highlight, setHighlight] = useState(false);
  const messagesContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const { selectedChatId, conversationArr, 
    isLoadingMessage, hasMore, chatAnswer,
    appendHistory } = useSelector(state => state.conversationHistory)

  // loading state variable after message sent
  const dispatch = useDispatch();

  const { userCard } = useSelector(state => state.login)

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  useEffect(() => {
    if(chatAnswer === '') return;
    console.log(chatAnswer)
    dispatch(cleanReceivedMsg())
    setMessages(prevMessages => [...prevMessages, chatAnswer]);
  }, [chatAnswer, dispatch])


  useEffect(() => {
    if(selectedChatId === '') return;
    const pagina = 0;
    setPage(0);
    dispatch(loadHistory(userCard['id'], selectedChatId, pagina, 10));
  }, [selectedChatId,dispatch]);

  useEffect(() => {
    if (page > 0) {  // Avoid running on initial render
      // call append history
      dispatch(appendArrayHistory(userCard['id'], selectedChatId, page, 10));
    }
  }, [dispatch, userCard, page, selectedChatId]);

  useEffect(() => {
    setMessages(prevMessages => [ ...appendHistory, ...prevMessages]);
  }, [appendHistory])

  // ONLY LOADS FIRST RENDER
  useEffect(() => {
    setMessages(conversationArr);
  }, [conversationArr, selectedChatId])

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
  

  async function processStream(reader, decoder) {
    const { value, done } = await reader.read();
    if (done) {
      // Stream is complete, exit the recursive function
      return;
    }
    const decodedChunk = decoder.decode(value, { stream: true });
    // Update the messages state by appending the new chunk to the last message
  setMessages(prevMessages => {
    if (prevMessages.length === 0 || prevMessages[prevMessages.length - 1].role !== 'assistant') {
      // If there are no messages or the last message is not from the server, add a new message
      return [...prevMessages, { content: decodedChunk, role: 'assistant' }];
    } else {
      // Otherwise, update the last message with the new chunk
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        content: updatedMessages[updatedMessages.length - 1].content + decodedChunk,
      };
      return updatedMessages;
    }
  });

    // Call the function recursively to read the next chunk
    await processStream(reader, decoder);
  }
  
  const handleSendMessage = async () => {
     try { 
          if (inputValue.trim() !== '') 
          {
                    const msgSchema = {
                      role: 'user',
                      content: inputValue,
                      senderId: userCard['id'],
                      receiverId: "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589",
                      conversationId: selectedChatId
                    }

                  setMessages(prevMessages => [...prevMessages, msgSchema]);
                  setInputValue('');

                const response = await httpManager.streamingResponseConversation(JSON.stringify(msgSchema))
            
                if (!response.ok || !response.body) 
                {
                  throw response.statusText;
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

              // Start processing the stream
              await processStream(reader, decoder);
          }
        } catch(error) {
           console.log(error.message)
        }
  };

  const handleFileEvent =  async (e) => {
    
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () =>  { 
      const base64Image = reader.result;  
      console.log(base64Image)
    }

    if (file) 
    { reader.readAsDataURL(file); } 
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
    <>
            <List 
              ref={messagesContainerRef}
              sx={{    
                  flexgrow: 1,
                  overflowY: 'auto',
                  mb: 2,
                  }}>
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
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                backgroundColor: highlight ? '#ccc' : 'transparent', // Highlight background color
                transition: 'background-color 0.5s ease-in-out', // Add a smooth transition effect
                mt: 'auto',
              }}
              onClick={handleInputClick}
            >
              <IconButton variant="contained" component="label">
              <AttachFileIcon />
                <input
                            id     = "fileUpload"
                            type   = "file"
                            // multiple
                            accept = ".jpg, .jpeg, .png, .gif"
                            hidden
                            onChange={(e) => handleFileEvent(e)}
                            //disabled={fileLimit}
                 />
            </IconButton>
              {isLoadingMessage ? (
                <CircularProgress size={24} /> // Show loading icon
              ) : (<InputBase
                sx={{ ml: 1, flex: 1, width: 700, maxHeight: 100, overflowY:'auto' }}
                onChange={handleInputChange}
                placeholder="Empieza por un Hola chatgpt como estas..."
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

            </>

  );
};

