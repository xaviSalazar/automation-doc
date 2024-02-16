import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversationArr: [],
    appendHistory: [],
    isLoadingHistory: true,
    isLoadingMessage: false,
    selectedChatId: '',
    hasMore: false,
    chatAnswer: '',
}

const conversationSlice = createSlice({
    name: 'conversation-store',
    initialState,
    reducers: {
        loadSuccessHistory: (state, action) => {
            // Sort the conversation array by timestamp
            const sortedConversation = action.payload.conversation.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.conversationArr = sortedConversation
            state.hasMore = action.payload.hasMore
            state.isLoadingHistory = false
            state.isLoadingMessage = false
        },
        appendHistory: (state, action) => {
            const sortedConversation = action.payload.conversation.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.appendHistory = sortedConversation
            state.hasMore = action.payload.hasMore
            state.isLoadingHistory = false
        },
        loadingFailed: (state) => {
            state.isLoadingHistory = false
        },
        sendMessage: (state) => {
            state.isLoadingMessage = true
        },
        cleanRcvBuffer: (state) => {
            state.chatAnswer = ''
        },
        loadMsgSuccessful: (state, action) => {
            state.chatAnswer = action.payload
            state.isLoadingMessage = false
        },
        selectedChatId: (state, action) => {
            state.selectedChatId = action.payload
        },
        loadHistoryConversation : (state) => {
            state.isLoadingHistory = true;
        },
    }
});

const { reducer, actions } = conversationSlice

export const { selectedChatId, 
                appendHistory,
               loadMsgSuccessful, 
               loadSuccessHistory, 
               sendMessage, 
               loadingFailed,
                cleanRcvBuffer,
                loadHistoryConversation } = actions

export default reducer