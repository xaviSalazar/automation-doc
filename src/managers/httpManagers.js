import axios from "axios"

const API_BASE_URL = "http://localhost:3001";
// const API_BASE_URL = "https://automationdoc-xavicoel.b4a.run";

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

const documentUpload = async (data) => {
    return await axios.post(`${API_BASE_URL}/saveDocuments`, data)
}

const getDocuments = async (page, rowsPerPage, userId) => {
    return await axios.get(`${API_BASE_URL}/documents?page=${page}&rowsPerPage=${rowsPerPage}&userId=${userId}`);
}

const deleteDocuments = async (docId) =>{
    return await axios.post(`${API_BASE_URL}/deleteDocument`, docId);
}

const getChatHistory = async (senderId, receiverId, page, messagesPerPage ) => {
    return await axios.get(`${API_BASE_URL}/chatHistory?senderId=${senderId}&receiverId=${receiverId}&page=${page}&messagesPerPage=${messagesPerPage}`);
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


export const httpManager = {
    retrieveChat,
    retrieveDocument,
    registerUser,
    loginUser,
    userAuth, 
    logoutUser, 
    googleLogin,
    facebookLogin,
    documentUpload,
    getDocuments,
    deleteDocuments,
    getChatHistory,
    sendAiMessage,
    downloadHistoryDocument,
    downloadFileBinary,
    multipleUploadFiles,
    chatPdfPost,
    sendchatpdfMessage,
    streamingResponse
}