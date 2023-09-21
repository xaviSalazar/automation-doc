import axios from "axios"

// const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://automationdoc-xavicoel.b4a.run";

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

const downloadHistoryDocument = async(documentId) => {
    return await axios.get(`${API_BASE_URL}/downloadDocumentHistory?documentId=${documentId}`)
}

const downloadFileBinary = async(attachmentId) => {
    return await axios.get(`${API_BASE_URL}/downloadFileBinary?attachmentId=${attachmentId}`)
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
    downloadFileBinary
}