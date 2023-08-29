import axios from "axios"

const API_BASE_URL = "http://localhost:3001";

const retrieveDocumentXml = async() => {
    return await axios.get(`${API_BASE_URL}/fetchDocument`)
}

export const httpManager = {
    retrieveDocumentXml
}