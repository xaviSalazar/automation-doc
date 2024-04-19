import axios from "axios"

// const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://backenddocautomation-i7jrzx52.b4a.run";

const retrieveChat = async(chatText) => {
    return await axios.post(`${API_BASE_URL}/fetchDocument`, chatText)
}

const retrieveDocument = async(chatText) => {
    return await axios.post(`${API_BASE_URL}/fetchDocument`, chatText, {
    responseType: 'blob', // Important: Set response type to 'blob'
  });
}

const registerUser = async(userObjet) => {
    return await axios.post(`${API_BASE_URL}/register`, userObjet);
}

const loginUser = async(userObjet) => {
    return await axios.post(`${API_BASE_URL}/login`, userObjet);
}

const logoutUser = async(data) => {
    return await axios.get(`${API_BASE_URL}/logout`, data)
}

const userAuth = async (data) => {
    return await axios.get(`${API_BASE_URL}/authUser`, data)
}

const googleLogin = async (data) =>{
    return await axios.post(`${API_BASE_URL}/googleLogin`, data)
}

const facebookLogin = async (data) => {
    return await axios.post(`${API_BASE_URL}/facebookLogin`, data)
}


const getDocuments = async (page, rowsPerPage, userId) => {
    return await axios.get(`${API_BASE_URL}/documents?page=${page}&rowsPerPage=${rowsPerPage}&userId=${userId}`);
}

const deleteDocuments = async (docId) =>{
    return await axios.post(`${API_BASE_URL}/deleteDocument`, docId);
}

const getChatHistory = async (senderId, chatId, page, messagesPerPage ) => {
    return await axios.get(`${API_BASE_URL}/chatHistory?senderId=${senderId}&chatId=${chatId}&page=${page}&messagesPerPage=${messagesPerPage}`);
}

const sendAiMessage = async(msgObj) => {
    return await axios.post(`${API_BASE_URL}/sendAiMsg`, msgObj)
}

const sendchatpdfMessage = async(msgObj) => {
    return await axios.post(`${API_BASE_URL}/chatDocument`, msgObj)
}

const downloadHistoryDocument = async(documentId) => {
    return await axios.get(`${API_BASE_URL}/downloadDocumentHistory?documentId=${documentId}`)
}

const downloadFileBinary = async(attachmentId) => {
    return await axios.get(`${API_BASE_URL}/downloadFileBinary?attachmentId=${attachmentId}`)
}

const multipleUploadFiles = async(formData) => {
     // Send a POST request to your server with Axios
     return await axios.post(`${API_BASE_URL}/uploadMultipleDocs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the Content-Type header to multipart/form-data
        },
      });
}

const chatPdfPost = async(data) => {
    return await axios.post(`${API_BASE_URL}/chatDocument`, data)
}

const streamingResponse = async(sendData) => {
    return  await fetch(`${API_BASE_URL}/chatDocument`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: sendData,
      });
}

const streamingResponseConversation = async(sendData) => {
    return  await fetch(`${API_BASE_URL}/chatConversation`, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: sendData,
      });
}

const getChatList = async(userId) => {
    return await axios.get(`${API_BASE_URL}/getChatList?userId=${userId}`) 
}

const bucketUploadFiles = async(formData) => {
     // Send a POST request to your server with Axios
     return await axios.post(`${API_BASE_URL}/documentInBucket`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the Content-Type header to multipart/form-data
        },
      });
}

const requestUrl = async(dataJson) => {
   return await axios.post(`${API_BASE_URL}/getPresignedUrl`, dataJson)
}

const uploadFileToS3 = async(url, file) => {

    return await axios.put(url, file, {
        headers: {
            'Content-Type': file.type // Set the Content-Type to the file's MIME type
        }
    });

}

const deleteOneConversation = async(data) => {
    return await axios.post(`${API_BASE_URL}/deleteOneConversation`, data)
}

const callOotDiffusion = async(data) => {
    return await axios.post(`${API_BASE_URL}/getImageDiffusion`, data)
}

const getImgResults = async(id) => {
    return await axios.get(`${API_BASE_URL}/retrieveImgResults?Id=${id}`) 
}

const requestDownloadWord = async(htmlContent) => {
    return await axios.post(`${API_BASE_URL}/downloadAsWord`, {
        htmlContent  // Send as a JSON object
    }, {
        responseType: 'blob'  // Expect a blob response
    })
}

export const httpManager = {
    retrieveChat,
    retrieveDocument,
    registerUser,
    loginUser,
    userAuth, 
    logoutUser, 
    googleLogin,
    facebookLogin,
    getDocuments,
    deleteDocuments,
    getChatHistory,
    sendAiMessage,
    downloadHistoryDocument,
    downloadFileBinary,
    multipleUploadFiles,
    chatPdfPost,
    sendchatpdfMessage,
    streamingResponse,
    streamingResponseConversation,
    getChatList,
    bucketUploadFiles,
    deleteOneConversation,
    requestUrl,
    uploadFileToS3,
    requestDownloadWord,
    callOotDiffusion,
    getImgResults
}