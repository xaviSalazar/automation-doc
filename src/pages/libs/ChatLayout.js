import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { httpManager } from '../../managers/httpManagers.js';
// import { loadHistory, appendArrayHistory, cleanReceivedMsg } from '../../redux/conversationStore/conversationAction';
import { oneLight as SyntaxHighlighterStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import LinearProgress from '@mui/material/LinearProgress';
import DownloadIcon from '@mui/icons-material/Download';


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
import { createWithEqualityFn } from "zustand/traditional"

const splitMessage = (message) => {
  const regex = /```(.*?)```|(\*\*(.*?)\*\*)/gs;
  let parts = [];
  let lastIndex = 0;

  message?.replace(regex, (match, code, bold, boldText, index) => {
    if (index > lastIndex) {
      parts.push({ type: 'text', content: message.slice(lastIndex, index) });
    }

    if (code) {
      if (code.trim().startsWith('<!DOCTYPE html')) {
        parts.push({ type: 'html', content: code });
      } else {
        parts.push({ type: 'code', content: code });
      }
    } else if (bold) {
      parts.push({ type: 'bold', content: boldText });
    }

    lastIndex = index + match.length;
  });

  if (lastIndex < message?.length) {
    parts.push({ type: 'text', content: message.slice(lastIndex) });
  }

  return parts;
};

const sendHtmlToServer = async (htmlContent) => {
    try {
        const response = await httpManager.requestDownloadWord(htmlContent)
        // Receive the response and create a blob URL to download
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'ScribeHarmonyDocument.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error:', error);
    }
};


const MessagePart = ({ part }) => {

  const logHtmlContent = async () => {
    sendHtmlToServer(part.content)
  };

  switch(part.type) {
    case 'code':
      return (
        <SyntaxHighlighter language="javascript" style={SyntaxHighlighterStyle}>
          {part.content}
        </SyntaxHighlighter>
      );
    case 'html':
      return (
        <div>
          <div dangerouslySetInnerHTML={{ __html: part.content }} />
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            endIcon={<DownloadIcon />}
            onClick={logHtmlContent}
          >
            DESCARGA
        </Button>
        </div>
      );
    case 'bold':
      return <b>{part.content}</b>;
    case 'text':
      return <span style={{ whiteSpace: 'pre-line' }}>{part.content}</span>;
    default:
      return <span>{part.content}</span>;
  }
};

// Create a Zustand store
const useMessageStore = createWithEqualityFn((set, get) => ({
  messages: [],

  hasMore: false,

  addMessage : (newMessage) => set((state) => ({ messages: [...state.messages, newMessage] })),

  receivedMessage : (newPart) => {
      if (get().messages.length === 0 || get().messages[get().messages.length - 1].role !== 'assistant') {
        // If there are no messages or the last message is not from the server, add a new message
        set((state) => ({messages : [...state.messages, { content: newPart, role: 'assistant' }]}))
      } else {
        // Otherwise, update the last message with the new chunk
        const updatedMessages = [...get().messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content: updatedMessages[updatedMessages.length - 1].content + newPart,
        };
        set(() => ({messages : updatedMessages}))
      }
    },

  appendArrayHistory: async(senderId, receiverId, page, messagesPerPage, SetLoadingHistory) => {
    try {
      SetLoadingHistory(true)
     const response = await httpManager.getChatHistory(senderId, receiverId, page, messagesPerPage)
     if (response.status === 200) {
         SetLoadingHistory(false)
         const sortedMessages =response.data.conversation.sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp);
      });
         set((state) => ({ messages: [...sortedMessages, ...state.messages], hasMore:response.data.hasMore }));
      } 
     else {
         // dispatch(loadingFailed())
       console.error('Error fetching documents:', response.statusText);
     }
   } catch (error) {
     console.error('Error fetching documents:', error);
   }

  },

  loadSavedHistory: async (senderId, chatId, page, messagesPerPage, SetLoadingHistory) => {
    try {
      SetLoadingHistory(true)
      const response = await httpManager.getChatHistory(senderId, chatId, page, messagesPerPage)
      if (response.status === 200) {
        SetLoadingHistory(false)
        const sortedMessages =response.data.conversation.sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp);
      });
        set({ messages: sortedMessages, hasMore:response.data.hasMore });
       } 
      else {
        console.error('Error fetching documents:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  } 

}));

