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
export const httpManager = {
    retrieveChat,
    retrieveDocument,
    registerUser,
    loginUser,
    userAuth, 
    logoutUser, 
    googleLogin,
    facebookLogin,
    documentUpload
}