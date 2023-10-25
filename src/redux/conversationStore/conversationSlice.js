import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversationArr: [],
    isLoadingHistory: true,
    isLoadingMessage: false,
    isNewConversation: false,
    hasMore: false,
    chatAnswer: ''
}

const conversationSlice = createSlice({
    name: 'conversation-store',
    initialState,
    reducers: {
        loadSuccessHistory: (state, action) => {
            if (action.payload.conversation.length === 0) {
                state.isNewConversation = true
            } else {
                state.isNewConversation = false
            }
            // Sort the conversation array by timestamp
            const sortedConversation = action.payload.conversation.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.conversationArr = sortedConversation
            state.hasMore = action.payload.hasMore
            state.isLoadingHistory = false
            state.isLoadingMessage = false
        },
        loadingFailed: (state) => {
            state.isLoadingHistory = false
            state.isNewConversation = true
        },
        sendMessage: (state) => {
            state.isLoadingMessage = true
        },
        loadMsgSuccessful: (state, action) => {
            state.chatAnswer = action.payload
            state.isNewConversation = false
            state.isLoadingMessage = false
        }
    }
});

const { reducer, actions } = conversationSlice

export const { loadMsgSuccessful, loadSuccessHistory, sendMessage, loadingFailed } = actions

export default reducer