export default function ChatLayout({ modelo, isFirstChat, systemPrompt, setIsFirstChat }) {

const messages = useMessageStore((state) => state.messages);
const hasMore = useMessageStore((state) => state.hasMore);
const addMessage = useMessageStore((state) => state.addMessage);
const receivedMessage = useMessageStore((state) => state.receivedMessage);
const appendArrayHistory = useMessageStore((state) => state.appendArrayHistory);
const loadSavedHistory = useMessageStore((state) => state.loadSavedHistory);

  // const [messages, setMessages] = useState([]);
  const [imgFile, setImgFile] = useState('');
  const [isLoadingHistory, SetLoadingHistory] = useState(false)
  const inputRef = React.useRef(null)
  const [inputPosition, setInputPosition] = useState('top');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const messagesContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const { selectedChatId,
    isLoadingMessage, } = useSelector(state => state.conversationHistory)

  const { userCard } = useSelector(state => state.login)

    // loading history
  useEffect(() => {
    if (selectedChatId === '') return;
    const pagina = 0;
    setPage(0);
    loadSavedHistory(userCard['id'], selectedChatId, pagina, 10, SetLoadingHistory);
  }, [selectedChatId]);

  //loading more pages
  useEffect(() => {
    if ((page > 0) && (hasMore === true)) {  // Avoid running on initial render
      // call append history
      appendArrayHistory(userCard['id'], selectedChatId, page, 10, SetLoadingHistory)
    }
  }, [userCard['id'], page, selectedChatId]);

  // update page when scroll touches top
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop } = messagesContainerRef.current;
      const nearingTop = scrollTop === 0;
      if (nearingTop && hasMore) {
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
    receivedMessage(decodedChunk);
    await processStream(reader, decoder);
  }

  const handleSendMessage = async () => {

    try {
      const userInput = inputRef.current.value
      inputRef.current.value = ''
 
      if (userInput.trim() !== '') {

        const promptMessage = {
          role: 'system',
          content: systemPrompt,
          senderId: userCard['id'],
        }

        const msgSchema = {
          role: 'user',
          content: userInput,
          senderId: userCard['id'],
        }

        if (imgFile !== "") {
          msgSchema.attachment = JSON.stringify(imgFile);
        }

        const newMsgSchema = {
          senderId: userCard['id'],
          receiverId: "b5fcfbd7-52ba-4786-bea0-d74ed1dbf589",
          conversationId: selectedChatId,
          model: modelo,
          content: [msgSchema]
        }

        if( isFirstChat && (systemPrompt !== '') ) {
          newMsgSchema.content.unshift(promptMessage)
        }
        // setMessages(prevMessages => [...prevMessages, msgSchema])
        addMessage(msgSchema);
        setImgFile('');

        // MODIFICAR ESTA PARTE LO ULTIMO QUE RESTA
        setFileUploaded(false);

        const stream = await httpManager.streamingResponseConversation(JSON.stringify(newMsgSchema))
        setIsFirstChat(false)

        if (!stream.ok || !stream.body) {
          throw stream.statusText;
        }
        const reader = stream.body.getReader();
        const decoder = new TextDecoder();
        // Start processing the stream
        await processStream(reader, decoder);
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  // const handleFileEvent = async (e) => {

  //   try {
  //     const files = Array.from(e.target.files);    // array of inserted files
  //     const formData = new FormData();             // Create a new FormData object
  //     formData.append('user_id', userCard['id']);  // append the user id 

  //     // Create an array with specific properties from each file
  //     const fileDetails = files.map(file => ({
  //       lastModified: file.lastModified,
  //       name: file.name,
  //       size: file.size,
  //       type: file.type
  //     }));

  //     // Append files to the FormData object
  //     files.forEach(file => {
  //       formData.append('files', file); // 'files' should match the field name expected by the server
  //     });

  //     await httpManager.bucketUploadFiles(formData); // send to my server
  //     setFileUploaded(true);                         // put icon of added photo
  //     setImgFile(fileDetails);

  //   } catch (e) {
  //     console.log(e.message)
  //   }

  // };

  const handleFileEvent = async (e) => {

    try {
      const attachmentArray = [];
      const files = Array.from(e.target.files);    // array of inserted files

      const uploadPromises = files.map(file => {

        const obj = {
          lastModified: file.lastModified,
          name: file.name,
          size: file.size,
          type: file.type,
          user_id: userCard['id']
        }

        attachmentArray.push(obj); // Add the obj to the array

        // obtiene la URL presignada
        return httpManager.requestUrl(obj)
          //.then(url => console.log(url['data']['url']))
          .then(url => httpManager.uploadFileToS3(url['data']['url'], file));
      });

      await Promise.all(uploadPromises);
      setFileUploaded(true);                    
      setImgFile(attachmentArray);

    } catch (e) {
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

  // Function to check if the file is an image
  const isImage = (type) => type.startsWith('image/');

  const parseAttachment = (attachmentString) => {
    try {
      const stringFromServer = JSON.parse(attachmentString);
      if (typeof stringFromServer === "string") return JSON.parse(stringFromServer)
      else return stringFromServer;
    } catch (e) {
      console.error('Error parsing attachment:', e);
      return null;
    }
  };

  if(!messages) {
    return
    }

  return (
    <>

      {isLoadingHistory ? <LinearProgress /> : null}
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
              display: isLoadingHistory ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.attachment && Array.isArray(parseAttachment(message.attachment)) && parseAttachment(message.attachment).map((attachment, attIndex) => (
              isImage(attachment.type) && (

                <img
                  key={attIndex}
                  src={`https://d1d5i0xjsb5dtw.cloudfront.net/scribeHarmony/${userCard['id']}/${attachment.name}`}
                  alt="Attachment"
                  style={{ 
                    maxWidth: '75%', 
                    width: '200px', // You can set this to the desired width
                    height: 'auto', // This ensures the aspect ratio is maintained
                    borderRadius: '8px', 
                    marginBottom: '4px' 
                }}
                />
              )
            ))}
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
          backgroundColor: highlight ? '#ccc' : 'white', // Highlight background color
          transition: 'background-color 0.5s ease-in-out', // Add a smooth transition effect
          mt: 'auto',
        }}
        onClick={handleInputClick}
      >
        {modelo === "gpt-4-vision-preview" &&
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
        }
        {fileUploaded && (
          <IconButton onClick={handleDelete} aria-label="delete uploaded file">
            <DeleteIcon />
          </IconButton>
        )}
        {isLoadingMessage ? (
          <CircularProgress size={24} /> // Show loading icon
        ) : (<InputBase

          sx={{ ml: 1, flex: 1, width: 700, maxHeight: 100, overflowY: 'auto' }}
          inputRef={inputRef}
          placeholder="Empieza por un Hola chatgpt como estas..."
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

