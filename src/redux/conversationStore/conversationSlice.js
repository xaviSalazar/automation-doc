import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversationArr: [],
    isLoadingHistory: true,
    isLoadingMessage: false,
    isNewConversation: false,
}

const conversationSlice = createSlice({
    name: 'conversation-store',
    initialState,
    reducers: {
        loadSuccessHistory: (state, action) => {
            console.log(action.payload)
            if (action.payload.length === 0) {
                state.isNewConversation = true
                console.log(state.isNewConversation)
            } else {
                state.isNewConversation = false
            }
            state.conversationArr = action.payload
            state.isLoadingHistory = false
            state.isLoadingMessage = false
        },
        loadingFailed: (state) => {
            state.isLoadingHistory = false
            state.isNewConversation = true
        },
        sendMessage: (state, action) => {
            const newTemporal = state.conversationArr.concat(action.payload)
            state.conversationArr = newTemporal
            state.isLoadingMessage = true
        },
        loadMsgSuccessful: (state, action) => {
            state.conversationArr = state.conversationArr.concat(action.payload)
            state.isNewConversation = false
            state.isLoadingMessage = false
            console.log(state.conversationArr)
        }
    }
});

const { reducer, actions } = conversationSlice

export const { loadMsgSuccessful, loadSuccessHistory, sendMessage, loadingFailed } = actions

export default reducer