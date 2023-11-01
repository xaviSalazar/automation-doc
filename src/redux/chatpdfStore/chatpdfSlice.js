import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    chatpdfArray: [],
    isLoadingMessage: false,
    chatAnswer: '',
    uniqueDocument: '',
}

const chatpdfSlice = createSlice({
    name: 'chatpdf-store',
    initialState,
    reducers: {
        loadMsgSuccessful: (state, action) => {
            state.chatAnswer = action.payload
            state.isLoadingMessage = false
        },
        sendMessage: (state) => {
            state.isLoadingMessage = true
        },
        cleanRcvBuffer: (state) => {
            state.chatAnswer = ''
        },
        setDocument: (state, action) => {
            state.uniqueDocument = action.payload
            console.log(state.uniqueDocument)
        }
    }
});

const { reducer, actions } = chatpdfSlice

export const {  loadMsgSuccessful, 
                sendMessage, 
                cleanRcvBuffer,
                setDocument } = actions

export default reducer