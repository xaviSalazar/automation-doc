import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversationArr: [],
    isLoadingHistory: false, 
    isLoadingMessage: false,
    isNewConversation: false,
}

const conversationSlice = createSlice({
    name: 'conversation-store',
    initialState,
    reducers: {
        loadingHistory:(state) => {
            state.isLoadingHistory = true
        },
        loadingMessage:(state) => {
            state.isLoadingMessage = true
        },
        loadSuccessHistory: (state, action) => {    
            console.log(action.payload)
            if(action.payload.length === 0) {
                state.isNewConversation = true
            console.log(state.isNewConversation)
            } else {
                state.isNewConversation = false
            }
            state.conversationArr = action.payload
            state.isLoadingHistory = false
            state.isLoadingMessage = false
            // Check if the page is not already in cachePage before adding it
            // if (!state.cachePage.includes(action.payload.page)) {
            //     state.cachePage.push(action.payload.page); // Add the page to the array
            //     state.docsArray = [...state.docsArray, ...action.payload.docs];
            // }
        },
        loadingFailed:(state) => {
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
            console.log(state.conversationArr)
        }
    }
});

const { reducer, actions } = conversationSlice

export const { loadMsgSuccessful,loadingHistory, loadingMessage, loadSuccessHistory, sendMessage, loadingFailed  } = actions

export default reducer