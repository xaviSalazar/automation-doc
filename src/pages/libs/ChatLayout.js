import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { httpManager } from '../../managers/httpManagers.js';
import { loadHistory, appendArrayHistory, cleanReceivedMsg } from '../../redux/conversationStore/conversationAction';
import { oneLight as SyntaxHighlighterStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import check circle icon
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon



const mensajes = []

const splitMessage = (message) => {
  const regex = /```(.*?)```/gs;
  let parts = [];
  let lastIndex = 0;

  message.replace(regex, (match, code, index) => {
    if (index > lastIndex) {
      parts.push({ type: 'text', content: message.slice(lastIndex, index) });
    }
    parts.push({ type: 'code', content: code });
    lastIndex = index + match.length;
  });

  if (lastIndex < message.length) {
    parts.push({ type: 'text', content: message.slice(lastIndex) });
  }

  return parts;
};

const MessagePart = ({ part }) => {
  if (part.type === 'code') {
    return (
      <SyntaxHighlighter language="javascript" style={SyntaxHighlighterStyle}>
        {part.content}
      </SyntaxHighlighter>
    );
  } else {
    return <span>{part.content}</span>;
  }
};


export default function ChatLayout() {

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(mensajes);
  const [imgFile, setImgFile] = useState('');
  const inputRef = React.useRef(null)
  const [inputPosition, setInputPosition] = useState('top');
  const [fileUploaded, setFileUploaded] = useState(false);
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
    //setInputValue(event.target.value);
  };


  useEffect(() => {
    if (chatAnswer === '') return;
    console.log(chatAnswer)
    dispatch(cleanReceivedMsg())
    setMessages(prevMessages => [...prevMessages, chatAnswer]);
  }, [chatAnswer, dispatch])


  useEffect(() => {
    if (selectedChatId === '') return;
    const pagina = 0;
    setPage(0);
    dispatch(loadHistory(userCard['id'], selectedChatId, pagina, 10));
  }, [selectedChatId, dispatch]);

  useEffect(() => {
    if (page > 0) {  // Avoid running on initial render
      // call append history
      dispatch(appendArrayHistory(userCard['id'], selectedChatId, page, 10));
    }
  }, [dispatch, userCard, page, selectedChatId]);

  useEffect(() => {
    setMessages(prevMessages => [...appendHistory, ...prevMessages]);
  }, [appendHistory])

  // ONLY LOADS FIRST RENDER
  useEffect(() => {
    setMessages(conversationArr);
  }, [conversationArr, selectedChatId])

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop } = messagesContainerRef.current;
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

  const formDataToObject = (formData) => {
    const object = {};
    for (let [key, value] of formData.entries()) {
      object[key] = value;
    }
    return object;
  };

  const handleSendMessage = async () => {
    try {
      const userInput = inputRef.current.value
      inputRef.current.value = ''
      if (userInput.trim() !== '') {

        const msgSchema = {
          role: 'user',
          content: userInput,
          senderId: userCard['id'],
          receiverId: "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589",
          conversationId: selectedChatId
        }

        if (imgFile !== "") {
          msgSchema.attachment = imgFile;
        }
  
        setMessages(prevMessages => [...prevMessages, msgSchema]);
        setInputValue('');
        setImgFile('');
        setFileUploaded(false);
        
        console.log(msgSchema)

        const stream = await httpManager.streamingResponseConversation(JSON.stringify(msgSchema))

        if (!stream.ok || !stream.body) {
          throw stream.statusText;
        }
        const reader = stream .body.getReader();
        const decoder = new TextDecoder();

        // Start processing the stream
        await processStream(reader, decoder);
      }
    } catch (error) {
      console.log(error.message)
    }
    
  };

  const handleFileEvent = async (e) => {

  try {
          const files = Array.from(e.target.files);    // array of inserted files
          const formData = new FormData();             // Create a new FormData object
          formData.append('user_id', userCard['id']);  // append the user id 

          // Create an array with specific properties from each file
          const fileDetails = files.map(file => ({
              lastModified: file.lastModified,
              name: file.name,
              size: file.size,
              type: file.type
          }));

          // Append files to the FormData object
          files.forEach(file => {
              formData.append('files', file); // 'files' should match the field name expected by the server
          });

          await httpManager.bucketUploadFiles(formData); // send to my server
          setFileUploaded(true);                         // put icon of added photo
          setImgFile(fileDetails);

  } catch(e) {
    console.log(e.message)
  }

};


  const handleDelete = () => {
    setFileUploaded(false);
    setImgFile('')
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevenir el comportamiento predeterminado de Enter en un input multiline
      handleSendMessage();
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
            {message.attachment && (
              <img
                src={message.attachment}
                alt="Attachment"
                style={{ maxWidth: '75%', borderRadius: '8px', marginBottom: '4px' }}
              />
            )}
            <ListItemText
              primary={
                //message.content
                splitMessage(message.content).map((part, partIndex) => (
                  <MessagePart key={partIndex} part={part} />
                ))
              }
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
          {fileUploaded ? <CheckCircleIcon /> : <AttachFileIcon />}
          <input
            id="fileUpload"
            type="file"
            multiple
            accept=".jpg, .jpeg, .png, .gif"
            hidden
            onChange={(e) => handleFileEvent(e, setFileUploaded)}
          //disabled={fileLimit}
          />
        </IconButton>
        {fileUploaded && (
          <IconButton onClick={handleDelete} aria-label="delete uploaded file">
            <DeleteIcon />
          </IconButton>
        )}
        {isLoadingMessage ? (
          <CircularProgress size={24} /> // Show loading icon
        ) : (<InputBase
          
          sx={{ ml: 1, flex: 1, width: 700, maxHeight: 100, overflowY: 'auto' }}
          inputRef = {inputRef}
          onChange={handleInputChange}
          placeholder="Empieza por un Hola chatgpt como estas..."
          // value={inputValue}
          inputProps={{ 'aria-label': 'chat message input' }}
          multiline
          onKeyDownCapture={handleKeyPress} 
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

