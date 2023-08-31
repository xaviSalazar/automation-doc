import axios from "axios"

const API_BASE_URL = "http://localhost:3001";

const retrieveChat = async(chatText) => {
    return await axios.post(`${API_BASE_URL}/fetchDocument`, chatText)
}

export const httpManager = {
    retrieveChat
}